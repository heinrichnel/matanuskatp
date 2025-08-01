# Wialon and Google Maps Integration

This document provides a comprehensive overview of the integration between Wialon telematics platform and Google Maps in the Matanuska Transport Platform, including the Cloud Run proxy service for enhanced security and performance.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Cloud Run Maps Proxy Service](#cloud-run-maps-proxy-service)
4. [Wialon Integration](#wialon-integration)
5. [Google Maps Integration](#google-maps-integration)
6. [Troubleshooting](#troubleshooting)
7. [Security Considerations](#security-considerations)
8. [Performance Optimization](#performance-optimization)

## Overview

The Matanuska Transport Platform integrates two critical services:

1. **Wialon** - A telematics platform that provides real-time vehicle tracking, sensor data, and fleet management capabilities
2. **Google Maps** - Provides mapping, geocoding, routing, and places functionality

These integrations enable powerful features like:
- Real-time vehicle tracking on interactive maps
- Proximity search for nearest vehicles
- Address lookup and geocoding
- Route optimization and distance calculations
- Geofencing capabilities

## Architecture

The integration architecture consists of three main components:

1. **Frontend Application** - React/TypeScript application that displays maps and vehicle data
2. **Wialon API** - Direct integration with Wialon's telematics platform
3. **Google Maps Services** - Accessed through either:
   - Direct API calls using an API key
   - Cloud Run proxy service for enhanced security

```
┌─────────────────┐      ┌───────────────────┐
│                 │      │                   │
│  Frontend App   │─────▶│  Wialon API       │
│                 │      │                   │
└────────┬────────┘      └───────────────────┘
         │
         │                ┌───────────────────┐
         │                │                   │
         └───────────────▶│  Maps Proxy       │─────┐
                          │  (Cloud Run)      │     │
                          │                   │     │
                          └───────────────────┘     │
                                                    ▼
                          ┌───────────────────┐     │
                          │                   │     │
                          │  Google Maps API  │◀────┘
                          │                   │
                          └───────────────────┘
```

## Cloud Run Maps Proxy Service

The Cloud Run Maps proxy service provides a secure intermediary between your frontend application and the Google Maps API.

### Service Details

- **Service URL**: https://maps-250085264089.africa-south1.run.app
- **Region**: africa-south1
- **Build ID**: 80b4b7b0-51a7-4f68-90cd-3a95bfd5aa89
- **Container**: africa-south1-docker.pkg.dev/mat1-9e6b3/cloud-run-source-deploy/maps@sha256:5c17a017781479f9a428e897b914a637ea1a2e92ece21c8d834600d00bb1bbe6
- **Health Check**: TCP on port 8080 every 240s

### Benefits of the Proxy Service

1. **API Key Security**: Keeps your Google Maps API key secure by storing it on the server
2. **Usage Monitoring**: Centralized monitoring of API usage and costs
3. **Request Filtering**: Can filter and validate requests before forwarding to Google
4. **Caching**: Can implement caching to reduce API calls and costs
5. **Rate Limiting**: Prevents excessive API usage

### Configuration

The proxy service is configured in the environment with:

```
VITE_MAPS_SERVICE_URL=https://maps-250085264089.africa-south1.run.app
```

When this variable is set, the application will route Google Maps API requests through the proxy instead of making direct API calls.

### Fallback Mechanism

If the proxy service is unavailable, the application can fall back to direct Google Maps API calls using the API key configured in:

```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg
```

This fallback is automatic and transparent to users, ensuring continuous operation even if the proxy service experiences issues.

## Wialon Integration

The Wialon integration provides real-time vehicle tracking and telematics data.

### Configuration

Wialon is configured with:

```
VITE_WIALON_SESSION_TOKEN=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053
VITE_WIALON_API_URL=https://hosting.wialon.com
```

### Features

- **Real-time tracking**: Vehicle positions updated in real-time
- **Unit selection**: Choose specific vehicles to track
- **Sensor data**: Access to vehicle sensor information (fuel, temperature, etc.)
- **Proximity search**: Find vehicles nearest to a specific location
- **Offline mode**: Fallback to mock data when connectivity is lost

### Implementation

The Wialon integration is implemented in:
- `src/pages/wialon/types/wialon.ts` - Core types and API functions
- `src/pages/wialon/utils/wialonUtils.ts` - Utility functions
- `src/pages/wialon/wialon/WialonMapDashboard.tsx` - Main dashboard component

## Google Maps Integration

Google Maps provides mapping, geocoding, and places functionality.

### Configuration

Google Maps is configured with:

```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg
VITE_MAPS_SERVICE_URL=https://maps-250085264089.africa-south1.run.app
```

### Features

- **Interactive maps**: Display vehicles on maps
- **Geocoding**: Convert addresses to coordinates and vice versa
- **Places API**: Search for locations and points of interest
- **Distance calculation**: Calculate distances between points
- **Route optimization**: Find optimal routes between locations

### Implementation

The Google Maps integration is implemented in:
- `src/utils/googleMapsLoader.ts` - Loads the Google Maps JavaScript API
- `src/hooks/useGooglePlaces.ts` - React hook for Places API
- `src/components/Map` - Map components

## Troubleshooting

### Common Issues

#### "Maps service proxy is unavailable" Warning

This warning appears when:
1. The Cloud Run proxy service is not reachable
2. The `VITE_MAPS_SERVICE_URL` environment variable is empty

**Solution**:
- If you intend to use the proxy, ensure the Cloud Run service is running and the URL is correctly set
- If you intend to use direct API calls, this warning is expected and can be ignored as the system will automatically fall back to direct API calls

#### Wialon Connection Issues

If you experience issues connecting to Wialon:
1. Check that your Wialon session token is valid
2. Ensure network connectivity to the Wialon API
3. Check browser console for specific error messages

#### Google Maps Loading Failures

If Google Maps fails to load:
1. Verify your API key is valid and has the necessary APIs enabled
2. Check for billing issues in Google Cloud Console
3. Ensure the domain is authorized for your API key

## Security Considerations

### API Key Protection

1. **Use the Cloud Run proxy** whenever possible to avoid exposing your API key
2. If using direct API calls, ensure your API key has proper restrictions:
   - HTTP referrer restrictions to your domains
   - API restrictions to only the necessary Google Maps APIs

### Wialon Token Security

1. Store the Wialon token securely
2. Consider implementing token refresh mechanisms for long-lived sessions
3. Use the minimum necessary permissions for your token

## Performance Optimization

### Preconnect

Use the `preconnect` feature to establish early connections to the Maps and Wialon services:

```jsx
import { preconnect } from 'react-dom';

function AppRoot() {
  // Preconnect to services
  preconnect("https://maps-250085264089.africa-south1.run.app");
  preconnect("https://hst-api.wialon.com");

  // Rest of your component
}
```

### Lazy Loading

Consider lazy loading the Maps API only when needed:

```jsx
// Only load maps when the component is mounted
useEffect(() => {
  loadGoogleMapsScript("places,geometry");
}, []);
```

### Caching

Implement caching strategies for frequently accessed data:
- Cache geocoding results
- Store recent places searches
- Cache static map data

---

*This documentation was last updated on August 1, 2025*
