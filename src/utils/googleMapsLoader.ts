/**
 * Centralized Google Maps API loader utility
 * Implements the recommended pattern for loading Google Maps JavaScript API
 */
import { useEffect } from 'react';

// Track if Google Maps is already loaded to prevent duplicate loading
let isGoogleMapsLoaded = false;

/**
 * React hook to load Google Maps JavaScript API
 * 
 * @param apiKey - Google Maps API key (optional, will use env variable if not provided)
 * @param libraries - Array of libraries to load (defaults to ['places'])
 * @returns void
 * 
 * Example usage:
 * ```
 * // In your component:
 * useLoadGoogleMaps(); // Uses API key from environment
 * 
 * // Or with custom API key and libraries:
 * useLoadGoogleMaps('YOUR_API_KEY', ['places', 'geometry']);
 * ```
 */
export function useLoadGoogleMaps(
  apiKey?: string, 
  libraries: string[] = ['places']
): void {
  useEffect(() => {
    // If Google Maps is already loaded, don't load it again
    if (window.google && window.google.maps) {
      isGoogleMapsLoaded = true;
      return;
    }
    
    // If script is already in the DOM but not loaded yet, wait for it
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      return;
    }

    // Get API key from props or environment variable
    const mapsApiKey = apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!mapsApiKey) {
      console.error("Google Maps API key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.");
      return;
    }

    // Create the script element
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=${libraries.join(',')}`;
    script.async = true;
    script.defer = true;
    
    // Add event listeners for load and error
    script.addEventListener('load', () => {
      console.log("✅ Google Maps API loaded successfully");
      isGoogleMapsLoaded = true;
    });
    
    script.addEventListener('error', () => {
      console.error("Failed to load Google Maps API script");
      // Remove the script on error to allow retry
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });

    // Append the script to the document body
    document.body.appendChild(script);
    console.log("🗺️ Loading Google Maps API...");

    // Cleanup function to remove the script when component unmounts
    return () => {
      // Only remove if it's the script we added and Google Maps isn't fully loaded yet
      if (script.parentNode && !isGoogleMapsLoaded) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey, libraries.join(',')]); // Re-run if apiKey or libraries change
}

/**
 * Check if Google Maps API is loaded
 */
export const isGoogleMapsAPILoaded = (): boolean => {
  return !!window.google?.maps;
};

/**
 * Check if Google Maps Places library is loaded
 */
export const isPlacesLibraryLoaded = (): boolean => {
  return isGoogleMapsAPILoaded() && !!window.google?.maps.places;
};

/**
 * Safe access to Google Maps API
 * @returns The Google Maps API object or null if not available
 */
export const getGoogleMapsApi = () => {
  if (!isGoogleMapsAPILoaded()) {
    console.error('Google Maps API is not loaded');
    return null;
  }
  return window.google.maps;
};

/**
 * Safe access to Places API
 * @returns The Places API object or null if not available
 */
export const getPlacesApi = () => {
  if (!isPlacesLibraryLoaded()) {
    console.error('Google Maps Places library is not loaded');
    return null;
  }
  return window.google.maps.places;
};

// Global window interface extension
declare global {
  interface Window {
    google?: {
      maps: any;
    };
  }
}