# Google Apps Scripts for Webhook Integration

Here are the Google Apps Script code snippets for the trip and driver behavior webhooks. You will need to deploy these scripts as web apps in your Google account.

## Trip Import Webhook Script

This script reads trip data from a Google Sheet named "loads" and posts it to your Firebase function.

**Instructions:**
1.  Open [Google Apps Script](https://script.google.com/home).
2.  Create a new project.
3.  Copy and paste the code below into the `Code.gs` file.
4.  Update the `FIREBASE_URL` constant with your Firebase function URL for trip imports.
5.  Go to **Deploy > New deployment**.
6.  Select "Web app" as the deployment type.
7.  Configure the web app with the following settings:
    *   **Execute as:** Me
    *   **Who has access:** Anyone
8.  Click **Deploy**.

**Code:**
```javascript
function postTripsToFirebase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('loads');
  const data = sheet.getDataRange().getValues();
  data.shift(); // remove headers

  const props = PropertiesService.getScriptProperties();
  let sentRefs = props.getProperty('sentRefs');
  sentRefs = sentRefs ? JSON.parse(sentRefs) : [];

  const tripsToPost = [];

  data.forEach(row => {
    const [
      fleetNumber,     // A
      driverName,      // B
      clientType,      // C
      clientName,      // D
      loadRef,         // E
      route,           // F
      shippedStatus,   // G
      shippedDate,     // H
      ,                // I - unused
      deliveredStatus, // J
      deliveredDate    // K
    ] = row;

    // Skip already sent loadRefs
    if (sentRefs.includes(loadRef)) return;

    // Build payload
    const trip = {
      fleetNumber,
      driverName,
      clientType,
      clientName,
      loadRef,
      route,
      shippedStatus,
      shippedDate: shippedDate instanceof Date ? shippedDate.toISOString() : "",
      deliveredStatus,
      deliveredDate: deliveredDate instanceof Date ? deliveredDate.toISOString() : "",
      createdAt: new Date().toISOString()
    };

    tripsToPost.push(trip);
    sentRefs.push(loadRef);
  });

  if (tripsToPost.length === 0) return;

  const firebaseUrl = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/importTripsFromWebBook';

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify({ trips: tripsToPost })
  };

  const response = UrlFetchApp.fetch(firebaseUrl, options);
  Logger.log(response.getContentText());

  props.setProperty('sentRefs', JSON.stringify(sentRefs));
}
```

## Driver Behavior Import Webhook Script

This script reads driver behavior data from a Google Sheet named "driver_behavior" and posts it to your Firebase function.

**Instructions:**
Follow the same deployment instructions as the Trip Import Webhook Script, but use the code below.

**Code:**
```javascript
function postDriverBehaviorToFirebase() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("driver_behavior");
  const data = sheet.getDataRange().getValues();
  data.shift(); // remove header row

  const props = PropertiesService.getScriptProperties();
  let sentRefs = props.getProperty('sentEventRefs');
  sentRefs = sentRefs ? JSON.parse(sentRefs) : [];

  const eventsToPost = [];

  data.forEach((row, index) => {
    const [
      fleetNumber,   // A
      driverName,    // B
      eventType,     // C
      eventTime,     // D
      cameraId,      // E
      videoUrl,      // F
      severity,      // G
      eventScore,    // H
      notes          // I
    ] = row;

    const uniqueKey = `${fleetNumber}_${eventType}_${eventTime}`;
    if (sentRefs.includes(uniqueKey)) return;

    eventsToPost.push({
      fleetNumber,
      driverName,
      eventType,
      eventTime: eventTime instanceof Date ? eventTime.toISOString() : "",
      cameraId,
      videoUrl,
      severity,
      eventScore,
      notes,
      createdAt: new Date().toISOString()
    });

    sentRefs.push(uniqueKey);
  });

  if (eventsToPost.length === 0) return;

  const firebaseUrl = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/importDriverBehaviorWebhook';

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify({ events: eventsToPost })
  };

  const response = UrlFetchApp.fetch(firebaseUrl, options);
  Logger.log(response.getContentText());

  props.setProperty('sentEventRefs', JSON.stringify(sentRefs));
}

## Telematics Driver Event Webhook Script

This script sends a sample driver event to your telematics webhook.

**Code:**
```javascript
function postDriverEvent() {
  const firebaseUrl = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/telematicsDriverEventWebhook';

  const eventData = {
    driverId: 'driver-123',
    eventType: 'speeding',
    value: 85,
    timestamp: new Date().toISOString(),
    location: {
      lat: 34.0522,
      lon: -118.2437
    },
    vehicleId: 'vehicle-abc'
  };

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(eventData)
  };

  const response = UrlFetchApp.fetch(firebaseUrl, options);
  Logger.log(response.getContentText());
}
```

## Telematics Trip Update Webhook Script

This script sends a sample trip update to your telematics webhook.

**Code:**
```javascript
function postTripUpdate() {
  const firebaseUrl = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/telematicsTripUpdateWebhook';

  const tripData = {
    tripId: 'trip-xyz-789',
    status: 'trip_started',
    timestamp: new Date().toISOString(),
    driverId: 'driver-456',
    vehicleId: 'vehicle-def',
    location: {
      lat: 37.7749,
      lon: -122.4194
    }
  };

  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(tripData)
  };

  const response = UrlFetchApp.fetch(firebaseUrl, options);
  Logger.log(response.getContentText());
}
```