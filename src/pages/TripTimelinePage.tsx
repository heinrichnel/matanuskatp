import React, { useEffect, useState } from "react";
import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import moment from "moment";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Adjust to your path

interface Vehicle {
  id: string;
  title: string;
}
interface Trip {
  id: string;
  group: string; // vehicleId
  title: string;
  start_time: number;
  end_time: number;
  color?: string;
  type: string;
}

const TYPE_COLORS: Record<string, string> = {
  Retail: "#f59e42",
  Vendor: "#22c55e",
  Maintenance: "#f87171",
  Empty: "#a3a3a3",
  Lime: "#84cc16"
  // Add more as needed
};

function getTripColor(type: string) {
  return TYPE_COLORS[type] || "#64748b";
}

export default function TripTimelinePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [startDate, setStartDate] = useState(moment().startOf("week"));
  const [endDate, setEndDate] = useState(moment().add(1, "week").endOf("week"));
  const [search, setSearch] = useState("");

  // Fetch data from Firestore, or use your trip API
  useEffect(() => {
    async function fetchTrips() {
      const snap = await getDocs(collection(db, "trips"));
      // Filter for active and relevant date range if needed
      const tripDocs = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      const vehicleMap: Record<string, string> = {};
      const tripItems: Trip[] = tripDocs.map(trip => {
        vehicleMap[trip.vehicleId] = trip.vehicleName || trip.vehicleId;
        return {
          id: trip.id,
          group: trip.vehicleId,
          title: trip.label || trip.type,
          start_time: moment(trip.startTime || trip.start).valueOf(),
          end_time: moment(trip.endTime || trip.end).valueOf(),
          color: getTripColor(trip.type),
          type: trip.type
        };
      });
      const vehicles = Object.entries(vehicleMap).map(([id, title]) => ({ id, title }));
      setTrips(tripItems);
      setVehicles(vehicles);
    }
    fetchTrips();
  }, []);

  // Filter vehicles for search
  const filteredVehicles = search
    ? vehicles.filter(v => v.title.toLowerCase().includes(search.toLowerCase()))
    : vehicles;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-3">
        <h2 className="text-xl font-bold mr-4">Timeline</h2>
        <input
          className="border rounded p-2 mr-4"
          placeholder="Search vehicles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {/* Add custom date pickers/week/month toggle if needed */}
      </div>
      <Timeline
        groups={filteredVehicles}
        items={trips}
        defaultTimeStart={startDate.valueOf()}
        defaultTimeEnd={endDate.valueOf()}
        canMove={false}
        canResize={false}
        stackItems
        itemRenderer={({ item, getItemProps }) => (
          <div
            {...getItemProps({
              style: {
                background: item.color,
                color: "#222",
                borderRadius: 4,
                padding: "2px 4px",
                fontSize: "0.85rem",
                border: "none"
              }
            })}
          >
            {item.title}
          </div>
        )}
      />
      <div className="flex space-x-2 mt-3 text-sm">
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <span key={type} className="flex items-center">
            <span className="inline-block w-3 h-3 mr-1 rounded" style={{ background: color }} />
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}
