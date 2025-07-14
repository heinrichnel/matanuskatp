import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
// ...al jou imports

const AppRoutes = ({
  setEditingTrip,
  setShowTripForm,
  showTripForm,
  editingTrip
}: {
  setEditingTrip: any,
  setShowTripForm: any,
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
      {/* AL jou route definitions, soos in jou App.tsx */}
    </Route>
  </Routes>
);

export default AppRoutes;
