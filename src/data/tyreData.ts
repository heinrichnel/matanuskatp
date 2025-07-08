// Centralized lists for tyre sizes, brands, types, and patterns

export const tyreSizes = [
  "315/80R22.5",
  "385/65R22.5",
];

export const tyreBrands = [
  "Firemax",
  "Triangle",
  "Terraking",
  "Compasal",
  "Windforce",
  "Pirelli",
  "Powertrac",
  "Sunfull",
  "Formula",
  "Wellplus",
  "Dunlop",
  "Sonix",
  "Techshield",
  "Aplus",
  "Macroyal",
  "Jinyu",
];

export const tyreTypes = [
  "SP",
  "Multi",
  "Steer",
  "Drive",
  "Trailer",
];

export const tyrePatterns = [
  "CPS60",
  "TRACTION PRO",
  "WH1020",
  "CPD82",
  "FM07",
  "VIGOROUS TM901",
  "CPT76",
  "FM188",
  "POWER WDM816",
  "POWER WDM916",
  "CP560",
  "WD2060",
  "POWERMAN666",
  "D802",
  "JY589",
  "JY711",
  "CONFORT EXP",
  "TR688",
  "SP580",
  "FM19",
  "HS268",
  "WA1060",
  "SP320A",
  "SX668",
  "FM66",
  "WDM916",
  "FM166",
  "WDM16",
  "HF638",
  "HF768",
  "FG01S",
  "HS102",
  "WD2020",
  "FM18",
  "Tracpro",
  "HF660",
  "ST011",
  "FM06",
  "TS778",
];

// Tyre brands available in the system
export const TYRE_BRANDS = [
  'Michelin', 'Bridgestone', 'Continental', 'Goodyear', 'Pirelli',
  'Dunlop', 'Yokohama', 'Hankook', 'Toyo', 'Kumho', 'Firemax',
  'TRIANGLE', 'Terraking', 'Compasal', 'Windforce'
];

// Tyre patterns/treads available
export const TYRE_PATTERNS = [
  'Long Haul', 'Regional', 'Mixed Service', 'Urban', 'All Position',
  'Steer', 'Drive', 'Trailer', 'All Season', 'TR688', 'HS102', 
  'WD2020', 'WD2060', 'CPD82', 'FG01S', 'HF660', 'CPS60', 
  'SX668', 'FM66', 'WDM916', 'FM166'
];

// Tyre size interface
export interface TyreSize {
  width: number;        // mm (e.g., 295, 315)
  aspectRatio: number;  // % (e.g., 80, 75)
  rimDiameter: number;  // inches (e.g., 22.5, 24.5)
}

// Tyre condition interface
export interface TyreCondition {
  treadDepth: number;    // mm
  pressure: number;      // PSI
  temperature: number;   // Celsius
  status: 'good' | 'warning' | 'critical' | 'needs_replacement';
  lastInspectionDate: string;
  nextInspectionDue: string;
}

// Tyre inspection entry
export interface TyreInspectionEntry {
  id: string;
  date: string;
  inspector: string;
  treadDepth: number;
  pressure: number;
  temperature: number;
  condition: string;
  notes: string;
  images?: string[];
}

// Main Tyre interface
export interface Tyre {
  id: string;
  tyreId: string;
  serialNumber: string;
  dotCode: string;
  manufacturingDate: string;
  brand: string;
  model: string;
  pattern: string;
  size: TyreSize;
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
  
  condition: TyreCondition;
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
    inspections: TyreInspectionEntry[];
  };
  
  milesRun: number;
  kmRunLimit: number;
  notes: string;
}

// Vehicle tyre configuration interface
export interface VehicleTyreConfiguration {
  vehicleType: string;
  positions: Array<{
    position: string;
    displayName: string;
    coordinates: { x: number; y: number };
    isSpare: boolean;
  }>;
}

// Tyre inventory item interface
export interface TyreInventoryItem {
  id: string;
  brand: string;
  model: string;
  pattern: string;
  size: string;
  quantity: number;
  minStock: number;
  cost: number;
  supplier: string;
  location: string;
}

