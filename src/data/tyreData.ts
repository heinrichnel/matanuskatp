export const tyreTypes = ["steer", "drive", "trailer", "spare"] as const;
export type TyreType = (typeof tyreTypes)[number];

export enum TyreStoreLocation {
  HOLDING_BAY = "HOLDING_BAY",
  WORKSHOP = "WORKSHOP",
  ON_VEHICLE = "ON_VEHICLE",
  // voeg meer by soos nodig
}

// Ensure TyreConditionStatus is defined before TyreCondition
export enum TyreConditionStatus {
  GOOD = "good",
  WARNING = "warning",
  CRITICAL = "critical",
  NEEDS_REPLACEMENT = "needs_replacement",
}

export interface TyreSize {
  width: number; // bv. 315
  aspectRatio: number; // bv. 80
  rimDiameter: number; // bv. 22.5
  displayString?: string; // "315/80R22.5"
}

export interface TyreCondition {
  treadDepth: number; // mm
  pressure: number; // kPa
  temperature: number; // °C
  status: TyreConditionStatus;
  lastInspectionDate: string;
  nextInspectionDue: string;
}

export interface TyrePurchaseDetails {
  date: string;
  cost: number;
  supplier: string;
  warranty: string;
  invoiceNumber?: string;
}

export interface TyreInstallation {
  vehicleId: string;
  position: string;
  mileageAtInstallation: number;
  installationDate: string;
  installedBy: string;
}

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
  sidewallCondition?: string;
  remarks?: string;
  photos?: string[];
  status?: string;
  timestamp?: string;
}

export interface TyreMaintenanceHistory {
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
}

export enum TyreStatus {
  NEW = "new",
  IN_SERVICE = "in_service",
  SPARE = "spare",
  RETREADED = "retreaded",
  SCRAPPED = "scrapped",
}

export enum TyreMountStatus {
  MOUNTED = "mounted",
  UNMOUNTED = "unmounted",
  IN_STORAGE = "in_storage",
}

export interface Tyre {
  id: string;
  serialNumber: string;
  dotCode: string;
  manufacturingDate: string;
  brand: string;
  model: string;
  pattern: string;
  size: TyreSize; // Using the TyreSize interface
  loadIndex: number;
  speedRating: string;
  type: TyreType; // Using the TyreType from the `as const` array
  purchaseDetails: TyrePurchaseDetails; // Using the TyrePurchaseDetails interface
  installation: TyreInstallation; // Using the TyreInstallation interface
  condition: TyreCondition; // Using the TyreCondition interface
  status: TyreStatus; // Using the TyreStatus enum
  mountStatus: TyreMountStatus; // Using the TyreMountStatus enum
  maintenanceHistory: TyreMaintenanceHistory; // Using the TyreMaintenanceHistory interface
  kmRun: number;
  kmRunLimit: number;
  notes: string;
  location: TyreStoreLocation; // Using the TyreStoreLocation enum
  updatedAt?: any;
  createdAt?: any;
  // Note: 'tyreId' was in the second Tyre interface but not the first.
  // I've kept 'id' from the first and removed 'tyreId' to avoid redundancy unless it serves a distinct purpose.
  // If 'tyreId' is truly distinct from 'id', you'll need to clarify its intended use.
}

// --- CONSTANT DATA: BRANDS, SIZES, PATTERNS ---

export const TYRE_SIZES = [
  "315/80R22.5",
  "385/65R22.5",
  // voeg meer by soos nodig
];

export const TYRE_BRANDS = [
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
  "Michelin",
  "Bridgestone",
  "Continental",
  "Goodyear",
  "Yokohama",
  "Hankook",
  "Toyo",
  "Kumho",
];

