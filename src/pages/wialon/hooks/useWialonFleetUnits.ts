import { useCallback, useEffect, useState } from "react";
import { WialonUnit } from "../../../types/wialon";
import { getWialonUnits, initializeWialon } from "../api/wialon";

export function useWialonFleetUnits() {
  const [units, setUnits] = useState<WialonUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const initialized = await initializeWialon();
      if (!initialized) throw new Error("Wialon not initialized");
      setUnits(getWialonUnits());
    } catch (err: any) {
      setError(err?.message || "Failed to load Wialon units");
      setUnits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits();
    // Optionally set up interval/refresh here
  }, [fetchUnits]);

  return { units, loading, error, refreshUnits: fetchUnits };
}
