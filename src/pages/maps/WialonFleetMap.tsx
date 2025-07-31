// src/components/Map/WialonFleetMap.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api';
import { MapPinIcon } from '@heroicons/react/24/outline'; // Assuming Heroicons for fallback icon

// --- Types ---
import { WialonUnit, GeoJsonFeature } from '../../types/wialon'; // Import your WialonUnit and GeoJSON types
import { mapWialonUnitToGeoJSON } from '../../utils/mapWialonUnitToGeoJSON'; // Import the utility

// --- Utilities ---
import { formatDate } from '../../utils/helpers'; // Assuming formatDate exists

interface WialonFleetMapProps {
  googleMapsApiKey: string; // Your Google Maps API Key
  units: WialonUnit[]; // The list of Wialon units to display
  mapContainerStyle?: React.CSSProperties; // Optional custom map container styles
  zoom?: number; // Initial map zoom level
}

const defaultMapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '600px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
};

const WialonFleetMap: React.FC<WialonFleetMapProps> = ({
  googleMapsApiKey,
  units,
  mapContainerStyle,
  zoom = 10,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<GeoJsonFeature['properties'] | null>(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLngLiteral | null>(null);

  // Convert WialonUnits to GeoJSON Features
  const geoJsonFeatures = useMemo(() => {
    return units.map(unit => mapWialonUnitToGeoJSON(unit)).filter(Boolean) as GeoJsonFeature[];
  }, [units]);

  // Memoize map options and center
  const mapOptions = useMemo(() => {
    // Calculate center based on all units, or default if no units
    if (geoJsonFeatures.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      geoJsonFeatures.forEach(feature => {
        bounds.extend({ lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] });
      });
      // Use the center of the bounds, or fallback to first unit
      const centerLatLng = bounds.getCenter();
      return {
        zoom, // Initial zoom
        center: { lat: centerLatLng.lat(), lng: centerLatLng.lng() },
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      };
    }
    // Default center if no units
    return {
      zoom,
      center: { lat: -25.8504, lng: 28.1882 }, // Centurion, SA
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    };
  }, [geoJsonFeatures, zoom]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Fit map bounds to all markers when units data changes or map loads
  useEffect(() => {
    if (map && geoJsonFeatures.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      geoJsonFeatures.forEach(feature => {
        bounds.extend({ lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] });
      });
      map.fitBounds(bounds);
    }
  }, [map, geoJsonFeatures]);

  const handleMarkerClick = useCallback((feature: GeoJsonFeature) => {
    setInfoWindow(feature.properties);
    setInfoWindowPosition({ lat: feature.geometry.coordinates[1], lng: feature.geometry.coordinates[0] });
  }, []);

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle || defaultMapContainerStyle}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {geoJsonFeatures.map((feature) => {
          const position = {
            lat: feature.geometry.coordinates[1],
            lng: feature.geometry.coordinates[0],
          };

          // Use unit's icon if available, otherwise a default marker
          const markerIcon = feature.properties.iconUrl ? {
            url: feature.properties.iconUrl,
            scaledSize: new window.google.maps.Size(32, 32),
          } : undefined; // Default Google Maps marker if no iconUrl

          return (
            <Marker
              key={feature.properties.uid} // Use uid as key
              position={position}
              icon={markerIcon}
              onClick={() => handleMarkerClick(feature)}
            />
          );
        })}

        {infoWindow && infoWindowPosition && (
          <InfoWindow
            position={infoWindowPosition}
            onCloseClick={() => setInfoWindow(null)}
          >
            <div className="p-2">
              <h3 className="font-bold text-lg mb-1">{infoWindow.name}</h3>
              <p className="text-sm text-gray-700">
                <strong>Reg:</strong> {infoWindow.registrationPlate || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Brand:</strong> {infoWindow.brand || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Model:</strong> {infoWindow.model || 'N/A'}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Speed:</strong> {infoWindow.speed || 'N/A'} km/h
              </p>
              <p className="text-sm text-gray-700">
                <strong>Last Update:</strong> {infoWindow.lastUpdateFormatted || 'N/A'}
              </p>
              <button className="mt-2 text-blue-600 hover:underline text-sm" onClick={() => alert(`View details for ${infoWindow.name}`)}>
                View Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default WialonFleetMap;
