import React, { useState, useEffect } from 'react';
import { Tyre, TyreSize } from '../../types/workshop-tyre-inventory';
import { AlertTriangle, CheckCircle2, TrendingDown, Info, RotateCcw, FileText } from 'lucide-react';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import LoadingIndicator from '../ui/LoadingIndicator';
import {
  getPositionsByFleet
} from '../../utils/tyreConstants';

// Mock data for tyres (would come from Firestore in production)
// Using the same mock data structure as in TyreDashboard
const MOCK_TYRES: Tyre[] = [
  {
    id: 'tyre1',
    serialNumber: 'SN12345678',
    dotCode: 'DOT123ABC456',
    brand: 'Michelin',
    model: 'Defender',
    pattern: 'All-Season',
    size: '215/55R17',
    tyreSize: {
      width: 215,
      aspectRatio: 55,
      rimDiameter: 17
    },
    loadIndex: '94',
    speedRating: 'V',
    type: 'steer',
    purchaseDate: '2024-01-15',
    cost: 1200.00,
    supplier: 'TyreSupplier Inc',
    warranty: '60000',
    installDetails: {
      vehicle: '21H',
      position: 'front-left',
      mileage: 120000,
      date: '2024-01-16',
    },
    treadDepth: 7.5,
    pressure: 35,
    status: 'good',
    retread: false,
    estimatedLifespan: 120000,
    currentMileage: 150000,
    costPerKm: 0.01,
    inspectionHistory: [
      {
        id: 'insp1',
        date: '2024-03-10',
        inspector: 'John Doe',
        treadDepth: 9.2,
        pressure: 34,
        sidewallCondition: 'good',
        status: 'good',
        timestamp: new Date('2024-03-10').toISOString()
      },
      {
        id: 'insp2',
        date: '2024-05-10',
        inspector: 'Jane Smith',
        treadDepth: 8.5,
        pressure: 35,
        sidewallCondition: 'good',
        status: 'good',
        timestamp: new Date('2024-05-10').toISOString()
      }
    ],
    lastInspectionDate: '2024-05-10'
  },
  {
    id: 'tyre2',
    serialNumber: 'SN87654321',
    dotCode: 'DOT456XYZ789',
    brand: 'Bridgestone',
    model: 'Dueler',
    pattern: 'Highway',
    size: '265/70R16',
    tyreSize: {
      width: 265,
      aspectRatio: 70,
      rimDiameter: 16
    },
    loadIndex: '112',
    speedRating: 'S',
    type: 'drive',
    purchaseDate: '2023-11-10',
    cost: 1500.00,
    supplier: 'TyreSupplier Inc',
    warranty: '80000',
    installDetails: {
      vehicle: '21H',
      position: 'front-right',
      mileage: 95000,
      date: '2023-11-15',
    },
    treadDepth: 5.5,
    pressure: 40,
    status: 'worn',
    retread: false,
    estimatedLifespan: 100000,
    currentMileage: 120000,
    costPerKm: 0.015,
    inspectionHistory: [
      {
        id: 'insp3',
        date: '2023-12-15',
        inspector: 'Mike Johnson',
        treadDepth: 6.5,
        pressure: 41,
        sidewallCondition: 'minor_damage',
        status: 'good',
        timestamp: new Date('2023-12-15').toISOString()
      },
      {
        id: 'insp4',
        date: '2024-02-10',
        inspector: 'John Doe',
        treadDepth: 5.5,
        pressure: 40,
        sidewallCondition: 'minor_damage',
        status: 'worn',
        timestamp: new Date('2024-02-10').toISOString()
      }
    ],
    lastInspectionDate: '2024-02-10'
  },
  {
    id: 'tyre3',
    serialNumber: 'SN11223344',
    dotCode: 'DOT789DEF123',
    brand: 'Continental',
    model: 'CrossContact',
    pattern: 'All-Terrain',
    size: '275/65R18',
    tyreSize: {
      width: 275,
      aspectRatio: 65,
      rimDiameter: 18
    },
    loadIndex: '116',
    speedRating: 'T',
    type: 'trailer',
    purchaseDate: '2023-08-20',
    cost: 1800.00,
    supplier: 'Continental Direct',
    warranty: '70000',
    installDetails: {
      vehicle: '21H',
      position: 'rear-left',
      mileage: 80000,
      date: '2023-08-25',
    },
    treadDepth: 3.0,
    pressure: 38,
    status: 'urgent',
    retread: true,
    estimatedLifespan: 90000,
    currentMileage: 110000,
    costPerKm: 0.02,
    inspectionHistory: [
      {
        id: 'insp5',
        date: '2023-10-10',
        inspector: 'Jane Smith',
        treadDepth: 4.5,
        pressure: 39,
        sidewallCondition: 'minor_damage',
        status: 'worn',
        timestamp: new Date('2023-10-10').toISOString()
      },
      {
        id: 'insp6',
        date: '2024-01-15',
        inspector: 'Mike Johnson',
        treadDepth: 3.0,
        pressure: 38,
        sidewallCondition: 'bulge',
        status: 'urgent',
        timestamp: new Date('2024-01-15').toISOString()
      }
    ],
    lastInspectionDate: '2024-01-15'
  },
  {
    id: 'tyre4',
    serialNumber: 'SN55667788',
    dotCode: 'DOT321GHI654',
    brand: 'Michelin',
    model: 'XZE',
    pattern: 'Highway',
    size: '295/80R22.5',
    tyreSize: {
      width: 295,
      aspectRatio: 80,
      rimDiameter: 22.5
    },
    loadIndex: '152/148',
    speedRating: 'M',
    type: 'steer',
    purchaseDate: '2023-12-05',
    cost: 2200.00,
    supplier: 'TyreSupplier Inc',
    warranty: '100000',
    installDetails: {
      vehicle: '21H',
      position: 'rear-right',
      mileage: 60000,
      date: '2023-12-10',
    },
    treadDepth: 9.0,
    pressure: 120,
    status: 'good',
    retread: false,
    estimatedLifespan: 120000,
    currentMileage: 75000,
    costPerKm: 0.018,
    inspectionHistory: [
      {
        id: 'insp7',
        date: '2024-02-05',
        inspector: 'John Doe',
        treadDepth: 9.0,
        pressure: 120,
        sidewallCondition: 'good',
        status: 'good',
        timestamp: new Date('2024-02-05').toISOString()
      }
    ],
    lastInspectionDate: '2024-02-05'
  },
  // Trailer tyres for 22H
  {
    id: 'tyre5',
    serialNumber: 'SN99887766',
    dotCode: 'DOT987JKL654',
    brand: 'Goodyear',
    model: 'G619',
    pattern: 'Highway',
    size: '295/75R22.5',
    tyreSize: {
      width: 295,
      aspectRatio: 75,
      rimDiameter: 22.5
    },
    loadIndex: '144/142',
    speedRating: 'M',
    type: 'trailer',
    purchaseDate: '2023-10-15',
    cost: 1900.00,
    supplier: 'TyreSupplier Inc',
    warranty: '90000',
    installDetails: {
      vehicle: '22H',
      position: 'trailer-1',
      mileage: 75000,
      date: '2023-10-20',
    },
    treadDepth: 6.5,
    pressure: 110,
    status: 'good',
    retread: false,
    estimatedLifespan: 110000,
    currentMileage: 95000,
    costPerKm: 0.017,
    inspectionHistory: [
      {
        id: 'insp8',
        date: '2024-01-10',
        inspector: 'Jane Smith',
        treadDepth: 6.5,
        pressure: 110,
        sidewallCondition: 'good',
        status: 'good',
        timestamp: new Date('2024-01-10').toISOString()
      }
    ],
    lastInspectionDate: '2024-01-10'
  },
  {
    id: 'tyre6',
    serialNumber: 'SN44332211',
    dotCode: 'DOT456MNO789',
    brand: 'Goodyear',
    model: 'G619',
    pattern: 'Highway',
    size: '295/75R22.5',
    tyreSize: {
      width: 295,
      aspectRatio: 75,
      rimDiameter: 22.5
    },
    loadIndex: '144/142',
    speedRating: 'M',
    type: 'trailer',
    purchaseDate: '2023-10-15',
    cost: 1900.00,
    supplier: 'TyreSupplier Inc',
    warranty: '90000',
    installDetails: {
      vehicle: '22H',
      position: 'trailer-2',
      mileage: 75000,
      date: '2023-10-20',
    },
    treadDepth: 4.2,
    pressure: 105,
    status: 'worn',
    retread: false,
    estimatedLifespan: 90000,
    currentMileage: 95000,
    costPerKm: 0.021,
    inspectionHistory: [
      {
        id: 'insp9',
        date: '2023-12-20',
        inspector: 'Mike Johnson',
        treadDepth: 5.6,
        pressure: 108,
        sidewallCondition: 'good',
        status: 'good',
        timestamp: new Date('2023-12-20').toISOString()
      },
      {
        id: 'insp10',
        date: '2024-02-15',
        inspector: 'John Doe',
        treadDepth: 4.2,
        pressure: 105,
        sidewallCondition: 'minor_damage',
        status: 'worn',
        timestamp: new Date('2024-02-15').toISOString()
      }
    ],
    lastInspectionDate: '2024-02-15'
  },
];

