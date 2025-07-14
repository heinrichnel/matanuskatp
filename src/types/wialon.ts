// src/types/wialon.ts

/** Wialon Unit (vehicle/tracker) */
export interface WialonUnit {
  getId(): number | string;
  getName(): string;
  getPosition?(): WialonPosition | undefined;
  getIconUrl?(size?: number): string;
  // Add more as needed
}

/** Wialon Unit Position (last message) */
export interface WialonPosition {
  x: number;         // Longitude
  y: number;         // Latitude
  t?: number;        // Timestamp (epoch seconds)
  s?: number;        // Speed
}

/** Wialon Driver */
export interface WialonDriver {
  id: number | string;
  n: string;        // Name
  ds?: string;      // Description
  p?: string;       // Phone
  // Add more as needed
}

/** Wialon Geofence ("zone") */
export interface WialonGeofence {
  id: number | string;
  n: string;           // Name
  t: number;           // Type: 3=circle, 2=polygon, 1=polyline
  w?: number;          // Radius (for circles)
  c?: number;          // Color (decimal)
  p?: any[];           // Points (geometry)
  // Add more as needed
}

/** Wialon Session (JS SDK) */
export interface WialonSession {
  initSession(url: string): void;
  loginToken(token: string, password: string, cb: (code: number) => void): void;
  logout(cb: (code: number) => void): void;
  loadLibrary(lib: string, cb?: () => void): void;
  updateDataFlags(
    flags: any[],
    cb: (code: number) => void
  ): void;
  getItems(type: string): any[];
  getItem(id: number | string): any;
}

/** For global access in window object */
declare global {
  interface Window {
    wialon: any;
  }
}

// Add WialonResource type
export type WialonResource = {
  id: number;
  name: string;
};