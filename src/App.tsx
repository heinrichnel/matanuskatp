import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import { SyncProvider } from "./context/SyncContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from './components/layout/Layout';
import TripForm from "./components/trips/TripForm";
import Modal from "./components/ui/Modal";
import FirestoreConnectionError from "./components/ui/FirestoreConnectionError";
import { getConnectionStatus, onConnectionStatusChanged } from "./utils/firebaseConnectionHandler";
import { Trip } from "./types";
import MapsView from "./components/maps/MapsView";

// UI Components
// Removed Sidebar import as it will be used inside Layout

// Feature Components
import Dashboard from "./components/dashboard/Dashboard";
import ActiveTrips from "./components/trips/ActiveTrips";
import CompletedTrips from "./components/trips/CompletedTrips";
import FlagsInvestigations from "./components/flags/FlagsInvestigations";
import CurrencyFleetReport from "./components/reports/CurrencyFleetReport";
import InvoiceAgingDashboard from "./components/invoicing/InvoiceAgingDashboard";
import CustomerRetentionDashboard from "./components/performance/CustomerRetentionDashboard";
import MissedLoadsTracker from "./components/trips/MissedLoadsTracker";
import DieselDashboard from "./components/diesel/DieselDashboard";
import DieselTabbedDashboard from "./components/diesel/DieselTabbedDashboard";
import DriverBehaviorPage from "./pages/DriverBehaviorPage";
import ActionLog from "./components/actionlog/ActionLog";
import AuditLogPage from "./pages/AuditLogPage";
import TripManagementPage from "./pages/TripManagementPage";
import FleetManagementPage from "./pages/FleetManagementPage";
import WorkshopPage from "./pages/WorkshopPage";

// Placeholder components for new routes
const Notifications = () => <div>Notifications Page</div>;
const Settings = () => <div>Settings Page</div>;
const Profile = () => <div>Profile Page</div>;
  
// Main App component with Router implementation
const App: React.FC = () => {
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>(undefined);
  const [connectionError, setConnectionError] = useState<Error | null>(
    getConnectionStatus().status === 'error' ? getConnectionStatus().error : null
  );

  // Listen for connection status changes
  useEffect(() => {
    const unsubscribe = onConnectionStatusChanged((status, error) => {
      if (status === 'error') {
        setConnectionError(error || new Error('Unknown connection error'));
      } else if (status === 'connected') {
        setConnectionError(null);
      }
    });
    
    return unsubscribe;
  }, []);

  // Function to handle trip form submission
  const handleTripSubmit = async (tripData: Omit<Trip, 'id' | 'costs' | 'status'>) => {
    try {
      const { addTrip, updateTrip } = useAppContext();
      if (editingTrip) {
        await updateTrip({ ...editingTrip, ...tripData });
      } else {
        await addTrip(tripData);
      }
      setShowAddTripModal(false);
      setEditingTrip(undefined);
    } catch (error) {
      console.error("Error submitting trip:", error);
    }
  };

  return (
    <ErrorBoundary>
      <AppProvider>
        <SyncProvider>
          {connectionError && (
            <div className="fixed top-0 left-0 right-0 z-50 p-4">
              <FirestoreConnectionError error={connectionError} />
            </div>
          )}
          <Router>
            <Routes>
              <Route 
                path="/" 
                element={
                  <Layout 
                    setShowTripForm={setShowAddTripModal} 
                    setEditingTrip={setEditingTrip} 
                  />
                }
              >
                {/* Main dashboard is now the root route */}
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Navigate to="/" replace />} />
                
                {/* Trip Management Section */}
                <Route path="trips" element={<TripManagementPage />}>
                  <Route index element={<ActiveTrips />} />
                  <Route path="active" element={<ActiveTrips />} />
                  <Route path="completed" element={<CompletedTrips />} />
                  <Route path="flags" element={<FlagsInvestigations />} />
                </Route>
                {/* Redirect legacy routes to new nested routes */}
                <Route path="active-trips" element={<Navigate to="/trips?tab=active" replace />} />
                <Route path="completed-trips" element={<Navigate to="/trips?tab=completed" replace />} />
                <Route path="flags" element={<Navigate to="/trips?tab=flags" replace />} />
                
                {/* Fleet Management Section */}
                <Route path="fleet" element={<FleetManagementPage />} />
                <Route path="driver-behavior" element={<DriverBehaviorPage />} />
                <Route path="diesel-dashboard" element={<DieselTabbedDashboard />} />
                <Route path="missed-loads" element={<MissedLoadsTracker />} />
                {/* Map view is now integrated into FleetManagementPage */}
                
                {/* Workshop Section */}
                <Route path="workshop" element={<WorkshopPage />} />
                <Route path="action-log" element={<ActionLog />} />
                
                {/* Reports Section */}
                <Route path="reports" element={<CurrencyFleetReport />} />
                <Route path="invoice-aging" element={<InvoiceAgingDashboard />} />
                <Route path="customer-retention" element={<CustomerRetentionDashboard />} />
                
                {/* System Section */}
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
                {/* Legacy maps route should redirect to the new tabbed view */}
                <Route path="maps" element={<Navigate to="/fleet" replace />} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
            
            {/* Global Trip Form Modal */}
            <Modal
              isOpen={showAddTripModal}
              onClose={() => {
                setShowAddTripModal(false);
                setEditingTrip(undefined);
              }}
              title={editingTrip ? "Edit Trip" : "Add New Trip"}
              maxWidth="lg"
            >
              <TripForm
                trip={editingTrip}
                onSubmit={handleTripSubmit}
                onCancel={() => {
                  setShowAddTripModal(false);
                  setEditingTrip(undefined);
                }}
              />
            </Modal>
          </Router>
        </SyncProvider>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;