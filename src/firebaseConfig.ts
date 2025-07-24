import { initializeApp, FirebaseOptions } from "firebase/app";

// Default configuration for development and fallback
const defaultConfig: FirebaseOptions = {
  apiKey: "AIzaSyBtq7Z6qqaVmb22d3aNcwNiqkrbGtIhJ7g",
  authDomain: "mat1-9e6b3.firebaseapp.com",
  databaseURL: "https://mat1-9e6b3-default-rtdb.firebaseio.com",
  projectId: "mat1-9e6b3",
  storageBucket: "mat1-9e6b3.appspot.com",
  messagingSenderId: "250085264089",
  appId: "1:250085264089:web:51c2b209e0265e7d04ccc8",
  measurementId: "G-YHQHSJN5CQ"
};

// Use environment variables from .env with fallback to default config
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || defaultConfig.databaseURL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket, // <<--- REG GEMAAK
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || defaultConfig.measurementId
};

// Check environment variables in all environments
const checkEnvVars = () => {
  const vars = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✓ Present' : '✗ Missing',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✓ Present' : '✗ Missing',
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL ? '✓ Present' : '✗ Missing',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✓ Present' : '✗ Missing',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✓ Present' : '✗ Missing',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ? '✓ Present' : '✗ Missing',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ? '✓ Present' : '✗ Missing',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ? '✓ Present' : '✗ Missing'
  };
  
  // In development, show complete status
  if (import.meta.env.DEV) {
    console.log('Firebase Config:', vars);
  }
  
  // In production, only warn about missing vars
  if (!import.meta.env.DEV) {
    const missing = Object.entries(vars)
      .filter(([, status]) => status === '✗ Missing')
      .map(([key]) => key);
      
    if (missing.length > 0) {
      console.warn(`⚠️ Missing Firebase environment variables in production: ${missing.join(', ')}`);
    }
    
    // Warn if using development config in production
    if (firebaseConfig.apiKey === defaultConfig.apiKey) {
      console.warn('⚠️ Using development Firebase config in production environment! Set proper environment variables.');
    }
  }
};

checkEnvVars();

const validateConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);
  if (missingFields.length > 0) {
    console.warn('⚠️ Using fallback values for Firebase configuration:', missingFields);
    return false;
  }
  return true;
};
validateConfig();

export const firebaseApp = initializeApp(firebaseConfig);
