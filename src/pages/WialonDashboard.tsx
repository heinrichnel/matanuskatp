import React from "react";
import WialonUnitsList from "../components/WialonUnitsList";
import WialonMap from "../components/WialonMap";

const WialonDashboard: React.FC = () => {
  return (
    <div className="wialon-dashboard-container">
      <h2>Wialon GPS Tracking Dashboard</h2>

      <div className="dashboard-layout" style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        <div className="units-panel" style={{ flexBasis: "300px", flexGrow: 1 }}>
          <WialonUnitsList />
        </div>

        <div className="map-panel" style={{ flexBasis: "600px", flexGrow: 2 }}>
          <WialonMap />
        </div>
      </div>
    </div>
  );
};

export default WialonDashboard;
