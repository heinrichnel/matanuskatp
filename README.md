# Telematics Monitoring System Documentation

This document provides detailed information on the data structures, webhook payloads, function signatures, and configuration for the telematics monitoring system powered by `telematics_system.js`.

---

## **1. Configuration**

The system's behavior can be configured via environment variables. This approach allows for easy adjustments without modifying the code.

| Environment Variable              | Default | Description                                                                 |
| :-------------------------------- | :------ | :-------------------------------------------------------------------------- |
| `SAFETY_SCORE_BASE`               | `100`   | The starting safety score for all drivers.                                  |
| `PENALTY_SPEEDING`                | `10`    | Points deducted for each speeding event.                                    |
| `PENALTY_HARSH_BRAKING`           | `5`     | Points deducted for each harsh braking event.                               |
| `PENALTY_RAPID_ACCELERATION`      | `5`     | Points deducted for each rapid acceleration event.                          |
| `PENALTY_SHARP_CORNERING`         | `3`     | Points deducted for each sharp cornering event.                             |
| `SPEEDING_THRESHOLD_MPH`          | `80`    | The speed (in MPH) above which an event is flagged as a high-severity alert. |
| `HARSH_BRAKING_G_FORCE_THRESHOLD` | `0.5`   | The g-force level above which a braking event triggers a high-severity alert. |
| `PORT`                            | `3000`  | The port on which the Express server will run.                              |

---

## **2. Webhook Endpoints and Payloads**

### **Endpoint: `POST /webhook/driver-event`**

This endpoint is used to log specific driver behavior events in real-time.

**Example Webhook Payload:**
```json
{
  "driverId": "d-12345",
  "vehicleId": "v-67890",
  "timestamp": "2023-10-27T10:05:15Z",
  "eventType": "harsh_braking",
  "value": 0.62,
  "location": {
    "lat": 34.0522,
    "lon": -118.2437
  }
}
```
**Payload Fields:**
- `driverId` (string, **required**): The unique identifier of the driver.
- `vehicleId` (string, **required**): The unique identifier of the vehicle.
- `timestamp` (string, **required**): The ISO 8601 timestamp when the event occurred.
- `eventType` (string, **required**): The type of event. Must be one of `speeding`, `harsh_braking`, `rapid_acceleration`, or `sharp_cornering`.
- `value` (number, **required**): The metric associated with the event (e.g., speed in MPH, g-force).
- `location` (object, **required**): The geographic location of the event.

### **Endpoint: `POST /webhook/trip-update`**

This endpoint is used to manage the lifecycle of a trip, from start to finish. The `status` field dictates the action taken.

**Example Payload for `status: 'trip_started'`:**
```json
{
  "tripId": "trip-abc-123",
  "status": "trip_started",
  "timestamp": "2023-10-27T09:00:00Z",
  "driverId": "d-12345",
  "vehicleId": "v-67890",
  "location": {
    "lat": 34.0522,
    "lon": -118.2437
  }
}
```

**Example Payload for `status: 'in_progress'`:**
```json
{
  "tripId": "trip-abc-123",
  "status": "in_progress",
  "timestamp": "2023-10-27T09:30:00Z",
  "location": {
    "lat": 34.0625,
    "lon": -118.2540
  },
  "speed": 65
}
```

**Example Payload for `status: 'trip_ended'`:**
```json
{
  "tripId": "trip-abc-123",
  "status": "trip_ended",
  "timestamp": "2023-10-27T11:00:00Z",
  "location": {
    "lat": 34.1522,
    "lon": -118.4437
  }
}
```

---

## **3. Core Logic Functions and Signatures**

### **Driver Behavior Module**

- **`logHarshEvent(driverId, eventData)`**
  - **`driverId`** (string): The driver's unique ID.
  - **`eventData`** (object): An object containing details of the event (`eventType`, `value`, `timestamp`, `location`).
  - **Returns:** (object) The newly created event record.

- **`calculateDriverSafetyScore(driverId)`**
  - **`driverId`** (string): The driver's unique ID.
  - **Returns:** (number) The driver's updated safety score, from 0 to 100.

- **`generateBehaviorAlert(driverId, event)`**
  - **`driverId`** (string): The driver's unique ID.
  - **`event`** (object): The event object that triggered the alert.
  - **Returns:** (object) A formatted alert object ready for dispatch.

### **Trip Management Module**

- **`startTrip(tripData)`**
  - **`tripData`** (object): An object containing `tripId`, `driverId`, `vehicleId`, `startTime`, and `startLocation`.
  - **Returns:** (object) The newly initialized trip record.

- **`updateTripProgress(tripId, updateData)`**
  - **`tripId`** (string): The unique ID of the trip being updated.
  - **`updateData`** (object): An object with `timestamp`, `location`, and `speed`.
  - **Returns:** (object) The updated trip record, including the cumulative distance.

- **`endTrip(tripId, endData)`**
  - **`tripId`** (string): The unique ID of the trip being ended.
  - **`endData`** (object): An object with `endTime` and `endLocation`.
  - **Returns:** (object) The finalized trip record, complete with a `summary` object containing total distance, duration, and average speed.