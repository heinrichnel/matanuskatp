/**
 * Updated Google Apps Script for Driver Behavior Webhook
 * 
 * This script sends driver behavior events from a Google Sheet to Firebase.
 * It has been updated to ensure proper payload formatting for the enhanced webhook.
 * 
 * Instructions:
 * 1. Open Google Apps Script editor (script.google.com)
 * 2. Create a new project or open your existing driver behavior script
 * 3. Replace the entire content with this code
 * 4. Save and deploy as a web app
 */

// CONFIGURATION - Update these values
const FIREBASE_WEBHOOK_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/importDriverBehaviorWebhook';
const SHEET_NAME = 'driver_behavior';
const COLLECTION_NAME = 'driverBehaviorEvents'; // Updated to match standardized collection name
const DEBUG_MODE = true;

/**
 * Posts driver behavior events from Google Sheet to Firebase
 * This function can be triggered on a schedule or manually
 */
function postDriverBehaviorToFirebase() {
  Logger.log("🚀 Starting driver behavior import process...");
  
  try {
    // Get the sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      Logger.log("❌ ERROR: Sheet '" + SHEET_NAME + "' not found in the spreadsheet.");
      return;
    }
    
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      Logger.log("ℹ️ No data found or only headers present in the sheet.");
      return;
    }
    
    // Get the headers and validate
    const headers = data[0];
    
    // Print actual headers to help with debugging
    Logger.log(`👉 ACTUAL HEADERS in spreadsheet: ${headers.join(", ")}`);
    
    // Define flexible header mapping - add alternate header names that might be used
    const headerMapping = {
      "fleetNumber": ["Fleet Number", "FleetNumber", "Fleet", "Vehicle ID", "Vehicle Number", "Truck Number", "Fleet_Number"],
      "driverName": ["Driver Name", "DriverName", "Driver", "Driver_Name", "Name", "Employee Name"],
      "eventType": ["Event Type", "EventType", "Type", "Event_Type", "Incident Type", "Behavior Type"],
      "eventTime": ["Event Time", "EventTime", "Time", "Event_Time", "Date Time", "DateTime", "Timestamp"],
      "cameraId": ["Camera ID", "CameraID", "Camera", "Camera_ID", "Device ID"],
      "videoUrl": ["Video URL", "VideoURL", "Video", "Video_URL", "Recording URL"],
      "severity": ["Severity", "Priority", "Risk Level", "Impact", "Severity Level"],
      "eventScore": ["Event Score", "EventScore", "Score", "Event_Score", "Points", "Penalty Points"],
      "notes": ["Notes", "Comments", "Description", "Details", "Additional Info"]
    };
    
    // Create a map of actual header indices
    const headerIndices = {};
    
    // For each field we need, try to find a matching header
    Object.keys(headerMapping).forEach(field => {
      const possibleHeaders = headerMapping[field];
      for (const header of possibleHeaders) {
        const index = headers.findIndex(h => 
          String(h).toLowerCase().trim() === String(header).toLowerCase().trim()
        );
        if (index >= 0) {
          headerIndices[field] = index;
          break;
        }
      }
    });
    
    // Log the header mapping results
    Logger.log("📊 Header mapping results:");
    Object.keys(headerIndices).forEach(field => {
      Logger.log(`- ${field}: found at column ${headerIndices[field] + 1} (header: "${headers[headerIndices[field]]}")`);
    });
    
    // Check for missing required fields
    const requiredFields = ["fleetNumber", "eventType", "eventTime"];
    const missingFields = requiredFields.filter(field => headerIndices[field] === undefined);
    
    if (missingFields.length > 0) {
      Logger.log(`⚠️ ERROR: Required header fields missing: ${missingFields.join(", ")}`);
      Logger.log("❌ Cannot proceed without required fields. Check your spreadsheet headers.");
      return;
    }
    
    // Remove header row
    data.shift();
    
    // Get previously sent events to avoid duplicates
    const props = PropertiesService.getScriptProperties();
    let sentRefs = props.getProperty('sentEventRefs');
    sentRefs = sentRefs ? JSON.parse(sentRefs) : [];
    
    if (DEBUG_MODE) {
      Logger.log(`ℹ️ Found ${data.length} rows of data. Previously sent: ${sentRefs.length} events.`);
    }

    // Process the data
    const eventsToPost = [];
    const errors = [];

    data.forEach((row, index) => {
      try {
        // Extract data using the mapped indices
        const fleetNumber = headerIndices.fleetNumber !== undefined ? row[headerIndices.fleetNumber] : null;
        const driverName = headerIndices.driverName !== undefined ? row[headerIndices.driverName] : "";
        const eventType = headerIndices.eventType !== undefined ? row[headerIndices.eventType] : null;
        const eventTime = headerIndices.eventTime !== undefined ? row[headerIndices.eventTime] : null;
        
        // Skip empty rows or rows without key data
        if (!fleetNumber || !eventType || !eventTime) {
          errors.push(`Row ${index + 2}: Missing required fields (fleetNumber, eventType, or eventTime)`);
          return; // Skip this row
        }

        // Generate a unique key for deduplication
        const uniqueKey = `${fleetNumber}_${eventType}_${eventTime instanceof Date ? eventTime.toISOString() : eventTime}`;
        
        // Skip if already sent
        if (sentRefs.includes(uniqueKey)) {
          if (DEBUG_MODE) Logger.log(`ℹ️ Skipping row ${index + 2} - Event ${uniqueKey} already sent.`);
          return; // Skip this row
        }

        // Build the event object with proper types - CRITICAL for webhook validation
        const event = {
          fleetNumber: String(fleetNumber), // Ensure it's a string
          driverName: String(driverName || ""),
          eventType: String(eventType),
          eventTime: eventTime instanceof Date ? eventTime.toISOString() : String(eventTime),
          uniqueKey: uniqueKey // Add for deduplication
        };
        
        // Add optional fields if they exist
        if (headerIndices.cameraId !== undefined && row[headerIndices.cameraId]) {
          event.cameraId = String(row[headerIndices.cameraId]);
        }
        
        if (headerIndices.videoUrl !== undefined && row[headerIndices.videoUrl]) {
          event.videoUrl = String(row[headerIndices.videoUrl]);
        }
        
        if (headerIndices.severity !== undefined && row[headerIndices.severity]) {
          event.severity = String(row[headerIndices.severity]);
        } else {
          event.severity = "medium"; // Default value
        }
        
        if (headerIndices.eventScore !== undefined && row[headerIndices.eventScore]) {
          const rawScore = row[headerIndices.eventScore];
          event.eventScore = typeof rawScore === 'number' ? rawScore : parseFloat(rawScore) || 0;
        } else {
          event.eventScore = 0; // Default value
        }
        
        if (headerIndices.notes !== undefined && row[headerIndices.notes]) {
          event.notes = String(row[headerIndices.notes]);
        }
        
        // Add metadata
        event.createdAt = new Date().toISOString();
        event.importSource = "web_book";
        
        // Log the event data if in debug mode
        if (DEBUG_MODE) {
          Logger.log(`ℹ️ Event data for ${uniqueKey}:`);
          Logger.log(JSON.stringify(event, null, 2));
        }

        // Add to the list of events to post
        eventsToPost.push(event);
        sentRefs.push(uniqueKey);
      } catch (rowError) {
        errors.push(`Error processing row ${index + 2}: ${rowError.message}`);
      }
    });

    // Log any errors
    if (errors.length > 0) {
      Logger.log("⚠️ Errors encountered during data processing:");
      errors.forEach(error => Logger.log(` - ${error}`));
    }

    // If no events to post, we're done
    if (eventsToPost.length === 0) {
      Logger.log("ℹ️ No new driver behavior events to post. Process complete.");
      return;
    }

    Logger.log(`🔄 Sending ${eventsToPost.length} driver behavior events to Firebase...`);

    // CRITICAL: Prepare the payload with the EXACT structure expected by the webhook
    // This is the key part that must match the enhanced webhook validation
    const payload = JSON.stringify({ 
      events: eventsToPost,  // Array of events - MUST use "events" key
      meta: {
        source: "google_sheet",
        timestamp: new Date().toISOString(),
        count: eventsToPost.length,
        targetCollection: COLLECTION_NAME
      }
    });
    
    // Set up the request options
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
    const response = UrlFetchApp.fetch(FIREBASE_WEBHOOK_URL, options);
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
 * Manual trigger function for testing - run this function directly to test
 */
function testDriverBehaviorImport() {
  Logger.log("🧪 Running driver behavior import in TEST mode...");
  postDriverBehaviorToFirebase();
}

/**
 * Adds time-based trigger to run import automatically
 * This is optional - you can run manually instead
 */
function setupDailyTrigger() {
  // Delete any existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'postDriverBehaviorToFirebase') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  
  // Create a new daily trigger
  ScriptApp.newTrigger('postDriverBehaviorToFirebase')
    .timeBased()
    .everyDays(1)
    .atHour(6) // 6 AM
    .create();
  
  Logger.log("✅ Daily trigger set to run import at 6 AM");
}

/**
 * Creates a custom menu in the Google Sheet
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Driver Behavior')
    .addItem('Import Events to Firebase', 'testDriverBehaviorImport')
    .addItem('Setup Daily Import Trigger', 'setupDailyTrigger')
    .addToUi();
}