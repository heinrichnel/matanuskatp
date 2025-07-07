import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { VehicleSelector } from '@/components/common/VehicleSelector';
import { CircleDot, Wrench, Eye } from "lucide-react";
import { 
  getTyresByVehicle, 
  getTyreByPosition, 
  getTyreStatusColor, 
  getTyreConditionColor,
  getVehicleTyreConfiguration,
  Tyre 
} from "@/data/tyreData";
import { FLEET_VEHICLES } from "@/data/vehicles";

interface VehicleTyreViewProps {
  selectedVehicle: string;
  onVehicleSelect: (vehicleId: string) => void;
}

export const VehicleTyreView: React.FC<VehicleTyreViewProps> = ({
  selectedVehicle,
  onVehicleSelect
}) => {
  const [selectedTyre, setSelectedTyre] = useState<Tyre | null>(null);
  
  const vehicle = FLEET_VEHICLES.find(v => v.fleetNo === selectedVehicle);
  const vehicleTyres = selectedVehicle ? getTyresByVehicle(selectedVehicle) : [];
  const tyreConfig = selectedVehicle ? getVehicleTyreConfiguration(selectedVehicle) : null;

  const getTyreAtPosition = (position: string) => {
    return getTyreByPosition(selectedVehicle, position);
  };

  const getPositionStatusColor = (position: string) => {
    const tyre = getTyreAtPosition(position);
    if (!tyre) return 'bg-gray-300';
    
    switch (tyre.condition.status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      case 'needs_replacement': return 'bg-red-700';
      default: return 'bg-gray-400';
    }
  };

  const getVehicleTypeLabel = (type: string) => {
    switch (type) {
      case 'horse': return 'Horse (Truck Tractor)';
      case 'interlink': return 'Interlink';
      case 'reefer': return 'Reefer';
      case 'lmv': return 'LMV';
      case 'special': return 'Special Configuration';
      default: return 'Unknown Type';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <VehicleSelector
            value={selectedVehicle}
            onChange={onVehicleSelect}
            label="Select Vehicle for Tyre View"
            placeholder="Choose a vehicle to view tyre details..."
            activeOnly={false}
            showDetails={true}
          />
        </div>
      </div>

      {selectedVehicle && vehicle && tyreConfig && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visual Vehicle Diagram */}
          <Card>
            <CardHeader title="Vehicle Details">
              <CardTitle>
                Vehicle Tyre Layout - {vehicle.fleetNo}
                <div className="text-sm text-gray-600 font-normal">
                  {getVehicleTypeLabel(tyreConfig.vehicleType)} ({tyreConfig.positions.length} positions)
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-100 rounded-lg p-8 min-h-96">
                {/* Vehicle Outline */}
                <div className="absolute inset-4 border-2 border-gray-400 rounded-lg bg-white">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                    {vehicle.manufacturer} {vehicle.model}
                  </div>
                  
                  {/* Tyre Positions */}
                  {tyreConfig.positions.map(position => {
                    const tyre = getTyreAtPosition(position.position);
                    return (
                      <div
                        key={position.position}
                        className={`absolute w-8 h-12 rounded cursor-pointer border-2 transition-all hover:scale-110 ${
                          position.isSpare 
                            ? 'border-purple-600 bg-purple-200' 
                            : 'border-gray-600'
                        } ${getPositionStatusColor(position.position)}`}
                        style={{
                          left: `${position.coordinates.x}%`,
                          top: `${position.coordinates.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onClick={() => tyre && setSelectedTyre(tyre)}
                        title={`${position.displayName}${tyre ? ` - ${tyre.brand} ${tyre.model}` : ' - No tyre data'}`}
                      >
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                          {position.position}
                        </div>
                        {position.isSpare && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs text-purple-600 font-bold">
                            S
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 right-4 space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Good</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span>Warning</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Critical</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-200 border border-purple-600 rounded"></div>
                    <span>Spare</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <span>No Data</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tyre Details Panel */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedTyre ? `Tyre Details - ${selectedTyre.installation.position}` : 'Tyre Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTyre ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedTyre.brand} {selectedTyre.model}</h3>
                      <p className="text-gray-600">{selectedTyre.pattern} Pattern</p>
                    </div>
                    <Badge className={getTyreConditionColor(selectedTyre.condition.status)}>
                      {selectedTyre.condition.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Specifications</h4>
                      <div className="space-y-1">
                        <p><span className="text-gray-500">Size:</span> {selectedTyre.size.width}/{selectedTyre.size.aspectRatio}R{selectedTyre.size.rimDiameter}</p>
                        <p><span className="text-gray-500">Load Index:</span> {selectedTyre.loadIndex}</p>
                        <p><span className="text-gray-500">Speed Rating:</span> {selectedTyre.speedRating}</p>
                        <p><span className="text-gray-500">Type:</span> {selectedTyre.type}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Current Condition</h4>
                      <div className="space-y-1">
                        <p><span className="text-gray-500">Tread Depth:</span> {selectedTyre.condition.treadDepth}mm</p>
                        <p><span className="text-gray-500">Pressure:</span> {selectedTyre.condition.pressure} PSI</p>
                        <p><span className="text-gray-500">Temperature:</span> {selectedTyre.condition.temperature}°C</p>
                        <p><span className="text-gray-500">Last Inspection:</span> {selectedTyre.condition.lastInspectionDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Installation Details</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="text-gray-500">Installed:</span> {selectedTyre.installation.installationDate}</p>
                      <p><span className="text-gray-500">Mileage at Install:</span> {selectedTyre.installation.mileageAtInstallation.toLocaleString()} km</p>
                      <p><span className="text-gray-500">Miles Run:</span> {selectedTyre.milesRun.toLocaleString()}</p>
                      <p><span className="text-gray-500">Serial Number:</span> {selectedTyre.serialNumber}</p>
                      <p><span className="text-gray-500">DOT Code:</span> {selectedTyre.dotCode}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Purchase Information</h4>
                    <div className="text-sm space-y-1">
                      <p><span className="text-gray-500">Cost:</span> R{selectedTyre.purchaseDetails.cost.toLocaleString()}</p>
                      <p><span className="text-gray-500">Supplier:</span> {selectedTyre.purchaseDetails.supplier}</p>
                      <p><span className="text-gray-500">Purchase Date:</span> {selectedTyre.purchaseDetails.date}</p>
                      <p><span className="text-gray-500">Warranty:</span> {selectedTyre.purchaseDetails.warranty}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      Inspect
                    </Button>
                    <Button size="sm" variant="outline">
                      <Wrench className="w-4 h-4 mr-1" />
                      Service
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <CircleDot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Click on a tyre position above to view details</p>
                  {tyreConfig && (
                    <div className="mt-4 text-sm">
                      <p><strong>{getVehicleTypeLabel(tyreConfig.vehicleType)}</strong></p>
                      <p>{tyreConfig.positions.length} tyre positions</p>
                      <p>{tyreConfig.positions.filter(p => p.isSpare).length} spare tyre(s)</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {selectedVehicle && tyreConfig && (
        <Card>
          <CardHeader>
            <CardTitle>All Tyres for {vehicle?.fleetNo}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicleTyres.map(tyre => (
                <div key={tyre.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" 
                     onClick={() => setSelectedTyre(tyre)}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{tyre.brand} {tyre.model}</h4>
                      <p className="text-sm text-gray-600">Position: {tyre.installation.position} | Pattern: {tyre.pattern}</p>
                      <p className="text-xs text-gray-500">
                        Tread: {tyre.condition.treadDepth}mm | Pressure: {tyre.condition.pressure} PSI | 
                        Miles: {tyre.milesRun.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge className={getTyreConditionColor(tyre.condition.status)}>
                        {tyre.condition.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge className={getTyreStatusColor(tyre.status)}>
                        {tyre.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              {vehicleTyres.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No tyre data available for this vehicle
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};