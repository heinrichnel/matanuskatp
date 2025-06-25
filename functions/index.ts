import { onCall, onRequest, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import * as functionsV1 from "firebase-functions/v1";

admin.initializeApp();

// Use config variables for URLs
const WEB_BOOK_TRIPS_URL = functionsV1.config().webbook.trips_url;
const WEB_BOOK_DRIVER_BEHAVIOR_URL = functionsV1.config().webbook.driver_behavior_url;

// New onCall function with AppCheck and updated schema for importing trips
export const importTripsFromWebBook = onCall(
  { enforceAppCheck: true },
  async (request) => {
    if (!request.app) {
      throw new HttpsError(
        "failed-precondition",
        "The function must be called from an App Check verified app."
      );
    }

    try {
      const trips = Array.isArray(request.data) ? request.data : [];
      console.log(`Received ${trips.length} rows for import.`);
      if (trips.length > 0) {
        console.log("First row sample:", JSON.stringify(trips[0]));
      }

      const db = admin.firestore();
      const validTrips: any[] = [];
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
    } catch (error: any) {
      console.error("Error importing trips:", error);
      throw new HttpsError("internal", error.message);
    }
  }
);

// Scheduled function to fetch trips from a Google Sheets web book and import to Firestore
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
      const trips = await response.json();
      if (!Array.isArray(trips)) {
        console.error("Web book response is not an array. Received:", trips);
        throw new Error("Web book response is not an array");
      }
      
      console.log(`Received ${trips.length} rows from web book.`);
      if (trips.length > 0) {
        console.log("First row sample:", JSON.stringify(trips[0]));
      }

      const db = admin.firestore();
      const validTrips: any[] = [];
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

// New HTTP endpoint for live driver behavior webhook
export const importDriverBehaviorWebhook = onRequest(async (req, res) => {
  // Only accept POSTs
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const events = Array.isArray(req.body) ? req.body as any[] : [];
  if (!events.length) {
    res.status(400).send('Invalid or empty payload');
    return;
  }

  const db = admin.firestore();
  let imported = 0;
  let skipped = 0;

  for (const evt of events) {
    const id = evt.id;
    if (!id || evt.eventType === 'UNKNOWN') {
      skipped++;
      continue;
    }

    const ref = db.collection('driverBehavior').doc(id.toString());
    const snap = await ref.get();
    if (snap.exists) {
      skipped++;
      continue;
    }

    // Write event, preserving fields and adding createdAt
    await ref.set({
      ...evt,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    imported++;
  }

  res.status(200).send({ imported, skipped });
});

// Scheduled function to fetch driver behavior events from a Google Sheets web book and import to Firestore
export const scheduledImportDriverBehaviorFromWebBook = functionsV1.pubsub
  .schedule("every 5 minutes")
  .onRun(async (context) => {
    if (!WEB_BOOK_DRIVER_BEHAVIOR_URL) {
      console.error(
        "WEB_BOOK_DRIVER_BEHAVIOR_URL not set in environment variables."
      );
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
      const validEvents: any[] = [];

      for (const row of events) {
        // Example: [fleetNumber, driverName, eventType, description, points, eventDate, eventTime, severity, location, actionTaken, status, resolved, date, reportedAt, reportedBy]
        const [
          fleetNumber = "",
          driverName = "",
          eventType = "",
          description = "",
          points = 0,
          eventDate = "",
          eventTime = "",
          severity = "",
          location = "",
          actionTaken = "",
          status = "pending",
          resolved = false,
          date = "",
          reportedAt = "",
          reportedBy = ""
        ] = row;
        if (!eventType || !eventDate) continue;
        const eventRef = db.collection("driverBehavior").doc();
        const newEvent = {
          id: eventRef.id,
          fleetNumber,
          driverName,
          eventType,
          description,
          points: Number(points) || 0,
          eventDate,
          eventTime,
          severity,
          location,
          actionTaken,
          status,
          resolved: Boolean(resolved),
          date,
          reportedAt,
          reportedBy,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        validEvents.push({ ref: eventRef, data: newEvent });
      }

      if (validEvents.length > 0) {
        const batch = db.batch();
        validEvents.forEach(event => {
          batch.set(event.ref, event.data);
        });
        await batch.commit();
      }

      console.log(
        `Imported ${validEvents.length} driver behavior events from web book.`
      );
      return null;
    } catch (error) {
      console.error("Scheduled driver behavior import error:", error);
      return null;
    }
  });

// New HTTP endpoint for live trips webhook
export const importTripsWebhook = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const trips = Array.isArray(req.body) ? req.body as any[] : [];
  if (!trips.length) {
    res.status(400).send('Invalid or empty payload');
    return;
  }

  const db = admin.firestore();
  let imported = 0;
  let skipped = 0;

  for (const t of trips) {
    const id = t.loadRef || t.id;
    if (!id) {
      skipped++;
      continue;
    }

    const ref = db.collection('trips').doc(id.toString());
    const snap = await ref.get();
    if (snap.exists) {
      skipped++;
      continue;
    }

    // Write trip, preserving fields and adding timestamps
    await ref.set({
      ...t,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    imported++;
  }

  res.status(200).send({ imported, skipped });
});

// Example function to create a diesel record with your schema
export const createDieselRecord = onCall({ enforceAppCheck: true }, async (request) => {
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

// Example function to create an action item with your schema
export const createActionItem = onCall({ enforceAppCheck: true }, async (request) => {
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

// Callable function to create or update a system cost rates document
export const upsertSystemCostRates = onCall({ enforceAppCheck: true }, async (request) => {
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