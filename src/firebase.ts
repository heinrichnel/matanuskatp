import { collection, addDoc, setDoc, doc, serverTimestamp, onSnapshot, deleteDoc, getDoc, updateDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseApp } from './firebaseConfig';
import { DieselConsumptionRecord } from './types/diesel';
import { Trip } from './types';
import { Tyre, TyreSize, TyreInspection, TyreStore, StockEntry, TyreType, TyreStoreLocation } from './types/tyre';
import { firestore, handleFirestoreError } from './utils/firebaseConnectionHandler';

// Gebruik Storage service
const storage = getStorage(firebaseApp);

// Add audit log function
export const addAuditLogToFirebase = async (auditLogData: any) => {
  try {
    const auditLogsRef = collection(firestore, 'auditLogs');
    const docRef = await addDoc(auditLogsRef, {
      ...auditLogData,
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp()
    });
    console.log('Audit log added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding audit log:', error);
    await handleFirestoreError(error);
    throw error;
  }
};

// Add diesel record to Firebase
export const addDieselToFirebase = async (dieselRecord: DieselConsumptionRecord) => {
  try {
    const dieselRef = doc(firestore, 'diesel', dieselRecord.id);
    await setDoc(dieselRef, {
      ...dieselRecord,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Diesel record added with ID:', dieselRecord.id);
    return dieselRecord.id;
  } catch (error) {
    console.error('Error adding diesel record:', error);
    throw error;
  }
};

// Add trip to Firebase
export const addTripToFirebase = async (trip: Trip) => {
  try {
    const tripRef = doc(firestore, 'trips', trip.id);
    await setDoc(tripRef, {
      ...trip,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Trip added with ID:', trip.id);
    return trip.id;
  } catch (error) {
    console.error('Error adding trip:', error);
    throw error;
  }
};

// Add missed load to Firebase
export const addMissedLoadToFirebase = async (missedLoadData: any) => {
  try {
    const missedLoadsRef = collection(firestore, 'missedLoads');
    const docRef = await addDoc(missedLoadsRef, {
      ...missedLoadData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Missed load added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding missed load:', error);
    throw error;
  }
};

// Function to update a trip in Firebase
export async function updateTripInFirebase(tripId: string, tripData: Partial<Trip>) {
  const tripRef = doc(firestore, 'trips', tripId);
  await setDoc(tripRef, { ...tripData, updatedAt: serverTimestamp() }, { merge: true });
}

// Function to update a diesel record in Firebase
export async function updateDieselInFirebase(dieselId: string, dieselData: Partial<DieselConsumptionRecord>) {
  try {
    const dieselRef = doc(firestore, 'diesel', dieselId);
    await setDoc(dieselRef, {
      ...dieselData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log('Diesel record updated with ID:', dieselId);
    return dieselId;
  } catch (error) {
    console.error('Error updating diesel record:', error);
    throw error;
  }
}

// Function to delete a trip from Firebase
export async function deleteTripFromFirebase(tripId: string) {
  try {
    const tripRef = doc(firestore, 'trips', tripId);
    await deleteDoc(tripRef);
    console.log('Trip deleted with ID:', tripId);
    return tripId;
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
}

// Function to delete a diesel record from Firebase
export async function deleteDieselFromFirebase(dieselId: string) {
  try {
    const dieselRef = doc(firestore, 'diesel', dieselId);
    await deleteDoc(dieselRef);
    console.log('Diesel record deleted with ID:', dieselId);
    return dieselId;
  } catch (error) {
    console.error('Error deleting diesel record:', error);
    throw error;
  }
}

// Function to delete a missed load from Firebase
export async function deleteMissedLoadFromFirebase(missedLoadId: string) {
  try {
    const missedLoadRef = doc(firestore, 'missedLoads', missedLoadId);
    await deleteDoc(missedLoadRef);
    console.log('Missed load deleted with ID:', missedLoadId);
    return missedLoadId;
  } catch (error) {
    console.error('Error deleting missed load:', error);
    throw error;
  }
}

// Function to update a missed load in Firebase
export async function updateMissedLoadInFirebase(missedLoadId: string, missedLoadData: any) {
  try {
    const missedLoadRef = doc(firestore, 'missedLoads', missedLoadId);
    await setDoc(missedLoadRef, {
      ...missedLoadData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    console.log('Missed load updated with ID:', missedLoadId);
    return missedLoadId;
  } catch (error) {
    console.error('Error updating missed load:', error);
    throw error;
  }
}

// Firestore listener for real-time updates
export function listenToDriverBehaviorEvents(callback: (events: any[]) => void) {
  const eventsRef = collection(firestore, "driverBehaviorEvents");
  const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(events);
  });
  return unsubscribe;
}

// --- New TyreStores Helpers ---

// --- New Tyre Management Helpers ---

/**
 * Add or update a tyre document in Firestore
 */
export async function saveTyre(tyre: Tyre): Promise<string> {
  try {
    // Validate essential tyre data
    if (!tyre.serialNumber || !tyre.brand || !tyre.size) {
      throw new Error('Tyre must have serial number, brand and size');
    }

    const tyreRef = tyre.id
      ? doc(firestore, 'tyres', tyre.id)
      : doc(collection(firestore, 'tyres'));

    const tyreId = tyre.id || tyreRef.id;
    
    // Add ID and timestamps if this is a new tyre
    const tyreData = {
      ...tyre,
      id: tyreId,
      updatedAt: serverTimestamp(),
      createdAt: tyre.createdAt || serverTimestamp()
    };
    
    await setDoc(tyreRef, tyreData);
    return tyreId;
  } catch (error) {
    console.error('Error saving tyre:', error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get a tyre by ID
 */
export async function getTyreById(tyreId: string): Promise<Tyre | null> {
  try {
    const tyreRef = doc(firestore, 'tyres', tyreId);
    const tyreSnap = await getDoc(tyreRef);
    
    if (!tyreSnap.exists()) return null;
    
    return { id: tyreSnap.id, ...tyreSnap.data() } as Tyre;
  } catch (error) {
    console.error('Error getting tyre:', error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get all tyres with optional filtering
 */
export async function getTyres(filters?: {
  status?: string;
  mountStatus?: string;
  brand?: string;
  location?: string;
  vehicleId?: string;
  condition?: string;
  minTreadDepth?: number;
  maxTreadDepth?: number;
}): Promise<Tyre[]> {
  try {
    let q = collection(firestore, "tyres");
    let queryObject = query(q);

    // Apply filters if provided
    if (filters) {
      if (filters.status) {
        queryObject = query(queryObject, where('status', '==', filters.status));
      }
      if (filters.mountStatus) {
        queryObject = query(queryObject, where('mountStatus', '==', filters.mountStatus));
      }
      if (filters.brand) {
        queryObject = query(queryObject, where('brand', '==', filters.brand));
      }
      if (filters.location) {
        queryObject = query(queryObject, where('location', '==', filters.location));
      }
      if (filters.vehicleId) {
        queryObject = query(queryObject, where('installation.vehicleId', '==', filters.vehicleId));
      }
      if (filters.condition) {
        queryObject = query(queryObject, where('condition.status', '==', filters.condition));
      }
      // Add sorting by default
      queryObject = query(queryObject, orderBy('updatedAt', 'desc'));
    } else {
      // Default sorting if no filters
      queryObject = query(q, orderBy('updatedAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(queryObject);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert any Firestore Timestamps to ISO strings
      if (data.createdAt) {
        data.createdAt = data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
      }
      if (data.updatedAt) {
        data.updatedAt = data.updatedAt.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt;
      }
      return { id: doc.id, ...data } as Tyre;
    });
  } catch (error) {
    console.error('Error getting tyres:', error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Delete a tyre
 */
export async function deleteTyre(tyreId: string): Promise<void> {
  try {
    const tyreRef = doc(firestore, 'tyres', tyreId);
    await deleteDoc(tyreRef);
  } catch (error) {
    console.error('Error deleting tyre:', error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Add a tyre inspection record
 */
export async function addTyreInspection(tyreId: string, inspection: TyreInspection): Promise<string> {
  try {
    if (!tyreId) {
      throw new Error('Tyre ID is required');
    }
    
    // Validate inspection data
    if (!inspection.date || !inspection.inspector || inspection.treadDepth === undefined) {
      throw new Error('Inspection requires date, inspector and tread depth');
    }
    
    // Add to inspections subcollection
    const inspectionsRef = collection(firestore, 'tyres', tyreId, 'inspections');
    const inspectionDoc = inspection.id 
      ? doc(inspectionsRef, inspection.id)
      : doc(inspectionsRef);
    
    const inspectionId = inspection.id || inspectionDoc.id;
    
    await setDoc(inspectionDoc, {
      ...inspection,
      id: inspectionId,
      createdAt: serverTimestamp()
    });
    
    // Update the tyre document with latest inspection results
    const tyreRef = doc(firestore, 'tyres', tyreId);
    await updateDoc(tyreRef, {
      'condition.treadDepth': inspection.treadDepth,
      'condition.pressure': inspection.pressure,
      'condition.lastInspectionDate': inspection.date,
      updatedAt: serverTimestamp()
    });
    
    return inspectionId;
  } catch (error) {
    console.error('Error adding tyre inspection:', error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get all inspections for a tyre
 */
export async function getTyreInspections(tyreId: string): Promise<TyreInspection[]> {
  try {
    const inspectionsRef = collection(firestore, 'tyres', tyreId, 'inspections');
    const q = query(inspectionsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TyreInspection));
  } catch (error) {
    console.error('Error getting tyre inspections:', error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Get tyres mounted on a specific vehicle
 */
export async function getTyresByVehicle(vehicleId: string): Promise<Tyre[]> {
  try {
    const q = query(
      collection(firestore, 'tyres'),
      where('mountStatus', '==', 'mounted'),
      where('installation.vehicleId', '==', vehicleId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tyre));
  } catch (error) {
    console.error('Error getting tyres by vehicle:', error);
    await handleFirestoreError(error);
    throw error;
  }
}

/**
 * Listen to tyres collection in real-time
 */
export function listenToTyres(callback: (tyres: Tyre[]) => void) {
  // Query with sorting for consistent ordering
  const q = query(
    collection(firestore, 'tyres'),
    orderBy('updatedAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const tyres = snapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore Timestamps to standard dates
      if (data.createdAt) {
        data.createdAt = data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt;
      }
      if (data.updatedAt) {
        data.updatedAt = data.updatedAt.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt;
      }
      return { id: doc.id, ...data } as Tyre;
    });
    callback(tyres);
  }, (error) => {
    console.error('Error listening to tyres:', error);
    handleFirestoreError(error);
  });
}

/**
 * Add a new TyreStore document
 */
export async function addTyreStore(store: TyreStore): Promise<void> {
  const storeRef = doc(firestore, 'tyreStores', store.id);
  await setDoc(storeRef, {
    ...store,
    dateAdded: serverTimestamp()
  });
}

/**
 * Update or insert a stock entry in a specific TyreStore
 */
export async function updateTyreStoreEntry(storeId: string, entry: StockEntry): Promise<void> {
  const storeRef = doc(firestore, 'tyreStores', storeId);
  const snap = await getDoc(storeRef);
  if (!snap.exists()) throw new Error(`TyreStore ${storeId} does not exist`);
  const data = snap.data() as TyreStore;
  const entries = data.entries || [];
  const idx = entries.findIndex(e => e.tyreId === entry.tyreId);
  if (idx >= 0) {
    entries[idx] = entry;
  } else {
    entries.push(entry);
  }
  await updateDoc(storeRef, { entries });
}

/**
 * Listen to all TyreStore documents in real time
 */
export function listenToTyreStores(onChange: (stores: TyreStore[]) => void) {
  const collRef = collection(firestore, 'tyreStores');
  return onSnapshot(collRef, snapshot => {
    const stores: TyreStore[] = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<TyreStore, 'id'>) }));
    onChange(stores);
  });
}

/**
 * Get tyre statistics for dashboard
 */
export async function getTyreStats(): Promise<{
  total: number;
  mounted: number;
  inStock: number;
  needsAttention: number;
  byBrand: Record<string, number>;
  byCondition: Record<string, number>;
}> {
  try {
    const totalSnapshot = await getDocs(collection(firestore, 'tyres'));
    const mountedSnapshot = await getDocs(query(
      collection(firestore, 'tyres'),
      where('mountStatus', '==', 'mounted')
    ));
    const inStockSnapshot = await getDocs(query(
      collection(firestore, 'tyres'),
      where('mountStatus', '==', 'in_storage')
    ));
    const needsAttentionSnapshot = await getDocs(query(
      collection(firestore, 'tyres'),
      where('condition.status', 'in', ['critical', 'needs_replacement'])
    ));
    
    // Get brand distribution
    const byBrand: Record<string, number> = {};
    totalSnapshot.docs.forEach(doc => {
      const brand = doc.data().brand || 'Unknown';
      byBrand[brand] = (byBrand[brand] || 0) + 1;
    });
    
    // Get condition distribution
    const byCondition: Record<string, number> = {};
    totalSnapshot.docs.forEach(doc => {
      const condition = doc.data().condition?.status || 'Unknown';
      byCondition[condition] = (byCondition[condition] || 0) + 1;
    });
    
    return {
      total: totalSnapshot.size,
      mounted: mountedSnapshot.size,
      inStock: inStockSnapshot.size,
      needsAttention: needsAttentionSnapshot.size,
      byBrand,
      byCondition
    };
  } catch (error) {
    console.error('Error getting tyre stats:', error);
    await handleFirestoreError(error);
    throw error;
  }
}

// --- End TyreStores Helpers ---

export { firestore, storage };
export { firestore as db };
export default firebaseApp;
