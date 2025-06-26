// ================================================================
// Telematics Monitoring System
// Author: Senior Software Engineer
// Description: A robust Node.js/Express application for tracking
//              and analyzing driver behavior and trip logistics.
// ================================================================

const express = require('express');
const bodyParser = require('body-parser');

// ================================================================
// 1. Configuration (Managed via Environment Variables)
// ================================================================

const config = {
    // Safety score is out of 100. Each event deducts points.
    SAFETY_SCORE_BASE: parseInt(process.env.SAFETY_SCORE_BASE || '100'),
    // Penalties for safety score calculation
    PENALTY_SPEEDING: parseInt(process.env.PENALTY_SPEEDING || '10'),
    PENALTY_HARSH_BRAKING: parseInt(process.env.PENALTY_HARSH_BRAKING || '5'),
    PENALTY_RAPID_ACCELERATION: parseInt(process.env.PENALTY_RAPID_ACCELERATION || '5'),
    PENALTY_SHARP_CORNERING: parseInt(process.env.PENALTY_SHARP_CORNERING || '3'),
    // Thresholds for generating alerts
    SPEEDING_THRESHOLD_MPH: parseInt(process.env.SPEEDING_THRESHOLD_MPH || '80'),
    HARSH_BRAKING_G_FORCE_THRESHOLD: parseFloat(process.env.HARSH_BRAKING_G_FORCE_THRESHOLD || '0.5'),
    // Port for the server to listen on
    PORT: parseInt(process.env.PORT || '3000'),
};

// In-memory database for demonstration purposes.
// In a production environment, use a database like PostgreSQL, MongoDB, or Redis.
const db = {
    drivers: {},
    trips: {},
};


// ================================================================
// 2. Core Logic Functions
// ================================================================

// ----------------------------------------
// Driver Behavior Module
// ----------------------------------------

/**
 * @function logHarshEvent
 * @description Records a specific incident for a driver.
 * @param {string} driverId - The unique identifier for the driver.
 * @param {object} eventData - The event data object.
 *  - {string} eventType - E.g., 'speeding', 'harsh_braking'.
 *  - {number} value - The value associated with the event (e.g., speed, g-force).
 *  - {string} timestamp - ISO 8601 timestamp of the event.
 *  - {object} location - Geolocation data ({ lat, lon }).
 * @returns {object} The newly created event record.
 */
const logHarshEvent = (driverId, eventData) => {
    if (!db.drivers[driverId]) {
        db.drivers[driverId] = { eventHistory: [], safetyScore: config.SAFETY_SCORE_BASE };
    }
    const event = { id: `evt_${Date.now()}`, ...eventData };
    db.drivers[driverId].eventHistory.push(event);
    console.log(`Logged event for driver ${driverId}:`, event);
    return event;
};

/**
 * @function calculateDriverSafetyScore
 * @description Calculates a safety score based on a driver's recent event history.
 * @param {string} driverId - The ID of the driver.
 * @returns {number} The calculated safety score.
 */
const calculateDriverSafetyScore = (driverId) => {
    if (!db.drivers[driverId] || !db.drivers[driverId].eventHistory) {
        return config.SAFETY_SCORE_BASE; // Return base score if no history
    }

    let score = config.SAFETY_SCORE_BASE;
    const penaltyMap = {
        speeding: config.PENALTY_SPEEDING,
        harsh_braking: config.PENALTY_HARSH_BRAKING,
        rapid_acceleration: config.PENALTY_RAPID_ACCELERATION,
        sharp_cornering: config.PENALTY_SHARP_CORNERING,
    };

    for (const event of db.drivers[driverId].eventHistory) {
        if (penaltyMap[event.eventType]) {
            score -= penaltyMap[event.eventType];
        }
    }

    const finalScore = Math.max(0, score); // Ensure score doesn't go below 0
    db.drivers[driverId].safetyScore = finalScore;
    return finalScore;
};

/**
 * @function generateBehaviorAlert
 * @description Creates a formatted alert object for real-time notifications.
 * @param {string} driverId - The driver's ID.
 * @param {object} event - The specific event that triggered the alert.
 * @returns {object} A formatted alert object.
 */
const generateBehaviorAlert = (driverId, event) => {
    const alert = {
        alertId: `alert_${Date.now()}`,
        driverId,
        eventType: event.eventType,
        message: `High severity event detected for driver ${driverId}: ${event.eventType} with value ${event.value}.`,
        timestamp: new Date().toISOString(),
        criticality: 'high',
    };
    console.log("Generated Alert:", alert);
    // In production, this would integrate with a notification service (e.g., SNS, Twilio).
    return alert;
};


// ----------------------------------------
// Trip Management Module
// ----------------------------------------

/**
 * @function startTrip
 * @description Initializes a new trip record.
 * @param {object} tripData - Data for the new trip.
 *  - {string} tripId - The unique ID for the trip.
 *  - {string} driverId - The driver's ID.
 *  - {string} vehicleId - The vehicle's ID.
 *  - {string} startTime - ISO 8601 timestamp.
 *  - {object} startLocation - Geolocation data ({ lat, lon }).
 * @returns {object} The newly created trip record.
 */
const startTrip = (tripData) => {
    if (db.trips[tripData.tripId]) {
        throw new Error("Trip already exists.");
    }
    const newTrip = {
        ...tripData,
        status: 'in_progress',
        updates: [{ timestamp: tripData.startTime, location: tripData.startLocation, speed: 0 }],
        distanceTraveledKm: 0,
    };
    db.trips[tripData.tripId] = newTrip;
    console.log(`Started trip ${tripData.tripId}`);
    return newTrip;
};

// Helper for distance calculation
const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lon - coords1.lon);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};


