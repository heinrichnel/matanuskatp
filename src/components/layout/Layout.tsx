import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAppContext } from '../../context/AppContext';
import { Trip } from '../../types';

interface LayoutProps {
  setShowTripForm: (show: boolean) => void;
  setEditingTrip: (trip: Trip | undefined) => void;
}

const Layout: React.FC<LayoutProps> = ({ setShowTripForm, setEditingTrip }) => {
  const location = useLocation();
  const navigate = useNavigate();
  useAppContext(); // Keep this to ensure we're still using the AppContext
  
  // State for outlet context
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  
  // Use the props for editingTrip and showTripForm
  const handleSetEditingTrip = (trip: Trip | undefined) => {
    setEditingTrip(trip);
  };
  
  const handleShowTripForm = (show: boolean) => {
    setShowTripForm(show);
  };

  // Get current path from location to determine active menu item
  const currentView = location.pathname.split('/')[1] || 'dashboard';

  // Navigate to a new route
  const handleNavigate = (view: string) => {
    navigate(`/${view}`);
  };

  // Context object to pass to outlet
  const outletContext = {
    setSelectedTrip,
    setEditingTrip: handleSetEditingTrip,
    setShowTripForm: handleShowTripForm
  };
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
      />
      <main className="ml-64 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Fleet Management Dashboard
          </h1>
        </div>

        {/* Outlet renders the active route component */}
        <Outlet context={outletContext} />
      </main>
    </div>
  );
};

export default Layout;