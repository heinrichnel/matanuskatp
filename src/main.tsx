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
        console.log('🔧 If emulators are already running, check:');
        console.log('   - Port 8081 (Firestore) is not in use');
        console.log('   - Port 9198 (Storage) is not in use');
        console.log('   - Firewall settings allow local connections');
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
    
    // Show user-friendly error message
    if (error instanceof Error && error.message.includes('emulator')) {
      console.error('🔧 Emulator Connection Issue:');
      console.error('   The Firebase emulator is not running or accessible.');
      console.error('   Please run: firebase emulators:start --only firestore,storage');
    }
    
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