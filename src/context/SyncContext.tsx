import React, { createContext, useContext } from 'react';
import syncService from '../utils/syncService';
import type { SyncService } from '../utils/syncService';

const SyncContext = createContext<SyncService | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SyncContext.Provider value={syncService}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSyncContext = (): SyncService => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  return context;
};