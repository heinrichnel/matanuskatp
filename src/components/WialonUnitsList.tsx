import React, { useEffect } from "react";
import { useWialon } from "../hooks/useWialon";

const WialonUnitsList: React.FC = () => {
  const {
    isInitialized,
    isLoading,
    error,
    units,
    selectedUnitId,
    selectUnit,
    refreshUnits,
    connect,
  } = useWialon({
    autoConnect: true,
    enableRealTimeUpdates: true,
  });

  useEffect(() => {
    if (isInitialized) {
      console.log(`Wialon initialized successfully with ${units.length} units`);
    }
  }, [isInitialized, units.length]);

  if (isLoading) {
    return <div>Loading Wialon SDK...</div>;
  }

  if (error) {
    return (
      <div>
        <h3>Error loading Wialon SDK</h3>
        <p>{error.message}</p>
        <button onClick={() => connect()}>Retry Connection</button>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div>
        <h3>Wialon not initialized</h3>
        <button onClick={() => connect()}>Connect to Wialon</button>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div>
        <h3>No units found</h3>
        <button onClick={() => refreshUnits()}>Refresh Units</button>
      </div>
    );
  }

  return (
    <div className="wialon-units-container">
      <h3>Wialon Units ({units.length})</h3>

      <button onClick={() => refreshUnits()}>Refresh Units</button>

      <ul className="units-list">
        {units.map((unit) => {
          const unitDetails = unit.getPosition
            ? {
                name: unit.getName?.() || "Unknown",
                pos: unit.getPosition?.() || null,
              }
            : { name: "Unknown", pos: null };

          const isSelected = selectedUnitId === unit.getId?.();

          return (
            <li
              key={unit.getId?.()}
              className={`unit-item ${isSelected ? "selected" : ""}`}
              onClick={() => selectUnit(unit.getId?.())}
            >
              <div className="unit-name">{unitDetails.name}</div>

              {unitDetails.pos && (
                <div className="unit-position">
                  <div>Lat: {unitDetails.pos.y.toFixed(6)}</div>
                  <div>Lng: {unitDetails.pos.x.toFixed(6)}</div>
                  <div>Speed: {unitDetails.pos.s} km/h</div>
                </div>
              )}

              {!unitDetails.pos && <div className="unit-no-position">No position data</div>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WialonUnitsList;
