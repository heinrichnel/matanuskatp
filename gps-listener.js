// GPS Listener for multiple fleet vehicles
// Listens on TCP port 22334 and writes location data to Firestore

import net from 'net';
import fs from 'fs';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Initialize Firebase
let admin;
let db;

try {
  admin = await import('firebase-admin');
  
  // Check if serviceAccountKey.json exists
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
  
  if (fs.existsSync(serviceAccountPath)) {
    // Production mode - use service account
    const serviceAccount = require(serviceAccountPath);
    admin.default.initializeApp({
      credential: admin.default.credential.cert(serviceAccount)
    });
    console.log('Running in production mode with service account authentication');
  } else {
    // Development mode - use emulators
    admin.default.initializeApp({
      projectId: 'transportmat-dev'
    });
    
    // Connect to Firestore emulator if available
    const FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8081';
    process.env.FIRESTORE_EMULATOR_HOST = FIRESTORE_EMULATOR_HOST;
    
    console.log(`Running in development mode with emulator at ${FIRESTORE_EMULATOR_HOST}`);
    console.log('IMPORTANT: For production deployment, create a serviceAccountKey.json file in this directory.');
  }
  
  db = admin.default.firestore();
} catch (error) {
  console.error('Firebase initialization error:', error);
  console.log('GPS data will be logged but not stored in Firestore');
  // Continue without Firebase to at least log data
}

// Map device IDs to fleet numbers
const deviceFleetMap = {
  '864454079845115': '32H',
  '864454077925646': '31H'
};

// --- GPS Protocol Parser ---
function parseGpsData(raw) {
  // For demo: log the raw buffer
  console.log('Raw data:', raw.toString('hex'));
  
  // Extract device ID from the data
  // NOTE: This is a placeholder. You must implement the actual protocol parsing
  // based on your GPS device specifications
  
  // For demo purposes, we'll fake extracting a device ID
  // In a real implementation, you would parse the device ID from the raw data
  let deviceId;
  
  // Check if data contains either of our known device IDs
  // In a real implementation, you would extract this from the protocol
  const data = raw.toString();
  for (const id of Object.keys(deviceFleetMap)) {
    if (data.includes(id)) {
      deviceId = id;
      break;
    }
  }
  
  // If no known device ID is found, use a fallback for testing
  deviceId = deviceId || '864454079845115';
  
  const fleetNumber = deviceFleetMap[deviceId] || 'Unknown';
  
  // Return parsed data
  // In a real implementation, you would extract all these values from the protocol
  return {
    deviceId: deviceId,
    fleetNumber: fleetNumber,
    lat: -26.2041, // Example: Johannesburg
    lng: 28.0473,
    speed: 60,
    timestamp: new Date().toISOString()
  };
}
// -----------------------------------------------------

// Function to store GPS data in Firestore
async function storeGpsData(gps) {
  if (!db) {
    console.log('Firebase not initialized. Would store:', gps);
    return;
  }
  
  try {
    // Store by device ID
    await db.collection('gps_devices').doc(gps.deviceId).set(gps);
    
    // Also store in a fleet-specific collection for easier querying
    await db.collection('fleet_locations').doc(gps.fleetNumber).set({
      ...gps,
      lastUpdate: admin.default.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Location updated for fleet ${gps.fleetNumber} (Device: ${gps.deviceId}):`, gps);
  } catch (error) {
    console.error('Error storing GPS data in Firestore:', error);
  }
}

const server = net.createServer(socket => {
  console.log('New connection established');
  
  socket.on('data', async data => {
    try {
      const gps = parseGpsData(data);
      if (gps) {
        await storeGpsData(gps);
      }
    } catch (error) {
      console.error('Error processing GPS data:', error);
    }
  });
  
  socket.on('error', err => {
    console.error('Socket error:', err);
  });
  
  socket.on('close', () => {
    console.log('Connection closed');
  });
});

server.on('error', err => {
  console.error('Server error:', err);
});

// Start listening on specified port
const PORT = 22334;
const HOST = '0.0.0.0'; // Listen on all network interfaces

server.listen(PORT, HOST, () => {
  console.log(`GPS listener running on ${HOST}:${PORT}`);
  console.log('Tracking devices:');
  for (const [deviceId, fleetNumber] of Object.entries(deviceFleetMap)) {
    console.log(`- Fleet ${fleetNumber} (Device ID: ${deviceId})`);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down GPS listener...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});