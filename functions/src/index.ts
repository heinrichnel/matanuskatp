import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const importTripsFromWebBook = functions.https.onRequest(async (req, res) => {
  try {
    // For demonstration - maak seker dit werk, dan kan jy later jou werklike logika bysit
    res.status(200).json({ message: "Function triggered!" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export const importDriverEventsFromWebBook = functions.https.onRequest(async (req, res) => {
  try {
    // Only accept POST
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }
    const events = req.body;
    if (!Array.isArray(events)) {
      res.status(400).json({ error: 'Invalid payload' });
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
      // Check for duplicate by event.id (countId from Google Sheet)
      const existing = await db.collection('driverBehavior').where('id', '==', event.id).limit(1).get();
      if (!existing.empty) {
        skipped++;
        continue;
      }
      await db.collection('driverBehavior').add(event);
      imported++;
    }
    res.status(200).json({ imported, skipped });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
