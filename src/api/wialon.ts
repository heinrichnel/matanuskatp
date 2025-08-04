import type { WialonPosition, WialonSensor, WialonUnit } from "../types/wialon-types";
import { ErrorCategory, ErrorSeverity, logError } from "../utils/errorHandling";

// Import the Wialon SDK type definitions
import "../types/wialon-sdk.d.ts";

// Wialon SDK is exposed on the window object
declare global {
  interface Window {
    wialon: any;
    W: typeof W;
  }
}

// Configuration
const TOKEN = "c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053";
const WIALON_API_URL = "https://hst-api.wialon.com";
const WIALON_SDK_URL = "https://hst-api.wialon.com/wsdk/script/wialon.js";

// State management
let wialonInitialized = false;
let session: any = null; // Using any for Wialon session as it has complex API
let units: WialonUnit[] = [];
let sdkLoaded = false;
let lastConnectionAttempt = 0;
let connectionAttempts = 0;
const CONNECTION_COOLDOWN = 30000; // 30 seconds between auto-retry attempts
const MAX_AUTO_RETRIES = 3;

// Listen for Wialon SDK loaded event
if (typeof window !== "undefined") {
  // Check if SDK is already loaded
  if (window.wialon) {
    console.log("Wialon SDK already loaded");
    sdkLoaded = true;
  } else {
    // Set up listener for when SDK loads
    window.addEventListener("wialonSdkLoaded", () => {
      console.log("Wialon SDK loaded event received");
      sdkLoaded = true;
    });
  }
}

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
    // Wait for SDK to load
    await wialonSdkLoadedPromise;

    if (!window.wialon) {
      console.error("Wialon SDK not available");
      return false;
    }

    // Initialize session using Wialon SDK
    const W = window.wialon;
    session = W.core.Session.getInstance();

    if (!session) {
      console.error("Failed to get Wialon session instance");
      return false;
    }

    // Initialize session with API URL
    session.initSession(WIALON_API_URL);

    // Login with token
    const loginSuccess = await new Promise<boolean>((resolve) => {
      session.loginToken(TOKEN, "", (code: number) => {
        if (code) {
          const errorText = W.core.Errors.getErrorText(code);
          logError(`Wialon login failed: ${errorText}`, {
            category: ErrorCategory.API,
            severity: ErrorSeverity.ERROR,
            context: { code, errorText },
          });
          resolve(false);
        } else {
          console.log("Wialon login successful");
          resolve(true);
        }
      });
    });

    if (!loginSuccess) {
      console.error("Wialon login failed");
      return false;
    }

    // Load required libraries
    session.loadLibrary("itemIcon");

    // Set up data flags for units
    const dataFlags =
      W.item.Item.dataFlag.base |
      W.item.Unit.dataFlag.sensors |
      W.item.Unit.dataFlag.lastMessage |
      W.item.Unit.dataFlag.lastPosition;

    // Update data flags and load units
    const updateSuccess = await new Promise<boolean>((resolve) => {
      session.updateDataFlags(
        [{ type: "type", data: "avl_unit", flags: dataFlags, mode: 0 }],
        (code: number) => {
          if (code) {
            const errorText = W.core.Errors.getErrorText(code);
            logError(`Failed to load Wialon units: ${errorText}`, {
              category: ErrorCategory.API,
              severity: ErrorSeverity.ERROR,
              context: { code, errorText },
            });
            resolve(false);
          } else {
            // Get loaded units
            units = session.getItems("avl_unit") as WialonUnit[];

            if (units && units.length > 0) {
              console.log(`Loaded ${units.length} Wialon units`);

              // Set up position change listeners
              units.forEach((unit) => {
                if (unit.addListener) {
                  unit.addListener("changePosition", () => {
                    log(`Unit ${unit.getId?.()} position updated.`);
                  });
                }
              });
            } else {
              console.warn("No Wialon units found");
            }

            resolve(true);
          }
        }
      );
    });

    if (updateSuccess) {
      wialonInitialized = true;
      console.log("Wialon initialization completed successfully");
    }

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
  if (!wialonInitialized) {
    console.warn("Wialon not initialized");
    return [];
  }
  return units;
}

