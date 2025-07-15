import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";

// --- Import al jou pages/components ---
// Trip
import TripManagementPage from "./pages/TripManagementPage";
import ActiveTripsPage from "./pages/ActiveTripsPage";
import CompletedTrips from "./components/TripManagement/CompletedTrips";
import MapsView from "./components/maps/MapsView";
import TripTimelinePage from "./pages/TripTimelinePage";
import TripCalendarPage from "./pages/trips/TripCalendarPage";

// Load Planning
import LoadPlanningPage from "./pages/trips/LoadPlanningPage";
import LoadPlanningComponentPage from "./pages/trips/LoadPlanningComponentPage"; // <-- Detail page vir tripId

// ... Ander pages/components soos jy het ...

const AppRoutes = ({
  setEditingTrip,
  setShowTripForm,
  showTripForm,
  editingTrip
}: {
  setEditingTrip: (trip: any) => void,
  setShowTripForm: (show: boolean) => void,
  showTripForm: boolean,
  editingTrip: any
}) => (
  <Routes>
    <Route
      element={
        <Layout
          setEditingTrip={setEditingTrip}
          setShowTripForm={setShowTripForm}
        />
      }
    >
      {/* --- MAIN ROUTES --- */}
      <Route path="/" element={<TripManagementPage />} />
      <Route path="trips" element={<TripManagementPage />} />
      <Route path="trips/active" element={<ActiveTripsPage />} />
      <Route path="trips/completed" element={<CompletedTrips />} />
      <Route path="trips/maps" element={<MapsView />} />
      <Route path="trip-timeline" element={<TripTimelinePage />} />

      {/* --- NUWE: TRIP CALENDAR --- */}
      <Route path="trips/calendar" element={<TripCalendarPage />} />

      {/* --- NUWE: LOAD PLANNING LIST --- */}
      <Route path="trips/load-planning" element={<LoadPlanningPage />} />

      {/* --- NUWE: LOAD PLANNING DETAIL --- */}
      <Route path="trips/load-planning/:tripId" element={<LoadPlanningComponentPage />} />

      {/* ... voeg meer route definisies hieronder soos nodig ... */}

      {/* Fallback/404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default AppRoutes;
