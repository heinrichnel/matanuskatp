# Comprehensive Deployment Guide for Enhanced Webhooks

This guide provides detailed instructions for deploying both enhanced webhook implementations:
1. The enhanced Driver Behavior webhook (`importDriverBehaviorWebhook`)
2. The enhanced WebBook Import webhook (`importTripsFromWebBook`)

## Prerequisites

1. Ensure you have the Firebase CLI installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Authenticate with Firebase:
   ```bash
   firebase login
   ```

3. Make sure you're in the project directory:
   ```bash
   cd /path/to/your/project
   ```

## Deployment Steps

### 1. Backup the Current Implementation

```bash
# Navigate to the functions directory
cd functions

# Create a backup of the current implementation
cp src/index.ts src/index.ts.backup.$(date +%Y%m%d%H%M%S)
```

### 2. Ensure the Enhanced Webhook Files are in Place

Make sure both enhanced implementation files exist:
- `functions/src/enhanced-driver-behavior-webhook.ts` 
- `functions/src/enhanced-webbook-import.ts`

### 3. Update the Main Functions File

The `functions/src/index.ts` file should be updated to import and use both enhanced implementations:

```bash
# Navigate back to the project root if needed
cd ..

# Verify that the index.ts file has been updated
cat functions/src/index.ts | grep "enhanced"
```

You should see lines that import and export both enhanced implementations:
```typescript
import { enhancedDriverBehaviorWebhook } from './enhanced-driver-behavior-webhook';
import { enhancedWebBookImport } from './enhanced-webbook-import';

// In the exports section:
export { enhancedDriverBehaviorWebhook as importDriverBehaviorWebhook };
export { enhancedWebBookImport as importTripsFromWebBook };
```

### 4. Install Dependencies

```bash
# Navigate to the functions directory
cd functions

# Install dependencies
npm install
```

### 5. Build the TypeScript Code

```bash
# Build the TypeScript code
npm run build
```

### 6. Deploy Both Functions

#### Option 1: Deploy Using the Script (Recommended)

```bash
# Make the script executable
chmod +x ../deploy-both-webhooks.sh

# Run the deployment script
../deploy-both-webhooks.sh
```

#### Option 2: Deploy Manually

```bash
# Deploy both webhook functions
firebase deploy --only functions:importDriverBehaviorWebhook,functions:importTripsFromWebBook
```

### 7. Verify the Deployment

```bash
# List all deployed functions
firebase functions:list
```

Look for both `importDriverBehaviorWebhook` and `importTripsFromWebBook` in the output with status "ACTIVE".

## Testing the Deployed Functions

### Testing the Driver Behavior Webhook

#### 1. Test with the Improved Test Script

```bash
# Navigate back to the project root
cd ..

# Set environment to development
export NODE_ENV=development

# Run the test script
node improved-driver-behavior-webhook-test.js
```

#### 2. Test with curl

```bash
# Send a test payload to the webhook
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"events":[{"fleetNumber":"TEST-123","eventType":"harsh_braking","eventTime":"2025-07-01T08:00:00.000Z"}]}' \
  https://us-central1-mat1-9e6b3.cloudfunctions.net/importDriverBehaviorWebhook
```

### Testing the WebBook Import Webhook

#### 1. Test with the Improved Test Script

```bash
# Navigate back to the project root
cd ..

# Set environment to development
export NODE_ENV=development

# Run the test script
node improved-webbook-import-test.js
```

#### 2. Test with curl

```bash
# Send a test payload to the webhook
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"trips":[{"loadRef":"LOAD-123","status":"active"}]}' \
  https://us-central1-mat1-9e6b3.cloudfunctions.net/importTripsFromWebBook
```

### 3. Check the Function Logs

```bash
# Stream all function logs
firebase functions:log

# Or stream logs for a specific function
firebase functions:log --only importDriverBehaviorWebhook
firebase functions:log --only importTripsFromWebBook
```

## Troubleshooting Common Issues

### Deployment Fails with Authentication Errors

If you see authentication errors:

```bash
# Re-authenticate with Firebase
firebase logout
firebase login
```

### TypeScript Build Errors

If the build fails with TypeScript errors:

```bash
# Check the specific errors
npm run build -- --verbose

# Fix any issues in the code files
```

### Function Execution Errors

If the functions are deployed but return errors:

```bash
# Check the detailed logs
firebase functions:log
```

### CORS Issues with WebBook Webhook

If you encounter CORS issues with the WebBook webhook:

1. Check that the CORS headers setup is correctly implemented in the enhanced implementation:
   ```typescript
   res.set('Access-Control-Allow-Origin', '*');
   
   if (req.method === 'OPTIONS') {
       res.set('Access-Control-Allow-Methods', 'GET, POST');
       res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
       res.status(204).send('');
       return;
   }
   ```

2. Test with explicit CORS headers in your curl request:
   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     -H "Origin: http://localhost:3000" \
     -d '{"trips":[{"loadRef":"LOAD-123","status":"active"}]}' \
     https://us-central1-mat1-9e6b3.cloudfunctions.net/importTripsFromWebBook
   ```

### Rolling Back (If Needed)

If you need to roll back to the previous implementation:

```bash
# Navigate to the functions directory
cd functions

# List available backups
ls -la src/index.ts.backup.*

# Restore from a specific backup
cp src/index.ts.backup.YYYYMMDDHHMMSS src/index.ts

# Rebuild and redeploy
npm run build
firebase deploy --only functions
```

## Security Best Practices

1. **Never share or commit credentials**: Use environment variables or Firebase secret management.

2. **Secure your service account keys**: Restrict access to only necessary services.

3. **Use the principle of least privilege**: Grant only the permissions needed.

4. **Rotate credentials regularly**: Set up a schedule for rotating all keys.

5. **Monitor your project**: Check Cloud audit logs for unauthorized access.

6. **Restrict function access**: Use Firebase security rules to limit access.

7. **Validate all inputs**: Always validate webhook payloads (implemented in both enhanced webhooks).

## Next Steps

After successful deployment:

1. Monitor the Cloud Function logs for any errors
2. **Update Google Apps Script integrations** using the `google-apps-script-deployment-guide.md` instructions
3. Verify that driver behavior events and trips are appearing in Firestore
4. Check that the events and trips are visible in the UI
5. Use the provided test scripts for both webhooks if frequent testing is needed

## Advantages of the Enhanced Implementations

Both enhanced webhook implementations provide several improvements:

1. **Better Error Handling**: Comprehensive error catching and detailed error responses
2. **Detailed Logging**: Enhanced logging at each step for better debugging
3. **Payload Validation**: Robust validation of request payloads to prevent data issues
4. **CORS Support**: Proper CORS headers for cross-origin requests
5. **Consistent Data Processing**: Normalization and transformation of data fields
6. **Metadata Enrichment**: Additional metadata for better tracking and auditing
7. **Detailed Responses**: More informative response structures with processing details

These improvements make the webhooks more robust, maintainable, and easier to debug.