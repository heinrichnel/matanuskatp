// src/utils/mapWialonUnitToGeoJSON.ts
import { WialonUnit, GeoJsonFeature } from '../types/wialon'; // Your WialonUnit and GeoJSON types
import { formatDate } from './helpers'; // Assuming formatDate exists

/**
 * Converts a WialonUnit object into a GeoJSON Feature.
 * @param unit The WialonUnit object.
 * @returns A GeoJSON Feature representing the unit's last known position and properties.
 */
export function mapWialonUnitToGeoJSON(unit: WialonUnit): GeoJsonFeature | null {
  if (!unit.lastPosition) {
    // A unit without a last position cannot be represented as a GeoJSON Point
    return null;
  }

  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [unit.lastPosition.longitude, unit.lastPosition.latitude] // GeoJSON is [longitude, latitude]
    },
    properties: {
      // --- General Unit Details ---
      id: unit.id,
      name: unit.name,
      uid: unit.uid,
      phone: unit.phone || 'N/A',
      hardwareType: unit.hardwareType || 'N/A',
      iconUrl: unit.iconUrl ? `https://www.gstatic.com/recaptcha/api2/${unit.iconUrl}` : undefined, // Adjust base URL for Wialon icons

      // --- Profile (Custom Fields) ---
      registrationPlate: unit.profile?.registration_plate || 'N/A',
      brand: unit.profile?.brand || 'N/A',
      model: unit.profile?.model || 'N/A',
      year: unit.profile?.year || 'N/A',
      vehicleClass: unit.profile?.vehicle_class || 'N/A',
      engineModel: unit.profile?.engine_model || 'N/A',
      primaryFuelType: unit.profile?.primary_fuel_type || 'N/A',
      cargoType: unit.profile?.cargo_type || 'N/A',
      carryingCapacity: unit.profile?.carrying_capacity || 'N/A',
      axles: unit.profile?.axles || 'N/A',
      effectiveCapacity: unit.profile?.effective_capacity || 'N/A',

      // --- Last Known Position Data ---
      speed: unit.lastPosition.s,
      timestamp: unit.lastPosition.t,
      lastUpdateFormatted: formatDate(new Date(unit.lastPosition.t * 1000).toISOString()),
      course: unit.lastPosition.c,
      satellites: unit.lastPosition.sc,

      // --- Derived Status (Example) ---
      status: unit.lastPosition.s > 0 ? 'Moving' : 'Stopped',
      // You can add more derived properties here based on sensor data, etc.
    }
  };
}
