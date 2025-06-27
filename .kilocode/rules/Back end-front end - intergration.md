# 🚀 Matanuska Transport – Firebase & Git Integration Protocol

> This document defines Git command usage, Firebase deployment standards, schema structure integrity, data validation logic, and UI linkage requirements.  
> Designed for full compliance in a **production** environment using `mat1-9e6b3` on Firebase.

📅 **Last Updated**: 2025-06-27

---

## 🔧 Command & Deployment Structure

| Section                    | Description                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| **Firebase Deploy**        | All deploys limited to `functions` only for safe updates                    |
| **Git Commands**           | Follows safe `add > commit > pull --rebase > push` sequence                 |
| **Emulator Testing**       | Run in `firebase emulators:start` before any deploy                        |
| **Firestore Rules**        | Full access only in dev – locked down before production                    |
| **Realtime Sync**          | Updates must maintain tripId/fleetNumber links across collections          |
| **Multi-Currency**         | All logic enforces currency binding per trip                               |
| **No Deletion Rule**       | Schema evolution only – no destructive field removal                       |
| **Auto Flags**             | Triggered if attachments missing or trip data incomplete                   |
| **System Costs**           | Auto-generated based on `systemDefaults` using currency + trip length      |

---

## 🔐 Firebase Project Metadata

| Property             | Value                                                              |
|----------------------|---------------------------------------------------------------------|
| Project Name         | `Mat1`                                                              |
| Project ID           | `mat1-9e6b3`                                                        |
| Project Number       | `250085264089`                                                     |
| App ID               | `1:250085264089:web:51c2b209e0265e7d04ccc8`                         |
| DB URL               | `https://mat1-9e6b3-default-rtdb.firebaseio.com`                   |
| Storage              | `mat1-9e6b3.firebasestorage.app`                                   |
| API Key              | `AIzaSyBtq7Z6qqaVmb22d3aNcwNiqkrbGtIhJ7g`                            |
| Admin SDK Email      | `firebase-adminsdk-fbsvc@mat1-9e6b3.iam.gserviceaccount.com`        |
| Region               | `nam5`                                                              |

---

## 🧠 Firebase JS SDK (Frontend Setup)

```ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBtq7Z6qqaVmb22d3aNcwNiqkrbGtIhJ7g",
  authDomain: "mat1-9e6b3.firebaseapp.com",
  databaseURL: "https://mat1-9e6b3-default-rtdb.firebaseio.com",
  projectId: "mat1-9e6b3",
  storageBucket: "mat1-9e6b3.firebasestorage.app",
  messagingSenderId: "250085264089",
  appId: "1:250085264089:web:51c2b209e0265e7d04ccc8",
  measurementId: "G-YHQHSJN5CQ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```

---

## 🔒 Firebase Admin SDK (Backend Setup)

```js
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mat1-9e6b3-default-rtdb.firebaseio.com"
});
```

---

## 🔐 Firestore Rules (Dev Only – tighten before production)

```ts
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## 🧩 Git Best Practices

```bash
git add .
git commit -m "FIX: Improve diesel linkage + system cost validation"
git pull origin main --rebase
git push origin main
```

✅ Never delete types, fields, or Firestore collections  
✅ Always test changes via local emulator  
✅ Schema must support legacy + future data input  
✅ Validate all costs, flags, trips, and currency logic

---

## 🚀 Firebase Deployment

```bash
# Deploy all functions only
firebase deploy --only functions

# Deploy individual function
firebase deploy --only functions:importTripsFromWebBook
firebase deploy --only functions:importDriverBehaviorWebhook
```

---

## 📊 Key Logic Rules

| Area                    | Requirement                                                              |
|--------------------------|-------------------------------------------------------------------------|
| **Trip ↔ Diesel**        | Must match on `tripId` and `fleetNumber`                                |
| **Reefer Diesel**        | Linked only if `isReeferUnit = true`                                    |
| **System Costs**         | Generated from `systemDefaults` (currency, date range logic)            |
| **Attachments Required** | All manual costs must include valid files, else flagged                 |
| **Currency Binding**     | No ZAR costs on USD trips (and vice versa)                              |
| **Trip Completion**      | Blocked if any unresolved flags or missing indirects                    |
| **PDF/Excel Download**   | Enabled only when trip = completed                                      |
| **UI Flag View**         | Non-compliant costs show in `Flagged Trips → Flagged Costs`             |

---

## 📁 Firestore Collections

- `/trips` – trip data, revenue, all cost categories
- `/diesel` – main and reefer diesel linkage
- `/driverBehaviorEvents` – synced & manual behavior logs
- `/indirectCosts` – system overheads by currency/day/km
- `/actionItems` – KPI + CAR report tracking
- `/missedLoads` – client + competitor tracking
- `/systemDefaults` – cost rules per currency
- `/completedTrips` – validated, exportable trip set
- `/flaggedTrips` – in-progress trips with errors/flags

---

## ✅ Final Deployment Checklist

- [x] Firestore schema validated and intact
- [x] Git pull rebased with no conflicts
- [x] Emulator run successful (`firebase emulators:start`)
- [x] Diesel → Trip linkage confirmed on UI
- [x] PDF & Excel downloads enabled for completed trips
- [x] Manual entry vs webhook format tested
- [x] Currency enforcement logic working
- [x] System costs generating by trip duration
- [x] All attachments syncing via blob & size format
- [x] No critical flags outstanding in any trip

---

> Use this guide for every Git commit and Firebase deployment. Ensure schema compatibility across backend/frontend before merging to `main`.

