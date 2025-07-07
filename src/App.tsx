import React, { useState } from "react";
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
import AuditLogPage from "./pages/AuditLogPage";

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
                <Route index element={<Navigate to="/ytd-kpis" replace />} />
                <Route path="ytd-kpis" element={<YearToDateKPIs />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="active-trips" element={<ActiveTrips />} />
                <Route path="completed-trips" element={<CompletedTrips />} />
                <Route path="maps" element={<MapsView />} />
                <Route path="flags" element={<FlagsInvestigations />} />
                <Route path="reports" element={<CurrencyFleetReport />} />
                <Route path="invoice-aging" element={<InvoiceAgingDashboard />} />
                <Route path="customer-retention" element={<CustomerRetentionDashboard />} />
                <Route path="missed-loads" element={<MissedLoadsTracker />} />
                <Route path="diesel-dashboard" element={<DieselDashboard />} />
                <Route path="driver-behavior" element={<DriverBehaviorPage />} />
                <Route path="action-log" element={<ActionLog />} />
                <Route path="audit-log" element={<AuditLogPage />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/ytd-kpis" replace />} />
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