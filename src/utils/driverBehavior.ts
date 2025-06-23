// src/utils/driverBehavior.ts
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';

export interface DriverBehaviorEvent {
  id: string;
  reportedAt: string;
  description: string;
  driverName: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  fleetNumber: string;
  location: string;
  severity: string;
  status: string;
  points: number;
  reportedBy: string;
}

// Fetch all driver behavior events, ignoring those with eventType === 'UNKNOWN', ordered by reportedAt desc
export async function fetchDriverBehaviorEvents(): Promise<DriverBehaviorEvent[]> {
  const q = query(
    collection(db, 'driverBehavior'),
    where('eventType', '!=', 'UNKNOWN'),
    orderBy('eventType'),
    orderBy('reportedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  // Deduplicate by id (countId from Google Sheet)
  const seen = new Set<string>();
  const events: DriverBehaviorEvent[] = [];
  snapshot.docs.forEach(doc => {
    const data = doc.data() as DriverBehaviorEvent;
    if (!seen.has(data.id)) {
      seen.add(data.id);
      events.push({ ...data, id: doc.id });
    }
  });
  return events;
}

// Optionally, a function to trigger a sync from the Web Book Cloud Function endpoint
export async function triggerWebBookSync(): Promise<string> {
  const response = await fetch('https://us-central1-mat1-9e6b3.cloudfunctions.net/importDriverEventsFromWebBook', {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to trigger Web Book sync');
  return response.text();
}
