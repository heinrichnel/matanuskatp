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
  const location = useLocation();
  const navigate = useNavigate();
  useAppContext(); // Ensures AppContext is available
  const [searchParams] = useSearchParams();

  // Context state for outlet
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Handlers for editing and showing forms
  const handleSetEditingTrip = (trip: Trip | undefined) => {
    setEditingTrip(trip);
  };
  const handleShowTripForm = (show: boolean) => {
    setShowTripForm(show);
  };

  // Robust path detection: supports nested highlights (e.g. /trips/active)
  const currentView = (() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0) return "dashboard";
    if (pathSegments.length > 1) return pathSegments.join("/");
    if (pathSegments[0] === "workshop") {
      const tab = searchParams.get("tab");
      if (tab) return `workshop-${tab}`;
    }
    return pathSegments[0];
  })();

  // Robust navigation
  const handleNavigate = (view: string) => {
    if (view.includes("?")) {
      const [path, query] = view.split("?");
      navigate(`/${path}?${query}`);
    } else {
      const formattedPath = view.startsWith("/") ? view : `/${view}`;
      navigate(formattedPath);
    }
  };

  // Context for child routes (outlet)
  const outletContext = {
    setSelectedTrip,
    setEditingTrip: handleSetEditingTrip,
    setShowTripForm: handleShowTripForm,
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />
      <main className="ml-64 p-6 pt-8 w-full max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          {/* The title should be rendered by the page component instead of here */}
          <div></div>
        </div>
        <Outlet context={outletContext} />
      </main>
    </div>
  );
};

export default Layout;
