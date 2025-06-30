# 🔄 Production-Ready Webhook System

> This document describes the complete webhook system architecture for Matanuska Transport's driver behavior event tracking system. It outlines the technical implementation, security measures, scaling considerations, and integration points.

## 🏗️ System Architecture

![Webhook System Architecture](https://via.placeholder.com/800x500?text=Webhook+System+Architecture)

### Core Components

1. **External Data Sources**
   - Google Sheets (via Google Apps Script)
   - Telematics systems (via API)
   - Mobile driver apps
   - Third-party logistics systems

2. **Webhook Endpoints (Firebase Cloud Functions)**
   - `importDriverBehaviorWebhook`: Processes driver behavior events
   - `importTripsFromWebBook`: Processes trip data
   - Additional endpoints for other event types

3. **Firestore Database Collections**
   - `/driverBehaviorEvents`: Stores all driver behavior incidents
   - `/trips`: Stores trip data with references to behavior events
   - `/auditLog`: Tracks all webhook interactions for compliance

4. **Frontend Components**
   - Real-time listeners for syncing UI state
   - Dashboard components for displaying event data
   - Form components for manual data entry

### Data Flow

1. External system generates event data
2. Data is sent via HTTPS POST to Firebase Function webhook endpoint
3. Cloud Function validates payload, processes data, and writes to Firestore
4. Frontend components with onSnapshot listeners update UI in real-time
5. Audit logs are generated for compliance and troubleshooting

## 🔐 Security Considerations

### Authentication & Authorization

- **Service Account Authentication**
  - Each webhook consumer must use Firebase Admin SDK with service account
  - Service accounts have minimal required permissions (principle of least privilege)
  - Credentials are never stored in code repositories

- **Token-based Authentication**
  - Custom tokens for external systems that cannot use service accounts
  - Short-lived tokens with appropriate scopes
  - Token rotation and revocation procedures

### Data Validation

- **Schema Validation**
  - All incoming data is validated against TypeScript interfaces
  - Required fields are enforced (fleetNumber, eventType, eventTime, etc.)
  - Data types and formats are strictly validated

- **Business Logic Validation**
  - Event times must be within acceptable range (not future-dated)
  - Fleet numbers must exist in the system
  - Events must be associated with valid trip IDs when applicable

### Network Security

- **HTTPS Only**
  - All webhook endpoints require HTTPS
  - TLS 1.2+ enforced

- **Rate Limiting**
  - Configured at Firebase project level
  - Per-IP limits to prevent DoS attacks
  - Exponential backoff for retry logic

## 📈 Scaling & Performance

### Optimization Techniques

- **Batch Processing**
  - Multiple events can be sent in a single request
  - Firestore batch operations for atomic writes
  - Maximum batch size of 500 documents

- **Document ID Strategy**
  - Document IDs follow pattern: `${fleetNumber}_${eventType}_${eventTime}`
  - Enables quick lookup and prevents duplicates
  - Supports efficient indexing

### Concurrency Handling

- **Firestore Transactions**
  - Used for operations requiring atomic reads and writes
  - Prevents race conditions in high-concurrency scenarios

- **Function Execution Guarantees**
  - At-least-once delivery semantics
  - Idempotent processing to handle duplicate events safely

### Performance Monitoring

- **Metrics Tracking**
  - Function execution time
  - Cold start frequency
  - Error rates and types
  - Payload sizes

- **Alerting**
  - Alerts on sustained high error rates
  - Alerts on function timeout or memory issues
  - Daily webhook health report

## 🔄 Integration Points

### Frontend Integration

- **Real-time Updates**
  - Components use `onSnapshot` for real-time data sync
  - Example:
    ```typescript
    useEffect(() => {
      const unsubscribe = onSnapshot(
        query(collection(db, "driverBehaviorEvents"), 
              where("fleetNumber", "==", selectedFleet),
              orderBy("eventTime", "desc"),
              limit(50)),
        (snapshot) => {
          setEvents(snapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          })));
        }
      );
      
      return () => unsubscribe();
    }, [selectedFleet]);
    ```

- **Manual Entry Forms**
  - `DriverBehaviorEventForm.tsx` component for manual entries
  - Form validation mirrors webhook validation rules
  - Uses same Firestore document structure

### Google Apps Script Integration

- **Webhook Sender Script**
  - Runs on Google Sheets to send data to webhook endpoints
  - Includes authentication, retry logic, and logging
  - Example:
    ```javascript
    function sendDriverBehaviorEvents() {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Driver Events");
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const events = [];
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row[0]) continue; // Skip empty rows
        
        events.push({
          fleetNumber: row[headers.indexOf("Fleet Number")],
          driverName: row[headers.indexOf("Driver Name")],
          eventType: row[headers.indexOf("Event Type")],
          eventTime: new Date(row[headers.indexOf("Event Time")]).toISOString(),
          location: row[headers.indexOf("Location")],
          description: row[headers.indexOf("Description")],
          severity: row[headers.indexOf("Severity")]
        });
      }
      
      if (events.length === 0) {
        Logger.log("No events to send");
        return;
      }
      
      sendToWebhook(events);
    }
    
    function sendToWebhook(events) {
      const url = "https://us-central1-mat1-9e6b3.cloudfunctions.net/importDriverBehaviorWebhook";
      const token = getAuthToken(); // Custom function to get token
      
      const options = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(events),
        headers: {
          Authorization: `Bearer ${token}`
        },
        muteHttpExceptions: true
      };
      
      const response = UrlFetchApp.fetch(url, options);
      Logger.log(response.getContentText());
      
      // Update status in sheet
      updateSendStatus(response.getResponseCode() === 200);
    }
    ```

## 📊 Monitoring & Troubleshooting

### Logging Strategy

- **Structured Logging**
  - All logs use consistent JSON structure
  - Include request ID for tracing
  - Log key events: request received, validation results, write completed
  - Example:
    ```typescript
    functions.logger.info("Processing driver behavior events", {
      requestId: uuid(),
      eventCount: events.length,
      source: source || "unknown"
    });
    ```

- **Log Levels**
  - INFO: Normal operation events
  - WARNING: Potential issues that don't block operation
  - ERROR: Failed operations requiring attention
  - DEBUG: Detailed information for troubleshooting (development only)

### Diagnostics Tools

- **Webhook Testing UI**
  - Browser-based tool for testing webhook functionality
  - Validates event format and processing
  - Shows detailed error messages

- **Firestore Verification Scripts**
  - Command-line tools to verify data integrity
  - Checks for missing fields or invalid data
  - Reports discrepancies for resolution

## 🚀 Deployment & CI/CD

### Deployment Process

1. Run all tests locally with Firebase emulators
2. Deploy to staging environment first
3. Run integration tests against staging
4. Deploy to production with atomic function updates
5. Verify production deployment with minimal test

### CI/CD Pipeline

- **GitHub Actions Workflow**
  - Triggered on pull requests and merges to main
  - Runs TypeScript compilation and linting
  - Executes unit and integration tests
  - Deploys to environments based on branch

- **Environment Configuration**
  - Environment variables stored in GitHub Secrets
  - Different service accounts for staging vs. production
  - Feature flags for gradual rollout

## 🧪 Testing Strategy

### Test Types

- **Unit Tests**
  - Test individual validation and processing functions
  - Mock Firestore operations

- **Integration Tests**
  - Test webhook endpoints with real payloads
  - Use Firebase emulators

- **End-to-End Tests**
  - Test entire flow from external system to UI update
  - Validate real-time sync behavior

### Test Coverage

- Validation logic: 100% coverage
- Error handling: All error conditions tested
- Edge cases: Boundary values, malformed data, etc.

## 🛠️ Maintenance & Support

### Regular Maintenance Tasks

- Review Firebase function logs daily
- Monitor cold start performance
- Check for deprecated Firebase features
- Update dependencies and security patches

### Troubleshooting Guide

1. **Check Firebase Function Logs**
   - Look for ERROR level messages
   - Check request details and payload

2. **Verify Firestore Data**
   - Use verification scripts to check data integrity
   - Look for missing or malformed documents

3. **Test Webhook Endpoints**
   - Use the webhook testing UI to send test events
   - Verify proper response codes and messages

4. **Check Frontend Components**
   - Verify real-time listeners are active
   - Check for console errors in browser

## 🔮 Future Enhancements

- **Enhanced Analytics**
  - Dashboard for webhook performance metrics
  - Success/failure rates by source

- **Webhook Management UI**
  - Interface for managing webhook consumers
  - Self-service token generation and management

- **Advanced Validation Rules**
  - ML-based anomaly detection for event data
  - Contextual validation based on historical patterns

- **Multi-region Deployment**
  - Deploy webhook functions to multiple regions
  - Geo-routing based on source location

---

> This document is maintained by the Matanuska Engineering Team  
> Last Updated: 2025-06-30