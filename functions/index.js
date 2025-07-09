import { setGlobalOptions } from "firebase-functions/v2";
import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

// Import enhanced TypeScript webhook implementations
import {
  enhancedDriverBehaviorWebhook,
} from "./enhanced-driver-behavior-webhook";
import { enhancedWebBookImport } from "./enhanced-webbook-import";

// Register webhook URLs (should ideally be in environment variables)
const WEBHOOK_URLS = {
  DRIVER_BEHAVIOR:
    process.env.DRIVER_BEHAVIOR_WEBHOOK_URL ||
    "https://script.google.com/macros/s/AKfycbx2LuGtG7E8XYNafq37D0JK4SfYYUqGrOnXgpLOsWF1uNYoOlErqaiAYGf7vsCKKLTWJA/exec",
  TRIPS_WEBBOOK:
    process.env.TRIPS_WEBBOOK_WEBHOOK_URL ||
    "https://script.google.com/macros/s/AKfycbx6R9oVjDYKkCitLNRXH42NcwzNnGETWWSk4Bl87We98fzWcz8uDWIF7h5zFbbda3A/exec",
};

// Initialize Firebase only if not already initialized
try {
  admin.initializeApp();
} catch (e) {
  console.log("Firebase already initialized");
}

const httpsOpts = { maxInstances: 10 };
setGlobalOptions({ maxInstances: 10 });

// =============================================
// EXPORT ENHANCED WEBHOOK IMPLEMENTATIONS
// =============================================

export const importDriverBehaviorWebhook = enhancedDriverBehaviorWebhook;
export const importTripsFromWebBook = enhancedWebBookImport;

