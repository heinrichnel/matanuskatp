/**
 * This file re-exports components from their source files
 * to prevent import casing issues across the application
 */

// Re-export Button component
export { default as Button } from "./Button";

// Re-export Card components
export { Card, CardContent, CardHeader } from "./Card";

// Re-export Input component
export { Input } from "./input";

// Re-export Modal component
export { default as Modal } from "./Modal";

// Re-export Table components
export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

// Re-export GenericPlaceholderPage component
export { default as ApplicantInfoCard } from "./ApplicantInfoCard";
export { default as GenericPlaceholderPage } from "./GenericPlaceholderPage";

// Re-export new UI components
export { default as ProgressStepper } from "./ProgressStepper";
export { default as VerticalStepper } from "./VerticalStepper";
export { default as Select } from "./Select";
export { default as StatsCardGroup } from "./StatsCardGroup";

// src/types/wialon.ts (Simplified for map display)

export interface WialonUnitProfile {
  vehicle_class?: string;
  brand?: string;
  model?: string;
  year?: string;
  color?: string;
  engine_model?: string;
  registration_plate?: string; // Crucial for display
}

export interface WialonUnitLocation {
  t: number; // Timestamp (Unix time UTC)
  y: number; // Latitude
  x: number; // Longitude
  s: number; // Speed
  c?: number; // Course (direction)
  sc?: number; // Satellites count
}

export interface WialonUnit {
  id: number; // Unique ID (from Wialon)
  name: string; // Unit name (e.g., "24H - AFQ 1325 (Int Sim)")
  uid: string; // Wialon unique ID
  phone?: string;
  hardwareType?: string; // e.g., "Teltonika FMB920"
  iconUrl?: string; // URL for the unit's icon
  lastPosition?: WialonUnitLocation; // Last known position data
  profile: WialonUnitProfile; // Custom profile fields
  // Add other relevant fields from your Wialon config JSON as needed for display
  // ...
}
