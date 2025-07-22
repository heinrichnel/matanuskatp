import React from 'react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { TrendingUp, Calendar, Truck } from 'lucide-react';
import Button from '../ui/Button';
import { useAppContext } from '../../context/AppContext';
import SyncIndicator from '../ui/SyncIndicator';

const FleetUtilizationHeatmap: React.FC = () => {
  const { isLoading } = useAppContext();

  // Mock data - in a real implementation, this would be fetched from Firestore
  const fleetUtilizationData = {
    overallUtilization: '72%',
    idleTime: '18%',
    averageTripsPerVehicle: 3.6,
    vehiclesUnderPerforming: 5
  };

  const mockVehicles = [
    { id: 'V001', name: 'Scania R500', utilization: 92, trips: 17, status: 'active' },
    { id: 'V002', name: 'Mercedes Actros', utilization: 87, trips: 15, status: 'active' },
    { id: 'V003', name: 'Volvo FH16', utilization: 65, trips: 10, status: 'active' },
    { id: 'V004', name: 'MAN TGX', utilization: 45, trips: 7, status: 'maintenance' },
    { id: 'V005', name: 'Scania G410', utilization: 79, trips: 13, status: 'active' },
    { id: 'V006', name: 'Volvo FM', utilization: 32, trips: 5, status: 'idle' },
    { id: 'V007', name: 'Mercedes Arocs', utilization: 91, trips: 16, status: 'active' },
    { id: 'V008', name: 'MAN TGA', utilization: 28, trips: 4, status: 'idle' }
  ];

  // Utility function to determine utilization color class
  const getUtilizationColorClass = (utilization: number): string => {
    if (utilization >= 80) return 'bg-green-500';
    if (utilization >= 60) return 'bg-blue-500';
    if (utilization >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Utilization</h1>
          <p className="text-gray-600">Track and optimize your fleet's performance and idle time</p>
        </div>
        <div className="flex space-x-2 items-center">
          <SyncIndicator />
          <Button 
            variant="outline"
            icon={<Calendar className="w-4 h-4" />}
          >
            Change Date Range
          </Button>
          <Button 
            icon={<TrendingUp className="w-4 h-4" />}
            disabled={isLoading?.trips}
          >
            Optimization Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{fleetUtilizationData.overallUtilization}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full mr-4">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Idle Time</p>
                <p className="text-2xl font-bold text-gray-900">{fleetUtilizationData.idleTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Trips/Vehicle</p>
                <p className="text-2xl font-bold text-gray-900">{fleetUtilizationData.averageTripsPerVehicle}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full mr-4">
                <TrendingUp className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Underperforming Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">{fleetUtilizationData.vehiclesUnderPerforming}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fleet Utilization Heatmap */}
      <Card>
        <CardHeader title="Fleet Utilization Heatmap" />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {mockVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center border rounded-md p-3">
                <div className="w-24 flex-shrink-0">
                  <p className="font-medium text-gray-800">{vehicle.id}</p>
                </div>
                <div className="flex-1 ml-4">
                  <p className="text-sm text-gray-700">{vehicle.name}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className={`h-2.5 rounded-full ${getUtilizationColorClass(vehicle.utilization)}`} 
                      style={{ width: `${vehicle.utilization}%` }}>
                    </div>
                  </div>
                </div>
                <div className="w-24 flex-shrink-0 text-right">
                  <p className="font-medium text-gray-800">{vehicle.utilization}%</p>
                </div>
                <div className="w-24 flex-shrink-0 text-right">
                  <p className="font-medium text-gray-800">{vehicle.trips} trips</p>
                </div>
                <div className="w-32 flex-shrink-0 text-right">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${vehicle.status === 'active' ? 'bg-green-100 text-green-800' : 
                      vehicle.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Utilization Trend */}
      <Card>
        <CardHeader title="Monthly Utilization Trend" />
        <CardContent className="p-6">
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500 italic">
              Chart would show monthly utilization trends here.
              Integration with Chart.js or other visualization library would be implemented.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FleetUtilizationHeatmap;
