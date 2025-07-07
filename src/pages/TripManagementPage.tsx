import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Truck, CheckCircle, Flag, Plus } from 'lucide-react';
import Button from '../components/ui/Button';
import ActiveTrips from '../components/trips/ActiveTrips';
import CompletedTrips from '../components/trips/CompletedTrips';
import FlagsInvestigations from '../components/flags/FlagsInvestigations';
import { useAppContext } from '../context/AppContext';
import { useOutletContext } from 'react-router-dom';
import { Trip } from '../types';

interface OutletContextType {
  setSelectedTrip?: (trip: Trip | null) => void;
  setEditingTrip?: (trip: Trip | undefined) => void;
  setShowTripForm?: (show: boolean) => void;
}

const TripManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const context = useOutletContext<OutletContextType>();
  const { isLoading } = useAppContext();

  const handleAddTrip = () => {
    if (context.setEditingTrip) context.setEditingTrip(undefined);
    if (context.setShowTripForm) context.setShowTripForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Trip Management</h1>
          <p className="text-gray-600">Manage, track, and analyze trips across your fleet</p>
        </div>
        <div>
          <Button 
            onClick={handleAddTrip}
            icon={<Plus className="w-4 h-4" />}
            disabled={isLoading.addTrip}
          >
            Add New Trip
          </Button>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            <span>Active Trips</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Completed Trips</span>
          </TabsTrigger>
          <TabsTrigger value="flags" className="flex items-center gap-2">
            <Flag className="w-4 h-4" />
            <span>Flags & Investigations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <ActiveTrips />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <CompletedTrips />
        </TabsContent>

        <TabsContent value="flags" className="mt-6">
          <FlagsInvestigations />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripManagementPage;