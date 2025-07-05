
// Main export file to maintain backward compatibility
export type { Vehicle, FleetStats, VehicleFilters } from "@/types/vehicle";
export { FLEET_VEHICLES } from "./fleetVehicles";
export {
  getVehicleByFleetNo,
  getVehicleByRegistration,
  getActiveVehicles,
  getVehiclesByType,
  getVehiclesByCategory,
  getVehiclesBySeries,
  getVehiclesByManufacturer,
  getVehiclesByStatus,
  searchVehicles,
  filterVehicles
} from "./vehicleUtils";
export { getFleetStats } from "./vehicleStats";
