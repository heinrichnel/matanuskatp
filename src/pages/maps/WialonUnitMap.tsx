// src/components/Map/WialonUnitMap.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api';

// --- Types ---
import { WialonUnit } from '../../types/wialon'; // Your WialonUnit interface
import { MapPinIcon } from '@heroicons/react/24/outline';

// --- Utilities ---
import { formatCurrency, formatDate } from '../../utils/helpers'; // Assuming these exist

interface WialonUnitMapProps {
  googleMapsApiKey: string; // Your Google Maps API Key
  unit: WialonUnit; // The Wialon unit data to display
  mapContainerStyle?: React.CSSProperties; // Optional custom map container styles
  zoom?: number; // Initial map zoom level
}

const defaultMapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '600px', // Default height, can be overridden
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const WialonUnitMap: React.FC<WialonUnitMapProps> = ({
  googleMapsApiKey,
  unit,
  mapContainerStyle,
  zoom = 10, // Default zoom
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  // Memoize map options to prevent unnecessary re-renders
  const mapOptions = useMemo(() => ({
    zoom,
    center: unit.lastPosition ? { lat: unit.lastPosition.y, lng: unit.lastPosition.x } : { lat: 0, lng: 0 },
    disableDefaultUI: false, // Keep controls like zoom, pan
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
  }), [zoom, unit.lastPosition]);

  // Callback when map loads
  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    // You can fit bounds here if you have multiple markers
    // const bounds = new google.maps.LatLngBounds();
    // bounds.extend(new google.maps.LatLng(unit.lastPosition.y, unit.lastPosition.x));
    // mapInstance.fitBounds(bounds);
  }, []);

  // Callback when map unloads
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!unit.lastPosition) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-gray-50 text-gray-600 rounded-lg shadow">
        <MapPinIcon className="w-12 h-12 mb-2 text-gray-400" />
        <p className="text-lg font-medium">No live position data available for this unit.</p>
        <p className="text-sm">Please ensure the Wialon unit is active and sending data.</p>
      </div>
    );
  }

  const position = {
    lat: unit.lastPosition.y,
    lng: unit.lastPosition.x,
  };

  // Create a proper icon URL for Wialon units
  const markerIcon = unit.iconUrl ? {
    url: `https://hst-api.wialon.com/avl_image/${unit.iconUrl}?size=32`, // Correct Wialon icon URL format
    scaledSize: new google.maps.Size(32, 32),
  } : undefined;

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle || defaultMapContainerStyle}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker
          position={position}
          icon={markerIcon}
          onClick={() => setInfoWindowOpen(true)}
        />

        {infoWindowOpen && (
          <InfoWindow
            position={position}
            onCloseClick={() => setInfoWindowOpen(false)}
          >
            <div className="p-2">
              <h3 className="font-bold text-lg mb-1">{unit.name}</h3>
              <p className="text-sm text-gray-700">
                <strong>Reg:</strong> {unit.profile?.registration_plate || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Brand:</strong> {unit.profile?.brand || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Model:</strong> {unit.profile?.model || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Speed:</strong> {unit.lastPosition.s} km/h
              </p>
              <p className="text-sm text-gray-700">
                <strong>Last Update:</strong> {formatDate(new Date(unit.lastPosition.t * 1000).toISOString())}
              </p>
              {/* Add more relevant properties from unit.profile or live data */}
              <p className="text-sm text-gray-700">
                <strong>Fuel Type:</strong> {unit.profile?.primary_fuel_type || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Cargo Type:</strong> {unit.profile?.cargo_type || 'N/A'}
              </p>
              {/* You might also add links to view full unit details or history */}
              <button className="mt-2 text-blue-600 hover:underline text-sm" onClick={() => alert(`View details for ${unit.name}`)}>
                View Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default WialonUnitMap;
