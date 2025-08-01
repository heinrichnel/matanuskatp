// wialon-types.ts
export interface WialonSession {
  initSession(apiUrl: string): void;
  loginToken(token: string, flags: string, callback: (code: number) => void): void;
  updateDataFlags(specs: any[], callback: (code: number) => void): void;
  getItems(itemType: string): WialonUnit[];
  getItem(itemId: number): WialonUnit;
  loadLibrary(libraryName: string): void;
}

export interface WialonPosition {
  x: number; // longitude
  y: number; // latitude
  z: number; // altitude
  s: number; // speed
  c: number; // course
  t: number; // timestamp
  sc: number; // satellites
}

export interface WialonSensor {
  id: number;
  n: string; // name
  t: string; // type
  m: string; // unit of measure
}

export interface WialonUnit {
  getId(): number;
  getName(): string;
  getSensors(): { [key: string]: WialonSensor };
  getSensor(sensorId: number): WialonSensor | undefined;
  calculateSensorValue(sensor: WialonSensor, message: any): number | string;
  getLastMessage(): any;
  getPosition(): WialonPosition | null;
  getIconUrl(size?: number): string;
  addListener(eventName: string, callback: (event: any) => void): number;
  removeListenerById(eventId: number): void;
}
