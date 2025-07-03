export interface Tyre {
  id: string;
  brand: string;
  model: string;
  size: string;
  serialNumber: string;
  dotCode: string;
  manufactureDate: string;
  installDetails: {
    date: string;
    position: string;
    vehicle: string;
    mileage: number;
  };
  treadDepth: number;
  pressure: number;
  lastInspection: string;
  status: 'good' | 'worn' | 'urgent';
  cost: number;
  estimatedLifespan: number;
  pattern?: string; // Optional for compatibility with filters
  currentMileage?: number;
  costPerKm?: number;
  inspectionHistory?: Array<{
    id: string;
    date: string;
    inspector: string;
    treadDepth: number;
    pressure: number;
    sidewallCondition?: string;
    status: string;
    timestamp: string;
  }>;
}

export interface TyreInspection {
  id: string;
  tyreId: string;
  date: string;
  inspector: string;
  treadDepth: number;
  pressure: number;
  sidewallCondition: string;
  status: string;
  notes?: string;
  timestamp: string;
}