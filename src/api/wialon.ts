import type { WialonPosition, WialonUnit, WialonApiItem } from "../types/wialon";
import { ErrorCategory, ErrorSeverity, logError } from "../utils/errorHandling";

// Wialon configuration
export const WIALON_LOGIN_URL = "https://hst-api.wialon.com/oauth.html";
// IMPORTANT: Replace this with a token that is securely managed
const WIALON_SESSION_TOKEN =
  "c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053";
const WIALON_API_URL = "https://hst-api.wialon.com";

// Track initialization state
let wialonInitialized = false;
let sdkLoaded = false;
const CONNECTION_COOLDOWN = 30000; // 30 seconds between auto-retry attempts
const MAX_AUTO_RETRIES = 3;

// --- Wialon SDK Loading Logic ---
if (typeof window !== "undefined") {
  if (window.wialon) {
    console.log("Wialon SDK already loaded");
    sdkLoaded = true;
  } else {
    window.addEventListener("wialonSdkLoaded", () => {
      console.log("Wialon SDK loaded event received");
      sdkLoaded = true;
    });

    const checkSdk = setInterval(() => {
      if (window.wialon) {
        sdkLoaded = true;
        console.log("Wialon SDK detected in periodic check");
        clearInterval(checkSdk);
      }
    }, 1000);

    setTimeout(() => clearInterval(checkSdk), 30000);
  }
}

// Delay auto-initialization slightly to let the app load first
setTimeout(() => {
  initializeWialon().catch((err) => {
    logError(err, {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.WARNING,
      message: "Failed to auto-initialize Wialon API connection",
      context: { autoInit: true },
    });
  });
}, 3000); // 3 second delay

/** Raw Wialon API response type for search_items */
interface WialonApiResponse {
  error?: number;
  items?: WialonApiItem[];
}

/**
 * Initializes Wialon connection automatically.
 * @returns true on successful initialization, false otherwise.
 */
export async function initializeWialon(): Promise<boolean> {
  if (wialonInitialized) {
    console.log("Wialon already initialized");
    return true;
  }

  try {
    console.log("Auto-initializing Wialon connection...");

    // Check if Wialon SDK is available
    if (typeof window !== "undefined" && !window.wialon) {
      console.warn("Wialon SDK not immediately available. Attempting to load SDK dynamically...");

      return new Promise((resolve, reject) => { // Use reject to handle dynamic load failure
        const script = document.createElement("script");
        script.src = "https://sdk.wialon.com/js/latest/wialon.js";
        script.async = true;
        script.onload = async () => {
          console.log("Wialon SDK loaded dynamically");
          setTimeout(async () => {
            try {
              if (window.wialon) {
                const units = await getUnits(); // Use getUnits as a connectivity test
                console.log(`Wialon initialized successfully with ${units.length} units`);
                wialonInitialized = true;
                resolve(true);
              } else {
                console.error("Wialon SDK failed to initialize after dynamic loading");
                resolve(false); // Resolve false, but don't reject to not break promise chain
              }
            } catch (err) {
              console.error("Error after dynamic SDK load:", err);
              // If getUnits fails, propagate the error up
              reject(err);
            }
          }, 500);
        };
        script.onerror = () => {
          console.error("Failed to load Wialon SDK dynamically");
          reject(new Error("Wialon SDK dynamic load failed")); // Reject on script error
        };
        document.head.appendChild(script);
      });
    }

    // If SDK is already available, proceed normally
    const units = await getUnits();
    console.log(`Wialon initialized successfully with ${units.length} units`);
    wialonInitialized = true;
    return true;
  } catch (error) {
    console.error("Error initializing Wialon:", error);
    wialonInitialized = false;
    logError(error, {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.ERROR,
      message: "Failed to initialize Wialon API",
      context: { source: 'initializeWialon' }
    });
    return false;
  }
}

/**
 * Check if Wialon is currently initialized
 */
export function isWialonInitialized(): boolean {
  return wialonInitialized;
}

/**
 * Get all available Wialon units.
 * Throws an error on failure.
 */
export async function getUnits(): Promise<WialonUnit[]> {
  // If Wialon SDK is not available, throw an error instead of returning mock data
  if (!window.wialon) {
    const error = new Error("Wialon SDK not available. Cannot fetch units.");
    logError(error, {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.WARNING,
      message: "Wialon SDK not available on getUnits call",
      context: { source: 'getUnits' }
    });
    throw error;
  }

  const params = new URLSearchParams({
    svc: "core/search_items",
    params: JSON.stringify({
      spec: {
        itemsType: "avl_unit",
        propName: "sys_name",
        propValueMask: "*",
        sortType: "sys_name",
      },
      force: 1,
      flags: 1,
      from: 0,
      to: 0,
    }),
    sid: WIALON_SESSION_TOKEN,
  });

  const url = `${WIALON_API_URL}/wialon/ajax.html?${params.toString()}`;

  const MAX_RETRIES = 2;
  const FETCH_TIMEOUT = 15000; // 15 seconds
  let retries = 0;

  while (retries <= MAX_RETRIES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
          credentials: "include",
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }

        const json: WialonApiResponse = await response.json();

        if (json.error) {
          throw new Error(`Wialon API error: ${json.error}`);
        }

        wialonInitialized = true;

        return mapWialonApiItemsToUnits(json.items || []);
      } catch (error) {
        clearTimeout(timeoutId);
        throw error; // Re-throw to be caught by the outer try-catch
      }
    } catch (error) {
      wialonInitialized = false;

      let errorMessage = "Error fetching Wialon units";
      if (error instanceof DOMException && error.name === "AbortError") {
        errorMessage = `Request timed out after ${FETCH_TIMEOUT}ms`;
      } else if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
        errorMessage =
          "Network error: Unable to connect to Wialon API. Please check your internet connection.";
      }

      logError(error, {
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.ERROR,
        message: errorMessage,
        context: { source: 'getUnits' }
      });

      if (retries < MAX_RETRIES) {
        retries++;
        console.log(`Retrying Wialon API request (${retries}/${MAX_RETRIES})...`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
        continue;
      }

      // After all retries, throw the final error instead of returning mock data
      throw new Error(`Failed to fetch Wialon units after ${MAX_RETRIES} retries: ${errorMessage}`);
    }
  }

  // This part is unreachable now, but a final throw is good practice for type safety
  throw new Error("Wialon API request loop completed without a valid response.");
}

