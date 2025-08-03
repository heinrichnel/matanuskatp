import { useCallback, useEffect, useState } from "react";
import { WialonUnit } from "../../../types/wialon";
import { getWialonUnits, initializeWialon } from "../../../api/wialon";
import { logError, ErrorCategory, ErrorSeverity } from "../../../utils/errorHandling";

export function useWialonFleetUnits() {
  const [units, setUnits] = useState<WialonUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const initialized = await initializeWialon();
      if (!initialized) {
        throw new Error("Failed to initialize Wialon connection");
      }

      // No await here because getWialonUnits is synchronous
      const fetchedUnits = getWialonUnits();
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
    const intervalId = setInterval(fetchUnits, 30000);
    return () => clearInterval(intervalId);
  }, [fetchUnits, refreshCounter]);

  const refreshUnits = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  return { units, loading, error, refreshUnits };
}
