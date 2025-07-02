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

/* eslint-env googleappsscript */
/* eslint-disable no-unused-vars */
/* global Logger, SpreadsheetApp, PropertiesService, UrlFetchApp, ScriptApp */

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
    
    // Print actual headers to help with debugging
    Logger.log(`👉 ACTUAL HEADERS in spreadsheet: ${headers.join(", ")}`);
    
    // Define flexible header mapping - add alternate header names that might be used
    const headerMapping = {
      "loadRef": ["Load Ref", "LoadRef", "Load_Ref", "Load Reference", "Load ID", "Load#", "Load No"],
      "customer": ["Customer", "Client", "Customer Name", "Client Name", "Customer_Name"],
      "origin": ["Origin", "From", "Origin Location", "Source", "Pickup"],
      "destination": ["Destination", "To", "Dest", "Destination Location", "Delivery"],
      "status": ["Status", "Trip Status", "Load Status", "Delivery Status"],
      "shippedStatus": ["Shipped Status", "Shipped", "Is Shipped", "Shipping Status", "SHIPPED"],
      "deliveredStatus": ["Delivered Status", "Delivered", "Is Delivered", "Delivery Status", "DELIVERED"],
      "completedStatus": ["Completed Status", "Completed", "Is Completed", "Completion Status"],
      "shippedDate": ["Shipped Date", "Ship Date", "Date Shipped", "Shipping Date"],
      "deliveredDate": ["Delivered Date", "Delivery Date", "Date Delivered"],
      "completedDate": ["Completed Date", "Completion Date", "Date Completed"]
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
    const requiredFields = ["loadRef"];
    const missingFields = requiredFields.filter(field => headerIndices[field] === undefined);
    
    if (missingFields.length > 0) {
      Logger.log(`⚠️ ERROR: Required header fields missing: ${missingFields.join(", ")}`);
      Logger.log("❌ Cannot proceed without the Load Ref field. Check your spreadsheet headers.");
      return;
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
        // Extract data using the mapped indices
        const loadRef = headerIndices.loadRef !== undefined ? row[headerIndices.loadRef] : null;
        
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
          status: headerIndices.status !== undefined && row[headerIndices.status] ? 
                  String(row[headerIndices.status]) : "active"
        };
        
        // Add optional fields if they exist
        if (headerIndices.customer !== undefined && row[headerIndices.customer]) {
          trip.customer = String(row[headerIndices.customer]);
        }
        
        if (headerIndices.origin !== undefined && row[headerIndices.origin]) {
          trip.origin = String(row[headerIndices.origin]);
        }
        
        if (headerIndices.destination !== undefined && row[headerIndices.destination]) {
          trip.destination = String(row[headerIndices.destination]);
        }
        
        // Handle status boolean fields
        if (headerIndices.shippedStatus !== undefined) {
          const shippedStatus = row[headerIndices.shippedStatus];
          // Convert various "true" values to actual boolean
          trip.shippedStatus = typeof shippedStatus === 'boolean' ? shippedStatus : 
                              (String(shippedStatus).toLowerCase() === 'true' || 
                               String(shippedStatus).toLowerCase() === 'yes' || 
                               String(shippedStatus).toLowerCase() === 'shipped' ||
                               String(shippedStatus) === '1');
        }
        
        if (headerIndices.deliveredStatus !== undefined) {
          const deliveredStatus = row[headerIndices.deliveredStatus];
          trip.deliveredStatus = typeof deliveredStatus === 'boolean' ? deliveredStatus : 
                                (String(deliveredStatus).toLowerCase() === 'true' || 
                                 String(deliveredStatus).toLowerCase() === 'yes' || 
                                 String(deliveredStatus).toLowerCase() === 'delivered' ||
                                 String(deliveredStatus) === '1');
        }
        
        if (headerIndices.completedStatus !== undefined) {
          const completedStatus = row[headerIndices.completedStatus];
          trip.completedStatus = typeof completedStatus === 'boolean' ? completedStatus : 
                                (String(completedStatus).toLowerCase() === 'true' || 
                                 String(completedStatus).toLowerCase() === 'yes' || 
                                 String(completedStatus).toLowerCase() === 'completed' ||
                                 String(completedStatus) === '1');
        }
        
        // Handle date fields
        if (headerIndices.shippedDate !== undefined && row[headerIndices.shippedDate]) {
          const shippedDate = row[headerIndices.shippedDate];
          trip.shippedDate = shippedDate instanceof Date ? shippedDate.toISOString() : String(shippedDate);
        }
        
        if (headerIndices.deliveredDate !== undefined && row[headerIndices.deliveredDate]) {
          const deliveredDate = row[headerIndices.deliveredDate];
          trip.deliveredDate = deliveredDate instanceof Date ? deliveredDate.toISOString() : String(deliveredDate);
        }
        
        if (headerIndices.completedDate !== undefined && row[headerIndices.completedDate]) {
          const completedDate = row[headerIndices.completedDate];
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
function _testTripImport() {
  Logger.log("🧪 Running trip import in TEST mode...");
  postTripsToFirebase();
}

/**
 * Adds time-based trigger to run import automatically
 * This is optional - you can run manually instead
 */
function _setupDailyTrigger() {
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
function _onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('WebBook Import')
    .addItem('Import Trips to Firebase', '_testTripImport')
    .addItem('Setup Daily Import Trigger', '_setupDailyTrigger')
    .addToUi();
}