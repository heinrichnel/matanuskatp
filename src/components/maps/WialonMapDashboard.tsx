import React, { useEffect, useRef, useState } from 'react';
import { loadWialonSDK, loginWialon, getWialonUnits } from '../../utils/wialonAuth';
import { useLoadGoogleMaps, isGoogleMapsAPILoaded } from '../../utils/googleMapsLoader';
import WialonLoginPanel from '../WialonLoginPanel';

// Wialon token
const WIALON_TOKEN = "c1099bc37c906fd0832d8e783b60ae0d30936747FF150CC77961EAF35CBC1E2E71BD55AF";

interface Unit {
  id: number;
  name: string;
  pos?: {
    x: number; // longitude
    y: number; // latitude
    s: number; // speed
    t: number; // timestamp
  };
}

const WialonMapDashboard: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Store markers in a ref to avoid re-renders
  const markersRef = useRef<Record<number, google.maps.Marker>>({});
  // Store track overlays in a ref
  const trackOverlaysRef = useRef<Record<number, google.maps.ImageMapType>>({});

  // Load Google Maps API
  useLoadGoogleMaps();

  // Initialize Google Maps and Wialon SDK
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        
        // Initialize map if Google Maps is loaded
        if (mapRef.current && !map && isGoogleMapsAPILoaded()) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: -28.4793, lng: 24.6727 }, // Default to South Africa
            zoom: 6,
            mapTypeId: "roadmap",
          });
          setMap(mapInstance);
        }
        
        // Load Wialon SDK
        await loadWialonSDK();
        
        // Auto-login with token
        try {
          await loginWialon(WIALON_TOKEN);
          setIsLoggedIn(true);
          // Fetch units after login
          fetchUnits();
        } catch (loginErr) {
          console.error("Login failed:", loginErr);
          setError(`Login failed: ${loginErr}`);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Initialization error:", err);
        setError(`Initialization error: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, []);

  // Fetch units from Wialon
  const fetchUnits = async () => {
    try {
      setIsLoading(true);
      const wialonUnits = await getWialonUnits();
      
      // Convert Wialon units to our format
      const formattedUnits: Unit[] = wialonUnits.map((u: any) => ({
        id: u.getId(),
        name: u.getName(),
        pos: u.getPosition()
      }));
      
      setUnits(formattedUnits);
      
      // Create markers for units with positions
      if (map) {
        const markers: Record<number, google.maps.Marker> = {};
        
        formattedUnits.forEach(unit => {
          if (unit.pos) {
            markers[unit.id] = new google.maps.Marker({
              position: { lat: unit.pos.y, lng: unit.pos.x },
              map,
              title: unit.name,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 6,
                fillColor: '#1E88E5',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 1,
              }
            });
            
            // Add click listener to marker
            markers[unit.id].addListener('click', () => {
              setSelectedUnit(unit);
            });
          }
        });
        
        markersRef.current = markers;
      }
    } catch (err) {
      console.error("Error fetching units:", err);
      setError(`Error fetching units: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Show track for a unit
  const showTrack = (unitId: number, mode: 'today' | 'last60') => {
    if (!map || !window.wialon) return;
    
    const sess = window.wialon.core.Session.getInstance();
    const renderer = sess.getRenderer();
    const now = new Date();
    let fromSec: number, toSec: number;
    
    toSec = Math.floor(now.getTime() / 1000);
    
    if (mode === 'today') {
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      fromSec = Math.floor(start.getTime() / 1000);
    } else {
      fromSec = toSec - 3600; // Last 60 minutes
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
      if (code) {
        console.error('Track layer error', window.wialon.core.Errors.getErrorText(code));
        return;
      }
      
      const version = renderer.getVersion();
      const baseUrl = sess.getBaseUrl();
      const overlay = new google.maps.ImageMapType({
        getTileUrl: (coord, zoom) =>
          `${baseUrl}/adfurl${version}/avl_render/${coord.x}_${coord.y}_${zoom}/${sess.getId()}.png`,
        tileSize: new google.maps.Size(256, 256),
        opacity: 0.6
      });
      
      map.overlayMapTypes.push(overlay);
      trackOverlaysRef.current[unitId] = overlay;
    });
  };

  // Hide track for a unit
  const hideTrack = (unitId: number) => {
    if (!map) return;
    
    const overlay = trackOverlaysRef.current[unitId];
    if (overlay) {
      const arr = map.overlayMapTypes.getArray();
      const idx = arr.indexOf(overlay);
      if (idx >= 0) {
        map.overlayMapTypes.removeAt(idx);
        delete trackOverlaysRef.current[unitId];
      }
    }
  };

  // Refresh unit positions
  const refreshPositions = async () => {
    try {
      const wialonUnits = await getWialonUnits();
      
      wialonUnits.forEach((u: any) => {
        const pos = u.getPosition();
        const marker = markersRef.current[u.getId()];
        if (pos && marker) {
          marker.setPosition({ lat: pos.y, lng: pos.x });
        }
      });
    } catch (err) {
      console.error("Error refreshing positions:", err);
    }
  };

  // Set up auto-refresh for positions
  useEffect(() => {
    if (!isLoggedIn) return;
    
    const intervalId = setInterval(refreshPositions, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [isLoggedIn]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-2xl">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <WialonLoginPanel />
      </div>
    );
  }

  if (isLoading && !map) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h1 className="text-xl font-bold p-4 border-b">Wialon Map Dashboard</h1>
      
      {/* Main content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 p-4 overflow-auto border-r">
          <h2 className="font-bold mb-4">Units & Tracks</h2>
          
          {/* Login status */}
          {!isLoggedIn ? (
            <div className="mb-4">
              <p className="text-red-600 mb-2">Not logged in to Wialon</p>
              <WialonLoginPanel />
            </div>
          ) : (
            <>
              {/* Refresh button */}
              <button 
                className="mb-4 px-3 py-1 bg-blue-600 text-white rounded"
                onClick={onClick || (() => {})}
                disabled={isLoading}
              >
                {isLoading ? 'Refreshing...' : 'Refresh Units'}
              </button>
              
              {/* Units list */}
              {units.length === 0 ? (
                <p className="text-gray-500">No units found</p>
              ) : (
                <div className="space-y-3">
                  {units.map(unit => (
                    <div key={unit.id} className="border rounded p-2">
                      <div className="font-medium">{unit.name}</div>
                      {unit.pos && (
                        <div className="text-xs text-gray-600 mt-1">
                          <div>Lat: {unit.pos.y.toFixed(6)}, Lng: {unit.pos.x.toFixed(6)}</div>
                          <div>Speed: {unit.pos.s} km/h</div>
                          <div>Last update: {new Date(unit.pos.t * 1000).toLocaleString()}</div>
                        </div>
                      )}
                      <div className="mt-2 space-x-1">
                        <button
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                          onClick={onClick || (() => {})}
                        >
                          Today's Track
                        </button>
                        <button
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded"
                          onClick={onClick || (() => {})}
                        >
                          Last 60m
                        </button>
                        <button
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded"
                          onClick={onClick || (() => {})}
                        >
                          Hide Track
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Map container */}
        <div ref={mapRef} className="flex-1 h-[calc(100vh-150px)]" />
      </div>
    </div>
  );
};

export default WialonMapDashboard;