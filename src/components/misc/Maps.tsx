import React from 'react';
import Card, { CardContent, CardHeader } from '../../components/ui/Card';
import { MapPin, Filter, Layers, Navigation, Truck } from 'lucide-react';
import Button from '../../components/ui/Button';
import { useAppContext } from '../../context/AppContext';
import SyncIndicator from '../../components/ui/SyncIndicator';

const Maps: React.FC = () => {
  const { isLoading } = useAppContext();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maps & Tracking</h1>
          <p className="text-gray-600">Real-time vehicle tracking and route visualization</p>
        </div>
        <div className="flex space-x-2 items-center">
          <SyncIndicator />
          <Button 
            variant="outline"
            icon={<Filter className="w-4 h-4" />}
          >
            Filter View
          </Button>
          <Button 
            variant="outline"
            icon={<Layers className="w-4 h-4" />}
          >
            Map Layers
          </Button>
        </div>
      </div>

      {/* Map Controls Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Button size="sm" variant="outline" icon={<Truck className="w-4 h-4" />}>
              All Vehicles
            </Button>
            <Button size="sm" variant="outline" icon={<MapPin className="w-4 h-4" />}>
              Depots
            </Button>
            <Button size="sm" variant="outline" icon={<Navigation className="w-4 h-4" />}>
              Active Routes
            </Button>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-gray-500">Last updated: Just now</span>
              <Button size="sm" variant="outline" disabled={isLoading?.trips}>
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Map Card */}
      <Card>
        <CardContent className="p-0">
          <div className="w-full h-[600px] bg-gray-100 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map would be displayed here.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Integration with Google Maps, Mapbox, or other mapping services.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Vehicles Card */}
      <Card>
        <CardHeader title="Active Vehicles" />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heading</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">VEH-{2000 + i}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Driver {i}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {['Windhoek Central', 'B1 Highway KM 145', 'Walvis Bay Port', 'Keetmanshoop', 'Ondangwa Town'][i-1]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {['North', 'East', 'South', 'West', 'North-East'][i-1]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {[0, 65, 80, 45, 72][i-1]} km/h
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      TRP-2025{(100 + i).toString().padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
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

export default Maps;
