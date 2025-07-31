# Google Places API Integration Guide

This guide explains how to use the Google Places API integration in the MatanuskaTP application.

## Setup

1. **API Key Setup**:
   - Obtain a Google Maps API key from the [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Places API for your project
   - Set API key restrictions (recommended):
     - HTTP referrers (websites)
     - API restrictions (limit to Places API)

2. **Environment Configuration**:
   - Add your API key to the `.env` file
   ...
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

## Direct API Integration

### `googleMapsService`

The `googleMapsService` provides direct access to the Google Places API endpoints:

```typescript
import googleMapsService from "../services/googleMapsService";

// Search for a place
const results = await googleMapsService.findPlaceFromText({
  input: "Central Park, New York",
  fields: ["formatted_address", "name", "geometry"],
});

// Create a location bias (e.g., search within 5km of a point)
const locationBias = googleMapsService.createLocationBias({
  type: "circle",
  params: [37.7749, -122.4194, 5000], // lat, lng, radius in meters
});

// Search with location bias
const results = await googleMapsService.findPlaceFromText({
  input: "coffee shop",
  fields: ["formatted_address", "name", "geometry"],
  locationbias: locationBias,
});
```

### `useGooglePlaces` Hook

The `useGooglePlaces` hook provides a React-friendly way to use the Google Places API:

```typescript
import { useGooglePlaces } from '../hooks/useGooglePlaces';

const MyComponent = () => {
  const { loading, error, places, findPlaceFromText, placesToLocations } = useGooglePlaces();

  const handleSearch = async () => {
    await findPlaceFromText({
      input: 'Airport',
      fields: ['formatted_address', 'name', 'geometry']
    });

    // Convert places to application's Location format
    const locations = placesToLocations();
  };

  return (
    <div>
      <button onClick={handleSearch} disabled={loading}>Search</button>

      {error && <p>Error: {error.message}</p>}

      <ul>
        {places.map((place, index) => (
          <li key={index}>
            <h3>{place.name}</h3>
            <p>{place.formatted_address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

## Client-Side Integration

The application also provides client-side integration with the Google Maps JavaScript API:

### `placesService`

The `placesService` utility provides functions for interacting with the Google Places JavaScript API:

```typescript
import { initPlacesService, searchPlacesByText } from '../utils/placesService';

// In a component with a Google Map instance
const mapInstance = /* your Google Map instance */;
const placesService = initPlacesService(mapInstance);

// Search for places
const places = await searchPlacesByText(
  placesService,
  'Restaurant',
  {
    locationBias: { lat: 37.7749, lng: -122.4194, radius: 5000 }
  }
);
```

## PlaceSearch Component

The application includes a `PlaceSearch` component that demonstrates how to use the Places API:

```typescript
import PlaceSearch from '../components/PlaceSearch';

const MapContainer = () => {
  const handlePlaceSelect = (location) => {
    // Do something with the selected location
    console.log('Selected place:', location);
  };

  return (
    <div>
      <PlaceSearch onPlaceSelect={handlePlaceSelect} />
      {/* Map component here */}
    </div>
  );
};
```

## API Usage Considerations

1. **Billing**: The Places API has usage limits and billing. Monitor your usage in the Google Cloud Console.

2. **Security**:
   - For production, consider using a backend proxy to protect your API key
   - Set appropriate API key restrictions

3. **Performance**:
   - The direct API approach is useful for server-side rendering or environments where loading the full Maps JavaScript API is not desired
   - The client-side approach is better for interactive maps where the JavaScript API is already loaded

4. **Error Handling**:
   - Both approaches include error handling mechanisms
   - Monitor for quota errors (OVER_QUERY_LIMIT) which indicate you're exceeding your usage limits
