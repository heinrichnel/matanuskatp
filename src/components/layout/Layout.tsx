import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAppContext } from '../../context/AppContext';
import { Trip } from '../../types';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useAppContext(); // Keep this to ensure we're still using the AppContext
  
  // State for outlet context
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>(undefined);
  const [showTripForm, setShowTripForm] = useState(false);

  // Get current path from location to determine active menu item
  const currentView = location.pathname.split('/')[1] || 'dashboard';

  // Navigate to a new route
  const handleNavigate = (view: string) => {
    navigate(`/${view}`);
  };

  // Context object to pass to outlet
  const outletContext = {
    setSelectedTrip,
    setEditingTrip,
    setShowTripForm
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