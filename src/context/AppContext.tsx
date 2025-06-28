import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trip, CostEntry, Attachment, AdditionalCost, DelayReason, MissedLoad, DieselConsumptionRecord, DriverBehaviorEvent, ActionItem, CARReport } from '../types';
import { AuditLog as AuditLogType } from '../types/audit';
import {
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
import { generateTripId } from '../utils/helpers';
import { sendTripEvent, sendDriverBehaviorEvent } from '../utils/webhookSenders';
import { v4 as uuidv4 } from 'uuid';

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
  const [connectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');

  useEffect(() => {
    const unsubscribeTrips = listenToTrips(setTrips, (error) => console.error(error));
    const unsubscribeMissedLoads = listenToMissedLoads(setMissedLoads, (error) => console.error(error));
    const unsubscribeDiesel = listenToDieselRecords(setDieselRecords, (error) => console.error(error));
    const unsubscribeDriverBehavior = listenToDriverBehaviorEvents(setDriverBehaviorEvents, (error) => console.error(error));
    const unsubscribeActionItems = listenToActionItems(setActionItems, (error) => console.error(error));
    const unsubscribeCARReports = listenToCARReports(setCARReports, (error) => console.error(error));
    const unsubscribeAuditLogs = listenToAuditLogs(setAuditLogs, (error: any) => console.error(error));

    return () => {
      unsubscribeTrips();
      unsubscribeMissedLoads();
      unsubscribeDiesel();
      unsubscribeDriverBehavior();
      unsubscribeActionItems();
      unsubscribeCARReports();
      unsubscribeAuditLogs();
    };
  }, []);

  const addTrip = async (trip: Omit<Trip, 'id' | 'costs' | 'status'>): Promise<string> => {
    const newTrip = {
      ...trip,
      id: generateTripId(),
      costs: [],
      status: 'active' as 'active',
    };
    return await addTripToFirebase(newTrip as Trip);
  };

  const updateTrip = async (trip: Trip): Promise<void> => {
    await updateTripInFirebase(trip.id, trip);
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
    await deleteMissedLoadFromFirebase(id);
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
  const updateCostEntry = async (costEntry: CostEntry): Promise<void> => {
    try {
      // Find the trip that contains this cost
      const trip = trips.find(t => t.id === costEntry.tripId);
      if (!trip) {
        throw new Error(`Trip with ID ${costEntry.tripId} not found`);
      }
      
      // Update the cost in the trip's costs array
      const updatedCosts = trip.costs.map(c => 
        c.id === costEntry.id ? costEntry : c
      );
      
      // Create updated trip object
      const updatedTrip = {
        ...trip,
        costs: updatedCosts,
        updatedAt: new Date().toISOString()
      };
      
      // Update in Firestore
      await updateTripInFirebase(trip.id, updatedTrip);
      
      console.log(`✅ Cost entry ${costEntry.id} updated in trip ${trip.id}`);
      
    } catch (error) {
      console.error('Error updating cost entry:', error);
      throw error;
    }
  };
  
  const deleteCostEntry = async (id: string): Promise<void> => {
    try {
      // Find the trip that contains this cost
      const trip = trips.find(t => t.costs.some(c => c.id === id));
      if (!trip) {
        throw new Error(`Trip with cost ID ${id} not found`);
      }
      
      // Filter out the cost from the trip's costs array
      const updatedCosts = trip.costs.filter(c => c.id !== id);
      
      // Create updated trip object
      const updatedTrip = {
        ...trip,
        costs: updatedCosts,
        updatedAt: new Date().toISOString()
      };
      
      // Update in Firestore
      await updateTripInFirebase(trip.id, updatedTrip);
      
      console.log(`✅ Cost entry ${id} deleted from trip ${trip.id}`);
      
    } catch (error) {
      console.error('Error deleting cost entry:', error);
      throw error;
    }
  };
  
  const addCostEntry = async (
    costData: Omit<CostEntry, 'id' | 'attachments'>, 
    files?: FileList
  ): Promise<string> => {
    try {
      // Find the trip to add this cost to
      const trip = trips.find(t => t.id === costData.tripId);
      if (!trip) {
        throw new Error(`Trip with ID ${costData.tripId} not found`);
      }
      
      // Generate a new ID for this cost entry
      const costId = `cost-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      
      // Process files if provided
      const attachments: Attachment[] = [];
      if (files && files.length > 0) {
        Array.from(files).forEach((file, index) => {
          // In a real app, you would upload this file to storage and get a URL
          // For now, we'll just create a mock attachment
          attachments.push({
            id: `attachment-${Date.now()}-${index}`,
            costEntryId: costId,
            filename: file.name,
            fileUrl: URL.createObjectURL(file), // This is temporary and only works in the current browser session
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: new Date().toISOString()
          });
        });
      }
      
      // Create the cost entry
      const newCost: CostEntry = {
        id: costId,
        ...costData,
        attachments
      };
      
      // Add cost to the trip's costs array
      const updatedCosts = [...trip.costs, newCost];
      
      // Create updated trip object
      const updatedTrip = {
        ...trip,
        costs: updatedCosts,
        updatedAt: new Date().toISOString()
      };
      
      // Update in Firestore
      await updateTripInFirebase(trip.id, updatedTrip);
      
      console.log(`✅ Cost entry ${costId} added to trip ${trip.id}`);
      return costId;
      
    } catch (error) {
      console.error('Error adding cost entry:', error);
      throw error;
    }
  };

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

  const updateDieselRecord = async (record: DieselConsumptionRecord): Promise<void> => {
    try {
      // Update the diesel record in Firestore
      const docRef = doc(db, 'diesel', record.id);
      await updateDoc(docRef, cleanUndefinedValues(record));
      
      // Optimistically update local state
      setDieselRecords(prev => 
        prev.map(r => r.id === record.id ? record : r)
      );
      
      console.log(`✅ Diesel record ${record.id} updated`);
    } catch (error) {
      console.error('Error updating diesel record:', error);
      throw error;
    }
  };
  
  const deleteDieselRecord = async (id: string): Promise<void> => {
    try {
      // Delete the diesel record from Firestore
      const docRef = doc(db, 'diesel', id);
      await deleteDoc(docRef);
      
      // Optimistically update local state
      setDieselRecords(prev => prev.filter(r => r.id !== id));
      
      console.log(`✅ Diesel record ${id} deleted`);
    } catch (error) {
      console.error('Error deleting diesel record:', error);
      throw error;
    }
  };
  
  const updateTripStatus = async (tripId: string, status: 'shipped' | 'delivered', notes: string): Promise<void> => {
    try {
      const trip = trips.find(t => t.id === tripId);
      if (!trip) {
        throw new Error(`Trip with ID ${tripId} not found`);
      }
      
      // Create updated fields based on status
      const updateData: Partial<Trip> = {};
      
      if (status === 'shipped') {
        updateData.shippedAt = new Date().toISOString();
        updateData.shippedNotes = notes;
      } else if (status === 'delivered') {
        updateData.deliveredAt = new Date().toISOString();
        updateData.deliveredNotes = notes;
      }
      
      // Update trip in Firestore
      await updateTripInFirebase(tripId, {
        ...trip,
        ...updateData,
        updatedAt: new Date().toISOString()
      });
      
      console.log(`✅ Trip ${tripId} updated with status ${status}`);
    } catch (error) {
      console.error('Error updating trip status:', error);
      throw error;
    }
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

  const addDriverBehaviorEvent = async (
    eventData: Omit<DriverBehaviorEvent, 'id'>, 
    files?: FileList
  ): Promise<string> => {
    try {
      // Generate a unique ID for this event
      const eventId = `event-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      
      // Process attachments if files provided
      const attachments: Attachment[] = [];
      if (files && files.length > 0) {
        Array.from(files).forEach((file, index) => {
          attachments.push({
            id: `attachment-${Date.now()}-${index}`,
            filename: file.name,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: new Date().toISOString()
          });
        });
      }
      
      // Create the event with ID and attachments
      const newEvent: DriverBehaviorEvent = {
        id: eventId,
        ...eventData,
        attachments
      };
      
      // Add to Firestore
      await addDriverBehaviorEventToFirebase(newEvent);
      
      // Optimistically update local state
      setDriverBehaviorEvents(prev => [...prev, newEvent]);
      
      return eventId;
    } catch (error) {
      console.error('Error adding driver behavior event:', error);
      throw error;
    }
  };
  
  const updateDriverBehaviorEvent = async (event: DriverBehaviorEvent): Promise<void> => {
    try {
      // Update in Firestore
      await updateDriverBehaviorEventToFirebase(event.id, event);
      
      // Optimistically update local state
      setDriverBehaviorEvents(prev => 
        prev.map(e => e.id === event.id ? event : e)
      );
    } catch (error) {
      console.error('Error updating driver behavior event:', error);
      throw error;
    }
  };
  
  const deleteDriverBehaviorEvent = async (id: string): Promise<void> => {
    try {
      // Delete from Firestore
      await deleteDriverBehaviorEventToFirebase(id);
      
      // Optimistically update local state
      setDriverBehaviorEvents(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting driver behavior event:', error);
      throw error;
    }
  };
  
  const addActionItem = async (
    item: Omit<ActionItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>
  ): Promise<string> => {
    try {
      // Create new action item with ID and timestamps
      const newItem: ActionItem = {
        id: `action-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Current User', // Replace with actual user info when available
      };
      
      // Add to Firestore
      await addActionItemToFirebase(newItem);
      
      // Optimistically update local state
      setActionItems(prev => [...prev, newItem]);
      
      return newItem.id;
    } catch (error) {
      console.error('Error adding action item:', error);
      throw error;
    }
  };
  
  const updateActionItem = async (item: ActionItem): Promise<void> => {
    try {
      // Update item with current timestamp
      const updatedItem = {
        ...item,
        updatedAt: new Date().toISOString()
      };
      
      // Update in Firestore
      await updateActionItemInFirebase(item.id, updatedItem);
      
      // Optimistically update local state
      setActionItems(prev => 
        prev.map(i => i.id === item.id ? updatedItem : i)
      );
    } catch (error) {
      console.error('Error updating action item:', error);
      throw error;
    }
  };
  
  const deleteActionItem = async (id: string): Promise<void> => {
    try {
      // Delete from Firestore
      await deleteActionItemFromFirebase(id);
      
      // Optimistically update local state
      setActionItems(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting action item:', error);
      throw error;
    }
  };
  
  const addActionItemComment = async (itemId: string, comment: string): Promise<void> => {
    try {
      // Find the action item
      const actionItem = actionItems.find(i => i.id === itemId);
      if (!actionItem) {
        throw new Error(`Action item with ID ${itemId} not found`);
      }
      
      // Create new comment
      const newComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        actionItemId: itemId,
        comment,
        createdBy: 'Current User', // Replace with actual user info when available
        createdAt: new Date().toISOString()
      };
      
      // Update the action item with the new comment
      const updatedComments = [...(actionItem.comments || []), newComment];
      const updatedItem = {
        ...actionItem,
        comments: updatedComments,
        updatedAt: new Date().toISOString()
      };
      
      // Update in Firestore
      await updateActionItemInFirebase(itemId, updatedItem);
      
      // Optimistically update local state
      setActionItems(prev => 
        prev.map(i => i.id === itemId ? updatedItem : i)
      );
    } catch (error) {
      console.error('Error adding action item comment:', error);
      throw error;
    }
  };
  
  const addCARReport = async (
    report: Omit<CARReport, 'id' | 'createdAt' | 'updatedAt'>, 
    files?: FileList
  ): Promise<string> => {
    try {
      // Generate a unique ID for this report
      const reportId = `car-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      
      // Process attachments if files provided
      const attachments: Attachment[] = [];
      if (files && files.length > 0) {
        Array.from(files).forEach((file, index) => {
          attachments.push({
            id: `attachment-${Date.now()}-${index}`,
            filename: file.name,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: new Date().toISOString()
          });
        });
      }
      
      // Create the report with ID, timestamps, and attachments
      const newReport: CARReport = {
        id: reportId,
        ...report,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attachments
      };
      
      // Add to Firestore
      await addCARReportToFirebase(newReport);
      
      // Optimistically update local state
      setCARReports(prev => [...prev, newReport]);
      
      return reportId;
    } catch (error) {
      console.error('Error adding CAR report:', error);
      throw error;
    }
  };
  
  const updateCARReport = async (
    report: CARReport, 
    files?: FileList
  ): Promise<void> => {
    try {
      // Process new attachments if files provided
      const newAttachments: Attachment[] = [];
      if (files && files.length > 0) {
        Array.from(files).forEach((file, index) => {
          newAttachments.push({
            id: `attachment-${Date.now()}-${index}`,
            filename: file.name,
            fileUrl: URL.createObjectURL(file),
            fileType: file.type,
            fileSize: file.size,
            uploadedAt: new Date().toISOString()
          });
        });
      }
      
      // Combine existing and new attachments
      const updatedAttachments = [...(report.attachments || []), ...newAttachments];
      
      // Update the report with new attachments and timestamp
      const updatedReport = {
        ...report,
        attachments: updatedAttachments,
        updatedAt: new Date().toISOString()
      };
      
      // Update in Firestore
      await updateCARReportInFirebase(report.id, updatedReport);
      
      // Optimistically update local state
      setCARReports(prev => 
        prev.map(r => r.id === report.id ? updatedReport : r)
      );
    } catch (error) {
      console.error('Error updating CAR report:', error);
      throw error;
    }
  };
  
  const deleteCARReport = async (id: string): Promise<void> => {
    try {
      // Delete from Firestore
      await deleteCARReportFromFirebase(id);
      
      // Optimistically update local state
      setCARReports(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting CAR report:', error);
      throw error;
    }
  };
  
  const updateInvoicePayment = async (tripId: string, paymentData: any): Promise<void> => {
    try {
      // Find the trip
      const trip = trips.find(t => t.id === tripId);
      if (!trip) {
        throw new Error(`Trip with ID ${tripId} not found`);
      }
      
      // Update trip with payment data
      const updatedTrip = {
        ...trip,
        ...paymentData,
        updatedAt: new Date().toISOString()
      };
      
      // Update in Firestore
      await updateTripInFirebase(tripId, updatedTrip);
      
      console.log(`✅ Invoice payment updated for trip ${tripId}`);
    } catch (error) {
      console.error('Error updating invoice payment:', error);
      throw error;
    }
  };
  
  const importTripsFromCSV = async (newTrips: Omit<Trip, 'id' | 'costs' | 'status'>[]): Promise<void> => {
    try {
      // Process and add each trip
      const results = [];
      for (const tripData of newTrips) {
        try {
          const newTrip = {
            ...tripData,
            id: generateTripId(),
            costs: [],
            status: 'active' as 'active',
          };
          
          const tripId = await addTripToFirebase(newTrip as Trip);
          results.push({ status: 'success', id: tripId });
          console.log(`✅ Trip imported: ${tripId}`);
        } catch (tripError) {
          console.error('Error importing individual trip:', tripError);
          results.push({ status: 'error', error: tripError.message });
        }
      }
      
      console.log(`Imported ${results.filter(r => r.status === 'success').length} of ${newTrips.length} trips`);
    } catch (error) {
      console.error('Error importing trips from CSV:', error);
      throw error;
    }
  };
  
  const importTripsFromWebhook = async (): Promise<{ imported: number, skipped: number }> => {
    try {
      // Use Firebase Function URL for webhook import
      const response = await fetch('https://us-central1-mat1-9e6b3.cloudfunctions.net/manualImportTrips');
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to import trips: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Trip import result:', result);
      
      return {
        imported: result.imported || 0,
        skipped: result.skipped || 0
      };
    } catch (error) {
      console.error("Error importing trips from webhook:", error);
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
  
  const importDriverBehaviorEventsFromWebhook = async (): Promise<{ imported: number, skipped: number }> => {
    try {
      // Use Firebase Function URL for webhook import
      const response = await fetch('https://us-central1-mat1-9e6b3.cloudfunctions.net/importDriverBehaviorWebhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([]) // Empty array to trigger fetching from the source
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to import driver behavior events: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Driver behavior import result:', result);
      
      return {
        imported: result.imported || 0,
        skipped: result.skipped || 0
      };
    } catch (error) {
      console.error("Error importing driver behavior events from webhook:", error);
      throw error;
    }
  };

  const value = {
    trips,
    addTrip,
    updateTrip,
    deleteTrip,
    getTrip,
    addCostEntry,
    updateCostEntry,
    deleteCostEntry,
    // Placeholder functions that still need implementation
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
      const behaviorScore = Math.max(0, 100 - totalPoints);
      
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
        const behaviorScore = Math.max(0, 100 - totalPoints);
        
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