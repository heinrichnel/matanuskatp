/**
 * This utility provides functions to integrate trip data with fleet analytics
 */

import { api } from "../api/fleetAnalyticsApi";

/**
 * Calculates fuel efficiency metrics based on trip data and vehicle information
 * @param tripData Array of trip records
 * @returns Calculated metrics for fleet analytics
 */
export const calculateTripEfficiencyMetrics = async (tripData: any[]) => {
  // Get the fleet analytics data
  const fleetAnalytics = await api.fetchFleetAnalyticsData();

  // Calculate average fuel consumption per trip
  const fuelConsumptions = tripData.map((trip) => trip.fuelUsed || 0);
  const avgFuelConsumption =
    fuelConsumptions.length > 0
      ? fuelConsumptions.reduce((a, b) => a + b, 0) / fuelConsumptions.length
      : 0;

  // Calculate total distance traveled
  const totalDistance = tripData.reduce((sum, trip) => sum + (trip.distance || 0), 0);

  // Calculate fuel efficiency (distance per unit of fuel)
  const fuelEfficiency = avgFuelConsumption > 0 ? totalDistance / avgFuelConsumption : 0;

  // Combine with fleet analytics data
  return {
    tripCount: tripData.length,
    totalDistance,
    avgFuelConsumption,
    fuelEfficiency,
    // Combine with fleet analytics - handle as array
    fleetAnalytics: fleetAnalytics,
    // Extract the latest analytics if available
    latestAnalytics: fleetAnalytics.length > 0 ? fleetAnalytics[fleetAnalytics.length - 1] : null,
  };
};

/**
 * Correlates vehicle maintenance issues with trip performance
 * @param maintenanceRecords Maintenance records from the system
 * @param tripData Trip data records
 * @returns Correlation analysis between maintenance and performance
 */
export const correlateMaintenanceWithPerformance = async (
  maintenanceRecords: any[],
  tripData: any[]
) => {
  // Group trips by vehicle
  const tripsByVehicle: Record<string, any[]> = {};

  tripData.forEach((trip) => {
    if (!trip.vehicleId) return;

    if (!tripsByVehicle[trip.vehicleId]) {
      tripsByVehicle[trip.vehicleId] = [];
    }

    tripsByVehicle[trip.vehicleId].push(trip);
  });

  // Analyze performance before and after maintenance
  const results: Record<string, any> = {};

  Object.entries(tripsByVehicle).forEach(([vehicleId, trips]) => {
    // Find maintenance records for this vehicle
    const vehicleMaintenance = maintenanceRecords.filter(
      (record) => record.vehicleId === vehicleId
    );

    if (vehicleMaintenance.length === 0) return;

    // Sort trips and maintenance by date
    trips.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    vehicleMaintenance.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // For each maintenance event, compare performance before and after
    vehicleMaintenance.forEach((maintenance) => {
      const maintenanceDate = new Date(maintenance.date);

      const tripsBefore = trips.filter(
        (trip) => new Date(trip.date).getTime() < maintenanceDate.getTime()
      );

      const tripsAfter = trips.filter(
        (trip) => new Date(trip.date).getTime() >= maintenanceDate.getTime()
      );

      // Calculate average fuel efficiency before and after
      const efficiencyBefore = calculateAvgEfficiency(tripsBefore);
      const efficiencyAfter = calculateAvgEfficiency(tripsAfter);

      // Store results
      if (!results[vehicleId]) {
        results[vehicleId] = {
          maintenanceEvents: [],
          averageImprovement: 0,
        };
      }

      results[vehicleId].maintenanceEvents.push({
        maintenanceType: maintenance.type,
        date: maintenance.date,
        efficiencyBefore,
        efficiencyAfter,
        improvement: efficiencyAfter - efficiencyBefore,
      });
    });

    // Calculate average improvement across all maintenance events
    if (results[vehicleId]?.maintenanceEvents.length > 0) {
      const totalImprovement = results[vehicleId].maintenanceEvents.reduce(
        (sum: number, event: any) => sum + event.improvement,
        0
      );

      results[vehicleId].averageImprovement =
        totalImprovement / results[vehicleId].maintenanceEvents.length;
    }
  });

  return results;
};

// Helper function to calculate average fuel efficiency
const calculateAvgEfficiency = (trips: any[]) => {
  if (trips.length === 0) return 0;

  const totalDistance = trips.reduce((sum, trip) => sum + (trip.distance || 0), 0);
  const totalFuel = trips.reduce((sum, trip) => sum + (trip.fuelUsed || 0), 0);

  return totalFuel > 0 ? totalDistance / totalFuel : 0;
};
