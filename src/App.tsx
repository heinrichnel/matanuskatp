import React, { useState, useEffect } from "react";
import { AppProvider, useAppContext } from "./context/AppContext";
import ErrorBoundary from './components/ErrorBoundary';

// UI Components
import Header from "./components/layout/Header";

// Feature Components
import Dashboard from "./components/dashboard/Dashboard";
import YearToDateKPIs from "./components/dashboard/YearToDateKPIs";
import ActiveTrips from "./components/trips/ActiveTrips";
import CompletedTrips from "./components/trips/CompletedTrips";
import FlagsInvestigations from "./components/flags/FlagsInvestigations";
import CurrencyFleetReport from "./components/reports/CurrencyFleetReport";
import InvoiceAgingDashboard from "./components/invoicing/InvoiceAgingDashboard";
import CustomerRetentionDashboard from "./components/performance/CustomerRetentionDashboard";
import MissedLoadsTracker from "./components/trips/MissedLoadsTracker";
import DieselDashboard from "./components/diesel/DieselDashboard";
import DriverBehaviorPage from "./pages/DriverBehaviorPage";
import ActionLog from "./components/actionlog/ActionLog";
import TripDetails from "./components/trips/TripDetails";
import TripForm from "./components/trips/TripForm";

// Utilities & Types
import { Trip } from "./types";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

const AppContent: React.FC = () => {
  const { 
    trips, setTrips, missedLoads, addMissedLoad, updateMissedLoad, deleteMissedLoad,
    updateTrip, addTrip, deleteTrip, completeTrip
  } = useAppContext();

  const [currentView, setCurrentView] = useState("ytd-kpis");
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripForm, setShowTripForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "trips"), (snapshot) => {
      const tripsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTrips(tripsData as Trip[]);
    });
    return () => unsub();
  }, [setTrips]);

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

  const handleUpdateTrip = (tripData: Omit<Trip, "id" | "costs" | "status">) => {
    if (editingTrip) {
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
      updateTrip(updatedTrip);
      setShowTripForm(false);
      setEditingTrip(undefined);
    }
  };

  const handleShowTripDetails = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setShowTripForm(true);
  };

  const renderView = () => {
    switch (currentView) {
      case "ytd-kpis":
        return <YearToDateKPIs trips={trips} />;
      case "dashboard":
        return <Dashboard trips={trips} />;
      case "active-trips":
        return <ActiveTrips trips={trips.filter(t => t.status === 'active')} onView={handleShowTripDetails} onEdit={handleEditTrip} onDelete={deleteTrip} onCompleteTrip={completeTrip} />;
      case "completed-trips":
        return <CompletedTrips trips={trips.filter(t => t.status === 'completed')} onView={handleShowTripDetails} />;
      case "flags":
        return <FlagsInvestigations trips={trips} />;
      case "reports":
        return <CurrencyFleetReport trips={trips} />;
      case "invoice-aging":
        return <InvoiceAgingDashboard trips={trips} onViewTrip={handleShowTripDetails} />;
      case "customer-retention":
        return <CustomerRetentionDashboard trips={trips} />;
      case "missed-loads":
        return <MissedLoadsTracker missedLoads={missedLoads} onAddMissedLoad={addMissedLoad} onUpdateMissedLoad={updateMissedLoad} onDeleteMissedLoad={deleteMissedLoad} />;
      case "diesel-dashboard":
        return <DieselDashboard />;
      case "driver-behavior":
        return <DriverBehaviorPage />;
      case "action-log":
        return <ActionLog />;
      default:
        return <YearToDateKPIs trips={trips} />;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <Header 
        currentView={currentView} 
        onNavigate={setCurrentView} 
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

        {renderView()}

        {selectedTrip && (
          <TripDetails
            trip={selectedTrip}
            onBack={() => setSelectedTrip(null)}
          />
        )}

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

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;