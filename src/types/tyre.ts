// Types for tyre store Firestore integration
import { Timestamp } from 'firebase/firestore';

// History event for a tyre movement
export interface StockEntryHistory {
  event: 'mounted' | 'removed' | 'moved' | 'retreaded' | 'scrapped';
  fromStore?: string;
  toStore: string;
  vehicleReg?: string;
  position?: TyrePosition;
  odometer: number;
  date: string; // ISO string
  user: string;
}

// Core tyre stock entry
export interface StockEntry {
  tyreId: string;            // unique identifier
  brand: string;
  pattern: string;
  size: string;
  type: string;              // e.g., Steer, Drive, Trailer
  vehicleReg?: string;       // only in VehicleTyreStore
  position?: TyrePosition;   // slot/axle position code
  currentTreadDepth: number; // mm
  lastMountOdometer: number; // odometer at mount
  currentOdometer: number;   // latest odometer reading
  kmCovered: number;         // cumulative km
  status: 'active' | 'holding' | 'retread' | 'scrapped';
  history: StockEntryHistory[];
}

// Firestore Tyre Store document
export interface TyreStore {
  id: string;                // e.g., 'VehicleTyreStore'
  name: string;              // human-friendly name
  entries: StockEntry[];
  dateAdded?: Timestamp;     // server timestamp
}

// Standardized tyre position names (e.g. V1-V10, T1-T16, P1-P6, Q1-Q10, SP)
export type TyrePosition =
  | `V${1|2|3|4|5|6|7|8|9|10}`
  | `T${1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16}`
  | `P${1|2|3|4|5|6}`
  | `Q${1|2|3|4|5|6|7|8|9|10}`
  | 'SP';

// Allocation entry for a single position on a vehicle
export interface TyreAllocation {
  position: TyrePosition;
  tyreCode?: string;
  brand?: string;
  pattern?: string;
  size?: string;
  lastInspectionDate?: string;
  treadDepth?: number;
  pressure?: number;
  odometerAtFitment?: number;
  kmSinceFitment?: number;
}

// Mapping of a fleet number to its tyre positions
export interface FleetTyreMapping {
  fleetNumber: string;
  vehicleType: string;
  positions: TyreAllocation[];
}
