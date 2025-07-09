import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { SyncProvider } from "./context/SyncContext";
import { TyreStoresProvider } from "./context/TyreStoresContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from './components/layout/Layout';
import TripForm from "./components/trips/TripForm";
import FirestoreConnectionError from "./components/ui/FirestoreConnectionError";
import { getConnectionStatus, onConnectionStatusChanged } from "./utils/firebaseConnectionHandler";
import { Trip } from "./types";

// Workshop Components
import FleetTable from "./components/workshop/FleetTable";
import JobCardManagement from "./components/workshop/JobCardManagement";
import JobCardKanbanBoard from "./components/workshop/JobCardKanbanBoard";
import InspectionManagement from "./components/workshop/InspectionManagement";
import InspectionForm from "./components/workshop/InspectionForm";
import FaultTracking from "./components/workshop/FaultTracking";
import TyreManagement from "./components/workshop/TyreManagement";

// UI Components
// Removed Sidebar import as it will be used inside Layout

// Feature Components
import ActiveTrips from "./components/trips/ActiveTrips";
import CompletedTrips from "./components/trips/CompletedTrips";
import FlagsInvestigations from "./components/flags/FlagsInvestigations";
import ClientManagementPage from "./pages/ClientManagementPage";
import CurrencyFleetReport from "./components/reports/CurrencyFleetReport";
import TripDashboard from "./components/trips/TripDashboard";
import InvoiceAgingDashboard from "./components/invoicing/InvoiceAgingDashboard";
import CustomerRetentionDashboard from "./components/performance/CustomerRetentionDashboard";
import MissedLoadsTracker from "./components/trips/MissedLoadsTracker";
import DieselTabbedDashboard from "./components/diesel/DieselTabbedDashboard";
import DriverBehaviorPage from "./pages/DriverBehaviorPage";
import ActionLog from "./components/actionlog/ActionLog";
import TripManagementPage from "./pages/TripManagementPage";
import FleetManagementPage from "./pages/FleetManagementPage";
import WorkshopPage from "./pages/WorkshopPage";
import RoutePlanningPage from "./pages/RoutePlanningPage";

// Placeholder components for new routes
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";

// Workshop placeholders
import QRGenerator from "./components/workshop/QRGenerator";
import WorkshopAnalytics from "./components/workshop/WorkshopAnalytics";
import PartsOrdering from "./components/workshop/PartsOrdering";
  
