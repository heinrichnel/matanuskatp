import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

// Ensure Firebase is initialized only once.
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Robust Driver Behavior Import Webhook.
 * Receives a POST with { events: [ ... ] } from Google Apps Script.
 */
export const enhancedDriverBehaviorWebhook = onRequest(async (req, res) => {
  // --- CORS & Method Guard ---
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
  // --- Parse and Validate Payload ---
  const requestBody = req.body;
  if (!requestBody?.events || !Array.isArray(requestBody.events)) {
    res.status(400).json({
      error: "Invalid payload structure",
      message: "Missing or invalid 'events' array in request body",
    });
    return;
  }
  const { events } = requestBody;
  const targetCollection = "driverBehaviorEvents";
  const batch = db.batch();
  let imported = 0;
  let skipped = 0;
  const processingDetails: Array<{ status: string; reason?: string; uniqueKey?: string; event?: any }> = [];
  // --- Process each event in the batch ---
  for (const event of events) {
    // Accept both fleetNum and fleetNumber for compatibility
    const fleetNumber = event.fleetNumber || event.fleetNum || "";
    const eventType = event.eventType || "";
    const eventDate = event.eventDate || "";
    const eventTime = event.eventTime || "";
    // Validate minimum required fields
    if (!fleetNumber || !eventType || !eventTime || String(eventType).toUpperCase() === "UNKNOWN") {
      skipped++;
      processingDetails.push({
        status: "skipped",
        reason: "missing_or_unknown_required_fields",
        event: { fleetNumber, eventType, eventDate, eventTime },
      });
      continue;
    }
    // Generate a unique key: fleetNumber_eventType_eventDate_eventTime
    const dateKey = eventDate instanceof Date ?
      eventDate.toISOString().split("T")[0] :
      String(eventDate);
    const timeKey = eventTime instanceof Date ?
      eventTime.toISOString().split("T")[1] :
      String(eventTime);
    const uniqueKey = `${fleetNumber}_${eventType}_${dateKey}_${timeKey}`;
    // Normalize event for Firestore
    const normalizedEvent = {
      fleetNumber: String(fleetNumber),
      driverName: String(event.driverName || ""),
      eventType: String(eventType),
      eventDate: dateKey,
      eventTime: timeKey,
      description: event.description ? String(event.description) : "",
      location: String(event.location || ""),
      severity: String(event.severity || "medium"),
      status: String(event.status || "pending"),
      points: typeof event.points === "number" ? event.points : parseFloat(event.points) || 0,
      createdAt: new Date().toISOString(),
      importSource: event.importSource || req.headers["x-source"] || "webhook",
      uniqueKey: uniqueKey,
    };
    // Deduplicate by uniqueKey (document ID)
    const eventRef = db.collection(targetCollection).doc(uniqueKey);
    const doc = await eventRef.get();
    if (doc.exists) {
      skipped++;
      processingDetails.push({ status: "skipped", reason: "already_exists", uniqueKey });
    } else {
      batch.set(eventRef, normalizedEvent);
      imported++;
      processingDetails.push({ status: "imported", uniqueKey });
    }
  }
  // Commit Firestore batch if anything to write
  if (imported > 0) {
    await batch.commit();
  }
  res.status(200).json({
    imported,
    skipped,
    message: `Processed ${events.length} driver behavior events. Imported: ${imported}, Skipped: ${skipped}`,
    processingDetails: processingDetails.length <= 10 ?
      processingDetails :
      `${processingDetails.length} events processed`,
  });
});

/**
 * Backward compatibility: importDriverBehaviorWebhook
 */
export const importDriverBehaviorWebhook = enhancedDriverBehaviorWebhook;
