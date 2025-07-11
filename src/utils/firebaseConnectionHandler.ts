import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { firebaseApp } from '../firebaseConfig';

// Initialize Firestore
export const firestore = getFirestore(firebaseApp);

// Connection status types
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

// Connection status state
let connectionStatus: ConnectionStatus = 'connecting';
let connectionError: Error | null = null;
let connectionListeners: ((status: ConnectionStatus, error?: Error | null) => void)[] = [];
let emulatorConnected = false;
let networkRetryCount = 0;
const MAX_RETRY_ATTEMPTS = 3;

/**
 * Check if emulator is accessible
 */
const checkEmulatorHealth = async (host: string = '127.0.0.1', port: number = 8081): Promise<boolean> => {
  try {
    const response = await fetch(`http://${host}:${port}`, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache',
    });
    // With no-cors mode, we can't check response.ok, but if fetch succeeds, emulator is accessible
    return true;
  } catch (error) {
    console.warn(`⚠️ Emulator health check failed: ${error}`);
    return false;
  }
};

/**
 * Connect to Firestore emulator in development mode
 */
export const connectToEmulator = async (): Promise<boolean> => {
  if (!import.meta.env.DEV || emulatorConnected) {
    return emulatorConnected;
  }

  try {
    console.log('🔄 Checking Firestore emulator availability...');
    
    // First check if emulator is running
    const emulatorAvailable = await checkEmulatorHealth();
    
    if (!emulatorAvailable) {
      console.warn('⚠️ Firestore emulator is not accessible on 127.0.0.1:8081');
      console.warn('💡 Please ensure the emulator is running: firebase emulators:start --only firestore');
      console.warn('🔧 Continuing with production Firebase configuration');
      setConnectionStatus('connected'); // Allow app to continue with production Firebase
      return false;
    }

    console.log('🔄 Connecting to Firestore emulator...');
    connectFirestoreEmulator(firestore, '127.0.0.1', 8081);
    emulatorConnected = true;
    console.log('✅ Connected to Firestore emulator');
    setConnectionStatus('connected');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Firestore emulator:', error);
    
    // Check if this is a "already connected" error
    if (error instanceof Error && error.message.includes('already')) {
      console.log('📍 Firestore emulator connection already established');
      emulatorConnected = true;
      setConnectionStatus('connected');
      return true;
    }
    
    console.warn('🔧 Emulator connection failed, continuing with production Firebase');
    setConnectionStatus('connected'); // Allow app to continue with production Firebase
    return false;
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
export const initializeConnectionMonitoring = async () => {
  console.log('🔄 Initializing Firestore connection monitoring...');
  
  // Start health monitoring
  startConnectionHealthMonitor();
  
  // Listen for browser online/offline events
  window.addEventListener('online', () => {
    console.log('🌐 Browser reports online status');
    if (connectionStatus === 'disconnected') {
      setConnectionStatus('connecting');
      attemptReconnect();
    }
  });
  
  window.addEventListener('offline', () => {
    console.log('🌐 Browser reports offline status');
    setConnectionStatus('disconnected');
  });
  
  // Initial status based on navigator.onLine
  if (!navigator.onLine) {
    setConnectionStatus('disconnected');
    return;
  }
  
  // Connect to emulator in development mode
  const emulatorConnected = await connectToEmulator();
  
  if (!emulatorConnected && import.meta.env.DEV) {
    console.info('📡 Emulator not connected - using production Firebase');
    console.info('💡 To use emulator, run: firebase emulators:start --only firestore,storage');
  }
  
  // Set status to connected if we're online (regardless of emulator status)
  if (navigator.onLine) {
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
    // Check if we're online
    if (!navigator.onLine) {
      setConnectionStatus('disconnected');
      return false;
    }
    
    // In development, try to reconnect to emulator
    if (import.meta.env.DEV) {
      const emulatorConnected = await connectToEmulator();
      if (emulatorConnected) {
        setConnectionStatus('connected');
        return true;
      } else {
        setConnectionStatus('error', new Error('Failed to connect to Firestore emulator'));
        return false;
      }
    }
    
    // For production, assume connection is working if online
    setConnectionStatus('connected');
    return true;
    
  } catch (error) {
    setConnectionStatus('error', error as Error);
    return false;
  }
};

/**
 * Handle network-related Firestore errors with retry logic
 */
export const handleFirestoreError = async (error: any): Promise<void> => {
  console.warn('🔄 Firestore operation failed, analyzing error:', error);
  
  // Check if it's a network-related error
  if (error?.code === 'unavailable' || 
      error?.message?.includes('transport errored') ||
      error?.message?.includes('WebChannelConnection') ||
      error?.message?.includes('RPC')) {
    
    networkRetryCount++;
    console.warn(`⚠️ Network error detected (attempt ${networkRetryCount}/${MAX_RETRY_ATTEMPTS})`);
    
    if (networkRetryCount <= MAX_RETRY_ATTEMPTS) {
      console.log('🔄 Attempting automatic retry in 2 seconds...');
      
      // Disable and re-enable network to force reconnection
      try {
        await disableNetwork(firestore);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await enableNetwork(firestore);
        
        setConnectionStatus('connected');
        networkRetryCount = 0; // Reset on successful reconnection
        console.log('✅ Network reconnection successful');
      } catch (retryError) {
        console.error('❌ Network reconnection failed:', retryError);
        setConnectionStatus('error', retryError as Error);
      }
    } else {
      console.error('❌ Max retry attempts reached, switching to offline mode');
      setConnectionStatus('disconnected', error);
      networkRetryCount = 0; // Reset counter
    }
  } else {
    // Not a network error, handle normally
    setConnectionStatus('error', error);
  }
};

/**
 * Monitor Firestore connection health
 */
export const startConnectionHealthMonitor = () => {
  console.log('🔍 Starting Firestore connection health monitor...');
  
  // Monitor online/offline status
  window.addEventListener('online', () => {
    console.log('🌐 Network connection restored');
    networkRetryCount = 0;
    setConnectionStatus('connected');
  });
  
  window.addEventListener('offline', () => {
    console.log('📡 Network connection lost');
    setConnectionStatus('disconnected');
  });
  
  // Periodic health check (every 30 seconds)
  setInterval(async () => {
    if (connectionStatus === 'error' && navigator.onLine) {
      console.log('🔄 Periodic health check: attempting reconnection...');
      await attemptReconnect();
    }
  }, 30000);
};

// Export the initialized firestore instance
export default firestore;