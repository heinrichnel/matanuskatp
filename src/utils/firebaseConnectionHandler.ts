import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { firebaseApp } from '../firebaseConfig';

// Initialize Firestore
export const firestore = getFirestore(firebaseApp);

// Connection status types
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

// Connection status state
let connectionStatus: ConnectionStatus = 'connecting';
let connectionError: Error | null = null;
let connectionListeners: ((status: ConnectionStatus, error?: Error | null) => void)[] = [];

/**
 * Connect to Firestore emulator in development mode
 */
export const connectToEmulator = () => {
  if (import.meta.env.DEV) {
    try {
      console.log('🔄 Connecting to Firestore emulator...');
      connectFirestoreEmulator(firestore, '127.0.0.1', 8081);
      console.log('✅ Connected to Firestore emulator');
    } catch (error) {
      console.error('❌ Failed to connect to Firestore emulator:', error);
      setConnectionStatus('error', error as Error);
    }
  }
};

/**
 * Set connection status and notify listeners
 */
export const setConnectionStatus = (status: ConnectionStatus, error?: Error | null) => {
  connectionStatus = status;
  connectionError = error || null;
  
  // Notify all listeners
  connectionListeners.forEach(listener => listener(status, error));
  
  // Log status changes
  if (status === 'connected') {
    console.log('✅ Connected to Firestore');
  } else if (status === 'disconnected') {
    console.warn('⚠️ Disconnected from Firestore - operating in offline mode');
  } else if (status === 'error') {
    console.error('❌ Firestore connection error:', error);
  }
};

/**
 * Subscribe to connection status changes
 * @returns Unsubscribe function
 */
export const onConnectionStatusChanged = (
  callback: (status: ConnectionStatus, error?: Error | null) => void
): (() => void) => {
  connectionListeners.push(callback);
  
  // Immediately call with current status
  callback(connectionStatus, connectionError);
  
  // Return unsubscribe function
  return () => {
    connectionListeners = connectionListeners.filter(listener => listener !== callback);
  };
};

/**
 * Get current connection status
 */
export const getConnectionStatus = (): { status: ConnectionStatus; error: Error | null } => {
  return { status: connectionStatus, error: connectionError };
};

/**
 * Initialize connection monitoring
 * This sets up listeners for online/offline status and Firestore connectivity
 */
export const initializeConnectionMonitoring = () => {
  // Listen for browser online/offline events
  window.addEventListener('online', () => {
    console.log('🌐 Browser reports online status');
    if (connectionStatus === 'disconnected') {
      setConnectionStatus('connecting');
    }
  });
  
  window.addEventListener('offline', () => {
    console.log('🌐 Browser reports offline status');
    setConnectionStatus('disconnected');
  });
  
  // Initial status based on navigator.onLine
  if (!navigator.onLine) {
    setConnectionStatus('disconnected');
  }
  
  // Connect to emulator in development mode
  connectToEmulator();
  
  // Set initial status to connected if we're online
  // In a real implementation, we would check Firestore connectivity here
  if (navigator.onLine && connectionStatus === 'connecting') {
    setConnectionStatus('connected');
  }
};

/**
 * Attempt to reconnect to Firestore
 * This is a manual reconnection attempt that can be triggered by the user
 */
export const attemptReconnect = async (): Promise<boolean> => {
  if (connectionStatus === 'connected') {
    return true; // Already connected
  }
  
  setConnectionStatus('connecting');
  
  try {
    // In a real implementation, we would perform a test query here
    // For now, we'll just simulate a connection attempt
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (navigator.onLine) {
      setConnectionStatus('connected');
      return true;
    } else {
      setConnectionStatus('disconnected');
      return false;
    }
  } catch (error) {
    setConnectionStatus('error', error as Error);
    return false;
  }
};

// Initialize connection monitoring
if (typeof window !== 'undefined') {
  initializeConnectionMonitoring();
}