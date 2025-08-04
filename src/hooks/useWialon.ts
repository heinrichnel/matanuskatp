import { useCallback, useEffect, useState } from "react";
import {
  getSensorValue,
  getUnitById,
  getUnitDetails,
  getUnitSensors,
  getWialonUnits,
  initializeWialon,
  reconnectWialon,
  registerUnitMessageListener,
  unregisterUnitMessageListener,
} from "../api/wialon";
import type { WialonSensor, WialonUnit } from "../types/wialon-types";

export interface UseWialonOptions {
  autoConnect?: boolean;
  enableRealTimeUpdates?: boolean;
  reconnectOnError?: boolean;
  pollInterval?: number;
}

export function useWialon(options: UseWialonOptions = {}) {
  const {
    autoConnect = true,
    enableRealTimeUpdates = true,
    reconnectOnError = true,
    pollInterval = 10000,
  } = options;

  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [units, setUnits] = useState<WialonUnit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);

  // Function to manually connect if autoConnect is false
  const connect = useCallback(async () => {
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
  }, []);

  // Function to reconnect Wialon
  const reconnect = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const success = await reconnectWialon();
      if (success) {
        setIsInitialized(true);
        const wialonUnits = getWialonUnits();
        setUnits(wialonUnits);
        console.log("Wialon reconnected successfully");
      } else {
        throw new Error("Failed to reconnect to Wialon");
      }

      return success;
    } catch (err) {
      console.error("Wialon reconnection error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize Wialon when the hook is first used
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      // Cleanup if needed
    };
  }, [autoConnect, connect]);

  // Update units periodically if real-time updates are enabled
  useEffect(() => {
    if (!isInitialized || !enableRealTimeUpdates) return;

    const interval = setInterval(async () => {
      try {
        const wialonUnits = getWialonUnits();

        // Check if units disappeared (potential connection issue)
        if (wialonUnits.length === 0 && units.length > 0) {
          console.warn("Wialon units disappeared, checking connection...");
          if (reconnectOnError) {
            await reconnect();
          }
        } else {
          setUnits(wialonUnits);
        }
      } catch (err) {
        console.error("Error updating Wialon units:", err);
        if (reconnectOnError) {
          await reconnect();
        }
      }
    }, pollInterval);

    return () => clearInterval(interval);
  }, [
    isInitialized,
    enableRealTimeUpdates,
    reconnectOnError,
    pollInterval,
    units.length,
    reconnect,
  ]);

  // Function to select a unit by ID
  const selectUnit = useCallback((unitId: number) => {
    setSelectedUnitId(unitId);
    return getUnitById(unitId);
  }, []);

  // Function to refresh the units list
  const refreshUnits = useCallback(() => {
    if (isInitialized) {
      const wialonUnits = getWialonUnits();
      setUnits(wialonUnits);
      return wialonUnits;
    }
    return [];
  }, [isInitialized]);

  // Helper functions using the new API
  const getUnit = useCallback((unitId: number): WialonUnit | null => {
    return getUnitById(unitId);
  }, []);

  const getUnitDetail = useCallback((unitId: number) => {
    return getUnitDetails(unitId);
  }, []);

  const getSensors = useCallback((unitId: number): WialonSensor[] => {
    return getUnitSensors(unitId);
  }, []);

  const getSensorVal = useCallback((unitId: number, sensorId: number): number | string | null => {
    return getSensorValue(unitId, sensorId);
  }, []);

  // Return the hook's API
  return {
    isInitialized,
    isLoading,
    error,
    units,
    selectedUnitId,
    selectedUnit: selectedUnitId ? getUnitById(selectedUnitId) : null,
    connect,
    reconnect,
    selectUnit,
    refreshUnits,
    getUnit,
    getUnitDetail,
    getSensors,
    getSensorVal,
  };
}

// Hook for listening to unit position updates
export function useWialonUnitListener(unitId: number | null) {
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  useEffect(() => {
    if (!unitId) return;

    const listenerId = registerUnitMessageListener(unitId, (data) => {
      setLastUpdate(Date.now());
      console.log(`Unit ${unitId} message:`, data);
    });

    return () => {
      if (listenerId !== null) {
        unregisterUnitMessageListener(unitId, listenerId);
      }
    };
  }, [unitId]);

  return { lastUpdate };
}

// Hook for real-time unit position tracking
export function useWialonUnitPosition(unitId: number | null, updateInterval = 5000) {
  const [position, setPosition] = useState<ReturnType<typeof getUnitDetails> | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  const updatePosition = useCallback(() => {
    if (!unitId) return;

    const details = getUnitDetails(unitId);
    setPosition(details);
    setLastUpdate(Date.now());
  }, [unitId]);

  // Initial position fetch
  useEffect(() => {
    updatePosition();
  }, [updatePosition]);

  // Periodic position updates
  useEffect(() => {
    if (!unitId || !updateInterval) return;

    const intervalId = setInterval(updatePosition, updateInterval);
    return () => clearInterval(intervalId);
  }, [unitId, updateInterval, updatePosition]);

  // Listen for position change events
  useWialonUnitListener(unitId);

  return { position, lastUpdate, refreshPosition: updatePosition };
}