// Sample tyre data for development/testing
export const SAMPLE_TYRES: Tyre[] = [
  {
    id: 'tyre-14l-pos1',
    tyreId: 'TYR-14L-001',
    serialNumber: 'MIC2024001',
    dotCode: 'DOT HJYR VOR2 0124',
    manufacturingDate: '2024-01-15',
    brand: 'Michelin',
    model: 'X Line Energy D',
    pattern: 'Long Haul',
    size: { width: 315, aspectRatio: 80, rimDiameter: 22.5 },
    loadIndex: 152,
    speedRating: 'L',
    type: 'steer',
    purchaseDetails: {
      date: '2024-02-01',
      cost: 4500,
      supplier: 'Tyre Pro Ltd',
      warranty: '2 years',
      invoiceNumber: 'INV-2024-001'
    },
    installation: {
      vehicleId: '14L',
      position: 'POS1',
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
          id: 'insp-001',
          date: '2024-06-15',
          inspector: 'Workshop',
          treadDepth: 14.5,
          pressure: 110,
          temperature: 65,
          condition: 'Good',
          notes: 'Normal wear pattern observed'
        }
      ]
    },
    milesRun: 25000,
    kmRunLimit: 100000,
    notes: 'Good condition, regular rotation schedule maintained'
  },
  {
    id: 'tyre-22h-pos2',
    tyreId: 'TYR-22H-002',
    serialNumber: 'BRI2024002',
    dotCode: 'DOT ABCD EFG2 0224',
    manufacturingDate: '2024-02-10',
    brand: 'Bridgestone',
    model: 'M788',
    pattern: 'Mixed Service',
    size: { width: 295, aspectRatio: 80, rimDiameter: 22.5 },
    loadIndex: 148,
    speedRating: 'L',
    type: 'drive',
    purchaseDetails: {
      date: '2024-03-01',
      cost: 3800,
      supplier: 'Fleet Tyres Inc',
      warranty: '18 months'
    },
    installation: {
      vehicleId: '22H',
      position: 'POS2',
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
          id: 'insp-002',
          date: '2024-06-10',
          inspector: 'Workshop',
          treadDepth: 16.2,
          pressure: 120,
          temperature: 58,
          condition: 'Excellent',
          notes: 'Even wear, excellent condition'
        }
      ]
    },
    milesRun: 18000,
    kmRunLimit: 100000,
    notes: 'Excellent performance on drive axle'
  }
];

// Sample inventory data
export const SAMPLE_TYRE_INVENTORY: TyreInventoryItem[] = [
  {
    id: '1',
    brand: 'Michelin',
    model: 'X Line Energy D',
    pattern: 'Long Haul',
    size: '295/80R22.5',
    quantity: 12,
    minStock: 8,
    cost: 450,
    supplier: 'Tyre Pro Ltd',
    location: 'Warehouse A'
  },
  {
    id: '2',
    brand: 'Bridgestone',
    model: 'M788',
    pattern: 'Mixed Service',
    size: '295/80R22.5',
    quantity: 6,
    minStock: 10,
    cost: 420,
    supplier: 'Fleet Tyres Inc',
    location: 'Warehouse A'
  },
  {
    id: '3',
    brand: 'Continental',
    model: 'HDR2',
    pattern: 'Regional',
    size: '11R22.5',
    quantity: 15,
    minStock: 5,
    cost: 380,
    supplier: 'Continental Direct',
    location: 'Warehouse B'
  }
];

