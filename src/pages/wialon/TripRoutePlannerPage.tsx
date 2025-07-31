import React from "react";
import TripRoutePlanner from "./TripRoutePlanner";

/**
 * TripRoutePlannerPage Component
 *
 * A page component that renders the TripRoutePlanner component
 */
const TripRoutePlannerPage: React.FC = () => {
  return (
    <div className="trip-route-planner-page">
      <TripRoutePlanner />
    </div>
  );
};

export default TripRoutePlannerPage;
