# Google Maps Integration Guide

This guide explains how to use the Google Maps components and utilities in this application.

## API Key Setup

The application uses the Google Maps JavaScript API with the following key:

```
AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg
```

This key should be restricted to the following APIs:
- Maps JavaScript API
- Places API
- Directions API
- Geocoding API

## Available Components

### Basic Map Component

The `MyMapComponent` is a simple map component that displays markers on a map:

```tsx
import MyMapComponent from '../components/MyMapComponent';

// Example usage
<MyMapComponent
  locations={[
    { lat: -25.7479, lng: 28.2293, title: "Pretoria", info: "Capital city" },
    { lat: -26.2041, lng: 28.0473, title: "Johannesburg", info: "Largest city" }
  ]}
  height="500px"
  zoom={10}
/>
```

### Enhanced Map Component

The `EnhancedMapComponent` adds more features like routes, places search, and detailed location information:

```tsx
import EnhancedMapComponent from '../components/maps/EnhancedMapComponent';

// Example usage
<EnhancedMapComponent
  locations={vehicleLocations}
  showRoutes={true}
  showPlacesSearch={true}
  routeOptions={{
    strokeColor: '#FF0000',
    mode: 'driving'
  }}
  height="600px"
  defaultIconType="vehicle"
/>
```

### Location Detail Panel

The `LocationDetailPanel` shows detailed information about a selected location:

```tsx
import LocationDetailPanel from '../components/maps/LocationDetailPanel';

// Example usage
<LocationDetailPanel
  location={selectedLocation}
  onClose={() => setSelectedLocation(null)}
  onViewDirections={(location) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`, '_blank');
  }}
/>
```

## Map Utility Functions

### Map Configuration (`mapConfig.ts`)

Contains default styles, options, and helper functions:

```tsx
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_OPTIONS, MAP_STYLES } from '../utils/mapConfig';
import { createMarkerIcon } from '../utils/mapConfig';

// Create a marker icon
const icon = createMarkerIcon('vehicle'); // Other options: 'depot', 'driver', 'alert', etc.
```

### Places Service (`placesService.ts`)

Provides functions for searching places and getting place details:

```tsx
import { initPlacesService, searchPlacesByText } from '../utils/placesService';

// Initialize the service
const placesService = initPlacesService(mapRef.current);

// Search for places
const searchResults = await searchPlacesByText(placesService, "Gas station near Pretoria");
```

## Cloud Run Deployment

This application is deployed on Google Cloud Run with the following configuration:

- Service Account: `250085264089-compute@developer.gserviceaccount.com`
- Region: `africa-south1`
- Environment Variables:
  - `VITE_GOOGLE_MAPS_API_KEY=AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg`
  - `VITE_WIALON_TOKEN=c1099bc37c906fd0832d8e783b60ae0d462BADEC45A6E5503B1BEADDE71E232800E9C406`

## Important Notes

1. **API Key Security**: 
   - The Google Maps API key should be properly restricted to prevent unauthorized use
   - Use environment variables to store the key (`VITE_GOOGLE_MAPS_API_KEY`)

2. **Places API Usage**:
   - Respect usage quotas and limits
   - Do not cache or store Places data outside of what's allowed by Google's ToS

3. **Troubleshooting**:
   - Check browser console for errors
   - Verify API key has correct permissions
   - Ensure Google Maps script is loaded with all required libraries
   - API keys should be restricted to the appropriate domains

## Best Practices

1. Use the `useLoadGoogleMaps()` hook to load the Google Maps API
2. Check if the API is loaded with `isGoogleMapsAPILoaded()` before using it
3. Handle loading and error states in your components
4. Use the utility functions provided in `mapConfig.ts` for consistent styling
5. Use the `LocationDetailPanel` for showing detailed information
6. Include proper error handling for all API calls
