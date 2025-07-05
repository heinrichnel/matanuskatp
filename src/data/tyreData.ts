// Tyre brands available in the system
export const TIRE_BRANDS = [
  'Michelin', 'Bridgestone', 'Continental', 'Goodyear', 'Pirelli',
  'Dunlop', 'Yokohama', 'Hankook', 'Toyo', 'Kumho', 'Firemax',
  'TRIANGLE', 'Terraking', 'Compasal', 'Windforce'
];

// Tyre patterns/treads available
export const TIRE_PATTERNS = [
  'Long Haul', 'Regional', 'Mixed Service', 'Urban', 'All Position',
  'Steer', 'Drive', 'Trailer', 'All Season'
];

// Tyre size interface
export interface TireSize {
  width: number;        // mm (e.g., 295, 315)
  aspectRatio: number;  // % (e.g., 80, 75)
  rimDiameter: number;  // inches (e.g., 22.5, 24.5)
}

// Tyre condition interface - adding status property
export interface TireCondition {
  treadDepth: number;    // mm
  pressure: number;      // PSI
  temperature: number;   // Celsius
  status: 'good' | 'warning' | 'critical' | 'needs_replacement';
  lastInspectionDate: string;
  nextInspectionDue: string;
}

// Main Tire interface - adding id property
export interface Tire {
  id: string; // Adding missing id property
  tireId: string;
  serialNumber: string;
  dotCode: string;
  manufacturingDate: string;
  brand: string;
  model: string;
  pattern: string;
  size: TireSize;
  loadIndex: number;
  speedRating: string;
  type: 'steer' | 'drive' | 'trailer' | 'spare';
  
  purchaseDetails: {
    date: string;
    cost: number;
    supplier: string;
    warranty: string;
    invoiceNumber?: string;
  };
  
  installation: {
    vehicleId: string;
    position: string;
    mileageAtInstallation: number;
    installationDate: string;
    installedBy: string;
  };
  
  condition: TireCondition;
  status: 'new' | 'in_service' | 'spare' | 'retreaded' | 'scrapped';
  mountStatus: 'mounted' | 'unmounted' | 'in_storage';
  
  maintenanceHistory: {
    rotations: Array<{
      date: string;
      fromPosition: string;
      toPosition: string;
      mileage: number;
      technician: string;
    }>;
    repairs: Array<{
      date: string;
      type: string;
      description: string;
      cost: number;
      technician: string;
    }>;
    inspections: Array<{
      date: string;
      inspector: string;
      treadDepth: number;
      pressure: number;
      condition: string;
      notes: string;
    }>;
  };
  
  notes: string;
}

// Sample tyre data for development/testing - updating with id and status properties
export const SAMPLE_TIRES: Tire[] = [
  {
    id: 'tire-001',
    tireId: 'TYR-001',
    serialNumber: 'MIC2024001',
    dotCode: 'DOT HJYR VOR2 0124',
    manufacturingDate: '2024-01-15',
    brand: 'Michelin',
    model: 'X Line Energy D',
    pattern: 'Long Haul',
    size: { width: 315, aspectRatio: 80, rimDiameter: 22.5 },
    loadIndex: 152,
    speedRating: 'L',
    type: 'drive',
    purchaseDetails: {
      date: '2024-02-01',
      cost: 4500,
      supplier: 'Tyre Pro Ltd',
      warranty: '2 years',
      invoiceNumber: 'INV-2024-001'
    },
    installation: {
      vehicleId: '14L',
      position: 'POS3',
      mileageAtInstallation: 45000,
      installationDate: '2024-02-01',
      installedBy: 'Workshop'
    },
    condition: {
      treadDepth: 14.5,
      pressure: 110,
      temperature: 65,
      status: 'good',
      lastInspectionDate: '2024-06-15',
      nextInspectionDue: '2024-09-15'
    },
    status: 'in_service',
    mountStatus: 'mounted',
    maintenanceHistory: {
      rotations: [],
      repairs: [],
      inspections: [
        {
          date: '2024-06-15',
          inspector: 'Workshop',
          treadDepth: 14.5,
          pressure: 110,
          condition: 'Good',
          notes: 'Normal wear pattern observed'
        }
      ]
    },
    notes: 'Good condition, regular rotation schedule maintained'
  },
  {
    id: 'tire-002',
    tireId: 'TYR-002',
    serialNumber: 'BRI2024002',
    dotCode: 'DOT ABCD EFG2 0224',
    manufacturingDate: '2024-02-10',
    brand: 'Bridgestone',
    model: 'M788',
    pattern: 'Mixed Service',
    size: { width: 295, aspectRatio: 80, rimDiameter: 22.5 },
    loadIndex: 148,
    speedRating: 'L',
    type: 'steer',
    purchaseDetails: {
      date: '2024-03-01',
      cost: 3800,
      supplier: 'Fleet Tyres Inc',
      warranty: '18 months'
    },
    installation: {
      vehicleId: '22H',
      position: 'POS1',
      mileageAtInstallation: 52000,
      installationDate: '2024-03-01',
      installedBy: 'Workshop'
    },
    condition: {
      treadDepth: 16.2,
      pressure: 120,
      temperature: 58,
      status: 'good',
      lastInspectionDate: '2024-06-10',
      nextInspectionDue: '2024-09-10'
    },
    status: 'in_service',
    mountStatus: 'mounted',
    maintenanceHistory: {
      rotations: [],
      repairs: [],
      inspections: [
        {
          date: '2024-06-10',
          inspector: 'Workshop',
          treadDepth: 16.2,
          pressure: 120,
          condition: 'Excellent',
          notes: 'Even wear, excellent condition'
        }
      ]
    },
    notes: 'Excellent performance on steer axle'
  }
];

