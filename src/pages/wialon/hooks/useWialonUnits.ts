// src/pages/wialon/hooks/useWialonUnits.ts
import { useState, useEffect, useCallback } from 'react';
import { getUnits } from '../../../api/wialon';
import { WialonUnit } from '../../../types/wialon';
import { ErrorCategory, ErrorSeverity, logError } from '../../../utils/errorHandling';

// --- MOCK DATA FOR DEMONSTRATION ---
// In a real implementation, this would be replaced with actual API calls
const createMockWialonUnit = (): WialonUnit => {
  const now = Math.floor(Date.now() / 1000);

  return {
    id: 352625693727222, // Fictional ID
    name: "24H - AFQ 1325 (Int Sim)",
    uid: "352625693727222",
    phone: "+893141335236302",
    hardwareType: "Teltonika FMB920",
    iconUrl: "A_39.png",

    // Using the new lastPosition structure
    lastPosition: {
      latitude: -25.8504, // Centurion, SA
      longitude: 28.1882,
      speed: 60,
      timestamp: now,
      course: 90,
      satellites: 12
    },

    // Profile with snake_case properties to match the interface
    profile: {
      vehicle_class: "heavy_truck",
      registration_plate: "AFQ 1325",
      brand: "Shacman",
      model: "X3000",
      year: "2020",
      engine_model: "420HP",
      primary_fuel_type: "Diesel",
      cargo_type: "32 Ton",
      effective_capacity: "600",
      axles: "2"
    },

    // For backward compatibility
    general: {
      n: "24H - AFQ 1325 (Int Sim)",
      uid: "352625693727222",
      ph: "+893141335236302",
      hw: "Teltonika FMB920"
    }
    {
    "n": "21H - ADS 4865",
    "uid": "352592576757652",
    "ph": "+263773717259",
    "hw": "Teltonika FMB920"
  },
  {
    "n": "22H - AGZ 3812 (ADS 4866)",
    "uid": "864454077916934",
    "ph": "+263781163420",
    "hw": "Teltonika FMC920"
  },
  {
    "n": "23H - AFQ 1324",
    "uid": "864454077685642",
    "ph": "N/A",
    "hw": "Teltonika FMB920"
  },
  {
    "n": "24H - AFQ 1325 (Int Sim)",
    "uid": "352625693727222",
    "ph": "+893141335236302",
    "hw": "Teltonika FMB920"
  },
  {
    "n": "26H - AFQ 1327 (Int Sim)",
    "uid": "357544376232183",
    "ph": "+89314183306",
    "hw": "Teltonika FMB140"
  },
  {
    "n": "28H - AFQ 1329 (Int Sim)",
    "uid": "352592576816946",
    "ph": "+8931182829",
    "hw": "Teltonika FMB920"
  },
  {
    "n": "30H - AGL 4216",
    "uid": "352592576336838",
    "ph": "+263786347542",
    "hw": "Teltonika FMB920"
  },
  {
    "n": "31H - AGZ 1963",
    "uid": "864454077755831",
    "ph": "+263781163420",
    "hw": "Teltonika FMB920"
  },
  {
    "n": "32H - JF964 FS (Int sim)",
    "uid": "867747072816653",
    "ph": "+893141338056160",
    "hw": "Teltonika FMC920"
  },
  {
    "n": "33H - JFK 963 FS (Int sim)",
    "uid": "864454079845115",
    "ph": "+8931338056764",
    "hw": "Teltonika FMC920"

  }
{
    "n": "21H - ADS 4865",
    "uid": "352592576757652",
    "ph": "+263773717259",
    "hw": "Teltonika FMB920"
  },
  {
    "n": "22H - AGZ 3812 (ADS 4866)",
    "uid": "864454077916934",
    "ph": "+263781163420",
    "hw": "Teltonika FMC920"
  },
  {
    "n": "23H - AFQ 1324",
    "uid": "864454077685642",
    "ph": "N/A",
    "hw": "Teltonika FMB920"
  },
  {
    "n": "24H - AFQ 1325 (Int Sim)",
    "uid": "352625693727222",
    "ph": "+893141335236302",
    "hw": "Teltonika FMB920"
  },
  {
    "n": "26H - AFQ 1327 (Int Sim)",
    "uid": "357544376232183",
    "ph": "+89314183306",
    "hw": "Teltonika FMB140"
  },
  {
    "n": "28H - AFQ 1329 (Int Sim)",
    "uid": "352592576816946",
    "ph": "+8931182829",
    "hw": "Teltonika FMB920"
  },
  {
    "n": "30H - AGL 4216",
    "uid": "352592576336838",
    "ph": "+263786347542",
    "hw": "Teltonika FMB920"
  },
  {
    "n": "31H - AGZ 1963",
    "uid": "864454077755831",
    "ph": "+263781163420",
    "hw": "Teltonika FMB920"
  },
  {
    "n": "32H - JF964 FS (Int sim)",
    "uid": "867747072816653",
    "ph": "+893141338056160",
    "hw": "Teltonika FMC920"
  },
  {
    "n": "33H - JFK 963 FS (Int sim)",
    "uid": "864454079845115",
    "ph": "+8931338056764",
    "hw": "Teltonika FMC920"
  }
]
  };
};

interface UseWialonUnitsResult {
  units: WialonUnit[];
  loading: boolean;
  error: string | null;
  refreshUnits: () => void;
}

/**
 * Custom hook to fetch and manage Wialon units data.
 * This version uses mock data for demonstration.
 */
export function useWialonUnits(): UseWialonUnitsResult {
  const [units, setUnits] = useState<WialonUnit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const fetchWialonUnits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real implementation, this would call the Wialon API
      // const fetchedUnits = await getUnits();
      const mockUnit = createMockWialonUnit();
      setUnits([mockUnit]);
    } catch (err) {
      console.error("Failed to fetch Wialon units:", err);
      const errorMessage = "Failed to load Wialon units. Please check your connection or Wialon token.";
      setError(errorMessage);
      setUnits([]); // Clear units on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWialonUnits();
  }, [fetchWialonUnits, refreshCounter]);

  const refreshUnits = () => {
    setRefreshCounter(prev => prev + 1);
  };

  return { units, loading, error, refreshUnits };
}