// Mock vehicle data (would come from Firestore in production)
const FLEET_VEHICLES = [
  { id: '21H', name: '21H - Volvo FH16', type: 'HORSE' },
  { id: '22H', name: '22H - Afrit Side Tipper', type: 'INTERLINK' },
  { id: '23H', name: '23H - Mercedes Actros', type: 'HORSE' },
  { id: '4F', name: '4F - Reefer Trailer', type: 'REEFER' },
  { id: '6H', name: '6H - Light Motor Vehicle', type: 'LMV' },
];

// Helper to format tyre size as string
const formatTyreSize = (size: TyreSize): string => {
  return `${size.width}/${size.aspectRatio}R${size.rimDiameter}`;
};

interface VehicleTyreViewProps {
  vehicleId?: string;
  onTyreSelect?: (tyre: Tyre | null) => void;
}

const VehicleTyreView: React.FC<VehicleTyreViewProps> = ({
  vehicleId = '21H',
  onTyreSelect
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>(vehicleId);
  const [vehicleTyres, setVehicleTyres] = useState<Tyre[]>([]);
  const [selectedTyre, setSelectedTyre] = useState<Tyre | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  useEffect(() => {
    const fetchVehicleTyres = async () => {
      setLoading(true);
      setError(null);

      try {
        // In a real app, this would fetch from Firestore
        // const db = getFirestore();
        // const tyresRef = collection(db, 'tyres');
        // const tyresQuery = query(tyresRef, where('installDetails.vehicle', '==', selectedVehicle));
        // const snapshot = await getDocs(tyresQuery);
        // const fetchedTyres = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Tyre);

        // Using mock data for this implementation
        const fetchedTyres = MOCK_TYRES.filter(tyre =>
          tyre.installDetails.vehicle === selectedVehicle
        );

        // Simulate some network delay
        setTimeout(() => {
          setVehicleTyres(fetchedTyres);
          setSelectedTyre(null); // Clear selection when vehicle changes
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error('Error fetching vehicle tyres:', error);
        setError('Failed to load tyre data. Please try again.');
        setLoading(false);
      }
    };

    if (selectedVehicle) {
      fetchVehicleTyres();
    }
  }, [selectedVehicle]);

  // Update when the prop changes
  useEffect(() => {
    if (vehicleId !== selectedVehicle) {
      setSelectedVehicle(vehicleId);
    }
  }, [vehicleId]);

  const handleTyreSelect = (tyre: Tyre | null) => {
    setSelectedTyre(tyre);
    setShowHistory(false); // Reset history view

    if (onTyreSelect) {
      onTyreSelect(tyre);
    }
  };

  // Get vehicle type to determine the diagram layout
  const vehicle = FLEET_VEHICLES.find(v => v.id === selectedVehicle);
  const vehicleType = vehicle ? vehicle.type : 'HORSE'; // Default to HORSE if not found

  // Get positions for the selected vehicle
  const vehiclePositions = getPositionsByFleet(selectedVehicle);

  // Function to get tyre by position
  const getTyreByPosition = (position: string): Tyre | null => {
    // First try exact match
    let tyre = vehicleTyres.find(t => t.installDetails.position === position);

    // If not found, try partial match (for compatibility with different position naming schemes)
    if (!tyre) {
      // Convert position like "POS 1" to "pos-1" or match other variations
      const normalizedPos = position.toLowerCase().replace(/\s+/g, '-').replace(/\(.*\)/g, '').trim();

      tyre = vehicleTyres.find(t => {
        const tyrePos = t.installDetails.position.toLowerCase();
        return tyrePos.includes(normalizedPos) || normalizedPos.includes(tyrePos);
      });
    }

    return tyre || null;
  };

  // Function to determine status class for tyre display
  const getTyreStatusClass = (tyre: Tyre | null): string => {
    if (!tyre) return 'bg-gray-300'; // No tyre installed

    switch (tyre.status) {
      case 'good': return 'bg-green-500';
      case 'worn': return 'bg-yellow-500';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  // Function to get tyre tooltip text
  const getTyreTooltip = (tyre: Tyre | null): string => {
    if (!tyre) return 'No tyre installed';

    return `${tyre.brand} ${tyre.model} - ${tyre.size}
Tread: ${tyre.treadDepth}mm - Pressure: ${tyre.pressure} PSI
Status: ${tyre.status.charAt(0).toUpperCase() + tyre.status.slice(1)}`;
  };

  // Helper to create position based on vehicle type and total positions
  const createPositionLayout = (positions: string[]) => {
    const layout = [];
    const totalPositions = positions.length;

    // Create diagram based on vehicle type
    switch (vehicleType) {
      case 'HORSE':
        // HORSE layout with steer axle, drive axles
        layout.push(
          // Steer axle
          { row: 0, col: 0, position: positions[0] || 'POS 1' }, // Front left
          { row: 0, col: 2, position: positions[1] || 'POS 2' }, // Front right

          // Drive axle 1
          { row: 1, col: 0, position: positions[2] || 'POS 3' }, // Drive left 1
          { row: 1, col: 2, position: positions[3] || 'POS 4' }, // Drive right 1

          // Drive axle 2 (if available)
          { row: 2, col: 0, position: positions[4] || 'POS 5' }, // Drive left 2
          { row: 2, col: 2, position: positions[5] || 'POS 6' }, // Drive right 2
        );

        // Add spare or additional positions
        if (totalPositions > 6) {
          layout.push({ row: 3, col: 1, position: positions[6] || 'POS 7' }); // Spare
        }
        if (totalPositions > 7) {
          layout.push({ row: 3, col: 3, position: positions[7] || 'POS 8' }); // Spare 2
        }
        break;

      case 'INTERLINK':
        // More positions for interlink trailer
        for (let i = 0; i < Math.min(positions.length, 18); i++) {
          const row = Math.floor(i / 4);
          const col = (i % 4) * 2; // 0, 2, 4, 6
          layout.push({ row, col, position: positions[i] });
        }
        break;

      case 'REEFER':
        // 6 positions + 2 spares for reefer
        for (let i = 0; i < Math.min(positions.length, 8); i++) {
          const row = Math.floor(i / 2);
          const col = (i % 2) * 2; // 0, 2
          layout.push({ row, col, position: positions[i] });
        }
        break;

      case 'LMV':
        // 6 positions + 1 spare for LMV
        layout.push(
          // Front axle
          { row: 0, col: 0, position: positions[0] || 'POS 1' }, // Front left
          { row: 0, col: 2, position: positions[1] || 'POS 2' }, // Front right

          // Rear axle
          { row: 1, col: 0, position: positions[2] || 'POS 3' }, // Rear left
          { row: 1, col: 2, position: positions[3] || 'POS 4' }, // Rear right

          // Spare
          { row: 2, col: 1, position: positions[6] || 'POS 7 (SPARE)' } // Spare
        );
        break;

      default:
        // Generic layout for unknown types
        for (let i = 0; i < positions.length; i++) {
          const row = Math.floor(i / 2);
          const col = (i % 2) * 2;
          layout.push({ row, col, position: positions[i] });
        }
    }

    return layout;
  };

  // Create position layout based on the vehicle type and available positions
  const positionLayout = createPositionLayout(vehiclePositions);

  // Calculate dimensions for the diagram
  const maxRow = positionLayout.reduce((max, pos) => Math.max(max, pos.row), 0);
  const maxCol = positionLayout.reduce((max, pos) => Math.max(max, pos.col), 0);

  // Toggle inspection history view
  const toggleHistoryView = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vehicle Tyre View</h1>
        <div className="w-64">
          <select
            className="w-full rounded-md border border-gray-300 py-2 px-3"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
          >
            {FLEET_VEHICLES.map(vehicle => (
              <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && <ErrorMessage message={error} />}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center my-8">
          <LoadingIndicator />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vehicle Diagram */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              {vehicle ? vehicle.name : 'Vehicle'} Tyre Diagram
            </h2>

            <div className="relative w-full" style={{ height: `${(maxRow + 2) * 100}px`, maxHeight: '600px' }}>
              {/* Vehicle outline (based on type) */}
              <div className="absolute inset-0 flex items-center justify-center">
                {vehicleType === 'HORSE' && (
                  <div className="w-3/4 h-2/3 border-2 border-gray-400 rounded-lg bg-gray-100 relative">
                    {/* Truck cab */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 border-b-2 border-gray-400"></div>
                  </div>
                )}

                {vehicleType === 'INTERLINK' && (
                  <div className="w-3/4 h-5/6 border-2 border-gray-400 rounded-lg bg-gray-100 relative">
                    {/* Interlink trailer */}
                    <div className="absolute top-1/4 left-0 right-0 h-1/2 border-t-2 border-b-2 border-gray-400"></div>
                  </div>
                )}

                {vehicleType === 'REEFER' && (
                  <div className="w-3/4 h-5/6 border-2 border-gray-400 rounded-lg bg-gray-100 relative">
                    {/* Reefer unit */}
                    <div className="absolute top-0 left-0 w-1/6 h-1/4 border-r-2 border-b-2 border-gray-400 bg-gray-300"></div>
                  </div>
                )}

                {vehicleType === 'LMV' && (
                  <div className="w-2/3 h-1/2 border-2 border-gray-400 rounded-lg bg-gray-100 relative">
                    {/* LMV outline */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 border-b-2 border-gray-400"></div>
                  </div>
                )}
              </div>

              {/* Tyre positions */}
              {positionLayout.map((pos, index) => {
                const tyre = getTyreByPosition(pos.position);
                const statusClass = getTyreStatusClass(tyre);
                const tooltipText = getTyreTooltip(tyre);

                // Calculate grid-based positioning
                const colUnit = 100 / (maxCol + 2); // +2 for padding
                const rowUnit = 100 / (maxRow + 2); // +2 for padding

                const leftPos = `${(pos.col + 1) * colUnit}%`;
                const topPos = `${(pos.row + 1) * rowUnit}%`;

                return (
                  <div
                    key={index}
                    className={`absolute w-16 h-16 rounded-full ${statusClass} flex items-center justify-center 
                              border-4 ${selectedTyre?.installDetails.position === pos.position ? 'border-blue-600' : 'border-gray-700'}
                              cursor-pointer hover:border-blue-500 transition-colors duration-200`}
                    style={{
                      left: leftPos,
                      top: topPos,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => handleTyreSelect(tyre)}
                    title={tooltipText}
                  >
                    <div className="flex flex-col items-center justify-center text-white">
                      <span className="font-bold text-xs">
                        {pos.position.includes('POS') ?
                          pos.position.replace('POS ', 'P') :
                          pos.position.split('-').map(p => p.charAt(0)).join('')}
                      </span>
                      {tyre && (
                        <span className="text-xs font-semibold">{tyre.treadDepth}mm</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-center space-x-8">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Good</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm">Worn</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">Urgent</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
                <span className="text-sm">No Tyre</span>
              </div>
            </div>
          </div>

          {/* Selected Tyre Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {selectedTyre ? 'Selected Tyre Details' : 'Tyre Information'}
              </h2>

              {selectedTyre && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleHistoryView}
                    icon={showHistory ? <Info className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  >
                    {showHistory ? 'Show Details' : 'Inspection History'}
                  </Button>
                </div>
              )}
            </div>

            {selectedTyre ? (
              !showHistory ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    {selectedTyre.status === 'good' && <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />}
                    {selectedTyre.status === 'worn' && <TrendingDown className="w-5 h-5 text-yellow-600 mr-2" />}
                    {selectedTyre.status === 'urgent' && <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />}
                    <h3 className="text-lg font-medium">
                      {selectedTyre.brand} {selectedTyre.model}
                    </h3>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Size</p>
                        <p className="font-medium">{selectedTyre.size}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Detailed Size</p>
                        <p className="font-medium">
                          {selectedTyre.tyreSize ? formatTyreSize(selectedTyre.tyreSize) : selectedTyre.size}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="font-medium capitalize">{selectedTyre.installDetails.position.replace(/-/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium capitalize">{selectedTyre.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Serial Number</p>
                      <p className="font-medium">{selectedTyre.serialNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">DOT Code</p>
                      <p className="font-medium">{selectedTyre.dotCode}</p>
                    </div>
                  </div>

                  {/* Tread Depth */}
                  <div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Tread Depth</p>
                      <p className="font-medium">{selectedTyre.treadDepth} mm</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div
                        className={`h-2.5 rounded-full ${selectedTyre.treadDepth > 6 ? 'bg-green-500' :
                          selectedTyre.treadDepth > 3 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                        style={{ width: `${(selectedTyre.treadDepth / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Pressure */}
                  <div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Pressure</p>
                      <p className="font-medium">{selectedTyre.pressure} PSI</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div
                        className={`h-2.5 rounded-full ${selectedTyre.pressure >= 32 && selectedTyre.pressure <= 40 ? 'bg-green-500' :
                          selectedTyre.pressure > 28 && selectedTyre.pressure < 45 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                        style={{ width: `${Math.min(100, (selectedTyre.pressure / 45) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Cost & Lifespan */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Cost</p>
                      <p className="font-medium">${selectedTyre.cost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Est. Lifespan</p>
                      <p className="font-medium">
                        {selectedTyre.estimatedLifespan?.toLocaleString() || 'N/A'} km
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Cost per KM</p>
                      <p className="font-medium">
                        ${selectedTyre.costPerKm?.toFixed(4) || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mileage</p>
                      <p className="font-medium">
                        {selectedTyre.currentMileage?.toLocaleString() || selectedTyre.installDetails.mileage.toLocaleString()} km
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Installation Date</p>
                      <p className="font-medium">{new Date(selectedTyre.installDetails.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Mileage at Installation</p>
                      <p className="font-medium">{selectedTyre.installDetails.mileage.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Purchase Date</p>
                      <p className="font-medium">{new Date(selectedTyre.purchaseDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Warranty</p>
                      <p className="font-medium">{parseInt(selectedTyre.warranty).toLocaleString()} km</p>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => alert('Rotate Tyre feature coming soon')}
                      icon={<RotateCcw className="w-4 h-4" />}
                    >
                      Rotate Tyre
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => alert('Replace Tyre feature coming soon')}
                    >
                      Replace Tyre
                    </Button>
                  </div>
                </div>
              ) : (
                // Inspection History View
                <div className="space-y-4">
                  <div className="text-sm text-gray-500 mb-4">
                    Showing inspection history for {selectedTyre.brand} {selectedTyre.model} ({selectedTyre.serialNumber})
                  </div>

                  {/* Tread Depth Chart */}
                  {selectedTyre.inspectionHistory && selectedTyre.inspectionHistory.length > 0 ? (
                    <>
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-2">Tread Depth History</h4>
                        <div className="h-24 flex items-end space-x-1">
                          {selectedTyre.inspectionHistory.map((insp, index) => {
                            const height = Math.min(100, (insp.treadDepth / 10) * 100);
                            return (
                              <div key={index} className="flex flex-col items-center">
                                <div
                                  className={`w-10 rounded-t transition-all ${insp.treadDepth > 6 ? 'bg-green-500' :
                                    insp.treadDepth > 3 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                  style={{ height: `${height}%` }}
                                ></div>
                                <div className="text-xs mt-1 w-10 text-center">
                                  {new Date(insp.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Inspection Table */}
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspector</th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tread</th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PSI</th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {selectedTyre.inspectionHistory.map((insp, index) => (
                              <tr key={index}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">{new Date(insp.date).toLocaleDateString()}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">{insp.inspector}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">{insp.treadDepth} mm</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">{insp.pressure} PSI</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm">
                                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${insp.status === 'good' ? 'bg-green-100 text-green-800' :
                                      insp.status === 'worn' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'}`}>
                                    {insp.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      No inspection history available for this tyre.
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mb-4 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
                </svg>
                <p>Select a tyre from the diagram to view its details.</p>
                <p className="mt-2 text-sm">Click on any tyre position to see detailed information.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleTyreView;