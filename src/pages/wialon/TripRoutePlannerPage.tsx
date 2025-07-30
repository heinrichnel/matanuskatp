import React from "react";
import TripRoutePlanner from "./TripRoutePlanner";

/**
 * TripRoutePlannerPage Component
 *
 * Container page for the Trip Route Planner
 */
const TripRoutePlannerPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1">
        <TripRoutePlanner />
      </div>
    </div>
  );
};

export default TripRoutePlannerPage;
