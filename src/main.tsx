import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeConnectionMonitoring } from './utils/firebaseConnectionHandler';
import { TyreStoresProvider } from './context/TyreStoresContext';
import './index.css';

// Initialize Firebase and check emulator status
const initializeApp = async () => {
  try {
    // Import Firebase after ensuring proper initialization
    await import('./firebase');
    console.log('🔥 Firebase initialized successfully');
    
    // Initialize connection monitoring
    await initializeConnectionMonitoring();
    
    // Check emulator status in development
    if (import.meta.env.DEV) {
      const { checkEmulatorsStatus } = await import('./firebaseEmulators');
      const status = await checkEmulatorsStatus();
      
      if (status.firestore && status.storage) {
        console.log('✅ Firebase emulators are running and accessible');
      } else {
        console.log('⚠️ Firebase emulators status:', status);
        console.log('💡 Run "firebase emulators:start --only firestore,storage" to use emulators');
      console.log('💡 Run "firebase emulators:start --only firestore,storage" to use local emulators');
        console.log('   - Port 8081 (Firestore) is not in use');
        console.log('   - Port 9198 (Storage) is not in use');
        console.log('   - Firewall settings allow local connections');
      }
      console.log('📡 App will continue using production Firebase configuration');
    }
    
    // Render the app
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <TyreStoresProvider>
          <App />
        </TyreStoresProvider>
      </React.StrictMode>
    );
    
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    
    // Show user-friendly error message
    console.error('🔧 Application initialization failed, but attempting to continue...');
    
    // Render error state
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
};

// Initialize the application
initializeApp();