export function getUnitById(unitId: number): WialonUnit | null {
  if (!wialonInitialized || !session) {
    console.warn("Wialon not initialized or no session");
    return null;
  }

  try {
    return session.getItem(unitId) as WialonUnit;
  } catch (error) {
    console.error(`Error getting unit ${unitId}:`, error);
    return null;
  }
}

export function getUnitSensors(unitId: number): WialonSensor[] {
  const unit = getUnitById(unitId);
  if (!unit) return [];

  try {
    const sensors = unit.getSensors?.();
    return sensors ? Object.values(sensors) : [];
  } catch (error) {
    console.error(`Error getting sensors for unit ${unitId}:`, error);
    return [];
  }
}

export function getSensorValue(unitId: number, sensorId: number): number | string | null {
  const unit = getUnitById(unitId);
  if (!unit) return null;

  try {
    const sensor = unit.getSensor?.(sensorId);
    if (!sensor) return null;

    const lastMessage = unit.getLastMessage?.();
    if (!lastMessage) return "N/A";

    const result = unit.calculateSensorValue?.(sensor, lastMessage);
    if (result === undefined) return null;

    // Handle Wialon's special value for invalid data
    return result === -348201.3876 ? "N/A" : result;
  } catch (error) {
    console.error(`Error getting sensor value for unit ${unitId}, sensor ${sensorId}:`, error);
    return null;
  }
}

export function getUnitDetails(unitId: number) {
  const unit = getUnitById(unitId);
  if (!unit) return null;

  try {
    const pos: WialonPosition | null = unit.getPosition?.() ?? null;
    const baseDetails = {
      id: unitId,
      name: unit.getName?.() || `Unit ${unitId}`,
      iconUrl: unit.getIconUrl?.(32),
    };

    if (!pos) {
      return { ...baseDetails, position: null };
    }

    return {
      ...baseDetails,
      position: {
        latitude: pos.y,
        longitude: pos.x,
        speed: pos.s,
        course: pos.c,
        timestamp: pos.t,
        satellites: pos.sc,
      },
    };
  } catch (error) {
    console.error(`Error getting unit details for ${unitId}:`, error);
    return null;
  }
}

export function registerUnitMessageListener(
  unitId: number,
  callback: (data: any) => void
): number | null {
  const unit = getUnitById(unitId);
  if (!unit || !unit.addListener) return null;

  try {
    return unit.addListener("messageRegistered", (event: any) => {
      const data = event.getData();
      callback(data);
    });
  } catch (error) {
    console.error(`Error registering message listener for unit ${unitId}:`, error);
    return null;
  }
}

export function unregisterUnitMessageListener(unitId: number, eventId: number): void {
  const unit = getUnitById(unitId);
  if (!unit || !unit.removeListenerById) return;

  try {
    unit.removeListenerById(eventId);
  } catch (error) {
    console.error(`Error unregistering listener ${eventId} for unit ${unitId}:`, error);
  }
}

// Additional utility functions
export function isWialonInitialized(): boolean {
  return wialonInitialized;
}

export function getWialonSession(): any {
  return session;
}

export function disconnectWialon(): void {
  if (session && session.logout) {
    try {
      session.logout();
      wialonInitialized = false;
      session = null;
      units = [];
      console.log("Wialon session disconnected");
    } catch (error) {
      console.error("Error disconnecting Wialon:", error);
    }
  }
}

// Reconnection function for handling network issues
export async function reconnectWialon(): Promise<boolean> {
  const now = Date.now();

  // Prevent too frequent reconnection attempts
  if (now - lastConnectionAttempt < CONNECTION_COOLDOWN) {
    console.log("Reconnection attempt too soon, waiting...");
    return false;
  }

  if (connectionAttempts >= MAX_AUTO_RETRIES) {
    console.log("Max reconnection attempts reached");
    return false;
  }

  lastConnectionAttempt = now;
  connectionAttempts++;

  console.log(`Attempting Wialon reconnection (attempt ${connectionAttempts}/${MAX_AUTO_RETRIES})`);

  // Disconnect first if there's an existing session
  disconnectWialon();

  // Reset state
  wialonInitialized = false;

  // Try to reinitialize
  const success = await initializeWialon();

  if (success) {
    connectionAttempts = 0; // Reset on successful connection
    console.log("Wialon reconnection successful");
  } else {
    console.error("Wialon reconnection failed");
  }

  return success;
}
