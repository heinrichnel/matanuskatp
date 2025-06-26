# Production-Ready Webhook System for Trip Logistics and Driver Behavior

This document outlines a complete, production-ready solution for a webhook-driven system designed to monitor trip logistics and driver behavior. The system consists of two primary components: backend serverless functions for AWS Lambda and client-side JavaScript senders.

## 1. Backend AWS Lambda Functions

Here are the Node.js source code for two separate AWS Lambda handlers. These functions are designed to be deployed as individual AWS Lambda functions.

### `trip-webhook-handler`

This function processes events related to a trip's lifecycle.

**`index.js`**
```javascript
'use strict';

const process = require('process');

// Retrieve the secure API key from environment variables for security
const VALID_API_KEY = process.env.X_API_KEY;

exports.handler = async (event) => {
    // 1. Security Validation: Ensure the request comes from a trusted source
    const apiKey = event.headers['x-api-key'] || event.headers['X-API-Key'];

    if (!apiKey || apiKey !== VALID_API_KEY) {
        console.warn('Unauthorized request: Missing or invalid API key.');
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized: Invalid API Key' }),
        };
    }

    try {
        // 2. Parse the incoming request body
        const body = JSON.parse(event.body);
        const { eventType, timestamp, data } = body;

        // Log the received event for monitoring and debugging
        console.log(`Received event: ${eventType} at ${timestamp}`, JSON.stringify(data, null, 2));

        // 3. Process the event based on its type
        switch (eventType) {
            case 'trip.created':
                // Stub for database insertion
                console.log(`Processing trip.created for tripId: ${data.tripId}`);
                // Example: await db.saveTrip(data);
                break;
            case 'trip.started':
                // Stub for updating trip status
                console.log(`Processing trip.started for tripId: ${data.tripId}`);
                // Example: await db.updateTripStatus(data.tripId, 'in_progress');
                break;
            case 'trip.location.updated':
                // Stub for updating location data
                console.log(`Processing trip.location.updated for tripId: ${data.tripId}`);
                // Example: await db.updateTripLocation(data.tripId, data.currentLocation);
                break;
            case 'trip.completed':
                // Stub for finalizing trip details
                console.log(`Processing trip.completed for tripId: ${data.tripId}`);
                // Example: await db.finalizeTrip(data.tripId);
                break;
            default:
                // Handle unknown event types gracefully
                console.warn(`Unknown eventType: ${eventType}`);
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Bad Request: Unknown event type' }),
                };
        }

        // 4. Send a success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Event processed successfully' }),
        };
    } catch (error) {
        // 5. Handle parsing errors or other exceptions
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};

```

### `driver-behavior-webhook-handler`

This function processes events related to driver safety and performance.

**`index.js`**
```javascript
'use strict';

const process = require('process');

// Retrieve the secure API key from environment variables
const VALID_API_KEY = process.env.X_API_KEY;

exports.handler = async (event) => {
    // 1. Security Validation: Ensure the request is authorized
    const apiKey = event.headers['x-api-key'] || event.headers['X-API-Key'];

    if (!apiKey || apiKey !== VALID_API_KEY) {
        console.warn('Unauthorized request: Missing or invalid API key.');
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Unauthorized: Invalid API Key' }),
        };
    }

    try {
        // 2. Parse the incoming request body
        const body = JSON.parse(event.body);
        const { eventType, timestamp, data } = body;

        // Log the received event for auditing and debugging
        console.log(`Received event: ${eventType} at ${timestamp}`, JSON.stringify(data, null, 2));

        // 3. Process the event based on its type
        switch (eventType) {
            case 'driver.speeding':
                // Stub for logging speeding incidents and alerting
                console.log(`Processing driver.speeding for driverId: ${data.driverId}`);
                // Example: await alerts.notifySupervisor(data.driverId, 'Speeding violation');
                // Example: await db.updateDriverScore(data.driverId, -5);
                break;
            case 'driver.harsh_braking':
                // Stub for logging harsh braking and updating driver score
                console.log(`Processing driver.harsh_braking for driverId: ${data.driverId}`);
                // Example: await db.logSafetyEvent(data);
                // Example: await db.updateDriverScore(data.driverId, -2);
                break;
            case 'driver.rapid_acceleration':
                // Stub for logging rapid acceleration events
                console.log(`Processing driver.rapid_acceleration for driverId: ${data.driverId}`);
                // Example: await db.logSafetyEvent(data);
                // Example: await db.updateDriverScore(data.driverId, -2);
                break;
            default:
                // Handle unknown event types
                console.warn(`Unknown eventType: ${eventType}`);
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Bad Request: Unknown event type' }),
                };
        }

        // 4. Send a success response
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Event processed successfully' }),
        };
    } catch (error) {
        // 5. Handle parsing errors or other exceptions
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
```

