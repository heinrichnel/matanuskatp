
import { FleetStats } from "@/types/vehicle";
import { 
  getActiveVehicles, 
  getVehiclesByStatus, 
  getVehiclesByType, 
  getVehiclesBySeries, 
  getVehiclesByManufacturer 
} from "./vehicleUtils";
import { FLEET_VEHICLES } from "./fleetVehicles";

// Fleet statistics and analytics
export const getFleetStats = (): FleetStats => {
  const total = FLEET_VEHICLES.length;
  const active = getActiveVehicles().length;
  const maintenance = getVehiclesByStatus('maintenance').length;
  const outOfService = getVehiclesByStatus('out_of_service').length;
  
  const byType = {
    heavy_truck: getVehiclesByType('heavy_truck').length,
    light_vehicle: getVehiclesByType('light_vehicle').length,
    trailer: getVehiclesByType('trailer').length,
    reefer: getVehiclesByType('reefer').length,
    generator: getVehiclesByType('generator').length
  };
  
  const bySeries = {
    H: getVehiclesBySeries('H').length,
    L: getVehiclesBySeries('L').length,
    T: getVehiclesBySeries('T').length,
    F: getVehiclesBySeries('F').length,
    OTHER: getVehiclesBySeries('OTHER').length
  };
  
  const byManufacturer = {
    SCANIA: getVehiclesByManufacturer('SCANIA').length,
    SHACMAN: getVehiclesByManufacturer('SHACMAN').length,
    ISUZU: getVehiclesByManufacturer('ISUZU').length,
    SINOTRUK: getVehiclesByManufacturer('SINOTRUK').length,
    SERCO: getVehiclesByManufacturer('SERCO').length,
    OTHER: FLEET_VEHICLES.filter(v => 
      !['SCANIA', 'SHACMAN', 'ISUZU', 'SINOTRUK', 'SERCO'].includes(v.manufacturer.toUpperCase())
    ).length
  };
  
  return {
    total,
    active,
    maintenance,
    outOfService,
    byType,
    bySeries,
    byManufacturer
  };
};
