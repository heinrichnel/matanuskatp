import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Trip,
  CostEntry,
  Attachment,
  AdditionalCost,
  DelayReason,
  MissedLoad,
  DieselConsumptionRecord,
  DriverBehaviorEvent,
  ActionItem,
  CARReport,
  FLEETS_WITH_PROBES
} from '../types';
import { AuditLog as AuditLogType } from '../types/audit';
import {
  addTripToFirebase,
  updateTripInFirebase,
  deleteTripFromFirebase,
  addMissedLoadToFirebase,
  updateMissedLoadInFirebase,
  deleteMissedLoadFromFirebase,
  addDieselToFirebase,
  updateDieselInFirebase,
  deleteDieselFromFirebase,
  listenToAuditLogs,
  addAuditLogToFirebase
} from '../firebase';
import { generateTripId } from '../utils/helpers';
import { sendTripEvent, sendDriverBehaviorEvent } from '../utils/webhookSenders';
import { v4 as uuidv4 } from 'uuid';
import syncService from '../utils/syncService';

interface AppContextType {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'costs' | 'status'>) => Promise<string>;
  updateTrip: (trip: Trip) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  getTrip: (id: string) => Trip | undefined;

  addCostEntry: (costEntry: Omit<CostEntry, 'id' | 'attachments'>, files?: FileList) => Promise<string>;
  updateCostEntry: (costEntry: CostEntry) => Promise<void>;
  deleteCostEntry: (id: string) => Promise<void>;

  addAttachment: (attachment: Omit<Attachment, 'id'>) => Promise<string>;
  deleteAttachment: (id: string) => Promise<void>;

  addAdditionalCost: (tripId: string, cost: Omit<AdditionalCost, 'id'>, files?: FileList) => Promise<string>;
  removeAdditionalCost: (tripId: string, costId: string) => Promise<void>;

  addDelayReason: (tripId: string, delay: Omit<DelayReason, 'id'>) => Promise<string>;

  missedLoads: MissedLoad[];
  addMissedLoad: (missedLoad: Omit<MissedLoad, 'id'>) => Promise<string>;
  updateMissedLoad: (missedLoad: MissedLoad) => Promise<void>;
  deleteMissedLoad: (id: string) => Promise<void>;

  updateInvoicePayment: (tripId: string, paymentData: any) => Promise<void>;

  importTripsFromCSV: (trips: Omit<Trip, 'id' | 'costs' | 'status'>[]) => Promise<void>;
  triggerTripImport: () => Promise<void>;
  importCostsFromCSV: (costs: Omit<CostEntry, 'id' | 'attachments'>[]) => Promise<void>;
  importTripsFromWebhook: () => Promise<{ imported: number, skipped: number }>;
  importDriverBehaviorEventsFromWebhook: () => Promise<{ imported: number, skipped: number }>;

  dieselRecords: DieselConsumptionRecord[];
  addDieselRecord: (record: Omit<DieselConsumptionRecord, 'id'>) => Promise<string>;
  updateDieselRecord: (record: DieselConsumptionRecord) => Promise<void>;
  deleteDieselRecord: (id: string) => Promise<void>;
  importDieselFromCSV: (records: Omit<DieselConsumptionRecord, 'id'>[]) => Promise<void>;

  updateDieselDebrief: (recordId: string, debriefData: any) => Promise<void>;

  allocateDieselToTrip: (dieselId: string, tripId: string) => Promise<void>;
  removeDieselFromTrip: (dieselId: string) => Promise<void>;

  driverBehaviorEvents: DriverBehaviorEvent[];
  addDriverBehaviorEvent: (event: Omit<DriverBehaviorEvent, 'id'>, files?: FileList) => Promise<string>;
  updateDriverBehaviorEvent: (event: DriverBehaviorEvent) => Promise<void>;
  deleteDriverBehaviorEvent: (id: string) => Promise<void>;
  getDriverPerformance: (driverName: string) => any;
  getAllDriversPerformance: () => any[];
  triggerDriverBehaviorImport: () => Promise<void>;

  actionItems: ActionItem[];
  addActionItem: (item: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => Promise<string>;
  updateActionItem: (item: ActionItem) => Promise<void>;
  deleteActionItem: (id: string) => Promise<void>;
  addActionItemComment: (itemId: string, comment: string) => Promise<void>;

  carReports: CARReport[];
  addCARReport: (report: Omit<CARReport, 'id' | 'createdAt' | 'updatedAt'>, files?: FileList) => Promise<string>;
  updateCARReport: (report: CARReport, files?: FileList) => Promise<void>;
  deleteCARReport: (id: string) => Promise<void>;

  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';

  bulkDeleteTrips: (tripIds: string[]) => Promise<void>;

  updateTripStatus: (tripId: string, status: 'shipped' | 'delivered', notes: string) => Promise<void>;

  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  completeTrip: (tripId: string) => Promise<void>;
  auditLogs: AuditLogType[];

  // Add isLoading property to fix TypeScript error in ActiveTrips component
  isLoading: {
    loadTrips?: boolean;
    addTrip?: boolean;
    updateTrip?: boolean;
    [key: string]: boolean | undefined;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [missedLoads, setMissedLoads] = useState<MissedLoad[]>([]);
  const [dieselRecords, setDieselRecords] = useState<DieselConsumptionRecord[]>([]);
  const [driverBehaviorEvents, setDriverBehaviorEvents] = useState<DriverBehaviorEvent[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [carReports, setCARReports] = useState<CARReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogType[]>([]);
  const [connectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected'); // TODO: Implement actual connection status monitoring

  useEffect(() => {
    // Set up all data subscriptions through the SyncService
    syncService.subscribeToAllTrips(setTrips);
    syncService.subscribeToAllMissedLoads(setMissedLoads);
    syncService.subscribeToAllDieselRecords(setDieselRecords);
    syncService.subscribeToAllDriverBehaviorEvents(setDriverBehaviorEvents);
    syncService.subscribeToAllActionItems(setActionItems);
    syncService.subscribeToAllCARReports(setCARReports);
    syncService.subscribeToAuditLogs(setAuditLogs);

    return () => {
      // Let SyncService handle unsubscribing from all listeners
      syncService.cleanup();
    };
  }, []);

  // Add loading state management to addTrip and updateTrip
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  
  const addTrip = async (trip: Omit<Trip, 'id' | 'costs' | 'status'>): Promise<string> => {
    try {
      setIsLoading(prev => ({ ...prev, addTrip: true }));
      
      const newTrip = {
        ...trip,
        id: generateTripId(),
        costs: [],
        status: 'active' as 'active',
      };
      return await addTripToFirebase(newTrip as Trip);
    } finally {
      setIsLoading(prev => ({ ...prev, addTrip: false }));
    }
  };

  const updateTrip = async (trip: Trip): Promise<void> => {
    try {
      setIsLoading(prev => ({ ...prev, updateTrip: true }));
      
      // Get the original trip for audit logging
      const originalTrip = trips.find(t => t.id === trip.id);
      
      await updateTripInFirebase(trip.id, trip);
      
      // Log trip update for audit trail
      if (originalTrip) {
        await addAuditLogToFirebase({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          user: 'system', // Replace with actual user
          action: 'update',
          entity: 'trip',
          entityId: trip.id,
          details: `Trip ${trip.id} updated`,
          changes: {
            before: originalTrip,
            after: trip
          }
        });
      }
    } finally {
      setIsLoading(prev => ({ ...prev, updateTrip: false }));
    }
  };

  const deleteTrip = async (id: string): Promise<void> => {
    try {
      const tripToDelete = trips.find(t => t.id === id);
      if (tripToDelete) {
        await addAuditLogToFirebase({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          user: 'system', // Replace with actual user
          action: 'delete',
          entity: 'trip',
          entityId: id,
          details: `Trip ${id} deleted`,
          changes: tripToDelete
        });
      }
      await deleteTripFromFirebase(id);
      // Optimistically remove from local state
      setTrips(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  };

  const getTrip = (id: string): Trip | undefined => {
    return trips.find(t => t.id === id);
  };

  const addMissedLoad = async (missedLoad: Omit<MissedLoad, 'id'>): Promise<string> => {
    const newMissedLoad = { ...missedLoad, id: uuidv4() };
    return await addMissedLoadToFirebase(newMissedLoad as MissedLoad);
  };

  const updateMissedLoad = async (missedLoad: MissedLoad): Promise<void> => {
    await updateMissedLoadInFirebase(missedLoad.id, missedLoad);
  };

  const deleteMissedLoad = async (id: string): Promise<void> => {
    try {
      // Set loading state
      setIsLoading(prev => ({ ...prev, [`deleteMissedLoad-${id}`]: true }));
      
      // Delete from Firestore
      await deleteMissedLoadFromFirebase(id);
      
      // Optimistically update local state
      setMissedLoads(prev => prev.filter(load => load.id !== id));
    } catch (error) {
      console.error("Error deleting missed load:", error);
      throw error;
    } finally {
      // Clear loading state
      setIsLoading(prev => {
        const newState = { ...prev };
        delete newState[`deleteMissedLoad-${id}`];
        return newState;
      });
    }
  };

  const completeTrip = async (tripId: string): Promise<void> => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      const updatedTrip = {
        ...trip,
        status: 'completed' as 'completed',
        completedAt: new Date().toISOString(),
        completedBy: 'Current User' // In a real app, use the logged-in user
      };
      await updateTripInFirebase(updatedTrip.id, updatedTrip);
    }
  };

  // Placeholder implementations for other functions
  const placeholder = async () => { console.warn("Function not implemented"); };
  const placeholderString = async () => { console.warn("Function not implemented"); return ""; };
  const placeholderWebhook = async () => { console.warn("Function not implemented"); return { imported: 0, skipped: 0 }; };

  const addDieselRecord = async (record: Omit<DieselConsumptionRecord, 'id'>): Promise<string> => {
    const newRecord = {
      ...record,
      id: `diesel-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If linked to a trip, create a cost entry
    if (newRecord.tripId) {
      const trip = trips.find(t => t.id === newRecord.tripId);
      if (trip) {
        const costEntry: CostEntry = {
          id: `cost-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          tripId: trip.id,
          category: 'Diesel',
          subCategory: `${newRecord.fuelStation} - ${newRecord.fleetNumber}`,
          amount: newRecord.totalCost,
          currency: newRecord.currency || trip.revenueCurrency,
          referenceNumber: `DIESEL-${newRecord.id}`,
          date: newRecord.date,
          notes: `Diesel: ${newRecord.litresFilled} liters at ${newRecord.fuelStation}`,
          attachments: [],
          isFlagged: false
        };

        // Add cost entry to trip
        const updatedTrip = {
          ...trip,
          costs: [...trip.costs, costEntry]
        };

        await updateTripInFirebase(trip.id, updatedTrip);
      }
    }

    return await addDieselToFirebase(newRecord as DieselConsumptionRecord);
  };

  const triggerTripImport = async (): Promise<void> => {
    try {
      const eventData = {
        eventType: 'trip.import_request',
        timestamp: new Date().toISOString(),
        data: {
          source: 'webapp',
        },
      };
      await sendTripEvent(eventData);
    } catch (error) {
      console.error("Error triggering trip import:", error);
      throw error;
    }
  };

  const triggerDriverBehaviorImport = async (): Promise<void> => {
    try {
      const eventData = {
        eventType: 'driver.behavior.import_request',
        timestamp: new Date().toISOString(),
        data: {
          source: 'webapp',
        },
      };
      await sendDriverBehaviorEvent(eventData);
    } catch (error) {
      console.error("Error triggering driver behavior import:", error);
      throw error;
    }
  };

  const value = {
    trips,
    addTrip,
    updateTrip,
    deleteTrip,
    getTrip,
    addCostEntry: placeholderString,
    updateCostEntry: placeholder,
    deleteCostEntry: placeholder,
    addAttachment: placeholderString,
    deleteAttachment: placeholder,
    addAdditionalCost: placeholderString,
    removeAdditionalCost: placeholder,
    addDelayReason: placeholderString,
    missedLoads,
    addMissedLoad,
    updateMissedLoad,
    deleteMissedLoad,
    updateInvoicePayment: placeholder,
    importTripsFromCSV: async (newTrips: Omit<Trip, 'id' | 'costs' | 'status'>[]) => {
      for (const trip of newTrips) {
        await addTrip(trip);
      }
    },
    triggerTripImport,
    importCostsFromCSV: placeholder,
    importTripsFromWebhook: placeholderWebhook,
    importDriverBehaviorEventsFromWebhook: async () => {
      try {
        console.log("🔄 Importing driver behavior events from webhook...");
        await triggerDriverBehaviorImport();

        // Wait for a moment to allow the cloud function to process and update Firestore
        // This is a temporary solution until we have proper webhook response handling
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Since we're using real-time listeners, the UI will update automatically
        // when the cloud function adds the data to Firestore
        console.log("✅ Driver behavior import triggered successfully");
        return { imported: 1, skipped: 0 }; // We don't know the actual counts yet
      } catch (error) {
        console.error("❌ Error importing driver behavior events:", error);
        throw error;
      }
    },
    dieselRecords,
    addDieselRecord,
    updateDieselRecord: async (record: DieselConsumptionRecord): Promise<void> => {
      try {
        // Get the original record to track changes
        const originalRecord = dieselRecords.find(r => r.id === record.id);

        // Update the record in Firestore
        await updateDieselInFirebase(record.id, record);

        // If this record is linked to a trip, update the corresponding cost entry
        if (record.tripId) {
          const trip = trips.find(t => t.id === record.tripId);
          if (trip) {
            // Find the cost entry that corresponds to this diesel record
            const costIndex = trip.costs.findIndex(c =>
              c.referenceNumber === `DIESEL-${record.id}` ||
              c.referenceNumber === `DIESEL-REEFER-${record.id}`
            );

            if (costIndex !== -1) {
              // Update the existing cost entry
              const updatedCosts = [...trip.costs];
              updatedCosts[costIndex] = {
                ...updatedCosts[costIndex],
                amount: record.totalCost,
                currency: record.currency || trip.revenueCurrency,
                notes: `Diesel: ${record.litresFilled} liters at ${record.fuelStation}${record.isReeferUnit ? ' (Reefer)' : ''}`,
                // Removed updatedAt property as it doesn't exist in CostEntry type
              };

              await updateTripInFirebase(trip.id, {
                ...trip,
                costs: updatedCosts
              });
            }
          }
        }

        // Log diesel update for audit trail
        await addAuditLogToFirebase({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          user: 'system', // Replace with actual user
          action: 'update',
          entity: 'diesel',
          entityId: record.id,
          details: `Diesel record ${record.id} updated for ${record.fleetNumber}`,
          changes: {
            before: originalRecord,
            after: record
          }
        });

        console.log("✅ Diesel record updated:", record.id);
      } catch (error) {
        console.error("❌ Error updating diesel record:", error);
        throw error;
      }
    },

    deleteDieselRecord: async (id: string): Promise<void> => {
      try {
        // Get the record before deletion for audit and to check if it's linked to a trip
        const record = dieselRecords.find(r => r.id === id);
        if (!record) {
          console.warn(`Diesel record with ID ${id} not found, nothing to delete`);
          return;
        }

        // If this record is linked to a trip, remove the corresponding cost entry
        if (record.tripId) {
          const trip = trips.find(t => t.id === record.tripId);
          if (trip) {
            // Find and remove the cost entry that corresponds to this diesel record
            const updatedCosts = trip.costs.filter(c =>
              c.referenceNumber !== `DIESEL-${id}` &&
              c.referenceNumber !== `DIESEL-REEFER-${id}`
            );

            if (updatedCosts.length !== trip.costs.length) {
              // Only update if we actually removed a cost
              await updateTripInFirebase(trip.id, {
                ...trip,
                costs: updatedCosts
              });
            }
          }
        }

        // Delete the record from Firestore
        await deleteDieselFromFirebase(id);

        // Log diesel deletion for audit trail
        await addAuditLogToFirebase({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          user: 'system', // Replace with actual user
          action: 'delete',
          entity: 'diesel',
          entityId: id,
          details: `Diesel record ${id} deleted for ${record.fleetNumber}`,
          changes: record
        });

        // Optimistically remove from local state
        setDieselRecords(prev => prev.filter(r => r.id !== id));

        console.log("✅ Diesel record deleted:", id);
      } catch (error) {
        console.error("❌ Error deleting diesel record:", error);
        throw error;
      }
    },

    importDieselFromCSV: async (records: Omit<DieselConsumptionRecord, 'id'>[]): Promise<void> => {
      try {
        console.log(`🔄 Importing ${records.length} diesel records from CSV...`);

        const importResults = {
          success: 0,
          failed: 0,
          skipped: 0,
          errors: [] as string[]
        };

        // Process each record sequentially to ensure all validation logic runs
        for (const record of records) {
          try {
            // Check for duplicate records (same fleet, date, and km reading)
            const isDuplicate = dieselRecords.some(existing =>
              existing.fleetNumber === record.fleetNumber &&
              existing.date === record.date &&
              existing.kmReading === record.kmReading &&
              Math.abs(existing.litresFilled - record.litresFilled) < 0.1 // Small tolerance for rounding errors
            );

            if (isDuplicate) {
              console.warn(`⚠️ Skipping duplicate diesel record for ${record.fleetNumber} on ${record.date}`);
              importResults.skipped++;
              continue;
            }

            // Add the record
            await addDieselRecord(record);
            importResults.success++;
          } catch (recordError) {
            console.error(`❌ Failed to import diesel record for ${record.fleetNumber}:`, recordError);
            importResults.failed++;
            importResults.errors.push(`${record.fleetNumber} on ${record.date}: ${(recordError as Error).message}`);
          }
        }

        console.log(`✅ Diesel import complete: ${importResults.success} added, ${importResults.skipped} skipped, ${importResults.failed} failed`);

        // Add import summary to audit log
        await addAuditLogToFirebase({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          user: 'system', // Replace with actual user
          action: 'create', // Changed from 'import' to satisfy AuditLog type
          entity: 'diesel',
          entityId: 'batch',
          details: `Diesel CSV import: ${importResults.success} added, ${importResults.skipped} skipped, ${importResults.failed} failed`,
          changes: importResults
        });

      } catch (error) {
        console.error("❌ Error importing diesel records from CSV:", error);
        throw error;
      }
    },

    updateDieselDebrief: async (recordId: string, debriefData: {
      debriefDate: string;
      debriefNotes: string;
      debriefSignedBy: string;
      probeReading?: number;
      probeDiscrepancy?: number;
      probeVerified?: boolean;
      probeVerificationNotes?: string;
    }): Promise<void> => {
      try {
        // Get the current record
        const record = dieselRecords.find(r => r.id === recordId);
        if (!record) {
          throw new Error(`Diesel record with ID ${recordId} not found`);
        }

        // If probe data is provided and this is a fleet with probe
        const hasProbe = FLEETS_WITH_PROBES.includes(record.fleetNumber);

        const updatedRecord = {
          ...record,
          debriefDate: debriefData.debriefDate,
          debriefNotes: debriefData.debriefNotes,
          debriefSignedBy: debriefData.debriefSignedBy,
          debriefSignedAt: new Date().toISOString()
        };

        // Add probe verification data if applicable
        if (hasProbe && debriefData.probeReading !== undefined) {
          updatedRecord.probeReading = debriefData.probeReading;
          updatedRecord.probeDiscrepancy = debriefData.probeDiscrepancy ||
            (debriefData.probeReading - record.litresFilled);
          updatedRecord.probeVerified = debriefData.probeVerified || false;
          updatedRecord.probeVerificationNotes = debriefData.probeVerificationNotes;
          updatedRecord.probeVerifiedAt = new Date().toISOString();
          updatedRecord.probeVerifiedBy = debriefData.debriefSignedBy;
        }

        // Update the record
        await updateDieselInFirebase(recordId, updatedRecord);

        // Log debrief for audit trail
        await addAuditLogToFirebase({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          user: 'system', // Replace with actual user
          action: 'update', // Changed from 'debrief' to satisfy AuditLog type
          entity: 'diesel',
          entityId: recordId,
          details: `Diesel debrief completed for ${record.fleetNumber} by ${debriefData.debriefSignedBy}`,
          changes: {
            debriefData,
            hasProbe,
            probeDiscrepancy: updatedRecord.probeDiscrepancy
          }
        });

        console.log(`✅ Diesel debrief updated for record ${recordId}`);
      } catch (error) {
        console.error("❌ Error updating diesel debrief:", error);
        throw error;
      }
    },

    allocateDieselToTrip: async (dieselId: string, tripId: string): Promise<void> => {
      try {
        // Get the diesel record and trip
        const record = dieselRecords.find(r => r.id === dieselId);
        const trip = trips.find(t => t.id === tripId);

        if (!record) {
          throw new Error(`Diesel record with ID ${dieselId} not found`);
        }

        if (!trip) {
          throw new Error(`Trip with ID ${tripId} not found`);
        }

        // Check if this diesel is already linked to a different trip
        if (record.tripId && record.tripId !== tripId) {
          // Need to remove it from the old trip first - inline the removal logic
          const oldTripId = record.tripId;
          const oldTrip = trips.find(t => t.id === oldTripId);

          if (oldTrip) {
            // Find and remove the cost entry that corresponds to this diesel record
            const updatedCosts = oldTrip.costs.filter(c =>
              c.referenceNumber !== `DIESEL-${dieselId}` &&
              c.referenceNumber !== `DIESEL-REEFER-${dieselId}`
            );

            // Only update if we actually removed a cost
            if (updatedCosts.length !== oldTrip.costs.length) {
              await updateTripInFirebase(oldTrip.id, {
                ...oldTrip,
                costs: updatedCosts
              });

              console.log(`✅ Diesel record ${dieselId} removed from previous trip ${oldTrip.id}`);
            }
          }
        }

        // Create a new cost entry for this diesel record
        const costEntry: CostEntry = {
          id: `cost-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          tripId: tripId,
          category: 'Diesel',
          subCategory: `${record.fuelStation} - ${record.fleetNumber}${record.isReeferUnit ? ' (Reefer)' : ''}`,
          amount: record.totalCost,
          currency: record.currency || trip.revenueCurrency,
          referenceNumber: `DIESEL-${record.isReeferUnit ? 'REEFER-' : ''}${record.id}`,
          date: record.date,
          notes: `Diesel: ${record.litresFilled} liters at ${record.fuelStation}${record.isReeferUnit ? ' (Reefer)' : ''}`,
          attachments: [],
          isFlagged: false
        };

        // Update the trip with the new cost entry
        const updatedTrip = {
          ...trip,
          costs: [...trip.costs, costEntry]
        };

        // Update the diesel record with the trip link
        const updatedRecord = {
          ...record,
          tripId: tripId,
          updatedAt: new Date().toISOString()
        };

        // Save both updates
        await updateTripInFirebase(tripId, updatedTrip);
        await updateDieselInFirebase(dieselId, updatedRecord);

        // Log allocation for audit trail
        await addAuditLogToFirebase({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          user: 'system', // Replace with actual user
          action: 'update', // Changed from 'allocate' to satisfy AuditLog type
          entity: 'diesel',
          entityId: dieselId,
          details: `Diesel record ${dieselId} allocated to trip ${tripId}`,
          changes: {
            dieselRecord: updatedRecord,
            costEntry: costEntry
          }
        });

        console.log(`✅ Diesel record ${dieselId} allocated to trip ${tripId}`);
      } catch (error) {
        console.error("❌ Error allocating diesel to trip:", error);
        throw error;
      }
    },

    removeDieselFromTrip: async (dieselId: string): Promise<void> => {
      try {
        // Get the diesel record
        const record = dieselRecords.find(r => r.id === dieselId);

        if (!record) {
          throw new Error(`Diesel record with ID ${dieselId} not found`);
        }

        // If not linked to any trip, nothing to do
        if (!record.tripId) {
          console.warn(`Diesel record ${dieselId} is not linked to any trip`);
          return;
        }

        // Get the trip
        const trip = trips.find(t => t.id === record.tripId);

        if (!trip) {
          // Trip doesn't exist anymore, just update the diesel record
          const updatedRecord = {
            ...record,
            tripId: undefined
          };
          await updateDieselInFirebase(dieselId, updatedRecord);
          console.log(`✅ Diesel record ${dieselId} unlinked (trip ${record.tripId} not found)`);
          return;
        }

        // Find and remove the cost entry that corresponds to this diesel record
        const updatedCosts = trip.costs.filter(c =>
          c.referenceNumber !== `DIESEL-${dieselId}` &&
          c.referenceNumber !== `DIESEL-REEFER-${dieselId}`
        );

        // Update the trip without the cost entry
        if (updatedCosts.length !== trip.costs.length) {
          // Only update if we actually removed a cost
          await updateTripInFirebase(trip.id, {
            ...trip,
            costs: updatedCosts
          });
        }

        // Update the diesel record to remove the trip link
        const updatedRecord = {
          ...record,
          tripId: undefined,
          updatedAt: new Date().toISOString()
        };

        await updateDieselInFirebase(dieselId, updatedRecord);

        // Log removal for audit trail
        await addAuditLogToFirebase({
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          user: 'system', // Replace with actual user
          action: 'delete', // Changed from 'unlink' to satisfy AuditLog type
          entity: 'diesel',
          entityId: dieselId,
          details: `Diesel record ${dieselId} removed from trip ${trip.id}`,
          changes: {
            dieselRecord: record,
            tripId: trip.id
          }
        });

        console.log(`✅ Diesel record ${dieselId} removed from trip ${trip.id}`);
      } catch (error) {
        console.error("❌ Error removing diesel from trip:", error);
        throw error;
      }
    },
    driverBehaviorEvents,
    addDriverBehaviorEvent: placeholderString,
    updateDriverBehaviorEvent: placeholder,
    deleteDriverBehaviorEvent: placeholder,
    getDriverPerformance: () => ({}) as any,
    getAllDriversPerformance: () => [] as any[],
    triggerDriverBehaviorImport,
    actionItems,
    addActionItem: placeholderString,
    updateActionItem: placeholder,
    deleteActionItem: placeholder,
    addActionItemComment: placeholder,
    carReports,
    addCARReport: placeholderString,
    updateCARReport: placeholder,
    deleteCARReport: placeholder,
    connectionStatus,
    bulkDeleteTrips: placeholder,
    updateTripStatus: placeholder,
    setTrips,
    completeTrip,
    auditLogs,
    isLoading
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