/**
 * A singleton loader for the Google Maps JavaScript API.
 * This ensures the script is only loaded once per page session.
 */

import { useState, useEffect } from 'react';

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
 * Checks if the Google Maps API has been loaded
 * @returns boolean indicating if Google Maps API is loaded
 */
export const isGoogleMapsAPILoaded = (): boolean => {
  return !!(window.google && window.google.maps);
};

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

/**
 * React hook for loading the Google Maps API
 * @param libraries - A comma-separated string of libraries to load
 * @returns An object containing the loading state and any error
 */
export const useLoadGoogleMaps = (libraries: string = 'places') => {
  const [isLoaded, setIsLoaded] = useState(isGoogleMapsAPILoaded());
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // If already loaded, do nothing
    if (isLoaded) return;

    loadGoogleMapsScript(libraries)
      .then(() => setIsLoaded(true))
      .catch((err) => {
        console.error('Error loading Google Maps:', err);
        setError(err instanceof Error ? err : new Error('Failed to load Google Maps'));
      });
  }, [libraries, isLoaded]);

  return { isLoaded, error };
};