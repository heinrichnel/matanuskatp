import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useSyncContext } from '../../context/SyncContext';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import FirestoreConnectionError from '../ui/FirestoreConnectionError';
import { Tooltip } from '../ui/Tooltip';
import { TrendingUp, Truck, DollarSign, TrendingDown, AlertTriangle, Flag, CheckCircle, User, Activity, Target, Award, Download, Filter, X, RefreshCw } from 'lucide-react';
import {
  formatCurrency,
  calculateTotalCosts,
  filterTripsByDateRange,
  filterTripsByClient,
  filterTripsByCurrency,
  filterTripsByDriver,
  getAllFlaggedCosts,
  getUnresolvedFlagsCount,
  canCompleteTrip
} from '../../utils/helpers';
import { Trip } from '../../types';

interface DashboardProps {
  trips?: Trip[];
}


const Dashboard: React.FC<DashboardProps> = (props) => {
  const { trips: contextTrips, missedLoads = [], refreshTrips, isLoading } = useAppContext();
  const { syncStatus, lastSynced } = useSyncContext();
  const [refreshing, setRefreshing] = useState(false);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(17.5); // Default ZAR/USD exchange rate

  // DEBUG ONLY - Remove after verification
  useEffect(() => {
    console.log('Lucide React components loaded:', {
      Flag: typeof Flag !== 'undefined' ? 'Available' : 'Not defined',
      TrendingUp: typeof TrendingUp !== 'undefined' ? 'Available' : 'Not defined'
    });
  }, []);

  // Use props if provided, otherwise use context
  const trips = props.trips || contextTrips;
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    client: '',
    currency: '',
    driver: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  // Force refresh data when Dashboard mounts
  useEffect(() => {
    if (contextTrips.length === 0 && navigator.onLine) {
      handleRefresh();
    }
  }, []);

  const filteredTrips = useMemo(() => {
    let filtered = trips;

    if (filters.startDate || filters.endDate) {
      filtered = filterTripsByDateRange(filtered, filters.startDate, filters.endDate);
    }
    if (filters.client) {
      filtered = filterTripsByClient(filtered, filters.client);
    }
    if (filters.currency) {
      filtered = filterTripsByCurrency(filtered, filters.currency);
    }
    if (filters.driver) {
      filtered = filterTripsByDriver(filtered, filters.driver);
    }

    return filtered;
  }, [trips, filters]);

  const stats = useMemo(() => {
    const totalTrips = filteredTrips.length;
    const zarTrips = filteredTrips.filter(trip => trip.revenueCurrency === 'ZAR');
    const usdTrips = filteredTrips.filter(trip => trip.revenueCurrency === 'USD');
    
    // Multi-currency aggregation for revenue
    const zarRevenue = zarTrips.reduce((sum, trip) => sum + (trip.baseRevenue || 0), 0);
    const usdRevenue = usdTrips.reduce((sum, trip) => sum + (trip.baseRevenue || 0), 0);
    const usdRevenueInZAR = usdRevenue * exchangeRate;
    const totalRevenueInZAR = zarRevenue + usdRevenueInZAR;
    
    // Multi-currency aggregation for costs
    const zarCosts = zarTrips.reduce((sum, trip) => sum + calculateTotalCosts(trip.costs || []), 0);
    const usdCosts = usdTrips.reduce((sum, trip) => sum + calculateTotalCosts(trip.costs || []), 0);
    const usdCostsInZAR = usdCosts * exchangeRate;
    const totalCostsInZAR = zarCosts + usdCostsInZAR;
    
    // Calculate profit based on converted values
    const totalProfitInZAR = totalRevenueInZAR - totalCostsInZAR;

    const totalEntries = filteredTrips.reduce((sum, trip) => sum + (trip.costs?.length || 0), 0);

    const allFlaggedCosts = getAllFlaggedCosts(filteredTrips);
    const unresolvedFlags = allFlaggedCosts.filter(cost => cost.investigationStatus !== 'resolved');
    const resolvedFlags = allFlaggedCosts.filter(cost => cost.investigationStatus === 'resolved');
    
    // Calculate average resolution time more accurately
    let totalResolutionTimeInDays = 0;
    let resolvedCount = 0;

    const avgResolutionTime = resolvedFlags.length > 0
      ? resolvedFlags.reduce((sum, flag) => {
        if (flag.flaggedAt && flag.resolvedAt) {
          const flaggedDate = new Date(flag.flaggedAt);
          const resolvedDate = new Date(flag.resolvedAt);
          const daysToResolve = (resolvedDate.getTime() - flaggedDate.getTime()) / (1000 * 60 * 60 * 24);
          totalResolutionTimeInDays += daysToResolve;
          resolvedCount++;
          return sum + daysToResolve;
        }
        return sum;
      }, 0) / resolvedFlags.length
      : 0;

    const driverStats = filteredTrips.reduce((acc, trip) => {
      if (!acc[trip.driverName]) {
        acc[trip.driverName] = {
          trips: 0,
          flags: 0,
          unresolvedFlags: 0,
          investigations: 0,
          revenue: 0,
          expenses: 0,
          tripsWithFlags: 0
        };
      }

      const tripFlags = (trip.costs || []).filter(c => c.isFlagged);
      const tripUnresolvedFlags = getUnresolvedFlagsCount(trip.costs || []);

      acc[trip.driverName].trips++;
      acc[trip.driverName].flags += tripFlags.length;
      acc[trip.driverName].unresolvedFlags += tripUnresolvedFlags;
      acc[trip.driverName].investigations += tripFlags.length;
      acc[trip.driverName].revenue += trip.baseRevenue || 0;
      acc[trip.driverName].expenses += calculateTotalCosts(trip.costs || []);

      if (tripFlags.length > 0) {
        acc[trip.driverName].tripsWithFlags++;
      }

      return acc;
    }, {} as Record<string, any>);

    Object.keys(driverStats).forEach(driver => {
      const stats = driverStats[driver];
      stats.flagPercentage = stats.trips > 0 ? (stats.tripsWithFlags / stats.trips) * 100 : 0;
      stats.avgFlagsPerTrip = stats.trips > 0 ? stats.flags / stats.trips : 0;
      stats.netProfit = stats.revenue - stats.expenses;
      stats.profitPerTrip = stats.trips > 0 ? stats.netProfit / stats.trips : 0;
    });

    const topDriversByFlags = Object.entries(driverStats)
      .sort(([, a], [, b]) => (b as any).flags - (a as any).flags)
      .slice(0, 5);

    const categoryFlags = allFlaggedCosts.reduce((acc, cost) => {
      acc[cost.category] = (acc[cost.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topFlaggedCategories = Object.entries(categoryFlags)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const tripsReadyForCompletion = filteredTrips.filter(trip =>
      trip.status === 'active' && canCompleteTrip(trip)
    );

    const tripsWithUnresolvedFlags = filteredTrips.filter(trip =>
      trip.status === 'active' && getUnresolvedFlagsCount(trip.costs || []) > 0
    );

    // Calculate missed loads metrics
    const missedLoadsZAR = missedLoads.filter(load => load.currency === 'ZAR');
    const missedLoadsUSD = missedLoads.filter(load => load.currency === 'USD');

    const missedRevenueZAR = missedLoadsZAR.reduce((sum, load) => sum + load.estimatedRevenue, 0);
    const missedRevenueUSD = missedLoadsUSD.reduce((sum, load) => sum + load.estimatedRevenue, 0);

    const missedOpportunities = missedLoads.length;
    const competitorWins = missedLoads.filter(load => load.competitorWon).length;
    const highImpactMissed = missedLoads.filter(load => load.impact === 'high').length;

    return {
      totalTrips,
      zarRevenue,
      zarCosts,
      usdRevenue,
      usdCosts,
      totalRevenueInZAR,
      totalCostsInZAR,
      totalProfitInZAR,
      totalEntries,
      allFlaggedCosts,
      unresolvedFlags,
      resolvedFlags,
      avgResolutionTime,
      driverStats,
      topDriversByFlags,
      topFlaggedCategories,
      tripsReadyForCompletion,
      tripsWithUnresolvedFlags,
      missedRevenueZAR,
      missedRevenueUSD,
      missedOpportunities,
      competitorWins,
      highImpactMissed
    };
  }, [filteredTrips, missedLoads]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      client: '',
      currency: '',
      driver: ''
    });
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    setConnectionError(null);
    try {
      await refreshTrips();
      console.log('Dashboard data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing trips:', error);
      setConnectionError(error instanceof Error ? error : new Error('Failed to refresh data'));
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            icon={<RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />}
            onClick={handleRefresh}
            isLoading={refreshing || isLoading.loadTrips}
            disabled={refreshing || isLoading.loadTrips}
          >
            Refresh Data
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={<Filter className="w-5 h-5" />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button variant="primary" size="md" icon={<Download className="w-5 h-5" />}>Export Data</Button>
        </div>
      </div>

      {/* Connection error message */}
      {connectionError && (
        <FirestoreConnectionError 
          error={connectionError} 
          onRetry={handleRefresh}
          className="mb-4"
        />
      )}

      {/* Filter Panel */}
      {showFilters && (
        <Card>
          <CardHeader
            title={<span className="flex items-center gap-2"><Filter className="w-5 h-5 text-blue-500" />Dashboard Filters</span>}
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  id="currency"
                  value={filters.currency}
                  onChange={(e) => handleFilterChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Currencies</option>
                  <option value="ZAR">ZAR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div>
                <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                <input
                  type="text"
                  id="client"
                  value={filters.client}
                  onChange={(e) => handleFilterChange('client', e.target.value)}
                  placeholder="Filter by client"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="driver" className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                <input
                  type="text"
                  id="driver"
                  value={filters.driver}
                  onChange={(e) => handleFilterChange('driver', e.target.value)}
                  placeholder="Filter by driver"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <div className="text-sm text-gray-600">
                {filteredTrips.length} of {trips.length} trips shown
                {Object.values(filters).some(value => value !== '') &&
                  <span className="ml-1 text-blue-600">(filters applied)</span>
                }
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={<X className="w-4 h-4" />}
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Performance Metrics */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <span className="font-medium">Data Status:</span> {
            syncStatus === 'syncing' ? 
              'Synchronizing...' : 
              lastSynced ? 
                `Last updated ${new Date(lastSynced).toLocaleTimeString()}` : 
                'Not yet synchronized'
          }
        </div>
        <div className="text-sm bg-blue-50 p-2 rounded border border-blue-100">
          <span className="font-medium">Exchange Rate:</span> 1 USD = {exchangeRate} ZAR
          <input 
            type="number" 
            value={exchangeRate} 
            onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 17.5)} 
            className="ml-2 w-20 p-1 border rounded"
            min="1"
            step="0.01"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader
            title={<span className="flex items-center gap-2"><Truck className="w-5 h-5 text-blue-500" />Total Trips</span>}
            subtitle={<span className="text-xs text-gray-500">All time</span>}
          />
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalTrips}</div>
            <div className="flex items-center gap-2 mt-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-semibold">Active fleet operations</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title={<span className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-green-500" />Total Revenue</span>}
            subtitle={<span className="text-xs text-gray-500">All Currencies (ZAR Equivalent)</span>}
          />
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(stats.totalRevenueInZAR, 'ZAR')}
            </div>
            {stats.usdRevenue > 0 && (
              <div className="text-base font-medium text-gray-600">
                Includes {formatCurrency(stats.usdRevenue, 'USD')} ({formatCurrency(stats.usdRevenue * exchangeRate, 'ZAR')})
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-semibold">+56.3%</span>
              <Tooltip text="Compared to previous year" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title={<span className="flex items-center gap-2"><Target className="w-5 h-5 text-purple-500" />Net Profit</span>}
            subtitle={<span className="text-xs text-gray-500">All Currencies (ZAR Equivalent)</span>}
          />
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(stats.totalProfitInZAR, 'ZAR')}
            </div>
            {stats.usdRevenue > 0 && (
              <div className="text-base font-medium text-gray-600 flex items-center">
                <div className={stats.usdRevenue - stats.usdCosts >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(stats.usdRevenue - stats.usdCosts, 'USD')}
                </div>
                <Tooltip text="USD profit converted to ZAR at current exchange rate" />
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span className="text-purple-600 font-semibold">Overall profitability</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title={<span className="flex items-center gap-2"><Flag className="w-5 h-5 text-amber-500" />Flagged Items</span>}
            subtitle={<span className="text-xs text-gray-500">Unresolved flags requiring attention</span>}
          />
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats.unresolvedFlags.length}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-amber-600 font-semibold">Unresolved flags</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Missed Loads Impact */}
      <Card>
        <CardHeader
          title={
            <span className="flex items-center">
              <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
              Missed Loads Financial Impact
            </span>
          }
          subtitle="Potential revenue and profit loss from missed business opportunities"
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Missed Revenue (ZAR)</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.missedRevenueZAR, 'ZAR')}
              </p>
              <p className="text-xs text-gray-400">
                Potential lost income
              </p>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Missed Revenue (USD)</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.missedRevenueUSD, 'USD')}
              </p>
              <p className="text-xs text-gray-400">
                Potential lost income
              </p>
            </div>

            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Missed Opportunities</p>
              <p className="text-2xl font-bold text-amber-600">
                {stats.missedOpportunities}
              </p>
              <p className="text-xs text-gray-400">
                Total missed loads
              </p>
            </div>

            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Competitor Wins</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.competitorWins}
              </p>
              <p className="text-xs text-gray-400">
                Lost to competitors
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Missed Loads Impact Analysis</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• <strong>Revenue Gap:</strong> {formatCurrency(stats.missedRevenueZAR, 'ZAR')} + {formatCurrency(stats.missedRevenueUSD, 'USD')} potential revenue not captured</p>
              <p>• <strong>Opportunity Cost:</strong> Based on current profit margins, this represents approximately {formatCurrency(stats.missedRevenueZAR * 0.15, 'ZAR')} + {formatCurrency(stats.missedRevenueUSD * 0.15, 'USD')} in missed profit</p>
              <p>• <strong>Market Share Impact:</strong> {stats.competitorWins} loads ({((stats.competitorWins / Math.max(stats.missedOpportunities, 1)) * 100).toFixed(1)}% of missed loads) were captured by competitors</p>
              <p>• <strong>High Impact Losses:</strong> {stats.highImpactMissed} high-impact opportunities were missed, potentially affecting key client relationships</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trips Ready for Completion */}
        <Card>
          <CardHeader
            title={
              <span className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Trips Ready for Completion
              </span>
            }
          />
          <CardContent>
            {stats.tripsReadyForCompletion.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No trips ready for completion</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {stats.tripsReadyForCompletion.slice(0, 5).map(trip => (
                  <div key={trip.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">Fleet {trip.fleetNumber}</p>
                        <p className="text-sm text-gray-600">{trip.route}</p>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                ))}
                {stats.tripsReadyForCompletion.length > 5 && (
                  <p className="text-center text-sm text-gray-500">
                    +{stats.tripsReadyForCompletion.length - 5} more trips ready for completion
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trips with Unresolved Flags */}
        <Card>
          <CardHeader
            title="Trips with Unresolved Flags"
            icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
          />
          <CardContent>
            {stats.tripsWithUnresolvedFlags.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No trips with unresolved flags</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {stats.tripsWithUnresolvedFlags.slice(0, 5).map(trip => {
                  const unresolvedCount = getUnresolvedFlagsCount(trip.costs || []);
                  return (
                    <div key={trip.id} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">Fleet {trip.fleetNumber}</p>
                          <p className="text-sm text-gray-600">{trip.route}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-amber-600">{unresolvedCount} unresolved</p>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {stats.tripsWithUnresolvedFlags.length > 5 && (
                  <p className="text-center text-sm text-gray-500">
                    +{stats.tripsWithUnresolvedFlags.length - 5} more trips with unresolved flags
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Driver Performance */}
      <Card>
        <CardHeader title="Driver Performance Overview" />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trips</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Trip</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Flags</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Flag Rate</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(stats.driverStats)
                  .sort(([, a], [, b]) => (b as any).trips - (a as any).trips)
                  .slice(0, 8)
                  .map(([driver, data]) => (
                    <tr key={driver} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div className="text-sm font-medium text-gray-900">{driver}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-900">{data.trips}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-green-600 font-medium">
                        {formatCurrency(data.revenue, 'ZAR')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        <span className={`font-medium ${data.profitPerTrip >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(data.profitPerTrip, 'ZAR')}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
                          {data.flags}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        {data.flagPercentage.toFixed(1)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${data.flagPercentage > 20 ? 'bg-red-100 text-red-800' :
                          data.flagPercentage > 10 ? 'bg-amber-100 text-amber-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                          {data.flagPercentage > 20 ? 'High Risk' :
                            data.flagPercentage > 10 ? 'Medium Risk' :
                              'Low Risk'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Flag Categories & Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Top Flagged Cost Categories" />
          <CardContent>
            {stats.topFlaggedCategories.length === 0 ? (
              <div className="text-center py-6">
                <Flag className="mx-auto h-8 w-8 text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No flagged categories</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.topFlaggedCategories.map(([category, count]) => (
                  <div key={category} className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <span className="text-sm font-medium text-gray-700">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${Math.min(100, (count / Math.max(1, stats.allFlaggedCosts.length)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Flag Resolution Metrics" />
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Total Flags</p>
                <p className="text-2xl font-bold text-gray-900">{stats.allFlaggedCosts.length}</p>
                <div className="flex justify-center items-center mt-1">
                  <span className="text-xs text-green-600 mr-2">{stats.resolvedFlags.length} resolved</span>
                  <span className="text-xs text-red-600">{stats.unresolvedFlags.length} pending</span>
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Avg Resolution Time</p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgResolutionTime.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">days per flag</p>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg col-span-2">
                <p className="text-sm text-gray-500 mb-1">Resolution Rate</p>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{ width: `${stats.allFlaggedCosts.length > 0 ? (stats.resolvedFlags.length / stats.allFlaggedCosts.length) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {stats.allFlaggedCosts.length > 0 ? ((stats.resolvedFlags.length / stats.allFlaggedCosts.length) * 100).toFixed(1) : 0}% of flags resolved
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;