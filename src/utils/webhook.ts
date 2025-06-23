// src/utils/webhook.ts
import { Trip } from '../types';

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
