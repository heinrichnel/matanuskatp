/**
 * Centralized Google Maps API loader utility
 * Ensures the Google Maps API is loaded only once and with optimal performance settings
 */

let isGoogleMapsLoaded = false;
let isGoogleMapsLoading = false;
let googleMapsPromise: Promise<void> | null = null;

/**
 * Load Google Maps JavaScript API with optimal performance settings
 * @param options - Configuration options for the Google Maps API
 */
export interface GoogleMapsLoadOptions {
  apiKey?: string;
  libraries?: string[];
  version?: string;
  callback?: string;
}

export const loadGoogleMapsAPI = (options: GoogleMapsLoadOptions = {}): Promise<void> => {
  // Return existing promise if already loading or loaded
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  // If already loaded, return resolved promise
  if (isGoogleMapsLoaded && window.google?.maps) {
    return Promise.resolve();
  }

  // Set loading flag
  isGoogleMapsLoading = true;

  googleMapsPromise = new Promise<void>((resolve, reject) => {
    try {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
      if (existingScript) {
        console.log("✅ Google Maps script already exists in DOM");
        isGoogleMapsLoaded = true;
        isGoogleMapsLoading = false;
        resolve();
        return;
      }

      // Get configuration
      const apiKey = options.apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const libraries = options.libraries || ['places'];
      const version = options.version || 'weekly';
      const callback = options.callback || 'initGoogleMaps';

      if (!apiKey) {
        const error = "Google Maps API key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.";
        console.error(error);
        isGoogleMapsLoading = false;
        reject(new Error(error));
        return;
      }

      // Create callback function
      (window as any)[callback] = () => {
        console.log("✅ Google Maps API loaded successfully");
        isGoogleMapsLoaded = true;
        isGoogleMapsLoading = false;
        resolve();
      };

      // Create script element with optimal loading
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}&v=${version}&loading=async&callback=${callback}`;
      script.async = true;
      script.defer = true;
      
      script.onerror = () => {
        const error = "Failed to load Google Maps API script";
        console.error(error);
        isGoogleMapsLoading = false;
        googleMapsPromise = null;
        reject(new Error(error));
      };

      document.head.appendChild(script);
      console.log("🗺️ Loading Google Maps API with optimal performance settings...");
      
    } catch (error) {
      console.error("Error loading Google Maps API:", error);
      isGoogleMapsLoading = false;
      googleMapsPromise = null;
      reject(error);
    }
  });

  return googleMapsPromise;
};

/**
 * Check if Google Maps API is loaded
 */
export const isGoogleMapsAPILoaded = (): boolean => {
  return isGoogleMapsLoaded && !!window.google?.maps;
};

/**
 * Check if Google Maps API is currently loading
 */
export const isGoogleMapsAPILoading = (): boolean => {
  return isGoogleMapsLoading;
};

/**
 * Get the current Google Maps API loading status
 */
export const getGoogleMapsAPIStatus = () => {
  return {
    isLoaded: isGoogleMapsAPILoaded(),
    isLoading: isGoogleMapsAPILoading(),
    isAvailable: !!window.google?.maps
  };
};

// Global window interface extension
declare global {
  interface Window {
    google?: typeof google;
    initGoogleMaps?: () => void;
  }
}
