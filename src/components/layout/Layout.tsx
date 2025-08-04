import { Menu } from "lucide-react";
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Trip } from "../../types";
import ConnectionStatusIndicator from "../ui/ConnectionStatusIndicator";
import SyncIndicator from "../ui/SyncIndicator";
import Sidebar from "./Sidebar";

interface LayoutProps {
  setShowTripForm: (show: boolean) => void;
  setEditingTrip: (trip: Trip | undefined) => void;
}

const Layout: React.FC<LayoutProps> = ({ setShowTripForm, setEditingTrip }) => {
  const location = useLocation();
  const navigate = useNavigate();
  useAppContext();
  const [searchParams] = useSearchParams();

  // State for outlet context
  const setSelectedTrip = useState<Trip | null>(null)[1]; // Only keep the setter function
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toggle sidebar function
  const toggleSidebar = () => setSidebarOpen((open) => !open);

  // Use the props for editingTrip and showTripForm
  const handleSetEditingTrip = (trip: Trip | undefined) => {
    setEditingTrip(trip);
  };

  const handleShowTripForm = (show: boolean) => {
    setShowTripForm(show);
  };

  // Get current path from location to determine active menu item
  const currentView = (() => {
    const path = location.pathname.split("/")[1] || "dashboard";
    // Special handling for workshop with tabs
    if (path === "workshop") {
      const tab = searchParams.get("tab");
      if (tab) return `workshop-${tab}`;
      return "workshop";
    }
    return path;
  })();

  // Navigate to a new route
  const handleNavigate = (view: string) => {
    // Handle special cases like workshop?tab=tyres
    if (view.includes("?")) {
      const [path, query] = view.split("?");
      navigate(`/${path}?${query}`);
    } else {
      navigate(`/${view}`);
    }
  };

  // Context object to pass to outlet
  const outletContext = {
    setSelectedTrip,
    setEditingTrip: handleSetEditingTrip,
    setShowTripForm: handleShowTripForm,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Top header bar */}
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            className="md:hidden mr-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-lg">MATANUSKA TRANSPORT</span>
        </div>
        <div className="flex items-center gap-2">
          <ConnectionStatusIndicator showText={false} className="mr-2" />
          <SyncIndicator />
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - fixed on desktop, slide-over on mobile */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area */}
        <main className="flex-1 p-4 md:p-8 transition-all duration-300">
          <div className="container mx-auto max-w-screen-2xl">
            {/* Outlet renders the active route component */}
            <Outlet context={outletContext} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
