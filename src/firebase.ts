import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection, addDoc, setDoc, doc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { firebaseConfig } from './firebaseConfig';
import { DieselConsumptionRecord } from './types/diesel';
import { Trip } from './types';

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators in development mode
if (import.meta.env.DEV && typeof window !== 'undefined') {
  let emulatorsConnected = false;
  
  try {
    // Check if emulators are already connected to avoid duplicate connections
    if (!emulatorsConnected) {
      // Connect to Firestore emulator
      connectFirestoreEmulator(firestore, '127.0.0.1', 8081);
      console.log('✅ Connected to Firestore emulator at 127.0.0.1:8081');
      
      // Connect to Storage emulator  
      connectStorageEmulator(storage, '127.0.0.1', 9198);
      console.log('✅ Connected to Storage emulator at 127.0.0.1:9198');
      
      emulatorsConnected = true;
      console.log('🔥 Firebase emulators connected successfully');
    }
  } catch (error) {
    console.warn('⚠️ Failed to connect to Firebase emulators:', error);
    console.log('📡 Falling back to production Firebase services');
    console.log('💡 To use emulators, make sure Firebase emulators are running:');
    console.log('   firebase emulators:start --only firestore,storage');
  }
}

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

// Firestore listener for real-time updates
export function listenToDriverBehaviorEvents(callback: (events: any[]) => void) {
  const eventsRef = collection(firestore, "driverBehaviorEvents");
  const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(events);
  });
  return unsubscribe;
}

export { firestore, storage };
export { firestore as db };
export default app;