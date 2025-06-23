import React, { useState } from 'react';
import { DriverBehaviorEvent } from '../types';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import DriverPerformanceOverview from '../components/drivers/DriverPerformanceOverview';
import DriverBehaviorEventForm from '../components/drivers/DriverBehaviorEventForm';
import DriverBehaviorEventDetails from '../components/drivers/DriverBehaviorEventDetails';
import CARReportForm from '../components/drivers/CARReportForm';
import CARReportList from '../components/drivers/CARReportList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { User, FileText, Plus } from 'lucide-react';

const DriverBehaviorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('performance');
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showCARForm, setShowCARForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<DriverBehaviorEvent | null>(null);
  const { importDriverBehaviorEventsFromWebhook } = useAppContext();
  
  // Handle initiating CAR from event
  const handleInitiateCAR = (event: DriverBehaviorEvent) => {
    setSelectedEvent(event);
    setShowCARForm(true);
  };
  
  // Manual sync handler
  const handleSyncNow = async () => {
    try {
      const result = await importDriverBehaviorEventsFromWebhook();
      alert(`Manual sync complete. Imported: ${result.imported}, Skipped: ${result.skipped}`);
    } catch (error) {
      alert('Manual sync failed. Please try again.');
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-lg text-gray-600 mt-2">Monitor driver behavior and manage corrective actions</p>
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
            onViewEvent={(event: DriverBehaviorEvent) => {
              setSelectedEvent(event);
              setShowEventDetails(true);
            }}
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