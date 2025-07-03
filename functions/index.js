/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Define environment variables for WebBook URLs
// These should be set in your Firebase environment configuration
const WEB_BOOK_TRIPS_URL = process.env.WEB_BOOK_TRIPS_URL || "";
const WEB_BOOK_DRIVER_BEHAVIOR_URL = process.env.WEB_BOOK_DRIVER_BEHAVIOR_URL || "";

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// importTripsFromWebBook
export const importTripsFromWebBook = onCall(async (request) => {
  try {
    // DEBUG ONLY – remove after verification
    console.log("importTripsFromWebBook received payload:", JSON.stringify(request.data, null, 2));
    
    // Extract trips from the nested structure (request.data.trips) or from request.data if it's an array
    let trips = [];
    if (request.data && request.data.trips && Array.isArray(request.data.trips)) {
      // Structure: { trips: [...], meta: {...} }
      trips = request.data.trips;
      console.log(`Processing ${trips.length} trips from nested structure`);
    } else if (Array.isArray(request.data)) {
      // Backward compatibility: if request.data is directly an array
      trips = request.data;
      console.log(`Processing ${trips.length} trips from direct array`);
    }
    
    if (trips.length === 0) {
      console.error("Invalid or empty payload:", request.data);
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid or empty payload. Expected {trips: [...]} or direct array"
      );
    }
    
    if (trips.length > 0) {
      console.log("First row sample:", JSON.stringify(trips[0]));
    }

    const db = admin.firestore();
    const validTrips = [];
    let skippedExisting = 0;
    let skippedNoLoadRef = 0;

    for (const row of trips) {
      const [
        fleetNumber,
        driverName,
        clientType,
        clientName,
        loadRef,
        route,
        shippedStatus,
        shippedDate,
        deliveredStatus,
        deliveredDate,
      ] = row;

      if (!loadRef) {
        skippedNoLoadRef++;
        continue;
      }

      const existing = await db
        .collection("trips")
        .where("loadRef", "==", loadRef)
        .get();
      if (existing.empty) {
        const tripRef = db.collection("trips").doc();
        const newTrip = {
          id: tripRef.id,
          fleetNumber: fleetNumber || "",
          driverName: driverName || "",
          route: route || "",
          tripDescription: "",
          tripNotes: "",
          clientName: clientName || "",
          clientType: clientType || "",
          baseRevenue: 0,
          revenueCurrency: "ZAR",
          distanceKm: 0,
          startDate: shippedDate ? new Date(shippedDate).toISOString() : "",
          endDate: deliveredDate ? new Date(deliveredDate).toISOString() : "",
          status: deliveredDate ? "completed" : "active",
          paymentStatus: "unpaid",
          delayReasons: [],
          followUpHistory: [],
          additionalCosts: [],
          costs: [],
          loadRef: loadRef,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        validTrips.push({ ref: tripRef, data: newTrip });
      } else {
        skippedExisting++;
      }
    }

    if (validTrips.length > 0) {
      const batch = db.batch();
      validTrips.forEach((trip) => {
        batch.set(trip.ref, trip.data);
      });
      await batch.commit();
    }

    const summary = `Import summary: ${validTrips.length} new trips imported. ${skippedExisting} trips already exist. ${skippedNoLoadRef} rows skipped due to missing loadRef.`;
    console.log(summary);
    return { imported: validTrips.length, message: summary };
  } catch (error) {
    console.error("Error importing trips:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// scheduledImportTripsFromWebBook
export const scheduledImportTripsFromWebBook = functionsV1.pubsub
  .schedule("every 5 minutes")
  .onRun(async (context) => {
    if (!WEB_BOOK_TRIPS_URL) {
      console.error("WEB_BOOK_TRIPS_URL not set in environment variables.");
      return null;
    }
    try {
      console.log(`Fetching trips from: ${WEB_BOOK_TRIPS_URL}`);
      const response = await fetch(WEB_BOOK_TRIPS_URL, { method: "GET" });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Failed to fetch web book: ${response.status} ${response.statusText}`, { errorBody });
        throw new Error(`Failed to fetch web book: ${response.statusText}`);
      }
      const data = await response.json();
      
      // DEBUG ONLY – remove after verification
      console.log("Web book API response:", JSON.stringify(data, null, 2));
      
      // Handle both direct array and nested structure
      let trips = [];
      if (data && data.trips && Array.isArray(data.trips)) {
        // Structure: { trips: [...], meta: {...} }
        trips = data.trips;
        console.log(`Processing ${trips.length} trips from nested structure`);
      } else if (Array.isArray(data)) {
        // Backward compatibility: if response is directly an array
        trips = data;
        console.log(`Processing ${trips.length} trips from direct array`);
      } else {
        console.error("Web book response is not an array or doesn't contain trips array. Received:", data);
        throw new Error("Web book response is not an array or doesn't contain trips array");
      }
      
      console.log(`Received ${trips.length} rows from web book.`);
      if (trips.length > 0) {
        console.log("First row sample:", JSON.stringify(trips[0]));
      }

      const db = admin.firestore();
      const validTrips = [];
      let skippedExisting = 0;
      let skippedNoLoadRef = 0;

      for (const row of trips) {
        const [
          fleetNumber,
          driverName,
          clientType,
          clientName,
          loadRef,
          route,
          shippedStatus,
          shippedDate,
          deliveredStatus,
          deliveredDate,
        ] = row;

        if (!loadRef) {
          skippedNoLoadRef++;
          continue;
        }

        const existing = await db
          .collection("trips")
          .where("loadRef", "==", loadRef)
          .get();
        if (existing.empty) {
          const tripRef = db.collection("trips").doc();
          const newTrip = {
            id: tripRef.id,
            fleetNumber: fleetNumber || "",
            driverName: driverName || "",
            route: route || "",
            tripDescription: "",
            tripNotes: "",
            clientName: clientName || "",
            clientType: clientType || "",
            baseRevenue: 0,
            revenueCurrency: "ZAR",
            distanceKm: 0,
            startDate: shippedDate ? new Date(shippedDate).toISOString() : "",
            endDate: deliveredDate ? new Date(deliveredDate).toISOString() : "",
            status: deliveredDate ? "completed" : "active",
            paymentStatus: "unpaid",
            delayReasons: [],
            followUpHistory: [],
            additionalCosts: [],
            costs: [],
            loadRef: loadRef,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          };
          validTrips.push({ ref: tripRef, data: newTrip });
        } else {
          skippedExisting++;
        }
      }

      if (validTrips.length > 0) {
        const batch = db.batch();
        validTrips.forEach(trip => {
          batch.set(trip.ref, trip.data);
        });
        await batch.commit();
      }

      console.log(`Import summary: ${validTrips.length} new trips imported. ${skippedExisting} trips already exist. ${skippedNoLoadRef} rows skipped due to missing loadRef.`);
      return null;
    } catch (error) {
      console.error("Scheduled import error:", error);
      return null;
    }
  });

// importDriverBehaviorWebhook
export const importDriverBehaviorWebhook = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // DEBUG ONLY – remove after verification
  console.log("Driver behavior webhook received payload:", JSON.stringify(req.body, null, 2));

  // Extract events from the nested structure (req.body.events) or from req.body if it's an array
  let events = [];
  if (req.body && req.body.events && Array.isArray(req.body.events)) {
    // Structure: { events: [...], meta: {...} }
    events = req.body.events;
    console.log(`Processing ${events.length} events from nested structure`);
  } else if (Array.isArray(req.body)) {
    // Backward compatibility: if req.body is directly an array
    events = req.body;
    console.log(`Processing ${events.length} events from direct array`);
  }

  if (!events.length) {
    console.error("Invalid or empty payload:", req.body);
    res.status(400).send('Invalid or empty payload. Expected {events: [...]} or direct array');
    return;
  }

  // Log first event for debugging
  if (events.length > 0) {
    console.log("Sample event data:", JSON.stringify(events[0], null, 2));
  }

  const db = admin.firestore();
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  const errorDetails = [];

  try {
    for (const evt of events) {
      try {
        // Validate required fields
        const id = evt.id;
        if (!id || evt.eventType === 'UNKNOWN') {
          console.log(`Skipping event with invalid id or type: ${JSON.stringify(evt, null, 2)}`);
          skipped++;
          continue;
        }

        // Check for duplicates
        const ref = db.collection('driverBehavior').doc(id.toString());
        const snap = await ref.get();
        if (snap.exists) {
          console.log(`Skipping duplicate event with id: ${id}`);
          skipped++;
          continue;
        }

        // Save to Firestore with timestamp
        await ref.set({
          ...evt,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          importSource: 'webhook',
          importedAt: new Date().toISOString()
        });
        imported++;
      } catch (eventError) {
        // Handle individual event errors
        console.error(`Error processing event: ${eventError.message}`);
        errors++;
        errorDetails.push({
          message: eventError.message,
          eventId: evt.id || 'unknown'
        });
      }
    }

    // Send detailed response
    const response = {
      imported,
      skipped,
      errors,
      success: true,
      timestamp: new Date().toISOString(),
      total: events.length
    };
    
    console.log(`Driver behavior webhook processed: ${imported} imported, ${skipped} skipped, ${errors} errors`);
    res.status(200).send(response);
  } catch (error) {
    // Handle overall function errors
    console.error(`Critical error in importDriverBehaviorWebhook: ${error.message}`);
    res.status(500).send({
      success: false,
      error: error.message,
      imported,
      skipped,
      errors,
      errorDetails
    });
  }
});

// scheduledImportDriverBehaviorFromWebBook
export const scheduledImportDriverBehaviorFromWebBook = functionsV1.pubsub
  .schedule("every 5 minutes")
  .onRun(async (context) => {
    if (!WEB_BOOK_DRIVER_BEHAVIOR_URL) {
      console.error("WEB_BOOK_DRIVER_BEHAVIOR_URL not set in environment variables.");
      return null;
    }
    try {
      const response = await fetch(WEB_BOOK_DRIVER_BEHAVIOR_URL, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch driver behavior web book: ${response.statusText}`
        );
      }
      const events = await response.json();
      if (!Array.isArray(events)) {
        throw new Error("Driver behavior web book response is not an array");
      }
      const db = admin.firestore();
      let imported = 0;
      let skipped = 0;

      for (const row of events) {
        const [
          reportedAt = "",
          description = "",
          driverName = "",
          eventDate = "",
          eventTime = "",
          eventType = "",
          fleetNumber = "",
          location = "",
          severity = "",
          status = "pending",
          points = 0
        ] = row;

        if (!eventType || eventType === 'UNKNOWN') {
          skipped++;
          continue;
        }

        const uniqueId = `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const existing = await db
          .collection("driverBehavior")
          .where("id", "==", uniqueId)
          .limit(1)
          .get();

        if (!existing.empty) {
          skipped++;
          continue;
        }

        const eventRef = db.collection("driverBehavior").doc();
        const newEvent = {
          id: uniqueId,
          reportedAt: reportedAt ? new Date(reportedAt).toISOString() : new Date().toISOString(),
          description: description || "",
          driverName: driverName || "",
          eventDate: eventDate || "",
          eventTime: eventTime || "",
          eventType: eventType || "",
          fleetNumber: fleetNumber || "",
          location: location || "",
          severity: severity || "medium",
          status: status || "pending",
          points: Number(points) || 0,
          reportedBy: "WebBook Script",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await eventRef.set(newEvent);
        imported++;
      }

      console.log(
        `Imported ${imported} driver behavior events from web book, skipped ${skipped}.`
      );
      return { imported, skipped };
    } catch (error) {
      console.error("Scheduled driver behavior import error:", error);
      return null;
    }
  });

// importTripsWebhook
export const importTripsWebhook = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  // DEBUG ONLY – remove after verification
  console.log("Trips webhook received payload:", JSON.stringify(req.body, null, 2));

  // Extract trips from the nested structure (req.body.trips) or from req.body if it's an array
  let trips = [];
  if (req.body && req.body.trips && Array.isArray(req.body.trips)) {
    // Structure: { trips: [...], meta: {...} }
    trips = req.body.trips;
    console.log(`Processing ${trips.length} trips from nested structure`);
  } else if (Array.isArray(req.body)) {
    // Backward compatibility: if req.body is directly an array
    trips = req.body;
    console.log(`Processing ${trips.length} trips from direct array`);
  }

  if (!trips.length) {
    console.error("Invalid or empty payload:", req.body);
    res.status(400).send('Invalid or empty payload. Expected {trips: [...]} or direct array');
    return;
  }

  // Log first trip for debugging
  if (trips.length > 0) {
    console.log("Sample trip data:", JSON.stringify(trips[0], null, 2));
  }

  const db = admin.firestore();
  let imported = 0;
  let skipped = 0;
  let errors = 0;
  const errorDetails = [];

  try {
    for (const t of trips) {
      try {
        // Validate required ID field
        const id = t.loadRef || t.id;
        if (!id) {
          console.log(`Skipping trip with no ID or loadRef: ${JSON.stringify(t, null, 2)}`);
          skipped++;
          continue;
        }

        // Check for duplicates
        const ref = db.collection('trips').doc(id.toString());
        const snap = await ref.get();
        if (snap.exists) {
          console.log(`Skipping duplicate trip with id: ${id}`);
          skipped++;
          continue;
        }

        // Save to Firestore with timestamps
        await ref.set({
          ...t,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          importSource: 'webhook',
          importedAt: new Date().toISOString()
        });
        imported++;
      } catch (tripError) {
        // Handle individual trip errors
        console.error(`Error processing trip: ${tripError.message}`);
        errors++;
        errorDetails.push({
          message: tripError.message,
          tripId: t.loadRef || t.id || 'unknown'
        });
      }
    }

    // Send detailed response
    const response = {
      imported,
      skipped,
      errors,
      success: true,
      timestamp: new Date().toISOString(),
      total: trips.length
    };
    
    console.log(`Trips webhook processed: ${imported} imported, ${skipped} skipped, ${errors} errors`);
    res.status(200).send(response);
  } catch (error) {
    // Handle overall function errors
    console.error(`Critical error in importTripsWebhook: ${error.message}`);
    res.status(500).send({
      success: false,
      error: error.message,
      imported,
      skipped,
      errors,
      errorDetails
    });
  }
});

// importDriverBehaviorEventsFromWebhook
export const importDriverBehaviorEventsFromWebhook = onCall(async (request) => {
  try {
    // DEBUG ONLY – remove after verification
    console.log("importDriverBehaviorEventsFromWebhook received payload:", JSON.stringify(request.data, null, 2));
    
    const db = admin.firestore();
    let imported = 0;
    let skipped = 0;
    let invalid = 0;
    
    // Extract events from the nested structure (request.data.events) or from request.data if it's an array
    let events = [];
    if (request.data && request.data.events && Array.isArray(request.data.events)) {
      // Structure: { events: [...], meta: {...} }
      events = request.data.events;
      console.log(`Processing ${events.length} events from nested structure`);
    } else if (Array.isArray(request.data)) {
      // Backward compatibility: if request.data is directly an array
      events = request.data;
      console.log(`Processing ${events.length} events from direct array`);
    } else {
      console.error("Invalid or empty payload:", request.data);
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid or empty payload. Expected {events: [...]} or direct array"
      );
    }
    
    if (events.length === 0) {
      console.log("No events to process");
      return { imported: 0, skipped: 0, invalid: 0 };
    }
    
    // Log first event for debugging
    if (events.length > 0) {
      console.log("Sample event data:", JSON.stringify(events[0], null, 2));
    }

    // Process each event in the array
    for (const event of events) {
      // Validate required fields
      if (!event.driverName || !event.eventType || !event.eventDate) {
        console.log(`Skipping event with missing required fields: ${JSON.stringify(event)}`);
        invalid++;
        continue;
      }
      
      // Skip unknown event types
      if (event.eventType === 'UNKNOWN') {
        console.log(`Skipping event with UNKNOWN type: ${JSON.stringify(event)}`);
        skipped++;
        continue;
      }

      // Generate a consistent ID for deduplication if not provided
      const eventId = event.id || `${event.driverName}_${event.eventType}_${event.eventDate}_${Date.now()}`;
      
      // Check for duplicates in the driverBehaviorEvents collection
      const existing = await db
        .collection('driverBehaviorEvents')
        .where('driverName', '==', event.driverName)
        .where('eventType', '==', event.eventType)
        .where('eventDate', '==', event.eventDate)
        .limit(1)
        .get();

      if (!existing.empty) {
        console.log(`Skipping duplicate event: ${eventId}`);
        skipped++;
        continue;
      }

      // Create the document with a new ID
      const eventRef = db.collection('driverBehaviorEvents').doc();
      
      // Prepare the document with normalized data
      const eventDoc = {
        ...event,                                         // Keep all original fields
        id: eventId,                                      // Use our consistent ID
        fleetNumber: event.fleetNumber || "Unknown",      // Default fleet number
        score: typeof event.score === 'number' ? event.score : 0,  // Default score
        severity: event.severity || "medium",             // Default severity
        source: "webhook",                                // Mark the source
        importedAt: new Date().toISOString(),             // Track import time
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      // Write to Firestore
      await eventRef.set(eventDoc);
      imported++;
      
      if (imported % 10 === 0) {
        console.log(`Progress: ${imported} events imported so far`);
      }
    }

    // Log import summary
    const summary = `Import summary: ${imported} driver behavior events imported, ${skipped} duplicates skipped, ${invalid} invalid events.`;
    console.log(summary);
    
    return {
      imported,
      skipped,
      invalid,
      success: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error importing driver behavior events:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// createDieselRecord
export const createDieselRecord = onCall(async (request) => {
  const db = admin.firestore();
  const dieselRef = db.collection("diesel").doc();
  const data = request.data || {};
  const newDiesel = {
    id: dieselRef.id,
    tripId: data.tripId || "",
    fleetNumber: data.fleetNumber || "",
    driverName: data.driverName || "",
    fuelStation: data.fuelStation || "",
    date: data.date || "",
    currency: data.currency || "ZAR",
    costPerLitre: Number(data.costPerLitre) || 0,
    litresFilled: Number(data.litresFilled) || 0,
    totalCost: Number(data.totalCost) || 0,
    kmReading: Number(data.kmReading) || 0,
    previousKmReading: Number(data.previousKmReading) || 0,
    distanceTravelled: Number(data.distanceTravelled) || 0,
    kmPerLitre: Number(data.kmPerLitre) || 0,
    isReeferUnit: Boolean(data.isReeferUnit),
    notes: data.notes || "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await dieselRef.set(newDiesel);
  return { id: dieselRef.id };
});

// createActionItem
export const createActionItem = onCall(async (request) => {
  const db = admin.firestore();
  const actionRef = db.collection("actionItems").doc();
  const data = request.data || {};
  const newAction = {
    id: actionRef.id,
    title: data.title || "",
    description: data.description || "",
    responsiblePerson: data.responsiblePerson || "",
    status: data.status || "pending",
    startDate: data.startDate || "",
    dueDate: data.dueDate || "",
    completedAt: data.completedAt || "",
    completedBy: data.completedBy || "",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: data.createdBy || "",
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    attachments: Array.isArray(data.attachments) ? data.attachments : [],
    isOverdue: Boolean(data.isOverdue),
    isOverdueBy5: Boolean(data.isOverdueBy5),
    isOverdueBy10: Boolean(data.isOverdueBy10),
    overdueBy: Number(data.overdueBy) || 0,
    needsReason: Boolean(data.needsReason),
  };
  await actionRef.set(newAction);
  return { id: actionRef.id };
});

// upsertSystemCostRates
export const upsertSystemCostRates = onCall(async (request) => {
  const db = admin.firestore();
  const data = request.data || {};
  const currency = data.currency || "ZAR";
  const docId = `${currency}_rates`;
  const ratesRef = db.collection("systemCostRates").doc(docId);
  const now = new Date().toISOString();
  const newRates = {
    id: docId,
    currency,
    effectiveDate: data.effectiveDate || now,
    lastUpdated: now,
    updatedBy: data.updatedBy || "system",
    perDayCosts: {
      depreciation: Number(data.perDayCosts?.depreciation) || 0,
      fleetManagementSystem: Number(data.perDayCosts?.fleetManagementSystem) || 0,
      gitInsurance: Number(data.perDayCosts?.gitInsurance) || 0,
      licensing: Number(data.perDayCosts?.licensing) || 0,
      shortTermInsurance: Number(data.perDayCosts?.shortTermInsurance) || 0,
      trackingCost: Number(data.perDayCosts?.trackingCost) || 0,
      vidRoadworthy: Number(data.perDayCosts?.vidRoadworthy) || 0,
      wages: Number(data.perDayCosts?.wages) || 0,
    },
    perKmCosts: {
      repairMaintenance: Number(data.perKmCosts?.repairMaintenance) || 0,
      tyreCost: Number(data.perKmCosts?.tyreCost) || 0,
    },
  };
  await ratesRef.set(newRates, { merge: true });
  return { id: docId };
});