// Main App component with Router implementation
const App: React.FC = () => {
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>(undefined);
  const [showTripForm, setShowTripForm] = useState<boolean>(false);
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
  // (Removed unused handleTripSubmit to resolve unused variable error)
  return (
    <ErrorBoundary>
      <AppProvider>
        <SyncProvider>
          <TyreStoresProvider>
           {connectionError && (
             <div className="fixed top-0 left-0 right-0 z-50 p-4">
               <FirestoreConnectionError error={connectionError} />
             </div>
           )}
           <Router>
             <Routes>
              <Route 
                element={
                  <Layout 
                    setEditingTrip={setEditingTrip}
                    setShowTripForm={setShowTripForm}
                  />
                }
              >
                <Route path="dashboard" element={<Navigate to="/" replace />} />
                
                {/* Trip Management Section */}
                <Route path="trips" element={<TripManagementPage />}>
                  <Route index element={<ActiveTrips />} />
                  <Route path="active" element={<ActiveTrips />} />
                  <Route path="completed" element={<CompletedTrips />} />
                  <Route path="flags" element={<FlagsInvestigations />} />
                  <Route path="dashboard" element={<TripDashboard />} />
                  <Route path="optimization" element={<div>Route Optimization</div>} />
                  <Route path="load-planning" element={<div>Load Planning</div>} />
                  <Route path="new" element={<div>Add New Trip</div>} />
                  <Route path="calendar" element={<div>Trip Calendar</div>} />
                  <Route path="driver-performance" element={<div>Driver Performance</div>} />
                  <Route path="cost-analysis" element={<div>Trip Cost Analysis</div>} />
                  <Route path="utilization" element={<div>Fleet Utilization</div>} />
                  <Route path="confirmations" element={<div>Delivery Confirmations</div>} />
                  <Route path="templates" element={<div>Trip Templates</div>} />
                  <Route path="reports" element={<div>Trip Reports</div>} />
                  <Route path="maps" element={<div>Maps & Tracking</div>} />
                </Route>
                {/* Redirect legacy routes to new nested routes */}
                <Route path="active-trips" element={<Navigate to="/trips?tab=active" replace />} />
                <Route path="completed-trips" element={<Navigate to="/trips?tab=completed" replace />} />
                <Route path="flags" element={<Navigate to="/trips?tab=flags" replace />} />
                
                {/* New Route Planning Routes */}
                <Route path="route-planning" element={<RoutePlanningPage />} />
                <Route path="route-planning/:tripId" element={<RoutePlanningPage />} />
                
                {/* Fleet Management Section */}
                <Route path="fleet" element={<FleetManagementPage />} />
                <Route path="driver-behavior" element={<DriverBehaviorPage />} />
                <Route path="diesel-dashboard" element={<DieselTabbedDashboard />} />
                <Route
                  path="missed-loads"
                  element={
                    <MissedLoadsTracker
                      missedLoads={[]} // Replace with actual missed loads data from context or state
                      onAddMissedLoad={() => {}} // Replace with actual handler
                      onUpdateMissedLoad={() => {}} // Replace with actual handler
                    />
                  }
                />
                {/* Map view is now integrated into FleetManagementPage */}
                
                {/* Client Management Section */}
                <Route path="clients/*" element={<ClientManagementPage />} />
                
                
                {/* Workshop Section */}
                <Route path="workshop" element={<WorkshopPage />}>
                  <Route index element={<WorkshopAnalytics />} />
                  <Route path="fleet-setup" element={<FleetTable />} />
                  <Route path="qr-generator" element={<QRGenerator />} />
                  
                  {/* Inspections Routes */}
                  <Route path="inspections" element={<InspectionManagement />} />
                  <Route path="inspections/new" element={<InspectionForm onBack={() => {}} />} />
                  <Route path="inspections/active" element={<InspectionManagement status="active" />} />
                  <Route path="inspections/completed" element={<InspectionManagement status="completed" />} />
                  <Route path="inspections/templates" element={<div>Inspection Templates</div>} />
                  
                  {/* Job Cards Routes */}
                  <Route path="job-cards" element={<JobCardManagement />} />
                  <Route path="job-cards/kanban" element={<JobCardKanbanBoard />} />
                  <Route path="job-cards/open" element={<JobCardManagement activeTab="open" />} />
                  <Route path="job-cards/completed" element={<JobCardManagement activeTab="completed" />} />
                  <Route path="job-cards/templates" element={<div>Job Card Templates</div>} />
                  
                  {/* Faults Routes */}
                  <Route path="faults" element={<FaultTracking />} />
                  <Route path="faults/new" element={<div>Report New Fault</div>} />
                  <Route path="faults/critical" element={<div>Critical Faults</div>} />
                  
                  {/* Tyre Management Routes */}
                  <Route path="tyres" element={<TyreManagement />} />
                  <Route path="tyres/inventory" element={<TyreManagement activeTab="inventory" />} />
                  <Route path="tyres/stores" element={<TyreManagement activeTab="stores" />} />
                  <Route path="tyres/fleet" element={<TyreManagement activeTab="position" />} />
                  <Route path="tyres/history" element={<TyreManagement activeTab="inspection" />} />
                  <Route path="tyres/performance" element={<TyreManagement activeTab="analytics" />} />
                  <Route path="tyres/add" element={<TyreManagement activeTab="add" />} />
                  
                  {/* Inventory Management Routes */}
                  <Route path="stock-alerts" element={<div>Stock Alerts</div>} />
                  <Route path="parts-ordering" element={<PartsOrdering />} />
                  <Route path="work-orders" element={<div>Work Orders</div>} />
                  <Route path="purchase-orders" element={<div>Purchase Orders</div>} />
                  <Route path="vendors" element={<div>Vendor Management</div>} />
                  <Route path="inventory" element={<div>General Inventory</div>} />
                  
                  {/* Analytics & Reports */}
                  <Route path="analytics" element={<WorkshopAnalytics />} />
                  <Route path="reports" element={<div>Workshop Reports</div>} />
                  <Route path="reports/costs" element={<div>Cost Analysis Reports</div>} />
                </Route>
                <Route path="action-log" element={<ActionLog />} />
                
                {/* Reports Section */}
                <Route path="reports" element={<CurrencyFleetReport />} />
                <Route path="invoice-aging" element={<InvoiceAgingDashboard />} />
                <Route path="customer-retention" element={<CustomerRetentionDashboard />} />
                
                {/* System Section */}
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                {/* Legacy maps route should redirect to the new tabbed view */}
                <Route path="maps" element={<Navigate to="/fleet" replace />} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
           </Router>
          </TyreStoresProvider>
        </SyncProvider>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;