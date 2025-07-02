/**
 * Improved WebBook Import Webhook Test Script
 * 
 * This script provides a safer, more robust way to test the importTripsFromWebBook
 * Cloud Function with proper environment controls and validation.
 */

// Import required modules
const fetch = require('node-fetch');

// Environment Configuration
const ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = ENV === 'production';

// Webhook Configuration with environment-based URLs
const WEBHOOK_URLS = {
  development: 'http://localhost:5001/mat1-9e6b3/us-central1/importTripsFromWebBook',
  staging: 'https://staging-us-central1-mat1-9e6b3.cloudfunctions.net/importTripsFromWebBook',
  production: 'https://us-central1-mat1-9e6b3.cloudfunctions.net/importTripsFromWebBook'
};

const WEBBOOK_WEBHOOK_URL = WEBHOOK_URLS[ENV];
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

// Safety warning for production tests
if (IS_PRODUCTION) {
  console.warn('\n⚠️ WARNING: YOU ARE RUNNING TESTS AGAINST PRODUCTION! ⚠️');
  console.warn('This may create test data in your production environment.');
  console.warn('Press Ctrl+C to cancel or wait 5 seconds to continue...\n');
  
  // Add a 5-second delay to allow cancellation
  const waitUntil = Date.now() + 5000;
  while (Date.now() < waitUntil) {
    // Busy wait to allow interrupt
  }
}