export const TYRE_PATTERNS = [
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

// --- UTILITY FUNKSIES ---

// Sample tyre data for testing and analysis
export const SAMPLE_TYRES: Tyre[] = [
  {
    id: "sample1",
    serialNumber: "SN12345",
    dotCode: "DOT123ABC",
    manufacturingDate: "2023-01-01",
    brand: "Bridgestone",
    model: "Duravis",
    pattern: "TRACTION PRO",
    size: { width: 315, aspectRatio: 80, rimDiameter: 22.5 },
    loadIndex: 156,
    speedRating: "L",
    type: "drive",
    purchaseDetails: {
      date: "2023-02-01",
      cost: 4500,
      supplier: "TyreCo",
      warranty: "2 years",
    },
    installation: {
      vehicleId: "V001",
      position: "rear-right",
      mileageAtInstallation: 0,
      installationDate: "2023-02-15",
      installedBy: "John Doe",
    },
    condition: {
      treadDepth: 14,
      pressure: 800,
      temperature: 35,
      status: TyreConditionStatus.GOOD,
      lastInspectionDate: "2023-06-01",
      nextInspectionDue: "2023-09-01",
    },
    status: TyreStatus.IN_SERVICE,
    mountStatus: TyreMountStatus.MOUNTED,
    maintenanceHistory: {
      rotations: [],
      repairs: [],
      inspections: [],
    },
    kmRun: 45000,
    kmRunLimit: 100000,
    notes: "Good condition",
    location: TyreStoreLocation.ON_VEHICLE,
  },
  {
    id: "sample2",
    serialNumber: "SN67890",
    dotCode: "DOT456DEF",
    manufacturingDate: "2023-01-15",
    brand: "Michelin",
    model: "XZE2",
    pattern: "CPS60",
    size: { width: 315, aspectRatio: 80, rimDiameter: 22.5 },
    loadIndex: 156,
    speedRating: "L",
    type: "steer",
    purchaseDetails: {
      date: "2023-02-01",
      cost: 5200,
      supplier: "TyreCo",
      warranty: "3 years",
    },
    installation: {
      vehicleId: "V001",
      position: "front-right",
      mileageAtInstallation: 0,
      installationDate: "2023-02-15",
      installedBy: "John Doe",
    },
    condition: {
      treadDepth: 16,
      pressure: 820,
      temperature: 32,
      status: TyreConditionStatus.GOOD,
      lastInspectionDate: "2023-06-01",
      nextInspectionDue: "2023-09-01",
    },
    status: TyreStatus.IN_SERVICE,
    mountStatus: TyreMountStatus.MOUNTED,
    maintenanceHistory: {
      rotations: [],
      repairs: [],
      inspections: [],
    },
    kmRun: 45000,
    kmRunLimit: 120000,
    notes: "Excellent condition",
    location: TyreStoreLocation.ON_VEHICLE,
  },
  {
    id: "sample3",
    serialNumber: "SN24680",
    dotCode: "DOT789GHI",
    manufacturingDate: "2023-01-10",
    brand: "Goodyear",
    model: "KMAX",
    pattern: "FM07",
    size: { width: 315, aspectRatio: 80, rimDiameter: 22.5 },
    loadIndex: 156,
    speedRating: "L",
    type: "drive",
    purchaseDetails: {
      date: "2023-02-05",
      cost: 4800,
      supplier: "TyreCo",
      warranty: "2 years",
    },
    installation: {
      vehicleId: "V002",
      position: "rear-left",
      mileageAtInstallation: 1000,
      installationDate: "2023-02-20",
      installedBy: "Jane Smith",
    },
    condition: {
      treadDepth: 12,
      pressure: 790,
      temperature: 38,
      status: TyreConditionStatus.WARNING,
      lastInspectionDate: "2023-06-05",
      nextInspectionDue: "2023-08-05",
    },
    status: TyreStatus.IN_SERVICE,
    mountStatus: TyreMountStatus.MOUNTED,
    maintenanceHistory: {
      rotations: [],
      repairs: [],
      inspections: [],
    },
    kmRun: 50000,
    kmRunLimit: 90000,
    notes: "Some wear on outer edge",
    location: TyreStoreLocation.ON_VEHICLE,
  },
  {
    id: "sample4",
    serialNumber: "SN13579",
    dotCode: "DOT321JKL",
    manufacturingDate: "2023-01-05",
    brand: "Continental",
    model: "HDR2",
    pattern: "CP560",
    size: { width: 385, aspectRatio: 65, rimDiameter: 22.5 },
    loadIndex: 160,
    speedRating: "K",
    type: "trailer",
    purchaseDetails: {
      date: "2023-02-10",
      cost: 4300,
      supplier: "TyreCo",
      warranty: "2 years",
    },
    installation: {
      vehicleId: "V003",
      position: "trailer-right-1",
      mileageAtInstallation: 500,
      installationDate: "2023-02-25",
      installedBy: "Mike Johnson",
    },
    condition: {
      treadDepth: 15,
      pressure: 850,
      temperature: 30,
      status: TyreConditionStatus.GOOD,
      lastInspectionDate: "2023-06-10",
      nextInspectionDue: "2023-09-10",
    },
    status: TyreStatus.IN_SERVICE,
    mountStatus: TyreMountStatus.MOUNTED,
    maintenanceHistory: {
      rotations: [],
      repairs: [],
      inspections: [],
    },
    kmRun: 40000,
    kmRunLimit: 110000,
    notes: "Good condition",
    location: TyreStoreLocation.ON_VEHICLE,
  },
];

export const formatTyreSize = (size: TyreSize): string =>
  `${size.width}/${size.aspectRatio}R${size.rimDiameter}`;

export const parseTyreSize = (sizeString: string): TyreSize | null => {
  const match = sizeString.match(/(\d+)\/(\d+)R(\d+\.?\d*)/);
  if (match) {
    return {
      width: parseInt(match[1]),
      aspectRatio: parseInt(match[2]),
      rimDiameter: parseFloat(match[3]),
      displayString: sizeString,
    };
  }
  return null;
};

// Utility function to get tyres for a specific vehicle (mock implementation)
export const getTyresByVehicle = (vehicleId: string): Tyre[] => {
  // For now, return sample tyres as a placeholder
  // In a real implementation, this would filter tyres by vehicle ID
  return SAMPLE_TYRES.filter((tyre) => tyre.installation.vehicleId === vehicleId);
};

// Helper function for tyre status badge colors
export const getTyreStatusColor = (status: TyreStatus): string => {
  switch (status) {
    case TyreStatus.NEW:
      return "bg-green-500 text-white";
    case TyreStatus.IN_SERVICE:
      return "bg-blue-500 text-white";
    case TyreStatus.SPARE:
      return "bg-yellow-500 text-white";
    case TyreStatus.RETREADED:
      return "bg-orange-500 text-white";
    case TyreStatus.SCRAPPED:
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// Helper function for tyre condition badge colors
export const getTyreConditionColor = (status: TyreConditionStatus): string => {
  switch (status) {
    case TyreConditionStatus.GOOD:
      return "bg-green-500 text-white";
    case TyreConditionStatus.WARNING:
      return "bg-yellow-500 text-white";
    case TyreConditionStatus.CRITICAL:
      return "bg-red-500 text-white";
    case TyreConditionStatus.NEEDS_REPLACEMENT:
      return "bg-purple-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// Use the FleetTyreMapping and TyreAllocation from types/tyre.ts
import type { FleetTyreMapping, TyreAllocation, TyrePosition } from "@/types/tyre";

// Get tyre configuration for a vehicle
export const getVehicleTyreConfiguration = (vehicleId: string): FleetTyreMapping | null => {
  // Mock implementation
  if (!vehicleId) return null;

  // This would normally be determined by the vehicle type in a real implementation
  const vehicleType = vehicleId.includes("H")
    ? "horse"
    : vehicleId.includes("T")
      ? "interlink"
      : vehicleId.includes("F")
        ? "reefer"
        : "lmv";

  // Create sample positions based on vehicle type
  let positions: TyreAllocation[] = [];

  // Helper function to convert position string to TyrePosition
  const toTyrePosition = (index: number): TyrePosition => {
    if (vehicleType === "horse") {
      // V1-V10 for horse
      return `V${Math.min(index, 10) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}` as TyrePosition;
    } else if (vehicleType === "interlink") {
      // T1-T16 for interlink
      return `T${Math.min(index, 16) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16}` as TyrePosition;
    } else {
      // P1-P6 for LMV or others
      return `P${Math.min(index, 6) as 1 | 2 | 3 | 4 | 5 | 6}` as TyrePosition;
    }
  };

  if (vehicleType === "horse") {
    positions = Array.from({ length: 10 }, (_, i) => ({
      position: toTyrePosition(i + 1),
      tyreCode: `TY-${vehicleId}-${i + 1}`,
      brand: SAMPLE_TYRES[0]?.brand || "Unknown",
      pattern: SAMPLE_TYRES[0]?.pattern || "Unknown",
      size: SAMPLE_TYRES[0]?.size ? formatTyreSize(SAMPLE_TYRES[0].size) : "315/80R22.5",
      treadDepth: Math.floor(Math.random() * 10) + 5,
      pressure: 800 + Math.floor(Math.random() * 50),
      lastInspectionDate: new Date().toISOString().split("T")[0],
      odometerAtFitment: Math.floor(Math.random() * 50000),
      kmSinceFitment: Math.floor(Math.random() * 10000),
    }));
    positions.push({
      position: "SP" as TyrePosition,
      tyreCode: `TY-${vehicleId}-SP`,
    });
  } else if (vehicleType === "interlink") {
    positions = Array.from({ length: 16 }, (_, i) => ({
      position: toTyrePosition(i + 1),
      tyreCode: `TY-${vehicleId}-${i + 1}`,
      brand: SAMPLE_TYRES[0]?.brand || "Unknown",
      pattern: SAMPLE_TYRES[0]?.pattern || "Unknown",
      size: SAMPLE_TYRES[0]?.size ? formatTyreSize(SAMPLE_TYRES[0].size) : "315/80R22.5",
      treadDepth: Math.floor(Math.random() * 10) + 5,
      pressure: 800 + Math.floor(Math.random() * 50),
      lastInspectionDate: new Date().toISOString().split("T")[0],
      odometerAtFitment: Math.floor(Math.random() * 50000),
      kmSinceFitment: Math.floor(Math.random() * 10000),
    }));
    positions.push({
      position: "SP" as TyrePosition,
      tyreCode: `TY-${vehicleId}-SP1`,
    });
    positions.push({
      position: "SP" as TyrePosition,
      tyreCode: `TY-${vehicleId}-SP2`,
    });
  } else {
    positions = Array.from({ length: 6 }, (_, i) => ({
      position: toTyrePosition(i + 1),
      tyreCode: `TY-${vehicleId}-${i + 1}`,
      brand: SAMPLE_TYRES[0]?.brand || "Unknown",
      pattern: SAMPLE_TYRES[0]?.pattern || "Unknown",
      size: SAMPLE_TYRES[0]?.size ? formatTyreSize(SAMPLE_TYRES[0].size) : "315/80R22.5",
      treadDepth: Math.floor(Math.random() * 10) + 5,
      pressure: 800 + Math.floor(Math.random() * 50),
      lastInspectionDate: new Date().toISOString().split("T")[0],
      odometerAtFitment: Math.floor(Math.random() * 50000),
      kmSinceFitment: Math.floor(Math.random() * 10000),
    }));
    positions.push({
      position: "SP" as TyrePosition,
      tyreCode: `TY-${vehicleId}-SP`,
    });
  }

  return {
    fleetNumber: vehicleId,
    vehicleType,
    positions,
  };
};
