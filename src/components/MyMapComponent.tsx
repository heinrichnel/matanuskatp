import React, { useState } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { useLoadGoogleMaps } from '../utils/googleMapsLoader';

const DEFAULT_CENTER = { lat: -28.4793, lng: 24.6727 };
const DEFAULT_ZOOM = 12;

export interface Location {
  lat: number;
  lng: number;
  title?: string;
  info?: string;
}

interface MyMapComponentProps {
  locations?: Location[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string | number;
  width?: string | number;
}

const MyMapComponent: React.FC<MyMapComponentProps> = ({
  locations = [],
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  height = '400px',
  width = '100%',
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const { isLoaded, error } = useLoadGoogleMaps('places');

  const containerStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: '0.375rem',
    overflow: 'hidden'
  };

  // Render loading state if Maps API is not yet loaded
  if (!isLoaded) {
    return (
      <div style={containerStyle} className="flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  // Render error state if loading fails
  if (error) {
    return (
      <div style={containerStyle} className="flex items-center justify-center bg-red-50 border border-red-200">
        <div className="text-center p-4">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h3 className="text-lg font-medium text-red-700 mb-1">Map Loading Error</h3>
          <p className="text-sm text-red-600 mb-3">
            {error.message || 'Failed to load the Google Maps API.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
    >
      {locations.length === 0 && <Marker position={center} />}
      {locations.map((loc, i) => (
        <Marker
          key={i}
          position={loc}
          title={loc.title}
          onClick={() => setSelectedLocation(loc)}
        />
      ))}
      {selectedLocation && selectedLocation.info && (
        <InfoWindow
          position={selectedLocation}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div>
            {selectedLocation.title && <h3>{selectedLocation.title}</h3>}
            <p>{selectedLocation.info}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MyMapComponent;