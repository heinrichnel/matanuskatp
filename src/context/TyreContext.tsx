import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  addTyreInspection,
  deleteTyre,
  getTyreById,
  getTyreInspections,
  getTyres,
  getTyresByVehicle,
  listenToTyres,
  saveTyre,
} from "../firebase";
import { Tyre, TyreInspection } from "../types/tyre";
import { TyreInspectionRecord } from "../types/tyre-inspection";

// Import types from data/tyreData for Firebase compatibility
import {
  TyreMountStatus,
  TyreStatus,
  TyreStoreLocation as TyreStoreLocationData,
} from "../data/tyreData";

// Import type adapters for converting between different tyre types
import {
  convertInspectionRecordsToInspections,
  convertTyreDataArrayToTyreArray,
  convertTyreDataToTyre,
  convertTyreToTyreData,
} from "../utils/tyreTypeAdapter";

// Define the context interface
interface TyreContextType {
  tyres: Tyre[];
  loading: boolean;
  error: Error | null;
  saveTyre: (tyre: Tyre) => Promise<string>;
  getTyreById: (id: string) => Promise<Tyre | null>;
  deleteTyre: (id: string) => Promise<void>;
  addInspection: (tyreId: string, inspection: TyreInspectionRecord) => Promise<string>;
  getInspections: (tyreId: string) => Promise<TyreInspection[]>;
  getTyresByVehicle: (vehicleId: string) => Promise<Tyre[]>;
  filterTyres: (filters: {
    status?: string;
    mountStatus?: string;
    brand?: string;
    location?: string;
    vehicleId?: string;
  }) => Promise<Tyre[]>;
}

// Create the context with a default value
const TyreContext = createContext<TyreContextType | undefined>(undefined);

// Provider component
export const TyreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Set up real-time listener for tyres collection
  useEffect(() => {
    setLoading(true);

    const unsubscribe = listenToTyres((updatedTyres: Tyre[]) => {
      setTyres(updatedTyres);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Wrapper for saveTyre function
  const handleSaveTyre = async (tyre: Tyre): Promise<string> => {
    try {
      // Convert from app Tyre type to Firebase TyreData type
      const tyreDataToSave = convertTyreToTyreData(tyre);
      return await saveTyre(tyreDataToSave);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error saving tyre"));
      throw err;
    }
  };

  // Wrapper for getTyreById function
  const handleGetTyreById = async (id: string): Promise<Tyre | null> => {
    try {
      const tyreData = await getTyreById(id);
      // Convert from Firebase TyreData type to app Tyre type
      return tyreData ? convertTyreDataToTyre(tyreData) : null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error getting tyre"));
      throw err;
    }
  };

  // Wrapper for deleteTyre function
  const handleDeleteTyre = async (id: string): Promise<void> => {
    try {
      await deleteTyre(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error deleting tyre"));
      throw err;
    }
  };

  // Wrapper for addTyreInspection function
  const handleAddInspection = async (
    tyreId: string,
    inspection: TyreInspectionRecord
  ): Promise<string> => {
    try {
      // TyreInspectionRecord can be used directly with Firebase
      return await addTyreInspection(tyreId, inspection);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error adding inspection"));
      throw err;
    }
  };

  // Wrapper for getTyreInspections function
  const handleGetInspections = async (tyreId: string): Promise<TyreInspection[]> => {
    try {
      const inspectionRecords = await getTyreInspections(tyreId);
      // Convert from Firebase TyreInspectionRecord type to app TyreInspection type
      return convertInspectionRecordsToInspections(inspectionRecords);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error getting inspections"));
      throw err;
    }
  };

  // Wrapper for getTyresByVehicle function
  const handleGetTyresByVehicle = async (vehicleId: string): Promise<Tyre[]> => {
    try {
      const tyreDataArray = await getTyresByVehicle(vehicleId);
      // Convert from Firebase TyreData array to app Tyre array
      return convertTyreDataArrayToTyreArray(tyreDataArray);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error getting vehicle tyres"));
      throw err;
    }
  };

  // Function to filter tyres based on criteria
  const handleFilterTyres = async (filters: {
    status?: string;
    mountStatus?: string;
    brand?: string;
    location?: string;
    vehicleId?: string;
  }): Promise<Tyre[]> => {
    try {
      // Convert string filters to TyreData enum types
      const tyreDataFilters: any = { ...filters };
      if (filters.status) tyreDataFilters.status = filters.status as TyreStatus;
      if (filters.mountStatus) tyreDataFilters.mountStatus = filters.mountStatus as TyreMountStatus;
      if (filters.location) tyreDataFilters.location = filters.location as TyreStoreLocationData;

      const tyreDataArray = await getTyres(tyreDataFilters);
      // Convert from Firebase TyreData array to app Tyre array
      return convertTyreDataArrayToTyreArray(tyreDataArray);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error filtering tyres"));
      throw err;
    }
  };

  // Context value
  const value = {
    tyres,
    loading,
    error,
    saveTyre: handleSaveTyre,
    getTyreById: handleGetTyreById,
    deleteTyre: handleDeleteTyre,
    addInspection: handleAddInspection,
    getInspections: handleGetInspections,
    getTyresByVehicle: handleGetTyresByVehicle,
    filterTyres: handleFilterTyres,
  };

  return <TyreContext.Provider value={value}>{children}</TyreContext.Provider>;
};

// Custom hook to use the context
export function useTyres(): TyreContextType {
  const context = useContext(TyreContext);
  if (!context) {
    throw new Error("useTyres must be used within a TyreProvider");
  }
  return context;
}
