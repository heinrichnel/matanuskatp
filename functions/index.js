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

// Add the importTripsFromWebBook function to handle webhook requests from Google Apps Script
exports.importTripsFromWebBook = functions.https.onRequest(async (req, res) => {
    try {
        // Log the incoming request for debugging
        console.log("Received importTripsFromWebBook request:", JSON.stringify(req.body, null, 2));
        
        // Extract trips from the request body
        const { trips } = req.body;
        
        // Validate the payload
        if (!trips || !Array.isArray(trips)) {
            console.error("Invalid payload structure:", JSON.stringify(req.body, null, 2));
            return res.status(400).json({ error: 'Invalid payload: trips must be an array' });
        }
        
        // Initialize counters for tracking results
        let imported = 0;
        let skipped = 0;
        
        // Create a batch for atomic operations
        const batch = admin.firestore().batch();
        
        // Process each trip
        for (const trip of trips) {
            // Extract data from the trip array
            const [
                fleetNumber,
                driverName,
                clientType,
                clientName,
                loadRef,
                route,
                shippedStatus,
                shippedDate,
                ,  // Skip empty field
                deliveredStatus,
                deliveredDate
            ] = trip;
            
            // Skip if no loadRef (required field)
            if (!loadRef) {
                console.log("Skipping trip with missing loadRef");
                skipped++;
                continue;
            }
            
            // Check if the trip already exists
            const tripRef = admin.firestore().collection('trips').doc(String(loadRef));
            const tripDoc = await tripRef.get();
            
            // Prepare the trip data
            const tripData = {
                fleetNumber: fleetNumber || '',
                driverName: driverName || '',
                clientType: clientType || 'external',
                clientName: clientName || '',
                loadRef: loadRef,
                route: route || '',
                shippedStatus: shippedStatus === 'shipped' || shippedStatus === true,
                shippedDate: shippedDate ? new Date(shippedDate).toISOString() : null,
                deliveredStatus: deliveredStatus === 'delivered' || deliveredStatus === true,
                deliveredDate: deliveredDate ? new Date(deliveredDate).toISOString() : null,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            
            // Add status field based on shipped/delivered status
            if (tripData.deliveredStatus) {
                tripData.status = 'completed';
            } else if (tripData.shippedStatus) {
                tripData.status = 'active';
            } else {
                tripData.status = 'active';
            }
            
            // If trip exists, update it; otherwise, create it
            if (tripDoc.exists) {
                batch.update(tripRef, tripData);
                skipped++;
            } else {
                // Add createdAt for new trips
                tripData.createdAt = admin.firestore.FieldValue.serverTimestamp();
                tripData.costs = []; // Initialize empty costs array
                tripData.additionalCosts = []; // Initialize empty additionalCosts array
                tripData.followUpHistory = []; // Initialize empty followUpHistory array
                
                batch.set(tripRef, tripData);
                imported++;
            }
        }
        
        // Commit the batch
        await batch.commit();
        
        // Return success response
        return res.status(200).json({
            message: 'Import successful',
            imported,
            skipped
        });
    } catch (error) {
        // Log and return error
        console.error("Error in importTripsFromWebBook:", error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// Add the telematicsTripUpdateWebhook function to handle trip status updates
exports.telematicsTripUpdateWebhook = functions.https.onRequest(async (req, res) => {
    try {
        // Log the incoming request for debugging
        console.log("Received telematicsTripUpdateWebhook request:", JSON.stringify(req.body, null, 2));
        
        // Extract data from the request body
        const { tripId, status, timestamp, driverId, vehicleId, location, endLocation } = req.body;
        
        // Validate required fields
        if (!tripId || !status) {
            return res.status(400).json({ error: 'Missing required fields: tripId and status' });
        }
        
        // Reference to the trip document
        const tripRef = admin.firestore().collection('trips').doc(String(tripId));
        
        // Prepare update data based on status
        const updateData = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
        
        if (status === 'trip_started') {
            // Validate required fields for trip start
            if (!driverId || !vehicleId || !location) {
                return res.status(400).json({ error: 'Missing required fields for trip_started status' });
            }
            
            updateData.startedAt = timestamp || new Date().toISOString();
            updateData.driverId = driverId;
            updateData.vehicleId = vehicleId;
            updateData.startLocation = location;
            updateData.shippedStatus = true;
            updateData.shippedDate = timestamp || new Date().toISOString();
            updateData.status = 'active';
        } else if (status === 'trip_ended') {
            // Validate required fields for trip end
            if (!endLocation) {
                return res.status(400).json({ error: 'Missing required field endLocation for trip_ended status' });
            }
            
            updateData.endedAt = timestamp || new Date().toISOString();
            updateData.endLocation = endLocation;
            updateData.deliveredStatus = true;
            updateData.deliveredDate = timestamp || new Date().toISOString();
            updateData.status = 'completed';
        } else {
            // Handle other status updates
            updateData.lastUpdated = timestamp || new Date().toISOString();
        }
        
        // Update the trip document
        await tripRef.set(updateData, { merge: true });
        
        // Return success response
        return res.status(200).json({
            message: `Trip ${tripId} updated with status: ${status}`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        // Log and return error
        console.error("Error in telematicsTripUpdateWebhook:", error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
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