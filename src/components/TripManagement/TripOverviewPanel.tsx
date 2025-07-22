import React, { useEffect, useState } from 'react';
import { Activity, AlertTriangle, Calendar, MapPin, Truck } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { useAppContext } from '../../context/AppContext';
import SyncIndicator from '../ui/SyncIndicator';

interface TripOverviewStats {
  activeTrips: number;
  completedThisMonth: number;
  delayedTrips: number;
  alertCount: number;
  revenueMonth: number;
  upcomingTrips: number;
}

const TripOverviewPanel: React.FC = () => {
  // Using context to access refresh functionality
  const { refreshTrips } = useAppContext();
  
  // Using useState with initial values
  const [stats] = useState<TripOverviewStats>({
    activeTrips: 24,
    completedThisMonth: 157,
    delayedTrips: 5,
    alertCount: 3,
    revenueMonth: 58247,
    upcomingTrips: 12
  });

  // In a real implementation, this would fetch data from Firestore
  useEffect(() => {
    // This would be replaced with actual Firestore fetching logic:
    // const fetchTripStats = async () => {
    //   try {
    //     const statsData = await firebase.firestore()
    //       .collection('tripStats')
    //       .doc('current')
    //       .get();
    //       
    //     if (statsData.exists) {
    //       setStats(statsData.data() as TripOverviewStats);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching trip stats:', error);
    //   }
    // };
    // 
    // fetchTripStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Dashboard</h1>
          <p className="text-gray-600">Overview of all trip activities and metrics</p>
        </div>
        <div className="flex space-x-2 items-center">
          <SyncIndicator />
          <Button 
            variant="outline"
            onClick={onClick || (() => {})}
            icon={<Activity className="w-4 h-4" />}
          >
            Refresh Data
          </Button>
          <Button 
            variant="outline"
            icon={<Activity className="w-4 h-4" />}
          >
            Export Data
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Trips</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeTrips}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed (This Month)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedThisMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full mr-4">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Delayed Trips</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delayedTrips}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Overview */}
      <Card>
        <CardHeader title="Trip Locations" />
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64 bg-gray-100 rounded-md border border-gray-200">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Map integration would display active trips here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader title="Recent Trip Activity" />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4].map((i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">TRP-2025{i.toString().padStart(3, '0')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Driver {i}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {['Windhoek → Walvis Bay', 'Walvis Bay → Otjiwarongo', 'Swakopmund → Ondangwa', 'Keetmanshoop → Windhoek'][i-1]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${i % 3 === 0 ? 'bg-yellow-100 text-yellow-800' : 
                          i % 3 === 1 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {i % 3 === 0 ? 'Delayed' : i % 3 === 1 ? 'Completed' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {`${i}h ago`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripOverviewPanel;
