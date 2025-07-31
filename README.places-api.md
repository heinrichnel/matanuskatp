# Google Places API Implementation

This implementation adds direct access to the Google Places API, allowing the application to search for locations and places without requiring the full Maps JavaScript API to be loaded.

## Files Created/Modified

1. **Google Maps Service**
   - `/src/services/googleMapsService.ts` - Direct API service for Google Places API

2. **React Hook**
   - `/src/hooks/useGooglePlaces.ts` - React hook for using the Places API

3. **Search Component**
   - `/src/components/PlaceSearch.tsx` - Example component for searching places

4. **Demo Page**
   - `/src/pages/demos/PlacesApiDemo.tsx` - Demo page showcasing the Places API integration

5. **Documentation**
   - `/docs/GOOGLE_PLACES_API.md` - Documentation for using the Places API integration

## How to Use

### 1. Access the Demo

Visit `/demos/places-api` in your application to see a working demo of the Google Places API integration.

### 2. Using the Hook in Your Components

```typescript
import { useGooglePlaces } from "../hooks/useGooglePlaces";

function YourComponent() {
  const { findPlaceFromText, places, loading, error, placesToLocations } = useGooglePlaces();

  const handleSearch = async () => {
    await findPlaceFromText({
      input: "Central Park",
      fields: ["formatted_address", "name", "geometry", "place_id"],
    });
  };

  // Convert places to application Location format
  const locations = placesToLocations();
}
```

### 3. Using the Service Directly

```typescript
import googleMapsService from "../services/googleMapsService";

async function searchPlaces() {
  try {
    const result = await googleMapsService.findPlaceFromText({
      input: "Airport",
      fields: ["formatted_address", "name", "geometry"],
    });

    console.log(result.candidates);
  } catch (error) {
    console.error("Error searching places:", error);
  }
}
```

## Key Features

1. **Direct API Access** - Uses axios to make direct API calls without requiring the Maps JavaScript API
2. **React Integration** - Provides a hook with loading/error states and helper methods
3. **Type Safety** - Full TypeScript interfaces for all API responses and parameters
4. **Location Bias** - Support for biasing results by point, circle, or rectangle
5. **Environment Configuration** - Uses the `VITE_GOOGLE_MAPS_API_KEY` from environment variables

## Environment Configuration

The API key is automatically loaded from the environment variable `VITE_GOOGLE_MAPS_API_KEY`.

## Security Considerations

For production use, consider:

1. Setting up a backend proxy to protect your API key
2. Implementing API key restrictions in the Google Cloud Console
3. Adding rate limiting to prevent excessive API calls

## Additional Resources

For more information, see:

- Google Places API documentation: https://developers.google.com/maps/documentation/places/web-service/overview
- The application's Places API documentation: `/docs/GOOGLE_PLACES_API.md`
