import {
  initializeFirestore,
  persistentLocalCache,
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  getDocs,
  orderBy,
  serverTimestamp,
  enableNetwork,
  disableNetwork,
  writeBatch,
  where,
  Timestamp,
  Firestore
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { getAnalytics } from 'firebase/analytics';
import { Trip, DieselConsumptionRecord, MissedLoad, DriverBehaviorEvent, ActionItem, CARReport, CostEntry } from './types';
import { AuditLog } from './types/audit';
import { firebaseConfig, firebaseApp } from './firebaseConfig';
import { connectToEmulators } from './firebaseEmulators';

// Connect to emulators in development mode BEFORE initializing Firestore
if (import.meta.env.DEV) {
  console.log("🧪 Checking for Firebase emulators...");
  connectToEmulators();
  console.log("⚠️ Firebase emulators connected. ALL OPERATIONS WILL USE EMULATED SERVICES!");
  console.log("⚠️ Make sure the emulators are running with: firebase emulators:start");
}

// Initialize Firestore with persistent local cache (modern approach)
// DEBUG ONLY - Add diagnostic logs to track Firestore initialization issues
console.log("🔍 DEBUG: About to initialize Firestore");
const db: Firestore = initializeFirestore(firebaseApp, {
  localCache: persistentLocalCache({
    cacheSizeBytes: 104857600 // 100 MB
  })
});
console.log("✅ Firestore initialized with persistent cache");

// Export the db instance after initialization
export { db };

// Initialize Analytics (only in production)
let analytics: ReturnType<typeof getAnalytics> | undefined;
if (typeof window !== 'undefined' &&
  window.location.hostname !== 'localhost' &&
  firebaseConfig.projectId &&
  firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(firebaseApp);
    console.log('✅ Firebase Analytics initialized');
  } catch (error) {
    console.warn('⚠️ Firebase Analytics initialization failed:', error);
  }
}
export { analytics };

// Enable/disable Firestore network for real-time sync
export const enableFirestoreNetwork = () => enableNetwork(db);
export const disableFirestoreNetwork = () => disableNetwork(db);

/**
 * Helper function to convert Firestore Timestamps to ISO strings recursively
 * @param obj Any object or value that might contain Firestore Timestamp
 * @returns The object with all Timestamp instances converted to ISO strings
 */
export const convertTimestamps = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (obj instanceof Timestamp) {
    return obj.toDate().toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertTimestamps);
  }

  if (typeof obj === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertTimestamps(value);
    }
    return converted;
  }

  return obj;
};

export const monitorConnectionStatus = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  const handleOnline = () => {
    console.log("🟢 Firebase connection restored");
    enableFirestoreNetwork();
    onOnline();
  };

  const handleOffline = () => {
    console.log("🔴 Firebase connection lost - working offline");
    disableFirestoreNetwork();
    onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

// Collection references
export const tripsCollection = collection(db, 'trips');
export const dieselCollection = collection(db, 'diesel');
export const missedLoadsCollection = collection(db, 'missedLoads');
export const systemConfigCollection = collection(db, 'systemConfig');
export const activityLogsCollection = collection(db, 'activityLogs');
export const driverBehaviorCollection = collection(db, 'driverBehavior');
export const actionItemsCollection = collection(db, 'actionItems');
export const carReportsCollection = collection(db, 'carReports');
export const auditLogsCollection = collection(db, 'auditLogs');

// Helper function to remove undefined values from objects
const cleanUndefinedValues = (obj: any): any => {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanUndefinedValues);
  }

  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanUndefinedValues(value);
      }
    }
    return cleaned;
  }

  return obj;
};

// Trip Services with Real-time Sync
export const addTripToFirebase = async (tripData: Trip): Promise<string> => {
  try {
    // Add server timestamp for creation and clean undefined values
    const tripWithTimestamp = cleanUndefinedValues({
      ...tripData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      version: 1
    });

    // Use client-generated id for document so delete/update by id works
    const tripRef = doc(db, 'trips', tripData.id);
    await setDoc(tripRef, tripWithTimestamp as any);
    console.log("✅ Trip added with real-time sync ID:", tripData.id);

    // Log activity
    await logActivity('trip_created', tripData.id, 'trip', tripData);

    return tripData.id;
  } catch (error) {
    console.error("❌ Error adding trip:", error);
    throw error;
  }
};

