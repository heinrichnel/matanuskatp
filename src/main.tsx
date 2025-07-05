import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize Firebase and check emulator status
const initializeApp = async () => {
  try {
    // Import Firebase after ensuring proper initialization
    const { firestore } = await import('./firebase');
    console.log('🔥 Firebase initialized successfully');
    
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
        <div style={{ 
          padding: '20px', 
          fontFamily: 'Arial, sans-serif',
          maxWidth: '600px',
          margin: '50px auto',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '16px' }}>
            🚨 Firebase Connection Error
          </h2>
          <p style={{ color: '#7f1d1d', marginBottom: '16px' }}>
            Unable to connect to Firebase services. This could be due to:
          </p>
          <ul style={{ color: '#7f1d1d', marginBottom: '16px' }}>
            <li>Internet connectivity issues</li>
            <li>Firebase emulators not running (in development)</li>
            <li>Incorrect Firebase configuration</li>
            <li>Firewall blocking Firebase connections</li>
          </ul>
          <p style={{ color: '#7f1d1d' }}>
            <strong>For development:</strong> Run <code>firebase emulators:start --only firestore,storage</code>
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry Connection
          </button>
        </div>
      </React.StrictMode>
    );
  }
};

// Initialize the application
initializeApp();