// Validate webhook payload before sending
function validateWebhookPayload(payload) {
  // Check for trips array
  if (!payload.trips || !Array.isArray(payload.trips)) {
    return {
      valid: false,
      reason: 'Payload must contain a "trips" array'
    };
  }

  // Empty trips array is technically valid, but likely not intentional
  if (payload.trips.length === 0) {
    return {
      valid: true,
      warning: 'Trips array is empty - no data will be imported'
    };
  }

  // Validate each trip in the array
  const invalidTrips = [];
  
  payload.trips.forEach((trip, index) => {
    const requiredFields = ['loadRef'];
    const missingFields = requiredFields.filter(field => !trip[field]);
    
    if (missingFields.length > 0) {
      invalidTrips.push({
        index,
        reason: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
  });

  if (invalidTrips.length > 0) {
    return {
      valid: false,
      reason: 'Some trips are missing required fields',
      details: invalidTrips
    };
  }

  return { valid: true };
}

// Utility Functions
async function sendWebBookImport(payload, testName, skipValidation = false) {
  console.log(`\n📤 Running test: ${testName}`);
  console.log(`📤 Environment: ${ENV}`);
  console.log(`📤 Target endpoint: ${WEBBOOK_WEBHOOK_URL}`);
  console.log('📤 WebBook import payload:', JSON.stringify(payload, null, 2));

  // Validate payload unless explicitly skipped
  if (!skipValidation) {
    const validation = validateWebhookPayload(payload);
    
    if (!validation.valid) {
      console.error(`❌ Invalid payload: ${validation.reason}`);
      if (validation.details) {
        console.error('Details:', validation.details);
      }
      console.error(`\nTest: ${testName} - SKIPPED (Invalid Payload) ⚠️\n`);
      return { skipped: true, reason: validation.reason };
    }
    
    if (validation.warning) {
      console.warn(`⚠️ Warning: ${validation.warning}`);
    }
  }

  try {
    // Make the request with retry logic
    const response = await retryWebhookCall(async () => {
      const res = await fetch(WEBBOOK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Test-Mode': 'true',
          'X-Environment': ENV
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = `HTTP error! status: ${res.status}`;
        try {
          const errorText = await res.text();
          errorMessage += `, message: ${errorText}`;
          console.error(`Error response from WebBook import webhook: ${errorText}`);
        } catch (err) {
          // If we can't read the response body, just use the status
          console.error(`Could not read error response body: ${err}`);
        }
        throw new Error(errorMessage);
      }

      return res;
    });

    // Try to parse JSON response, but handle text responses too
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = { message: text };
    }

    console.log(`✅ WebBook import sent successfully:`, responseData);
    console.log(`\nTest: ${testName} - PASSED ✅\n`);
    return responseData;
  } catch (error) {
    console.error(`❌ Test: ${testName} - FAILED ❌`);
    console.error('Failed to send WebBook import:', error);
    return { error: error.message };
  }
}

// Retry webhook call with exponential backoff
async function retryWebhookCall(callFn, maxRetries = MAX_RETRIES, initialDelay = INITIAL_RETRY_DELAY) {
  let lastError = null;
  let attempt = 1;
  let delay = initialDelay;

  while (attempt <= maxRetries) {
    try {
      console.log(`🔄 Webhook call attempt ${attempt}/${maxRetries}`);
      const response = await callFn();
      return response;
    } catch (error) {
      lastError = error;
      console.warn(`❌ Attempt ${attempt}/${maxRetries} failed:`, error.message);

      if (attempt < maxRetries) {
        console.log(`⏱️ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        attempt++;
      } else {
        break;
      }
    }
  }

  throw lastError || new Error('All webhook call attempts failed');
}

// Helper functions for generating test data
function generateLoadRef() {
  const prefixes = ['LOAD-', 'REF-', 'JOB-'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = 10000 + Math.floor(Math.random() * 90000);
  return `${prefix}${number}`;
}

function generateBasicTrip() {
  return {
    loadRef: generateLoadRef(),
    status: "active"
  };
}

function generateFullTrip() {
  const customers = ['ABC Logistics', 'XYZ Transport', 'Global Shipping', 'Fast Freight', 'Reliable Cargo'];
  const origins = ['Cape Town', 'Johannesburg', 'Durban', 'Windhoek', 'Gaborone'];
  const destinations = ['Port Elizabeth', 'Pretoria', 'Bloemfontein', 'Swakopmund', 'Walvis Bay'];
  
  return {
    ...generateBasicTrip(),
    customer: customers[Math.floor(Math.random() * customers.length)],
    origin: origins[Math.floor(Math.random() * origins.length)],
    destination: destinations[Math.floor(Math.random() * destinations.length)],
    distance: Math.floor(Math.random() * 1000) + 100,
    revenue: Math.floor(Math.random() * 10000) + 1000,
    currency: Math.random() > 0.5 ? 'ZAR' : 'USD',
    loadDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    shippedStatus: false,
    deliveredStatus: false,
    completedStatus: false
  };
}

function generateTripWithStatus(status) {
  const trip = generateFullTrip();
  
  if (status === 'shipped') {
    trip.shippedStatus = true;
    trip.shippedDate = new Date(Date.now() - 86400000).toISOString();
  } else if (status === 'delivered') {
    trip.shippedStatus = true;
    trip.deliveredStatus = true;
    trip.shippedDate = new Date(Date.now() - 86400000 * 2).toISOString();
    trip.deliveredDate = new Date(Date.now() - 86400000).toISOString();
  } else if (status === 'completed') {
    trip.shippedStatus = true;
    trip.deliveredStatus = true;
    trip.completedStatus = true;
    trip.shippedDate = new Date(Date.now() - 86400000 * 3).toISOString();
    trip.deliveredDate = new Date(Date.now() - 86400000 * 2).toISOString();
    trip.completedDate = new Date(Date.now() - 86400000).toISOString();
  }
  
  return trip;
}

// Run all tests
async function runValidTests() {
  try {
    console.log('🧪 Starting WebBook Import Webhook Tests - VALID PAYLOADS 🧪');
    console.log('===========================================================');

    // Valid test cases
    await sendWebBookImport({
      trips: [generateBasicTrip()]
    }, "Single Valid Trip");

    await sendWebBookImport({
      trips: [generateBasicTrip(), generateBasicTrip(), generateBasicTrip()]
    }, "Multiple Valid Trips");

    await sendWebBookImport({
      trips: [generateFullTrip(), generateFullTrip()]
    }, "Complete Trip Objects With Optional Fields");

    // Status transformation tests
    await sendWebBookImport({
      trips: [
        generateTripWithStatus('active'),
        generateTripWithStatus('shipped'),
        generateTripWithStatus('delivered'),
        generateTripWithStatus('completed')
      ]
    }, "Trips With Different Status Values");

    // Edge cases
    const duplicateTrip = generateBasicTrip();
    await sendWebBookImport({
      trips: [duplicateTrip]
    }, "First Attempt of Duplicate Trip");

    // Send the exact same trip again - should be skipped by webhook
    await sendWebBookImport({
      trips: [duplicateTrip]
    }, "Second Attempt of Duplicate Trip (Should Skip)");

    // Empty trips array test (valid but will import nothing)
    await sendWebBookImport({
      trips: []
    }, "Empty Trips Array (Should Process Without Imports)");
    
    console.log('\n📊 Test Summary - VALID TESTS 📊');
    console.log('===============================');
    console.log('All valid tests completed. Check logs for details on test outcomes.');

  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run invalid tests only if explicitly requested and not in production
async function runInvalidTests() {
  if (IS_PRODUCTION) {
    console.error('❌ INVALID PAYLOAD TESTS DISABLED IN PRODUCTION ❌');
    console.error('Set NODE_ENV to "development" or "staging" to run these tests.');
    return;
  }
  
  try {
    console.log('\n🧪 Starting WebBook Import Webhook Tests - INVALID PAYLOADS 🧪');
    console.log('=============================================================');
    console.log('⚠️ These tests are expected to fail with validation errors. ⚠️\n');

    // Error test cases - these will be skipped by our validation
    // But we can use skipValidation=true to force-send them
    const missingLoadRefTrip = generateBasicTrip();
    delete missingLoadRefTrip.loadRef;
    await sendWebBookImport({
      trips: [missingLoadRefTrip]
    }, "Missing LoadRef (Should Fail Validation)", true);

    await sendWebBookImport({
      data: "This payload is missing the trips array"
    }, "No Trips Array (Should Fail Validation)", true);

    // Test with Cloud Storage object metadata instead of trips data
    await sendWebBookImport({
      name: "imports/trips_data.json",
      bucket: "mat1-9e6b3.appspot.com",
      contentType: "application/json"
    }, "Cloud Storage Metadata Instead of Trips (Should Fail Validation)", true);
    
    console.log('\n📊 Test Summary - INVALID TESTS 📊');
    console.log('=================================');
    console.log('All invalid tests completed. These tests are expected to fail with validation errors.');

  } catch (error) {
    console.error('Error running invalid tests:', error);
  }
}

// Main function
async function main() {
  console.log('🔧 WebBook Import Webhook Test Tool 🔧');
  console.log('=====================================');
  console.log(`Environment: ${ENV}`);
  console.log(`Target URL: ${WEBBOOK_WEBHOOK_URL}`);
  console.log('=====================================\n');
  
  // Always run valid tests
  await runValidTests();
  
  // Only run invalid tests if explicitly requested via command line arg
  const shouldRunInvalidTests = process.argv.includes('--run-invalid-tests');
  if (shouldRunInvalidTests) {
    await runInvalidTests();
  } else {
    console.log('\n⚠️ Invalid payload tests were skipped.');
    console.log('To run invalid tests, add the --run-invalid-tests flag:');
    console.log('  node improved-webbook-import-test.js --run-invalid-tests');
  }
  
  console.log('\n🏁 All requested tests completed! 🏁');
}

// Run the script
main();