/**
 * Maps Wialon API items to WialonUnit objects
 */
function mapWialonApiItemsToUnits(items: WialonApiItem[]): WialonUnit[] {
  return items.map(item => {
    // Create a profile object from the fields
    const profile: Record<string, string> = {};
    if (item.flds) {
      item.flds.forEach(field => {
        profile[field.n] = String(field.v);
      });
    }

    // Map position data if available
    let lastPosition: WialonPosition | undefined;
    if (item.pos) {
      lastPosition = {
        x: item.pos.x,
        y: item.pos.y,
        z: item.pos.z,
        s: item.pos.s,
        c: item.pos.c,
        t: item.pos.t,
        sc: item.pos.sc,
        // Also add the more readable format
        longitude: item.pos.x,
        latitude: item.pos.y,
        altitude: item.pos.z,
        speed: item.pos.s,
        course: item.pos.c,
        timestamp: item.pos.t,
        satellites: item.pos.sc
      };
    }

    return {
      id: item.id,
      name: item.nm,
      uid: item.uid || String(item.id),
      phone: item.ph,
      hardwareType: item.hw,
      iconUrl: item.ic,
      lastPosition,
      profile,
      // Add methods for compatibility with Wialon SDK
      getId: () => item.id,
      getName: () => item.nm,
      getPosition: () => lastPosition,
      getIconUrl: (size?: number) =>
        item.ic ? `https://hst-api.wialon.com/avl_image/${item.ic}${size ? `?size=${size}` : ""}` : "",
    };
  });
}

/**
 * Get a specific unit by ID
 */
export async function getUnitById(unitId: number): Promise<WialonUnit | null> {
  try {
    const units = await getUnits();
    return units.find(unit => unit.id === unitId) || null;
  } catch (error) {
    logError(error, {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.ERROR,
      message: `Failed to get unit with ID: ${unitId}`,
      context: { source: 'getUnitById', unitId }
    });
    return null;
  }
}

/**
 * Initialize Wialon session using the provided function from the task
 */
export function initWialonSession() {
  if (typeof window === "undefined" || !window.wialon) {
    console.error("Wialon SDK not available");
    return;
  }

  const sess = window.wialon.core.Session.getInstance(); // get instance of current Session

  // specify what kind of data should be returned
  const flags = window.wialon.item.Item.dataFlag.base | window.wialon.item.Unit.dataFlag.lastMessage;

  sess.loadLibrary("itemIcon"); // load Icon Library

  sess.updateDataFlags( // load items to current session
    [{type: "type", data: "avl_unit", flags: flags, mode: 0}], // Items specification
    function (code) { // updateDataFlags callback
      if (code) {
        console.error(window.wialon.core.Errors.getErrorText(code));
        return;
      } // exit if error code

      const units = sess.getItems("avl_unit"); // get loaded 'avl_unit's items
      if (!units || !units.length) {
        console.warn("No units found");
        return;
      }

      console.log(`Loaded ${units.length} units from Wialon`);
    }
  );
}

/**
 * Register a message event listener for a specific unit
 */
export function registerUnitMessageListener(unitId: number, callback: (data: any) => void) {
  if (typeof window === "undefined" || !window.wialon) {
    console.error("Wialon SDK not available");
    return null;
  }

  const sess = window.wialon.core.Session.getInstance();
  const unit = sess.getItem(unitId);

  if (!unit) {
    console.error(`Unit with ID ${unitId} not found`);
    return null;
  }

  // Register the event listener
  const eventId = unit.addListener("messageRegistered", function(event) {
    const data = event.getData();
    callback(data);
  });

  return eventId;
}

/**
 * Unregister a message event listener
 */
export function unregisterUnitMessageListener(unitId: number, eventId: number) {
  if (typeof window === "undefined" || !window.wialon) {
    console.error("Wialon SDK not available");
    return;
  }

  const sess = window.wialon.core.Session.getInstance();
  const unit = sess.getItem(unitId);

  if (!unit) {
    console.error(`Unit with ID ${unitId} not found`);
    return;
  }

  unit.removeListenerById(eventId);
}

/**
 * Get unit details including position, name, and other properties
 */
export function getUnitDetails(unitId: number) {
  if (typeof window === "undefined" || !window.wialon) {
    console.error("Wialon SDK not available");
    return null;
  }

  const sess = window.wialon.core.Session.getInstance();
  const unit = sess.getItem(unitId);

  if (!unit) {
    console.error(`Unit with ID ${unitId} not found`);
    return null;
  }

  const pos = unit.getPosition();

  if (!pos) {
    console.warn(`No position data for unit ${unitId}`);
    return {
      id: unitId,
      name: unit.getName(),
      position: null
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
      satellites: pos.sc
    },
    iconUrl: unit.getIconUrl(32)
  };
}

