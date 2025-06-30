# Google Apps Scripts for Webhook Integration

Here are the enhanced Google Apps Script code snippets for the trip and driver behavior webhooks with improved logging, validation, and error handling.

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
// Global constants
const FIREBASE_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/importTripsFromWebBook';
const DEBUG_MODE = true; // Set to true for additional logging

/**
 * Posts trips from Google Sheet to Firebase
 * This function should be run on a trigger or manually
 */
function postTripsToFirebase() {
  Logger.log("🚀 Starting trip import process...");
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('loads');
    
    if (!sheet) {
      Logger.log("❌ ERROR: Sheet 'loads' not found in the spreadsheet.");
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      Logger.log("ℹ️ No data found or only headers present in the sheet.");
      return;
    }
    
    data.shift(); // remove headers
    
    const props = PropertiesService.getScriptProperties();
    let sentRefs = props.getProperty('sentRefs');
    sentRefs = sentRefs ? JSON.parse(sentRefs) : [];
    
    if (DEBUG_MODE) {
      Logger.log(`ℹ️ Found ${data.length} rows of data. Previously sent: ${sentRefs.length} load references.`);
    }

    const tripsToPost = [];
    const errors = [];

    data.forEach((row, index) => {
      try {
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

        // Validate required fields
        if (!loadRef) {
          errors.push(`Row ${index + 2}: Missing required field 'loadRef'`);
          return;
        }

        // Skip already sent loadRefs
        if (sentRefs.includes(loadRef)) {
          if (DEBUG_MODE) Logger.log(`ℹ️ Skipping row ${index + 2} - loadRef ${loadRef} already sent.`);
          return;
        }

        // Build payload - normalize data types
        const trip = {
          fleetNumber: fleetNumber || "",
          driverName: driverName || "",
          clientType: clientType || "",
          clientName: clientName || "",
          loadRef: String(loadRef), // Ensure loadRef is a string
          route: route || "",
          shippedStatus: Boolean(shippedStatus),
          shippedDate: shippedDate instanceof Date ? shippedDate.toISOString() : "",
          deliveredStatus: Boolean(deliveredStatus),
          deliveredDate: deliveredDate instanceof Date ? deliveredDate.toISOString() : "",
          createdAt: new Date().toISOString(),
          importSource: "web_book",
          importTimestamp: new Date().toISOString()
        };

        // Log the exact trip data being sent
        if (DEBUG_MODE) {
          Logger.log(`ℹ️ Trip data for loadRef ${loadRef}:`);
          Logger.log(JSON.stringify(trip, null, 2));
        }

        tripsToPost.push(trip);
        sentRefs.push(loadRef);
      } catch (rowError) {
        errors.push(`Error processing row ${index + 2}: ${rowError.message}`);
      }
    });

    if (errors.length > 0) {
      Logger.log("⚠️ Errors encountered during data processing:");
      errors.forEach(error => Logger.log(` - ${error}`));
    }

    if (tripsToPost.length === 0) {
      Logger.log("ℹ️ No new trips to post. Process complete.");
      return;
    }

    Logger.log(`🔄 Sending ${tripsToPost.length} trips to Firebase...`);

    // Prepare the payload
    const payload = JSON.stringify({ 
      trips: tripsToPost,
      meta: {
        source: "google_sheet",
        timestamp: new Date().toISOString(),
        count: tripsToPost.length
      }
    });
    
    const options = {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'Content-Length': payload.length.toString(),
        'X-Source': 'google-apps-script',
        'X-Batch-Size': tripsToPost.length.toString()
      },
      payload: payload,
      muteHttpExceptions: true // To catch HTTP errors in code
    };
    
    // Send the request
    const response = UrlFetchApp.fetch(FIREBASE_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log(`📥 Response Code: ${responseCode}`);
    
    if (responseCode >= 200 && responseCode < 300) {
      // Success - save the sent references
      props.setProperty('sentRefs', JSON.stringify(sentRefs));
      
      // Parse response to get import summary
      try {
        const responseData = JSON.parse(responseText);
        Logger.log(`✅ Import successful! Imported: ${responseData.imported}, Skipped: ${responseData.skipped}`);
        
        if (DEBUG_MODE && responseData.processingDetails) {
          Logger.log("📋 Processing details:");
          Logger.log(JSON.stringify(responseData.processingDetails, null, 2));
        }
      } catch (e) {
        Logger.log(`⚠️ Could not parse response JSON: ${e}`);
        Logger.log(`Raw response: ${responseText}`);
      }
    } else {
      Logger.log(`❌ Error sending trips to Firebase (HTTP ${responseCode}): ${responseText}`);
    }
    
    Logger.log("🏁 Trip import process completed.");
  } catch (error) {
    Logger.log(`❌ Critical error in postTripsToFirebase: ${error.message}`);
    Logger.log(`Stack trace: ${error.stack}`);
  }
}

