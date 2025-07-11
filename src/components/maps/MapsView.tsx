import React, { useEffect, useRef, useState } from 'react';

// Wialon SDK types available on window.wialon
declare global { interface Window { wialon: any } }

const MapsView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  // Removing EzyTrack embed – only Google Maps is used
  // const [activeTab, setActiveTab] = useState<'google' | 'ezytrack'>('ezytrack');
  // hold markers in a ref to avoid re-renders
  const markersRef = useRef<Record<number, google.maps.Marker>>({});
  // keep track overlays
  const trackOverlaysRef = useRef<Record<number, google.maps.ImageMapType>>({});

  useEffect(() => {
    if (mapRef.current && !map) {
      // Dynamically load Google Maps script if not already loaded
      if (!window.google) {
        const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!key) {
          setError("Google Maps API key is missing. Check your .env configuration.");
          return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&v=beta&libraries=maps&loading=async`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          // Once script is loaded, retry initialization
          setMap(null); // trigger useEffect again
        };
        script.onerror = () => setError('Failed to load Google Maps script.');
        document.head.appendChild(script);
        return;
      }
      const initializeMap = async () => {
        try {
          // Import the maps library
          const { Map } = await google.maps.importLibrary('maps') as any;
          
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

  // Wialon integration: load and display all units as markers, refresh every 30s
  useEffect(() => {
    if (!map || !window.wialon) return;
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
              map,
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
  }, [map]);

  // Auto-refresh positions every 30s and re-render track overlays every 15min
  useEffect(() => {
    if (!map || !window.wialon) return;
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
  }, [map]);

  // show track layer for a unit
  const showTrack = (unitId: number, mode: 'today' | 'last60') => {
    if (!map) return;
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
      map.overlayMapTypes.push(overlay);
      trackOverlaysRef.current[unitId] = overlay;
    });
  };

  // hide track overlay for a unit
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
        {/* <LoadingIndicator /> */}
        <p className="mt-4 text-gray-600">Loading Google Maps...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* controls sidebar */}
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
                    Today’s Track
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
        {/* map container */}
        <div ref={mapRef} className="flex-1 h-[calc(100vh-100px)]" />
      </div>
    </div>
  );
};

export default MapsView;