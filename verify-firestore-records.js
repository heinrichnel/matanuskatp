/**
 * Firestore Verification Script for Driver Behavior Records
 * 
 * This script helps verify that driver behavior records were successfully stored 
 * in Firestore after being sent via the webhook.
 * 
 * Usage: node verify-firestore-records.js [fleetNumber]
 * Optional fleetNumber parameter filters records by fleet number
 */

// Note: This requires the firebase-admin SDK and a serviceAccountKey.json file
// to be present in the same directory
const admin = require('firebase-admin');

// Initialize Firebase Admin with service account credentials
try {
    const serviceAccount = require('./serviceAccountKey.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    console.error('⛔ Error initializing Firebase Admin:');
    console.error('   Make sure you have a valid serviceAccountKey.json file in this directory');
    console.error('   ➔ Details:', error.message);
    process.exit(1);
}

const db = admin.firestore();
const collection = 'driverBehaviorEvents';

/**
 * Query Firestore for driver behavior events
 * @param {string} fleetNumber Optional fleet number to filter by
 */
async function verifyDriverBehaviorRecords(fleetNumber = null) {
    console.log('\n🔍 Checking Firestore records in collection:', collection);

    try {
        let query = db.collection(collection)
            .orderBy('eventTime', 'desc')
            .limit(20);

        // Add filter if fleet number provided
        if (fleetNumber) {
            console.log(`   Filtering by fleet number: ${fleetNumber}`);
            query = query.where('fleetNumber', '==', fleetNumber);
        }

        const snapshot = await query.get();

        if (snapshot.empty) {
            console.log(`❌ No driver behavior records found${fleetNumber ? ` for fleet ${fleetNumber}` : ''}`);
            return;
        }

        console.log(`\n✅ Found ${snapshot.size} recent driver behavior records:`);
        console.log('====================================================');

        snapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`ID: ${doc.id}`);
            console.log(`Fleet Number: ${data.fleetNumber}`);
            console.log(`Event Type: ${data.eventType}`);
            console.log(`Event Time: ${data.eventTime}`);

            // Show additional fields if present
            if (data.driverName) console.log(`Driver: ${data.driverName}`);
            if (data.severity) console.log(`Severity: ${data.severity}`);
            if (data.points) console.log(`Points: ${data.points}`);
            if (data.location) console.log(`Location: ${data.location}`);

            console.log('----------------------------------------------------');
        });

        // Get total count of records
        try {
            const countSnapshot = await db.collection(collection).count().get();
            console.log(`\n📊 Total driver behavior events in database: ${countSnapshot.data().count}\n`);
        } catch (error) {
            // If count() is not available (older Firestore SDK)
            console.log('\n📊 Count operation not supported with current Firestore version');
        }

    } catch (error) {
        console.error('❌ Error querying Firestore:', error);
    } finally {
        // Ensure application exits
        process.exit(0);
    }
}

// Check if fleet number was provided as a command line argument
const args = process.argv.slice(2);
const fleetNumber = args.length > 0 ? args[0] : null;

// Execute verification with optional fleet number filter
verifyDriverBehaviorRecords(fleetNumber);