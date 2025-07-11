import React, { useState, useEffect } from 'react';
import { DriverBehaviorEvent } from '../types';
import { useAppContext } from '../context/AppContext';
import { useSyncContext } from '../context/SyncContext';
import Button from '../components/ui/Button';
import DriverPerformanceOverview from '../components/DriverManagement/DriverPerformanceOverview';
import DriverBehaviorEventForm from '../components/DriverManagement/DriverBehaviorEventForm';
import DriverBehaviorEventDetails from '../components/DriverManagement/DriverBehaviorEventDetails';
import CARReportForm from '../components/actionlog/CARReportForm';
import CARReportList from '../components/actionlog/CARReportList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { User, FileText, Plus, RefreshCw } from 'lucide-react';
import SyncIndicator from '../components/ui/SyncIndicator';

const DriverBehaviorPage: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('performance');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showCARForm, setShowCARForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<DriverBehaviorEvent | null>(null);
  const { 
    importDriverBehaviorEventsFromWebhook,
    isLoading, 
    driverBehaviorEvents 
  } = useAppContext();
  
  // Use the SyncContext to subscribe to driver behavior events
  const { subscribeToDriverBehaviorEvents } = useSyncContext();
  
  // Subscribe to driver behavior events when the component mounts
  useEffect(() => {
    console.log("Subscribing to driver behavior events");
    subscribeToDriverBehaviorEvents();
    
    // Check if we have any events, if not and we're online, trigger a sync
    if (driverBehaviorEvents.length === 0 && navigator.onLine) {
      handleSyncNow();
    }
    
    // Cleanup function is not needed as the subscription is managed by the SyncContext
  }, []);
  
  // Subscribe to driver behavior events when the component mounts
  useEffect(() => {
    console.log("Subscribing to driver behavior events");
    subscribeToDriverBehaviorEvents();
    
    // Check if we have any events, if not and we're online, trigger a sync
    if (driverBehaviorEvents.length === 0 && navigator.onLine) {
      handleSyncNow();
    }
    
    // Cleanup function is not needed as the subscription is managed by the SyncContext
  }, []);

  // Handle initiating CAR from event
  const handleInitiateCAR = (event: DriverBehaviorEvent) => {
    setSelectedEvent(event);
    setShowCARForm(true);
  };

  // Manual sync handler
  const handleSyncNow = async () => {
    try {
      setIsSyncing(true);
      const result = await importDriverBehaviorEventsFromWebhook();
      if (result) {
        alert(`Manual sync complete. Imported: ${result.imported}, Skipped: ${result.skipped}`);
      } else {
        alert('Manual sync completed but no data was returned.');
      }
    } catch (error) {
      console.error('Error during manual sync:', error);
      alert(`Manual sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Subscribe to driver behavior events when viewing details
  const handleViewEvent = (event: DriverBehaviorEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
          <div className="flex items-center mt-1">
            <p className="text-lg text-gray-600 mr-3">Monitor driver behavior and manage corrective actions</p>
            <SyncIndicator />
          </div>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => {
              setSelectedEvent(null);
              setShowEventForm(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Record Behavior Event
          </Button>
          <Button
            onClick={handleSyncNow}
            icon={<RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />}
            variant="outline"
            disabled={isSyncing || isLoading.importDriverBehavior}
            isLoading={isLoading.importDriverBehavior}
          >
            {isSyncing || isLoading.importDriverBehavior ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Driver Performance</span>
          </TabsTrigger>
          <TabsTrigger value="car-reports" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>CAR Reports</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-6">
          <DriverPerformanceOverview
            onAddEvent={() => {
              setSelectedEvent(null);
              setShowEventForm(true);
            }}
            onViewEvent={handleViewEvent}
            onEditEvent={(event: DriverBehaviorEvent) => {
              setSelectedEvent(event);
              setShowEventForm(true);
            }}
            onSyncNow={handleSyncNow}
          />
        </TabsContent>

        <TabsContent value="car-reports" className="mt-6">
          <CARReportList />
        </TabsContent>
      </Tabs>

      {/* Event Form Modal */}
      <DriverBehaviorEventForm
        isOpen={showEventForm}
        onClose={() => {
          setSelectedEvent(null);
          setShowEventForm(false);
        }}
        event={selectedEvent ?? undefined}
        onInitiateCAR={handleInitiateCAR}
      />

      {/* Event Details Modal */}
      {selectedEvent && (
        <DriverBehaviorEventDetails
          isOpen={showEventDetails}
          onClose={() => {
            setSelectedEvent(null);
            setShowEventDetails(false);
          }}
          event={selectedEvent}
          onEdit={() => {
            setShowEventDetails(false);
            setShowEventForm(true);
          }}
          onInitiateCAR={() => {
            setShowEventDetails(false);
            handleInitiateCAR(selectedEvent);
          }}
        />
      )}

      {/* CAR Form Modal */}
      <CARReportForm
        isOpen={showCARForm}
        onClose={() => {
          setSelectedEvent(null);
          setShowCARForm(false);
        }}
        linkedEvent={selectedEvent ?? undefined}
      />
    </div>
  );
};

export default DriverBehaviorPage;
