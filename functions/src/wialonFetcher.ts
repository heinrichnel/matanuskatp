// functions/src/wialonFetcher.ts

import * as functions from 'firebase-functions/v1';
import fetch from 'node-fetch';
import * as admin from 'firebase-admin';

admin.initializeApp();

const WIALON_TOKEN = '5dce19710a5e26ab8b7b8986cb3c49e58C291791B7F0A7AEB8AFBFCEED7DC03BC48FF5F8';
const WIALON_HOST = 'https://hst-api.wialon.com';

export const fetchWialonGPS = functions.pubsub.schedule('every 5 minutes').onRun(async () => {
  try {
    // Step 1: Login and get session ID
    const loginResp = await fetch(`${WIALON_HOST}/wialon/ajax.html?svc=token/login&params=${encodeURIComponent(JSON.stringify({ token: WIALON_TOKEN }))}`);
    const loginJson = await loginResp.json();
    const sid = loginJson.eid;

    // Step 2: Get units list
    const unitsResp = await fetch(`${WIALON_HOST}/wialon/ajax.html?svc=core/search_items&sid=${sid}&params=${encodeURIComponent(JSON.stringify({
      spec: { itemsType: "avl_unit", propName: "sys_name", propValueMask: "*", sortType: "sys_name" },
      force: 1,
      flags: 1 + 1024, // base + last message
      from: 0,
      to: 0
    }))}`);
    const unitsJson = await unitsResp.json();

    const units = unitsJson.items || [];
    const gpsEntries = units.map((unit: any) => ({
      id: unit.id,
      name: unit.nm,
      lat: unit.pos.y,
      lon: unit.pos.x,
      speed: unit.pos.s,
      timestamp: new Date(unit.pos.t * 1000).toISOString(),
    }));

    // Step 3: Store into Firestore
    const batch = admin.firestore().batch();
    gpsEntries.forEach((entry: { id: string; name: string; lat: number; lon: number; speed: number; timestamp: string }) => {
      const ref = admin.firestore().collection('wialon_tracking').doc(entry.name);
      batch.set(ref, entry, { merge: true });
    });

    await batch.commit();
    console.log(`✅ Successfully saved ${gpsEntries.length} GPS points from Wialon`);

  } catch (err) {
    console.error('❌ Error fetching Wialon data:', err);
  }
});
