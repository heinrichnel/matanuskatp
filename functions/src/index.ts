/**
 * Main entry point for Firebase Functions
 * Properly integrates all TypeScript and JavaScript webhooks
 * with consistent error handling and configuration
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

// Import enhanced TypeScript webhook implementations
import { enhancedDriverBehaviorWebhook } from "./enhanced-driver-behavior-webhook";
import { enhancedWebBookImport } from "./enhanced-webbook-import";

// Register webhook URLs - ideally should be in environment variables
const WEBHOOK_URLS = {
  DRIVER_BEHAVIOR: process.env.DRIVER_BEHAVIOR_WEBHOOK_URL || 
    'https://script.google.com/macros/s/AKfycbx2LuGtG7E8XYNafq37D0JK4SfYYUqGrOnXgpLOsWF1uNYoOlErqaiAYGf7vsCKKLTWJA/exec',
  TRIPS_WEBBOOK: process.env.TRIPS_WEBBOOK_WEBHOOK_URL || 
    'https://script.google.com/macros/s/AKfycbx6R9oVjDYKkCitLNRXH42NcwzNnGETWWSk4Bl87We98fzWcz8uDWIF7h5zFbbda3A/exec'
};

// Initialize Firebase (if not already initialized)
try {
  admin.initializeApp();
} catch (e) {
  console.log('Firebase already initialized');
}

// For cost control and performance, limit the number of instances
// This applies to v2 functions only
setGlobalOptions({ maxInstances: 10 });

// =============================================
// EXPORT ENHANCED WEBHOOK IMPLEMENTATIONS
// =============================================

// Enhanced Driver Behavior Webhook (TypeScript implementation)
export const importDriverBehaviorWebhook = enhancedDriverBehaviorWebhook;

// Enhanced WebBook Import Webhook (TypeScript implementation)
export const importTripsFromWebBook = enhancedWebBookImport;

// =============================================
// ADDITIONAL FUNCTIONS & LEGACY SUPPORT
// =============================================

// Telematics trip update webhook
export const telematicsTripUpdateWebhook = functions.https.onRequest(async (req, res) => {
  try {
    console.log("[telematicsTripUpdateWebhook] Received request:", JSON.stringify(req.body, null, 2));
    
    const { tripId, status, timestamp, driverId, vehicleId, location, endLocation } = req.body;
    
    if (!tripId || !status) {
      return res.status(400).json({ error: 'Missing required fields: tripId and status' });
    }
    
    const tripRef = admin.firestore().collection('trips').doc(String(tripId));
    
    const updateData = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    
    if (status === 'trip_started') {
      if (!driverId || !vehicleId || !location) {
        return res.status(400).json({ error: 'Missing required fields for trip_started status' });
      }
      
      const timestampISO = new Date(timestamp).toISOString();
      updateData.startedAt = timestampISO;
      updateData.driverId = driverId;
      updateData.vehicleId = vehicleId;
      updateData.startLocation = location;
      updateData.shippedStatus = true;
      updateData.shippedDate = timestampISO;
      updateData.status = 'active';
    } else if (status === 'trip_ended') {
      if (!endLocation) {
        return res.status(400).json({ error: 'Missing required field endLocation for trip_ended status' });
      }
      
      const timestampISO = new Date(timestamp).toISOString();
      updateData.endedAt = timestampISO;
      updateData.endLocation = endLocation;
      updateData.deliveredStatus = true;
      updateData.deliveredDate = timestampISO;
      updateData.status = 'completed';
    } else {
      updateData.lastUpdated = new Date(timestamp).toISOString();
    }
    
    console.log(`[telematicsTripUpdateWebhook] Updating trip ${tripId} with status ${status}`, updateData);
    await tripRef.set(updateData, { merge: true });
    
    return res.status(200).json({
      message: `Trip ${tripId} updated with status: ${status}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[telematicsTripUpdateWebhook] Error:", error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

// Import Driver Behavior Events from Web Book (automatic sync)
export const importDriverEventsFromWebBook = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(WEBHOOK_URLS.DRIVER_BEHAVIOR);
    
    if (!response.ok) throw new Error('Failed to fetch from Driver Behavior Web Book');
    
    const events = await response.json();
    const db = admin.firestore();
    let imported = 0;
    let skipped = 0;
    
    for (const event of events) {
      if (!event || event.eventType === 'UNKNOWN' || !event.id) {
        skipped++;
        continue;
      }
      
      // Check for duplicate by event.id
      const existing = await db.collection('driverBehaviorEvents').where('id', '==', event.id).limit(1).get();
      if (!existing.empty) {
        skipped++;
        continue;
      }
      
      await db.collection('driverBehaviorEvents').add(event);
      imported++;
    }
    
    console.log(`DriverBehavior Sync: Imported ${imported}, Skipped ${skipped}`);
    return { imported, skipped };
  } catch (error) {
    console.error("[importDriverEventsFromWebBook] Error:", error);
    throw new Error(error instanceof Error ? error.message : 'Unknown error');
  }
});

// Manual trigger for driver behavior events import
export const manualImportDriverEvents = functions.https.onRequest(async (req, res) => {
  try {
    const result = await importDriverEventsFromWebBook.run();
    res.status(200).json(result);
  } catch (error) {
    console.error("[manualImportDriverEvents] Error:", error);
    res.status(500).json({ 
      error: 'Import failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Manual trigger for trips import
export const manualImportTrips = functions.https.onRequest(async (req, res) => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(WEBHOOK_URLS.TRIPS_WEBBOOK);
    
    if (!response.ok) throw new Error('Failed to fetch from Google Sheets Web App');
    
    const trips = await response.json();
    const db = admin.firestore();
    let imported = 0;
    let skipped = 0;
    
    for (const trip of trips) {
      const loadRef = trip.loadRef || trip.id;
      if (!loadRef) {
        skipped++;
        continue;
      }
      
      // Check for duplicate by loadRef
      const existing = await db.collection('trips').where('loadRef', '==', loadRef).limit(1).get();
      if (!existing.empty) {
        skipped++;
        continue;
      }
      
      // Process the trip data
      const processedTrip = {
        id: trip.id || loadRef,
        fleetNumber: trip.fleetNumber || "",
        driverName: trip.driverName || "",
        clientType: trip.clientType || "external",
        clientName: trip.clientName || "",
        loadRef: loadRef,
        route: trip.route || "",
        startDate: trip.shippedDate || new Date().toISOString(),
        endDate: trip.deliveredDate || new Date().toISOString(),
        status: "active",
        baseRevenue: 0,
        revenueCurrency: "ZAR",
        costs: [],
        additionalCosts: [],
        followUpHistory: [],
        paymentStatus: "unpaid",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await db.collection('trips').doc(loadRef).set(processedTrip);
      imported++;
    }
    
    res.status(200).json({ 
      imported, 
      skipped,
      message: `Manual import completed. Imported: ${imported}, Skipped: ${skipped}`
    });
  } catch (error) {
    console.error("[manualImportTrips] Error:", error);
    res.status(500).json({ 
      error: 'Import failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Manual import endpoint for driver behavior events (can be triggered from the UI)
export const manualImportDriverBehavior = functions.https.onRequest(async (req, res) => {
  try {
    // Use our enhanced TypeScript webhook implementation directly
    const payload = { events: [] };
    
    // Create a mock request/response object to pass to the webhook
    const mockReq = {
      body: payload,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-source': 'manual-trigger',
        'x-request-id': `manual-${Date.now()}`
      }
    };
    
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          // Return the response from the webhook 
          res.status(code).json({
            message: 'Manual driver behavior import triggered',
            result: data
          });
        }
      }),
      set: () => mockRes
    };
    
    // Directly call the enhanced webhook implementation
    await importDriverBehaviorWebhook(mockReq, mockRes);
    
  } catch (error) {
    console.error('[manualImportDriverBehavior] Error:', error);
    res.status(500).json({
      error: 'Failed to trigger import',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Remove the duplicate importTripsWebhook function to avoid conflicts
// Now using the enhanced TypeScript implementation via importTripsFromWebBook