// Vehicle configurations
const VEHICLE_TYRE_CONFIGS: Record<string, VehicleTyreConfiguration> = {
  // HORSES (Truck Tractors, 11 positions each)
  '14L': {
    vehicleType: 'horse',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Mid Left Outer', coordinates: { x: 15, y: 55 }, isSpare: false },
      { position: 'POS8', displayName: 'Mid Left Inner', coordinates: { x: 25, y: 55 }, isSpare: false },
      { position: 'POS9', displayName: 'Mid Right Inner', coordinates: { x: 75, y: 55 }, isSpare: false },
      { position: 'POS10', displayName: 'Mid Right Outer', coordinates: { x: 85, y: 55 }, isSpare: false },
      { position: 'POS11', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  },
  '15L': {
    vehicleType: 'horse',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Mid Left Outer', coordinates: { x: 15, y: 55 }, isSpare: false },
      { position: 'POS8', displayName: 'Mid Left Inner', coordinates: { x: 25, y: 55 }, isSpare: false },
      { position: 'POS9', displayName: 'Mid Right Inner', coordinates: { x: 75, y: 55 }, isSpare: false },
      { position: 'POS10', displayName: 'Mid Right Outer', coordinates: { x: 85, y: 55 }, isSpare: false },
      { position: 'POS11', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  },
  '21H': {
    vehicleType: 'horse',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Mid Left Outer', coordinates: { x: 15, y: 55 }, isSpare: false },
      { position: 'POS8', displayName: 'Mid Left Inner', coordinates: { x: 25, y: 55 }, isSpare: false },
      { position: 'POS9', displayName: 'Mid Right Inner', coordinates: { x: 75, y: 55 }, isSpare: false },
      { position: 'POS10', displayName: 'Mid Right Outer', coordinates: { x: 85, y: 55 }, isSpare: false },
      { position: 'POS11', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
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
      { position: 'POS7', displayName: 'Mid Left Outer', coordinates: { x: 15, y: 55 }, isSpare: false },
      { position: 'POS8', displayName: 'Mid Left Inner', coordinates: { x: 25, y: 55 }, isSpare: false },
      { position: 'POS9', displayName: 'Mid Right Inner', coordinates: { x: 75, y: 55 }, isSpare: false },
      { position: 'POS10', displayName: 'Mid Right Outer', coordinates: { x: 85, y: 55 }, isSpare: false },
      { position: 'POS11', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  },
  '23H': {
    vehicleType: 'horse',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Mid Left Outer', coordinates: { x: 15, y: 55 }, isSpare: false },
      { position: 'POS8', displayName: 'Mid Left Inner', coordinates: { x: 25, y: 55 }, isSpare: false },
      { position: 'POS9', displayName: 'Mid Right Inner', coordinates: { x: 75, y: 55 }, isSpare: false },
      { position: 'POS10', displayName: 'Mid Right Outer', coordinates: { x: 85, y: 55 }, isSpare: false },
      { position: 'POS11', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  },
  '24H': {
    vehicleType: 'horse',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Mid Left Outer', coordinates: { x: 15, y: 55 }, isSpare: false },
      { position: 'POS8', displayName: 'Mid Left Inner', coordinates: { x: 25, y: 55 }, isSpare: false },
      { position: 'POS9', displayName: 'Mid Right Inner', coordinates: { x: 75, y: 55 }, isSpare: false },
      { position: 'POS10', displayName: 'Mid Right Outer', coordinates: { x: 85, y: 55 }, isSpare: false },
      { position: 'POS11', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  },
  '26H': {
    vehicleType: 'horse',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Mid Left Outer', coordinates: { x: 15, y: 55 }, isSpare: false },
      { position: 'POS8', displayName: 'Mid Left Inner', coordinates: { x: 25, y: 55 }, isSpare: false },
      { position: 'POS9', displayName: 'Mid Right Inner', coordinates: { x: 75, y: 55 }, isSpare: false },
      { position: 'POS10', displayName: 'Mid Right Outer', coordinates: { x: 85, y: 55 }, isSpare: false },
      { position: 'POS11', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  },
  '28H': {
    vehicleType: 'horse',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Mid Left Outer', coordinates: { x: 15, y: 55 }, isSpare: false },
      { position: 'POS8', displayName: 'Mid Left Inner', coordinates: { x: 25, y: 55 }, isSpare: false },
      { position: 'POS9', displayName: 'Mid Right Inner', coordinates: { x: 75, y: 55 }, isSpare: false },
      { position: 'POS10', displayName: 'Mid Right Outer', coordinates: { x: 85, y: 55 }, isSpare: false },
      { position: 'POS11', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  },
  '31H': {
    vehicleType: 'horse',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Mid Left Outer', coordinates: { x: 15, y: 55 }, isSpare: false },
      { position: 'POS8', displayName: 'Mid Left Inner', coordinates: { x: 25, y: 55 }, isSpare: false },
      { position: 'POS9', displayName: 'Mid Right Inner', coordinates: { x: 75, y: 55 }, isSpare: false },
      { position: 'POS10', displayName: 'Mid Right Outer', coordinates: { x: 85, y: 55 }, isSpare: false },
      { position: 'POS11', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  },
  '32H': {
    vehicleType: 'horse',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Mid Left Outer', coordinates: { x: 15, y: 55 }, isSpare: false },
      { position: 'POS8', displayName: 'Mid Left Inner', coordinates: { x: 25, y: 55 }, isSpare: false },
      { position: 'POS9', displayName: 'Mid Right Inner', coordinates: { x: 75, y: 55 }, isSpare: false },
      { position: 'POS10', displayName: 'Mid Right Outer', coordinates: { x: 85, y: 55 }, isSpare: false },
      { position: 'POS11', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  },
  // 29H - Special 11-position with spare
  '29H': {
    vehicleType: 'horse',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Mid Left Outer', coordinates: { x: 15, y: 55 }, isSpare: false },
      { position: 'POS8', displayName: 'Mid Left Inner', coordinates: { x: 25, y: 55 }, isSpare: false },
      { position: 'POS9', displayName: 'Mid Right Inner', coordinates: { x: 75, y: 55 }, isSpare: false },
      { position: 'POS10', displayName: 'Mid Right Outer', coordinates: { x: 85, y: 55 }, isSpare: false },
      { position: 'POS11', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  },
  // INTERLINKS (18 positions each: 16 tyres + 2 spares)
  '1T': {
    vehicleType: 'interlink',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 10, y: 20 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 90, y: 20 }, isSpare: false },
      { position: 'POS3', displayName: 'Axle 1 Left Outer', coordinates: { x: 5, y: 35 }, isSpare: false },
      { position: 'POS4', displayName: 'Axle 1 Left Inner', coordinates: { x: 15, y: 35 }, isSpare: false },
      { position: 'POS5', displayName: 'Axle 1 Right Inner', coordinates: { x: 85, y: 35 }, isSpare: false },
      { position: 'POS6', displayName: 'Axle 1 Right Outer', coordinates: { x: 95, y: 35 }, isSpare: false },
      { position: 'POS7', displayName: 'Axle 2 Left Outer', coordinates: { x: 5, y: 50 }, isSpare: false },
      { position: 'POS8', displayName: 'Axle 2 Left Inner', coordinates: { x: 15, y: 50 }, isSpare: false },
      { position: 'POS9', displayName: 'Axle 2 Right Inner', coordinates: { x: 85, y: 50 }, isSpare: false },
      { position: 'POS10', displayName: 'Axle 2 Right Outer', coordinates: { x: 95, y: 50 }, isSpare: false },
      { position: 'POS11', displayName: 'Axle 3 Left Outer', coordinates: { x: 5, y: 65 }, isSpare: false },
      { position: 'POS12', displayName: 'Axle 3 Left Inner', coordinates: { x: 15, y: 65 }, isSpare: false },
      { position: 'POS13', displayName: 'Axle 3 Right Inner', coordinates: { x: 85, y: 65 }, isSpare: false },
      { position: 'POS14', displayName: 'Axle 3 Right Outer', coordinates: { x: 95, y: 65 }, isSpare: false },
      { position: 'POS15', displayName: 'Axle 4 Left Outer', coordinates: { x: 5, y: 80 }, isSpare: false },
      { position: 'POS16', displayName: 'Axle 4 Left Inner', coordinates: { x: 15, y: 80 }, isSpare: false },
      { position: 'POS17', displayName: 'Spare 1', coordinates: { x: 30, y: 90 }, isSpare: true },
      { position: 'POS18', displayName: 'Spare 2', coordinates: { x: 70, y: 90 }, isSpare: true },
    ]
  },
  '2T': {
    vehicleType: 'interlink',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 10, y: 20 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 90, y: 20 }, isSpare: false },
      { position: 'POS3', displayName: 'Axle 1 Left Outer', coordinates: { x: 5, y: 35 }, isSpare: false },
      { position: 'POS4', displayName: 'Axle 1 Left Inner', coordinates: { x: 15, y: 35 }, isSpare: false },
      { position: 'POS5', displayName: 'Axle 1 Right Inner', coordinates: { x: 85, y: 35 }, isSpare: false },
      { position: 'POS6', displayName: 'Axle 1 Right Outer', coordinates: { x: 95, y: 35 }, isSpare: false },
      { position: 'POS7', displayName: 'Axle 2 Left Outer', coordinates: { x: 5, y: 50 }, isSpare: false },
      { position: 'POS8', displayName: 'Axle 2 Left Inner', coordinates: { x: 15, y: 50 }, isSpare: false },
      { position: 'POS9', displayName: 'Axle 2 Right Inner', coordinates: { x: 85, y: 50 }, isSpare: false },
      { position: 'POS10', displayName: 'Axle 2 Right Outer', coordinates: { x: 95, y: 50 }, isSpare: false },
      { position: 'POS11', displayName: 'Axle 3 Left Outer', coordinates: { x: 5, y: 65 }, isSpare: false },
      { position: 'POS12', displayName: 'Axle 3 Left Inner', coordinates: { x: 15, y: 65 }, isSpare: false },
      { position: 'POS13', displayName: 'Axle 3 Right Inner', coordinates: { x: 85, y: 65 }, isSpare: false },
      { position: 'POS14', displayName: 'Axle 3 Right Outer', coordinates: { x: 95, y: 65 }, isSpare: false },
      { position: 'POS15', displayName: 'Axle 4 Left Outer', coordinates: { x: 5, y: 80 }, isSpare: false },
      { position: 'POS16', displayName: 'Axle 4 Left Inner', coordinates: { x: 15, y: 80 }, isSpare: false },
      { position: 'POS17', displayName: 'Spare 1', coordinates: { x: 30, y: 90 }, isSpare: true },
      { position: 'POS18', displayName: 'Spare 2', coordinates: { x: 70, y: 90 }, isSpare: true },
    ]
  },
  '3T': {
    vehicleType: 'interlink',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 10, y: 20 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 90, y: 20 }, isSpare: false },
      { position: 'POS3', displayName: 'Axle 1 Left Outer', coordinates: { x: 5, y: 35 }, isSpare: false },
      { position: 'POS4', displayName: 'Axle 1 Left Inner', coordinates: { x: 15, y: 35 }, isSpare: false },
      { position: 'POS5', displayName: 'Axle 1 Right Inner', coordinates: { x: 85, y: 35 }, isSpare: false },
      { position: 'POS6', displayName: 'Axle 1 Right Outer', coordinates: { x: 95, y: 35 }, isSpare: false },
      { position: 'POS7', displayName: 'Axle 2 Left Outer', coordinates: { x: 5, y: 50 }, isSpare: false },
      { position: 'POS8', displayName: 'Axle 2 Left Inner', coordinates: { x: 15, y: 50 }, isSpare: false },
      { position: 'POS9', displayName: 'Axle 2 Right Inner', coordinates: { x: 85, y: 50 }, isSpare: false },
      { position: 'POS10', displayName: 'Axle 2 Right Outer', coordinates: { x: 95, y: 50 }, isSpare: false },
      { position: 'POS11', displayName: 'Axle 3 Left Outer', coordinates: { x: 5, y: 65 }, isSpare: false },
      { position: 'POS12', displayName: 'Axle 3 Left Inner', coordinates: { x: 15, y: 65 }, isSpare: false },
      { position: 'POS13', displayName: 'Axle 3 Right Inner', coordinates: { x: 85, y: 65 }, isSpare: false },
      { position: 'POS14', displayName: 'Axle 3 Right Outer', coordinates: { x: 95, y: 65 }, isSpare: false },
      { position: 'POS15', displayName: 'Axle 4 Left Outer', coordinates: { x: 5, y: 80 }, isSpare: false },
      { position: 'POS16', displayName: 'Axle 4 Left Inner', coordinates: { x: 15, y: 80 }, isSpare: false },
      { position: 'POS17', displayName: 'Spare 1', coordinates: { x: 30, y: 90 }, isSpare: true },
      { position: 'POS18', displayName: 'Spare 2', coordinates: { x: 70, y: 90 }, isSpare: true },
    ]
  },
  '4T': {
    vehicleType: 'interlink',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 10, y: 20 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 90, y: 20 }, isSpare: false },
      { position: 'POS3', displayName: 'Axle 1 Left Outer', coordinates: { x: 5, y: 35 }, isSpare: false },
      { position: 'POS4', displayName: 'Axle 1 Left Inner', coordinates: { x: 15, y: 35 }, isSpare: false },
      { position: 'POS5', displayName: 'Axle 1 Right Inner', coordinates: { x: 85, y: 35 }, isSpare: false },
      { position: 'POS6', displayName: 'Axle 1 Right Outer', coordinates: { x: 95, y: 35 }, isSpare: false },
      { position: 'POS7', displayName: 'Axle 2 Left Outer', coordinates: { x: 5, y: 50 }, isSpare: false },
      { position: 'POS8', displayName: 'Axle 2 Left Inner', coordinates: { x: 15, y: 50 }, isSpare: false },
      { position: 'POS9', displayName: 'Axle 2 Right Inner', coordinates: { x: 85, y: 50 }, isSpare: false },
      { position: 'POS10', displayName: 'Axle 2 Right Outer', coordinates: { x: 95, y: 50 }, isSpare: false },
      { position: 'POS11', displayName: 'Axle 3 Left Outer', coordinates: { x: 5, y: 65 }, isSpare: false },
      { position: 'POS12', displayName: 'Axle 3 Left Inner', coordinates: { x: 15, y: 65 }, isSpare: false },
      { position: 'POS13', displayName: 'Axle 3 Right Inner', coordinates: { x: 85, y: 65 }, isSpare: false },
      { position: 'POS14', displayName: 'Axle 3 Right Outer', coordinates: { x: 95, y: 65 }, isSpare: false },
      { position: 'POS15', displayName: 'Axle 4 Left Outer', coordinates: { x: 5, y: 80 }, isSpare: false },
      { position: 'POS16', displayName: 'Axle 4 Left Inner', coordinates: { x: 15, y: 80 }, isSpare: false },
      { position: 'POS17', displayName: 'Spare 1', coordinates: { x: 30, y: 90 }, isSpare: true },
      { position: 'POS18', displayName: 'Spare 2', coordinates: { x: 70, y: 90 }, isSpare: true },
    ]
  },
  // REEFERS (8 positions each: 6 tyres + 2 spares)
  '4F': {
    vehicleType: 'reefer',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Spare 1', coordinates: { x: 30, y: 90 }, isSpare: true },
      { position: 'POS8', displayName: 'Spare 2', coordinates: { x: 70, y: 90 }, isSpare: true },
    ]
  },
  '5F': {
    vehicleType: 'reefer',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Spare 1', coordinates: { x: 30, y: 90 }, isSpare: true },
      { position: 'POS8', displayName: 'Spare 2', coordinates: { x: 70, y: 90 }, isSpare: true },
    ]
  },
  '6F': {
    vehicleType: 'reefer',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Spare 1', coordinates: { x: 30, y: 90 }, isSpare: true },
      { position: 'POS8', displayName: 'Spare 2', coordinates: { x: 70, y: 90 }, isSpare: true },
    ]
  },
  '7F': {
    vehicleType: 'reefer',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 20, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 80, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 15, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 25, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 75, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 85, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Spare 1', coordinates: { x: 30, y: 90 }, isSpare: true },
      { position: 'POS8', displayName: 'Spare 2', coordinates: { x: 70, y: 90 }, isSpare: true },
    ]
  },
  // LMVs ONLY (7 positions: 6 tyres + 1 spare)
  '4H': {
    vehicleType: 'lmv',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 25, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 75, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 20, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 30, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 70, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 80, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  },
  '6H': {
    vehicleType: 'lmv',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 25, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 75, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 20, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 30, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 70, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 80, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  },
  'UD': {
    vehicleType: 'lmv',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 25, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 75, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 20, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 30, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 70, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 80, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  },
  '30H': {
    vehicleType: 'lmv',
    positions: [
      { position: 'POS1', displayName: 'Front Left', coordinates: { x: 25, y: 30 }, isSpare: false },
      { position: 'POS2', displayName: 'Front Right', coordinates: { x: 75, y: 30 }, isSpare: false },
      { position: 'POS3', displayName: 'Rear Left Outer', coordinates: { x: 20, y: 70 }, isSpare: false },
      { position: 'POS4', displayName: 'Rear Left Inner', coordinates: { x: 30, y: 70 }, isSpare: false },
      { position: 'POS5', displayName: 'Rear Right Inner', coordinates: { x: 70, y: 70 }, isSpare: false },
      { position: 'POS6', displayName: 'Rear Right Outer', coordinates: { x: 80, y: 70 }, isSpare: false },
      { position: 'POS7', displayName: 'Spare', coordinates: { x: 50, y: 90 }, isSpare: true },
    ]
  }
};

