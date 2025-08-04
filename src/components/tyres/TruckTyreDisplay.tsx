import React, { useState, useEffect } from 'react';
import { Tyre, TyrePosition, FleetTyreMapping } from '@/types/tyre';
import { useTyres } from '@/context/TyreContext';
import { Card, CardContent, CardHeader } from '@/components/ui/consolidated/Card';
import { Button } from '@/components/ui/Button';
import { CircleDot, Info, AlertTriangle, Truck, TruckIcon } from 'lucide-react';
import LoadingIndicator from '@/components/ui/LoadingIndicator';

// Helper function to format currency
const formatCurrency = (amount: number | undefined, currency: string = 'ZAR'): string => {
  if (amount === undefined || isNaN(amount)) return 'N/A';

  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// Helper function to calculate cost per km
const calculateCostPerKm = (tyre: Tyre | undefined): number | undefined => {
  if (!tyre || !tyre.purchaseDetails || !tyre.purchaseDetails.cost || !tyre.kmRun) {
    return undefined;
  }

  return tyre.kmRun > 0 ? tyre.purchaseDetails.cost / tyre.kmRun : undefined;
};

// Define the standardized position mapping for different vehicle types
const POSITION_MAPPING = {
  HORSE: {
    positions: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'SP'],
    layout: {
      steer: ['V1', 'V2'],
      drive1: ['V3', 'V4', 'V5', 'V6'],
      drive2: ['V7', 'V8', 'V9', 'V10'],
      spare: ['SP']
    }
  },
  INTERLINK: {
    positions: [
      'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8',
      'T9', 'T10', 'T11', 'T12', 'T13', 'T14', 'T15', 'T16',
      'SP'
    ],
    layout: {
      axle1: ['T1', 'T2', 'T3', 'T4'],
      axle2: ['T5', 'T6', 'T7', 'T8'],
      axle3: ['T9', 'T10', 'T11', 'T12'],
      axle4: ['T13', 'T14', 'T15', 'T16'],
      spare: ['SP']
    }
  },
  REEFER: {
    positions: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'SP'],
    layout: {
      axle1: ['P1', 'P2'],
      axle2: ['P3', 'P4'],
      axle3: ['P5', 'P6'],
      spare: ['SP']
    }
  },
  LMV: {
    positions: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'SP'],
    layout: {
      steer: ['P1', 'P2'],
      drive: ['P3', 'P4', 'P5', 'P6'],
      spare: ['SP']
    }
  }
};

interface TruckTyreDisplayProps {
  selectedVehicle: string;
  onTyreSelect: (tyre: Tyre | null) => void;
  onVehicleSelect?: (vehicleId: string) => void;
}

