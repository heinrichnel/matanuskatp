import { ErrorCategory, ErrorSeverity, logError, createAppError } from "../utils/errorHandling";
import type {
  WialonSession,
  WialonUnit,
  WialonSensor,
  WialonPosition,
} from "../types/wialon-types";

// Wialon SDK is exposed on the window object
declare global {
  interface Window {
    wialon: any;
  }
}

// Token for login - IMPORTANT: This should be securely managed, not hardcoded.
const TOKEN = "c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053";

// Wialon API URL
const WIALON_API_URL = "https://hst-api.wialon.com";

// --- Wialon State and Utility Functions ---
let wialonInitialized = false;
let session: WialonSession | null = null;
let units: WialonUnit[] = [];

// A promise that resolves when the Wialon SDK is loaded
const wialonSdkLoadedPromise = new Promise<void>((resolve, reject) => {
  if (typeof window === "undefined") {
    resolve();
    return;
  }

  // Check if the SDK is already loaded
  if (window.wialon) {
    console.log("Wialon SDK already loaded.");
    resolve();
    return;
  }

  // Load the SDK dynamically if not present
  console.log("Wialon SDK not immediately available. Attempting to load SDK dynamically...");
  const script = document.createElement("script");
  script.src = "https://hst-api.wialon.com/wsdk/script/wialon.js";
  script.async = true;

  // Handle successful load
  script.onload = () => {
    // Check periodically for SDK initialization
    const checkInterval = setInterval(() => {
      if (window.wialon) {
        console.log("Wialon SDK loaded successfully.");
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);

    // Stop checking after timeout
    setTimeout(() => {
      if (!window.wialon) {
        clearInterval(checkInterval);
        reject(new Error("Wialon SDK initialization timeout"));
        console.error("Failed to initialize Wialon SDK after loading script");
      }
    }, 5000);
  };

  // Handle load error
  script.onerror = () => {
    console.error("Failed to load Wialon SDK");
    reject(new Error("Failed to load Wialon SDK"));
  };

  // Add script to document
  document.head.appendChild(script);
});

// Utility function to log messages
function log(message: string, isError: boolean = false): void {
  if (isError) {
    console.error(message);
  } else {
    console.log(message);
  }
}

// --- Main Wialon Initialization and Data Fetching Logic ---

/**
 * Initializes the Wialon session and loads units.
 * @returns A promise that resolves with true on success, or false on failure.
 */
export async function initializeWialon(): Promise<boolean> {
  if (wialonInitialized) {
    log("Wialon is already initialized.");
    return true;
  }

  log("Initializing Wialon session...");

  try {
    // Wait for the Wialon SDK to be available
    await wialonSdkLoadedPromise;

    if (!window.wialon) {
      log("Wialon SDK is not available.", true);
      return false;
    }

    // Get a new session instance
    session = window.wialon.core.Session.getInstance();
    if (!session) {
      log("Failed to create Wialon session.", true);
      return false;
    }
    session.initSession(WIALON_API_URL);

    // Login using the provided token
    const loginSuccess = await new Promise<boolean>((resolve) => {
      session?.loginToken(TOKEN, "", (code: number) => {
        if (code) {
          const errorText = window.wialon.core.Errors.getErrorText(code);
          log(`Login failed: ${errorText}`, true);

          // Log detailed error for troubleshooting
          logError(`Wialon login failed: ${errorText}`, {
            category: ErrorCategory.API,
            severity: ErrorSeverity.ERROR,
            context: { code },
          });

          resolve(false);
        } else {
          log("Logged in successfully.");
          resolve(true);
        }
      });
    });

    if (!loginSuccess || !session) {
      return false;
    }

    // Load necessary data flags and libraries (using approach from working example)
    session.loadLibrary("itemIcon");

    const dataFlags =
      window.wialon.item.Item.dataFlag.base |
      window.wialon.item.Unit.dataFlag.sensors |
      window.wialon.item.Unit.dataFlag.lastMessage |
      window.wialon.item.Unit.dataFlag.lastPosition;

    const updateSuccess = await new Promise<boolean>((resolve) => {
      session?.updateDataFlags(
        [{ type: "type", data: "avl_unit", flags: dataFlags, mode: 0 }],
        (code: number) => {
          if (code) {
            const errorText = window.wialon.core.Errors.getErrorText(code);
            log(`Failed to load units: ${errorText}`, true);

            logError(`Failed to load Wialon units: ${errorText}`, {
              category: ErrorCategory.API,
              severity: ErrorSeverity.ERROR,
              context: { code },
            });

            resolve(false);
          } else {
            log("Unit data loaded successfully.");
            if (session) {
              units = session.getItems("avl_unit");
              if (units && units.length > 0) {
                log(`Found ${units.length} units.`);

                // Set up position change listeners for real-time updates
                units.forEach((unit) => {
                  unit.addListener("changePosition", (event: any) => {
                    // This will allow real-time updates when a unit's position changes
                    const unitId = unit.getId();
                    log(`Unit ${unitId} position updated.`, false);
                  });
                });
              } else {
                log("No units found.", true);
              }
              resolve(true);
            } else {
              resolve(false);
            }
          }
        }
      );
    });

    if (updateSuccess) {
      wialonInitialized = true;
    }

    return updateSuccess;
  } catch (error) {
    log(`An unexpected error occurred during Wialon initialization: ${error}`, true);

    logError(`Wialon initialization error: ${error}`, {
      category: ErrorCategory.API,
      severity: ErrorSeverity.ERROR,
      context: { error: String(error) },
    });

    return false;
  }
}

/**
 * Gets all loaded Wialon units.
 * @returns An array of WialonUnit objects.
 */
export function getWialonUnits(): WialonUnit[] {
  if (!wialonInitialized) {
    log("Wialon is not initialized. Cannot get units.", true);
    return [];
  }
  return units;
}

/**
 * Gets a specific unit by its ID.
 * @param unitId The ID of the unit to find.
 * @returns The WialonUnit object, or null if not found.
 */
export function getUnitById(unitId: number): WialonUnit | null {
  if (!wialonInitialized || !session) {
    log("Wialon is not initialized.", true);
    return null;
  }
  const unit = session.getItem(unitId);
  if (!unit) {
    log(`Unit with ID ${unitId} not found.`, true);
    return null;
  }
  return unit;
}

/**
 * Gets all sensors for a given unit.
 * @param unitId The ID of the unit.
 * @returns An array of WialonSensor objects, or an empty array if the unit is not found.
 */
export function getUnitSensors(unitId: number): WialonSensor[] {
  const unit = getUnitById(unitId);
  if (!unit) {
    return [];
  }
  const sensors = unit.getSensors();
  return Object.values(sensors);
}

/**
 * Calculates the value of a specific sensor for a unit's last message.
 * @param unitId The ID of the unit.
 * @param sensorId The ID of the sensor.
 * @returns The calculated sensor value, or null if it cannot be found.
 */
export function getSensorValue(unitId: number, sensorId: number): number | string | null {
  const unit = getUnitById(unitId);
  if (!unit) {
    return null;
  }
  const sensor = unit.getSensor(sensorId);
  if (!sensor) {
    log(`Sensor with ID ${sensorId} not found on unit ${unitId}.`, true);
    return null;
  }
  const lastMessage = unit.getLastMessage();
  if (!lastMessage) {
    log(`No last message found for unit ${unitId}.`, true);
    return "N/A";
  }

  const result = unit.calculateSensorValue(sensor, lastMessage);
  // The magic number -348201.3876 is a special value in Wialon SDK for "N/A"
  return result === -348201.3876 ? "N/A" : result;
}

/**
 * Get unit details including position, name, and other properties.
 * This is an adaptation of the HTML's `getUnitDetails` function.
 * @param unitId The ID of the unit.
 * @returns An object with unit details, or null if the unit is not found.
 */
export function getUnitDetails(unitId: number) {
  const unit = getUnitById(unitId);

  if (!unit) {
    return null;
  }

  const pos: WialonPosition | null = unit.getPosition();

  if (!pos) {
    log(`No position data for unit ${unitId}`, true);
    return {
      id: unitId,
      name: unit.getName(),
      position: null,
    };
  }

  return {
    id: unitId,
    name: unit.getName(),
    position: {
      latitude: pos.y,
      longitude: pos.x,
      speed: pos.s,
      course: pos.c,
      timestamp: pos.t,
      satellites: pos.sc,
    },
    iconUrl: unit.getIconUrl(32),
  };
}

// --- Wialon Session Management and Event Handling ---

/**
 * Registers a message event listener for a specific unit.
 * @param unitId The ID of the unit.
 * @param callback The function to call when a message event occurs.
 * @returns The event listener ID, or null if failed.
 */
export function registerUnitMessageListener(
  unitId: number,
  callback: (data: any) => void
): number | null {
  const unit = getUnitById(unitId);
  if (!unit) {
    return null;
  }
  const eventId = unit.addListener("messageRegistered", (event: any) => {
    const data = event.getData();
    callback(data);
  });
  return eventId;
}

/**
 * Unregisters a message event listener for a specific unit.
 * @param unitId The ID of the unit.
 * @param eventId The ID of the event listener to remove.
 */
export function unregisterUnitMessageListener(unitId: number, eventId: number): void {
  const unit = getUnitById(unitId);
  if (!unit) {
    return;
  }
  unit.removeListenerById(eventId);
}
