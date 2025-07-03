/**
 * Main entry point for Firebase Functions
 * Properly integrates all TypeScript and JavaScript webhooks
 * with consistent error handling and configuration
 */

import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest, HttpsOptions } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

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

// Common configuration for HTTP functions
const httpsOpts: HttpsOptions = {
  maxInstances: 10
};

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

// Define TripUpdateData interface to fix property errors
interface TripUpdateData {
  updatedAt: admin.firestore.FieldValue;
  startedAt?: string;
  driverId?: string;
  vehicleId?: string;
  startLocation?: any;
  shippedStatus?: boolean;
  shippedDate?: string;
  status?: string;
  endedAt?: string;
  endLocation?: any;
  deliveredStatus?: boolean;
  deliveredDate?: string;
  lastUpdated?: string;
}

// Telematics trip update webhook
export const telematicsTripUpdateWebhook = onRequest(httpsOpts, async (req, res) => {
  try {
    console.log("[telematicsTripUpdateWebhook] Received request:", JSON.stringify(req.body, null, 2));
    
    const { tripId, status, timestamp, driverId, vehicleId, location, endLocation } = req.body;
    
    if (!tripId || !status) {
      res.status(400).json({ error: 'Missing required fields: tripId and status' });
      return;
    }
    
    const tripRef = admin.firestore().collection('trips').doc(String(tripId));
    
    const updateData: TripUpdateData = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    
    if (status === 'trip_started') {
      if (!driverId || !vehicleId || !location) {
        res.status(400).json({ error: 'Missing required fields for trip_started status' });
        return;
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
        res.status(400).json({ error: 'Missing required field endLocation for trip_ended status' });
        return;
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
    
    res.status(200).json({
      message: `Trip ${tripId} updated with status: ${status}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[telematicsTripUpdateWebhook] Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error' });
  }
});

// Import Driver Behavior Events from Web Book (automatic sync)
export const importDriverEventsFromWebBook = onSchedule({
  schedule: 'every 5 minutes',
  maxInstances: 1
}, async (event) => {
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
    // Don't return a value to comply with void | Promise<void> return type
  } catch (error) {
    console.error("[importDriverEventsFromWebBook] Error:", error);
    // Don't rethrow, just log the error to comply with void return type
    console.error(error instanceof Error ? error.message : 'Unknown error');
  }
});

// Manual trigger for driver behavior events import
export const manualImportDriverEvents = onRequest(httpsOpts, async (req, res) => {
  try {
    // In V2, we need to manually call the scheduled function logic
    // Store the result in a variable to return to the client, but don't return from the scheduled function
    const result = await importDriverEventsFromWebBookLogic();
    res.status(200).json(result);
  } catch (error) {
    console.error("[manualImportDriverEvents] Error:", error);
    res.status(500).json({
      error: 'Import failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Extracted function logic to be reused
async function importDriverEventsFromWebBookLogic() {
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
}

// Manual trigger for trips import
export const manualImportTrips = onRequest(httpsOpts, async (req, res) => {
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
export const manualImportDriverBehavior = onRequest(httpsOpts, async (req, res) => {
  try {
    // Use our enhanced TypeScript webhook implementation directly
    // Create a proper Express Request-compatible object
    const mockRequest = {
      body: { events: [] },
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-source': 'manual-trigger',
        'x-request-id': `manual-${Date.now()}`
      },
      // We'll define get function separately for type safety
      get: function(header: string): string | undefined {
        return undefined; // Placeholder, will be replaced below
      },
      // Add necessary properties to satisfy Request type
      params: {},
      query: {},
      url: '',
      path: '',
      ip: '',
      protocol: '',
      secure: false,
      cookies: {},
      rawBody: Buffer.from(JSON.stringify({ events: [] }))
    };
    
    // Define type-safe headers with proper lookup support
    const headers = mockRequest.headers as Record<string, string>;
    
    // Implement the get method with proper case-insensitive lookup
    mockRequest.get = function(header: string): string | undefined {
      const normalizedHeader = header.toLowerCase();
      // Case-insensitive lookup for headers
      return Object.keys(headers).find(
        key => key.toLowerCase() === normalizedHeader
      ) ? headers[Object.keys(headers).find(
          key => key.toLowerCase() === normalizedHeader
        ) as string] : undefined;
    };
    
    // Use a temporary response for capturing output
    let responseStatus = 200;
    let responseData = {};
    
    const mockResponse = {
      status: (code: number) => {
        responseStatus = code;
        return mockResponse;
      },
      json: (data: any) => {
        responseData = data;
        return mockResponse;
      },
      set: () => mockResponse,
      send: () => mockResponse,
      end: () => mockResponse
    };
    
    // Call the enhanced webhook implementation
    await enhancedDriverBehaviorWebhook(mockRequest as any, mockResponse as any);
    
    // Return the response that was captured
    res.status(responseStatus).json({
      message: 'Manual driver behavior import triggered',
      result: responseData
    });
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
