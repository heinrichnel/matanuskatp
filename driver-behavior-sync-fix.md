# Driver Behavior Event Sync Issue - Troubleshooting Guide

## Issue Description

A driver behavior event (Harsh Braking for fleet 28H) was successfully imported via the webhook as confirmed by the logs, but it's not appearing in the Driver Behavior page in the app. The webhook log shows:

```
[importDriverBehaviorWebhook] Import finished: {
  imported: 1,
  skipped: 0,
  message: 'Processed 1 driver behavior events. Imported: 1, Skipped: 0',
  processingDetails: [
    {
      status: 'imported',
      uniqueKey: '28H_Harsh Braking_2025-06-29T13:15:30.000Z'
    }
  ]
}
```

## Root Causes & Solutions

There are several potential reasons why the imported event isn't showing up in the UI:

### 1. Synchronization Issue

The app may not have properly synchronized with Firestore after the webhook import. The webhook adds the data to Firestore, but the UI needs to refresh its data from Firestore.

**Solution**: 
- Navigate to the Driver Behavior page
- Click the "Sync Now" button in the top right corner of the page
- Wait for the synchronization to complete

### 2. Filter Settings

The DriverPerformanceOverview component filters events based on:
- Driver
- Event Type
- Severity
- Status
- Date Range

If any filters are active, they might be hiding the imported event.

**Solution**:
- Clear all filters (set them to "All")
- Check if the event appears in the list
- If it appears, you can then apply filters to narrow down the view

### 3. Data Structure Mismatch

The webhook might be importing the event with a structure that doesn't match what the UI expects.

**Solution**:
1. Check the driver behavior event in Firestore:
   - The document ID should be `28H_Harsh Braking_2025-06-29T13:15:30.000Z`
   - The document should have required fields like `driverName`, `fleetNumber`, `eventType`, etc.

2. If fields are missing, manually update the document in Firestore with the missing fields:
   - `driverName`: The driver's name for fleet 28H
   - `eventType`: "harsh_braking"
   - `severity`: "medium" (default for harsh braking)
   - `status`: "pending" (default for new events)

### 4. Application State

Sometimes the application state might not reflect the latest data from Firestore.

**Solution**:
- Refresh the browser page to reset the application state
- Navigate back to the Driver Behavior page
- Click the "Sync Now" button

## Step-by-Step Troubleshooting

1. **Navigate to the Driver Behavior page**
   - Go to the sidebar and click on "Driver Management" or "Driver Behavior"

2. **Clear all filters**
   - Set all dropdown filters to "All"
   - Clear any date range selections

3. **Click the "Sync Now" button**
   - Located in the upper right corner of the page
   - Wait for synchronization to complete

4. **Check the browser console for sync logs**
   - Open browser DevTools (F12 or Ctrl+Shift+I)
   - Look for logs related to driver behavior events
   - Check for any errors during synchronization

5. **Verify the event exists in Firestore**
   - You can do this via the Firebase Console
   - Go to the "driverBehavior" collection
   - Look for the document with ID `28H_Harsh Braking_2025-06-29T13:15:30.000Z`

## Prevention Measures

To prevent this issue in the future:

1. **Improve Webhook Response Handling**
   - Implement proper response handling in the webhook to return actual imported data
   - Update the frontend to use the returned data instead of waiting for sync

2. **Add Better Sync Feedback**
   - Show more detailed sync status information
   - Display when the last successful sync occurred

3. **Auto-Refresh After Webhook Import**
   - Automatically trigger a sync after webhook imports complete

## If the Issue Persists

If the event still doesn't appear after trying the above solutions:

1. **Check Data Format**
   - Ensure the event date is in the correct format (ISO string)
   - Verify that all required fields have valid values

2. **Verify SyncService Configuration**
   - Ensure the SyncService is properly configured to listen to the driverBehavior collection
   - Check that the driverBehaviorEvents state in AppContext is being updated

3. **Test with Manual Event Creation**
   - Try creating a new driver behavior event directly in the UI
   - If that works, it suggests the issue is specific to webhook imports