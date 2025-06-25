// src/utils/webhook.ts
import { Trip, DriverBehaviorEvent } from '../types';

// Example: fetch trips from a webhook endpoint (Google Apps Script, etc.)
export async function fetchTripsFromWebhook(): Promise<Omit<Trip, 'id' | 'costs' | 'status'>[]> {
  // Replace with your actual webhook URL
  const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || 'https://your-webhook-url.com/trips';
  const response = await fetch(WEBHOOK_URL);
  if (!response.ok) throw new Error('Failed to fetch trips from webhook');
  const data = await response.json();
  // Map/validate data as needed
  return data.map((row: any) => ({
    fleetNumber: row.fleetNumber || row.fleet || '',
    route: row.route || '',
    clientName: row.clientName || row.client || '',
    baseRevenue: parseFloat(row.baseRevenue || row.revenue || '0'),
    revenueCurrency: row.revenueCurrency || row.currency || 'ZAR',
    startDate: row.startDate || '',
    endDate: row.endDate || '',
    driverName: row.driverName || row.driver || '',
    distanceKm: parseFloat(row.distanceKm || row.distance || '0'),
    clientType: row.clientType || 'external',
    description: row.description || '',
    paymentStatus: 'unpaid',
    additionalCosts: [],
    followUpHistory: [],
  }));
}

// Fetch driver behavior events from webhook
export async function fetchDriverBehaviorEventsFromWebhook(): Promise<{imported: number, skipped: number}> {
  try {
    // Use the Cloud Function URL for driver behavior events
    const WEBHOOK_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/manualImportDriverEvents';
    
    const response = await fetch(WEBHOOK_URL);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch driver behavior events: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Driver behavior events import result:', result);
    
    return {
      imported: result.imported || 0,
      skipped: result.skipped || 0
    };
  } catch (error) {
    console.error('Error importing driver behavior events:', error);
    throw error;
  }
}

// Process driver behavior events from raw data
export function processDriverBehaviorEvents(rawEvents: any[]): DriverBehaviorEvent[] {
  return rawEvents.map(event => {
    // Map the raw event data to the expected format
    return {
      id: event.id || `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      driverId: event.driverId || '',
      driverName: event.driverName || '',
      fleetNumber: event.fleetNumber || '',
      eventType: event.eventType || 'other',
      severity: event.severity || 'medium',
      eventDate: event.eventDate || new Date().toISOString().split('T')[0],
      eventTime: event.eventTime || new Date().toTimeString().split(' ')[0].substring(0, 5),
      location: event.location || '',
      description: event.description || '',
      followUpRequired: event.followUpRequired || false,
      reportedBy: event.reportedBy || 'WebBook Script',
      reportedAt: event.reportedAt || new Date().toISOString(),
      points: Number(event.points) || 0,
      status: event.status || 'pending'
    };
  });
}

// Import trips from webhook with error handling and retry logic
export async function importTripsFromWebhook(): Promise<{imported: number, skipped: number}> {
  try {
    // Use the Cloud Function URL for trips
    const WEBHOOK_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/manualImportTrips';
    
    const response = await fetch(WEBHOOK_URL);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch trips: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Trips import result:', result);
    
    return {
      imported: result.imported || 0,
      skipped: result.skipped || 0
    };
  } catch (error) {
    console.error('Error importing trips:', error);
    throw error;
  }
}

// Function to manually trigger driver behavior events import
export async function importDriverBehaviorEventsFromWebhook(): Promise<{imported: number, skipped: number}> {
  try {
    // Use the Cloud Function URL for manual driver behavior events import
    const WEBHOOK_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/importDriverBehaviorWebhook';
    
    // Make a POST request with empty body to trigger the import
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([]) // Empty array to trigger the function to fetch from the web book
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to import driver behavior events: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Manual driver behavior events import result:', result);
    
    return {
      imported: result.imported || 0,
      skipped: result.skipped || 0
    };
  } catch (error) {
    console.error('Error manually importing driver behavior events:', error);
    throw error;
  }
}

// Function with retry logic for webhook calls
export async function retryWebhookCall<T>(
  callFn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await callFn();
    } catch (error: any) {
      lastError = error;
      console.warn(`Webhook call failed (attempt ${attempt}/${maxRetries}):`, error.message);
      
      if (attempt < maxRetries) {
        // Wait with exponential backoff before retrying
        const backoffDelay = delayMs * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${backoffDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }
    }
  }
  
  throw lastError || new Error('All webhook call attempts failed');
}