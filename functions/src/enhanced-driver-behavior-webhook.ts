import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Ensure Firebase is initialized
try {
  admin.initializeApp();
} catch (e) {
  console.log("Firebase already initialized");
}

const db = admin.firestore();

/**
 * Enhanced Driver Behavior Webhook – FINAL VERSION
 * Kyk veral na: eventDate, eventTime, fleetNumber, eventType, description, location, severity, status, points
 */
export const enhancedDriverBehaviorWebhook = onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.set("Access-Control-Allow-Methods", "GET, POST");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(204).send("");
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method Not Allowed",
      message: "Only POST requests are supported",
    });
    return;
  }

  try {
    const requestBody = req.body;
    if (!requestBody.events || !Array.isArray(requestBody.events)) {
      res.status(400).json({
        error: "Invalid payload structure",
        message: "Missing or invalid events array in request body",
      });
      return;
    }
    const {events} = requestBody;
    const batch = db.batch();
    const targetCollection = "driverBehaviorEvents";
    let imported = 0;
    let skipped = 0;
    const processingDetails = [];
    const validationErrors: any[] = [];

    for (const event of events) {
      // Validate minimum required fields
      const fleetNumber = event.fleetNumber || event.fleetNum || "";
      const eventType = event.eventType || "";
      const eventDate = event.eventDate || "";
      const eventTime = event.eventTime || "";

      if (!fleetNumber || !eventType || !eventTime || String(eventType).toUpperCase() === "UNKNOWN") {
        skipped++;
        processingDetails.push({
          status: "skipped",
          reason: "missing_or_unknown_required_fields",
          event: {fleetNumber, eventType, eventDate, eventTime}
        });
        continue;
      }

      // Unieke key: fleetNumber + eventType + eventDate + eventTime (time kan string of Date wees)
      const uniqueKey = `${fleetNumber}_${eventType}_${typeof eventDate === "object" && eventDate.toISOString
        ? eventDate.toISOString().split("T")[0]
        : String(eventDate)}_${typeof eventTime === "object" && eventTime.toISOString
        ? eventTime.toISOString().split("T")[1]
        : String(eventTime)}`;

      const normalizedEvent = {
        fleetNumber: String(fleetNumber),
        driverName: String(event.driverName || ""),
        eventType: String(eventType),
        eventDate: eventDate ? (eventDate instanceof Date ? eventDate.toISOString().split("T")[0] : String(eventDate)) : "",
        eventTime: eventTime instanceof Date ? eventTime.toISOString().split("T")[1] : String(eventTime),
        description: event.description ? String(event.description) : "",
        location: String(event.location || ""),
        severity: String(event.severity || "medium"),
        status: String(event.status || "pending"),
        points: typeof event.points === "number" ? event.points : parseFloat(event.points) || 0,
        createdAt: new Date().toISOString(),
        importSource: event.importSource || req.headers["x-source"] || "webhook",
        uniqueKey: uniqueKey
      };

      const eventRef = db.collection(targetCollection).doc(uniqueKey);
      const doc = await eventRef.get();

      if (doc.exists) {
        skipped++;
        processingDetails.push({status: "skipped", reason: "already_exists", uniqueKey});
      } else {
        batch.set(eventRef, normalizedEvent);
        imported++;
        processingDetails.push({status: "imported", uniqueKey});
      }
    }

    if (imported > 0) {
      await batch.commit();
    }

    res.status(200).json({
      imported,
      skipped,
      message: `Processed ${events.length} driver behavior events. Imported: ${imported}, Skipped: ${skipped}`,
      processingDetails: processingDetails.length <= 10
        ? processingDetails
        : `${processingDetails.length} events processed`,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      requestId: req.headers["x-request-id"] || "unknown",
    });
  }
});

/**
 * Backward compatibility: importDriverBehaviorWebhook
 */
export const importDriverBehaviorWebhook = enhancedDriverBehaviorWebhook;
