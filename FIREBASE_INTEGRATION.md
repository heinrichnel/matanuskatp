# Firebase Integration and Data Flow

## Firebase Configuration Structure

The application integrates with Firebase using the following configuration files:

### `/src/firebase.ts`
Main Firebase initialization file that exports the initialized Firebase app and services:
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { firebaseConfig } from './firebaseConfig';
import { getPerformance } from 'firebase/performance';
import { isEmulatorMode } from './firebaseEmulators';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Connect to emulators in development
if (isEmulatorMode) {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectStorageEmulator(storage, 'localhost', 9199);
  connectFunctionsEmulator(functions, 'localhost', 5001);
} else {
  // Initialize performance monitoring in production
  getPerformance(app);
}
```

### `/src/firebaseConfig.ts`
Contains Firebase project configuration:
```typescript
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
```

### `/src/firebaseEmulators.ts`
Controls emulator usage for local development:
```typescript
// Determine if we should use Firebase emulators
export const isEmulatorMode = 
  import.meta.env.MODE === 'development' && 
  import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';

// Emulator host configuration
export const emulatorHost = 'localhost';
```

## Firestore Data Structure

The application uses the following Firestore collections:

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| `trips` | Trip data | `status`, `startTime`, `endTime`, `vehicleId`, `driverId`, `origin`, `destination` |
| `vehicles` | Vehicle information | `regNumber`, `make`, `model`, `year`, `status`, `lastService` |
| `drivers` | Driver profiles | `name`, `licenseNumber`, `licenseExpiry`, `contact`, `status` |
| `tyres` | Tyre inventory | `tireNumber`, `manufacturer`, `status`, `vehicleId`, `axlePosition` |
| `invoices` | Invoice records | `invoiceNumber`, `customerId`, `amount`, `status`, `dueDate` |
| `fuelEntries` | Fuel transactions | `vehicleId`, `driverId`, `volume`, `cost`, `location`, `timestamp` |
| `jobCards` | Workshop jobs | `vehicleId`, `description`, `status`, `openDate`, `closeDate` |
| `inspections` | Vehicle inspections | `vehicleId`, `inspectorId`, `date`, `items`, `status` |
| `customers` | Customer data | `name`, `contact`, `address`, `status`, `creditTerms` |

## Real-time Data Hooks

### `/src/hooks/useRealtimeTrips.ts`
Custom hook for real-time trip data:
```typescript
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Trip } from '../types';