export const updateTripInFirebase = async (id: string, tripData: Partial<Trip>): Promise<void> => {
  try {
    const tripRef = doc(db, 'trips', id);

    // Add update timestamp and increment version, clean undefined values
    const updateData = cleanUndefinedValues({
      ...tripData,
      updatedAt: serverTimestamp(),
      // Increment version if present, otherwise set to 1
      version: typeof (tripData as any).version === 'number' ? (tripData as any).version + 1 : 1
    });

    await updateDoc(tripRef, updateData);
    console.log("✅ Trip updated with real-time sync:", id);

    // Log activity
    await logActivity('trip_updated', id, 'trip', updateData);

  } catch (error) {
    console.error("❌ Error updating trip:", error);
    throw error;
  }
};

export const deleteTripFromFirebase = async (id: string): Promise<void> => {
  try {
    const tripRef = doc(db, 'trips', id);

    // Fetch the trip data before deletion
    const tripSnap = await getDoc(tripRef);
    if (!tripSnap.exists()) {
      console.warn(`Trip with ID ${id} not found, nothing to delete`);
      return;
    }

    const tripData = tripSnap.data();
    console.log(`🗑️ Deleting trip: ${id}`, tripData ? {
      fleetNumber: tripData.fleetNumber,
      route: tripData.route
    } : 'No data');

    console.log(`🔄 Preparing batch deletion for trip: ${id}`);

    // Create a batch for atomic operations
    const batch = writeBatch(db);

    // Delete the trip document
    batch.delete(tripRef);
    console.log(`Added delete operation for trip: ${id}`);

    // Check for and update any diesel records that reference this trip
    console.log(`Looking for diesel records referencing trip: ${id}`);
    const dieselCollection = collection(db, 'diesel');
    const dieselQuery = query(dieselCollection, where('tripId', '==', id));
    const dieselSnapshot = await getDocs(dieselQuery);

    // Update diesel records to remove the trip reference
    let relatedDieselCount = 0;
    if (!dieselSnapshot.empty) {
      dieselSnapshot.forEach(dieselDoc => {
        relatedDieselCount++;
        console.log(`Removing trip reference from diesel record: ${dieselDoc.id}`);
        batch.update(dieselDoc.ref, {
          tripId: null,
          updatedAt: serverTimestamp()
        });
      });
    }
    console.log(`Found and updated ${relatedDieselCount} related diesel records`);

    // Create audit log entry for the deletion
    const auditLogData = {
      id: uuidv4(),
      timestamp: serverTimestamp(),
      user: 'system', // Replace with actual user in production
      action: 'delete',
      entity: 'trip',
      entityId: id,
      details: `Trip ${id} deleted with ${relatedDieselCount} related diesel records updated`,
      changes: convertTimestamps(tripData || {})
    };

    // Add audit log creation to batch
    const auditLogRef = doc(collection(db, 'auditLogs'));
    batch.set(auditLogRef, auditLogData);
    console.log(`Added audit log creation to batch: ${auditLogRef.id}`);

    // Commit all operations atomically
    try {
      console.log(`🔥 Committing batch deletion for trip: ${id}`);
      await batch.commit();
      console.log(`✅ Successfully deleted trip ${id} and updated ${relatedDieselCount} related diesel records`);

      return;
    } catch (batchError) {
      console.error(`❌ Batch deletion failed for trip ${id}:`, batchError);
      throw batchError;
    }
  } catch (error) {
    console.error("❌ Error deleting trip:", error);
    throw error;
  }
};

