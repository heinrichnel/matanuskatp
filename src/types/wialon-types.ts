// Minimal definitions for all missing types.
// Expand each as your data model requires!

export interface WialonPosition {
  x: number; // Longitude
  y: number; // Latitude
  s?: number; // Speed
  t?: number; // Timestamp
  c?: number; // Course
  sc?: number; // Satellites count
}

export interface WialonSensorDefinition {
  id: number;
  name: string;
  type?: string;
  // Add any extra sensor fields as needed
}

export interface WialonSensorStatus {
  [sensorId: string]: any; // Or define a stricter structure if you know it
}

export interface WialonHealthCheckFlags {
  [flag: string]: boolean; // Adjust as needed
}

export interface WialonDrivingBehaviorSettings {
  [key: string]: any; // Define fields as needed
}

export interface WialonCounters {
  [counter: string]: number; // Or refine if you know structure
}

export interface WialonUnit {
  // Properties
  id?: number;
  name?: string;
  uid?: string;
  phone?: string;
  hardwareType?: string;
  iconUrl?: string;
  lastPosition?: WialonPosition;

  // Methods (indien nodig, anders verwyder dit om verwarring te voorkom)
  getId?: () => number;
  getName?: () => string;
  getUID?: () => string;
  getPosition?: () => WialonPosition | undefined;
  getIconUrl?: () => string;

  profile: {
    vehicle_class?: string;
    brand?: string;
    model?: string;
    year?: string;
    color?: string;
    engine_model?: string;
    registration_plate?: string;
    primary_fuel_type?: string;
    cargo_type?: string;
    carrying_capacity?: string;
    axles?: string;
    effective_capacity?: string;
  };

  sensors_definitions?: WialonSensorDefinition[];
  sensor_status?: WialonSensorStatus;
  health_check?: WialonHealthCheckFlags;
  driving_behavior_settings?: WialonDrivingBehaviorSettings;
  counters?: WialonCounters;

  general?: {
    n: string;
    uid: string;
    ph?: string;
    hw?: string;
  };
}
