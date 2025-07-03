import { db } from '../firebase';
import {
  enableNetwork,
  disableNetwork,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  // setDoc, // Unused
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
  Unsubscribe,
  Timestamp
} from 'firebase/firestore';
import {
  Trip,
  CostEntry,
  DieselConsumptionRecord,
  DriverBehaviorEvent,
  AuditLog,
  MissedLoad,
  ActionItem,
  CARReport
} from '../types';

// Collection references
// const tripsCollection = collection(db, 'trips'); // Unused
const dieselCollection = collection(db, 'diesel');
const driverBehaviorCollection = collection(db, 'driverBehaviorEvents');
const auditLogsCollection = collection(db, 'auditLogs');

// Type for sync status
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';
export type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

// Interface for sync listeners
interface SyncListeners {
  onSyncStatusChange?: (status: SyncStatus) => void;
  onConnectionStatusChange?: (status: ConnectionStatus) => void;
  onTripUpdate?: (trip: Trip) => void;
  onDieselUpdate?: (record: DieselConsumptionRecord) => void;
  onDriverBehaviorUpdate?: (event: DriverBehaviorEvent) => void;
  onAuditLogUpdate?: (log: AuditLog) => void;
}

// Sync service class
export class SyncService {
  private listeners: SyncListeners = {};
  private dataCallbacks: Record<string, (...args: unknown[]) => void> = {};
  private tripUnsubscribes: Map<string, () => void> = new Map();
  private dieselUnsubscribes: Map<string, () => void> = new Map();
  private driverBehaviorUnsubscribes: Map<string, () => void> = new Map();
  private globalUnsubscribes: Map<string, Unsubscribe> = new Map();
  private auditLogUnsubscribes: Map<string, () => void> = new Map();
  public syncStatus: SyncStatus = 'idle';
  public connectionStatus: ConnectionStatus = 'connected';
  private pendingChanges: Map<string, unknown> = new Map();
  public isOnline: boolean = navigator.onLine;
  public lastSynced: Date | null = null;
  public pendingChangesCount = 0;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    // Initialize online status
    this.isOnline = navigator.onLine;
    console.log(`SyncService initialized. Online status: ${this.isOnline ? 'online' : 'offline'}`);

