# 🧪 Driver Behavior Webhook Testing Suite

This comprehensive testing suite provides tools for validating, debugging, and monitoring the `importDriverBehaviorWebhook` Firebase Cloud Function. These tools allow you to verify the webhook's functionality, resilience, and proper data handling across different scenarios.

## 📋 Contents

1. [Overview](#overview)
2. [Test Tools](#test-tools)
3. [Installation](#installation)
4. [Browser-based Testing](#browser-based-testing)
5. [Command-line Testing](#command-line-testing)
6. [Firestore Verification](#firestore-verification)
7. [Common Issues & Debugging](#common-issues--debugging)
8. [Security Considerations](#security-considerations)

## 🔍 Overview

The `importDriverBehaviorWebhook` function processes incoming driver behavior events and stores them in the Firestore database. This testing suite ensures:

- Proper validation of incoming payloads
- Correct document ID generation using `${fleetNumber}_${eventType}_${eventTime}`
- Batch processing for multiple events
- Duplicate detection and prevention
- Error handling and response codes

## 🛠️ Test Tools

This testing suite includes three primary tools:

1. **webhook-test.html** - Browser-based UI for interactive testing
2. **test-driver-behavior-webhook.js** - Automated Node.js test script
3. **verify-firestore-records.js** - Firestore record verification utility

## 📦 Installation

1. **Clone this repository** or place these files in your project directory.

2. **Install dependencies**:
   ```bash
   npm install axios firebase-admin firebase dotenv
   ```

3. **Create a service account key**:
   - Go to Firebase Console → Project Settings → Service accounts
   - Generate a new private key
   - Save it as `serviceAccountKey.json` in the project directory
   - (A template file `serviceAccountKey.template.json` is provided for reference)

4. **Configure environment variables** (optional):
   ```
   FIREBASE_PROJECT_ID=mat1-9e6b3
   WEBHOOK_URL=https://us-central1-mat1-9e6b3.cloudfunctions.net/importDriverBehaviorWebhook
   ```

## 🌐 Browser-based Testing

The `webhook-test.html` file provides an interactive UI for testing the webhook with different payloads.

### Features:
- Pre-configured test scenarios
- JSON payload editor
- Response display (status, time, body)
- Error visualization

### Usage:
1. Open `webhook-test.html` in your browser
2. Select a test scenario or edit the payload manually
3. Click "Send Request" to trigger the webhook
4. View the response details

### Test Scenarios Include:
- Valid single event
- Multiple events in one payload
- Missing required fields
- Invalid event types
- Duplicate events
- Malformed JSON
- Empty payload
- Custom payload editor

## 💻 Command-line Testing

The `test-driver-behavior-webhook.js` script performs automated testing of the webhook.

### Features:
- Comprehensive test suite
- Automated test execution
- Detailed logging and reporting
- Success/failure summary

### Usage:

```bash
# Run all tests
node test-driver-behavior-webhook.js

# Run specific test
node test-driver-behavior-webhook.js --test=valid-event

# Display help
node test-driver-behavior-webhook.js --help
```

### Available Tests:

| Test Name | Description |
|-----------|-------------|
| `valid-event` | Single valid driver behavior event |
| `multiple-events` | Multiple valid events in one payload |
| `missing-fields` | Event missing required fields |
| `invalid-event-type` | Event with invalid event type |
| `duplicate-event` | Attempt to add a duplicate event |
| `large-payload` | Test with 50+ events in one payload |
| `all` | Run all tests in sequence (default) |

## 🔎 Firestore Verification

The `verify-firestore-records.js` utility directly checks Firestore records to ensure events were properly stored.

### Features:
- Direct Firestore connection (Admin SDK)
- Query recent driver behavior events
- Filter by fleet number
- Detailed record display

### Usage:

```bash
# Check all recent records
node verify-firestore-records.js

# Check records for a specific fleet
node verify-firestore-records.js TRK001
```

### Example Output:

```
🔍 Checking Firestore records in collection: driverBehaviorEvents

✅ Found 3 recent driver behavior records:
====================================================
ID: TRK001_HARSH_BRAKING_2025-06-30T08:15:22.000Z
Fleet Number: TRK001
Event Type: HARSH_BRAKING
Event Time: 2025-06-30T08:15:22.000Z
Severity: HIGH
Points: 5
Location: -33.9249, 18.4241
----------------------------------------------------
ID: TRK002_SPEEDING_2025-06-30T07:45:10.000Z
Fleet Number: TRK002
Event Type: SPEEDING
Event Time: 2025-06-30T07:45:10.000Z
Driver: John Doe
Severity: MEDIUM
Points: 3
----------------------------------------------------
ID: TRK003_IDLE_EXCESSIVE_2025-06-30T06:30:45.000Z
Fleet Number: TRK003
Event Type: IDLE_EXCESSIVE
Event Time: 2025-06-30T06:30:45.000Z
Severity: LOW
Points: 1
----------------------------------------------------

📊 Total driver behavior events in database: 152
```

## ⚠️ Common Issues & Debugging

### Authentication Errors:
- Ensure your `serviceAccountKey.json` file is valid and has proper permissions
- Check Firebase project ID matches the one in your webhook URL

### Connection Errors:
- Verify webhook URL is correct and the function is deployed
- Check network connectivity and firewall settings
- Try using a different network if getting timeout errors

### Data Format Issues:
- Ensure event timestamps follow ISO format (YYYY-MM-DDThh:mm:ss.sssZ)
- Verify required fields are present (fleetNumber, eventType, eventTime)
- Check event type enumeration values are valid

### Duplicate Detection:
- Document IDs are generated using `${fleetNumber}_${eventType}_${eventTime}`
- To test duplicates, use identical values for those fields
- Webhook responds with 409 Conflict for duplicates

## 🔐 Security Considerations

- The webhook requires Firebase authentication in production
- These test tools are for development/testing only
- Never commit real service account keys to source control
- Production webhooks should implement rate limiting
- Consider implementing webhook secrets for production

---

## 📝 License

This testing suite is provided as part of the Matanuska Transport system. For usage questions or additional support, please contact the development team.

---

Last updated: June 30, 2025