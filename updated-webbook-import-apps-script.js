/**
 * Updated Google Apps Script for WebBook Import Webhook
 * 
 * This script sends trip data from a Google Sheet to Firebase.
 * It has been updated to ensure proper payload formatting for the enhanced webhook.
 * 
 * Instructions:
 * 1. Open Google Apps Script editor (script.google.com)
 * 2. Create a new project or open your existing WebBook import script
 * 3. Replace the entire content with this code
 * 4. Save and deploy as a web app
 */

// CONFIGURATION - Update these values
const FIREBASE_WEBHOOK_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/importTripsFromWebBook';
const SHEET_NAME = 'trips';
const COLLECTION_NAME = 'trips';
const DEBUG_MODE = true;

/**
 * Posts trip data from Google Sheet to Firebase
 * This function can be triggered on a schedule or manually
 */
function postTripsToFirebase() {
  Logger.log("🚀 Starting trip import process...");
    
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
    const expectedHeaders = ["Load Ref", "Customer", "Origin", "Destination", "Status", 
                            "Shipped Status", "Delivered Status", "Completed Status", 
                            "Shipped Date", "Delivered Date", "Completed Date"];
    const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
        
    if (missingHeaders.length > 0) {
      Logger.log(`⚠️ Warning: Some expected headers are missing: ${missingHeaders.join(", ")}`);
      Logger.log(`Actual headers: ${headers.join(", ")}`);
    }
        
    // Remove header row
    data.shift();
        
    // Get previously sent trips to avoid duplicates
    const props = PropertiesService.getScriptProperties();
    let sentRefs = props.getProperty('sentTripRefs');
    sentRefs = sentRefs ? JSON.parse(sentRefs) : [];
        
    if (DEBUG_MODE) {
      Logger.log(`ℹ️ Found ${data.length} rows of data. Previously sent: ${sentRefs.length} trips.`);
    }

    // Process the data
    const tripsToPost = [];
    const errors = [];

    data.forEach((row, index) => {
      try {
        // Get column indices (adjust if your sheet has different column order)
        const loadRefIndex = headers.indexOf("Load Ref");
        const customerIndex = headers.indexOf("Customer");
        const originIndex = headers.indexOf("Origin");
        const destinationIndex = headers.indexOf("Destination");
        const statusIndex = headers.indexOf("Status");
        const shippedStatusIndex = headers.indexOf("Shipped Status");
        const deliveredStatusIndex = headers.indexOf("Delivered Status");
        const completedStatusIndex = headers.indexOf("Completed Status");
        const shippedDateIndex = headers.indexOf("Shipped Date");
        const deliveredDateIndex = headers.indexOf("Delivered Date");
        const completedDateIndex = headers.indexOf("Completed Date");
        
        // Extract data from columns
        const loadRef = row[loadRefIndex];
        
        // Skip empty rows or rows without load ref
        if (!loadRef) {
          errors.push(`Row ${index + 2}: Missing required field (loadRef)`);
          return; // Skip this row
        }

        // Generate a unique key for deduplication
        const uniqueKey = String(loadRef);
                
        // Skip if already sent
        if (sentRefs.includes(uniqueKey)) {
          if (DEBUG_MODE) Logger.log(`ℹ️ Skipping row ${index + 2} - Trip ${uniqueKey} already sent.`);
          return; // Skip this row
        }

        // Build the trip object with proper types - CRITICAL for webhook validation
        const trip = {
          loadRef: String(loadRef), // Ensure it's a string
          status: statusIndex >= 0 && row[statusIndex] ? String(row[statusIndex]) : "active"
        };
        
        // Add optional fields if they exist
        if (customerIndex >= 0 && row[customerIndex]) trip.customer = String(row[customerIndex]);
        if (originIndex >= 0 && row[originIndex]) trip.origin = String(row[originIndex]);
        if (destinationIndex >= 0 && row[destinationIndex]) trip.destination = String(row[destinationIndex]);
        
        // Handle status boolean fields
        if (shippedStatusIndex >= 0) {
          const shippedStatus = row[shippedStatusIndex];
          trip.shippedStatus = typeof shippedStatus === 'boolean' ? shippedStatus : 
                              (String(shippedStatus).toLowerCase() === 'true' || 
                               String(shippedStatus).toLowerCase() === 'yes' || 
                               String(shippedStatus) === '1');
        }
        
        if (deliveredStatusIndex >= 0) {
          const deliveredStatus = row[deliveredStatusIndex];
          trip.deliveredStatus = typeof deliveredStatus === 'boolean' ? deliveredStatus : 
                                (String(deliveredStatus).toLowerCase() === 'true' || 
                                 String(deliveredStatus).toLowerCase() === 'yes' || 
                                 String(deliveredStatus) === '1');
        }
        
        if (completedStatusIndex >= 0) {
          const completedStatus = row[completedStatusIndex];
          trip.completedStatus = typeof completedStatus === 'boolean' ? completedStatus : 
                                (String(completedStatus).toLowerCase() === 'true' || 
                                 String(completedStatus).toLowerCase() === 'yes' || 
                                 String(completedStatus) === '1');
        }
        
        // Handle date fields
        if (shippedDateIndex >= 0 && row[shippedDateIndex]) {
          const shippedDate = row[shippedDateIndex];
          trip.shippedDate = shippedDate instanceof Date ? shippedDate.toISOString() : String(shippedDate);
        }
        
        if (deliveredDateIndex >= 0 && row[deliveredDateIndex]) {
          const deliveredDate = row[deliveredDateIndex];
          trip.deliveredDate = deliveredDate instanceof Date ? deliveredDate.toISOString() : String(deliveredDate);
        }
        
        if (completedDateIndex >= 0 && row[completedDateIndex]) {
          const completedDate = row[completedDateIndex];
          trip.completedDate = completedDate instanceof Date ? completedDate.toISOString() : String(completedDate);
        }
        
        // Add metadata
        trip.importSource = "web_book";
        trip.updatedAt = new Date().toISOString();
        
        // Log the trip data if in debug mode
        if (DEBUG_MODE) {
          Logger.log(`ℹ️ Trip data for ${uniqueKey}:`);
          Logger.log(JSON.stringify(trip, null, 2));
        }

        // Add to the list of trips to post
        tripsToPost.push(trip);
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

    // If no trips to post, we're done
    if (tripsToPost.length === 0) {
      Logger.log("ℹ️ No new trips to post. Process complete.");
      return;
    }

    Logger.log(`🔄 Sending ${tripsToPost.length} trips to Firebase...`);

    // CRITICAL: Prepare the payload with the EXACT structure expected by the webhook
    const payload = JSON.stringify({ 
      trips: tripsToPost  // Array of trips - MUST use "trips" key
    });
        
    // Set up the request options
    const options = {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'Content-Length': payload.length.toString(),
        'X-Source': 'google-apps-script',
        'X-Batch-Size': tripsToPost.length.toString(),
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
      props.setProperty('sentTripRefs', JSON.stringify(sentRefs));
            
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
 * Manual trigger function for testing - run this function directly to test
 */
function testTripImport() {
  Logger.log("🧪 Running trip import in TEST mode...");
  postTripsToFirebase();
}

/**
 * Adds time-based trigger to run import automatically
 * This is optional - you can run manually instead
 */
function setupDailyTrigger() {
  // Delete any existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'postTripsToFirebase') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
    
  // Create a new daily trigger
  ScriptApp.newTrigger('postTripsToFirebase')
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
    .createMenu('WebBook Import')
    .addItem('Import Trips to Firebase', 'testTripImport')
    .addItem('Setup Daily Import Trigger', 'setupDailyTrigger')
    .addToUi();
}