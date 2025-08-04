/**
 * Firebase Services - Main Export File
 * This file provides a unified entry point for all Firebase services
 * For better code splitting, consider importing directly from the specific service modules
 */

// Basic exports for backward compatibility
export { db, firebaseApp, firestore, storage } from "./firebase/core";
export { default } from "./firebaseConfig";

// Dynamic imports for specific services
export const loadTyreServices = () => import("./firebase/tyreStores");
export const loadTyreDataServices = () => import("./firebase/tyres");
export const loadTripServices = () => import("./firebase/services/trips");
export const loadDieselServices = () => import("./firebase/services/diesel");
export const loadAuditServices = () => import("./firebase/services/audit");

// For complete backward compatibility (not recommended for performance)
// Use dynamic import instead of static import for better code splitting
// export * from './firebase/index';
