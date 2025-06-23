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
const DRIVER_BEHAVIOR_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbw5_oPDd7wVIEOxf9rY6wKqUN1aNFuVqGrPl83Z2YKygZiHftyUxU-_sV4Wu_vY1h1vSg/exec';

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
