import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../utils/firebaseConnectionHandler";

export interface WebBookTrip {
  id: string;
  loadRef: string;
  status: string;
  customer: string;
  origin: string;
  destination: string;
  shippedStatus: boolean;
  deliveredStatus: boolean;
  shippedDate?: string;
  deliveredDate?: string;
  shippedAt?: string;
  deliveredAt?: string;
  importSource: string;
  importedVia?: string;
  importedAt?: string;
  updatedAt: string;
  startTime?: string;
  endTime?: string;
  tripDurationHours?: number;
}

export function useWebBookTrips() {
  const [trips, setTrips] = useState<WebBookTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Query for trips with importSource "web_book"
        const q = query(
          collection(firestore, "trips"),
          where("importSource", "==", "web_book")
        );
        
        const snapshot = await getDocs(q);
        const result: WebBookTrip[] = [];
        
        snapshot.forEach(doc => {
          const data = doc.data();
          result.push({ 
            id: doc.id, 
            ...data 
          } as WebBookTrip);
        });
        
        console.log(`📊 Fetched ${result.length} web book trips from Firestore`);
        setTrips(result);
      } catch (err) {
        console.error("Error fetching web book trips:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // Filter functions for different statuses
  const getActiveTrips = () => trips.filter(trip => 
    trip.status === "active" || trip.status === "shipped" || trip.status === "in_transit"
  );
  
  const getDeliveredTrips = () => trips.filter(trip => 
    trip.status === "delivered" || trip.deliveredStatus === true
  );
  
  const getCompletedTrips = () => trips.filter(trip => 
    trip.status === "completed" || trip.status === "delivered"
  );

  return { 
    trips, 
    loading, 
    error,
    activeTrips: getActiveTrips(),
    deliveredTrips: getDeliveredTrips(),
    completedTrips: getCompletedTrips()
  };
}
