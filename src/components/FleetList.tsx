import React from "react";
import { useWialon } from "../context/WialonContext";

export const FleetList: React.FC = () => {
  const { units, initializing, error, refreshUnits, loggedIn } = useWialon();

  if (initializing) return <div>Loading Wialon...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error.message}</div>;
  if (!loggedIn) return <div>Not logged in to Wialon.</div>;

  return (
    <div>
      <h2>Fleet Units</h2>
      <ul>
        {units.map((u) => (
          <li key={u.id}>
            {u.name} [{u.position?.y}, {u.position?.x}]
            {u.iconUrl && (
              <img src={u.iconUrl} alt="icon" style={{ width: 32, verticalAlign: "middle" }} />
            )}
          </li>
        ))}
      </ul>
      <button onClick={refreshUnits}>Refresh Units</button>
    </div>
  );
};

export default FleetList;