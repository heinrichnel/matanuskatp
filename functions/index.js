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

const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbx2LuGtG7E8XYNafq37D0JK4SfYYUqGrOnXgpLOsWF1uNYoOlErqaiAYGf7vsCKKLTWJA/exec';

exports.importTripsWebhook = functions.https.onRequest(async (req, res) => {
    try {
        console.log("[importTripsWebhook] Received request:", JSON.stringify(req.body, null, 2));
        const { trips } = req.body;

        if (!trips || !Array.isArray(trips)) {
            console.error("[importTripsWebhook] Invalid payload structure:", JSON.stringify(req.body, null, 2));
            return res.status(400).json({ error: 'Invalid payload: trips must be an array' });
        }

        let imported = 0;
        let skipped = 0;

        const batch = admin.firestore().batch();
        console.log(`[importTripsWebhook] Processing ${trips.length} trips`);

        for (const trip of trips) {
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
                deliveredDate,
                baseRevenue,
                revenueCurrency,
                distanceKm,
                createdAt
            ] = trip;
            
            if (!loadRef) {
                console.log("[importTripsWebhook] Skipping trip with missing loadRef");
                skipped++;
                continue;
            }

            // Debug log to check status values
            console.log(`[importTripsWebhook] Trip ${loadRef} status values:`, {
                shippedStatus,
                deliveredStatus,
                shippedDate,
                deliveredDate
            });

            const tripRef = admin.firestore().collection('trips').doc(String(loadRef));
            const tripDoc = await tripRef.get();
            
            // Create the trip data
            let tripData = {
                fleetNumber: fleetNumber || '',
                driverName: driverName || '',
                clientType: clientType || 'external',
                clientName: clientName || '',
                loadRef: loadRef,
                route: route || '',
                baseRevenue: parseFloat(baseRevenue) || 0,
                revenueCurrency: revenueCurrency || 'ZAR',
                distanceKm: parseFloat(distanceKm) || 0,
                shippedStatus: shippedStatus === true || shippedStatus === 'Shipped',
                deliveredStatus: deliveredStatus === true || deliveredStatus === 'Delivered',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };

            // Parse dates - ensure they're proper ISO strings
            if (shippedDate) {
                tripData.shippedDate = new Date(shippedDate).toISOString();
            }
            
            if (deliveredDate) {
                tripData.deliveredDate = new Date(deliveredDate).toISOString();
            }
            
            // Determine trip status based on shipped/delivered status
            if (tripData.deliveredStatus) {
                tripData.status = 'completed';
            } else if (tripData.shippedStatus) {
                tripData.status = 'shipped';
            } else {
                tripData.status = 'active';
            }
            
            if (tripDoc.exists) {
                batch.update(tripRef, tripData);
                skipped++;
            } else {
                // Add additional fields for new trips
                tripData = {
                    ...tripData,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    costs: [],
                    additionalCosts: [],
                    followUpHistory: [],
                    paymentStatus: 'unpaid'
                };
                
                batch.set(tripRef, tripData);
                imported++;
            }
        }
        
        await batch.commit();
        
        console.log(`[importTripsWebhook] Import complete. Imported: ${imported}, Skipped: ${skipped}`);
        return res.status(200).json({
            message: 'Import successful',
            imported,
            skipped
        });
    } catch (error) {
        console.error("[importTripsWebhook] Error:", error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

exports.telematicsTripUpdateWebhook = functions.https.onRequest(async (req, res) => {
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
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// Keep the existing importTripsFromWebBook function for backward compatibility
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
const DRIVER_BEHAVIOR_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwssUw9YeaNgesBqB32Z5XD7EHaGhhzbr0s7zaFe-Nefx_ccmB7AbsI9CBTnYhGWSK5/exec';

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
        
        console.log("[importDriverBehaviorWebhook] Received payload:", JSON.stringify(req.body, null, 2));
        const { events } = req.body;
        
        if (!events || !Array.isArray(events)) {
            console.error("[importDriverBehaviorWebhook] Invalid payload structure:", JSON.stringify(req.body, null, 2));
            return res.status(400).json({ error: 'Invalid payload: events must be an array' });
        }

        // Log summary of the events array
        console.log(`[importDriverBehaviorWebhook] Processing ${events.length} driver behavior events`);

        // Make sure the events is properly formatted as expected from Google Apps Script
        // The expected format from GAS is { events: [...] }
        const eventsArray = Array.isArray(events) ? events : [];
        
        const batch = admin.firestore().batch();
        let imported = 0;
        let skipped = 0;
        let validationErrors = 0;
        let processingDetails = [];
        
        for (const event of eventsArray) {
            // Log each event's structure for diagnostic purposes
            const timestamp = new Date().toISOString();
            console.log(`[importDriverBehaviorWebhook][${timestamp}] Processing event:`, JSON.stringify(event, null, 2));
            
            // Check for required fields
            const { fleetNumber, driverName, eventType, eventTime } = event;
            
            if (!fleetNumber || !eventType || !eventTime) {
                console.error(`[importDriverBehaviorWebhook] Missing required fields:`, 
                    { fleetNumber, eventType, eventTime });
                validationErrors++;
                processingDetails.push({
                    event: event,
                    error: 'Missing required fields',
                    timestamp
                });
                continue;
            }
            
            // Generate unique document ID to prevent duplicates
            // Use the same format as in the Google Apps Script for consistency
            const uniqueId = `${fleetNumber}_${eventType}_${eventTime}`;
            const eventRef = admin.firestore().collection('driverBehaviorEvents').doc(uniqueId);
            
            // Check if document already exists
            const eventDoc = await eventRef.get();
            
            if (eventDoc.exists) {
                console.log(`[importDriverBehaviorWebhook] Event already exists: ${uniqueId}`);
                skipped++;
                processingDetails.push({
                    uniqueId,
                    status: 'skipped',
                    reason: 'already exists',
                    timestamp
                });
                continue;
            }
            
            // Process the event - ensure proper fields
            const processedEvent = {
                fleetNumber,
                driverName: driverName || '',
                eventType,
                eventTime,
                cameraId: event.cameraId || '',
                videoUrl: event.videoUrl || '',
                severity: event.severity || 'medium',
                eventScore: parseFloat(event.eventScore) || 0,
                notes: event.notes || '',
                reportedAt: event.reportedAt || new Date().toISOString(),
                reportedBy: event.reportedBy || 'WebBook Script',
                status: event.status || 'pending',
                points: Number(event.points) || 0,
                createdAt: event.createdAt || new Date().toISOString(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            };
            
            console.log(`[importDriverBehaviorWebhook] Adding event: ${uniqueId}`, processedEvent);
            batch.set(eventRef, processedEvent);
            imported++;
            processingDetails.push({
                uniqueId,
                status: 'imported',
                timestamp
            });
        }
        
        // Commit the batch if there are items to import
        if (imported > 0) {
            await batch.commit();
            console.log(`[importDriverBehaviorWebhook] Successfully committed ${imported} events to Firestore`);
        } else {
            console.log('[importDriverBehaviorWebhook] No new events to import');
        }
        
        const response = {
            imported,
            skipped,
            validationErrors,
            message: `Processed ${events.length} driver behavior events. Imported: ${imported}, Skipped: ${skipped}, Errors: ${validationErrors}`,
            processingDetails: processingDetails.length <= 10 ? processingDetails : `${processingDetails.length} events processed`
        };
        
        console.log('[importDriverBehaviorWebhook] Final response:', response);
        
        return res.status(200).json(response);
    } catch (error) {
        console.error("[importDriverBehaviorWebhook] Error processing events:", error);
        return res.status(500).json({ 
            error: 'Internal Server Error', 
            details: error instanceof Error ? error.message : 'Unknown error'
        });
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

// Manual import endpoint for driver behavior events (can be triggered from the UI)
exports.manualImportDriverBehavior = functions.https.onRequest(async (req, res) => {
    try {
        // Simulate the webhook call with empty events array to trigger the import
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://us-central1-mat1-9e6b3.cloudfunctions.net/importDriverBehaviorWebhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ events: [] })
        });
        
        if (!response.ok) {
            throw new Error(`Failed to trigger driver behavior import: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('[manualImportDriverBehavior] Import triggered:', result);
        
        res.status(200).json({
            message: 'Manual driver behavior import triggered',
            result
        });
    } catch (error) {
        console.error('[manualImportDriverBehavior] Error:', error);
        res.status(500).json({
            error: 'Failed to trigger import',
            details: error.message
        });
    }
});