// TyreModel.ts - Domain model for Tyre Management

/**
 * This file serves as the central entry point for all tyre-related functionality.
 * It consolidates types, API functions, and utility methods from various sources
 * to provide a comprehensive interface for tyre management.
 */

// Firestore types
import { Timestamp } from 'firebase/firestore';
// Re-export Timestamp for convenience
export { Timestamp };
import { 
  Tyre, 
  TyreSize, 
  TyreType, 
  TyrePosition,
  TyreRotation,
  TyreRepair,
  TyreInspection,
  TyreStoreLocation,
  TyreStore,
  StockEntry
} from '../../../types/tyre';

// Re-export the types for convenience
export type {
  Tyre,
  TyreSize,
  TyreType,
  TyrePosition,
  TyreRotation,
  TyreRepair,
  TyreInspection,
  TyreStoreLocation,
  TyreStore,
  StockEntry
};

// Firebase interaction functions related to Tyres
import { 
  saveTyre,
  getTyreById,
  getTyres,
  deleteTyre,
  addTyreInspection,
  getTyreInspections,
  getTyresByVehicle,
  listenToTyres,
  addTyreStore,
  updateTyreStoreEntry,
  listenToTyreStores,
  getTyreStats
} from '../../../firebase';

// Re-export the functions
export {
  saveTyre,
  getTyreById,
  getTyres,
  deleteTyre,
  addTyreInspection,
  getTyreInspections,
  getTyresByVehicle,
  listenToTyres,
  addTyreStore,
  updateTyreStoreEntry,
  listenToTyreStores,
  getTyreStats
};

// Import additional utility functions from tyreAnalytics
import {
  TyreStat,
  RankedTyre,
  getBestTyres,
  getTyrePerformanceStats,
  filterTyresByPerformance,
  getTyreBrandPerformance
} from '../../../utils/tyreAnalytics';

// Re-export analytics types and functions
export type {
  TyreStat,
  RankedTyre
};

export {
  getBestTyres,
  getTyrePerformanceStats,
  filterTyresByPerformance,
  getTyreBrandPerformance
};

// Import utility functions from types/tyre.ts
import {
  formatTyreSize as _formatTyreSize,
  parseTyreSize as _parseTyreSize
} from '../../../types/tyre';

// Re-export utility functions from types
export const formatTyreSize = _formatTyreSize;
export const parseTyreSize = _parseTyreSize;

// Additional helper methods for the domain could be added here
export class TyreService {
  // Calculate tyre wear rate (mm/1000km)
  static calculateWearRate(tyre: Tyre): number | null {
    if (!tyre.installation || !tyre.condition || tyre.milesRun <= 0) {
      return null;
    }
    
    // Assuming new tyre tread depth is 8mm and we track current tread depth
    const newTyreDepth = 8; // mm
    const currentDepth = tyre.condition.treadDepth;
    const wornDepth = newTyreDepth - currentDepth;
    
    // Convert miles to km if needed
    const kmRun = tyre.milesRun * 1.60934;
    
    // Calculate wear per 1000 km
    return (wornDepth / kmRun) * 1000;
  }
  
  /**
   * Calculate cost per kilometer for a tyre
   * 
   * @param tyre Tyre object
   * @returns Cost per kilometer or 0 if no distance traveled
   */
  static calculateCostPerKm(tyre: Tyre): number {
    if (tyre.milesRun <= 0) return 0;
    return tyre.purchaseDetails.cost / tyre.milesRun;
  }
  
  /**
   * Calculate the remaining useful life of a tyre based on tread depth
   * 
   * @param tyre Tyre object
   * @returns Remaining kilometers
   */
  static calculateRemainingLife(tyre: Tyre): number {
    const currentTread = tyre.condition.treadDepth;
    const minimumTread = 3; // Legal minimum in mm
    const newTyreDepth = 20; // Typical new tyre tread depth in mm
    
    // Calculate wear rate (mm per km)
    const usedTread = newTyreDepth - currentTread;
    const wearRate = tyre.milesRun > 0 ? usedTread / tyre.milesRun : 0;
    
    // Calculate remaining life
    const remainingTread = currentTread - minimumTread;
    const remainingKm = wearRate > 0 ? remainingTread / wearRate : 0;
    
    return Math.max(remainingKm, 0);
  }
  
