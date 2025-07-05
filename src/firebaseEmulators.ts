import { connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { firebaseApp } from './firebaseConfig';

/**
 * Enhanced emulator connection with better error handling and fallbacks
 * @param firestore - Already initialized Firestore instance
 */
export const connectToEmulators = (firestore: Firestore) => {
  // Skip if not in development mode
  if (!import.meta.env.DEV) {
    console.log('🚀 Running in production mode - using production Firebase services');
    return null;
  }

  // Skip if running in server-side environment
  if (typeof window === 'undefined') {
    console.log('🔍 Server-side environment detected - skipping emulator connection');
    return null;
  }

  try {
    console.log('🧪 Development mode detected - attempting emulator connection');
    
    // Get Storage instance
    const storage = getStorage(firebaseApp);
    
    // Test if emulators are reachable before connecting
    const testEmulatorConnection = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8081', { 
          method: 'GET', 
          mode: 'no-cors',
          signal: AbortSignal.timeout(2000) // 2 second timeout
        });
        return true;
      } catch (error) {
        console.warn('🔌 Firestore emulator not reachable at 127.0.0.1:8081');
        return false;
      }
    };

    // Attempt connection with timeout
    const connectWithTimeout = async () => {
      const isEmulatorReachable = await testEmulatorConnection();
      
      if (!isEmulatorReachable) {
        throw new Error('Firestore emulator not reachable');
      }

      // Connect to Firestore emulator
      connectFirestoreEmulator(firestore, '127.0.0.1', 8081);
      console.log('✅ Connected to Firestore emulator at 127.0.0.1:8081');
      
      // Connect to Storage emulator
      connectStorageEmulator(storage, '127.0.0.1', 9198);
      console.log('✅ Connected to Storage emulator at 127.0.0.1:9198');
      
      console.log('🔥 All Firebase emulators connected successfully');
      return { firestore, storage };
    };

    // Return promise for async connection
    return connectWithTimeout().catch(error => {
      console.warn('⚠️ Failed to connect to Firebase emulators:', error.message);
      console.log('📡 Application will use production Firebase services');
      console.log('💡 To use emulators, ensure they are running:');
      console.log('   firebase emulators:start --only firestore,storage');
      return null;
    });

  } catch (error) {
    console.error('❌ Error during emulator connection setup:', error);
    console.log('📡 Falling back to production Firebase services');
    return null;
  }
};

/**
 * Check if Firebase emulators are running and accessible
 */
export const checkEmulatorsStatus = async () => {
  if (!import.meta.env.DEV) return { firestore: false, storage: false };
  
  const checkEmulator = async (host: string, port: number) => {
    try {
      const response = await fetch(`http://${host}:${port}`, {
        method: 'GET',
        mode: 'no-cors',
        signal: AbortSignal.timeout(1000)
      });
      return true;
    } catch {
      return false;
    }
  };

  const [firestoreStatus, storageStatus] = await Promise.all([
    checkEmulator('127.0.0.1', 8081),
    checkEmulator('127.0.0.1', 9198)
  ]);

  return {
    firestore: firestoreStatus,
    storage: storageStatus
  };
};