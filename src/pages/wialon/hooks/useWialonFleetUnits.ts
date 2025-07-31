// src/pages/wialon/hooks/useWialonFleetUnits.ts
import { useCallback, useEffect, useState } from "react";
import { WialonUnit } from "../../../types/wialon";
import { getUnits, initializeWialon } from "../../../api/wialon";
import { logError, ErrorCategory, ErrorSeverity } from "../../../utils/errorHandling";

interface UseWialonFleetUnitsResult {
  units: WialonUnit[];
  loading: boolean;
  error: string | null;
  refreshUnits: () => void;
}

/**
 * Custom hook to fetch and manage a list of Wialon units with their last known positions.
 * This function makes real Wialon API calls to fetch multiple units.
 */
export function useWialonFleetUnits(): UseWialonFleetUnitsResult {
  const [units, setUnits] = useState<WialonUnit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // First ensure Wialon is initialized
      const initialized = await initializeWialon();

      if (!initialized) {
        throw new Error("Failed to initialize Wialon connection");
      }

      // Fetch units using the real API
      const fetchedUnits = await getUnits();
      setUnits(fetchedUnits);
    } catch (err) {
      const errorMessage = "Failed to load Wialon fleet data. Please check your connection or Wialon token.";
      setError(errorMessage);
      logError(err as Error, {
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.ERROR,
        message: errorMessage,
        context: { component: "useWialonFleetUnits" },
      });
      setUnits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits();
    // Set up auto-refresh
    const intervalId = setInterval(fetchUnits, 30000); // Refresh every 30 seconds
    return () => clearInterval(intervalId);
  }, [fetchUnits, refreshCounter]);

  const refreshUnits = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  return { units, loading, error, refreshUnits };
}
