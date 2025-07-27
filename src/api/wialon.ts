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
  // Configure request parameters
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
  
  // Configure retry settings
  const MAX_RETRIES = 2;
  const FETCH_TIMEOUT = 15000; // 15 seconds
  let retries = 0;
  
  while (retries <= MAX_RETRIES) {
    try {
      // Create an AbortController for timeout management
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          credentials: 'include', // Include credentials to handle potential CORS issues
        });
        
        // Clear the timeout since fetch completed
        clearTimeout(timeoutId);
        
        // Check if response was successful
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }
        
        const json: WialonApiResponse = await response.json();
        
        if (json.error) {
          throw new Error(`Wialon API error: ${json.error}`);
        }
        
        // Mark as initialized on successful API call
        wialonInitialized = true;
        
        // Map and return the units
        return (json.items || []).map((item) => ({
          getId: () => item.id,
          getName: () => item.nm,
          getPosition: () => item.pos,
          getIconUrl: (size?: number) => (item.ic ? `${item.ic}${size ? `?size=${size}` : ""}` : ""),
        }));
      } catch (error) {
        // Clear the timeout if there was an error
        clearTimeout(timeoutId);
        throw error; // Re-throw to be caught by the outer try-catch
      }
    } catch (error) {
      // Set the initialization flag to false
      wialonInitialized = false;
      
      // Handle different types of errors with specific messages
      let errorMessage = "Error fetching Wialon units";
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = `Request timed out after ${FETCH_TIMEOUT}ms`;
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        errorMessage = "Network error: Unable to connect to Wialon API. Please check your internet connection.";
      }
      
      console.error(`${errorMessage}:`, error);
      
      // If we have retries left, try again after a delay
      if (retries < MAX_RETRIES) {
        retries++;
        console.log(`Retrying Wialon API request (${retries}/${MAX_RETRIES})...`);
        // Wait for 1 second before retrying (increase delay with each retry)
        await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        continue;
      }
      
      // If we've exhausted all retries, throw the error
      throw error;
    }
  }
  
  // This code should never be reached, but TypeScript requires it for type safety
  throw new Error("Failed to fetch Wialon units after maximum retries");
}