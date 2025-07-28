export const tyreTypes = ["steer", "drive", "trailer", "spare"] as const;
export type TyreType = typeof tyreTypes[number];

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
