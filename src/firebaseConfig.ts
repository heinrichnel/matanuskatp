import { initializeApp } from "firebase/app";

// Use environment variables from .env
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// DEBUG ONLY – To detect missing environment variables during development
if (import.meta.env.DEV) {
  console.log('Firebase Config:', {
    apiKey: import.meta.env.VITE_FIREBASE_API ? '✓ Present' : '✗ Missing',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✓ Present' : '✗ Missing',
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL ? '✓ Present' : '✗ Missing',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✓ Present' : '✗ Missing',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✓ Present' : '✗ Missing',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✓ Present' : '✗ Missing',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ? '✓ Present' : '✗ Missing',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? '✓ Present' : '✗ Missing'
  });
}

// Validate required Firebase configuration
const validateConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

  if (missingFields.length > 0) {
    console.error('❌ Missing Firebase configuration values:', missingFields);
    throw new Error(`Firebase configuration is incomplete. Missing: ${missingFields.join(', ')}`);
  }
};

// Validate configuration before initializing
validateConfig();

// Initialize Firebase app
export const firebaseApp = initializeApp(firebaseConfig);

// Analytics initialization is handled in firebase.ts to avoid redundancy.