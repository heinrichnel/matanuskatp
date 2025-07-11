import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getFormattedMapsServiceUrl } from '../utils/mapsService';

const containerStyle: React.CSSProperties = {
  width: '600px',
  height: '400px'
};

const center = {
  lat: -25.7479,   // Pretoria latitude
  lng: 28.2293     // Pretoria longitude
};

const MyMapComponent: React.FC = () => {
  // Get the formatted maps service URL
  const [mapsServiceUrl] = useState(getFormattedMapsServiceUrl());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  
  return (
    <LoadScript 
      googleMapsApiKey=""
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
        zoom={12}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default MyMapComponent;
