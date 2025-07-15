import { useState, useEffect } from 'react';
import { checkMapsServiceHealth } from './mapsService';

declare global {
  interface Window {
    google?: {
      maps: any;
    };
  }
}

let promise: Promise<void> | null = null;
let useDirectApi = false; // Flag to track if we've fallen back to direct API
let serviceCheckAttempted = false; // Flag to track if we've attempted a service check

// Get API key and Maps service URL from environment variables
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAPS_SERVICE_URL = import.meta.env.VITE_MAPS_SERVICE_URL;

// Check if we have what we need for fallback
const hasFallbackOption = !!GOOGLE_MAPS_API_KEY;

export const isGoogleMapsAPILoaded = (): boolean => {
  return !!(window.google && window.google.maps);
};

// Check if the Maps service proxy is available
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

export const loadGoogleMapsScript = async (libraries: string = 'places'): Promise<void> => {
  if (promise) return promise;

  // Check if we should do a service availability check
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
    
    // Either use the proxy service or direct API access based on availability
    if (MAPS_SERVICE_URL && !useDirectApi) {
      // Use proxy service
      const url = `${MAPS_SERVICE_URL}/maps/api/js?libraries=${libraries}`;
      console.log(`[Maps Loader] Loading Google Maps via proxy: ${url}`);
      script.src = url;
    } else if (GOOGLE_MAPS_API_KEY) {
      // Use direct API access with key
      const url = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=${libraries}`;
      console.log('[Maps Loader] Loading Google Maps directly with API key');
      script.src = url;
    } else {
      console.error("[Maps Loader] Neither VITE_GOOGLE_MAPS_API_KEY nor VITE_MAPS_SERVICE_URL is properly set or available");
      reject(new Error("Maps configuration error: No valid API source available"));
      promise = null;
      return;
    }
    
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    
    script.onerror = (error) => {
      console.error("[Maps Loader] Failed to load Google Maps API script", error);
      
      // If we haven't tried direct API yet and we have an API key, try that as fallback
      if (!useDirectApi && hasFallbackOption && MAPS_SERVICE_URL) {
        console.log('[Maps Loader] Proxy service failed, attempting fallback to direct API');
        useDirectApi = true;
        promise = null;
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

export const useLoadGoogleMaps = (libraries: string = 'places') => {
  const [isLoaded, setIsLoaded] = useState(isGoogleMapsAPILoaded());
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(!isLoaded);

  useEffect(() => {
    if (isLoaded) return;
    
    setIsLoading(true);
    
    // First check service availability, then load the script
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
