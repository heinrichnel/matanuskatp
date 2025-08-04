import React from "react";
import { useWialon, useWialonUnitPosition } from "../hooks/useWialon";

const WialonFleetDashboard: React.FC = () => {
  const {
    isInitialized,
    isLoading,
    error,
    units,
    connect,
    reconnect,
    getUnitDetail,
    getSensors,
    getSensorVal,
  } = useWialon({
    autoConnect: true,
    enableRealTimeUpdates: true,
    reconnectOnError: true,
    pollInterval: 15000, // Update every 15 seconds
  });

  const [selectedUnitId, setSelectedUnitId] = React.useState<number | null>(
    units.length > 0 ? units[0].getId?.() || null : null
  );

  // Use the position tracking hook for the selected unit
  const { position, lastUpdate, refreshPosition } = useWialonUnitPosition(selectedUnitId, 10000);

  React.useEffect(() => {
    if (units.length > 0 && !selectedUnitId) {
      setSelectedUnitId(units[0].getId?.() || null);
    }
  }, [units, selectedUnitId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to Wialon...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-800 font-semibold">Connection Error</h3>
            <p className="text-red-600 mt-1">{error.message}</p>
          </div>
          <button
            onClick={() => reconnect()}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 m-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-yellow-800 font-semibold">Not Connected</h3>
            <p className="text-yellow-600 mt-1">Click to connect to Wialon</p>
          </div>
          <button
            onClick={() => connect()}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
          >
            Connect
          </button>
        </div>
      </div>
    );
  }

  const selectedUnit = selectedUnitId ? units.find((u) => u.getId?.() === selectedUnitId) : null;
  const sensors = selectedUnitId ? getSensors(selectedUnitId) : [];

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Fleet Dashboard</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Connected ({units.length} units)</span>
          </div>
        </div>

        {/* Unit Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Unit:</label>
          <select
            value={selectedUnitId || ""}
            onChange={(e) => setSelectedUnitId(Number(e.target.value) || null)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a unit...</option>
            {units.map((unit) => (
              <option key={unit.getId?.()} value={unit.getId?.()}>
                {unit.getName?.()} (ID: {unit.getId?.()})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Unit Details */}
        {selectedUnit && position && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Unit Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{position.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ID:</span>
                  <span className="font-medium">{position.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Update:</span>
                  <span className="font-medium">
                    {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Position</h3>
              {position.position ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Latitude:</span>
                    <span className="font-medium">{position.position.latitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Longitude:</span>
                    <span className="font-medium">{position.position.longitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Speed:</span>
                    <span className="font-medium">{position.position.speed} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course:</span>
                    <span className="font-medium">{position.position.course}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Satellites:</span>
                    <span className="font-medium">{position.position.satellites}</span>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No position data available</p>
              )}
              <button
                onClick={refreshPosition}
                className="mt-3 w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Refresh Position
              </button>
            </div>
          </div>
        )}

        {/* Sensors */}
        {selectedUnitId && sensors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sensors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sensors.slice(0, 6).map((sensor, index) => {
                const value = getSensorVal(selectedUnitId, sensor.id || index);
                return (
                  <div key={sensor.id || index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 truncate">
                        {sensor.n || `Sensor ${index + 1}`}
                      </span>
                      <span className="font-medium text-sm">
                        {value !== null ? value : "N/A"}
                        {sensor.unit && value !== "N/A" && ` ${sensor.unit}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Units */}
        {units.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No units available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WialonFleetDashboard;