    // Setup a periodic connection check
    setInterval(() => this.checkConnection(), 60000); // Check every minute
  }

  // Register data callbacks for all collections
  public registerDataCallbacks(callbacks: Record<string, (...args: unknown[]) => void>): void {
    this.dataCallbacks = { ...this.dataCallbacks, ...callbacks };
    console.log('✅ Data callbacks registered:', Object.keys(callbacks).join(', '));
  }

  // Register listeners
  public registerListeners(listeners: SyncListeners): void {
    this.listeners = { ...this.listeners, ...listeners };
  }

  // Check connection and attempt reconnection if needed
  private async checkConnection(): Promise<void> {
    if (!this.isOnline && navigator.onLine) {
      // We were offline but now we appear to be online
      console.log('Network connection detected - attempting to reconnect');
      await this.handleOnline();
    } else if (this.isOnline && !navigator.onLine) {
      // We were online but now appear to be offline
      this.handleOffline();
    }
  }

  // Handle online event
  private handleOnline = async (): Promise<void> => {
    console.log('🟢 Connection restored - syncing pending changes');
    this.isOnline = true;
    this.setConnectionStatus('reconnecting');
    this.setSyncStatus('syncing');

    try {
      // Enable Firestore network
      await enableNetwork(db);

      // Process any pending changes
      await this.processPendingChanges();
      this.setSyncStatus('success');
      this.setConnectionStatus('connected');
      this.lastSynced = new Date();
    } catch (error) {
      console.error('Error syncing pending changes:', error);
      this.setConnectionStatus('disconnected');
      this.setSyncStatus('error');
    }
  };

  // Handle offline event
  private handleOffline = (): void => {
    console.log('🔴 Connection lost - working offline');
    this.isOnline = false;
    this.setConnectionStatus('disconnected');
    this.setSyncStatus('idle');

    // Disable Firestore network to avoid unnecessary retries
    disableNetwork(db).catch(error => {
      console.error('Error disabling Firestore network:', error);
    });
  };

  // Set sync status and notify listeners
  private setSyncStatus(status: SyncStatus): void {
    this.syncStatus = status;
    this.pendingChangesCount = this.pendingChanges.size;
    if (this.listeners.onSyncStatusChange) {
      this.listeners.onSyncStatusChange(status);
    }
  }

  // Set connection status and notify listeners
  private setConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    if (this.listeners.onConnectionStatusChange) {
      this.listeners.onConnectionStatusChange(status);
    }
  }

  // Process pending changes when back online
  private async processPendingChanges(): Promise<void> {
    if (this.pendingChanges.size === 0) return;

    console.log(`Processing ${this.pendingChanges.size} pending changes`);

    for (const [key, change] of this.pendingChanges.entries()) {
      try {
        const [collection, id] = key.split(':');
        const docRef = doc(db, collection, id);

        // Add server timestamp
        if (typeof change !== 'object' || change === null) {
          console.error(`Invalid change for ${key}:`, change);
          continue;
        }

        const dataWithTimestamp = {
          ...(change as Record<string, unknown>),
          updatedAt: serverTimestamp()
        };

        await updateDoc(docRef, dataWithTimestamp);
        console.log(`✅ Synced change for ${collection}/${id}`);

        // Remove from pending changes
        this.pendingChanges.delete(key);
      } catch (error) {
        console.error(`Error syncing change for ${key}:`, error);
      }
    }
  }

  // Subscribe to a trip's real-time updates
  public subscribeToTrip(tripId: string): void {
    // DEBUG ONLY - Validate context
    console.log('🔍 subscribeToTrip called with tripId:', tripId);
    console.log('🔍 this context available:', this !== undefined);
    console.log('🔍 tripUnsubscribes available:', this?.tripUnsubscribes !== undefined);

    // Guard against undefined 'this'
    if (!this || !this.tripUnsubscribes) {
      console.error('❌ ERROR: Missing context in subscribeToTrip - "this" is unavailable', new Error().stack);
      return; // Abort to prevent crash
    }

    // Unsubscribe if already subscribed
    if (this.tripUnsubscribes.has(tripId)) {
      this.tripUnsubscribes.get(tripId)?.();
    }

    const tripRef = doc(db, 'trips', tripId);

    const unsubscribe = onSnapshot(
      tripRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const tripData = snapshot.data();

          // Convert Firestore timestamps to ISO strings using our helper function
          const trip = convertTimestamps(tripData) as Trip;

          console.log(`🔄 Real-time update for trip ${tripId}`);

          if (this.listeners.onTripUpdate) {
            this.listeners.onTripUpdate({ ...trip, id: tripId });
          }
        }
      },
      (error) => {
        console.error(`Error subscribing to trip ${tripId}:`, error);
      }
    );

    this.tripUnsubscribes.set(tripId, unsubscribe);
  }

  // Unsubscribe from trips collection subscription
  public unsubscribeFromTrips(): void {
    // Unsubscribe from global trips listener if it exists
    if (this.globalUnsubscribes.has('allTrips')) {
      this.globalUnsubscribes.get('allTrips')?.();
      this.globalUnsubscribes.delete('allTrips');
      console.log('🔄 Unsubscribed from trips collection');
    }
  }

  // Subscribe to all trips (global listener)
  public subscribeToAllTrips(): void {
    // Clear any existing global trip listeners
    this.unsubscribeFromTrips();

    const tripsQuery = query(collection(db, 'trips'), orderBy('startDate', 'desc'));

    const unsubscribe = onSnapshot(
      tripsQuery,
      (snapshot) => {
        const trips: Trip[] = [];

        // Track changes for debugging
        let added = 0, modified = 0, removed = 0;

        // Process document changes
        snapshot.docChanges().forEach(change => {
          const id = change.doc.id;
          const data = convertTimestamps(change.doc.data());

          if (change.type === 'added') {
            added++;
            console.log(`Trip added: ${id}`);
            if (typeof data === 'object' && data !== null) {
              trips.push({ id, ...(data as object) } as Trip);
            } else {
              trips.push({ id } as Trip);
            }
          } else if (change.type === 'modified') {
            modified++;
            console.log(`Trip modified: ${id}`);
            if (typeof data === 'object' && data !== null) {
              trips.push({ id, ...(data as object) } as Trip);
            } else {
              trips.push({ id } as Trip);
            }
          } else if (change.type === 'removed') {
            removed++;
            console.log(`Trip removed: ${id}`);
            // Removed trips will be filtered out when we rebuild the trips array
          }
        });

        // If we have added/modified/removed items, do a full rebuild of the trips array
        if (added > 0 || modified > 0 || removed > 0) {
          console.log(`🔄 Global trips listener changes: ${added} added, ${modified} modified, ${removed} removed`);

          // For a complete refresh, get all current documents
          const currentTrips: Trip[] = [];
          snapshot.forEach(doc => {
            const data = convertTimestamps(doc.data());
            if (typeof data === 'object' && data !== null) {
              currentTrips.push({ id: doc.id, ...(data as object) } as Trip);
            } else {
              currentTrips.push({ id: doc.id } as Trip);
            }
          });

          if (typeof this.dataCallbacks.setTrips === 'function') {
            this.dataCallbacks.setTrips(currentTrips);
          } else {
            console.warn('⚠️ setTrips callback not registered');
          }
          this.lastSynced = new Date();
        }
      },
      (error) => {
        console.error('Error in global trips listener:', error);
        // Don't change connection status here to avoid false disconnections
      }
    );

    this.globalUnsubscribes.set('allTrips', unsubscribe);
  }

  // Subscribe to diesel records for a specific fleet
  public subscribeToDieselRecords(fleetNumber: string): void {
    // Unsubscribe if already subscribed
    if (this.dieselUnsubscribes.has(fleetNumber)) {
      this.dieselUnsubscribes.get(fleetNumber)?.();
    }

    const q = query(
      dieselCollection,
      where('fleetNumber', '==', fleetNumber),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const dieselData = change.doc.data();

          // Convert Firestore timestamps to ISO strings
          const dieselRecord = convertTimestamps(dieselData) as DieselConsumptionRecord;

          if (change.type === 'added' || change.type === 'modified') {
            console.log(`🔄 Real-time update for diesel record ${change.doc.id}`);

            if (this.listeners.onDieselUpdate) {
              this.listeners.onDieselUpdate({ ...dieselRecord, id: change.doc.id });
            }
          }
        });
      },
      (error) => {
        console.error(`Error subscribing to diesel records for fleet ${fleetNumber}:`, error);
      }
    );

    this.dieselUnsubscribes.set(fleetNumber, unsubscribe);
  }

  // Subscribe to driver behavior events for a specific driver
  public subscribeToDriverBehavior(driverName: string): void {
    // Unsubscribe if already subscribed
    if (this.driverBehaviorUnsubscribes.has(driverName)) {
      this.driverBehaviorUnsubscribes.get(driverName)?.();
    }

    const q = query(
      driverBehaviorCollection,
      where('driverName', '==', driverName),
      orderBy('eventDate', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const eventData = change.doc.data();

          // Convert Firestore timestamps to ISO strings
          const event = convertTimestamps(eventData) as DriverBehaviorEvent;

          if (change.type === 'added' || change.type === 'modified') {
            console.log(`🔄 Real-time update for driver behavior event ${change.doc.id}`);

            if (this.listeners.onDriverBehaviorUpdate) {
              this.listeners.onDriverBehaviorUpdate({ ...event, id: change.doc.id });
            }
          }
        });
      },
      (error) => {
        console.error(`Error subscribing to driver behavior for ${driverName}:`, error);
      }
    );

    this.driverBehaviorUnsubscribes.set(driverName, unsubscribe);
  }

  // Subscribe to all driver behavior events (global listener)
  public subscribeToAllDriverBehaviorEvents(): void {
    // Clear any existing global driver behavior listeners
    if (this.globalUnsubscribes.has('allDriverBehavior')) {
      this.globalUnsubscribes.get('allDriverBehavior')?.();
    }

    const eventsQuery = query(
      collection(db, 'driverBehaviorEvents'),
      orderBy('eventDate', 'desc')
    );

    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        // Track changes for debugging
        let added = 0, modified = 0, removed = 0;

        // Process document changes
        snapshot.docChanges().forEach(change => {
          const id = change.doc.id;

          if (change.type === 'added') {
            added++;
            console.log(`Driver behavior event added: ${id}`);
          } else if (change.type === 'modified') {
            modified++;
            console.log(`Driver behavior event modified: ${id}`);
          } else if (change.type === 'removed') {
            removed++;
            console.log(`Driver behavior event removed: ${id}`);
          }
        });

        if (added > 0 || modified > 0 || removed > 0) {
          console.log(`🔄 Driver behavior changes: ${added} added, ${modified} modified, ${removed} removed`);

          // Get all current documents for a full refresh
          const events: DriverBehaviorEvent[] = [];
          snapshot.forEach(doc => {
            const data = convertTimestamps(doc.data());
            if (typeof data === 'object' && data !== null) {
              events.push({ id: doc.id, ...(data as object) } as DriverBehaviorEvent);
            } else {
              events.push({ id: doc.id } as DriverBehaviorEvent);
            }
          });

          if (typeof this.dataCallbacks.setDriverBehaviorEvents === 'function') {
            this.dataCallbacks.setDriverBehaviorEvents(events);
          } else {
            console.warn('⚠️ setDriverBehaviorEvents callback not registered');
          }
          this.lastSynced = new Date();
        }
      },
      (error) => {
        console.error('Error in global driver behavior listener:', error);
      }
    );

    this.globalUnsubscribes.set('allDriverBehavior', unsubscribe);
  }

  // Subscribe to all diesel records (global listener)
  public subscribeToAllDieselRecords(): void {
    // Clear any existing global diesel listeners
    if (this.globalUnsubscribes.has('allDiesel')) {
      this.globalUnsubscribes.get('allDiesel')?.();
    }

    const recordsQuery = query(
      collection(db, 'diesel'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      recordsQuery,
      (snapshot) => {
        // Track changes for debugging
        let added = 0, modified = 0, removed = 0;

        // Process document changes
        snapshot.docChanges().forEach(change => {
          const id = change.doc.id;

          if (change.type === 'added') {
            added++;
            console.log(`Diesel record added: ${id}`);
          } else if (change.type === 'modified') {
            modified++;
            console.log(`Diesel record modified: ${id}`);
          } else if (change.type === 'removed') {
            removed++;
            console.log(`Diesel record removed: ${id}`);
          }
        });

        if (added > 0 || modified > 0 || removed > 0) {
          console.log(`🔄 Diesel records changes: ${added} added, ${modified} modified, ${removed} removed`);

          // Get all current documents for a full refresh
          const records: DieselConsumptionRecord[] = [];
          snapshot.forEach(doc => {
            const data = convertTimestamps(doc.data());
            if (typeof data === 'object' && data !== null) {
              records.push({ id: doc.id, ...(data as object) } as DieselConsumptionRecord);
            } else {
              records.push({ id: doc.id } as DieselConsumptionRecord);
            }
          });

          if (typeof this.dataCallbacks.setDieselRecords === 'function') {
            this.dataCallbacks.setDieselRecords(records);
          } else {
            console.warn('⚠️ setDieselRecords callback not registered');
          }
          this.lastSynced = new Date();
        }
      },
      (error) => {
        console.error('Error in global diesel listener:', error);
      }
    );

    this.globalUnsubscribes.set('allDiesel', unsubscribe);
  }

  // Subscribe to audit logs
  public subscribeToAuditLogs(): void {
    const unsubscribe = onSnapshot(
      query(auditLogsCollection, orderBy('timestamp', 'desc')),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const logData = change.doc.data();
          const log = convertTimestamps(logData) as AuditLog;

          if (change.type === 'added') {
            const auditLog = { ...log, id: change.doc.id };
            if (typeof this.dataCallbacks.setAuditLogs === 'function') {
              // Get current audit logs and add the new one
              this.dataCallbacks.setAuditLogs((prevLogs: AuditLog[]) => [auditLog, ...prevLogs]);
            } else if (this.listeners.onAuditLogUpdate) {
              this.listeners.onAuditLogUpdate(auditLog);
            }
          }
        });
      },
      (error) => {
        console.error(`Error subscribing to audit logs:`, error);
      }
    );

    this.auditLogUnsubscribes.set('all', unsubscribe);
  }

  // Update a trip with real-time sync
  public async updateTrip(tripId: string, data: Partial<Trip>): Promise<void> {
    try {
      this.setSyncStatus('syncing');

      // Clean data for Firestore (remove undefined values)
      const cleanData = cleanObjectForFirestore(data);

      // Add updatedAt timestamp
      if (typeof cleanData === 'object' && cleanData !== null) {
        const updateData = {
          ...(cleanData as object),
          updatedAt: this.isOnline ? serverTimestamp() : new Date().toISOString()
        };

        if (this.isOnline) {
          // Online - update directly
          const tripRef = doc(db, 'trips', tripId);
          await updateDoc(tripRef, updateData);
          console.log(`✅ Trip ${tripId} updated with real-time sync`);
        } else {
          // Offline - store for later sync
          this.pendingChanges.set(`trips:${tripId}`, updateData);
          console.log(`📝 Trip ${tripId} update queued for sync when online`);

          // Store in localStorage as backup
          this.storePendingChangesInLocalStorage();
        }

        this.setSyncStatus('success');
      } else {
        console.error(`Invalid trip data for ${tripId}:`, data);
        this.setSyncStatus('error');
      }
    } catch (error) {
      console.error(`Error updating trip ${tripId}:`, error);
      this.setSyncStatus('error');
      throw error;
    }
  }

  // Update a diesel record with real-time sync
  public async updateDieselRecord(recordId: string, data: Partial<DieselConsumptionRecord>): Promise<void> {
    try {
      this.setSyncStatus('syncing');

      // Clean data for Firestore
      const cleanData = cleanObjectForFirestore(data);

      // Add updatedAt timestamp
      if (typeof cleanData === 'object' && cleanData !== null) {
        const updateData = {
          ...(cleanData as object),
          updatedAt: this.isOnline ? serverTimestamp() : new Date().toISOString()
        };

        if (this.isOnline) {
          // Online - update directly
          const recordRef = doc(db, 'diesel', recordId);
          await updateDoc(recordRef, updateData);
          console.log(`✅ Diesel record ${recordId} updated with real-time sync`);
        } else {
          // Offline - store for later sync
          this.pendingChanges.set(`diesel:${recordId}`, updateData);
          console.log(`📝 Diesel record ${recordId} update queued for sync when online`);

          // Store in localStorage as backup
          this.storePendingChangesInLocalStorage();
        }

        this.setSyncStatus('success');
      } else {
        console.error(`Invalid diesel data for ${recordId}:`, data);
        this.setSyncStatus('error');
      }
    } catch (error) {
      console.error(`Error updating diesel record ${recordId}:`, error);
      this.setSyncStatus('error');
      throw error;
    }
  }

  // Update a driver behavior event with real-time sync
  public async updateDriverBehaviorEvent(eventId: string, data: Partial<DriverBehaviorEvent>): Promise<void> {
    try {
      this.setSyncStatus('syncing');

      // Clean data for Firestore
      const cleanData = cleanObjectForFirestore(data);

      // Add updatedAt timestamp
      if (typeof cleanData === 'object' && cleanData !== null) {
        const updateData = {
          ...(cleanData as object),
          updatedAt: this.isOnline ? serverTimestamp() : new Date().toISOString()
        };

        if (this.isOnline) {
          // Online - update directly
          const eventRef = doc(db, 'driverBehaviorEvents', eventId);
          await updateDoc(eventRef, updateData);
          console.log(`✅ Driver behavior event ${eventId} updated with real-time sync`);
        } else {
          // Offline - store for later sync
          this.pendingChanges.set(`driverBehaviorEvents:${eventId}`, updateData);
          console.log(`📝 Driver behavior event ${eventId} update queued for sync when online`);

          // Store in localStorage as backup
          this.storePendingChangesInLocalStorage();
        }

        this.setSyncStatus('success');
      } else {
        console.error(`Invalid driver behavior data for ${eventId}:`, data);
        this.setSyncStatus('error');
      }
    } catch (error) {
      console.error(`Error updating driver behavior event ${eventId}:`, error);
      this.setSyncStatus('error');
      throw error;
    }
  }

  // Link diesel record to trip
  public async linkDieselToTrip(dieselId: string, tripId: string): Promise<void> {
    try {
      this.setSyncStatus('syncing');

      // Get the diesel record
      const dieselRef = doc(db, 'diesel', dieselId);
      const dieselSnap = await getDocs(query(collection(db, 'diesel'), where('id', '==', dieselId)));

      if (dieselSnap.empty) {
        throw new Error(`Diesel record ${dieselId} not found`);
      }

      const dieselData = dieselSnap.docs[0].data() as DieselConsumptionRecord;

      // Get the trip
      const tripRef = doc(db, 'trips', tripId);
      const tripSnap = await getDocs(query(collection(db, 'trips'), where('id', '==', tripId)));

      if (tripSnap.empty) {
        throw new Error(`Trip ${tripId} not found`);
      }

      const tripData = tripSnap.docs[0].data() as Trip;

      // Update diesel record with trip ID
      await updateDoc(dieselRef, {
        tripId,
        updatedAt: serverTimestamp()
      });

      // Create a cost entry in the trip
      const costEntry: Omit<CostEntry, 'id'> = {
        tripId,
        category: 'Diesel',
        subCategory: `${dieselData.fuelStation} - ${dieselData.fleetNumber}`,
        amount: dieselData.totalCost,
        currency: dieselData.currency || tripData.revenueCurrency,
        referenceNumber: `DIESEL-${dieselId}`,
        date: dieselData.date,
        notes: `Diesel: ${dieselData.litresFilled} liters at ${dieselData.fuelStation}`,
        attachments: [],
        isFlagged: false,
        isSystemGenerated: false
      };

      // Add cost entry to trip
      const updatedCosts = [...(tripData.costs || []), { ...costEntry, id: `cost-${Date.now()}` }];

      await updateDoc(tripRef, {
        costs: updatedCosts,
        updatedAt: serverTimestamp()
      });

      console.log(`✅ Diesel record ${dieselId} linked to trip ${tripId}`);
      this.setSyncStatus('success');
    } catch (error) {
      console.error(`Error linking diesel to trip:`, error);
      this.setSyncStatus('error');
      throw error;
    }
  }

  // Store pending changes in localStorage as backup
  private storePendingChangesInLocalStorage(): void {
    try {
      const pendingChangesObj = Object.fromEntries(this.pendingChanges);
      localStorage.setItem('pendingChanges', JSON.stringify(pendingChangesObj));
    } catch (error) {
      console.error('Error storing pending changes in localStorage:', error);
    }
  }

  // Subscribe to all missed loads (global listener)
  public subscribeToAllMissedLoads(): void {
    // Clear any existing global missed loads listeners
    if (this.globalUnsubscribes.has('allMissedLoads')) {
      this.globalUnsubscribes.get('allMissedLoads')?.();
    }

    const missedLoadsQuery = query(
      collection(db, 'missedLoads'),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(
      missedLoadsQuery,
      (snapshot) => {
        // Track changes for debugging
        let added = 0, modified = 0, removed = 0;

        // Process document changes
        snapshot.docChanges().forEach(change => {
          const id = change.doc.id;

          if (change.type === 'added') {
            added++;
            console.log(`Missed load added: ${id}`);
          } else if (change.type === 'modified') {
            modified++;
            console.log(`Missed load modified: ${id}`);
          } else if (change.type === 'removed') {
            removed++;
            console.log(`Missed load removed: ${id}`);
          }
        });

        if (added > 0 || modified > 0 || removed > 0) {
          console.log(`🔄 Missed loads changes: ${added} added, ${modified} modified, ${removed} removed`);

          // Get all current documents for a full refresh
          const missedLoads: MissedLoad[] = [];
          snapshot.forEach(doc => {
            const data = convertTimestamps(doc.data());
            if (typeof data === 'object' && data !== null) {
              missedLoads.push({ id: doc.id, ...(data as object) } as MissedLoad);
            } else {
              missedLoads.push({ id: doc.id } as MissedLoad);
            }
          });

          if (typeof this.dataCallbacks.setMissedLoads === 'function') {
            this.dataCallbacks.setMissedLoads(missedLoads);
          } else {
            console.warn('⚠️ setMissedLoads callback not registered');
          }
          this.lastSynced = new Date();
        }
      },
      (error) => {
        console.error('Error in global missed loads listener:', error);
      }
    );

    this.globalUnsubscribes.set('allMissedLoads', unsubscribe);
  }

  // Subscribe to all action items (global listener)
  public subscribeToAllActionItems(): void {
    // Clear any existing global action items listeners
    if (this.globalUnsubscribes.has('allActionItems')) {
      this.globalUnsubscribes.get('allActionItems')?.();
    }

    const actionItemsQuery = query(
      collection(db, 'actionItems'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      actionItemsQuery,
      (snapshot) => {
        // Track changes for debugging
        let added = 0, modified = 0, removed = 0;

        // Process document changes
        snapshot.docChanges().forEach(change => {
          const id = change.doc.id;

          if (change.type === 'added') {
            added++;
            console.log(`Action item added: ${id}`);
          } else if (change.type === 'modified') {
            modified++;
            console.log(`Action item modified: ${id}`);
          } else if (change.type === 'removed') {
            removed++;
            console.log(`Action item removed: ${id}`);
          }
        });

        if (added > 0 || modified > 0 || removed > 0) {
          console.log(`🔄 Action items changes: ${added} added, ${modified} modified, ${removed} removed`);

          // Get all current documents for a full refresh
          const actionItems: ActionItem[] = [];
          snapshot.forEach(doc => {
            const data = convertTimestamps(doc.data());
            if (typeof data === 'object' && data !== null) {
              actionItems.push({ id: doc.id, ...(data as object) } as ActionItem);
            } else {
              actionItems.push({ id: doc.id } as ActionItem);
            }
          });

          if (typeof this.dataCallbacks.setActionItems === 'function') {
            this.dataCallbacks.setActionItems(actionItems);
          } else {
            console.warn('⚠️ setActionItems callback not registered');
          }
          this.lastSynced = new Date();
        }
      },
      (error) => {
        console.error('Error in global action items listener:', error);
      }
    );

    this.globalUnsubscribes.set('allActionItems', unsubscribe);
  }

  // Subscribe to all CAR reports (global listener)
  public subscribeToAllCARReports(): void {
    // Clear any existing global CAR reports listeners
    if (this.globalUnsubscribes.has('allCARReports')) {
      this.globalUnsubscribes.get('allCARReports')?.();
    }

    const carReportsQuery = query(
      collection(db, 'carReports'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      carReportsQuery,
      (snapshot) => {
        // Track changes for debugging
        let added = 0, modified = 0, removed = 0;

        // Process document changes
        snapshot.docChanges().forEach(change => {
          const id = change.doc.id;

          if (change.type === 'added') {
            added++;
            console.log(`CAR report added: ${id}`);
          } else if (change.type === 'modified') {
            modified++;
            console.log(`CAR report modified: ${id}`);
          } else if (change.type === 'removed') {
            removed++;
            console.log(`CAR report removed: ${id}`);
          }
        });

        if (added > 0 || modified > 0 || removed > 0) {
          console.log(`🔄 CAR reports changes: ${added} added, ${modified} modified, ${removed} removed`);

          // Get all current documents for a full refresh
          const carReports: CARReport[] = [];
          snapshot.forEach(doc => {
            const data = convertTimestamps(doc.data());
            if (typeof data === 'object' && data !== null) {
              carReports.push({ id: doc.id, ...(data as object) } as CARReport);
            } else {
              carReports.push({ id: doc.id } as CARReport);
            }
          });

          if (typeof this.dataCallbacks.setCarReports === 'function') {
            this.dataCallbacks.setCarReports(carReports);
          } else {
            console.warn('⚠️ setCarReports callback not registered');
          }
          this.lastSynced = new Date();
        }
      },
      (error) => {
        console.error('Error in global CAR reports listener:', error);
      }
    );

    this.globalUnsubscribes.set('allCARReports', unsubscribe);
  }

  // Load pending changes from localStorage
  public loadPendingChangesFromLocalStorage(): void {
    try {
      const pendingChangesJson = localStorage.getItem('pendingChanges');
      if (pendingChangesJson) {
        const pendingChangesObj = JSON.parse(pendingChangesJson);
        this.pendingChanges = new Map(Object.entries(pendingChangesObj));
        console.log(`Loaded ${this.pendingChanges.size} pending changes from localStorage`);
      }
    } catch (error) {
      console.error('Error loading pending changes from localStorage:', error);
    }
  }

  // Cleanup method to unsubscribe from all listeners
  public cleanup(): void {
    console.log("🧹 Cleaning up all SyncService listeners");
    // Unsubscribe from all individual trip listeners
    for (const unsubscribe of this.tripUnsubscribes.values()) {
      unsubscribe();
    }
    this.tripUnsubscribes.clear();

    // Unsubscribe from all individual diesel listeners
    for (const unsubscribe of this.dieselUnsubscribes.values()) {
      unsubscribe();
    }
    this.dieselUnsubscribes.clear();

    // Unsubscribe from all individual driver behavior listeners
    for (const unsubscribe of this.driverBehaviorUnsubscribes.values()) {
      unsubscribe();
    }
    this.driverBehaviorUnsubscribes.clear();

    // Unsubscribe from all individual audit log listeners
    for (const unsubscribe of this.auditLogUnsubscribes.values()) {
      unsubscribe();
    }
    this.auditLogUnsubscribes.clear();

    // Unsubscribe from all global listeners
    for (const unsubscribe of this.globalUnsubscribes.values()) {
      unsubscribe();
    }
    this.globalUnsubscribes.clear();

    // Remove event listeners
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  // Get connection status
  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }
}

// Helper function to clean objects for Firestore (remove undefined values)
export const cleanObjectForFirestore = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) {
    return null;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => cleanObjectForFirestore(item));
  }

  if (typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (value !== undefined) {
        cleaned[key] = cleanObjectForFirestore(value);
      }
    }
    return cleaned;
  }

  return obj;
};

