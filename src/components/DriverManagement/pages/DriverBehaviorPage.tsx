import React, { useState, useEffect } from 'react';
import { DriverBehaviorEvent } from '../../../types';
import { useAppContext } from '../../../context/AppContext';
import { useSyncContext } from '../../../context/SyncContext';
import Button from '../../../components/ui/Button';
import DriverPerformanceOverview from '../DriverPerformanceOverview';
import DriverBehaviorEventForm from '../forms/DriverBehaviorEventForm';
import DriverBehaviorEventDetails from '../DriverBehaviorEventDetails';
import CARReportForm from '../../../components/ComplianceSafetymanagement/CARReportForm';
import CARReportList from '../../../components/ComplianceSafetymanagement/CARReportList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { User, FileText, Plus, RefreshCw } from 'lucide-react';
import SyncIndicator from '../../../components/ui/SyncIndicator';

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
  const { subscribeToDriverBehavior } = useSyncContext();
  
  useEffect(() => {
    // Subscribe to driver behavior events
    const unsubscribe = subscribeToDriverBehavior();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [subscribeToDriverBehavior]);
  
  const handleImportEvents = async () => {
    if (importDriverBehaviorEventsFromWebhook) {
      setIsSyncing(true);
      try {
        await importDriverBehaviorEventsFromWebhook();
      } catch (error) {
        console.error("Failed to import events:", error);
      } finally {
        setIsSyncing(false);
      }
    }
  };
  
  const handleViewEventDetails = (event: DriverBehaviorEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };
  
  const handleShowCARForm = (event?: DriverBehaviorEvent) => {
    if (event) {
      setSelectedEvent(event);
    }
    setShowCARForm(true);
  };
  
  const groupEventsByDriver = () => {
    const grouped: Record<string, DriverBehaviorEvent[]> = {};
    
    driverBehaviorEvents.forEach(event => {
      if (!grouped[event.driverName]) {
        grouped[event.driverName] = [];
      }
      grouped[event.driverName].push(event);
    });
    
    return Object.entries(grouped).map(([driverName, events]) => ({
      driverName,
      events,
      eventCount: events.length,
      warningEvents: events.filter(e => e.severity === 'warning').length,
      criticalEvents: events.filter(e => e.severity === 'critical').length,
      mostRecentEvent: events.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0]
    }));
  };
  
  const driverGroups = groupEventsByDriver();
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Driver Behavior Management</h1>
          <p className="text-gray-600">Monitor and manage driver behavior events and corrective actions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setShowEventForm(true)} 
            className="flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add Event
          </Button>
          <Button 
            variant="outline"
            onClick={handleImportEvents}
            disabled={isSyncing}
            className="flex items-center"
          >
            <RefreshCw size={18} className={`mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Events'}
          </Button>
          <SyncIndicator />
        </div>
      </div>
      
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-8 w-full md:w-auto">
          <TabsTrigger value="performance" className="flex items-center">
            <User className="mr-1 h-4 w-4" />
            Driver Overview
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center">
            <AlertTriangle className="mr-1 h-4 w-4" />
            Event Management
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center">
            <FileText className="mr-1 h-4 w-4" />
            CAR Reports
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="space-y-6">
          <DriverPerformanceOverview driverGroups={driverGroups} />
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        Loading events...
                      </td>
                    </tr>
                  ) : driverBehaviorEvents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No driver behavior events found
                      </td>
                    </tr>
                  ) : (
                    driverBehaviorEvents
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map(event => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {event.driverName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {event.eventType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              event.severity === 'critical' 
                                ? 'bg-red-100 text-red-800' 
                                : event.severity === 'warning'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {event.severity === 'critical' ? 'Critical' : 
                               event.severity === 'warning' ? 'Warning' : 'Information'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(event.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              event.status === 'resolved' 
                                ? 'bg-green-100 text-green-800' 
                                : event.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {event.status === 'resolved' ? 'Resolved' : 
                               event.status === 'in_progress' ? 'In Progress' : 'Open'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline"
                                className="text-xs" 
                                onClick={() => handleViewEventDetails(event)}
                              >
                                Details
                              </Button>
                              {event.status !== 'resolved' && (
                                <Button 
                                  variant="outline"
                                  className="text-xs" 
                                  onClick={() => handleShowCARForm(event)}
                                >
                                  Create CAR
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-6">
          <div className="flex justify-end">
            <Button 
              onClick={() => handleShowCARForm()}
              className="flex items-center"
            >
              <Plus size={18} className="mr-1" />
              New CAR Report
            </Button>
          </div>
          <CARReportList />
        </TabsContent>
      </Tabs>
      
      {showEventForm && (
        <DriverBehaviorEventForm 
          onClose={() => setShowEventForm(false)} 
          isOpen={showEventForm}
        />
      )}
      
      {showEventDetails && selectedEvent && (
        <DriverBehaviorEventDetails 
          event={selectedEvent}
          isOpen={showEventDetails}
          onClose={() => {
            setShowEventDetails(false);
            setSelectedEvent(null);
          }}
          onCreateCAR={() => {
            setShowEventDetails(false);
            handleShowCARForm(selectedEvent);
          }}
        />
      )}
      
      {showCARForm && (
        <CARReportForm 
          isOpen={showCARForm}
          onClose={() => {
            setShowCARForm(false);
            setSelectedEvent(null);
          }}
          relatedEvent={selectedEvent}
        />
      )}
    </div>
  );
};

export default DriverBehaviorPage;
