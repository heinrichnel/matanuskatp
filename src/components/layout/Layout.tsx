import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TripForm from '../trips/TripForm';
import TripDetails from '../trips/TripDetails';
import { Trip } from '../../types';
import { useAppContext } from '../../context/AppContext';

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    trips,
    addTrip,
    updateTrip,
  } = useAppContext();

  // State for trip modal and details
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripForm, setShowTripForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>();

  // Get current path from location to determine active menu item
  const currentView = location.pathname.replace('/', '');
  
  // Navigate to a new route
  const handleNavigate = (view: string) => {
    navigate(`/${view}`);
  };

  // Handle adding a new trip
  const handleAddTrip = async (tripData: Omit<Trip, "id" | "costs" | "status">) => {
    try {
      const tripId = await addTrip(tripData);
      setShowTripForm(false);
      setEditingTrip(undefined);
      alert(`Trip created successfully!\n\nFleet: ${tripData.fleetNumber}\nDriver: ${tripData.driverName}\nRoute: ${tripData.route}\n\nTrip ID: ${tripId}`);
    } catch (error) {
      console.error("Error adding trip:", error);
      alert("Error creating trip. Please try again.");
    }
  };

  // Handle updating an existing trip
  const handleUpdateTrip = async (tripData: Omit<Trip, "id" | "costs" | "status">) => {
    if (editingTrip) {
      try {
        const updatedTrip: Trip = {
          ...editingTrip,
          ...tripData,
          id: editingTrip.id,
          costs: editingTrip.costs,
          status: editingTrip.status,
          additionalCosts: editingTrip.additionalCosts || [],
          delayReasons: editingTrip.delayReasons || [],
          followUpHistory: editingTrip.followUpHistory || [],
        };
        await updateTrip(updatedTrip);
        setShowTripForm(false);
        setEditingTrip(undefined);
        alert("Trip updated successfully!");
      } catch (error) {
        console.error("Error updating trip:", error);
        alert("Error updating trip. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        onNewTrip={() => {
          setEditingTrip(undefined);
          setShowTripForm(true);
        }}
      />
      <main className="ml-64 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Fleet Management Dashboard
          </h1>
        </div>

        {/* Outlet renders the active route component */}
        <Outlet context={{ setSelectedTrip, setEditingTrip, setShowTripForm }} />

        {/* Trip Details Modal */}
        {selectedTrip && (
          <TripDetails
            trip={selectedTrip}
            onBack={() => setSelectedTrip(null)}
          />
        )}

        {/* Add/Edit Trip Form Modal */}
        {showTripForm && (
          <TripForm
            onSubmit={editingTrip ? handleUpdateTrip : handleAddTrip}
            onCancel={() => {
              setShowTripForm(false);
              setEditingTrip(undefined);
            }}
            trip={editingTrip}
          />
        )}
      </main>
    </div>
  );
};

export default Layout;