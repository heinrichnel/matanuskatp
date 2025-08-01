import { useState, useEffect } from "react";
import { initializeWialon, getWialonUnits, getUnitById } from "../api/wialon";
import type { WialonUnit } from "../types/wialon-types";

export interface UseWialonOptions {
  autoConnect?: boolean;
  enableRealTimeUpdates?: boolean;
}

export function useWialon(options: UseWialonOptions = {}) {
  const { autoConnect = true, enableRealTimeUpdates = true } = options;

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [units, setUnits] = useState<WialonUnit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

  // Initialize Wialon when the hook is first used
  useEffect(() => {
    async function connect() {
      try {
        setIsLoading(true);
        setError(null);

        const success = await initializeWialon();
        if (!success) {
          throw new Error("Failed to initialize Wialon");
        }

        setIsInitialized(true);
        const wialonUnits = getWialonUnits();
        setUnits(wialonUnits);
      } catch (err) {
        console.error("Wialon initialization error:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    if (autoConnect) {
      connect();
    }

    return () => {
      // Cleanup if needed
    };
  }, [autoConnect]);

  // Update units periodically if real-time updates are enabled
  useEffect(() => {
    if (!isInitialized || !enableRealTimeUpdates) return;

    const interval = setInterval(() => {
      const wialonUnits = getWialonUnits();
      setUnits(wialonUnits);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isInitialized, enableRealTimeUpdates]);

  // Function to manually connect if autoConnect is false
  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const success = await initializeWialon();
      if (!success) {
        throw new Error("Failed to initialize Wialon");
      }

      setIsInitialized(true);
      const wialonUnits = getWialonUnits();
      setUnits(wialonUnits);

      return success;
    } catch (err) {
      console.error("Wialon connection error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to select a unit by ID
  const selectUnit = (unitId: number) => {
    setSelectedUnitId(unitId);
    return getUnitById(unitId);
  };

  // Function to refresh the units list
  const refreshUnits = () => {
    if (isInitialized) {
      const wialonUnits = getWialonUnits();
      setUnits(wialonUnits);
      return wialonUnits;
    }
    return [];
  };

  // Return the hook's API
  return {
    isInitialized,
    isLoading,
    error,
    units,
    selectedUnitId,
    selectedUnit: selectedUnitId ? getUnitById(selectedUnitId) : null,
    connect,
    selectUnit,
    refreshUnits,
  };
}
