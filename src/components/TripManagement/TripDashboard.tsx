import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { getTripsByStatus, analyzeTripData } from '../../utils/tripDebugger';
import { formatCurrency } from '../../utils/helpers';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { BarChart, PieChart, TrendingUp, Truck, Calendar, AlertTriangle, Globe } from 'lucide-react';

const TripDashboard: React.FC = () => {
  const { trips } = useAppContext();
  
  // Get real trip data
  const activeTrips = getTripsByStatus(trips, 'active');
  const completedTrips = getTripsByStatus(trips, 'completed');
  const analysis = analyzeTripData(trips);
  
  // Calculate real metrics
  const totalRevenue = trips.reduce((sum, trip) => sum + (trip.baseRevenue || 0), 0);
  const webImportedTrips = trips.filter(trip => 
    trip.importSource === 'web_book' || 
    trip.bookingSource === 'web' || 
    trip.loadRef
  );
  
  // Get recent trips (last 10)
  const recentTrips = trips
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || '').getTime() - new Date(a.updatedAt || a.createdAt || '').getTime())
    .slice(0, 10);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Dashboard</h1>
          <p className="text-gray-600">Overview of all trip activities and metrics</p>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Export Data
          </button>
        </div>
      </div>

      {/* KPI Cards with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Trips</p>
                <p className="text-2xl font-bold text-gray-900">{activeTrips.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Completed Trips</p>
                <p className="text-2xl font-bold text-gray-900">{completedTrips.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Web-Imported Trips</p>
                <p className="text-2xl font-bold text-gray-900">{webImportedTrips.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue, 'USD')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Trip Volume by Status" />
          <CardContent>
            <div className="flex justify-center items-center h-64">
              <PieChart className="h-32 w-32 text-gray-300" />
              <div className="ml-6 space-y-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm">Active (24)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm">Completed (157)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm">Delayed (5)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-sm">Cancelled (2)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Monthly Trip Trends" />
          <CardContent>
            <div className="flex justify-center items-center h-64">
              <BarChart className="h-32 w-32 text-gray-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Trips Overview */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">Recent Trip Activity</h3>
          <p className="text-sm text-gray-600">Latest manually entered trips in the system</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTrips.length > 0 ? recentTrips.map((trip, index) => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {trip.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        trip.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                        trip.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        trip.status === 'invoiced' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {trip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.driverName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trip.startDate}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No manual trips found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripDashboard;
