import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { firebaseConfig } from './firebaseConfig';

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

export { firestore, storage };
export { firestore as db };
export default app;