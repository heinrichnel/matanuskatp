import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore';
import { firebaseApp } from '../firebaseConfig';


// Initialize Firestore
export const firestore = getFirestore(firebaseApp);

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

let connectionStatus: ConnectionStatus = 'connecting';
let connectionError: Error | null = null;
let connectionListeners: ((status: ConnectionStatus, error?: Error | null) => void)[] = [];
let emulatorConnected = false;
let networkRetryCount = 0;
const MAX_RETRY_ATTEMPTS = 3;

// --- HEALTH CHECK HELPERS (leave as-is) ---
const checkEmulatorHealth = async (host: string = '127.0.0.1', port: number = 8081): Promise<boolean> => {
  try {
    // We don't need the response as we're just checking if the request succeeds
    await fetch(`http://${host}:${port}`, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache',
    });
    return true;
  } catch (error) {
    console.warn(`⚠️ Emulator health check failed: ${error}`);
    return false;
  }
};

// --- CONNECT TO EMULATOR (keep fallback, don't break prod) ---
export const connectToEmulator = async (): Promise<boolean> => {
  if (!import.meta.env.DEV || emulatorConnected) {
    return emulatorConnected;
  }

  try {
    console.log('🔄 Checking Firestore emulator availability...');
    const emulatorAvailable = await checkEmulatorHealth();
    if (!emulatorAvailable) {
      console.warn('⚠️ Firestore emulator is not accessible on 127.0.0.1:8081');
      setConnectionStatus('connected'); // Continue to prod
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
    if (error instanceof Error && error.message.includes('already')) {
      emulatorConnected = true;
      setConnectionStatus('connected');
      return true;
    }
    setConnectionStatus('connected');
    return false;
  }
};

// --- STATUS MANAGEMENT ---
export const setConnectionStatus = (status: ConnectionStatus, error?: Error | null) => {
  connectionStatus = status;
  connectionError = error || null;
  connectionListeners.forEach(listener => listener(status, error));
  if (status === 'connected') {
    console.log('✅ Connected to Firestore');
  } else if (status === 'disconnected') {
    console.warn('⚠️ Disconnected from Firestore - operating in offline mode');
  } else if (status === 'error') {
    console.error('❌ Firestore connection error:', error);
  }
};

export const onConnectionStatusChanged = (
  callback: (status: ConnectionStatus, error?: Error | null) => void
): (() => void) => {
  connectionListeners.push(callback);
  callback(connectionStatus, connectionError);
  return () => {
    connectionListeners = connectionListeners.filter(listener => listener !== callback);
  };
};

export const getConnectionStatus = (): { status: ConnectionStatus; error: Error | null } => {
  return { status: connectionStatus, error: connectionError };
};

// --- INITIALIZE MONITORING ---
export const initializeConnectionMonitoring = async () => {
  console.log('🔄 Initializing Firestore connection monitoring...');
  startConnectionHealthMonitor();

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

  if (!navigator.onLine) {
    setConnectionStatus('disconnected');
    return;
  }

  // Try emulator, but doesn't error if fails
  const emulatorConnected = await connectToEmulator();
  if (!emulatorConnected && import.meta.env.DEV) {
    console.info('📡 Emulator not connected - using production Firebase');
  }

  if (navigator.onLine) {
    setConnectionStatus('connected');
  }
};

export const attemptReconnect = async (): Promise<boolean> => {
  if (connectionStatus === 'connected') {
    return true;
  }
  setConnectionStatus('connecting');
  try {
    if (!navigator.onLine) {
      setConnectionStatus('disconnected');
      return false;
    }
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
    setConnectionStatus('connected');
    return true;
  } catch (error) {
    setConnectionStatus('error', error as Error);
    return false;
  }
};

// --- IMPROVED ERROR HANDLING (robust against 'transport' issues) ---
export const handleFirestoreError = async (error: any): Promise<void> => {
  console.warn('🔄 Firestore operation failed, analyzing error:', error);

  // WebChannel-specific & network retry logic
  if (
    error?.code === 'unavailable' ||
    error?.message?.includes('transport errored') ||
    error?.message?.includes('WebChannelConnection') ||
    error?.message?.includes('RPC') ||
    error?.message?.includes('Stream') ||
    error?.message?.includes('Deadline') ||
    error?.message?.toLowerCase().includes('network')
  ) {
    networkRetryCount++;
    console.warn(`⚠️ Network error detected (attempt ${networkRetryCount}/${MAX_RETRY_ATTEMPTS})`);

    if (networkRetryCount <= MAX_RETRY_ATTEMPTS) {
      console.log('🔄 Attempting automatic retry in 2 seconds...');
      try {
        await disableNetwork(firestore);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await enableNetwork(firestore);
        setConnectionStatus('connected');
        networkRetryCount = 0;
        console.log('✅ Network reconnection successful');
      } catch (retryError) {
        console.error('❌ Network reconnection failed:', retryError);
        setConnectionStatus('error', retryError as Error);
      }
    } else {
      console.error('❌ Max retry attempts reached, switching to offline mode');
      setConnectionStatus('disconnected', error);
      networkRetryCount = 0;
    }
  } else {
    setConnectionStatus('error', error);
  }
};

// --- CONNECTION HEALTH MONITOR ---
export const startConnectionHealthMonitor = () => {
  console.log('🔍 Starting Firestore connection health monitor...');
  window.addEventListener('online', () => {
    console.log('🌐 Network connection restored');
    networkRetryCount = 0;
    setConnectionStatus('connected');
  });
  window.addEventListener('offline', () => {
    console.log('📡 Network connection lost');
    setConnectionStatus('disconnected');
  });
  setInterval(async () => {
    if (connectionStatus === 'error' && navigator.onLine) {
      console.log('🔄 Periodic health check: attempting reconnection...');
      await attemptReconnect();
    }
  }, 30000);
};

export default firestore;
