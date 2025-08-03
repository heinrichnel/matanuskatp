import { useCallback, useEffect, useState } from "react";
import { WialonPosition, WialonUnit } from '../../../types/wialon'

// --- MOCK DATA FOR DEMONSTRATION ---
// In a real implementation, this would be replaced with actual API calls

/**
 * Creates a mock Wialon unit with a specific UID and customizable properties
 * @param uid The unique identifier for the vehicle
 * @param name The display name of the vehicle
 * @param brand The vehicle brand
 * @param model The vehicle model
 * @param lat Latitude position
 * @param lng Longitude position
 * @returns A mock Wialon unit
 */
const createMockUnitWithUID = (
  uid: string,
  name: string,
  brand: string,
  model: string,
  lat: number,
  lng: number
): WialonUnit => {
  const now = Math.floor(Date.now() / 1000);
  const idNumber = parseInt(uid);

  return {
    // Support both property access and method access
    id: idNumber,
    getId: () => idNumber,

    name: name,
    getName: () => name,

    uid: uid,
    getUID: () => uid,

    phone: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    hardwareType: "Teltonika FMB920",
    iconUrl: "A_39.png",
    getIconUrl: () => "A_39.png",

    lastPosition: {
      latitude: lat,
      longitude: lng,
      speed: Math.floor(Math.random() * 100),
      timestamp: now,
      course: Math.floor(Math.random() * 360),
      satellites: Math.floor(Math.random() * 15) + 5,

      // Wialon SDK format compatibility
      x: lng,
      y: lat,
      s: Math.floor(Math.random() * 100),
      t: now,
    },

    // Method-based position access
    getPosition: () => ({
      latitude: lat,
      longitude: lng,
      speed: Math.floor(Math.random() * 100),
      timestamp: now,
      course: Math.floor(Math.random() * 360),
      satellites: Math.floor(Math.random() * 15) + 5,
      x: lng,
      y: lat,
      s: Math.floor(Math.random() * 100),
      t: now,
    }),

    profile: {
      vehicle_class: "heavy_truck",
      registration_plate: name.split(" - ")[1],
      brand: brand,
      model: model,
      year: `${2018 + Math.floor(Math.random() * 5)}`,
      engine_model: `${300 + Math.floor(Math.random() * 300)}HP`,
      primary_fuel_type: "Diesel",
      cargo_type: `${20 + Math.floor(Math.random() * 20)} Ton`,
      effective_capacity: `${500 + Math.floor(Math.random() * 300)}`,
      axles: `${Math.floor(Math.random() * 3) + 2}`,
    },

    general: {
      n: name,
      uid: uid,
      ph: `+${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      hw: "Teltonika FMB920",
    },
  };
};
/**
 * Legacy function to create a default mock Wialon unit
 * @deprecated Use createMockUnitWithUID instead
 */
const createMockWialonUnit = (): WialonUnit => {
  return createMockUnitWithUID(
    "352625693727222",
    "24H - AFQ 1325 (Int Sim)",
    "Shacman",
    "X3000",
    -25.8504,
    28.1882
  );
};

interface UseWialonUnitsResult {
  units: WialonUnit[];
  loading: boolean;
  error: string | null;
  refreshUnits: () => void;
  getUnitByUID: (uid: string) => WialonUnit | undefined;
  unitUIDs: string[]; // Explicitly exposing UIDs for the front-end

  // Helper functions for safe property access
  safeGetUnitId: (unit: WialonUnit) => number | undefined;
  safeGetUnitName: (unit: WialonUnit) => string | undefined;
  safeGetUnitPosition: (unit: WialonUnit) => WialonPosition | undefined;
}

// Use the locally defined useWialonUnits hook
export function FleetUnitsList() {
  const { units, loading, error, refreshUnits, getUnitByUID } = useWialonUnits();
  if (loading) return <p>Loading units...</p>;
  if (error) return <p>Error loading units: {error}</p>;

  return (
    <div>
      {units.map((unit) => (
        <div key={unit.uid || `unit-${unit.id}`}>
          <h3>{unit.name}</h3>
          <p>UID: {unit.uid}</p>
          <p>Brand: {unit.profile?.brand} {unit.profile?.model}</p>
          <p>Latitude: {unit.lastPosition?.latitude}</p>
          <p>Longitude: {unit.lastPosition?.longitude}</p>
        </div>
      ))}
      <button onClick={refreshUnits}>Refresh Units</button>
    </div>
  );
}

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
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real implementation, this would call the Wialon API
      // const fetchedUnits = await getUnits();

      // Create multiple mock units with different UIDs
      const mockUnits = [
        createMockUnitWithUID(
          "352625693727222",
          "24H - AFQ 1325",
          "Shacman",
          "X3000",
          -25.8504,
          28.1882
        ),
        createMockUnitWithUID(
          "352625693727223",
          "26H - BDC 4517",
          "Mercedes",
          "Actros",
          -26.1037,
          28.0473
        ),
        createMockUnitWithUID(
          "352625693727224",
          "31H - CFR 2198",
          "Volvo",
          "FH16",
          -25.7461,
          28.2292
        ),
        createMockUnitWithUID("352625693727225", "33H - DGT 8756", "MAN", "TGX", -26.2708, 28.1123),
        createMockUnitWithUID(
          "352625693727226",
          "37H - EHW 3421",
          "Scania",
          "R500",
          -25.9991,
          27.9549
        ),
      ];

      setUnits(mockUnits);
    } catch (err) {
      console.error("Failed to fetch Wialon units:", err);
      const errorMessage =
        "Failed to load Wialon units. Please check your connection or Wialon token.";
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
    setRefreshCounter((prev) => prev + 1);
  };

  /**
   * Get a specific unit by its UID
   * @param uid The UID of the unit to find
   * @returns The unit with the matching UID or undefined if not found
   */
  /**
   * Get a specific unit by its UID
   * @param uid The UID of the unit to find
   * @returns The unit with the matching UID or undefined if not found
   */
  const getUnitByUID = useCallback(
    (uid: string): WialonUnit | undefined => {
      return units.find((unit) => {
        // Check property-based access first
        if (unit.uid === uid) return true;

        // Check method-based access if available
        if (typeof unit.getUID === 'function' && unit.getUID() === uid) return true;

        return false;
      });
    },
    [units]
  );

  /**
   * Get all unit UIDs for easy access in the frontend
   * @returns Array of all unit UIDs
   */
  const getAllUnitUIDs = useCallback((): string[] => {
    return units.map((unit) => {
      // Get UID using property first, then method, then fallback to empty string
      return unit.uid || (unit.getUID ? unit.getUID() : '') || '';
    });
  }, [units]);

  /**
   * Get all units by a specific brand
   * @param brand The brand to filter by
   * @returns Array of units matching the brand
   */
  const getUnitsByBrand = useCallback(
    (brand: string): WialonUnit[] => {
      return units.filter((unit) => unit.profile?.brand?.toLowerCase() === brand.toLowerCase());
    },
    [units]
  );

  // Calculate the UIDs array for direct access
  const unitUIDs = getAllUnitUIDs();

  // Helper functions for safe property access regardless of API style
  const safeGetUnitId = useCallback((unit: WialonUnit): number | undefined => {
    return unit.id !== undefined ? unit.id : (unit.getId ? unit.getId() : undefined);
  }, []);

  const safeGetUnitName = useCallback((unit: WialonUnit): string | undefined => {
    return unit.name !== undefined ? unit.name : (unit.getName ? unit.getName() : undefined);
  }, []);

  const safeGetUnitPosition = useCallback((unit: WialonUnit): WialonPosition | undefined => {
    return unit.lastPosition !== undefined ? unit.lastPosition : (unit.getPosition ? unit.getPosition() : undefined);
  }, []);

  // Exposing the functions and data needed for the front-end interface
  return {
    units,
    loading,
    error,
    refreshUnits,
    getUnitByUID,
    unitUIDs,
    safeGetUnitId,
    safeGetUnitName,
    safeGetUnitPosition
  };
}

// Export the FleetUnitsList component as default
export default FleetUnitsList;
