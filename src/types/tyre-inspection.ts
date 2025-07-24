import { TyreConditionStatus } from './workshop-tyre-inventory';

export interface TyreInspectionData {
  vehicleId: string;
  position: string;
  inspectorName: string;
  currentOdometer: string;
  previousOdometer: string;
  distanceTraveled: number;
  treadDepth: string;
  pressure: string;
  condition: TyreConditionStatus | '';
  damage: string;
  notes: string;
  voiceNotes: string[];
  photos: string[];
  location: string;
  inspectionDate: string;
  signature: string;
}

export interface TyreInspectionRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  position: string;
  inspectorName: string;
  currentOdometer: number;
  previousOdometer: number;
  distanceTraveled: number;
  treadDepth: number;
  pressure: number;
  condition: TyreConditionStatus;
  damage: string;
  notes: string;
  photos: string[];
  location: string;
  inspectionDate: string;
  signature: string;
  createdAt: string;
}
