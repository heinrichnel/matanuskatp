import React, { useState, useEffect, useRef } from 'react';
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';

const DEFAULT_CENTER = { lat: -28.4793, lng: 24.6727 };
const DEFAULT_ZOOM = 12;

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

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

  const containerStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: '0.375rem',
    overflow: 'hidden'
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
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
    </LoadScript>
  );
};

export default MyMapComponent;
