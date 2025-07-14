// /workspaces/APppp/src/firebaseEmulators.ts

import { connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { firebaseApp } from './firebaseConfig';

/**
 * Connects to local Firebase emulators (Firestore & Storage) during development,
 * with robust error handling and clear logging.
 * 
 * @param firestore - Already initialized Firestore instance (from firebaseConfig)
 * @returns Promise<{firestore, storage} | null>
 */
export const connectToEmulators = (firestore: Firestore) => {
  // Only run in development mode
  if (!import.meta.env.DEV) {
    console.log('🚀 Production mode: Using live Firebase services');
    return null;
  }

  // Don't run in SSR/server context
  if (typeof window === 'undefined') {
    console.log('🔍 Detected server environment: Skipping emulator connection');
    return null;
  }

  try {
    console.log('🧪 Development mode: Trying to connect Firebase emulators...');
    const storage = getStorage(firebaseApp);

    // Helper: Test if an emulator is up (fire-and-forget, no error if CORS)
    const testEmulatorConnection = async () => {
      try {
        await fetch('http://127.0.0.1:8081', { 
          method: 'GET', 
          mode: 'no-cors',
          signal: AbortSignal.timeout(2000)
        });
        return true;
      } catch {
        console.warn('🔌 Firestore emulator NOT reachable at 127.0.0.1:8081');
        return false;
      }
    };

    // Main connect function
    const connectWithTimeout = async () => {
      const reachable = await testEmulatorConnection();
      if (!reachable) {
        throw new Error('Firestore emulator not reachable');
      }

      connectFirestoreEmulator(firestore, '127.0.0.1', 8081);
      console.log('✅ Connected to Firestore emulator (127.0.0.1:8081)');

      connectStorageEmulator(storage, '127.0.0.1', 9198);
      console.log('✅ Connected to Storage emulator (127.0.0.1:9198)');

      console.log('🔥 All Firebase emulators connected successfully');
      return { firestore, storage };
    };

    // Async return (so caller can await or ignore)
    return connectWithTimeout().catch(error => {
      console.warn('⚠️ Failed to connect Firebase emulators:', error.message);
      console.log('📡 Using production Firebase services instead.');
      console.log('💡 To use emulators, run: firebase emulators:start --only firestore,storage');
      return null;
    });

  } catch (error) {
    console.error('❌ Error during emulator connection:', error);
    console.log('📡 Falling back to production Firebase.');
    return null;
  }
};

/**
 * Utility: Check if both Firestore & Storage emulators are running.
 * @returns {firestore: boolean, storage: boolean}
 */
export const checkEmulatorsStatus = async () => {
  if (!import.meta.env.DEV) return { firestore: false, storage: false };

  const checkEmulator = async (host: string, port: number) => {
    try {
      await fetch(`http://${host}:${port}`, {
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
