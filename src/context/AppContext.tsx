import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trip, CostEntry, Attachment, AdditionalCost, DelayReason, MissedLoad, DieselConsumptionRecord, DriverBehaviorEvent, ActionItem, CARReport } from '../types';
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
  deleteMissedLoadFromFirebase
} from '../firebase';
import { generateTripId } from '../utils/helpers';
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
  importCostsFromCSV: (costs: Omit<CostEntry, 'id' | 'attachments'>[]) => Promise<void>;
  importTripsFromWebhook: () => Promise<{imported: number, skipped: number}>;
  importDriverBehaviorEventsFromWebhook: () => Promise<{imported: number, skipped: number}>;
  
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [missedLoads, setMissedLoads] = useState<MissedLoad[]>([]);
  const [dieselRecords, setDieselRecords] = useState<DieselConsumptionRecord[]>([]);
  const [driverBehaviorEvents, setDriverBehaviorEvents] = useState<DriverBehaviorEvent[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [carReports, setCARReports] = useState<CARReport[]>([]);
  const [connectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');
  
  useEffect(() => {
    const unsubscribeTrips = listenToTrips(setTrips, (error) => console.error(error));
    const unsubscribeMissedLoads = listenToMissedLoads(setMissedLoads, (error) => console.error(error));
    const unsubscribeDiesel = listenToDieselRecords(setDieselRecords, (error) => console.error(error));
    const unsubscribeDriverBehavior = listenToDriverBehaviorEvents(setDriverBehaviorEvents, (error) => console.error(error));
    const unsubscribeActionItems = listenToActionItems(setActionItems, (error) => console.error(error));
    const unsubscribeCARReports = listenToCARReports(setCARReports, (error) => console.error(error));

    return () => {
      unsubscribeTrips();
      unsubscribeMissedLoads();
      unsubscribeDiesel();
      unsubscribeDriverBehavior();
      unsubscribeActionItems();
      unsubscribeCARReports();
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
    await deleteTripFromFirebase(id);
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
  const placeholder = async () => { console.warn("Function not implemented"); };
  const placeholderString = async () => { console.warn("Function not implemented"); return ""; };
  const placeholderWebhook = async () => { console.warn("Function not implemented"); return { imported: 0, skipped: 0 }; };

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
    importTripsFromCSV: placeholder,
    importCostsFromCSV: placeholder,
    importTripsFromWebhook: placeholderWebhook,
    importDriverBehaviorEventsFromWebhook: placeholderWebhook,
    dieselRecords,
    addDieselRecord: placeholderString,
    updateDieselRecord: placeholder,
    deleteDieselRecord: placeholder,
    importDieselFromCSV: placeholder,
    updateDieselDebrief: placeholder,
    allocateDieselToTrip: placeholder,
    removeDieselFromTrip: placeholder,
    driverBehaviorEvents,
    addDriverBehaviorEvent: placeholderString,
    updateDriverBehaviorEvent: placeholder,
    deleteDriverBehaviorEvent: placeholder,
    getDriverPerformance: () => ({}) as any,
    getAllDriversPerformance: () => [] as any[],
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