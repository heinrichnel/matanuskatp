import React, { createContext, useContext, useState, useEffect } from 'react';
import syncService, { SyncStatus } from '../utils/syncService';
import { Trip, DieselConsumptionRecord, DriverBehaviorEvent } from '../types';

// Define the context type
interface SyncContextType {
  syncStatus: SyncStatus;
  pendingChangesCount: number;
  isOnline: boolean;
  lastSynced: Date | null;
  subscribeToTrip: (tripId: string) => void;
  subscribeToDieselRecords: (fleetNumber: string) => void;
  subscribeToDriverBehavior: (driverName: string) => void;
  updateTrip: (tripId: string, data: Partial<Trip>) => Promise<void>;
  updateDieselRecord: (recordId: string, data: Partial<DieselConsumptionRecord>) => Promise<void>;
  updateDriverBehaviorEvent: (eventId: string, data: Partial<DriverBehaviorEvent>) => Promise<void>;
  linkDieselToTrip: (dieselId: string, tripId: string) => Promise<void>;
}

// Create the context
const SyncContext = createContext<SyncContextType | undefined>(undefined);

// Provider component
export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [pendingChangesCount, setPendingChangesCount] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Register listeners for sync service
  useEffect(() => {
    syncService.registerListeners({
      onSyncStatusChange: (status) => {
        setSyncStatus(status);
        if (status === 'success') {
          setLastSynced(new Date());
        }
      }
    });

    // Set up online/offline listeners
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check pending changes count from localStorage
    const pendingChangesJson = localStorage.getItem('pendingChanges');
    if (pendingChangesJson) {
      try {
        const pendingChanges = JSON.parse(pendingChangesJson);
        setPendingChangesCount(Object.keys(pendingChanges).length);
      } catch (error) {
        console.error('Error parsing pending changes:', error);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      syncService.cleanup();
    };
  }, []);

  // Update pending changes count when localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pendingChanges') {
        if (e.newValue) {
          try {
            const pendingChanges = JSON.parse(e.newValue);
            setPendingChangesCount(Object.keys(pendingChanges).length);
          } catch (error) {
            console.error('Error parsing pending changes:', error);
          }
        } else {
          setPendingChangesCount(0);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Context value
  const value: SyncContextType = {
    syncStatus,
    pendingChangesCount,
    isOnline,
    lastSynced,
    subscribeToTrip: syncService.subscribeToTrip.bind(syncService),
    subscribeToDieselRecords: syncService.subscribeToDieselRecords.bind(syncService),
    subscribeToDriverBehavior: syncService.subscribeToDriverBehavior.bind(syncService),
    updateTrip: syncService.updateTrip.bind(syncService),
    updateDieselRecord: syncService.updateDieselRecord.bind(syncService),
    updateDriverBehaviorEvent: syncService.updateDriverBehaviorEvent.bind(syncService),
    linkDieselToTrip: syncService.linkDieselToTrip.bind(syncService)
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
};

// Custom hook to use the sync context
export const useSyncContext = () => {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  return context;
};