## 2. Client-Side JavaScript Webhook Senders

This JavaScript module contains two async functions to send data to the webhook endpoints.

**`webhookSenders.js`**
```javascript
/**
 * Sends a trip-related event to the specified webhook URL.
 *
 * @param {string} webhookUrl - The URL of the trip webhook endpoint.
 * @param {string} apiKey - The secure API key for authorization.
 * @param {object} eventData - The event data payload to send.
 * @returns {Promise<object>} - The JSON response from the server.
 * @throws {Error} - If the request fails or the server returns an error.
 */
export async function sendTripEvent(webhookUrl, apiKey, eventData) {
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
            },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to send trip event:', error);
        throw error;
    }
}

/**
 * Sends a driver behavior event to the specified webhook URL.
 *
 * @param {string} webhookUrl - The URL of the driver behavior webhook endpoint.
 * @param {string} apiKey - The secure API key for authorization.
 * @param {object} eventData - The event data payload to send.
 * @returns {Promise<object>} - The JSON response from the server.
 * @throws {Error} - If the request fails or the server returns an error.
 */
export async function sendDriverBehaviorEvent(webhookUrl, apiKey, eventData) {
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey,
            },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to send driver behavior event:', error);
        throw error;
    }
}

// --- Example Usage ---

// Configuration (replace with your actual deployment details)
const TRIP_WEBHOOK_URL = 'https://your-api-gateway.execute-api.us-east-1.amazonaws.com/prod/trip-webhook';
const DRIVER_BEHAVIOR_WEBHOOK_URL = 'https://your-api-gateway.execute-api.us-east-1.amazonaws.com/prod/driver-behavior-webhook';
const API_KEY = 'your-secure-api-key'; // This should match the key in your Lambda environment variables

// Example 1: Creating a new trip
async function exampleCreateTrip() {
    const tripData = {
        eventType: 'trip.created',
        timestamp: new Date().toISOString(),
        data: {
            tripId: `uuid-${Date.now()}-abc`,
            driverId: 'drv-456',
            vehicleId: 'vcl-789',
            startLocation: { lat: 34.0522, lon: -118.2437 },
            endLocation: { lat: 34.1522, lon: -118.3437 },
        },
    };

    try {
        const result = await sendTripEvent(TRIP_WEBHOOK_URL, API_KEY, tripData);
        console.log('Trip created successfully:', result);
    } catch (error) {
        console.error('Error creating trip:', error.message);
    }
}

// Example 2: Reporting a harsh braking incident
async function exampleReportHarshBraking() {
    const incidentData = {
        eventType: 'driver.harsh_braking',
        timestamp: new Date().toISOString(),
        data: {
            incidentId: `uuid-${Date.now()}-xyz`,
            tripId: 'uuid-1667823456-abc',
            driverId: 'drv-456',
            location: { lat: 34.0987, lon: -118.2876 },
            details: {
                severity: 'high',
            },
        },
    };

    try {
        const result = await sendDriverBehaviorEvent(DRIVER_BEHAVIOR_WEBHOOK_URL, API_KEY, incidentData);
        console.log('Harsh braking incident reported successfully:', result);
    } catch (error) {
        console.error('Error reporting harsh braking:', error.message);
    }
}

// To run the examples:
// exampleCreateTrip();
// exampleReportHarshBraking();