// Utility functions
export const getTyresByVehicle = (vehicleId: string): Tyre[] => {
  return SAMPLE_TYRES.filter(tyre => tyre.installation.vehicleId === vehicleId);
};

export const getTyreByPosition = (vehicleId: string, position: string): Tyre | undefined => {
  return SAMPLE_TYRES.find(tyre => 
    tyre.installation.vehicleId === vehicleId && tyre.installation.position === position
  );
};

export const getVehicleTyreConfiguration = (vehicleId: string): VehicleTyreConfiguration | null => {
  return VEHICLE_TYRE_CONFIGS[vehicleId] || null;
};

export const getTyreStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'text-blue-600 bg-blue-100';
    case 'in_service': return 'text-green-600 bg-green-100';
    case 'spare': return 'text-yellow-600 bg-yellow-100';
    case 'retreaded': return 'text-purple-600 bg-purple-100';
    case 'scrapped': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getTyreConditionColor = (status: string) => {
  switch (status) {
    case 'good': return 'text-green-600 bg-green-100';
    case 'warning': return 'text-yellow-600 bg-yellow-100';
    case 'critical': return 'text-red-600 bg-red-100';
    case 'needs_replacement': return 'text-red-800 bg-red-200';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const calculateCostPerKm = (tyre: Tyre, currentMileage?: number): number => {
  const mileage = currentMileage || tyre.milesRun;
  const kmRun = (mileage - tyre.installation.mileageAtInstallation) * 1.60934;
  return kmRun > 0 ? tyre.purchaseDetails.cost / kmRun : 0;
};

export const estimateRemainingLife = (tyre: Tyre): number => {
  const currentTread = tyre.condition.treadDepth;
  const minimumTread = 3; // Legal minimum
  const newTyreDepth = 20; // Assume new tyre starts at 20mm
  
  const usedTread = newTyreDepth - currentTread;
  const remainingTread = currentTread - minimumTread;
  console.log('Remaining Tread:', remainingTread);
  
  if (usedTread <= 0) return 100000; // New tyre
  
  const estimatedTotalLife = 100000; // km
  const wearPercentage = usedTread / newTyreDepth;
  const usedLife = wearPercentage * estimatedTotalLife;
  
  return Math.max(estimatedTotalLife - usedLife, 0);
};

export const getUniqueTyreBrands = (): string[] => {
  return [...new Set(SAMPLE_TYRES.map(tyre => tyre.brand))];
};

export const getUniqueTyrePatterns = (): string[] => {
  return [...new Set(SAMPLE_TYRES.map(tyre => tyre.pattern))];
};

export const formatTyreSize = (size: TyreSize): string => {
  return `${size.width}/${size.aspectRatio}R${size.rimDiameter}`;
};

export const parseTyreSize = (sizeString: string): TyreSize | null => {
  const match = sizeString.match(/(\d+)\/(\d+)R(\d+\.?\d*)/);
  if (match) {
    return {
      width: parseInt(match[1]),
      aspectRatio: parseInt(match[2]),
      rimDiameter: parseFloat(match[3])
    };
  }
  return null;
};