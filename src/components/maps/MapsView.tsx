import React, { useEffect, useRef, useState } from 'react';
import LoadingIndicator from '../ui/LoadingIndicator';

const MapsView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      const initializeMap = async () => {
        try {
          // Use the importLibrary pattern from the script in index.html
          if (!window.google) {
            setError("Google Maps API not available. Please check your internet connection.");
            return;
          }

          // Import the maps library
          const { Map } = await google.maps.importLibrary("maps") as any;
          
          // Initialize the map
          const mapInstance = new Map(mapRef.current, {
            center: { lat: -28.4793, lng: 24.6727 }, // Default to South Africa
            zoom: 6,
            mapTypeId: "roadmap",
          });
          
          setMap(mapInstance);
          setIsLoaded(true);
        } catch (err) {
          console.error("Error initializing map:", err);
          setError("Failed to initialize Google Maps. Please try again later.");
        }
      };

      initializeMap();
    }
  }, [mapRef, map]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl">
          <strong className="font-bold">Error loading Google Maps: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <LoadingIndicator />
        <p className="mt-4 text-gray-600">Loading Google Maps...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Fleet Location Map</h2>
        <p className="text-gray-500">View the current location of your fleet vehicles</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div 
        ref={mapRef}
        className="w-full h-[calc(100vh-300px)]" 
        style={{ minHeight: "500px" }}
      />
    </div>
  );
};

export default MapsView;