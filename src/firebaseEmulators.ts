import { connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { firebaseApp } from './firebaseConfig';

/**
 * Connects the Firebase SDK to local emulators
 * @param firestore - Already initialized Firestore instance
 * Call this function early in your application's initialization
 * to ensure all Firebase operations use the emulators
 */
export const connectToEmulators = (firestore: Firestore) => {
  try {
    // Check if we're in development mode
    if (import.meta.env.DEV) {
      console.log('🧪 Running in development mode - connecting to Firebase emulators');
      
      // Get Storage instance
      const storage = getStorage(firebaseApp);
      
      // Connect to Firestore emulator
      connectFirestoreEmulator(firestore, '127.0.0.1', 8081);
      console.log('✅ Connected to Firestore emulator at 127.0.0.1:8081');
      
      // Connect to Storage emulator
      connectStorageEmulator(storage, '127.0.0.1', 9198);
      console.log('✅ Connected to Storage emulator at 127.0.0.1:9198');
      
      console.log('🔥 All Firebase emulators connected successfully');
      
      // Return the emulator-connected instances
      return { firestore, storage };
    } else {
      console.log('🚀 Running in production mode - using production Firebase services');
      return null;
    }
  } catch (error) {
    console.error('❌ Error connecting to Firebase emulators:', error);
    return null;
  }
};