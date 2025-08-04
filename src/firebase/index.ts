// Re-export core firebase services
export { firebaseApp, firestore, storage } from "./core";

// Re-export from existing modules
export { listenToTyres } from "./tyres";
export {
  addTyreStore,
  deleteTyreStore,
  getAllTyreStores,
  getTyreStoreById,
  getTyreStoreEntriesByTyreId,
  getTyreStoreStats,
  listenToTyreStores,
  moveTyreStoreEntry,
  removeTyreStoreEntry,
  updateTyreStore,
  updateTyreStoreEntry,
} from "./tyreStores";

// Re-export from new service modules
export {
  addTripToFirebase,
  deleteTripFromFirebase,
  listenToDriverBehaviorEvents,
  updateTripInFirebase,
} from "./services/trips";

export {
  addDieselToFirebase,
  deleteDieselFromFirebase,
  updateDieselInFirebase,
} from "./services/diesel";

export {
  addAuditLogToFirebase,
  addMissedLoadToFirebase,
  deleteMissedLoadFromFirebase,
  updateMissedLoadInFirebase,
} from "./services/audit";

// Export with aliases for compatibility
export { default as default } from "../firebaseConfig";
export { firestore as db } from "./core";
