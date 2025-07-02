# Google Apps Script Deployment Guide for TransportMat Webhooks

This guide explains how to set up and deploy the Google Apps Scripts for both the Driver Behavior events and WebBook Trip Import integrations. These scripts enable data to flow from Google Sheets to your Firebase application through the enhanced webhooks.

## Prerequisites

1. Access to the Google Sheets containing your data
2. Edit access to Google Apps Script
3. The enhanced webhooks must be deployed to Firebase (see `comprehensive-deployment-guide.md`)

## Setting Up the Driver Behavior Apps Script

### 1. Access the Google Apps Script Editor

1. Open the Google Sheet containing your driver behavior data
2. Click on `Extensions` > `Apps Script` in the top menu
3. This will open the Apps Script editor in a new tab

### 2. Replace or Create the Script

1. If you already have a script, select all the content and delete it
2. Copy the entire content from `updated-driver-behavior-apps-script.js` and paste it into the editor
3. If you're creating a new script, click `File` > `New` > `Script file`, name it (e.g., "DriverBehaviorSync"), and paste the code

### 3. Configure the Script

In the pasted code, review and update the following variables at the top:

```javascript
// CONFIGURATION - Update these values
const FIREBASE_WEBHOOK_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/importDriverBehaviorWebhook';
const SHEET_NAME = 'driver_behavior';
const COLLECTION_NAME = 'driverBehavior';
const DEBUG_MODE = true; // Set to false in production
```

Make sure:
- `FIREBASE_WEBHOOK_URL` points to your deployed webhook
- `SHEET_NAME` matches the name of your sheet containing driver behavior data
- Update other settings as needed

### 4. Save the Script

1. Click `File` > `Save` or press `Ctrl+S`
2. Give it a name if prompted

### 5. Test the Script

1. From the dropdown menu at the top, select the `testDriverBehaviorImport` function
2. Click the play button (▶️) to run the function
3. You'll be prompted to authorize the script the first time you run it
4. Check the Execution log for results

## Setting Up the WebBook Import Apps Script

### 1. Access the Google Apps Script Editor

1. Open the Google Sheet containing your trip data
2. Click on `Extensions` > `Apps Script` in the top menu
3. This will open the Apps Script editor in a new tab

### 2. Replace or Create the Script

1. If you already have a script, select all the content and delete it
2. Copy the entire content from `updated-webbook-import-apps-script.js` and paste it into the editor
3. If you're creating a new script, click `File` > `New` > `Script file`, name it (e.g., "WebBookImport"), and paste the code

### 3. Configure the Script

In the pasted code, review and update the following variables at the top:

```javascript
// CONFIGURATION - Update these values
const FIREBASE_WEBHOOK_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/importTripsFromWebBook';
const SHEET_NAME = 'trips';
const COLLECTION_NAME = 'trips';
const DEBUG_MODE = true; // Set to false in production
```

Make sure:
- `FIREBASE_WEBHOOK_URL` points to your deployed webhook
- `SHEET_NAME` matches the name of your sheet containing trip data
- Update other settings as needed

### 4. Save the Script

1. Click `File` > `Save` or press `Ctrl+S`
2. Give it a name if prompted

### 5. Test the Script

1. From the dropdown menu at the top, select the `testTripImport` function
2. Click the play button (▶️) to run the function
3. You'll be prompted to authorize the script the first time you run it
4. Check the Execution log for results

## Setting Up Automatic Triggers

Both scripts support automatic daily execution. To set this up:

1. Run the `setupDailyTrigger` function from the dropdown menu
2. The script will create a trigger to run daily at 6 AM
3. You can verify your triggers by clicking on the "Triggers" icon (clock symbol) in the left sidebar

Alternatively, you can use the custom menu added to your spreadsheet:

1. After saving the script, reload your Google Sheet
2. You'll see a new menu item: "Driver Behavior" or "WebBook Import" (depending on which script)
3. Click this menu and select "Setup Daily Import Trigger"

## Troubleshooting

### Authorization Issues

If you see authorization errors:

1. Click on "Review Permissions" when prompted
2. Select your Google account
3. Click "Advanced" if you see a warning
4. Click "Go to [Your Script Name] (unsafe)"
5. Click "Allow"

### HTTP Errors

If the script fails with HTTP errors:

1. Check that your Firebase webhook is deployed correctly
2. Verify the webhook URL in the configuration
3. Check the execution logs for specific error messages
4. Make sure your sheet has the expected columns

### Data Format Issues

If data isn't being properly imported:

1. Enable `DEBUG_MODE` to see detailed logs
2. Check that your sheet has all the required columns
3. Verify that required fields like `fleetNumber` (for driver behavior) or `loadRef` (for trips) are not empty
4. Check the date formats in your sheet

## Sheet Structure Requirements

### Driver Behavior Sheet

Your sheet should have these columns:
- "Fleet Number" (required)
- "Driver Name"
- "Event Type" (required)
- "Event Time" (required)
- "Camera ID"
- "Video URL"
- "Severity"
- "Event Score"
- "Notes"

### Trip Data Sheet

Your sheet should have these columns:
- "Load Ref" (required)
- "Customer"
- "Origin"
- "Destination"
- "Status"
- "Shipped Status"
- "Delivered Status"
- "Completed Status"
- "Shipped Date"
- "Delivered Date"
- "Completed Date"

## Security Considerations

1. **Avoid Sharing the Script**: Do not share the script with users who shouldn't have access to your Firebase data
2. **Limit Access to the Spreadsheet**: Only authorized users should have access to the source spreadsheets
3. **Disable Debug Mode in Production**: Set `DEBUG_MODE = false` once everything is working
4. **Review Authorization Scopes**: When authorizing, review what the script is requesting access to

## Completion

After successful setup and testing:

1. Both scripts will create a custom menu in your spreadsheets for easy manual execution
2. If you've set up triggers, the data will automatically sync daily
3. You can monitor the execution by checking the Apps Script dashboard and execution logs

These scripts are designed to work with the enhanced webhooks to ensure data integrity, avoid duplicates, and provide detailed logging for troubleshooting.