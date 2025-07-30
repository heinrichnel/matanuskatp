import React from "react";
import TripRoutePlanner from "./TripRoutePlanner";

/**
 * TripRoutePlannerPage Component
 *
 * A page component that renders the TripRoutePlanner component
 */
const TripRoutePlannerPage: React.FC = () => {
  console.log("TripRoutePlannerPage rendering");
  return (
    <div className="trip-route-planner-page">
      <h1 className="text-2xl font-bold mb-6">Trip Route Planner Page</h1>
      <TripRoutePlanner />
    </div>
  );
};

export default TripRoutePlannerPage;
