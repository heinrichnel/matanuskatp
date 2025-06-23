import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// Webhook to import trips from Google Sheet (web book)
export const importTripsFromWebBook = functions.https.onRequest(async (req, res) => {
  try {
    // URL of your published Google Apps Script web app
    const WEB_BOOK_URL = 'https://docs.google.com/spreadsheets/d/1vFV3gzb-85PmPTqEgsgXwVZxei_XDpAaWPJVUguioYQ/edit?gid=166024345#gid=166024345';
    const response = await fetch(WEB_BOOK_URL);
    if (!response.ok) throw new Error('Failed to fetch web book data');
    const data = await response.json();

    // Column mapping
    // A: Fleet Number, B: Driver Name, C: Client Type, D: Client Name, E: Load Reference (Unique Key),
    // F: Route, G: SHIPPED Status, H: SHIPPED Date, J: DELIVERED Status, K: DELIVERED Date
    const trips = Array.isArray(data) ? data : [];
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
      const [fleetNumber, driverName, clientType, clientName, loadRef, route, shippedStatus, shippedDate, , deliveredStatus, deliveredDate] = row;
      // Import rules
      if (
        shippedStatus === 'SHIPPED' &&
        shippedDate && !isNaN(Date.parse(shippedDate)) &&
        deliveredStatus === 'DELIVERED' &&
        deliveredDate && !isNaN(Date.parse(deliveredDate)) &&
        loadRef
      ) {
        // Check for duplicate by Load Reference
        const existing = await db.collection('trips').where('loadRef', '==', loadRef).get();
        if (existing.empty) {
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
    }

    // Batch add valid trips
    const batch = db.batch();
    validTrips.forEach(trip => {
      const ref = db.collection('trips').doc();
      batch.set(ref, trip);
    });
    await batch.commit();

    res.status(200).json({ imported: validTrips.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Manual trip forms remain active and functional elsewhere in your app.
