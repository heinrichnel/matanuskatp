import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Card, CardHeader, CardContent } from '../ui/card';
import Button from '../ui/Button';
import { Calendar, BarChart3, TrendingUp, Truck, AlertTriangle, DollarSign, Clock } from 'lucide-react';

const TripDashboard: React.FC = () => {
  const { trips } = useAppContext();
  const [activeTrips, setActiveTrips] = useState(0);
  const [completedTrips, setCompletedTrips] = useState(0);
  const [invoicedTrips, setInvoicedTrips] = useState(0);
  const [flaggedItems, setFlaggedItems] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageProfit, setAverageProfit] = useState(0);

  useEffect(() => {
    if (trips && trips.length > 0) {
      // Count trips by status
      const active = trips.filter(trip => trip.status === 'active').length;
      const completed = trips.filter(trip => trip.status === 'completed').length;
      const invoiced = trips.filter(trip => trip.status === 'invoiced').length;

      // Count flagged items
      const flagged = trips.reduce((count, trip) => {
        return count + (trip.costs?.filter(cost => cost.isFlagged)?.length || 0);
      }, 0);

      // Calculate revenue and profit
      const revenue = trips.reduce((sum, trip) => sum + (trip.baseRevenue || 0), 0);

      // Calculate profit (simplified)
      const totalProfit = trips.reduce((sum, trip) => {
        const tripCosts = trip.costs?.reduce((costSum, cost) => costSum + cost.amount, 0) || 0;
        return sum + ((trip.baseRevenue || 0) - tripCosts);
      }, 0);

      const avgProfit = trips.length > 0 ? totalProfit / trips.length : 0;

      // Update state
      setActiveTrips(active);
      setCompletedTrips(completed);
      setInvoicedTrips(invoiced);
      setFlaggedItems(flagged);
      setTotalRevenue(revenue);
      setAverageProfit(avgProfit);
    }
  }, [trips]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Trip Dashboard</h1>

        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>This Month</span>
          </Button>

          <Button variant="outline" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Trips</p>
                <p className="text-3xl font-bold text-blue-600">{activeTrips}</p>
              </div>
              <Truck className="h-10 w-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Trips</p>
                <p className="text-3xl font-bold text-green-600">{completedTrips}</p>
              </div>
              <Clock className="h-10 w-10 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Invoiced Trips</p>
                <p className="text-3xl font-bold text-purple-600">{invoicedTrips}</p>
              </div>
              <DollarSign className="h-10 w-10 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Flagged Items</p>
                <p className="text-3xl font-bold text-amber-600">{flaggedItems}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-amber-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <Card>
        <CardHeader title="Financial Overview" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Total Revenue</span>
                    <span className="text-sm text-gray-600">${totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Average Profit</span>
                    <span className="text-sm text-gray-600">${averageProfit.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${(averageProfit / (totalRevenue / trips.length || 1)) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Status Distribution</h3>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-100 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{activeTrips}</div>
                  <div className="text-sm text-gray-600">Active</div>
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{completedTrips}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="flex-1 bg-gray-100 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">{invoicedTrips}</div>
                  <div className="text-sm text-gray-600">Invoiced</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader title="Recent Activity" />
        <CardContent>
          <div className="space-y-4">
            {trips.slice(0, 5).map((trip, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  trip.status === 'active' ? 'bg-blue-100 text-blue-600' :
                  trip.status === 'completed' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  {trip.status === 'active' ? <Truck className="h-5 w-5" /> :
                   trip.status === 'completed' ? <Clock className="h-5 w-5" /> :
                   <DollarSign className="h-5 w-5" />}
                </div>
                <div>
                  <div className="font-medium">{trip.fleetNumber} - {trip.route}</div>
                  <div className="text-sm text-gray-600">Driver: {trip.driverName}</div>
                  <div className="text-sm text-gray-600">Client: {trip.clientName}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-sm font-medium">${trip.baseRevenue?.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">{trip.startDate} to {trip.endDate}</div>
                </div>
              </div>
            ))}

            {trips.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No trip data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripDashboard;
