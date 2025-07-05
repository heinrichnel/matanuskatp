// Utility functions for vehicle data
export function getActiveVehicles() {
  return [{ id: "1", status: "active" }];
}

export function getVehiclesByStatus(status: string) {
  return [{ id: "2", status }];
}

export function getVehiclesByType(type: string) {
  return [{ id: "3", type }];
}

export function getVehiclesBySeries(series: string) {
  return [{ id: "4", series }];
}

export function getVehiclesByManufacturer(manufacturer: string) {
  return [{ id: "5", manufacturer }];
}
