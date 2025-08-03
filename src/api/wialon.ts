import type {
  WialonPosition,
  WialonSensor,
  WialonSession,
  WialonUnit,
} from "../types/wialon-types";
import { ErrorCategory, ErrorSeverity, logError } from "../utils/errorHandling";

// Wialon SDK is exposed on the window object
declare global {
  interface Window {
    wialon: any;
  }
}

const TOKEN = "c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053"
const WIALON_API_URL = "https://hst-api.wialon.com";

let wialonInitialized = false;
let session: WialonSession | null = null;
let units: WialonUnit[] = [];

const wialonSdkLoadedPromise = new Promise<void>((resolve, reject) => {
  if (typeof window === "undefined") {
    resolve();
    return;
  }
  if (window.wialon) {
    resolve();
    return;
  }
  const script = document.createElement("script");
  script.src = "https://hst-api.wialon.com/wsdk/script/wialon.js";
  script.async = true;
  script.onload = () => {
    const checkInterval = setInterval(() => {
      if (window.wialon) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);
    setTimeout(() => {
      if (!window.wialon) {
        clearInterval(checkInterval);
        reject(new Error("Wialon SDK initialization timeout"));
      }
    }, 5000);
  };
  script.onerror = () => {
    reject(new Error("Failed to load Wialon SDK"));
  };
  document.head.appendChild(script);
});

function log(message: string, isError: boolean = false): void {
  if (isError) {
    console.error(message);
  } else {
    console.log(message);
  }
}

export async function initializeWialon(): Promise<boolean> {
  if (wialonInitialized) return true;
  try {
    await wialonSdkLoadedPromise;
    if (!window.wialon) return false;
    // @ts-ignore
    session = window.wialon.core.Session.getInstance();
    if (!session) return false;
    session.initSession(WIALON_API_URL);

    const loginSuccess = await new Promise<boolean>((resolve) => {
      session!.loginToken(TOKEN, "", (code: number) => {
        if (code) {
          const errorText = window.wialon.core.Errors.getErrorText(code);
          logError(`Wialon login failed: ${errorText}`, {
            category: ErrorCategory.API,
            severity: ErrorSeverity.ERROR,
            context: { code },
          });
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
    if (!loginSuccess || !session) return false;

    session.loadLibrary("itemIcon");
    const dataFlags =
      // @ts-ignore
      window.wialon.item.Item.dataFlag.base |
      window.wialon.item.Unit.dataFlag.sensors |
      window.wialon.item.Unit.dataFlag.lastMessage |
      window.wialon.item.Unit.dataFlag.lastPosition;

    const updateSuccess = await new Promise<boolean>((resolve) => {
      session!.updateDataFlags(
        [{ type: "type", data: "avl_unit", flags: dataFlags, mode: 0 }],
        (code: number) => {
          if (code) {
            const errorText = window.wialon.core.Errors.getErrorText(code);
            logError(`Failed to load Wialon units: ${errorText}`, {
              category: ErrorCategory.API,
              severity: ErrorSeverity.ERROR,
              context: { code },
            });
            resolve(false);
          } else {
            units = session!.getItems("avl_unit") as WialonUnit[];
            if (units && units.length > 0) {
              units.forEach((unit) => {
                unit.addListener?.("changePosition", () => {
                  log(`Unit ${unit.getId?.()} position updated.`);
                });
              });
            }
            resolve(true);
          }
        }
      );
    });

    if (updateSuccess) wialonInitialized = true;
    return updateSuccess;
  } catch (error) {
    logError(`Wialon initialization error: ${error}`, {
      category: ErrorCategory.API,
      severity: ErrorSeverity.ERROR,
      context: { error: String(error) },
    });
    return false;
  }
}

export function getWialonUnits(): WialonUnit[] {
  if (!wialonInitialized) return [];
  return units;
}

export function getUnitById(unitId: number): WialonUnit | null {
  if (!wialonInitialized || !session) return null;
  return session.getItem(unitId) as WialonUnit;
}

export function getUnitSensors(unitId: number): WialonSensor[] {
  const unit = getUnitById(unitId);
  if (!unit) return [];
  const sensors = unit.getSensors?.();
  return sensors ? Object.values(sensors) : [];
}

export function getSensorValue(unitId: number, sensorId: number): number | string | null {
  const unit = getUnitById(unitId);
  if (!unit) return null;
  const sensor = unit.getSensor?.(sensorId);
  if (!sensor) return null;
  const lastMessage = unit.getLastMessage?.();
  if (!lastMessage) return "N/A";
  const result = unit.calculateSensorValue?.(sensor, lastMessage);
  return result === -348201.3876 ? "N/A" : result;
}

export function getUnitDetails(unitId: number) {
  const unit = getUnitById(unitId);
  if (!unit) return null;
  const pos: WialonPosition | null = unit.getPosition?.() ?? null;
  if (!pos) {
    return { id: unitId, name: unit.getName?.(), position: null };
  }
  return {
    id: unitId,
    name: unit.getName?.(),
    position: {
      latitude: pos.y,
      longitude: pos.x,
      speed: pos.s,
      course: pos.c,
      timestamp: pos.t,
      satellites: pos.sc,
    },
    iconUrl: unit.getIconUrl?.(32),
  };
}

export function registerUnitMessageListener(
  unitId: number,
  callback: (data: any) => void
): number | null {
  const unit = getUnitById(unitId);
  if (!unit || !unit.addListener) return null;
  return unit.addListener("messageRegistered", (event: any) => {
    const data = event.getData();
    callback(data);
  });
}

export function unregisterUnitMessageListener(unitId: number, eventId: number): void {
  const unit = getUnitById(unitId);
  if (!unit || !unit.removeListenerById) return;
  unit.removeListenerById(eventId);
}
