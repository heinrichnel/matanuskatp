import { FC } from "react";
import LeafletMap from "./components/LeafletMap";

/**
 * TripRoutePlanner Component
 *
 * Handles route planning functionality for trips
 */
const TripRoutePlanner: FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Trip Route Planner</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <LeafletMap />
        <div className="mt-4">
          <p>Use the map above to search for locations and plan routes</p>
        </div>
      </div>
    </div>
  );
};

export default TripRoutePlanner;
