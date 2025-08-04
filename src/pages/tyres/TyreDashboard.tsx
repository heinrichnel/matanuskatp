import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/consolidated/Card';
import { Button } from '@/components/ui/Button';
import { Tyre } from '@/types/tyre';
import { useFleetList } from '@/hooks/useFleetList';
import TruckTyreDisplay from '@/components/tyres/TruckTyreDisplay';

const TyreDashboard: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedTyre, setSelectedTyre] = useState<Tyre | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { fleetOptions } = useFleetList({ includeDetails: true });

  // Set loading state based on fleetOptions
  useEffect(() => {
    if (fleetOptions.length > 0) {
      setIsLoading(false);
    }
  }, [fleetOptions]);

  const handleVehicleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVehicle(e.target.value);
    setSelectedTyre(null);
  };

  const handleTyreSelect = (tyre: Tyre | null) => {
    setSelectedTyre(tyre);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tyre Management Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium">Select Vehicle</h2>
          </CardHeader>
          <CardContent>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedVehicle}
              onChange={handleVehicleSelect}
              disabled={isLoading}
            >
              <option value="">Select a vehicle</option>
              {fleetOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {isLoading && <p className="mt-2 text-sm text-gray-500">Loading fleet data...</p>}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <h2 className="text-lg font-medium">Tyre Performance Summary</h2>
          </CardHeader>
          <CardContent>
            {selectedVehicle ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-1">Total Tyres</h3>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-1">Good Condition</h3>
                  <p className="text-2xl font-bold">8</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-1">Need Attention</h3>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Select a vehicle to view tyre performance summary</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <TruckTyreDisplay
          selectedVehicle={selectedVehicle}
          onTyreSelect={handleTyreSelect}
          onVehicleSelect={(vehicleId) => setSelectedVehicle(vehicleId)}
        />
      </div>

      {selectedTyre && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Tyre Actions</h2>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">Schedule Inspection</Button>
                <Button variant="outline">Record Rotation</Button>
                <Button variant="outline">Log Repair</Button>
                <Button variant="outline">Replace Tyre</Button>
                <Button variant="outline">View History</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TyreDashboard;
