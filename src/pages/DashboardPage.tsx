import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';
import { TrendingUp, TrendingDown, Users, Truck, AlertTriangle, DollarSign } from 'lucide-react';

interface DashboardStats {
  totalFleets: number;
  activeTrips: number;
  totalRevenue: number;
  flaggedIssues: number;
  fuelEfficiency: number;
  revenueGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'trip' | 'alert' | 'maintenance' | 'invoice';
  message: string;
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high';
}

const DashboardPage: React.FC = () => {
  const { trips, dieselRecords, driverBehaviorEvents, clients, actionItems, jobCards } = useAppContext();
  const [stats, setStats] = useState<DashboardStats>({
    totalFleets: 0,
    activeTrips: 0,
    totalRevenue: 0,
    flaggedIssues: 0,
    fuelEfficiency: 0,
    revenueGrowth: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    calculateStats();
    generateRecentActivity();
  }, [trips, dieselRecords, driverBehaviorEvents, clients, actionItems, jobCards]);

  const calculateStats = () => {
    // Calculate dashboard statistics
    const uniqueFleets = new Set(trips?.map(trip => trip.fleetNumber) || []);
    const totalFleets = uniqueFleets.size;
    const activeTrips = trips?.filter(trip => trip.status === 'active').length || 0;
    
    // Calculate total revenue from trips
    const totalRevenue = trips?.reduce((sum: number, trip) => sum + (trip.baseRevenue || 0), 0) || 0;
    
    // Count trips with investigations or issues
    const flaggedIssues = trips?.filter(trip => trip.hasInvestigation).length || 0;
    
    // Calculate fuel efficiency (km per liter average)
    const totalKm = dieselRecords?.reduce((sum, record) => sum + (record.kmReading || 0), 0) || 0;
    const totalLitres = dieselRecords?.reduce((sum, record) => sum + (record.litresFilled || 0), 0) || 0;
    const fuelEfficiency = totalLitres > 0 ? totalKm / totalLitres : 0;

    // Mock revenue growth (in real app, this would be calculated from historical data)
    const revenueGrowth = 12.5;

    setStats({
      totalFleets,
      activeTrips,
      totalRevenue,
      flaggedIssues,
      fuelEfficiency,
      revenueGrowth
    });
  };

  const generateRecentActivity = () => {
    const activities: RecentActivity[] = [];
    
    // Add recent trips
    trips?.slice(0, 3).forEach(trip => {
      activities.push({
        id: trip.id,
        type: 'trip',
        message: `Trip ${trip.id.slice(-6)} to ${trip.route} - ${trip.status}`,
        timestamp: new Date(trip.startDate),
        severity: trip.hasInvestigation ? 'high' : 'low'
      });
    });

    // Add recent alerts from trips with investigations
    trips?.filter(trip => trip.hasInvestigation).slice(0, 2).forEach(trip => {
      activities.push({
        id: `alert-${trip.id}`,
        type: 'alert',
        message: `Investigation: ${trip.investigationNotes || 'Issue detected'} - Trip ${trip.id.slice(-6)}`,
        timestamp: new Date(trip.investigationDate || trip.startDate),
        severity: 'high'
      });
    });

    // Add recent action items as activities
    actionItems?.slice(0, 2).forEach(item => {
      activities.push({
        id: item.id,
        type: 'maintenance',
        message: `Action Item: ${item.title} - ${item.status}`,
        timestamp: new Date(item.createdAt),
        severity: item.status === 'initiated' ? 'high' : item.status === 'in_progress' ? 'medium' : 'low'
      });
    });

    // Sort by timestamp and take most recent
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setRecentActivity(activities.slice(0, 8));
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ComponentType<any>;
    trend?: number;
    format?: 'currency' | 'number' | 'percentage';
  }> = ({ title, value, icon: Icon, trend, format = 'number' }) => {
    const formatValue = (val: string | number) => {
      if (typeof val === 'string') return val;
      
      switch (format) {
        case 'currency':
          return `R${val.toLocaleString()}`;
        case 'percentage':
          return `${val.toFixed(1)}%`;
        default:
          return val.toLocaleString();
      }
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
                  {Math.abs(trend)}% from last month
                </p>
              )}
            </div>
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  };

  const ActivityItem: React.FC<{ activity: RecentActivity }> = ({ activity }) => {
    const getIcon = () => {
      switch (activity.type) {
        case 'trip': return <Truck className="w-4 h-4" />;
        case 'alert': return <AlertTriangle className="w-4 h-4" />;
        case 'invoice': return <DollarSign className="w-4 h-4" />;
        default: return <Users className="w-4 h-4" />;
      }
    };

    const getSeverityColor = () => {
      switch (activity.severity) {
        case 'high': return 'text-red-600';
        case 'medium': return 'text-yellow-600';
        default: return 'text-green-600';
      }
    };

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
        <div className={`${getSeverityColor()} mt-1`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
          <p className="text-xs text-gray-500">
            {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your fleet management operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Fleets"
          value={stats.totalFleets}
          icon={Truck}
          trend={5}
        />
        <StatCard
          title="Active Trips"
          value={stats.activeTrips}
          icon={Users}
        />
        <StatCard
          title="Monthly Revenue"
          value={stats.totalRevenue}
          icon={DollarSign}
          trend={stats.revenueGrowth}
          format="currency"
        />
        <StatCard
          title="Flagged Issues"
          value={stats.flaggedIssues}
          icon={AlertTriangle}
          trend={-8}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Fuel Efficiency" />
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {stats.fuelEfficiency.toFixed(2)} km/L
              </p>
              <p className="text-sm text-gray-600 mt-2">Fleet Average</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Quick Actions" />
          <CardContent className="p-6">
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50" onClick={onClick || (() => {})}}>
                <div className="font-medium">Create New Trip</div>
                <div className="text-sm text-gray-600">Start a new trip assignment</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50" onClick={onClick || (() => {})}}>
                <div className="font-medium">Fleet Inspection</div>
                <div className="text-sm text-gray-600">Schedule vehicle inspection</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader title="Recent Activity" />
        <CardContent className="p-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-1">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity to display</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
