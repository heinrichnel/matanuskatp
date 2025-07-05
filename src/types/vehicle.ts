/**
 * Vehicle interface for fleet management
 */
export interface Vehicle {
  id: string;
  registrationNo: string;
  fleetNo: string;
  manufacturer: string;
  model: string;
  chassisNo?: string;
  engineNo?: string;
  status: VehicleStatus;
  type: VehicleType;
  category: VehicleCategory;
  series: VehicleSeries;
  mileage?: number;
}

/**
 * Vehicle status types
 */
export type VehicleStatus = 'active' | 'maintenance' | 'retired' | 'sold';

/**
 * Vehicle types
 */
export type VehicleType = 'heavy_truck' | 'light_vehicle' | 'trailer' | 'reefer' | 'generator';

/**
 * Vehicle categories
 */
export type VehicleCategory = 'truck' | 'trailer' | 'reefer' | 'generator';

/**
 * Vehicle series
 */
export type VehicleSeries = 'H' | 'L' | 'T' | 'F' | 'OTHER';

/**
 * Vehicle maintenance record
 */
export interface VehicleMaintenance {
  id: string;
  vehicleId: string;
  date: string;
  type: 'scheduled' | 'unscheduled' | 'emergency';
  description: string;
  cost: number;
  performedBy: string;
  mileage: number;
  parts: Array<{
    id: string;
    name: string;
    quantity: number;
    cost: number;
  }>;
  notes?: string;
}

/**
 * Vehicle fuel record
 */
export interface VehicleFuel {
  id: string;
  vehicleId: string;
  date: string;
  fuelType: 'diesel' | 'petrol';
  liters: number;
  cost: number;
  mileage: number;
  fullTank: boolean;
  location?: string;
}

/**
 * Vehicle assignment record
 */
export interface VehicleAssignment {
  id: string;
  vehicleId: string;
  driverId: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  purpose: string;
  notes?: string;
}

/**
 * Vehicle insurance record
 */
export interface VehicleInsurance {
  id: string;
  vehicleId: string;
  policyNumber: string;
  provider: string;
  startDate: string;
  endDate: string;
  coverageType: string;
  premium: number;
  documents?: string[];
}

/**
 * Vehicle registration record
 */
export interface VehicleRegistration {
  id: string;
  vehicleId: string;
  registrationNumber: string;
  issuedDate: string;
  expiryDate: string;
  authority: string;
  fee: number;
  documents?: string[];
}