/**
 * Manual trigger function for testing
 */
function testTripImport() {
  Logger.log("🧪 Running trip import in TEST mode...");
  postTripsToFirebase();
}
```

## Driver Behavior Import Webhook Script

This script reads driver behavior data from a Google Sheet named "driver_behavior" and posts it to your Firebase function.

**Instructions:**
Follow the same deployment instructions as the Trip Import Webhook Script, but use the code below.

**Code:**
```javascript
// Global constants
const FIREBASE_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/importDriverBehaviorWebhook';
const COLLECTION_NAME = 'driverBehaviorEvents'; // Match this with Firebase collection name
const DEBUG_MODE = true; // Set to true for additional logging

/**
 * Posts driver behavior events from Google Sheet to Firebase
 * This function should be run on a trigger or manually
 */
function postDriverBehaviorToFirebase() {
  Logger.log("🚀 Starting driver behavior import process...");
  
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("driver_behavior");
    
    if (!sheet) {
      Logger.log("❌ ERROR: Sheet 'driver_behavior' not found in the spreadsheet.");
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      Logger.log("ℹ️ No data found or only headers present in the sheet.");
      return;
    }
    
    // Verify header row to ensure column mapping is correct
    const headers = data[0];
    const expectedHeaders = ["Fleet Number", "Driver Name", "Event Type", "Event Time", "Camera ID", "Video URL", "Severity", "Event Score", "Notes"];
    const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
    
    if (missingHeaders.length > 0) {
      Logger.log(`⚠️ Warning: Some expected headers are missing: ${missingHeaders.join(", ")}`);
      Logger.log(`Actual headers: ${headers.join(", ")}`);
    }
    
    data.shift(); // remove header row
    
    const props = PropertiesService.getScriptProperties();
    let sentRefs = props.getProperty('sentEventRefs');
    sentRefs = sentRefs ? JSON.parse(sentRefs) : [];
    
    if (DEBUG_MODE) {
      Logger.log(`ℹ️ Found ${data.length} rows of data. Previously sent: ${sentRefs.length} events.`);
    }

    const eventsToPost = [];
    const errors = [];

    data.forEach((row, index) => {
      try {
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

        // Skip empty rows or rows without key data
        if (!fleetNumber || !eventType || !eventTime) {
          errors.push(`Row ${index + 2}: Missing required fields (fleetNumber, eventType, or eventTime)`);
          return;
        }

        const uniqueKey = `${fleetNumber}_${eventType}_${eventTime instanceof Date ? eventTime.toISOString() : eventTime}`;
        if (sentRefs.includes(uniqueKey)) {
          if (DEBUG_MODE) Logger.log(`ℹ️ Skipping row ${index + 2} - Event ${uniqueKey} already sent.`);
          return;
        }

        // Build payload - normalize data types
        const event = {
          fleetNumber: String(fleetNumber),
          driverName: String(driverName || ""),
          eventType: String(eventType),
          eventTime: eventTime instanceof Date ? eventTime.toISOString() : String(eventTime),
          cameraId: cameraId ? String(cameraId) : "",
          videoUrl: videoUrl ? String(videoUrl) : "",
          severity: severity ? String(severity) : "medium",
          eventScore: typeof eventScore === 'number' ? eventScore : parseFloat(eventScore) || 0,
          notes: notes ? String(notes) : "",
          createdAt: new Date().toISOString(),
          importSource: "web_book",
          uniqueKey: uniqueKey, // Add uniqueKey for deduplication in Firebase
          collection: COLLECTION_NAME // Inform Firebase which collection to use
        };

        // Log the exact event data being sent
        if (DEBUG_MODE) {
          Logger.log(`ℹ️ Event data for ${uniqueKey}:`);
          Logger.log(JSON.stringify(event, null, 2));
        }

        eventsToPost.push(event);
        sentRefs.push(uniqueKey);
      } catch (rowError) {
        errors.push(`Error processing row ${index + 2}: ${rowError.message}`);
      }
    });

    if (errors.length > 0) {
      Logger.log("⚠️ Errors encountered during data processing:");
      errors.forEach(error => Logger.log(` - ${error}`));
    }

    if (eventsToPost.length === 0) {
      Logger.log("ℹ️ No new driver behavior events to post. Process complete.");
      return;
    }

    Logger.log(`🔄 Sending ${eventsToPost.length} driver behavior events to Firebase...`);

    // Prepare the payload with metadata
    const payload = JSON.stringify({ 
      events: eventsToPost,
      meta: {
        source: "google_sheet",
        timestamp: new Date().toISOString(),
        count: eventsToPost.length,
        targetCollection: COLLECTION_NAME
      }
    });
    
    const options = {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'Content-Length': payload.length.toString(),
        'X-Source': 'google-apps-script',
        'X-Batch-Size': eventsToPost.length.toString(),
        'X-Target-Collection': COLLECTION_NAME
      },
      payload: payload,
      muteHttpExceptions: true // To catch HTTP errors in code
    };
    
    // Send the request
    const response = UrlFetchApp.fetch(FIREBASE_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log(`📥 Response Code: ${responseCode}`);
    
    if (responseCode >= 200 && responseCode < 300) {
      // Success - save the sent references
      props.setProperty('sentEventRefs', JSON.stringify(sentRefs));
      
      // Parse response to get import summary
      try {
        const responseData = JSON.parse(responseText);
        Logger.log(`✅ Import successful! Imported: ${responseData.imported}, Skipped: ${responseData.skipped}`);
        
        if (DEBUG_MODE && responseData.processingDetails) {
          Logger.log("📋 Processing details:");
          Logger.log(JSON.stringify(responseData.processingDetails, null, 2));
        }
      } catch (e) {
        Logger.log(`⚠️ Could not parse response JSON: ${e}`);
        Logger.log(`Raw response: ${responseText}`);
      }
    } else {
      Logger.log(`❌ Error sending driver behavior events to Firebase (HTTP ${responseCode}): ${responseText}`);
    }
    
    Logger.log("🏁 Driver behavior import process completed.");
  } catch (error) {
    Logger.log(`❌ Critical error in postDriverBehaviorToFirebase: ${error.message}`);
    Logger.log(`Stack trace: ${error.stack}`);
  }
}

