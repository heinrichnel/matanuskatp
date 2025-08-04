import React from "react";
import { useWialon, useWialonUnitPosition } from "../hooks/useWialon";

// Icon components for better visual appeal with className support
const Icons = {
  Truck: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h8M8 8h8M8 16h8M3 8h1l1 4h14l1-4h1M5 8V6a2 2 0 012-2h10a2 2 0 012 2v2"
      />
    </svg>
  ),
  Location: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  Gauge: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
  Refresh: ({ className = "" }: { className?: string }) => (
    <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
  Satellite: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
      />
    </svg>
  ),
  Speed: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </svg>
  ),
  Compass: ({ className = "" }: { className?: string }) => (
    <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10l2 2 4-4" />
    </svg>
  ),
};

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
    <div className="p-6 space-y-8">
      <div className="card-enhanced">
        <div className="card-header-enhanced flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Fleet Dashboard</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium" style={{ color: "hsl(var(--primary))" }}>
              Connected ({units.length} units)
            </span>
          </div>
        </div>
        <div className="card-content-enhanced">
          {/* Unit Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: "hsl(var(--primary))" }}>Select Unit:</label>
            <select
              value={selectedUnitId || ""}
              onChange={(e) => setSelectedUnitId(Number(e.target.value) || null)}
              className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
              style={{ 
                borderColor: "hsl(var(--border))", 
                boxShadow: "var(--shadow-sm)",
                color: "hsl(var(--foreground))",
                backgroundColor: "hsl(var(--card))"
              }}
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
              <div className="card-enhanced">
                <div className="card-header-enhanced">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Icons.Truck />
                    <span className="ml-2">Unit Information</span>
                  </h3>
                </div>
                <div className="card-content-enhanced">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span style={{ color: "hsl(var(--muted-foreground))" }} className="flex items-center">
                        <span className="mr-2">Name:</span>
                      </span>
                      <span className="font-medium badge-enhanced badge-info">{position.name}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span style={{ color: "hsl(var(--muted-foreground))" }}>ID:</span>
                      <span className="font-medium">{position.id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: "hsl(var(--muted-foreground))" }}>Last Update:</span>
                      <span className="font-medium">
                        {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-enhanced">
                <div className="card-header-enhanced">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Icons.Location />
                    <span className="ml-2">Position</span>
                  </h3>
                </div>
                <div className="card-content-enhanced">
                  {position.position ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span style={{ color: "hsl(var(--muted-foreground))" }}>Latitude:</span>
                        <span className="font-medium">{position.position.latitude.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span style={{ color: "hsl(var(--muted-foreground))" }}>Longitude:</span>
                        <span className="font-medium">{position.position.longitude.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span style={{ color: "hsl(var(--muted-foreground))" }} className="flex items-center">
                          <Icons.Speed className="mr-1 w-4 h-4" />
                          <span>Speed:</span>
                        </span>
                        <span className="font-medium badge-enhanced badge-success">{position.position.speed} km/h</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span style={{ color: "hsl(var(--muted-foreground))" }} className="flex items-center">
                          <Icons.Compass className="mr-1 w-4 h-4" />
                          <span>Course:</span>
                        </span>
                        <span className="font-medium">{position.position.course}°</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ color: "hsl(var(--muted-foreground))" }} className="flex items-center">
                          <Icons.Satellite className="mr-1 w-4 h-4" />
                          <span>Satellites:</span>
                        </span>
                        <span className="font-medium">{position.position.satellites}</span>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: "hsl(var(--muted-foreground))" }}>No position data available</p>
                  )}
                  <button
                    onClick={refreshPosition}
                    className="btn-enhanced btn-primary-enhanced mt-4 w-full flex items-center justify-center"
                  >
                    <Icons.Refresh className="mr-2" />
                    Refresh Position
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sensors */}
          {selectedUnitId && sensors.length > 0 && (
            <div className="mt-6">
              <div className="card-header-enhanced mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Icons.Gauge />
                  <span className="ml-2">Sensors</span>
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sensors.slice(0, 6).map((sensor, index) => {
                  const value = getSensorVal(selectedUnitId, sensor.id || index);
                  return (
                    <div key={sensor.id || index} className="card-enhanced">
                      <div className="p-3 flex justify-between items-center">
                        <span className="text-sm truncate" style={{ color: "hsl(var(--muted-foreground))" }}>
                          {sensor.n || `Sensor ${index + 1}`}
                        </span>
                        <span className="font-medium text-sm badge-enhanced badge-info">
                          {value !== null ? value : "N/A"}
                          {sensor.m && value !== "N/A" && ` ${sensor.m}`}
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
            <div className="text-center py-8 card-enhanced p-6">
              <p style={{ color: "hsl(var(--muted-foreground))" }}>No units available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WialonFleetDashboard;