// Helper function to convert Firestore timestamps to ISO strings
export const convertTimestamps = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle Firestore Timestamp objects
  try {
    if (obj instanceof Timestamp) {
      return obj.toDate().toISOString();
    }

    // Also check for a toDate() method to handle different Timestamp implementations
    if (obj &&
      typeof obj === 'object' &&
      'toDate' in obj &&
      typeof (obj as { toDate: () => Date }).toDate === 'function'
    ) {
      return (obj as { toDate: () => Date }).toDate().toISOString();
    }
  } catch (err) {
    console.error("Error converting timestamp:", err);
    // Return the original object if conversion fails
    return obj;
  }

  if (Array.isArray(obj)) {
    // Safely convert array items
    try {
      return obj.map(item => convertTimestamps(item));
    } catch (err) {
      console.error("Error converting array items:", err);
      return obj;
    }
  }

  if (typeof obj === 'object') {
    // Handle regular objects
    try {
      const converted: Record<string, any> = {};
      Object.entries(obj).forEach(([key, value]) => {
        if (value !== undefined) {
          converted[key] = convertTimestamps(value);
        }
      });
      return converted;
    } catch (err) {
      console.error("Error converting object properties:", err);
      return obj;
    }
  }

  return obj;
};

// Create and export a singleton instance
export const syncService = new SyncService();

// Initialize by loading any pending changes
syncService.loadPendingChangesFromLocalStorage();

export default syncService;