/**
 * Manual trigger function for testing
 */
function testDriverBehaviorImport() {
  Logger.log("🧪 Running driver behavior import in TEST mode...");
  postDriverBehaviorToFirebase();
}
```

## Telematics Driver Event Webhook Script

This script sends a sample driver event to your telematics webhook.

**Code:**
```javascript
// Telematics endpoint URLs
const TELEMATICS_DRIVER_EVENT_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/telematicsDriverEventWebhook';

/**
 * Posts a test driver event to the telematics webhook
 */
function postDriverEvent() {
  Logger.log("🚀 Sending test driver event to telematics webhook...");
  
  try {
    // Create a test event with the exact fields the webhook expects
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

    // Log the payload
    Logger.log("📤 Sending payload:");
    Logger.log(JSON.stringify(eventData, null, 2));

    // Prepare the payload
    const payload = JSON.stringify(eventData);
    
    const options = {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'Content-Length': payload.length.toString(),
        'X-Source': 'google-apps-script-test',
        'X-Test-Mode': 'true'
      },
      payload: payload,
      muteHttpExceptions: true
    };

    // Send the request
    const response = UrlFetchApp.fetch(TELEMATICS_DRIVER_EVENT_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log(`📥 Response Code: ${responseCode}`);
    
    if (responseCode >= 200 && responseCode < 300) {
      try {
        const responseData = JSON.parse(responseText);
        Logger.log("✅ Event posted successfully!");
        Logger.log(`Event ID: ${responseData.eventId}`);
        Logger.log(`New safety score: ${responseData.newSafetyScore}`);
        
        if (responseData.alert) {
          Logger.log("⚠️ Alert generated:");
          Logger.log(JSON.stringify(responseData.alert, null, 2));
        }
      } catch (e) {
        Logger.log(`⚠️ Could not parse response JSON: ${e}`);
        Logger.log(`Raw response: ${responseText}`);
      }
    } else {
      Logger.log(`❌ Error posting driver event (HTTP ${responseCode}): ${responseText}`);
    }
  } catch (error) {
    Logger.log(`❌ Critical error in postDriverEvent: ${error.message}`);
    Logger.log(`Stack trace: ${error.stack}`);
  }
}
```

## Telematics Trip Update Webhook Script

This script sends a sample trip update to your telematics webhook.

**Code:**
```javascript
// Telematics endpoint URLs
const TELEMATICS_TRIP_UPDATE_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/telematicsTripUpdateWebhook';

/**
 * Posts a test trip update to the telematics webhook
 * @param {string} status - The trip status: 'trip_started', 'in_progress', or 'trip_ended'
 */
