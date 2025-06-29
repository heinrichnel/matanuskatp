Here's the fixed version with all missing closing brackets and proper formatting:

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trip, CostEntry, Attachment, AdditionalCost, DelayReason, MissedLoad, DieselConsumptionRecord, DriverBehaviorEvent, ActionItem, CARReport } from '../types';
import { AuditLog as AuditLogType } from '../types/audit';
import { doc, updateDoc, collection, addDoc, deleteDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import {
  db,
  listenToTrips,
  listenToDieselRecords,
  listenToMissedLoads,
  listenToDriverBehaviorEvents,
  listenToActionItems,
  listenToCARReports,
  addTripToFirebase,
  updateTripInFirebase,
  deleteTripFromFirebase,
  addMissedLoadToFirebase,
  updateMissedLoadInFirebase,
  deleteMissedLoadFromFirebase,
  addDieselToFirebase,
  // updateDieselInFirebase, // Unused
  // deleteDieselFromFirebase, // Unused
  listenToAuditLogs,
  addAuditLogToFirebase
} from '../firebase';
import { generateTripId, cleanObjectForFirestore } from '../utils/helpers';
import { sendTripEvent, sendDriverBehaviorEvent } from '../utils/webhookSenders';
import { v4 as uuidv4 } from 'uuid';
import syncService from '../utils/syncService';

// ... [previous interface and context definitions remain the same]

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ... [previous state definitions and useEffect remain the same]

  const value: AppContextType = {
    trips,
    addTrip,
    updateTrip,
    deleteTrip, 
    getTrip,
    addCostEntry,
    updateCostEntry,
    deleteCostEntry,
    addAttachment: async () => { console.warn("Function not implemented"); return ""; },
    deleteAttachment: async () => { console.warn("Function not implemented"); },
    addAdditionalCost: async () => { console.warn("Function not implemented"); return ""; }, 
    removeAdditionalCost: async () => { console.warn("Function not implemented"); },
    addDelayReason: async () => { console.warn("Function not implemented"); return ""; },
    missedLoads,
    addMissedLoad,
    updateMissedLoad,
    deleteMissedLoad, 
    updateInvoicePayment,
    importTripsFromCSV,
    triggerTripImport,
    importCostsFromCSV: async () => { console.warn("Function not implemented"); },
    importTripsFromWebhook,
    importDriverBehaviorEventsFromWebhook,
    dieselRecords,
    addDieselRecord,
    updateDieselRecord,
    deleteDieselRecord,
    importDieselFromCSV: async () => { console.warn("Function not implemented"); },
    updateDieselDebrief: async () => { console.warn("Function not implemented"); },
    allocateDieselToTrip: async () => { console.warn("Function not implemented"); },
    removeDieselFromTrip: async () => { console.warn("Function not implemented"); },
    driverBehaviorEvents,
    addDriverBehaviorEvent,
    updateDriverBehaviorEvent,
    deleteDriverBehaviorEvent,
    getDriverPerformance: (driverName: string) => {
      const events = driverBehaviorEvents.filter(e => e.driverName === driverName);
      const totalPoints = events.reduce((sum, e) => sum + (e.points || 0), 0);
      const behaviorScore = Math.max(0, Math.min(100, 100 - totalPoints));
      return {
        driverName, 
        events,
        totalPoints,
        behaviorScore,
        eventCount: events.length,
      };
    },
    getAllDriversPerformance: () => {
      const driverNames = [...new Set(driverBehaviorEvents.map(e => e.driverName))];
      return driverNames.map(driverName => {
        const events = driverBehaviorEvents.filter(e => e.driverName === driverName);
        const totalPoints = events.reduce((sum, e) => sum + (e.points || 0), 0);
        const behaviorScore = Math.max(0, Math.min(100, 100 - totalPoints));
        return {
          driverName,
          events, 
          totalPoints,
          behaviorScore,
          eventCount: events.length,
        };
      });
    },
    triggerDriverBehaviorImport,
    actionItems,
    addActionItem, 
    updateActionItem,
    deleteActionItem,
    addActionItemComment, 
    carReports,
    addCARReport,
    updateCARReport,
    deleteCARReport,
    connectionStatus,
    bulkDeleteTrips: async () => { console.warn("Function not implemented"); },
    updateTripStatus,
    isLoading,
    setIsLoading,
    setTrips,
    completeTrip,
    auditLogs,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
```