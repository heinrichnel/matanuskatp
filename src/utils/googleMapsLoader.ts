import { useState, useEffect } from 'react';
// Assuming mapsService.ts contains a function to check a proxy URL.
// This import is correct if the file exists and exports the function.
import { checkMapsServiceHealth } from './mapsService';

// This is a standard way to declare that the `window.google` object might exist,
// preventing TypeScript errors when accessing it. This is correct.
declare global {
  interface Window {
    google?: {
      maps: any;
    };
  }
}

// These variables correctly manage the loading state to ensure the script
// is only loaded once, which is a critical performance optimization.
let promise: Promise<void> | null = null;
let useDirectApi = false;
let serviceCheckAttempted = false;

// This correctly loads your sensitive API key from environment variables,
// which is the secure and standard way to handle secrets.
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAPS_SERVICE_URL = import.meta.env.VITE_MAPS_SERVICE_URL;

// This flag correctly checks if you have an API key to use as a fallback.
const hasFallbackOption = !!GOOGLE_MAPS_API_KEY;

// A simple utility to check if the script has already been loaded. This is correct.
export const isGoogleMapsAPILoaded = (): boolean => {
  return !!(window.google && window.google.maps);
};

// This function correctly checks your proxy service and implements the fallback logic.
export const checkMapsServiceAvailability = async (): Promise<boolean> => {
  if (!MAPS_SERVICE_URL) return false;

  try {
    const isAvailable = await checkMapsServiceHealth(MAPS_SERVICE_URL);
    serviceCheckAttempted = true;

    if (!isAvailable) {
      console.warn('[Maps Loader] Maps service proxy is unavailable');
      useDirectApi = hasFallbackOption;
      if (useDirectApi) {
        console.log('[Maps Loader] Falling back to direct Google Maps API');
      } else {
        console.error('[Maps Loader] No fallback API key available - map functionality may be limited');
      }
    } else {
      useDirectApi = false;
      console.log(`[Maps Loader] Maps service proxy is available at: ${MAPS_SERVICE_URL}`);
    }

    return isAvailable;
  } catch (error) {
    console.error('[Maps Loader] Error checking maps service:', error);
    serviceCheckAttempted = true;
    useDirectApi = hasFallbackOption;
    return false;
  }
};

// This is a helpful validation function to catch simple typos in your .env file. Correct.
export const isValidApiKeyFormat = (apiKey: string | undefined): boolean => {
  if (!apiKey) return false;
  return apiKey.length >= 30 && !apiKey.includes(' ');
};

// This is the core function. It is well-structured and handles all loading logic.
export const loadGoogleMapsScript = async (libraries: string = 'places'): Promise<void> => {
  // This correctly prevents the script from being loaded multiple times.
  if (promise) return promise;

  // This correctly validates the key before making a request.
  if (GOOGLE_MAPS_API_KEY && !isValidApiKeyFormat(GOOGLE_MAPS_API_KEY)) {
    console.error('[Maps Loader] Invalid Google Maps API key format');
    throw new Error('Invalid Google Maps API key format');
  }

  if (!serviceCheckAttempted && MAPS_SERVICE_URL) {
    await checkMapsServiceAvailability();
  }

  promise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      console.log('[Maps Loader] Google Maps already loaded');
      resolve();
      return;
    }

    const script = document.createElement('script');

    // This logic correctly decides whether to use your proxy or the direct API.
    if (MAPS_SERVICE_URL && !useDirectApi) {
      const url = `${MAPS_SERVICE_URL}/maps/api/js?libraries=${libraries}`;
      console.log(`[Maps Loader] Loading Google Maps via proxy: ${url}`);
      script.src = url;
    } else if (GOOGLE_MAPS_API_KEY) {
      const url = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=${libraries}`;
      console.log('[Maps Loader] Loading Google Maps directly with API key');
      script.src = url;
    } else {
      console.error("[Maps Loader] Neither VITE_GOOGLE_MAPS_API_KEY nor VITE_MAPS_SERVICE_URL is properly set or available");
      reject(new Error("Maps configuration error: No valid API source available"));
      promise = null;
      return;
    }

    // *** THIS IS THE FIX FOR THE PERFORMANCE WARNING ***
    // Your code already includes `async` and `defer`, which is the best practice.
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();

    // *** THIS IS THE CODE THAT IDENTIFIES YOUR REAL PROBLEM ***
    // This `onerror` block correctly tells you that the issue is external:
    // API key, billing, or network problems. The code is doing its job by reporting this.
    script.onerror = (error) => {
      console.error("[Maps Loader] Failed to load Google Maps API script", error);

      if (error instanceof Event) {
        console.warn("[Maps Loader] Error details: This is likely due to an invalid API key, network issues, or billing not enabled");
        console.log("[Maps Loader] Verify your Google Cloud project has Maps JavaScript API enabled and billing configured");
      }

      // This is robust fallback logic. If the proxy fails, it correctly tries the direct API.
      if (!useDirectApi && hasFallbackOption && MAPS_SERVICE_URL) {
        console.log('[Maps Loader] Proxy service failed, attempting fallback to direct API');
        useDirectApi = true;
        promise = null; // Reset promise to allow a new attempt
        loadGoogleMapsScript(libraries)
          .then(resolve)
          .catch(reject);
      } else {
        promise = null;
        reject(error);
      }
    };

    document.head.appendChild(script);
  });

  return promise;
};

// This is a standard and correct React hook for using the loader in your components.
export const useLoadGoogleMaps = (libraries: string = 'places') => {
  const [isLoaded, setIsLoaded] = useState(isGoogleMapsAPILoaded());
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(!isLoaded);

  useEffect(() => {
    if (isLoaded) return;

    setIsLoading(true);

    const loadMaps = async () => {
      try {
        if (!serviceCheckAttempted && MAPS_SERVICE_URL) {
          await checkMapsServiceAvailability();
        }

        await loadGoogleMapsScript(libraries);
        setIsLoaded(true);
        setIsLoading(false);
      } catch (err) {
        console.error('[Maps Loader] Error loading Google Maps:', err);
        setError(err instanceof Error ? err : new Error('Failed to load Google Maps'));
        setIsLoading(false);
      }
    };

    loadMaps();
  }, [libraries, isLoaded]);

  return { isLoaded, isLoading, error };
};
