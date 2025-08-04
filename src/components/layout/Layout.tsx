import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();

  // State for outlet context
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toggle sidebar function
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Use the props for editingTrip and showTripForm
  const handleSetEditingTrip = (trip: Trip | undefined) => {
    setEditingTrip(trip);
  };

  const handleShowTripForm = (show: boolean) => {
    setShowTripForm(show);
  };

  // Get current path from location to determine active menu item
  const currentView = (() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    // Special handling for workshop with tabs
    if (path === 'workshop') {
      const tab = searchParams.get('tab');
      if (tab) return `workshop-${tab}`;
      return 'workshop';
    }
    return path;
  })();

  // Navigate to a new route
  const handleNavigate = (view: string) => {
    // Handle special cases like workshop?tab=tyres
    if (view.includes('?')) {
      const [path, query] = view.split('?');
      navigate(`/${path}?${query}`);
    } else {
      navigate(`/${view}`);
    }
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
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className={`transition-all duration-300 p-6 pt-8 w-full max-w-screen-2xl mx-auto ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        {/* Sidebar toggle button */}
        <button 
          className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-md shadow-md"
          onClick={toggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu size={24} />
        </button>
        <div className="flex justify-between items-center mb-4">
          {/* The title should be rendered by the page component instead of here */}
          <div></div>
        </div>

        {/* Outlet renders the active route component */}
        <Outlet context={outletContext} />
      </main>
    </div>
  );
};

export default Layout;