// Vehicle tire configuration interface
export interface VehicleTireConfiguration {
  vehicleType: string;
  positions: Array<{
    position: string;
    displayName: string;
    coordinates: { x: number; y: number };
    isSpare: boolean;
  }>;
}

// Adding missing exported functions
export const getTiresByVehicle = (vehicleId: string): Tire[] => {
  return SAMPLE_TIRES.filter(tire => tire.installation.vehicleId === vehicleId);
};

export const getTireByPosition = (vehicleId: string, position: string): Tire | undefined => {
  return SAMPLE_TIRES.find(tire => 
    tire.installation.vehicleId === vehicleId && tire.installation.position === position
  );
};

export const getVehicleTireConfiguration = (vehicleId: string): VehicleTireConfiguration | null => {
  // Mock configuration for different vehicle types
  const mockConfigs: Record<string, VehicleTireConfiguration> = {
    '14L': {
      vehicleType: 'horse',
      positions: [
        { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
        { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
        { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
        { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
        { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
        { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      ]
    },
    '22H': {
      vehicleType: 'horse',
      positions: [
        { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
        { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
        { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
        { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
        { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
        { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      ]
    }
  };
  
  return mockConfigs[vehicleId] || null;
};

// Utility function to get status color for UI
export const getTireStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'text-blue-600 bg-blue-100';
    case 'in_service': return 'text-green-600 bg-green-100';
    case 'spare': return 'text-yellow-600 bg-yellow-100';
    case 'retreaded': return 'text-purple-600 bg-purple-100';
    case 'scrapped': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// Utility function to calculate tyre cost per km
export const calculateCostPerKm = (tire: Tire, currentMileage: number): number => {
  const kmRun = (currentMileage - tire.installation.mileageAtInstallation) * 1.60934;
  return kmRun > 0 ? tire.purchaseDetails.cost / kmRun : 0;
};

// Utility function to estimate remaining life
export const estimateRemainingLife = (tire: Tire): number => {
  const currentTread = tire.condition.treadDepth;
  const minimumTread = 3; // Legal minimum
  const newTyreDepth = 20; // Assume new tyre starts at 20mm
  
  const usedTread = newTyreDepth - currentTread;
  const remainingTread = currentTread - minimumTread;
  
  if (usedTread <= 0) return 100000; // New tyre
  
  // Simplified wear calculation - in real system this would be more sophisticated
  const estimatedTotalLife = 100000; // km
  const wearPercentage = usedTread / newTyreDepth;
  const usedLife = wearPercentage * estimatedTotalLife;
  
  return Math.max(estimatedTotalLife - usedLife, 0);
};
