import React from "react";
import ReactDOM from "react-dom/client";
import FleetAnalyticsApp from "./FleetAnalyticsApp";
import "./index.css"; // assuming this exists for styling

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FleetAnalyticsApp />
  </React.StrictMode>
);
