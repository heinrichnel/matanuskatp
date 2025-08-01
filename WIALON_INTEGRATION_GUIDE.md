# Wialon Integration Guide

This guide explains how to use the Wialon GPS tracking integration in the application.

## Overview

Our application integrates with the Wialon GPS tracking platform to display real-time location and sensor data from your fleet vehicles. The integration uses the Wialon JavaScript SDK and provides React components for easy implementation.

## Components

### 1. Wialon Service (`/src/api/wialon.ts`)

This is the core service that handles:
- Loading the Wialon SDK
- Authentication with the Wialon server
- Fetching unit data
- Managing position updates

### 2. Wialon React Hook (`/src/hooks/useWialon.ts`)

The `useWialon` hook provides a React-friendly way to access Wialon functionality:

```typescript
const { 
  isInitialized,  // Whether the SDK has been successfully initialized
  isLoading,      // Whether the SDK is currently loading
  error,          // Any error that occurred during initialization
  units,          // Array of available Wialon units
  selectedUnitId, // Currently selected unit ID
  selectedUnit,   // Currently selected unit object
  connect,        // Function to manually connect to Wialon
  selectUnit,     // Function to select a unit
  refreshUnits    // Function to refresh the units list
} = useWialon({
  autoConnect: true,              // Automatically connect on component mount
  enableRealTimeUpdates: true     // Enable periodic updates of unit data
});
```

### 3. Ready-to-Use Components

- `WialonUnitsList`: Displays a list of available units with their positions
- `WialonMap`: Shows unit positions on a Leaflet map
- `WialonDashboard`: Combines the units list and map into a complete dashboard

## Implementation Steps

1. **Add Wialon Components to Your Page**

```tsx
import WialonDashboard from '../pages/WialonDashboard';

function MyPage() {
  return (
    <div>
      <h1>My Fleet Tracking</h1>
      <WialonDashboard />
    </div>
  );
}
```

2. **Custom Implementation Using the Hook**

```tsx
import { useWialon } from '../hooks/useWialon';

function MyCustomComponent() {
  const { isInitialized, units } = useWialon();
  
  return (
    <div>
      {isInitialized ? (
        <p>Found {units.length} vehicles</p>
      ) : (
        <p>Connecting to Wialon...</p>
      )}
    </div>
  );
}
```

## Troubleshooting

If you encounter issues with the Wialon integration:

1. Check the browser console for errors related to SDK loading
2. Verify that the Wialon token is valid and has not expired
3. Ensure your account has access to the units you're trying to display
4. If using a custom implementation, verify that you're waiting for `isInitialized` to be true before accessing unit data

## Security Considerations

- The Wialon token should be securely managed, not hardcoded
- Consider implementing a backend service to provide tokens securely
- Be mindful of displaying sensitive vehicle information in public-facing interfaces

For more detailed information about the Wialon API, refer to the [official Wialon SDK documentation](https://sdk.wialon.com/wiki/en/sidebar/remoteapi/apiref/apiref).
