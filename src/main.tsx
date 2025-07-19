import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeConnectionMonitoring } from './utils/firebaseConnectionHandler';
import { TyreStoresProvider } from './context/TyreStoresContext';
import { TyreProvider } from './context/TyreContext';
import { initBrowserEnv, getEnvVar } from './utils/envUtils';
import './index.css';

// Initialize global environment variables for safer access
// This prevents "import.meta" errors in non-module contexts
try {
  // Handle potential import.meta errors by using a try-catch approach
  const envVars: Record<string, string> = {};
  
  // Safely access environment variables 
  const envKeys = [
    'VITE_WIALON_SESSION_TOKEN',
    'VITE_WIALON_LOGIN_URL',
    'VITE_GOOGLE_MAPS_API_KEY',
    'VITE_ENV_MODE',
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_USE_EMULATOR'
  ];
  
  // Safely access each environment variable
  envKeys.forEach(key => {
    try {
      envVars[key] = getEnvVar(key, '');
    } catch (e) {
      console.warn(`Could not access ${key} from import.meta.env`);
    }
  });
  
  initBrowserEnv(envVars);
} catch (error) {
  console.warn('Failed to initialize environment variables globally:', error);
}

// Function to render the application
const renderApp = (isDev: boolean) => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <TyreStoresProvider>
        <TyreProvider>
          <>
            {isDev && <div className="dev-indicator">Development Mode</div>}
            <App />
          </>
        </TyreProvider>
      </TyreStoresProvider>
    </React.StrictMode>
  );
};

// Initialize Firebase and check emulator status
const initializeApp = async () => {
  let isDev = getEnvVar('MODE', '') === 'development' || process.env.NODE_ENV === 'development';
  
  try {
    // Import Firebase after ensuring proper initialization
    await import('./firebase');
    console.log('🔥 Firebase initialized successfully');
    
    // Initialize connection monitoring
    await initializeConnectionMonitoring();
    
    // Validate environment variables
    const requiredEnvVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID'
    ];
    
    const missingVars = requiredEnvVars.filter(key => !getEnvVar(key, ''));
    const isValid = missingVars.length === 0;
    
    console.log('Environment validation:', 
      isValid ? '✅ Valid' : '❌ Issues found',
      missingVars.length > 0 ? `Missing: ${missingVars.join(', ')}` : '');
    
    // Check emulator status in development
    if (isDev) {
      const { checkEmulatorsStatus } = await import('./firebaseEmulators');
      const status = await checkEmulatorsStatus();
      
      if (status.firestore && status.storage) {
        console.log('✅ Firebase emulators are running and accessible');
      } else {
        console.log('⚠️ Firebase emulators status:', status);
        console.log('💡 Run "firebase emulators:start --only firestore,storage" to use emulators');
        console.log('   - Port 8081 (Firestore) is not in use');
        console.log('   - Port 9198 (Storage) is not in use');
        console.log('   - Firewall settings allow local connections');
      }
      console.log('📡 App will continue using production Firebase configuration');
    }
    
    // Render the application
    renderApp(isDev);
    
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    
    // Show user-friendly error message
    console.error('🔧 Application initialization failed, but attempting to continue...');
    
    // Render error state in case of initialization failure
    renderApp(isDev);
  }
};

// Initialize the application
initializeApp();