export function useRealtimeTrips(status = 'active') {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    
    const q = query(
      collection(db, 'trips'),
      where('status', '==', status),
      orderBy('startTime', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trip[];
      
      setTrips(tripData);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching trips:', err);
      setError(err);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [status]);

  return { trips, loading, error };
}
```

### `/src/hooks/useFirestoreDoc.ts`
Generic hook for real-time document updates:
```typescript
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export function useFirestoreDoc<T>(collection: string, docId: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }
    
    const docRef = doc(db, collection, docId);
    
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setData({ id: doc.id, ...doc.data() } as T);
      } else {
        setData(null);
      }
      setLoading(false);
    }, (err) => {
      console.error(`Error fetching ${collection} document:`, err);
      setError(err);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [collection, docId]);

  return { data, loading, error };
}
```

## Firebase Cloud Functions

The application uses several Firebase Cloud Functions defined in `/functions/src/`:

### Driver Behavior Analysis
```typescript
// /functions/src/enhanced-driver-behavior-webhook.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const processDriverBehaviorEvent = functions.https.onRequest(async (req, res) => {
  try {
    const { driverId, eventType, timestamp, location, severity, details } = req.body;
    
    if (!driverId || !eventType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Add event to Firestore
    await admin.firestore().collection('driverEvents').add({
      driverId,
      eventType,
      timestamp: timestamp || admin.firestore.FieldValue.serverTimestamp(),
      location,
      severity,
      details,
      processed: false
    });
    
    // Update driver statistics
    const driverRef = admin.firestore().collection('drivers').doc(driverId);
    await admin.firestore().runTransaction(async (transaction) => {
      const driverDoc = await transaction.get(driverRef);
      
      if (!driverDoc.exists) {
        throw new Error('Driver document does not exist');
      }
      
      const driverData = driverDoc.data();
      const events = driverData.events || {};
      const eventCount = events[eventType] || 0;
      
      transaction.update(driverRef, {
        [`events.${eventType}`]: eventCount + 1,
        eventCount: (driverData.eventCount || 0) + 1,
        lastEventTimestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing driver behavior event:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Wialon Integration
```typescript
// /functions/src/wialonFetcher.ts
import * as functions from 'firebase-functions';
import axios from 'axios';
import * as admin from 'firebase-admin';

const wialonApiUrl = functions.config().wialon.api_url;
const wialonToken = functions.config().wialon.token;

export const syncWialonData = functions.pubsub.schedule('every 30 minutes').onRun(async (context) => {
  try {
    // Get vehicles from Wialon
    const vehiclesResponse = await axios.post(wialonApiUrl, {
      svc: 'core/search_items',
      params: {
        spec: {
          itemsType: 'avl_unit',
          propName: 'sys_name',
          propValueMask: '*',
          sortType: 'sys_name'
        },
        force: 1,
        flags: 1,
        from: 0,
        to: 1000
      },
      sid: wialonToken
    });
    
    const vehicles = vehiclesResponse.data.items || [];
    
    // Update vehicles in Firestore
    for (const vehicle of vehicles) {
      const vehicleData = {
        wialonId: vehicle.id,
        name: vehicle.nm,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        // Map other vehicle properties
      };
      
      await admin.firestore().collection('vehicles')
        .doc(vehicle.id.toString())
        .set(vehicleData, { merge: true });
    }
    
    console.log(`Synced ${vehicles.length} vehicles from Wialon`);
    return null;
  } catch (error) {
    console.error('Error syncing Wialon data:', error);
    throw error;
  }
});
```

## Authentication Flow

The application uses Firebase Authentication with custom user roles:

```typescript
// /src/context/AppContext.tsx (excerpt)
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface UserRole {
  admin: boolean;
  manager: boolean;
  driver: boolean;
  mechanic: boolean;
}

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  roles: UserRole;
}

export const AppContext = createContext<{
  currentUser: User | null;
  userData: UserData | null;
  isAdmin: boolean;
  isManager: boolean;
  isDriver: boolean;
  isMechanic: boolean;
}>({
  currentUser: null,
  userData: null,
  isAdmin: false,
  isManager: false,
  isDriver: false,
  isMechanic: false,
});

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user's custom claims and roles
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUserData({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            roles: userDoc.data().roles || {
              admin: false,
              manager: false,
              driver: false,
              mechanic: false
            }
          });
        }
      } else {
        setUserData(null);
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  const isAdmin = userData?.roles?.admin || false;
  const isManager = userData?.roles?.manager || false;
  const isDriver = userData?.roles?.driver || false;
  const isMechanic = userData?.roles?.mechanic || false;
  
  const value = {
    currentUser,
    userData,
    isAdmin,
    isManager,
    isDriver,
    isMechanic,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
```

## Storage Integration

The application uses Firebase Storage for file uploads:

```typescript
// Example function to upload inspection images
export async function uploadInspectionImage(
  vehicleId: string, 
  inspectionId: string, 
  file: File
): Promise<string> {
  const storageRef = ref(storage, `inspections/${vehicleId}/${inspectionId}/${file.name}`);
  
  // Upload file
  const snapshot = await uploadBytes(storageRef, file);
  
  // Get download URL
  const downloadUrl = await getDownloadURL(snapshot.ref);
  
  // Update inspection document
  await updateDoc(doc(db, 'inspections', inspectionId), {
    images: arrayUnion({
      name: file.name,
      url: downloadUrl,
      uploadedAt: serverTimestamp()
    })
  });
  
  return downloadUrl;
}
```

This document provides a detailed overview of how Firebase is integrated throughout the application, showing the key configurations, data structures, and implementation patterns used.
