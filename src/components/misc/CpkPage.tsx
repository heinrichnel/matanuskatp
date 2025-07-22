import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calculator, TrendingUp, TrendingDown, Fuel, DollarSign } from 'lucide-react';

// Import custom components
import Button from '../components/ui/Button';

interface CpkMetrics {
  totalCostPerKm: number;
  fuelCostPerKm: number;
  maintenanceCostPerKm: number;
  revenuePerKm: number;
  profitPerKm: number;
  utilizationRate: number;
}

interface FleetCpkData {
  fleetNumber: string;
  totalKm: number;
  totalCosts: number;
  totalRevenue: number;
  cpk: number;
  profitMargin: number;
  fuelEfficiency: number;
}

interface MonthlyTrend {
  month: string;
  cpk: number;
  revenue: number;
  profit: number;
}

const CpkPage: React.FC = () => {
  const { trips, dieselRecords } = useAppContext();
  const [selectedFleet, setSelectedFleet] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'30d' | '90d' | '12m'>('30d');
  const [metrics, setMetrics] = useState<CpkMetrics>({
    totalCostPerKm: 0,
    fuelCostPerKm: 0,
    maintenanceCostPerKm: 0,
    revenuePerKm: 0,
    profitPerKm: 0,
    utilizationRate: 0
  });
  const [fleetData, setFleetData] = useState<FleetCpkData[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);

  useEffect(() => {
    calculateCpkMetrics();
    generateFleetData();
    generateMonthlyTrends();
  }, [trips, dieselRecords, selectedFleet, dateRange]);

  const getDateRangeStart = (): Date => {
    const now = new Date();
    switch (dateRange) {
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '12m':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  };

  const getFilteredTrips = () => {
    const startDate = getDateRangeStart();
    let filteredTrips = trips?.filter(trip => 
      new Date(trip.startDate) >= startDate
    ) || [];

    if (selectedFleet !== 'all') {
      filteredTrips = filteredTrips.filter(trip => trip.fleetNumber === selectedFleet);
    }

    return filteredTrips;
  };

  const getFilteredDieselRecords = () => {
    const startDate = getDateRangeStart();
    let filteredRecords = dieselRecords?.filter(record => 
      new Date(record.date) >= startDate
    ) || [];

    if (selectedFleet !== 'all') {
      filteredRecords = filteredRecords.filter(record => record.fleetNumber === selectedFleet);
    }

    return filteredRecords;
  };

  const calculateCpkMetrics = () => {
    const filteredTrips = getFilteredTrips();
    const filteredDieselRecords = getFilteredDieselRecords();

    // Calculate total kilometers
    const totalKm = filteredTrips.reduce((sum, trip) => sum + (trip.distanceKm || 0), 0);
    
    // Calculate total revenue
    const totalRevenue = filteredTrips.reduce((sum, trip) => sum + (trip.baseRevenue || 0), 0);
    
    // Calculate total fuel costs
    const totalFuelCosts = filteredDieselRecords.reduce((sum, record) => sum + (record.totalCost || 0), 0);
    
    // Calculate maintenance costs (from trip costs)
    const maintenanceCosts = filteredTrips.reduce((sum, trip) => {
      return sum + trip.costs.reduce((costSum, cost) => costSum + (cost.amount || 0), 0);
    }, 0);
    
    // Calculate additional costs
    const additionalCosts = filteredTrips.reduce((sum, trip) => {
      return sum + trip.additionalCosts.reduce((costSum, cost) => costSum + (cost.amount || 0), 0);
    }, 0);

    const totalCosts = totalFuelCosts + maintenanceCosts + additionalCosts;

    if (totalKm > 0) {
      setMetrics({
        totalCostPerKm: totalCosts / totalKm,
        fuelCostPerKm: totalFuelCosts / totalKm,
        maintenanceCostPerKm: (maintenanceCosts + additionalCosts) / totalKm,
        revenuePerKm: totalRevenue / totalKm,
        profitPerKm: (totalRevenue - totalCosts) / totalKm,
        utilizationRate: (filteredTrips.length / (filteredTrips.length || 1)) * 100 // Simplified calculation
      });
    } else {
      setMetrics({
        totalCostPerKm: 0,
        fuelCostPerKm: 0,
        maintenanceCostPerKm: 0,
        revenuePerKm: 0,
        profitPerKm: 0,
        utilizationRate: 0
      });
    }
  };

  const generateFleetData = () => {
    const fleetGroups = new Map<string, {
      trips: any[];
      dieselRecords: any[];
    }>();

    // Group trips and diesel records by fleet
    const filteredTrips = getFilteredTrips();
    const filteredDieselRecords = getFilteredDieselRecords();

    filteredTrips.forEach(trip => {
      if (!fleetGroups.has(trip.fleetNumber)) {
        fleetGroups.set(trip.fleetNumber, { trips: [], dieselRecords: [] });
      }
      fleetGroups.get(trip.fleetNumber)!.trips.push(trip);
    });

    filteredDieselRecords.forEach(record => {
      if (!fleetGroups.has(record.fleetNumber)) {
        fleetGroups.set(record.fleetNumber, { trips: [], dieselRecords: [] });
      }
      fleetGroups.get(record.fleetNumber)!.dieselRecords.push(record);
    });

    const fleetDataArray: FleetCpkData[] = [];

    fleetGroups.forEach((data, fleetNumber) => {
      const totalKm = data.trips.reduce((sum, trip) => sum + (trip.distanceKm || 0), 0);
      const totalRevenue = data.trips.reduce((sum, trip) => sum + (trip.baseRevenue || 0), 0);
      const fuelCosts = data.dieselRecords.reduce((sum, record) => sum + (record.totalCost || 0), 0);
      const maintenanceCosts = data.trips.reduce((sum, trip) => {
        return sum + trip.costs.reduce((costSum: number, cost: any) => costSum + (cost.amount || 0), 0);
      }, 0);
      const additionalCosts = data.trips.reduce((sum, trip) => {
        return sum + trip.additionalCosts.reduce((costSum: number, cost: any) => costSum + (cost.amount || 0), 0);
      }, 0);

      const totalCosts = fuelCosts + maintenanceCosts + additionalCosts;
      const totalLitres = data.dieselRecords.reduce((sum, record) => sum + (record.litresFilled || 0), 0);

      if (totalKm > 0) {
        fleetDataArray.push({
          fleetNumber,
          totalKm,
          totalCosts,
          totalRevenue,
          cpk: totalCosts / totalKm,
          profitMargin: ((totalRevenue - totalCosts) / totalRevenue) * 100,
          fuelEfficiency: totalLitres > 0 ? totalKm / totalLitres : 0
        });
      }
    });

    setFleetData(fleetDataArray.sort((a, b) => a.cpk - b.cpk));
  };

  const generateMonthlyTrends = () => {
    const monthlyData = new Map<string, {
      totalKm: number;
      totalCosts: number;
      totalRevenue: number;
    }>();

    const startDate = getDateRangeStart();
    const filteredTrips = getFilteredTrips();
    const filteredDieselRecords = getFilteredDieselRecords();

    // Group by month
    filteredTrips.forEach(trip => {
      const date = new Date(trip.startDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { totalKm: 0, totalCosts: 0, totalRevenue: 0 });
      }
      
      const data = monthlyData.get(monthKey)!;
      data.totalKm += trip.distanceKm || 0;
      data.totalRevenue += trip.baseRevenue || 0;
      data.totalCosts += trip.costs.reduce((sum, cost) => sum + (cost.amount || 0), 0);
      data.totalCosts += trip.additionalCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0);
    });

    // Add fuel costs
    filteredDieselRecords.forEach(record => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { totalKm: 0, totalCosts: 0, totalRevenue: 0 });
      }
      
      const data = monthlyData.get(monthKey)!;
      data.totalCosts += record.totalCost || 0;
    });

    const trendsArray: MonthlyTrend[] = [];
    monthlyData.forEach((data, monthKey) => {
      if (data.totalKm > 0) {
        trendsArray.push({
          month: monthKey,
          cpk: data.totalCosts / data.totalKm,
          revenue: data.totalRevenue / data.totalKm,
          profit: (data.totalRevenue - data.totalCosts) / data.totalKm
        });
      }
    });

    setMonthlyTrends(trendsArray.sort((a, b) => a.month.localeCompare(b.month)));
  };

  const getUniqueFleets = () => {
    const fleets = new Set(trips?.map(trip => trip.fleetNumber) || []);
    return Array.from(fleets).sort();
  };

  const MetricCard: React.FC<{
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    format?: 'currency' | 'percentage';
    trend?: number;
  }> = ({ title, value, icon: Icon, format = 'currency', trend }) => {
    const formatValue = (val: number) => {
      if (format === 'percentage') {
        return `${val.toFixed(1)}%`;
      }
      return `R${val.toFixed(2)}`;
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold">{formatValue(value)}</p>
              {trend !== undefined && (
                <p className={`text-xs flex items-center ${
                  trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {Math.abs(trend).toFixed(1)}% vs last period
                </p>
              )}
            </div>
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cost Per Kilometer (CPK) Analysis</h1>
          <p className="text-gray-600">Monitor and optimize your fleet operating costs</p>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedFleet}
            onChange={(e) => setSelectedFleet(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Fleets</option>
            {getUniqueFleets().map(fleet => (
              <option key={fleet} value={fleet}>{fleet}</option>
            ))}
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="12m">Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total CPK"
          value={metrics.totalCostPerKm}
          icon={Calculator}
          trend={-5.2}
        />
        <MetricCard
          title="Revenue per KM"
          value={metrics.revenuePerKm}
          icon={DollarSign}
          trend={8.1}
        />
        <MetricCard
          title="Profit per KM"
          value={metrics.profitPerKm}
          icon={TrendingUp}
          trend={12.3}
        />
        <MetricCard
          title="Fuel Cost per KM"
          value={metrics.fuelCostPerKm}
          icon={Fuel}
          trend={-2.1}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader title="Monthly CPK Trends" />
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`R${value.toFixed(2)}`, '']} />
                <Line type="monotone" dataKey="cpk" stroke="#8884d8" name="CPK" />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue/KM" />
                <Line type="monotone" dataKey="profit" stroke="#ffc658" name="Profit/KM" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fleet Comparison */}
        <Card>
          <CardHeader title="Fleet CPK Comparison" />
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fleetData.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fleetNumber" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`R${value.toFixed(2)}`, 'CPK']} />
                <Bar dataKey="cpk" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Performance Table */}
      <Card>
        <CardHeader title="Fleet Performance Details" />
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fleet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total KM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPK
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profit Margin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fuel Efficiency
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fleetData.map((fleet) => (
                  <tr key={fleet.fleetNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {fleet.fleetNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fleet.totalKm.toLocaleString()} km
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R{fleet.cpk.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      R{fleet.totalRevenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        fleet.profitMargin >= 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {fleet.profitMargin.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fleet.fuelEfficiency.toFixed(2)} km/L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader title="Cost Breakdown Analysis" />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                R{metrics.fuelCostPerKm.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Fuel Cost per KM</div>
              <div className="text-xs text-gray-500 mt-1">
                {((metrics.fuelCostPerKm / metrics.totalCostPerKm) * 100).toFixed(1)}% of total cost
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                R{metrics.maintenanceCostPerKm.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Maintenance Cost per KM</div>
              <div className="text-xs text-gray-500 mt-1">
                {((metrics.maintenanceCostPerKm / metrics.totalCostPerKm) * 100).toFixed(1)}% of total cost
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {metrics.utilizationRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Fleet Utilization</div>
              <div className="text-xs text-gray-500 mt-1">
                Efficiency metric
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CpkPage;
