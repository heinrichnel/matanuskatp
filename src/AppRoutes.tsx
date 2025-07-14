import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";

// --- Import al jou pages/components HIER ---
import TripManagementPage from "./pages/TripManagementPage";
import ActiveTripsPage from "./pages/ActiveTripsPage";
import CompletedTrips from "./components/TripManagement/CompletedTrips";
import MapsView from "./components/maps/MapsView";
// ... voeg al die ander pages/components by soos nodig ...

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
      {/* --- PLAAS AL JOU ROUTES HIER --- */}
      <Route path="/" element={<TripManagementPage />} />
      <Route path="trips" element={<TripManagementPage />} />
      <Route path="trips/active" element={<ActiveTripsPage />} />
      <Route path="trips/completed" element={<CompletedTrips />} />
      <Route path="trips/maps" element={<MapsView />} />
      {/* ... meer route definisies ... */}

      {/* Fallback/404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default AppRoutes;
