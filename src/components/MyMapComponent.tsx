import React, { useState, useEffect, useRef } from 'react';
import { 
  GoogleMap, 
  LoadScript, 
  Marker, 
  InfoWindow, 
  GoogleMapProps
} from '@react-google-maps/api';
import { getFormattedMapsServiceUrl } from '../utils/mapsService';
import { 
  DEFAULT_MAP_CENTER, 
  DEFAULT_MAP_OPTIONS,
  MAP_STYLES,
  createMarkerIcon,
  getCenterOfLocations,
  getBoundsForLocations,
  MapIconType
} from '../utils/mapConfig';

/**
 * MyMapComponent - A reusable Google Maps component with enhanced functionality
 * 
 * Features:
 * - Customizable markers with predefined icon types
 * - Info windows for markers on click or hover
 * - Auto-fit bounds to show all markers
 * - Responsive design with configurable controls
 * - Error handling and loading states
 * - Custom map styles
 * 
 * Usage:
 * ```tsx
 * <MyMapComponent 
 *   locations={[
 *     { lat: -25.7479, lng: 28.2293, title: "Pretoria", info: "Capital city", iconType: "depot" },
 *     { lat: -26.2041, lng: 28.0473, title: "Johannesburg", info: "Largest city", iconType: "vehicle" }
 *   ]}
 *   height="500px"
 *   showInfoOnHover={true}
 * />
 * ```
 */

// Default map zoom level
const DEFAULT_ZOOM = 12;

// Location interface for map markers
interface Location {
  lat: number;
  lng: number;
  title?: string;
  info?: string;
  iconType?: MapIconType;  // Using imported type
  iconUrl?: string;        // For custom icon urls
}

// Update the component to handle an array of locations
type LocationArray = Array<Location>;

interface MyMapComponentProps {
  locations?: LocationArray;                 // Array of map locations/markers
  center?: { lat: number; lng: number };     // Default center of the map
  zoom?: number;                             // Default zoom level
  height?: string | number;                  // Container height
  width?: string | number;                   // Container width
  showInfoOnHover?: boolean;                 // Show info windows on hover
  className?: string;                        // Additional CSS classes
  showFullscreenControl?: boolean;           // Show fullscreen control
  showZoomControl?: boolean;                 // Show zoom control
  showStreetViewControl?: boolean;           // Show street view control
  showMapTypeControl?: boolean;              // Show map type control
  customMapStyles?: any;                     // Custom map styles
  autofitBounds?: boolean;                   // Whether to auto-fit bounds to all markers
  defaultIconType?: MapIconType;             // Default icon to use for markers
  onMapLoad?: (map: any) => void;            // Callback when map is loaded
  onMapClick?: (e: any) => void;             // Click event handler
  onMarkerClick?: (location: Location, index: number) => void;  // Marker click handler
}

const MyMapComponent: React.FC<MyMapComponentProps> = ({
  locations = [],
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_ZOOM,
  height = '400px',
  width = '100%',
  showInfoOnHover = false,
  className = '',
  showFullscreenControl = true,
  showZoomControl = true,
  showStreetViewControl = true,
  showMapTypeControl = true,
  customMapStyles,
  autofitBounds = true,
  defaultIconType = 'default',
  onMapLoad,
  onMapClick,
  onMarkerClick
}) => {
  // Get the formatted maps service URL
  const [mapsServiceUrl] = useState(getFormattedMapsServiceUrl());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  // Generate container style from props
  const containerStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: '0.375rem', // rounded-md
    overflow: 'hidden'
  };
  
  // Use the API key from environment variables
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  
  // Map reference for programmatic control
  const mapRef = useRef<any>(null);
  
  // Calculate best center when component loads or locations change
  useEffect(() => {
    if (mapRef.current) {
      if (locations.length > 1) {
        // If we have multiple markers, auto-fit the bounds
        const bounds = getBoundsForLocations(locations);
        if (bounds) {
          mapRef.current.fitBounds(bounds);
        }
      } else if (locations.length === 1) {
        // If we have a single location, center on it
        mapRef.current.setCenter(locations[0]);
        mapRef.current.setZoom(zoom);
      } else {
        // If no locations, use the provided center
        mapRef.current.setCenter(center);
        mapRef.current.setZoom(zoom);
      }
    }
  }, [locations, mapRef.current]);
  
  // If we have a load error, display it
  if (loadError) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-red-50 rounded-md border border-red-200">
        <div className="text-center p-4">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h3 className="text-lg font-medium text-red-700 mb-1">Map Loading Error</h3>
          <p className="text-sm text-red-600 mb-3">
            {loadError.message || 'Failed to load Google Maps'}
          </p>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <LoadScript 
      googleMapsApiKey={googleMapsApiKey}
      loadingElement={
        <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-md">
          <div className="text-center">
            <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
            <p>Loading map...</p>
          </div>
        </div>
      }
      onLoad={() => setIsLoading(false)}
      onError={(error) => setLoadError(error)}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={{
          ...DEFAULT_MAP_OPTIONS,
          fullscreenControl: showFullscreenControl,
          mapTypeControl: showMapTypeControl,
          streetViewControl: showStreetViewControl,
          zoomControl: showZoomControl,
          styles: customMapStyles || MAP_STYLES
        }}
        onClick={onMapClick}
        onLoad={(map) => {
          mapRef.current = map;
          setIsLoading(false);
          
          // Apply custom callback if provided
          if (onMapLoad) {
            onMapLoad(map);
          }
        }}
        onUnmount={() => {
          mapRef.current = null;
        }}
      >
        {/* Add default marker if no locations are provided */}
        {locations.length === 0 && <Marker position={center} />}
        
        {/* Add markers for each location */}
        {locations.map((location, index) => (
          <Marker 
            key={`marker-${index}`}
            position={location}
            title={location.title}
            onClick={() => {
              setSelectedLocation(location);
              if (onMarkerClick) {
                onMarkerClick(location, index);
              }
            }}
            onMouseOver={() => showInfoOnHover && setSelectedLocation(location)}
            onMouseOut={() => showInfoOnHover && setSelectedLocation(null)}
            icon={(() => {
              const icon = createMarkerIcon(location.iconType || defaultIconType || 'default', window.google?.maps);
              if (
                icon &&
                icon.anchor &&
                window.google?.maps &&
                !(icon.anchor instanceof window.google.maps.Point)
              ) {
                // Convert anchor to google.maps.Point if needed
                icon.anchor = new window.google.maps.Point(icon.anchor.x, icon.anchor.y);
              }
              // Ensure icon is of type google.maps.Icon or string
              return icon as unknown as google.maps.Icon;
            })()}
          />
        ))}
        
        {/* Add info window for selected location */}
        {selectedLocation && selectedLocation.info && (
          <InfoWindow
            position={selectedLocation}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div className="p-2 max-w-xs">
              {selectedLocation.title && (
                <h3 className="font-medium text-sm mb-1">{selectedLocation.title}</h3>
              )}
              <p className="text-xs text-gray-600">{selectedLocation.info}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MyMapComponent;
