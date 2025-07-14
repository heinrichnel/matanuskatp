import { useState, useEffect } from 'react';

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

export const isGoogleMapsAPILoaded = (): boolean => {
  return !!(window.google && window.google.maps);
};

export const loadGoogleMapsScript = (libraries: string = 'places'): Promise<void> => {
  if (promise) return promise;

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
      promise = null;
      reject(error);
    };
    document.head.appendChild(script);
  });

  return promise;
};

export const useLoadGoogleMaps = (libraries: string = 'places') => {
  const [isLoaded, setIsLoaded] = useState(isGoogleMapsAPILoaded());
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isLoaded) return;
    loadGoogleMapsScript(libraries)
      .then(() => setIsLoaded(true))
      .catch((err) => setError(err instanceof Error ? err : new Error('Failed to load Google Maps')));
  }, [libraries, isLoaded]);

  return { isLoaded, error };
};
