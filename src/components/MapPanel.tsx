import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useWialonUnits } from "../hooks/useWialonUnits";
import { useEffect } from "react";

export default function MapPanel({ sdkReady }: { sdkReady: boolean }) {
  const { units } = useWialonUnits(sdkReady);

  return (
    <MapContainer center={[-29, 24]} zoom={6} style={{ height: "400px" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {units.map(unit => {
        const pos = unit.pos;
        return pos && typeof pos.x === "number" && typeof pos.y === "number" ? (
          <Marker key={unit.id} position={[pos.y, pos.x]}>
            <Popup>{unit.name}</Popup>
          </Marker>
        ) : null;
      })}
    </MapContainer>
  );
}