  /**
   * Estimate remaining life based on current wear rate with detailed breakdown
   * 
   * @param tyre Tyre object
   * @returns Object with kilometers and days remaining or null if cannot be calculated
   */
  static estimateRemainingLife(tyre: Tyre): { kilometers: number; days: number } | null {
    const wearRate = this.calculateWearRate(tyre);
    if (wearRate === null || wearRate <= 0) {
      return null;
    }
    
    const minSafeDepth = 1.6; // mm
    const currentDepth = tyre.condition.treadDepth;
    const usableDepthRemaining = currentDepth - minSafeDepth;
    
    if (usableDepthRemaining <= 0) {
      return { kilometers: 0, days: 0 };
    }
    
    // Calculate remaining kilometers
    const remainingKm = (usableDepthRemaining / wearRate) * 1000;
    
    // Estimate days based on average daily usage
    const avgDailyKm = 150; // Example value
    const remainingDays = remainingKm / avgDailyKm;
    
    return {
      kilometers: Math.round(remainingKm),
      days: Math.round(remainingDays)
    };
  }
  
  /**
   * Get tyres that need attention soon
   * 
   * @returns Promise with array of tyres needing attention
   */
  static async getTyresNeedingAttention(): Promise<Tyre[]> {
    try {
      // Get tyres with critical condition or low tread depth
      const tyres = await getTyres({
        condition: 'warning'
      });
      
      return tyres;
    } catch (error) {
      console.error('Error getting tyres needing attention:', error);
      throw error;
    }
  }
  
  /**
   * Calculate the total cost of ownership for a tyre
   * 
   * @param tyre Tyre object
   * @param includeRepairs Whether to include repair costs
   * @returns Total cost of ownership
   */
  static calculateTotalCostOfOwnership(tyre: Tyre, includeRepairs: boolean = true): number {
    let totalCost = tyre.purchaseDetails.cost;
    
    // Add repair costs if requested
    if (includeRepairs && tyre.maintenanceHistory && tyre.maintenanceHistory.repairs) {
      const repairCosts = tyre.maintenanceHistory.repairs.reduce(
        (sum, repair) => sum + repair.cost, 0
      );
      totalCost += repairCosts;
    }
    
    return totalCost;
  }
  
  /**
   * Calculate the average cost per km over the entire fleet
   * 
   * @param tyres Array of tyres
   * @returns The average cost per km
   */
  static calculateFleetAverageCostPerKm(tyres: Tyre[]): number {
    if (!tyres.length) return 0;
    
    let totalCost = 0;
    let totalDistance = 0;
    
    tyres.forEach(tyre => {
      totalCost += this.calculateTotalCostOfOwnership(tyre);
      totalDistance += tyre.milesRun;
    });
    
    return totalDistance > 0 ? totalCost / totalDistance : 0;
  }
  
  /**
   * Convert tyre data to the TyreStat format used by analytics functions
   * 
   * @param tyres Array of tyres
   * @returns Array of TyreStat objects
   */
  static convertToTyreStats(tyres: Tyre[]): TyreStat[] {
    return tyres.map(tyre => ({
      brand: tyre.brand,
      model: tyre.model,
      totalDistance: tyre.milesRun,
      totalCost: this.calculateTotalCostOfOwnership(tyre)
    }));
  }
  
  /**
   * Get comprehensive performance analysis for tyres
   * 
   * @param tyres Array of tyres
   * @returns Performance analysis report
   */
  static getTyrePerformanceAnalysis(tyres: Tyre[]) {
    const tyreStats = this.convertToTyreStats(tyres);
    const performanceStats = getTyrePerformanceStats(tyreStats);
    const brandPerformance = getTyreBrandPerformance(tyreStats);
    
    return {
      performanceStats,
      brandPerformance,
      excellentPerformers: filterTyresByPerformance(tyreStats, 'excellent'),
      poorPerformers: filterTyresByPerformance(tyreStats, 'poor')
    };
  }
}
