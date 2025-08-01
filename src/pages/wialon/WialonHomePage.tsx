import LeafletMap from "./components/LeafletMap";

/**
 * WialonHomePage Component
 *
 * Home page for Wialon section with Leaflet map implementation
 */
export default function WialonHomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">My Leaflet Map met Geocoder</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <LeafletMap />
      </div>
    </div>
  );
}
