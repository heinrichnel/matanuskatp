// src/types/trip.ts (or part of src/types/index.ts)

// Assuming a basic structure based on your mock data and common trip fields
export type TripStatus = 'active' | 'scheduled' | 'completed' | 'cancelled' | 'in_progress' | 'pending';
export type Currency = 'ZAR' | 'USD'; // Assuming these are the currencies

export interface Trip {
  id: string; // Firestore document ID
  title: string; // e.g., "Windhoek to Walvis Bay"
  status: TripStatus;
  loadDate: string; // ISO date string (YYYY-MM-DD) - represents the date the trip is scheduled for
  pickupDate: string; // ISO date string (YYYY-MM-DD)
  deliveryDate: string; // ISO date string (YYYY-MM-DD)
  route: string;
  vehicleId: string; // Link to vehicle
  driverId: string; // Link to driver
  estimatedRevenue: number;
  currency: Currency;
  // Add other relevant fields based on your actual Trip model in Firestore
  // e.g., clientName, origin, destination, actualPickupDate, actualDeliveryDate, etc.
  createdAt?: string; // ISO datetime string
  updatedAt?: string; // ISO datetime string
}
