import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';
import * as functionsV1 from 'firebase-functions/v1';
admin.initializeApp();

// Use config variables for URLs and secret key
const WEB_BOOK_TRIPS_URL = functions.config().webbook.trips_url;
const WEB_BOOK_DRIVER_BEHAVIOR_URL = functions.config().webbook.driver_behavior_url;
const RECAPTCHA_SECRET_KEY = functions.config().recaptcha.secret_key;

// Helper: Verify reCAPTCHA token with Google
async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!RECAPTCHA_SECRET_KEY) {
    console.error('reCAPTCHA secret key not set in environment variables.');
    return false;
  }
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
  });
  const data = await response.json();
  return data.success === true && data.score >= 0.5;
}

// Hierdie funksie ontvang trips-data (array of arrays) via POST as JSON en laai dit in Firestore
export const importTripsFromWebBook = functions.https.onRequest(async (req, res) => {
  try {
    // 0. Verify reCAPTCHA token from request
    const recaptchaToken = req.headers['x-recaptcha-token'] || req.body.recaptchaToken;
    if (!recaptchaToken || typeof recaptchaToken !== 'string') {
      res.status(400).json({ error: 'Missing reCAPTCHA token.' });
      return;
    }
    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) {
      res.status(403).json({ error: 'reCAPTCHA verification failed.' });
      return;
    }

    // 1. Kry trips uit POST body (dit moet 'n array wees)
    const trips = Array.isArray(req.body) ? req.body : [];

    type Trip = {
      fleetNumber: any;
      driverName: any;
      clientType: any;
      clientName: any;
      loadRef: any;
      route: any;
      shippedStatus: any;
      shippedDate: any;
      deliveredStatus: any;
      deliveredDate: any;
      status: string;
      createdAt: admin.firestore.FieldValue;
    };

    const validTrips: Trip[] = [];
    const db = admin.firestore();

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
        deliveredDate
      ] = row;

      // Verhoed duplikate met unieke LoadRef
      const existing = await db.collection('trips').where('loadRef', '==', loadRef).get();
      if (existing.empty && loadRef) {
        validTrips.push({
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
          status: 'active',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    // Batch add valid trips
    const batch = db.batch();
    validTrips.forEach(trip => {
      const ref = db.collection('trips').doc();
      batch.set(ref, trip);
    });
    await batch.commit();

    res.status(200).json({ imported: validTrips.length });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Scheduled function to fetch trips from a Google Sheets web book and import to Firestore
export const scheduledImportTripsFromWebBook = functionsV1.pubsub.schedule('every 5 minutes').onRun(async (context) => {
  if (!WEB_BOOK_TRIPS_URL) {
    console.error('WEB_BOOK_TRIPS_URL not set in environment variables.');
    return null;
  }
  try {
    const response = await fetch(WEB_BOOK_TRIPS_URL, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Failed to fetch web book: ${response.statusText}`);
    }
    // Assume the web book returns an array of arrays (rows)
    const trips = await response.json();
    if (!Array.isArray(trips)) {
      throw new Error('Web book response is not an array');
    }
    const db = admin.firestore();
    type Trip = {
      fleetNumber: any;
      driverName: any;
      clientType: any;
      clientName: any;
      loadRef: any;
      route: any;
      shippedStatus: any;
      shippedDate: any;
      deliveredStatus: any;
      deliveredDate: any;
      status: string;
      createdAt: admin.firestore.FieldValue;
    };
    const validTrips: Trip[] = [];
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
        deliveredDate
      ] = row;
      const existing = await db.collection('trips').where('loadRef', '==', loadRef).get();
      if (existing.empty && loadRef) {
        validTrips.push({
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
          status: 'active',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }
    const batch = db.batch();
    validTrips.forEach(trip => {
      const ref = db.collection('trips').doc();
      batch.set(ref, trip);
    });
    await batch.commit();
    console.log(`Imported ${validTrips.length} trips from web book.`);
    return null;
  } catch (error) {
    console.error('Scheduled import error:', error);
    return null;
  }
});

// Scheduled function to fetch driver behavior events from a Google Sheets web book and import to Firestore
export const scheduledImportDriverBehaviorFromWebBook = functionsV1.pubsub.schedule('every 5 minutes').onRun(async (context) => {
  if (!WEB_BOOK_DRIVER_BEHAVIOR_URL) {
    console.error('WEB_BOOK_DRIVER_BEHAVIOR_URL not set in environment variables.');
    return null;
  }
  try {
    const response = await fetch(WEB_BOOK_DRIVER_BEHAVIOR_URL, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`Failed to fetch driver behavior web book: ${response.statusText}`);
    }
    // Assume the web book returns an array of arrays (rows)
    const events = await response.json();
    if (!Array.isArray(events)) {
      throw new Error('Driver behavior web book response is not an array');
    }
    const db = admin.firestore();
    type DriverBehaviorEvent = {
      driverId: any;
      eventType: any;
      eventDate: any;
      description: any;
      severity: any;
      status: string;
      createdAt: admin.firestore.FieldValue;
    };
    const validEvents: DriverBehaviorEvent[] = [];
    for (const row of events) {
      const [
        driverId,
        eventType,
        eventDate,
        description,
        severity
      ] = row;
      // Deduplicate by driverId+eventDate+eventType
      const existing = await db.collection('driverBehavior')
        .where('driverId', '==', driverId)
        .where('eventDate', '==', eventDate)
        .where('eventType', '==', eventType)
        .get();
      if (existing.empty && driverId && eventDate && eventType) {
        validEvents.push({
          driverId,
          eventType,
          eventDate,
          description,
          severity,
          status: 'active',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }
    const batch = db.batch();
    validEvents.forEach(event => {
      const ref = db.collection('driverBehavior').doc();
      batch.set(ref, event);
    });
    await batch.commit();
    console.log(`Imported ${validEvents.length} driver behavior events from web book.`);
    return null;
  } catch (error) {
    console.error('Scheduled driver behavior import error:', error);
    return null;
  }
});

// Jy hoef nie ander funksies of code in hierdie lêer te hê nie.
