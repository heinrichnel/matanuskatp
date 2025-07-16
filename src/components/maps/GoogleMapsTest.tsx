import React, { useEffect, useState } from 'react';
import { loadGoogleMapsScript, isGoogleMapsAPILoaded } from '../../utils/googleMapsLoader';
import { checkEnvVariables, verifyGoogleMapsConfig } from '../../utils/envChecker';
import Card, { CardContent, CardHeader } from '../ui/Card';

const GoogleMapsTest: React.FC = () => {
  const [mapLoaded, setMapLoaded] = useState(isGoogleMapsAPILoaded());
  const [mapError, setMapError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!mapLoaded) {
      loadGoogleMapsScript()
        .then(() => {
          console.log('Google Maps API loaded successfully');
          setMapLoaded(true);
        })
        .catch((error) => {
          console.error('Error loading Google Maps API:', error);
          setMapError(error.message || 'Failed to load Google Maps');
        });
    }
  }, [mapLoaded]);

  useEffect(() => {
    // Initialize map when API is loaded
    if (mapLoaded && window.google && window.google.maps) {
      const mapElement = document.getElementById('google-map');
      if (mapElement) {
        const map = new window.google.maps.Map(mapElement, {
          center: { lat: -26.2041, lng: 28.0473 }, // Johannesburg
          zoom: 12,
        });
        
        // Add a marker
        new window.google.maps.Marker({
          position: { lat: -26.2041, lng: 28.0473 },
          map,
          title: 'Johannesburg'
        });
      }
    }
  }, [mapLoaded]);

  // Use the environment checker utility
  const [envCheck, setEnvCheck] = useState<any>(null);
  
  useEffect(() => {
    const check = checkEnvVariables();
    const mapsConfigOk = verifyGoogleMapsConfig();
    setEnvCheck({ ...check, mapsConfigOk });
    
    // Log raw values for debugging
    console.log('Raw env values:', {
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      iframeUrl: import.meta.env.VITE_GOOGLE_MAPS_IFRAME_URL,
      mode: import.meta.env.MODE
    });
  }, []);
  
  // API Key info
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const iframeUrl = import.meta.env.VITE_GOOGLE_MAPS_IFRAME_URL || '';
  const keyAvailable = !!apiKey;
  const iframeUrlAvailable = !!iframeUrl;

  return (
    <Card>
      <CardHeader>Google Maps API Test</CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-2 bg-gray-100 rounded text-sm">
            <p>API Key Available: {keyAvailable ? '✅' : '❌'} {keyAvailable && `(length: ${apiKey.length})`}</p>
            <p>iframe URL Available: {iframeUrlAvailable ? '✅' : '❌'} {iframeUrlAvailable && `(length: ${iframeUrl.length})`}</p>
            <p>Maps Config OK: {envCheck?.mapsConfigOk ? '✅' : '❌'}</p>
            <p>Environment Mode: {import.meta.env.MODE}</p>
            {mapError && <p className="text-red-500">Error: {mapError}</p>}
            
            <div className="mt-2 p-2 bg-gray-200 rounded overflow-auto max-h-32">
              <p className="font-bold">Environment Variables Check:</p>
              {envCheck ? (
                <div>
                  <p>Found {envCheck.allVariables.length} environment variables</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-left">Variable</th>
                        <th className="text-left">Status</th>
                        <th className="text-left">Preview</th>
                      </tr>
                    </thead>
                    <tbody>
                      {envCheck.variables.map((v: any) => (
                        <tr key={v.name}>
                          <td>{v.name}</td>
                          <td>{v.exists ? '✅' : '❌'}</td>
                          <td>{v.preview}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>Loading environment check...</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dynamic Google Maps JS API */}
            <div>
              <h3 className="font-medium mb-2">Google Maps JavaScript API:</h3>
              <div 
                id="google-map" 
                style={{ height: '300px', width: '100%' }}
                className="border rounded-md"
              >
                {!mapLoaded && !mapError && <div className="flex h-full justify-center items-center">Loading map...</div>}
                {mapError && <div className="flex h-full justify-center items-center text-red-500">{mapError}</div>}
              </div>
            </div>
            
            {/* Google Maps Embed API */}
            <div>
              <h3 className="font-medium mb-2">Google Maps Embed API:</h3>
              <iframe
                src={iframeUrl && !iframeUrl.includes('${') ? 
                  iframeUrl : 
                  `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=-26.2041,28.0473&zoom=12`}
                style={{ height: '300px', width: '100%' }}
                className="border rounded-md"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMapsTest;
