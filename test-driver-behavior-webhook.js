/**
 * Test script for Driver Behavior Webhook
 * 
 * This script tests the importDriverBehaviorWebhook cloud function
 * using various test cases to validate functionality.
 */

// Import required modules
const fetch = require('node-fetch');

// Webhook configuration
const DRIVER_BEHAVIOR_WEBHOOK_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/importDriverBehaviorWebhook';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

// Utility Functions
async function sendDriverBehaviorEvent(payload, testName) {
    console.log(`\n📤 Running test: ${testName}`);
    console.log(`📤 Sending driver behavior event to webhook: ${DRIVER_BEHAVIOR_WEBHOOK_URL}`);
    console.log('Driver behavior event payload:', JSON.stringify(payload, null, 2));

    try {
        // Make the request with retry logic
        const response = await retryWebhookCall(async () => {
            const res = await fetch(DRIVER_BEHAVIOR_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                let errorMessage = `HTTP error! status: ${res.status}`;
                try {
                    const errorText = await res.text();
                    errorMessage += `, message: ${errorText}`;
                    console.error(`Error response from driver behavior webhook: ${errorText}`);
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

        console.log(`✅ Driver behavior event sent successfully:`, responseData);
        console.log(`\nTest: ${testName} - PASSED ✅\n`);
        return responseData;
    } catch (error) {
        console.error(`❌ Test: ${testName} - FAILED ❌`);
        console.error('Failed to send driver behavior event:', error);
        // Re-throw with more diagnostic info
        throw new Error(`Driver behavior webhook failed: ${error.message}. Check network tab for details.`);
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
function generateEventTime() {
    return new Date().toISOString();
}

function generateUniqueFleetNumber() {
    const fleetPrefixes = ['MT-', 'NAM-', 'ZA-'];
    const prefix = fleetPrefixes[Math.floor(Math.random() * fleetPrefixes.length)];
    const number = 1000 + Math.floor(Math.random() * 9000);
    return `${prefix}${number}`;
}

function generateEventType() {
    const eventTypes = ['harsh_braking', 'speeding', 'sharp_cornering', 'rapid_acceleration', 'sudden_stop'];
    return eventTypes[Math.floor(Math.random() * eventTypes.length)];
}

function generateBasicEvent() {
    return {
        fleetNumber: generateUniqueFleetNumber(),
        eventType: generateEventType(),
        eventTime: generateEventTime()
    };
}

function generateFullEvent() {
    const drivers = ['John Smith', 'Maria Garcia', 'David Chen', 'Emma Johnson', 'Ahmed Hassan'];
    const locations = ['Windhoek Main Road', 'Swakopmund Highway', 'Cape Town N2', 'Johannesburg M1', 'Gaborone A1'];
    const severities = ['low', 'medium', 'high', 'critical'];

    return {
        ...generateBasicEvent(),
        driverName: drivers[Math.floor(Math.random() * drivers.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        points: Math.floor(Math.random() * 10) + 1,
        description: `${generateEventType()} event detected during route`,
        location: locations[Math.floor(Math.random() * locations.length)],
        reportedAt: new Date().toISOString(),
        reportedBy: 'Telematics System',
        vehicleType: 'Heavy Truck',
        status: 'pending_review'
    };
}

// Run all tests
async function runAllTests() {
    try {
        console.log('🧪 Starting Driver Behavior Webhook Tests 🧪');
        console.log('=============================================');

        // Valid test cases
        await sendDriverBehaviorEvent({
            events: [generateBasicEvent()]
        }, "Single Valid Event");

        await sendDriverBehaviorEvent({
            events: [generateBasicEvent(), generateBasicEvent(), generateBasicEvent()]
        }, "Multiple Valid Events");

        await sendDriverBehaviorEvent({
            events: [generateFullEvent(), generateFullEvent()]
        }, "Complete Event Objects With Optional Fields");

        // Error test cases
        const missingFleetEvent = generateBasicEvent();
        delete missingFleetEvent.fleetNumber;
        await sendDriverBehaviorEvent({
            events: [missingFleetEvent]
        }, "Missing Fleet Number (Should Fail Validation)").catch(err => console.log('Expected error:', err.message));

        const missingEventTypeEvent = generateBasicEvent();
        delete missingEventTypeEvent.eventType;
        await sendDriverBehaviorEvent({
            events: [missingEventTypeEvent]
        }, "Missing Event Type (Should Fail Validation)").catch(err => console.log('Expected error:', err.message));

        const missingEventTimeEvent = generateBasicEvent();
        delete missingEventTimeEvent.eventTime;
        await sendDriverBehaviorEvent({
            events: [missingEventTimeEvent]
        }, "Missing Event Time (Should Fail Validation)").catch(err => console.log('Expected error:', err.message));

        await sendDriverBehaviorEvent({
            events: []
        }, "Empty Events Array (Should Process Without Imports)").catch(err => console.log('Expected error:', err.message));

        await sendDriverBehaviorEvent({
            data: "This payload is missing the events array"
        }, "No Events Array (Should Fail Validation)").catch(err => console.log('Expected error:', err.message));

        // Edge cases
        const duplicateEvent = generateBasicEvent();
        await sendDriverBehaviorEvent({
            events: [duplicateEvent]
        }, "First Attempt of Duplicate Event");

        // Send the exact same event again - should be skipped by webhook
        await sendDriverBehaviorEvent({
            events: [duplicateEvent]
        }, "Second Attempt of Duplicate Event (Should Skip)");

        // Large payload test
        const largeEventArray = Array(20).fill(null).map(() => generateFullEvent());
        await sendDriverBehaviorEvent({
            events: largeEventArray
        }, "Large Payload (20 Events)");

        console.log('\n📊 Test Summary 📊');
        console.log('=============================================');
        console.log('All tests completed. Check logs for details on test outcomes.');

    } catch (error) {
        console.error('Error running tests:', error);
    }
}

// Run the tests
runAllTests();