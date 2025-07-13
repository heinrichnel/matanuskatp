/**
 * A singleton loader for the Google Maps JavaScript API.
 * This ensures the script is only loaded once per page session.
 */

// Add this declaration to inform TypeScript about the global 'google' object
declare global {
  interface Window {
    google?: {
      maps: any;
    };
  }
}

let promise: Promise<void> | null = null;

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error("VITE_GOOGLE_MAPS_API_KEY is not set in your environment variables.");
}

/**
 * Loads the Google Maps script and resolves when the script is loaded.
 * @param libraries - A comma-separated string of libraries to load (e.g., 'places,geometry').
 * @returns A promise that resolves when the script is loaded.
 */
export const loadGoogleMapsScript = (libraries: string = 'places'): Promise<void> => {
  if (promise) {
    return promise;
  }

  promise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=${libraries}`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = (error) => {
      console.error("Failed to load Google Maps API script", error);
      promise = null; // Reset promise on failure to allow retry
      reject(error);
    };

    document.head.appendChild(script);
  });

  return promise;
};