import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Use environment variables from .env
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate required Firebase configuration
const validateConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  
  if (missingFields.length > 0) {
    console.error('❌ Missing Firebase configuration values:', missingFields);
    throw new Error(`Firebase configuration is incomplete. Missing: ${missingFields.join(', ')}. Please check your .env file.`);
  }
};

// Validate configuration before initializing
validateConfig();

// Initialize Firebase app
export const firebaseApp = initializeApp(firebaseConfig);

// Initialize Analytics only if supported and not on localhost
export const initAnalytics = async () => {
  if (typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      firebaseConfig.projectId && 
      firebaseConfig.measurementId) {
    try {
      if (await isSupported()) {
        return getAnalytics(firebaseApp);
      }
    } catch (error) {
      console.warn('⚠️ Firebase Analytics initialization failed:', error);
    }
  }
  return null;
};