const TruckTyreDisplay: React.FC<TruckTyreDisplayProps> = ({
  selectedVehicle,
  onTyreSelect,
  onVehicleSelect
}) => {
  const { loading, getTyresByVehicle } = useTyres();
  const [vehicleTyres, setVehicleTyres] = useState<Tyre[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState<'HORSE' | 'INTERLINK' | 'REEFER' | 'LMV'>('HORSE');

  useEffect(() => {
    if (selectedVehicle) {
      // Determine vehicle type based on fleet number
      let type: 'HORSE' | 'INTERLINK' | 'REEFER' | 'LMV' = 'HORSE';

      if (selectedVehicle.includes('H')) {
        type = 'HORSE';
      } else if (selectedVehicle.includes('T')) {
        type = 'INTERLINK';
      } else if (selectedVehicle.includes('F')) {
        type = 'REEFER';
      } else if (selectedVehicle.includes('L')) {
        type = 'LMV';
      }

      setVehicleType(type);

      // Load tyres for this vehicle from Firestore
      getTyresByVehicle(selectedVehicle)
        .then(fetchedTyres => {
          setVehicleTyres(fetchedTyres);
        })
        .catch(err => {
          console.error("Error fetching vehicle tyres:", err);
        });
    }
  }, [selectedVehicle, getTyresByVehicle]);

  // Get tyre at a specific position
  const getTyreAtPosition = (position: string): Tyre | undefined => {
    return vehicleTyres.find(t =>
      t.mountStatus === 'mounted' &&
      t.installation?.position === position
    );
  };

  // Handle position click
  const handlePositionClick = (position: string) => {
    setSelectedPosition(position);
    const tyre = getTyreAtPosition(position);
    onTyreSelect(tyre || null);
  };

  // Get status color for tyre position
  const getPositionStatusColor = (position: string): string => {
    const tyre = getTyreAtPosition(position);
    if (!tyre) return 'bg-gray-200';

    switch (tyre.condition.status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-orange-500';
      case 'needs_replacement': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  // Render a tyre position circle
  const renderTyrePosition = (position: string) => {
    return (
      <div
        key={position}
        className="relative cursor-pointer"
        onClick={() => handlePositionClick(position)}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
            selectedPosition === position ? 'border-blue-600' : 'border-gray-400'
          } ${getPositionStatusColor(position)}`}
        >
          <span className="font-bold text-white">{position}</span>
        </div>
        {getTyreAtPosition(position) && (
          <div className="absolute -bottom-6 left-0 right-0 text-xs text-center">
            {getTyreAtPosition(position)?.brand}
          </div>
        )}
      </div>
    );
  };

  // Render a vehicle section (e.g., steer axle, drive axle)
  const renderVehicleSection = (title: string, positions: string[]) => {
    return (
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-500 mb-2">{title}</h4>
        <div className="flex justify-center space-x-6">
          {positions.map(pos => renderTyrePosition(pos))}
        </div>
      </div>
    );
  };

  // Render the vehicle layout based on vehicle type
  const renderVehicleLayout = () => {
    // Use type assertion to handle the different layout types
    switch (vehicleType) {
      case 'HORSE': {
        // Type assertion for HORSE layout
        const horseLayout = POSITION_MAPPING.HORSE.layout as {
          steer: string[];
          drive1: string[];
          drive2: string[];
          spare: string[];
        };

        return (
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-2 rounded-md w-full text-center mb-6">
              <TruckIcon className="inline-block mr-2 h-5 w-5" />
              <span className="font-medium text-blue-800">HORSE - {selectedVehicle}</span>
            </div>

            {renderVehicleSection('Steer Axle', horseLayout.steer)}
            {renderVehicleSection('Drive Axle 1', horseLayout.drive1)}
            {renderVehicleSection('Drive Axle 2', horseLayout.drive2)}
            {renderVehicleSection('Spare', horseLayout.spare)}
          </div>
        );
      }

      case 'INTERLINK': {
        // Type assertion for INTERLINK layout
        const interlinkLayout = POSITION_MAPPING.INTERLINK.layout as {
          axle1: string[];
          axle2: string[];
          axle3: string[];
          axle4: string[];
          spare: string[];
        };

        return (
          <div className="flex flex-col items-center">
            <div className="bg-green-100 p-2 rounded-md w-full text-center mb-6">
              <Truck className="inline-block mr-2 h-5 w-5" />
              <span className="font-medium text-green-800">INTERLINK - {selectedVehicle}</span>
            </div>

            {renderVehicleSection('Axle 1', interlinkLayout.axle1)}
            {renderVehicleSection('Axle 2', interlinkLayout.axle2)}
            {renderVehicleSection('Axle 3', interlinkLayout.axle3)}
            {renderVehicleSection('Axle 4', interlinkLayout.axle4)}
            {renderVehicleSection('Spare', interlinkLayout.spare)}
          </div>
        );
      }

      case 'REEFER': {
        // Type assertion for REEFER layout
        const reeferLayout = POSITION_MAPPING.REEFER.layout as {
          axle1: string[];
          axle2: string[];
          axle3: string[];
          spare: string[];
        };

        return (
          <div className="flex flex-col items-center">
            <div className="bg-purple-100 p-2 rounded-md w-full text-center mb-6">
              <Truck className="inline-block mr-2 h-5 w-5" />
              <span className="font-medium text-purple-800">REEFER - {selectedVehicle}</span>
            </div>

            {renderVehicleSection('Axle 1', reeferLayout.axle1)}
            {renderVehicleSection('Axle 2', reeferLayout.axle2)}
            {renderVehicleSection('Axle 3', reeferLayout.axle3)}
            {renderVehicleSection('Spare', reeferLayout.spare)}
          </div>
        );
      }

      case 'LMV': {
        // Type assertion for LMV layout
        const lmvLayout = POSITION_MAPPING.LMV.layout as {
          steer: string[];
          drive: string[];
          spare: string[];
        };

        return (
          <div className="flex flex-col items-center">
            <div className="bg-amber-100 p-2 rounded-md w-full text-center mb-6">
              <Truck className="inline-block mr-2 h-5 w-5" />
              <span className="font-medium text-amber-800">LMV - {selectedVehicle}</span>
            </div>

            {renderVehicleSection('Steer Axle', lmvLayout.steer)}
            {renderVehicleSection('Drive Axle', lmvLayout.drive)}
            {renderVehicleSection('Spare', lmvLayout.spare)}
          </div>
        );
      }

      default:
        return (
          <div className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <p className="text-amber-800">Unknown vehicle type</p>
          </div>
        );
    }
  };

  if (!selectedVehicle) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <CircleDot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Vehicle Selected</h3>
          <p className="text-gray-500 mb-6">Please select a vehicle to view its tyre positions</p>
          {onVehicleSelect && (
            <Button onClick={() => onVehicleSelect('')}>
              Select Vehicle
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return <LoadingIndicator text="Loading tyre data..." />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-xl font-medium">
            Tyre Positions for {selectedVehicle}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-6 rounded-lg relative">
            {renderVehicleLayout()}

            {/* Legend */}
            <div className="absolute top-2 right-2 bg-white p-2 rounded-md shadow-sm">
              <div className="text-xs font-medium mb-1">Status Legend</div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-xs">Good</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="text-xs">Warning</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                <span className="text-xs">Critical</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="text-xs">Replace</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-gray-200 rounded-full"></span>
                <span className="text-xs">Empty</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Tyre Details */}
      {selectedPosition && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-medium">Tyre Details - Position {selectedPosition}</h3>
          </CardHeader>
          <CardContent>
            {getTyreAtPosition(selectedPosition) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Specifications</h4>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Brand & Model</td>
                        <td className="py-2 font-medium">
                          {getTyreAtPosition(selectedPosition)?.brand} {getTyreAtPosition(selectedPosition)?.model}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Serial Number</td>
                        <td className="py-2 font-medium">
                          {getTyreAtPosition(selectedPosition)?.serialNumber}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">DOT Code</td>
                        <td className="py-2 font-medium">
                          {getTyreAtPosition(selectedPosition)?.dotCode}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Size</td>
                        <td className="py-2 font-medium">
                          {getTyreAtPosition(selectedPosition)?.size?.displayString ||
                           `${getTyreAtPosition(selectedPosition)?.size.width}/${getTyreAtPosition(selectedPosition)?.size.aspectRatio}R${getTyreAtPosition(selectedPosition)?.size.rimDiameter}`}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Type</td>
                        <td className="py-2 font-medium">
                          {getTyreAtPosition(selectedPosition)?.type}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Status</td>
                        <td className="py-2 font-medium">
                          {getTyreAtPosition(selectedPosition)?.status}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Condition & Performance</h4>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Tread Depth</td>
                        <td className="py-2 font-medium">
                          {getTyreAtPosition(selectedPosition)?.condition.treadDepth} mm
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Pressure</td>
                        <td className="py-2 font-medium">
                          {getTyreAtPosition(selectedPosition)?.condition.pressure} PSI
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Temperature</td>
                        <td className="py-2 font-medium">
                          {getTyreAtPosition(selectedPosition)?.condition.temperature} °C
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Mileage</td>
                        <td className="py-2 font-medium">
                          {getTyreAtPosition(selectedPosition)?.kmRun.toLocaleString()} km
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Cost/KM</td>
                        <td className="py-2 font-medium">
                          {formatCurrency(calculateCostPerKm(getTyreAtPosition(selectedPosition)!))}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Last Inspection</td>
                        <td className="py-2 font-medium">
                          {getTyreAtPosition(selectedPosition)?.condition.lastInspectionDate}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-lg">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Tyre Mounted</h3>
                <p className="text-gray-500 mb-4">Position {selectedPosition} does not have a tyre mounted.</p>
                <Button>Mount Tyre at This Position</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TruckTyreDisplay;
