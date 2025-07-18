import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

// Define Vehicle interface
export interface Vehicle {
  id: string;
  fleetNumber: string;
  make: string;
  model: string;
  registration: string;
  year?: number;
  type?: string;
  status?: string;
}

export const useFleetData = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const vehiclesCollection = collection(db, 'vehicles');
        const vehiclesSnapshot = await getDocs(vehiclesCollection);
        const vehiclesList = vehiclesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Vehicle[];
        
        setVehicles(vehiclesList);
      } catch (err) {
        console.error("Error fetching fleet data:", err);
        setError("Failed to load fleet data");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return { vehicles, loading, error };
};

export default useFleetData;
