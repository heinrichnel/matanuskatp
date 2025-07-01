// Script to verify if a driver behavior event exists in Firestore
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function verifyDriverBehaviorEvent() {
  console.log('Checking for driver behavior event...');
  
  // Get the event by ID
  const eventId = '28H_Harsh Braking_2025-06-29T13:15:30.000Z';
  const eventDoc = await db.collection('driverBehavior').doc(eventId).get();
  
  if (eventDoc.exists) {
    console.log('✅ Event found in Firestore!');
    console.log('Event data:', eventDoc.data());
    return true;
  } else {
    console.log('❌ Event not found in Firestore.');
    
    // Search for any events with similar properties
    console.log('Searching for similar events...');
    const query = await db.collection('driverBehavior')
      .where('fleetNumber', '==', '28H')
      .limit(5)
      .get();
    
    if (query.empty) {
      console.log('No events found for fleet 28H.');
    } else {
      console.log(`Found ${query.size} events for fleet 28H:`);
      query.forEach(doc => {
        console.log(`- ${doc.id}: ${JSON.stringify(doc.data())}`);
      });
    }
    
    // Check all driver behavior events
    console.log('Checking all driver behavior events:');
    const allEvents = await db.collection('driverBehavior').get();
    console.log(`Total driver behavior events in Firestore: ${allEvents.size}`);
    
    return false;
  }
}

verifyDriverBehaviorEvent()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error verifying event:', error);
    process.exit(1);
  });