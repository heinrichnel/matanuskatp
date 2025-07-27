import type { WialonPosition, WialonUnit } from "../types/wialon";

// Wialon configuration
export const WIALON_LOGIN_URL =
  "https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en";
const WIALON_SESSION_TOKEN =
  "c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053";
const WIALON_API_URL = "https://hosting.wialon.com";

// Track initialization state
let wialonInitialized = false;

// Auto-initialization will be triggered on import
initializeWialon().catch((err) => console.error("Failed to auto-initialize Wialon:", err));

/** Raw Wialon API response type for search_items */
interface WialonApiResponse {
  error?: number;
  items?: Array<{
    id: number;
    nm: string;
    pos?: WialonPosition;
    ic?: string;
  }>;
}

/**
 * Initialize Wialon connection automatically
 * This function will be called when the module is imported
 */
export async function initializeWialon(): Promise<boolean> {
  if (wialonInitialized) {
    console.log("Wialon already initialized");
    return true;
  }

  try {
    console.log("Auto-initializing Wialon connection...");
    // Attempt to get units as a connectivity test
    const units = await getUnits();
    console.log(`Wialon initialized successfully with ${units.length} units`);
    wialonInitialized = true;
    return true;
  } catch (error) {
    console.error("Error initializing Wialon:", error);
    wialonInitialized = false;
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
 * Get all available Wialon units
 */
export async function getUnits(): Promise<WialonUnit[]> {
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

  try {
    const response = await fetch(url);
    const json: WialonApiResponse = await response.json();

    if (json.error) {
      throw new Error(`Wialon API error: ${json.error}`);
    }

    // Mark as initialized on successful API call
    wialonInitialized = true;

    return (json.items || []).map((item) => ({
      getId: () => item.id,
      getName: () => item.nm,
      getPosition: () => item.pos,
      getIconUrl: (size?: number) => (item.ic ? `${item.ic}${size ? `?size=${size}` : ""}` : ""),
    }));
  } catch (error) {
    console.error("Error fetching Wialon units:", error);
    wialonInitialized = false;
    throw error;
  }
}