// Real-time listeners with enhanced error handling
export const listenToTrips = (
  callback: (trips: Trip[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const q = query(tripsCollection, orderBy('startDate', 'desc'));

  return onSnapshot(
    q,
    snapshot => {
      const trips: Trip[] = [];

      // Process document changes (added, modified, removed)
      snapshot.docChanges().forEach(change => {
        console.log(`Trip document ${change.doc.id} ${change.type}`);
      });

      // Add all current documents to the array
      snapshot.forEach(doc => {
        const data = convertTimestamps(doc.data());
        trips.push({
          id: doc.id,
          ...data
        } as Trip);
      });

      console.log(`🔄 Real-time trips update: ${trips.length} trips loaded`);
      callback(trips);
    },
    error => {
      console.error("❌ Real-time trips listener error:", error);
      if (onError) onError(error);
    }
  );
};

// Diesel Records Services with Real-time Sync
export const addDieselToFirebase = async (dieselData: DieselConsumptionRecord): Promise<string> => {
  try {
    // Create a batch for atomic operations
    const batch = writeBatch(db);

    const dieselWithTimestamp = cleanUndefinedValues({
      ...dieselData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Generate a new doc ref
    const dieselRef = doc(dieselCollection);
    batch.set(dieselRef, dieselWithTimestamp);

    // If linked to a trip, create a cost entry
    if (dieselData.tripId) {
      const tripRef = doc(db, 'trips', dieselData.tripId);
      const tripSnap = await getDoc(tripRef);

      if (tripSnap.exists()) {
        const trip = tripSnap.data() as Trip;

        const costEntry: CostEntry = {
          id: `cost-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          tripId: trip.id,
          category: 'Diesel',
          subCategory: `${dieselData.fuelStation} - ${dieselData.fleetNumber}${dieselData.isReeferUnit ? ' (Reefer)' : ''}`,
          amount: dieselData.totalCost,
          currency: dieselData.currency || trip.revenueCurrency,
          referenceNumber: `DIESEL-${dieselData.isReeferUnit ? 'REEFER-' : ''}${dieselRef.id}`,
          date: dieselData.date,
          notes: `Diesel: ${dieselData.litresFilled} liters at ${dieselData.fuelStation}${dieselData.isReeferUnit ? ' (Reefer)' : ''}`,
          attachments: [],
          isFlagged: false
        };

        // Add cost entry to trip
        const updatedCosts = [...(trip.costs || []), costEntry];
        batch.update(tripRef, { costs: updatedCosts, updatedAt: serverTimestamp() });

        console.log(`✅ Cost entry added to trip ${trip.id} for diesel record ${dieselRef.id}`);
      }
    }

    // Commit all operations atomically
    await batch.commit();
    console.log("✅ Diesel record added with real-time sync:", dieselRef.id);

    // Log activity after successful commit
    await logActivity('diesel_created', dieselRef.id, 'diesel', dieselData);

    return dieselRef.id;
  } catch (error) {
    console.error("❌ Error adding diesel record:", error);
    throw error;
  }
};

export const updateDieselInFirebase = async (id: string, dieselData: Partial<DieselConsumptionRecord>): Promise<void> => {
  try {
    // Create a batch for atomic operations
    const batch = writeBatch(db);

    const dieselRef = doc(db, 'diesel', id);

    // Get the current diesel record to check if trip linkage changed
    const dieselSnap = await getDoc(dieselRef);
    if (!dieselSnap.exists()) {
      throw new Error(`Diesel record ${id} not found`);
    }

    const currentDiesel = dieselSnap.data() as DieselConsumptionRecord;

    const updateData = cleanUndefinedValues({
      ...dieselData,
      updatedAt: serverTimestamp()
    });

    // Add diesel update to batch
    batch.update(dieselRef, updateData);
    console.log("✅ Diesel record updated with real-time sync:", id);

    // Handle trip cost entry updates if needed
    if (dieselData.tripId || currentDiesel.tripId) {
      // Case 1: Update existing trip cost entry if tripId is unchanged
      if (dieselData.tripId === currentDiesel.tripId && currentDiesel.tripId) {
        const tripRef = doc(db, 'trips', currentDiesel.tripId);
        const tripSnap = await getDoc(tripRef);

        if (tripSnap.exists()) {
          const trip = tripSnap.data() as Trip;

          // Find the cost entry for this diesel record
          const costIndex = trip.costs.findIndex(c =>
            c.referenceNumber === `DIESEL-${id}` ||
            c.referenceNumber === `DIESEL-REEFER-${id}`
          );

          if (costIndex !== -1) {
            // Update cost entry with new values
            const updatedCosts = [...trip.costs];
            updatedCosts[costIndex] = {
              ...updatedCosts[costIndex],
              amount: dieselData.totalCost || currentDiesel.totalCost,
              currency: dieselData.currency || currentDiesel.currency || trip.revenueCurrency,
              notes: `Diesel: ${dieselData.litresFilled || currentDiesel.litresFilled} liters at ${dieselData.fuelStation || currentDiesel.fuelStation
                }${(dieselData.isReeferUnit !== undefined ? dieselData.isReeferUnit : currentDiesel.isReeferUnit) ? ' (Reefer)' : ''}`
            };

            batch.update(tripRef, {
              costs: updatedCosts,
              updatedAt: serverTimestamp()
            });

            console.log(`✅ Updated cost entry in trip ${currentDiesel.tripId} for diesel record ${id}`);
          }
        }
      }

      // Case 2: Trip linkage changed - this needs to be handled by allocateDieselToTrip or removeDieselFromTrip
      // We don't handle this case here to avoid complexity
    }

    // Commit all changes atomically
    await batch.commit();

    // Log after successful commit
    await logActivity('diesel_updated', id, 'diesel', updateData);
  } catch (error) {
    console.error("❌ Error updating diesel record:", error);
    throw error;
  }
};

export const deleteDieselFromFirebase = async (id: string): Promise<void> => {
  try {
    // Create a batch for atomic operations
    const batch = writeBatch(db);

    const dieselRef = doc(db, 'diesel', id);

    // Get the diesel record to check for trip linkage
    const dieselSnap = await getDoc(dieselRef);
    if (!dieselSnap.exists()) {
      throw new Error(`Diesel record ${id} not found`);
    }

    const dieselData = dieselSnap.data() as DieselConsumptionRecord;

    // If linked to a trip, remove the cost entry
    if (dieselData.tripId) {
      const tripRef = doc(db, 'trips', dieselData.tripId);
      const tripSnap = await getDoc(tripRef);

      if (tripSnap.exists()) {
        const trip = tripSnap.data() as Trip;

        // Remove the cost entry for this diesel record
        const updatedCosts = trip.costs.filter(c =>
          c.referenceNumber !== `DIESEL-${id}` &&
          c.referenceNumber !== `DIESEL-REEFER-${id}`
        );

        // Only update if costs array changed
        if (updatedCosts.length !== trip.costs.length) {
          batch.update(tripRef, {
            costs: updatedCosts,
            updatedAt: serverTimestamp()
          });

          console.log(`✅ Removed cost entry from trip ${dieselData.tripId} for diesel record ${id}`);
        }
      }
    }

    // Add diesel deletion to batch
    batch.delete(dieselRef);

    // Commit all changes atomically
    await batch.commit();
    console.log("✅ Diesel record deleted with real-time sync:", id);

    await logActivity('diesel_deleted', id, 'diesel', { deletedAt: new Date().toISOString() });
  } catch (error) {
    console.error("❌ Error deleting diesel record:", error);
    throw error;
  }
};

export const listenToDieselRecords = (
  callback: (records: DieselConsumptionRecord[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const q = query(dieselCollection, orderBy('date', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const records: DieselConsumptionRecord[] = [];

      // Process document changes
      snapshot.docChanges().forEach(change => {
        console.log(`Diesel record ${change.doc.id} ${change.type}`);
      });

      // Add all current documents to the array
      snapshot.forEach(doc => {
        const data = convertTimestamps(doc.data());
        records.push({
          id: doc.id,
          ...data
        } as DieselConsumptionRecord);
      });

      console.log(`🔄 Real-time diesel records update: ${records.length} records loaded`);
      callback(records);
    },
    (error) => {
      console.error("❌ Real-time diesel listener error:", error);
      if (onError) onError(error);
    }
  );
};

// Missed Loads Services with Real-time Sync
export const addMissedLoadToFirebase = async (loadData: MissedLoad): Promise<string> => {
  try {
    const loadWithTimestamp = cleanUndefinedValues({
      ...loadData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const docRef = await addDoc(missedLoadsCollection, loadWithTimestamp);
    console.log("✅ Missed load added with real-time sync:", docRef.id);

    await logActivity('missed_load_created', docRef.id, 'missed_load', loadData);

    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding missed load:", error);
    throw error;
  }
};

export const updateMissedLoadInFirebase = async (id: string, loadData: Partial<MissedLoad>): Promise<void> => {
  try {
    const loadRef = doc(db, 'missedLoads', id);
    const updateData = cleanUndefinedValues({
      ...loadData,
      updatedAt: serverTimestamp()
    });

    await updateDoc(loadRef, updateData);
    console.log("✅ Missed load updated with real-time sync:", id);

    await logActivity('missed_load_updated', id, 'missed_load', updateData);

  } catch (error) {
    console.error("❌ Error updating missed load:", error);
    throw error;
  }
};

export const deleteMissedLoadFromFirebase = async (id: string): Promise<void> => {
  try {
    const loadRef = doc(db, 'missedLoads', id);

    // Get the document before deletion to log what's being deleted
    const snapshot = await getDoc(loadRef);
    if (!snapshot.exists()) {
      console.warn(`Missed load with ID ${id} not found, nothing to delete`);
      return;
    }

    await deleteDoc(loadRef);
    console.log("✅ Missed load deleted with real-time sync:", id);

    // Add more detailed logging with the deleted data
    await logActivity('missed_load_deleted', id, 'missed_load', {
      deletedAt: new Date().toISOString(),
      deletedData: snapshot.data()
    });

  } catch (error) {
    console.error("❌ Error deleting missed load:", error);
    throw error;
  }
};

export const listenToMissedLoads = (
  callback: (loads: MissedLoad[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const q = query(missedLoadsCollection, orderBy('recordedAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const loads: MissedLoad[] = [];

      // Process document changes
      snapshot.docChanges().forEach(change => {
        console.log(`Missed load ${change.doc.id} ${change.type}`);
      });

      // Add all current documents to the array
      snapshot.forEach(doc => {
        const data = convertTimestamps(doc.data());
        loads.push({
          id: doc.id,
          ...data
        } as MissedLoad);
      });

      console.log(`🔄 Real-time missed loads update: ${loads.length} loads loaded`);
      callback(loads);
    },
    (error) => {
      console.error("❌ Real-time missed loads listener error:", error);
      if (onError) onError(error);
    }
  );
};

// Driver Behavior Events Services with Real-time Sync
export const addDriverBehaviorEventToFirebase = async (eventData: DriverBehaviorEvent): Promise<string> => {
  try {
    const eventWithTimestamp = cleanUndefinedValues({
      ...eventData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const docRef = await addDoc(driverBehaviorCollection, eventWithTimestamp);
    console.log("✅ Driver behavior event added with real-time sync:", docRef.id);

    await logActivity('driver_behavior_created', docRef.id, 'driver_behavior', eventData);

    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding driver behavior event:", error);
    throw error;
  }
};

export const updateDriverBehaviorEventToFirebase = async (id: string, eventData: Partial<DriverBehaviorEvent>): Promise<void> => {
  try {
    const eventRef = doc(db, 'driverBehavior', id);
    const updateData = cleanUndefinedValues({
      ...eventData,
      updatedAt: serverTimestamp()
    });

    await updateDoc(eventRef, updateData);
    console.log("✅ Driver behavior event updated with real-time sync:", id);

    await logActivity('driver_behavior_updated', id, 'driver_behavior', updateData);

  } catch (error) {
    console.error("❌ Error updating driver behavior event:", error);
    throw error;
  }
};

export const deleteDriverBehaviorEventToFirebase = async (id: string): Promise<void> => {
  try {
    const eventRef = doc(db, 'driverBehavior', id);
    await deleteDoc(eventRef);
    console.log("✅ Driver behavior event deleted with real-time sync:", id);

    await logActivity('driver_behavior_deleted', id, 'driver_behavior', { deletedAt: new Date().toISOString() });

  } catch (error) {
    console.error("❌ Error deleting driver behavior event:", error);
    throw error;
  }
};

export const listenToDriverBehaviorEvents = (
  callback: (events: DriverBehaviorEvent[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const q = query(driverBehaviorCollection, orderBy('eventDate', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const events: DriverBehaviorEvent[] = [];

      // Process document changes
      snapshot.docChanges().forEach(change => {
        console.log(`Driver behavior event ${change.doc.id} ${change.type}`);
      });

      // Add all current documents to the array
      snapshot.forEach(doc => {
        const data = convertTimestamps(doc.data());
        events.push({
          id: doc.id,
          ...data
        } as DriverBehaviorEvent);
      });

      console.log(`🔄 Real-time driver behavior events update: ${events.length} events loaded`);
      callback(events);
    },
    (error) => {
      console.error("❌ Real-time driver behavior events listener error:", error);
      if (onError) onError(error);
    }
  );
};

// Action Items Services with Real-time Sync
export const addActionItemToFirebase = async (itemData: ActionItem): Promise<string> => {
  try {
    const itemWithTimestamp = cleanUndefinedValues({
      ...itemData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const docRef = await addDoc(actionItemsCollection, itemWithTimestamp);
    console.log("✅ Action item added with real-time sync:", docRef.id);

    await logActivity('action_item_created', docRef.id, 'action_item', itemData);

    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding action item:", error);
    throw error;
  }
};

export const updateActionItemInFirebase = async (id: string, itemData: Partial<ActionItem>): Promise<void> => {
  try {
    const itemRef = doc(db, 'actionItems', id);
    const updateData = cleanUndefinedValues({
      ...itemData,
      updatedAt: serverTimestamp()
    });

    await updateDoc(itemRef, updateData);
    console.log("✅ Action item updated with real-time sync:", id);

    await logActivity('action_item_updated', id, 'action_item', updateData);

  } catch (error) {
    console.error("❌ Error updating action item:", error);
    throw error;
  }
};

export const deleteActionItemFromFirebase = async (id: string): Promise<void> => {
  try {
    const itemRef = doc(db, 'actionItems', id);
    await deleteDoc(itemRef);
    console.log("✅ Action item deleted with real-time sync:", id);

    await logActivity('action_item_deleted', id, 'action_item', { deletedAt: new Date().toISOString() });

  } catch (error) {
    console.error("❌ Error deleting action item:", error);
    throw error;
  }
};

export const listenToActionItems = (
  callback: (items: ActionItem[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const q = query(actionItemsCollection, orderBy('dueDate', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: ActionItem[] = [];

      // Process document changes
      snapshot.docChanges().forEach(change => {
        console.log(`Action item ${change.doc.id} ${change.type}`);
      });

      // Add all current documents to the array
      snapshot.forEach(doc => {
        const data = convertTimestamps(doc.data());
        items.push({
          id: doc.id,
          ...data
        } as ActionItem);
      });

      console.log(`🔄 Real-time action items update: ${items.length} items loaded`);
      callback(items);
    },
    (error) => {
      console.error("❌ Real-time action items listener error:", error);
      if (onError) onError(error);
    }
  );
};

// CAR Reports Services with Real-time Sync
export const addCARReportToFirebase = async (reportData: CARReport): Promise<string> => {
  try {
    const reportWithTimestamp = cleanUndefinedValues({
      ...reportData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    const docRef = await addDoc(carReportsCollection, reportWithTimestamp);
    console.log("✅ CAR report added with real-time sync:", docRef.id);

    await logActivity('car_report_created', docRef.id, 'car_report', reportData);

    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding CAR report:", error);
    throw error;
  }
};

export const updateCARReportInFirebase = async (id: string, reportData: Partial<CARReport>): Promise<void> => {
  try {
    const reportRef = doc(db, 'carReports', id);
    const updateData = cleanUndefinedValues({
      ...reportData,
      updatedAt: serverTimestamp()
    });

    await updateDoc(reportRef, updateData);
    console.log("✅ CAR report updated with real-time sync:", id);

    await logActivity('car_report_updated', id, 'car_report', updateData);

  } catch (error) {
    console.error("❌ Error updating CAR report:", error);
    throw error;
  }
};

export const deleteCARReportFromFirebase = async (id: string): Promise<void> => {
  try {
    const reportRef = doc(db, 'carReports', id);
    await deleteDoc(reportRef);
    console.log("✅ CAR report deleted with real-time sync:", id);

    await logActivity('car_report_deleted', id, 'car_report', { deletedAt: new Date().toISOString() });

  } catch (error) {
    console.error("❌ Error deleting CAR report:", error);
    throw error;
  }
};

export const listenToCARReports = (
  callback: (reports: CARReport[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const q = query(carReportsCollection, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const reports: CARReport[] = [];

      // Process document changes
      snapshot.docChanges().forEach(change => {
        console.log(`CAR report ${change.doc.id} ${change.type}`);
      });

      // Add all current documents to the array
      snapshot.forEach(doc => {
        const data = convertTimestamps(doc.data());
        reports.push({
          id: doc.id,
          ...data
        } as CARReport);
      });

      console.log(`🔄 Real-time CAR reports update: ${reports.length} reports loaded`);
      callback(reports);
    },
    (error) => {
      console.error("❌ Real-time CAR reports listener error:", error);
      if (onError) onError(error);
    }
  );
};

// Activity Logging for Audit Trail
const logActivity = async (
  action: string,
  entityId: string,
  entityType: string,
  data: any
): Promise<void> => {
  try {
    const cleanedData = cleanUndefinedValues({
      action,
      entityId,
      entityType,
      data,
      timestamp: serverTimestamp(),
      userId: 'current-user', // In production, get from auth
      userAgent: navigator.userAgent,
      ipAddress: 'unknown' // In production, get from server
    });

    await addDoc(activityLogsCollection, cleanedData);
  } catch (error) {
    console.warn("⚠️ Failed to log activity:", error);
    // Don't throw - activity logging shouldn't break the main operation
  }
};

export const addAuditLogToFirebase = async (logData: AuditLog): Promise<string> => {
  try {
    const logWithTimestamp = cleanUndefinedValues({
      ...logData,
      timestamp: serverTimestamp(),
    });

    const docRef = await addDoc(auditLogsCollection, logWithTimestamp);
    console.log("✅ Audit log added:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding audit log:", error);
    throw error;
  }
};

export const listenToAuditLogs = (
  callback: (logs: AuditLog[]) => void,
  onError?: (error: any) => void
): (() => void) => {
  const q = query(auditLogsCollection, orderBy('timestamp', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const logs: AuditLog[] = [];

      // Process document changes
      snapshot.docChanges().forEach(change => {
        console.log(`Audit log ${change.doc.id} ${change.type}`);
      });

      // Add all current documents to the array
      snapshot.forEach(doc => {
        const data = convertTimestamps(doc.data());
        logs.push({
          id: doc.id,
          ...data
        } as AuditLog);
      });

      console.log(`🔄 Real-time audit logs update: ${logs.length} logs loaded`);
      callback(logs);
    },
    (error) => {
      console.error("❌ Real-time audit logs listener error:", error);
      if (onError) onError(error);
    }
  );
};

// Batch Operations for Performance
export const batchUpdateTrips = async (updates: Array<{ id: string; data: Partial<Trip> }>): Promise<void> => {
  try {
    const promises = updates.map(({ id, data }) => updateTripInFirebase(id, data));
    await Promise.all(promises);
    console.log(`✅ Batch updated ${updates.length} trips`);
  } catch (error) {
    console.error("❌ Error in batch update:", error);
    throw error;
  }
};

// Helper function to generate trip IDs
export const generateTripId = (): string => {
  return `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};