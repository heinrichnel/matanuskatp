import React, { useState, useEffect } from 'react';
import EnhancedMapComponent from '../../maps/EnhancedMapComponent';
import { Location } from '../../types/mapTypes';
import { useFleetList } from '../../../hooks/useFleetList';

interface FleetOption {
  value: string;
  label: string;
  registration: string;
}

/**
 * FleetLocationMapPage - A page that displays fleet locations on an enhanced map
 * with route drawing and location details
 */
const FleetLocationMapPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Location[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [showRoutes, setShowRoutes] = useState<boolean>(false);
  const { fleetOptions } = useFleetList() as { fleetOptions: FleetOption[] };
  
  // This would be replaced with real data from your fleet tracking system
  useEffect(() => {
    // Simulated vehicle location data - in a real app this would come from Firebase/Wialon
    const mockVehicleLocations: Location[] = [
      { 
        lat: -25.7479, 
        lng: 28.2293, 
        title: "Truck 21H", 
        info: "Driver: John Doe", 
        iconType: "vehicle",
        address: "Pretoria, South Africa",
        customFields: {
          "Registration": "ABC123GP",
          "Speed": "65 km/h",
          "Status": "En Route"
        }
      },
      { 
        lat: -26.0353, 
        lng: 28.0199, 
        title: "Truck 22H", 
        info: "Driver: Jane Smith", 
        iconType: "vehicle",
        address: "Kempton Park, South Africa",
        customFields: {
          "Registration": "XYZ789GP",
          "Speed": "0 km/h",
          "Status": "Parked"
        }
      },
      { 
        lat: -26.2041, 
        lng: 28.0473, 
        title: "Truck 23H", 
        info: "Driver: Mike Brown", 
        iconType: "vehicle",
        address: "Johannesburg, South Africa",
        customFields: {
          "Registration": "DEF456GP",
          "Speed": "45 km/h",
          "Status": "En Route"
        }
      }
    ];
    
    setVehicles(mockVehicleLocations);
  }, []);
  
  // Filter vehicles if a specific one is selected
  const displayedVehicles = selectedVehicle 
    ? vehicles.filter((v: Location) => v.title?.includes(selectedVehicle))
    : vehicles;
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Fleet Location Map</h1>
        
        {/* Controls */}
        <div className="mb-4 flex flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Select Vehicle:</label>
            <select
              value={selectedVehicle || ''}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedVehicle(e.target.value || null)}
              className="border rounded px-2 py-1"
            >
              <option value="">All Vehicles</option>
              {fleetOptions.map((fleet) => (
                <option key={fleet.value} value={fleet.value}>
                  {fleet.value} - {fleet.registration}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="show-routes"
              checked={showRoutes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowRoutes(e.target.checked)}
              className="rounded text-blue-500"
            />
            <label htmlFor="show-routes" className="text-sm font-medium">
              Show Routes
            </label>
          </div>
        </div>
        
        {/* Map component */}
        <EnhancedMapComponent
          locations={displayedVehicles}
          height="600px"
          showPlacesSearch={true}
          showRoutes={showRoutes}
          routeOptions={{
            strokeColor: '#3B82F6',
            mode: 'driving',
            optimizeWaypoints: true
          }}
          defaultIconType="vehicle"
          onLocationSelect={(location: Location) => {
            console.log("Selected vehicle:", location);
          }}
        />
        
        <div className="mt-6 text-sm text-gray-500">
          <p>This map shows the current location of fleet vehicles. Select a vehicle from the dropdown to focus on it.</p>
          <p>Enable "Show Routes" to visualize the path between multiple vehicles.</p>
        </div>
      </div>
    </div>
  );
};

export default FleetLocationMapPage;
