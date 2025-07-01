import React, { useState, useEffect } from 'react';
import { Tyre } from '../../types/workshop-tyre-inventory';
import { AlertTriangle, CheckCircle2, TrendingDown } from 'lucide-react';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import LoadingIndicator from '../ui/LoadingIndicator';

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
    inspectionHistory: []
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
    inspectionHistory: []
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
    inspectionHistory: []
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
    inspectionHistory: []
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
    inspectionHistory: []
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
    inspectionHistory: []
  },
];

// Mock vehicle data (would come from Firestore in production)
const FLEET_VEHICLES = [
  { id: '21H', name: '21H - Volvo FH16', type: 'Truck' },
  { id: '22H', name: '22H - Afrit Side Tipper', type: 'Trailer' },
  { id: '23H', name: '23H - Mercedes Actros', type: 'Truck' },
];

// Vehicle configuration with tyre positions
const VEHICLE_CONFIGS = {
  'Truck': {
    positions: [
      'front-left', 'front-right',
      'rear-left', 'rear-right',
      'spare-1'
    ],
    diagram: [
      { row: 0, col: 0, position: 'front-left' },
      { row: 0, col: 2, position: 'front-right' },
      { row: 1, col: 0, position: 'rear-left' },
      { row: 1, col: 2, position: 'rear-right' },
      { row: 2, col: 1, position: 'spare-1' },
    ]
  },
  'Trailer': {
    positions: [
      'trailer-1', 'trailer-2', 'trailer-3', 'trailer-4',
      'trailer-5', 'trailer-6', 'trailer-7', 'trailer-8',
      'spare-1'
    ],
    diagram: [
      { row: 0, col: 0, position: 'trailer-1' },
      { row: 0, col: 2, position: 'trailer-2' },
      { row: 1, col: 0, position: 'trailer-3' },
      { row: 1, col: 2, position: 'trailer-4' },
      { row: 2, col: 0, position: 'trailer-5' },
      { row: 2, col: 2, position: 'trailer-6' },
      { row: 3, col: 0, position: 'trailer-7' },
      { row: 3, col: 2, position: 'trailer-8' },
      { row: 4, col: 1, position: 'spare-1' },
    ]
  }
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
    if (onTyreSelect) {
      onTyreSelect(tyre);
    }
  };

  // Get vehicle type to determine the diagram layout
  const vehicle = FLEET_VEHICLES.find(v => v.id === selectedVehicle);
  const vehicleType = vehicle ? vehicle.type : 'Truck'; // Default to truck if not found
  const vehicleConfig = VEHICLE_CONFIGS[vehicleType as keyof typeof VEHICLE_CONFIGS];

  // Function to get tyre by position
  const getTyreByPosition = (position: string): Tyre | null => {
    return vehicleTyres.find(t => t.installDetails.position === position) || null;
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

            <div className="relative w-full" style={{ height: vehicleType === 'Truck' ? '400px' : '600px' }}>
              {/* Vehicle outline (simplified) */}
              <div className="absolute inset-0 flex items-center justify-center">
                {vehicleType === 'Truck' ? (
                  <div className="w-3/4 h-2/3 border-2 border-gray-400 rounded-lg bg-gray-100 relative">
                    {/* Truck cab */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 border-b-2 border-gray-400"></div>
                  </div>
                ) : (
                  <div className="w-3/4 h-5/6 border-2 border-gray-400 rounded-lg bg-gray-100"></div>
                )}
              </div>

              {/* Tyre positions */}
              {vehicleConfig.diagram.map((pos, index) => {
                const tyre = getTyreByPosition(pos.position);
                const statusClass = getTyreStatusClass(tyre);
                const tooltipText = getTyreTooltip(tyre);

                // Calculate position based on the diagram layout
                const leftPos = pos.col === 0 ? '15%' : pos.col === 1 ? '50%' : '85%';
                const rowHeight = 100 / (vehicleConfig.diagram.length / 2);
                const topPos = `${pos.row * rowHeight}%`;

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
                    <span className="text-white font-bold text-xs">
                      {pos.position.split('-')[0].charAt(0).toUpperCase() + pos.position.split('-')[1]?.charAt(0).toUpperCase()}
                    </span>
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
            <h2 className="text-lg font-semibold mb-4">
              {selectedTyre ? 'Selected Tyre Details' : 'Tyre Information'}
            </h2>

            {selectedTyre ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  {selectedTyre.status === 'good' && <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />}
                  {selectedTyre.status === 'worn' && <TrendingDown className="w-5 h-5 text-yellow-600 mr-2" />}
                  {selectedTyre.status === 'urgent' && <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />}
                  <h3 className="text-lg font-medium">
                    {selectedTyre.brand} {selectedTyre.model} - {selectedTyre.size}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium capitalize">{selectedTyre.installDetails.position.replace('-', ' ')}</p>
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
                      style={{ width: `${(selectedTyre.treadDepth / 8) * 100}%` }}
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
                    <p className="text-sm text-gray-500">Cost</p>
                    <p className="font-medium">${selectedTyre.cost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Warranty</p>
                    <p className="font-medium">{parseInt(selectedTyre.warranty).toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Retread</p>
                    <p className="font-medium">{selectedTyre.retread ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => alert('Rotate Tyre feature coming soon')}
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