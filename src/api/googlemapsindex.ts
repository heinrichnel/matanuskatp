/**
 * Google Maps integration for Matanuska
 * This file provides basic Google Maps functionality using the API
 */

// Define the API key for Google Maps
const API_KEY = "AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg";

/**
 * Initialize the Google Maps with a marker at Pretoria
 */
function initMap(): void {
  const center = { lat: -25.7479, lng: 28.2293 };
  const mapElement = document.getElementById("map");

  // Add null check to satisfy TypeScript
  if (!mapElement) {
    console.error("Map element not found");
    return;
  }

  // Use type assertions to avoid TypeScript errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const googleMaps = (window as any).google?.maps;
  if (!googleMaps) {
    console.error("Google Maps API not loaded");
    return;
  }

  const map = new googleMaps.Map(mapElement, {
    zoom: 12,
    center: center,
  });

  new googleMaps.Marker({
    position: center,
    map: map,
    title: "Pretoria",
  });
}

/**
 * Load the Google Maps API script dynamically
 */
function loadGoogleMapsScript(): void {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  // Add error handling for script loading
  script.onerror = () => {
    console.error("Failed to load Google Maps API script");
    console.warn("This may be due to network issues or an invalid API key");
  };
}

// Make initMap globally accessible for Google Maps callback
// Using type assertion to avoid TypeScript errors
(window as any).initMap = initMap;

// Attach the script loader to window.onload
window.onload = loadGoogleMapsScript;

// Export functions for module compatibility
export { initMap, loadGoogleMapsScript };