import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Truck, CheckCircle, Flag, Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
/* eslint-disable @typescript-eslint/no-unused-vars */
// The following components are imported for possible future use in this page.
// @ts-ignore: imported for future use, suppress unused warning
import ActiveTrips from '../../components/TripManagement/ActiveTrips';
// @ts-ignore: imported for future use, suppress unused warning
import CompletedTrips from '../../components/TripManagement/CompletedTrips';
// @ts-ignore: imported for future use, suppress unused warning
import FlagsInvestigations from '../../components/Flags/FlagsInvestigations';
/* eslint-enable @typescript-eslint/no-unused-vars */
import { useAppContext } from '../../context/AppContext';
import { Outlet, useSearchParams, useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import { Trip } from '../../types';

interface OutletContextType {
  setSelectedTrip?: (trip: Trip | null) => void;
  setEditingTrip?: (trip: Trip | undefined) => void;
  setShowTripForm?: (show: boolean) => void;
}

const TripManagementPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'active';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const context = useOutletContext<OutletContextType>();
  const { isLoading } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams(value === 'active' ? {} : { tab: value });
    
    // Navigate to the corresponding nested route
    switch(value) {
      case 'active':
        navigate('/trips/active');
        break;
      case 'completed':
        navigate('/trips/completed');
        break;
      case 'flags':
        navigate('/trips/flags');
        break;
    }
  };
  
  // Effect to handle initial tab selection from URL params
  useEffect(() => {
    const tab = searchParams.get('tab') || 'active';
    setActiveTab(tab);
    
    // Navigate to the appropriate child route if we're at the parent route
    if (location.pathname === '/trips') {
      navigate(`/trips/${tab}`);
    }
  }, [searchParams, navigate, location.pathname]);

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
            onClick={onClick}
            icon={<Plus className="w-4 h-4" />}
            disabled={isLoading.addTrip}
          >
            Add New Trip
          </Button>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
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
          <Outlet />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {activeTab === 'completed' && <Outlet />}
        </TabsContent>

        <TabsContent value="flags" className="mt-6">
          {activeTab === 'flags' && <Outlet />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripManagementPage;