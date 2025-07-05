
import { Vehicle } from "@/types/vehicle";
import { FLEET_VEHICLES } from "./fleetVehicles";

// Utility functions for vehicle lookup and filtering
export const getVehicleByFleetNo = (fleetNo: string): Vehicle | undefined => {
  return FLEET_VEHICLES.find(v => v.fleetNo === fleetNo);
};

export const getVehicleByRegistration = (registrationNo: string): Vehicle | undefined => {
  return FLEET_VEHICLES.find(v => v.registrationNo === registrationNo);
};

export const getActiveVehicles = (): Vehicle[] => {
  return FLEET_VEHICLES.filter(v => v.status === 'active');
};

export const getVehiclesByType = (type: Vehicle['type']): Vehicle[] => {
  return FLEET_VEHICLES.filter(v => v.type === type);
};

export const getVehiclesByCategory = (category: Vehicle['category']): Vehicle[] => {
  return FLEET_VEHICLES.filter(v => v.category === category);
};

export const getVehiclesBySeries = (series: Vehicle['series']): Vehicle[] => {
  return FLEET_VEHICLES.filter(v => v.series === series);
};

export const getVehiclesByManufacturer = (manufacturer: string): Vehicle[] => {
  return FLEET_VEHICLES.filter(v => v.manufacturer.toLowerCase().includes(manufacturer.toLowerCase()));
};

export const getVehiclesByStatus = (status: Vehicle['status']): Vehicle[] => {
  return FLEET_VEHICLES.filter(v => v.status === status);
};

// Search and filter functions
export const searchVehicles = (query: string): Vehicle[] => {
  const lowerQuery = query.toLowerCase();
  return FLEET_VEHICLES.filter(v => 
    v.fleetNo.toLowerCase().includes(lowerQuery) ||
    v.registrationNo.toLowerCase().includes(lowerQuery) ||
    v.manufacturer.toLowerCase().includes(lowerQuery) ||
    v.model.toLowerCase().includes(lowerQuery)
  );
};

export const filterVehicles = (filters: {
  status?: Vehicle['status'][];
  type?: Vehicle['type'][];
  series?: Vehicle['series'][];
  manufacturer?: string[];
}): Vehicle[] => {
  return FLEET_VEHICLES.filter(vehicle => {
    if (filters.status && filters.status.length > 0 && !filters.status.includes(vehicle.status)) {
      return false;
    }
    if (filters.type && filters.type.length > 0 && !filters.type.includes(vehicle.type)) {
      return false;
    }
    if (filters.series && filters.series.length > 0 && !filters.series.includes(vehicle.series)) {
      return false;
    }
    if (filters.manufacturer && filters.manufacturer.length > 0 && 
        !filters.manufacturer.some(m => vehicle.manufacturer.toLowerCase().includes(m.toLowerCase()))) {
      return false;
    }
    return true;
  });
};
