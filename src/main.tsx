import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeConnectionMonitoring } from './utils/firebaseConnectionHandler';
import './index.css';

// Initialize Firebase and check emulator status
const initializeApp = async () => {
  try {
    // Import Firebase after ensuring proper initialization
    await import('./firebase');
    console.log('🔥 Firebase initialized successfully');
    
    // Initialize connection monitoring
    initializeConnectionMonitoring();
    
    // Check emulator status in development
    if (import.meta.env.DEV) {
      const { checkEmulatorsStatus } = await import('./firebaseEmulators');
      const status = await checkEmulatorsStatus();
      
      if (status.firestore && status.storage) {
        console.log('✅ Firebase emulators are running and accessible');
      } else {
        console.log('⚠️ Firebase emulators status:', status);
        console.log('💡 Run "firebase emulators:start --only firestore,storage" to use emulators');
      }
    }
    
    // Render the app
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    
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