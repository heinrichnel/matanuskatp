import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { initializeConnectionMonitoring } from './utils/firebaseConnectionHandler';
import { TyreStoresProvider } from './context/TyreStoresContext';
import './index.css';

// Wialon SDK globaal koppel
declare global {
  interface Window {
    wialon: any;
  }
}

// App-initialisering
const initializeApp = async () => {
  try {
    // Firebase inlaai
    await import('./firebase');
    console.log('🔥 Firebase initialized successfully');

    // Firebase verbinding monitor
    await initializeConnectionMonitoring();

    // Firebase Emulators status (slegs in ontwikkeling)
    if (import.meta.env.DEV) {
      const { checkEmulatorsStatus } = await import('./firebaseEmulators');
      const status = await checkEmulatorsStatus();

      if (status.firestore && status.storage) {
        console.log('✅ Firebase emulators are running and accessible');
      } else {
        console.warn('⚠️ Firebase emulator status:', status);
        console.warn('💡 Run: firebase emulators:start --only firestore,storage');
        console.warn('   - Port 8081 (Firestore) / 9198 (Storage)');
      }
    }

    // Toepassing render
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <BrowserRouter>
          <TyreStoresProvider>
            <App />
          </TyreStoresProvider>
        </BrowserRouter>
      </React.StrictMode>
    );

  } catch (error) {
    console.error('❌ App initialization failed:', error);

    // Nood-render
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
};

// Begin app
initializeApp();
