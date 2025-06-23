import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// Hierdie funksie ontvang trips-data (array of arrays) via POST as JSON en laai dit in Firestore
export const importTripsFromWebBook = functions.https.onRequest(async (req, res) => {
  try {
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

// Jy hoef nie ander funksies of code in hierdie lêer te hê nie.
