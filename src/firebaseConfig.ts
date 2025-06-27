import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Use environment variables from .env
export const firebaseConfig = {
  apiKey: "AIzaSyBtq7Z6qqaVmb22d3aNcwNiqkrbGtIhJ7g",
  authDomain: "mat1-9e6b3.firebaseapp.com",
  databaseURL: "https://mat1-9e6b3-default-rtdb.firebaseio.com",
  projectId: "mat1-9e6b3",
  storageBucket: "mat1-9e6b3.firebasestorage.app",
  messagingSenderId: "250085264089",
  appId: "1:250085264089:web:51c2b209e0265e7d04ccc8",
  measurementId: "G-YHQHSJN5CQ"
};

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