function postTripUpdate(status = 'trip_started') {
  Logger.log(`🚀 Sending test trip ${status} event to telematics webhook...`);
  
  // Validate status parameter
  if (!['trip_started', 'in_progress', 'trip_ended'].includes(status)) {
    Logger.log(`❌ Invalid status: ${status}. Must be 'trip_started', 'in_progress', or 'trip_ended'.`);
    return;
  }
  
  try {
    // Create a unique trip ID based on timestamp
    const tripId = `trip-test-${Date.now()}`;
    
    // Create base trip data
    const tripData = {
      tripId: tripId,
      status: status,
      timestamp: new Date().toISOString(),
      driverId: 'driver-456',
      vehicleId: 'vehicle-def',
      location: {
        lat: 37.7749,
        lon: -122.4194
      }
    };
    
    // Add status-specific fields
    if (status === 'in_progress') {
      tripData.speed = 65; // Add speed for in_progress updates
    }
    
    // Log the payload
    Logger.log("📤 Sending payload:");
    Logger.log(JSON.stringify(tripData, null, 2));

    // Prepare the payload
    const payload = JSON.stringify(tripData);
    
    const options = {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'Content-Length': payload.length.toString(),
        'X-Source': 'google-apps-script-test',
        'X-Test-Mode': 'true'
      },
      payload: payload,
      muteHttpExceptions: true
    };

    // Send the request
    const response = UrlFetchApp.fetch(TELEMATICS_TRIP_UPDATE_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log(`📥 Response Code: ${responseCode}`);
    
    if (responseCode >= 200 && responseCode < 300) {
      try {
        const responseData = JSON.parse(responseText);
        Logger.log("✅ Trip update posted successfully!");
        Logger.log(`Message: ${responseData.message}`);
        
        if (responseData.trip) {
          Logger.log("📋 Trip details:");
          Logger.log(JSON.stringify(responseData.trip, null, 2));
        }
      } catch (e) {
        Logger.log(`⚠️ Could not parse response JSON: ${e}`);
        Logger.log(`Raw response: ${responseText}`);
      }
    } else {
      Logger.log(`❌ Error posting trip update (HTTP ${responseCode}): ${responseText}`);
    }
  } catch (error) {
    Logger.log(`❌ Critical error in postTripUpdate: ${error.message}`);
    Logger.log(`Stack trace: ${error.stack}`);
  }
}

/**
 * Helper functions to test different trip statuses
 */
function testTripStart() {
  postTripUpdate('trip_started');
}

function testTripProgress() {
  postTripUpdate('in_progress');
}

function testTripEnd() {
  postTripUpdate('trip_ended');
}

/**
 * Simulates a complete trip lifecycle
 */
function simulateCompleteTripJourney() {
  Logger.log("🚀 Starting complete trip journey simulation...");
  
  // Generate a consistent trip ID for this journey
  const tripId = `trip-sim-${Date.now()}`;
  
  // Step 1: Start the trip
  simulateTripEvent(tripId, 'trip_started');
  
  // Wait 2 seconds
  Utilities.sleep(2000);
  
  // Step 2: Update trip progress
  simulateTripEvent(tripId, 'in_progress', 65);
  
  // Wait 2 seconds
  Utilities.sleep(2000);
  
  // Step 3: End the trip
  simulateTripEvent(tripId, 'trip_ended');
  
  Logger.log("🏁 Trip journey simulation completed!");
}

/**
 * Helper function for trip simulation
 */
function simulateTripEvent(tripId, status, speed = 0) {
  Logger.log(`📍 Simulating trip event: ${status} for trip ${tripId}`);
  
  try {
    // Create trip data
    const tripData = {
      tripId: tripId,
      status: status,
      timestamp: new Date().toISOString(),
      driverId: 'driver-456',
      vehicleId: 'vehicle-def',
      location: {
        lat: 37.7749 + (Math.random() * 0.01),  // Add slight variation for movement
        lon: -122.4194 + (Math.random() * 0.01)
      }
    };
    
    // Add status-specific fields
    if (status === 'in_progress') {
      tripData.speed = speed;
    }
    
    // Prepare the payload
    const payload = JSON.stringify(tripData);
    
    const options = {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'Content-Length': payload.length.toString(),
        'X-Source': 'google-apps-script-simulation',
        'X-Simulation': 'true'
      },
      payload: payload,
      muteHttpExceptions: true
    };

    // Send the request
    const response = UrlFetchApp.fetch(TELEMATICS_TRIP_UPDATE_URL, options);
    const responseCode = response.getResponseCode();
    
    Logger.log(`📥 ${status} Response Code: ${responseCode}`);
  } catch (error) {
    Logger.log(`❌ Error in simulateTripEvent: ${error.message}`);
  }
}
```