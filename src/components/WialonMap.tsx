import React, { useEffect, useState } from "react";
import { useWialon } from "../hooks/useWialon";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface UnitMapData {
  id: number;
  name: string;
  lat: number;
  lng: number;
  speed: number;
  course: number;
  iconUrl?: string;
}

const WialonMap: React.FC = () => {
  const { isInitialized, isLoading, error, units, connect } = useWialon();
  const [mapUnits, setMapUnits] = useState<UnitMapData[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([61.21, -149.9]); // Default to Anchorage, AK

  // Process units to get map data
  useEffect(() => {
    if (isInitialized && units.length > 0) {
      const unitsWithPosition: UnitMapData[] = units
        .map((unit) => {
          const pos = unit.getPosition?.();
          if (!pos) return null;

          return {
            id: unit.getId?.(),
            name: unit.getName?.() || "Unknown unit",
            lat: pos.y,
            lng: pos.x,
            speed: pos.s,
            course: pos.c,
            iconUrl: unit.getIconUrl?.(32),
          };
        })
        .filter((unit): unit is UnitMapData => unit !== null);

      setMapUnits(unitsWithPosition);

      // Update map center if we have units with positions
      if (unitsWithPosition.length > 0) {
        setMapCenter([unitsWithPosition[0].lat, unitsWithPosition[0].lng]);
      }
    }
  }, [isInitialized, units]);

  // Create custom icon for units when available
  const getUnitIcon = (iconUrl?: string) => {
    if (!iconUrl) return new L.Icon.Default();

    return L.icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  if (isLoading) {
    return <div>Loading Wialon map data...</div>;
  }

  if (error) {
    return (
      <div>
        <h3>Error loading Wialon data</h3>
        <p>{error.message}</p>
        <button onClick={() => connect()}>Retry Connection</button>
      </div>
    );
  }

  return (
    <div className="wialon-map-container" style={{ height: "500px", width: "100%" }}>
      <h3>Wialon Units Map</h3>
      {!isInitialized ? (
        <button onClick={() => connect()}>Connect to Wialon</button>
      ) : mapUnits.length === 0 ? (
        <p>No units with position data available</p>
      ) : (
        <MapContainer
          center={mapCenter}
          zoom={10}
          style={{ height: "calc(100% - 40px)", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapUnits.map((unit) => (
            <Marker key={unit.id} position={[unit.lat, unit.lng]} icon={getUnitIcon(unit.iconUrl)}>
              <Popup>
                <div>
                  <strong>{unit.name}</strong>
                  <p>Speed: {unit.speed} km/h</p>
                  <p>Heading: {unit.course}°</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default WialonMap;
