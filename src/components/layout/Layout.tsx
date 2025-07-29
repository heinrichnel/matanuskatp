import React, { useState } from "react";
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAppContext } from "../../context/AppContext";
import { Trip } from "../../types";

interface LayoutProps {
  setShowTripForm: (show: boolean) => void;
  setEditingTrip: (trip: Trip | undefined) => void;
}

const Layout: React.FC<LayoutProps> = ({ setShowTripForm, setEditingTrip }) => {
  // Hooks and context
  const location = useLocation();
  const navigate = useNavigate();
  useAppContext(); // Ensures AppContext is active (auth, etc)
  const [searchParams] = useSearchParams();

  // Local state for outlet context
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Handler wrappers
  const handleSetEditingTrip = (trip: Trip | undefined) => setEditingTrip(trip);
  const handleShowTripForm = (show: boolean) => setShowTripForm(show);

  // Robust route detection for menu highlighting (nested, tabs, etc)
  const currentView = React.useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return "dashboard";
    if (pathSegments[0] === "workshop") {
      const tab = searchParams.get("tab");
      if (tab) return `workshop-${tab}`;
    }
    return pathSegments.join("/") || "dashboard";
  }, [location.pathname, searchParams]);

  // Navigation logic: always slash-prefixed, supports query params
  const handleNavigate = (view: string) => {
    if (view.includes("?")) {
      const [path, query] = view.split("?");
      navigate(`/${path}?${query}`);
    } else {
      const formattedPath = view.startsWith("/") ? view : `/${view}`;
      navigate(formattedPath);
    }
  };

  // Outlet context for downstream components
  const outletContext = {
    setSelectedTrip,
    setEditingTrip: handleSetEditingTrip,
    setShowTripForm: handleShowTripForm,
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      <main className="ml-64 flex-1 p-6 pt-8 w-full max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          {/* Leave empty: Each page component should render its own title */}
          <div></div>
        </div>
        <Outlet context={outletContext} />
      </main>
    </div>
  );
};

export default Layout;
