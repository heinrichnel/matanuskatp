// src/types/wialon.ts

/**
 * GeoJSON Types for mapping Wialon data to map formats
 */
export interface GeoJsonPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface GeoJsonFeature<T = { [key: string]: any }> {
  type: "Feature";
  geometry: GeoJsonPoint;
  properties: T;
}

export interface GeoJsonFeatureCollection<T = { [key: string]: any }> {
  type: "FeatureCollection";
  features: Array<GeoJsonFeature<T>>;
}

/**
 * Interface for Wialon sensor definition
 */
export interface WialonSensorDefinition {
  name: string;
  type: string;
  parameter: string;
}

/**
 * Interface for Wialon driving behavior settings
 */
export interface WialonDrivingBehaviorSettings {
  acceleration_extreme_penalty?: number;
  speeding_extreme_penalty?: number;
  [key: string]: number | undefined;
}

/**
 * Interface for Wialon health check flags
 */
export interface WialonHealthCheckFlags {
  health_low_battery?: boolean;
  [key: string]: boolean | undefined;
}

/**
 * Interface for Wialon sensor status values
 */
export interface WialonSensorStatus {
  current_fuel_LHS_tank?: number;
  current_fuel_RHS_tank?: number;
  ignition_status?: string;
  signal_strength?: number;
  [key: string]: number | string | undefined;
}

/**
 * Interface for Wialon counters
 */
export interface WialonCounters {
  counter_cfl?: number;
  [key: string]: number | undefined;
}

/**
 * Comprehensive type for Wialon unit data
 */
export interface WialonUnit {
  // Core identification - can be properties or functions
  id?: number; // Unique ID (from Wialon)
  getId?: () => number; // Function to get ID

  name?: string; // Unit name (e.g., "21H - ADS 4865")
  getName?: () => string; // Function to get name

  uid?: string; // Wialon unique ID
  getUID?: () => string; // Function to get UID

  // Contact and hardware details
  phone?: string; // e.g., "+263773717259"
  hardwareType?: string; // e.g., "Teltonika FMB920"
  iconUrl?: string; // URL for the unit's icon (e.g., "A_39.png")
  getIconUrl?: () => string; // Function to get icon URL

  // Position data
  lastPosition?: WialonPosition;
  getPosition?: () => WialonPosition;

  // Vehicle profile information
  profile: {
    vehicle_class?: string; // e.g., "heavy_truck"
    brand?: string; // e.g., "Scania"
    model?: string; // e.g., "G460"
    year?: string; // e.g., "2010"
    color?: string; // e.g., "White"
    engine_model?: string; // e.g., "460HP"
    registration_plate?: string;
    primary_fuel_type?: string; // e.g., "Diesel"
    cargo_type?: string; // e.g., "32 Ton"
    carrying_capacity?: string;
    axles?: string;
    effective_capacity?: string;
  };

  // Extended properties from GeoJSON structure
  sensors_definitions?: WialonSensorDefinition[]; // Array of sensor definitions
  sensor_status?: WialonSensorStatus; // Current sensor readings
  health_check?: WialonHealthCheckFlags; // Health status flags
  driving_behavior_settings?: WialonDrivingBehaviorSettings; // Driving behavior configuration
  counters?: WialonCounters; // Various counters

  // Legacy support for different property structures
  general?: {
    n: string; // name
    uid: string;
    ph?: string; // phone
    hw?: string; // hardware
  };
}

/**
 * Position data structure from Wialon API
 * Supports both raw API format (x, y, s, t, etc.) and more readable format (longitude, latitude, etc.)
 */
export interface WialonPosition {
  // Raw API format
  x?: number; // Longitude
  y?: number; // Latitude
  z?: number; // Altitude
  s?: number; // Speed in km/h
  c?: number; // Course in degrees
  t?: number; // Timestamp (Unix time)
  sc?: number; // Satellites count

  // More readable format
  longitude?: number; // Same as x
  latitude?: number; // Same as y
  altitude?: number; // Same as z
  speed?: number; // Same as s
  course?: number; // Same as c
  timestamp?: number; // Same as t
  satellites?: number; // Same as sc
}
