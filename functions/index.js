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
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

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

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxWt9XUjNLKwoT38iWuFh-h8Qs7PxCu2I-KGiJqspIm-jVxiSFeZ-KPOqeVoxxEbhv8/exec';

exports.importTripsFromWebBook = functions.https.onRequest(async (req, res) => {
    try {
        // Fetch data from Google Sheets Web App
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(WEBHOOK_URL);
        if (!response.ok) throw new Error('Failed to fetch from Google Sheets Web App');
        const trips = await response.json();
        // Here you would process and import trips into Firestore
        // For demonstration, just return the fetched data
        res.status(200).json({ message: "Function triggered!", imported: trips.length, trips });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Import Driver Behavior Events from Web Book (automatic sync)
const DRIVER_BEHAVIOR_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyCG4lCgvmwXhGBoClqGbK3VeOEEuz6m4Y4JeBEobYRkSh52wedzq5IxCO--DfmuHnOKA/exec';

exports.importDriverEventsFromWebBook = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(DRIVER_BEHAVIOR_WEBHOOK_URL);
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
            const existing = await db.collection('driverBehavior').where('id', '==', event.id).limit(1).get();
            if (!existing.empty) {
                skipped++;
                continue;
            }
            await db.collection('driverBehavior').add(event);
            imported++;
        }
        console.log(`DriverBehavior Sync: Imported ${imported}, Skipped ${skipped}`);
        return { imported, skipped };
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
});

// HTTP endpoint for driver behavior webhook
exports.importDriverBehaviorWebhook = functions.https.onRequest(async (req, res) => {
    try {
        // Only accept POST
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }
        
        const events = Array.isArray(req.body) ? req.body : [];
        if (!events.length) {
            res.status(400).json({ error: 'Invalid or empty payload' });
            return;
        }
        
        const db = admin.firestore();
        let imported = 0;
        let skipped = 0;
        
        for (const event of events) {
            if (!event || event.eventType === 'UNKNOWN' || !event.id) {
                skipped++;
                continue;
            }
            
            // Check for duplicate by event.id
            const existing = await db.collection('driverBehavior').where('id', '==', event.id).limit(1).get();
            if (!existing.empty) {
                skipped++;
                continue;
            }
            
            // Process the event data according to the expected format
            const processedEvent = {
                id: event.id,
                reportedAt: event.reportedAt || new Date().toISOString(),
                description: event.description || "",
                driverName: event.driverName || "",
                eventDate: event.eventDate || "",
                eventTime: event.eventTime || "",
                eventType: event.eventType || "",
                fleetNumber: event.fleetNumber || "",
                location: event.location || "",
                severity: event.severity || "medium",
                status: event.status || "pending",
                points: Number(event.points) || 0,
                reportedBy: event.reportedBy || "WebBook Script",
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };
            
            await db.collection('driverBehavior').add(processedEvent);
            imported++;
        }
        
        res.status(200).json({ imported, skipped });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// HTTP endpoint for trips webhook
exports.importTripsWebhook = functions.https.onRequest(async (req, res) => {
    try {
        // Only accept POST
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }
        
        const trips = Array.isArray(req.body) ? req.body : [];
        if (!trips.length) {
            res.status(400).json({ error: 'Invalid or empty payload' });
            return;
        }
        
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
        
        res.status(200).json({ imported, skipped });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Manual trigger for driver behavior events import
exports.manualImportDriverEvents = functions.https.onRequest(async (req, res) => {
    try {
        const result = await exports.importDriverEventsFromWebBook.run();
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Manual trigger for trips import
exports.manualImportTrips = functions.https.onRequest(async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(WEBHOOK_URL);
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
        
        res.status(200).json({ imported, skipped });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});