// Telematics trip update webhook
export const telematicsTripUpdateWebhook = onRequest(httpsOpts, async (req, res) => {
  try {
    console.log("[telematicsTripUpdateWebhook] Received request:", JSON.stringify(req.body, null, 2));
    const { tripId, status, timestamp, driverId, vehicleId, location, endLocation } = req.body;
    if (!tripId || !status) {
      res.status(400).json({ error: "Missing required fields: tripId and status" });
      return;
    }
    const tripRef = admin.firestore().collection("trips").doc(String(tripId));
    const updateData = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };

    if (status === "trip_started") {
      if (!driverId || !vehicleId || !location) {
        res.status(400).json({ error: "Missing required fields for trip_started status" });
        return;
      }
      const timestampISO = new Date(timestamp).toISOString();
      Object.assign(updateData, {
        startedAt: timestampISO,
        driverId,
        vehicleId,
        startLocation: location,
        shippedStatus: true,
        shippedDate: timestampISO,
        status: "active",
      });
    } else if (status === "trip_ended") {
      if (!endLocation) {
        res.status(400).json({ error: "Missing required field endLocation for trip_ended status" });
        return;
      }
      const timestampISO = new Date(timestamp).toISOString();
      Object.assign(updateData, {
        endedAt: timestampISO,
        endLocation,
        deliveredStatus: true,
        deliveredDate: timestampISO,
        status: "completed",
      });
    } else {
      updateData.lastUpdated = new Date(timestamp).toISOString();
    }

    console.log(`[telematicsTripUpdateWebhook] Updating trip ${tripId} with status ${status}`, updateData);
    await tripRef.set(updateData, { merge: true });
    res.status(200).json({
      message: `Trip ${tripId} updated with status: ${status}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[telematicsTripUpdateWebhook] Error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Internal server error" });
  }
});

// Import Driver Behavior Events from Web Book (automatic sync)
export const importDriverEventsFromWebBook = onSchedule(
  {
    schedule: "every 5 minutes",
    maxInstances: 1,
  },
  async () => {
    try {
      const fetch = (await import("node-fetch")).default;
      const response = await fetch(WEBHOOK_URLS.DRIVER_BEHAVIOR);
      if (!response.ok) throw new Error("Failed to fetch from Driver Behavior Web Book");
      const events = await response.json();
      const db = admin.firestore();
      let imported = 0;
      let skipped = 0;
      for (const event of events) {
        if (!event || event.eventType === "UNKNOWN" || !event.id) {
          skipped++;
          continue;
        }
        const existing = await db
          .collection("driverBehaviorEvents")
          .where("id", "==", event.id)
          .limit(1)
          .get();
        if (!existing.empty) {
          skipped++;
          continue;
        }
        await db.collection("driverBehaviorEvents").add(event);
        imported++;
      }
      console.log(`DriverBehavior Sync: Imported ${imported}, Skipped ${skipped}`);
    } catch (error) {
      console.error("[importDriverEventsFromWebBook] Error:", error);
    }
  },
);

// Manual trigger for driver behavior events import
export const manualImportDriverEvents = onRequest(httpsOpts, async (req, res) => {
  try {
    const result = await importDriverEventsFromWebBookLogic();
    res.status(200).json(result);
  } catch (error) {
    console.error("[manualImportDriverEvents] Error:", error);
    res.status(500).json({
      error: "Import failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

async function importDriverEventsFromWebBookLogic() {
  const fetch = (await import("node-fetch")).default;
  const response = await fetch(WEBHOOK_URLS.DRIVER_BEHAVIOR);
  if (!response.ok) throw new Error("Failed to fetch from Driver Behavior Web Book");
  const events = await response.json();
  const db = admin.firestore();
  let imported = 0;
  let skipped = 0;
  for (const event of events) {
    if (!event || event.eventType === "UNKNOWN" || !event.id) {
      skipped++;
      continue;
    }
    const existing = await db
      .collection("driverBehaviorEvents")
      .where("id", "==", event.id)
      .limit(1)
      .get();
    if (!existing.empty) {
      skipped++;
      continue;
    }
    await db.collection("driverBehaviorEvents").add(event);
    imported++;
  }
  console.log(`DriverBehavior Sync: Imported ${imported}, Skipped ${skipped}`);
  return { imported, skipped };
}

// Manual trigger for trips import
export const manualImportTrips = onRequest(httpsOpts, async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(WEBHOOK_URLS.TRIPS_WEBBOOK);
    if (!response.ok) throw new Error("Failed to fetch from Google Sheets Web App");
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
      const existing = await db.collection("trips").where("loadRef", "==", loadRef).limit(1).get();
      if (!existing.empty) {
        skipped++;
        continue;
      }
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
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection("trips").doc(loadRef).set(processedTrip);
      imported++;
    }
    res.status(200).json({
      imported,
      skipped,
      message: `Manual import completed. Imported: ${imported}, Skipped: ${skipped}`,
    });
  } catch (error) {
    console.error("[manualImportTrips] Error:", error);
    res.status(500).json({
      error: "Import failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Manual import endpoint for driver behavior events (can be triggered from the UI)
export const manualImportDriverBehavior = onRequest(httpsOpts, async (req, res) => {
  try {
    // Use enhanced TypeScript webhook implementation directly
    const mockRequest = {
      body: { events: [] },
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-source": "manual-trigger",
        "x-request-id": `manual-${Date.now()}`,
      },
      get(header) {
        const normalizedHeader = header.toLowerCase();
        return (
          Object.keys(this.headers).find(
            (key) => key.toLowerCase() === normalizedHeader,
          ) || undefined
        );
      },
      params: {},
      query: {},
      url: "",
      path: "",
      ip: "",
      protocol: "",
      secure: false,
      cookies: {},
      rawBody: Buffer.from(JSON.stringify({ events: [] })),
    };

    let responseStatus = 200;
    let responseData = {};
    const mockResponse = {
      status: (code) => {
        responseStatus = code;
        return mockResponse;
      },
      json: (data) => {
        responseData = data;
        return mockResponse;
      },
      set: () => mockResponse,
      send: () => mockResponse,
      end: () => mockResponse,
    };
    await enhancedDriverBehaviorWebhook(mockRequest, mockResponse);
    res.status(responseStatus).json({
      message: "Manual driver behavior import triggered",
      result: responseData,
    });
  } catch (error) {
    console.error("[manualImportDriverBehavior] Error:", error);
    res.status(500).json({
      error: "Failed to trigger import",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