/**
 * @function updateTripProgress
 * @description Processes mid-trip location updates.
 * @param {string} tripId - The ID of the trip to update.
 * @param {object} updateData - The update data.
 *  - {string} timestamp - ISO 8601 timestamp of the update.
 *  - {object} location - Geolocation data ({ lat, lon }).
 *  - {number} speed - Current speed in MPH.
 * @returns {object} The updated trip record.
 */
const updateTripProgress = (tripId, updateData) => {
    const trip = db.trips[tripId];
    if (!trip || trip.status !== 'in_progress') {
        throw new Error("Trip not found or not in progress.");
    }
    const lastUpdate = trip.updates[trip.updates.length - 1];
    const distanceIncrement = haversineDistance(lastUpdate.location, updateData.location);
    
    trip.distanceTraveledKm += distanceIncrement;
    trip.updates.push(updateData);
    
    // Simple ETA calculation: assumes constant speed to a hypothetical destination
    // A real implementation would require a destination and a routing service.
    trip.eta = "Calculating..."; 
    
    console.log(`Updated trip ${tripId}. Total distance: ${trip.distanceTraveledKm.toFixed(2)} km.`);
    return trip;
};


/**
 * @function endTrip
 * @description Finalizes a trip and generates a summary.
 * @param {string} tripId - The ID of the trip to end.
 * @param {object} endData - Data about the end of the trip.
 *  - {string} endTime - ISO 8601 timestamp.
 *  - {object} endLocation - Geolocation data ({ lat, lon }).
 * @returns {object} The trip record with its final summary.
 */
const endTrip = (tripId, endData) => {
    const trip = db.trips[tripId];
    if (!trip || trip.status !== 'in_progress') {
        throw new Error("Trip not found or not in progress.");
    }
    
    const startTime = new Date(trip.startTime);
    const endTime = new Date(endData.endTime);
    const durationMillis = endTime - startTime;
    const durationHours = durationMillis / (1000 * 60 * 60);

    const speeds = trip.updates.map(u => u.speed).filter(s => s > 0);
    const averageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
    
    trip.status = 'completed';
    trip.endTime = endData.endTime;
    trip.endLocation = endData.endLocation;
    
    trip.summary = {
        totalDistanceKm: trip.distanceTraveledKm.toFixed(2),
        totalDurationHours: durationHours.toFixed(2),
        averageSpeedMph: averageSpeed.toFixed(2),
    };
    
    console.log(`Ended trip ${tripId}. Summary:`, trip.summary);
    return trip;
};


// ================================================================
// 3. Webhook Receiver Implementation (Node.js/Express)
// ================================================================

const app = express();
app.use(bodyParser.json());

/**
 * ----------------------------------------------------------------
 * @endpoint POST /webhook/driver-event
 * @description Receives data about specific driver behaviors.
 * ----------------------------------------------------------------
 */
app.post('/webhook/driver-event', (req, res) => {
    const { driverId, eventType, value, timestamp, location, vehicleId } = req.body;

    // --- Data Validation ---
    if (!driverId || !eventType || value === undefined || !timestamp || !location) {
        return res.status(400).json({ error: 'Missing required fields in payload.' });
    }

    try {
        const eventData = { eventType, value, timestamp, location, vehicleId };
        const event = logHarshEvent(driverId, eventData);

        // --- Core Logic ---
        calculateDriverSafetyScore(driverId);
        
        let alert = null;
        // Generate an alert for severe events
        if (
            (eventType === 'speeding' && value > config.SPEEDING_THRESHOLD_MPH) ||
            (eventType === 'harsh_braking' && value > config.HARSH_BRAKING_G_FORCE_THRESHOLD)
        ) {
            alert = generateBehaviorAlert(driverId, event);
        }

        res.status(200).json({
            message: 'Event processed successfully.',
            eventId: event.id,
            newSafetyScore: db.drivers[driverId].safetyScore,
            alert,
        });
    } catch (error) {
        console.error("Error processing driver event:", error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

/**
 * ----------------------------------------------------------------
 * @endpoint POST /webhook/trip-update
 * @description Receives data about the trip's status.
 * ----------------------------------------------------------------
 */
app.post('/webhook/trip-update', (req, res) => {
    const { tripId, status, timestamp } = req.body;

    // --- Data Validation ---
    if (!tripId || !status || !timestamp) {
        return res.status(400).json({ error: 'Missing required fields: tripId, status, timestamp.' });
    }

    try {
        let result;
        switch (status) {
            case 'trip_started':
                const { driverId, vehicleId, location } = req.body;
                if (!driverId || !vehicleId || !location) {
                    return res.status(400).json({ error: 'Missing fields for starting a trip.' });
                }
                result = startTrip({ tripId, driverId, vehicleId, startTime: timestamp, startLocation: location });
                break;
            
            case 'in_progress':
                const { location: updateLocation, speed } = req.body;
                if (!updateLocation || speed === undefined) {
                    return res.status(400).json({ error: 'Missing fields for trip progress update.' });
                }
                result = updateTripProgress(tripId, { timestamp, location: updateLocation, speed });
                break;
            
            case 'trip_ended':
                 const { location: endLocation } = req.body;
                 if (!endLocation) {
                    return res.status(400).json({ error: 'Missing location for ending a trip.' });
                }
                result = endTrip(tripId, { endTime: timestamp, endLocation });
                break;

            default:
                return res.status(400).json({ error: 'Invalid trip status.' });
        }
        
        res.status(200).json({
            message: `Trip status '${status}' processed successfully.`,
            trip: result,
        });

    } catch (error) {
        console.error("Error processing trip update:", error.message);
        res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
});

app.listen(config.PORT, () => {
    console.log(`Telematics server listening on port ${config.PORT}`);
});