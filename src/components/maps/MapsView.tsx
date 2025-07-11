import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, useJsApiLoader, Libraries } from '@react-google-maps/api';

// Wialon SDK types available on window.wialon
declare global { interface Window { wialon: any; } }

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 100px)'
};

// Default center coordinates (South Africa)
const defaultCenter = {
  lat: -28.4793,
  lng: 24.6727
};

// Libraries to load with Maps API
const libraries: Libraries = ['places', 'geometry', 'visualization'];

const MapsView: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  // hold markers in a ref to avoid re-renders
  const markersRef = useRef<Record<number, google.maps.Marker>>({});
  // keep track overlays
  const trackOverlaysRef = useRef<Record<number, google.maps.ImageMapType>>({});
  
  // Maps service URL from environment or use the hardcoded URL as fallback
  const mapsServiceUrl = import.meta.env.VITE_MAPS_SERVICE_URL || 'https://maps-250085264089.africa-south1.run.app';
  
  // Helper to ensure URL is properly formatted with protocol and port
  const formatServiceUrl = (url: string): string => {
    if (!url) return '';
    
    let formattedUrl = url;
    // Add https:// if no protocol specified
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    // If this is the cloud run URL and no port specified, try to add port 8081
    try {
      const urlObj = new URL(formattedUrl);
      if (
        !urlObj.port && 
        urlObj.protocol === 'https:' &&
        urlObj.hostname.includes('run.app')
      ) {
        // Cloud Run URLs often need a custom port
        const defaultPort = import.meta.env.VITE_MAPS_SERVICE_PORT || '8081';
        urlObj.port = defaultPort;
        formattedUrl = urlObj.toString();
        console.log(`Added port ${defaultPort} to Maps service URL: ${formattedUrl}`);
      }
    } catch (err) {
      console.error('Error parsing Maps service URL:', err);
    }
    
    return formattedUrl;
  };

  const formattedMapsServiceUrl = formatServiceUrl(mapsServiceUrl);
  
  // API key is now managed by our maps service, no need to expose it in the frontend
  const [serviceStatus, setServiceStatus] = useState<'checking' | 'available' | 'error'>('checking');
  const [retryCount, setRetryCount] = useState<number>(0);
  const MAX_RETRIES = 3;
  
  // Check if our maps service is available
  useEffect(() => {
    const checkMapsService = async () => {
      try {
        // Try multiple potential endpoints since we don't know exactly how the service is configured
        const endpoints = [
          `${formattedMapsServiceUrl}/health`,
          `${formattedMapsServiceUrl}/api/health`,
          `${formattedMapsServiceUrl}/status`,
          `${formattedMapsServiceUrl}`
        ];
        
        console.log(`Attempting to connect to maps service: ${formattedMapsServiceUrl}`);
        
        let succeeded = false;
        let lastError: any = null;
        
        // Try each endpoint until one succeeds
        for (const endpoint of endpoints) {
          try {
            console.log(`Checking endpoint: ${endpoint}`);
            const response = await fetch(endpoint, {
              method: 'GET',
              // Use no-cors mode for cross-origin requests to avoid CORS errors
              mode: 'no-cors',
              headers: {
                'Accept': 'application/json, text/plain, */*'
              },
              // Set a reasonable timeout to avoid hanging
              signal: AbortSignal.timeout(5000)
            });
            
            // If we get here with no-cors, the service is likely available
            console.log(`Endpoint ${endpoint} appears to be available`);
            succeeded = true;
            break;
          } catch (endpointErr) {
            console.warn(`Failed to connect to endpoint ${endpoint}:`, endpointErr);
            lastError = endpointErr;
          }
        }
        
        if (succeeded) {
          console.log('Maps service is available');
          setServiceStatus('available');
        } else {
          throw lastError || new Error('All endpoints failed');
        }
      } catch (err: any) {
        console.error('Error connecting to maps service:', err);
        
        // Implement retry logic
        if (retryCount < MAX_RETRIES) {
          console.log(`Retrying maps service connection (${retryCount + 1}/${MAX_RETRIES})...`);
          
          // Schedule a retry after a delay
          const timeout = setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000 * (retryCount + 1)); // Exponential backoff
          
          return () => clearTimeout(timeout);
        } else {
          // After all retries failed, set error state
          setServiceStatus('error');
          setError(`Unable to connect to maps service at ${formattedMapsServiceUrl}. Please check your network connection or service status.`);
        }
      }
    };
    
    checkMapsService();
  }, [formattedMapsServiceUrl, retryCount]);
  
  // For direct integration with our maps service
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [mapLoadRetry, setMapLoadRetry] = useState(0);
  const MAX_MAP_LOAD_RETRIES = 2;
  
  // Reset map loading state when retry is triggered
  useEffect(() => {
    if (mapLoadRetry > 0) {
      // Clear previous error and set loading state
      setLoadError(null);
      setIsLoaded(false);
      console.log(`Retrying map load attempt ${mapLoadRetry}/${MAX_MAP_LOAD_RETRIES}...`);
    }
  }, [mapLoadRetry]);
  
  // This component will now handle map loading internally with the LoadScript component
  // We'll use our Cloud Run service as a proxy for Google Maps

  // Set error state based on service status
  useEffect(() => {
    if (serviceStatus === 'error') {
      console.error('Maps service is unavailable');
    }
  }, [serviceStatus]);
  
  // Callback when map is loaded
  const onMapLoad = (map: google.maps.Map) => {
    console.log('Google Maps loaded successfully');
    setMapInstance(map);
  };

  // Wialon integration: load and display all units as markers
  useEffect(() => {
    if (!mapInstance || !window.wialon) return;
    
    const sess = window.wialon.core.Session.getInstance();
    const token = import.meta.env.VITE_WIALON_TOKEN;
    sess.initSession('https://hst-api.wialon.com');
    sess.loginToken(token, '', (code: any) => {
      if (code) return console.error('Wialon login failed:', window.wialon.core.Errors.getErrorText(code));
      const flags = window.wialon.item.Item.dataFlag.base | window.wialon.item.Unit.dataFlag.lastMessage;
      // initial load of units
      sess.updateDataFlags([{ type: 'type', data: 'avl_unit', flags, mode: 0 }], (err: any) => {
        if (err) return console.error('Wialon flags load error', err);
        const units = sess.getItems('avl_unit') || [];
        const markers: Record<number, google.maps.Marker> = {};
        units.forEach((u: any) => {
          const pos = u.getPosition();
          if (pos) {
            markers[u.getId()] = new google.maps.Marker({
              position: { lat: pos.y, lng: pos.x },
              map: mapInstance,
              title: u.getName(),
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: '#1E88E5',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 1,
              }
            });
          }
        });
        markersRef.current = markers;
        // refresh positions every 30 seconds
        setInterval(() => {
          sess.updateDataFlags([{ type: 'type', data: 'avl_unit', flags, mode: 0 }], (uErr: any) => {
            if (uErr) return console.error('Wialon refresh error', uErr);
            const updated = sess.getItems('avl_unit') || [];
            updated.forEach((u: any) => {
              const pos = u.getPosition();
              const m = markersRef.current[u.getId()];
              if (pos && m) m.setPosition({ lat: pos.y, lng: pos.x });
            });
          });
        }, 30000);
      });
    });
  }, [mapInstance]);

  // Auto-refresh positions every 30s and re-render track overlays every 15min
  useEffect(() => {
    if (!mapInstance || !window.wialon) return;
    
    const sess = window.wialon.core.Session.getInstance();
    const flags = window.wialon.item.Item.dataFlag.base | window.wialon.item.Unit.dataFlag.lastMessage;
    // positions interval
    const posIv = setInterval(() => {
      sess.updateDataFlags([{ type: 'type', data: 'avl_unit', flags, mode: 0 }], (err: any) => {
        if (err) return console.error('Position refresh error', err);
        const units = sess.getItems('avl_unit') || [];
        units.forEach((u: any) => {
          const pos = u.getPosition();
          const m = markersRef.current[u.getId()];
          if (pos && m) m.setPosition({ lat: pos.y, lng: pos.x });
        });
      });
    }, 30000);
    // track overlays interval
    const trackIv = setInterval(() => {
      Object.keys(trackOverlaysRef.current).forEach(id => showTrack(Number(id), 'today'));
    }, 15 * 60 * 1000);
    return () => { clearInterval(posIv); clearInterval(trackIv); };
  }, [mapInstance]);

  // show track layer for a unit
  const showTrack = (unitId: number, mode: 'today' | 'last60') => {
    if (!mapInstance) return;
    
    const sess = window.wialon.core.Session.getInstance();
    const renderer = sess.getRenderer();
    const now = new Date();
    let fromSec: number, toSec: number;
    toSec = Math.floor(now.getTime() / 1000);
    if (mode === 'today') {
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      fromSec = Math.floor(start.getTime() / 1000);
    } else {
      fromSec = toSec - 3600;
    }
    const params = {
      layerName: `route_${unitId}_${mode}`,
      itemId: unitId,
      timeFrom: fromSec,
      timeTo: toSec,
      tripDetector: 1,
      trackColor: '1E88E5',
      trackWidth: 4,
      arrows: 1,
      points: 1,
      pointColor: 'yellow',
      annotations: 0
    };
    renderer.createMessagesLayer(params, (code: any, _layer: any) => {
      if (code) return console.error('Track layer error', window.wialon.core.Errors.getErrorText(code));
      const version = renderer.getVersion();
      const baseUrl = sess.getBaseUrl();
      const overlay = new google.maps.ImageMapType({
        getTileUrl: (coord, zoom) =>
          `${baseUrl}/adfurl${version}/avl_render/${coord.x}_${coord.y}_${zoom}/${sess.getId()}.png`,
        tileSize: new google.maps.Size(256, 256),
        opacity: 0.6
      });
      mapInstance.overlayMapTypes.push(overlay);
      trackOverlaysRef.current[unitId] = overlay;
    });
  };

  // hide track overlay for a unit
  const hideTrack = (unitId: number) => {
    if (!mapInstance) return;
    
    const overlay = trackOverlaysRef.current[unitId];
    if (overlay) {
      const arr = mapInstance.overlayMapTypes.getArray();
      const idx = arr.indexOf(overlay);
      if (idx >= 0) {
        mapInstance.overlayMapTypes.removeAt(idx);
        delete trackOverlaysRef.current[unitId];
      }
    }
  };

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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* controls sidebar and map container */}
      <div className="flex">
        <div className="w-1/4 p-4 overflow-auto">
          <h2 className="font-bold mb-2">Units & Tracks</h2>
          {Object.values(markersRef.current).length ? (
            Object.entries(markersRef.current).map(([id, marker]) => (
              <div key={id} className="mb-2">
                <span className="font-medium">{marker.getTitle()}</span>
                <div className="mt-1 space-x-2">
                  <button
                    className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                    onClick={() => showTrack(Number(id), 'today')}
                  >
                    Today's Track
                  </button>
                  <button
                    className="px-2 py-1 bg-green-600 text-white text-xs rounded"
                    onClick={() => showTrack(Number(id), 'last60')}
                  >
                    Last 60m
                  </button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white text-xs rounded"
                    onClick={() => hideTrack(Number(id))}
                  >
                    Hide Track
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Loading units…</p>
          )}
        </div>
        
        {/* Google Map component */}
        <div className="flex-1">
          {serviceStatus === 'available' ? (
            <LoadScript
              id="google-map-script"
              googleMapsApiKey=""
              libraries={libraries}
              // Note: We can't use a custom URL in the LoadScript component directly
              // Instead, we'll configure the maps service to proxy requests at the server level
              loadingElement={
                <div className="flex items-center justify-center h-full bg-gray-100 p-8 rounded-md">
                  <div className="text-center text-gray-600">
                    <p className="text-xl font-bold mb-2">Loading Google Maps</p>
                    <p className="text-sm">Please wait...</p>
                  </div>
                </div>
              }
              onLoad={() => {
                console.log("Maps script loaded successfully");
                setIsLoaded(true);
              }}
              onError={(error) => {
                console.error('Maps API loading error:', error);
                setLoadError(error);
                setError(`Error loading Maps API: ${error.message}. Try refreshing the page or check the maps service.`);
              }}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={6}
                onLoad={onMapLoad}
                options={{ mapTypeId: "roadmap" }}
              >
                {/* Markers are managed via the Wialon integration */}
              </GoogleMap>
            </LoadScript>
          ) : serviceStatus === 'error' || loadError ? (
            <div className="flex items-center justify-center h-full bg-gray-100 p-8 rounded-md">
              <div className="text-center text-red-500">
                <p className="text-xl font-bold mb-2">Error Connecting to Maps Service</p>
                <p className="text-sm mb-4">{error || `Could not connect to maps service at ${formattedMapsServiceUrl}`}</p>
                {/* Add retry button */}
                {retryCount < MAX_RETRIES && (
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => {
                      setError(null);
                      setLoadError(null);
                      setServiceStatus('checking');
                      setRetryCount(prev => prev + 1);
                      setMapLoadRetry(prev => prev + 1);
                    }}
                  >
                    Retry Connection
                  </button>
                )}
                {/* Show instructions for troubleshooting */}
                {retryCount >= MAX_RETRIES && (
                  <div className="mt-4 p-3 bg-gray-100 rounded text-gray-700 text-sm">
                    <p className="font-bold">Troubleshooting Steps:</p>
                    <ol className="list-decimal list-inside mt-2 text-left">
                      <li>Check that the maps service is running</li>
                      <li>Verify the URL in your environment settings</li>
                      <li>Check your network connection</li>
                      <li>Reload the page and try again</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 p-8 rounded-md">
              <div className="text-center text-gray-500">
                <p className="text-xl font-bold mb-2">Connecting to Maps Service</p>
                <p className="text-sm mb-3">Please wait while we connect to {formattedMapsServiceUrl}...</p>
                <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapsView;