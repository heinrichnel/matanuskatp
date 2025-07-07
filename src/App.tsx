import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { SyncProvider } from "./context/SyncContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from './components/layout/Layout';
import TripForm from "./components/trips/TripForm";
import Modal from "./components/ui/Modal";
import FirestoreConnectionError from "./components/ui/FirestoreConnectionError";
import { getConnectionStatus, onConnectionStatusChanged } from "./utils/firebaseConnectionHandler";
import { Trip } from "./types";
import MapsView from "./components/maps/MapsView";

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
import Dashboard from "./components/dashboard/Dashboard";
import ActiveTrips from "./components/trips/ActiveTrips";
import CompletedTrips from "./components/trips/CompletedTrips";
import FlagsInvestigations from "./components/flags/FlagsInvestigations";
import ClientManagementPage from "./pages/ClientManagementPage";
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
import RoutePlanningPage from "./pages/RoutePlanningPage";

// Placeholder components for new routes
const Notifications = () => <div>Notifications Page</div>;
const Settings = () => <div>Settings Page</div>;

// Workshop placeholders
const QRGenerator = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">QR Code Generator</h2>
    <p className="text-gray-600">Generate QR codes for fleet vehicles and equipment.</p>
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-blue-700">This module is under development and will be available in the next update.</p>
    </div>
  </div>
);

const WorkshopAnalytics = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Workshop Analytics Dashboard</h2>
    <p className="text-gray-600">View comprehensive analytics for workshop operations, costs, and efficiency.</p>
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-blue-700">This module is under development and will be available in the next update.</p>
    </div>
  </div>
);

const PartsOrdering = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Parts Ordering</h2>
    <p className="text-gray-600">Manage parts ordering, suppliers, and purchase orders.</p>
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-blue-700">This module is under development and will be available in the next update.</p>
    </div>
  </div>
);

// Workshop placeholders
const QRGenerator = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">QR Code Generator</h2>
    <p className="text-gray-600">Generate QR codes for fleet vehicles and equipment.</p>
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-blue-700">This module is under development and will be available in the next update.</p>
    </div>
  </div>
);

const WorkshopAnalytics = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Workshop Analytics Dashboard</h2>
    <p className="text-gray-600">View comprehensive analytics for workshop operations, costs, and efficiency.</p>
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-blue-700">This module is under development and will be available in the next update.</p>
    </div>
  </div>
);

const PartsOrdering = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h2 className="text-2xl font-bold mb-4">Parts Ordering</h2>
    <p className="text-gray-600">Manage parts ordering, suppliers, and purchase orders.</p>
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <p className="text-blue-700">This module is under development and will be available in the next update.</p>
    </div>
  </div>
);
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
                
                {/* New Route Planning Routes */}
                <Route path="route-planning" element={<RoutePlanningPage />} />
                <Route path="route-planning/:tripId" element={<RoutePlanningPage />} />
                
                {/* Fleet Management Section */}
                <Route path="fleet" element={<FleetManagementPage />} />
                <Route path="driver-behavior" element={<DriverBehaviorPage />} />
                <Route path="diesel-dashboard" element={<DieselTabbedDashboard />} />
                <Route path="missed-loads" element={<MissedLoadsTracker />} />
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
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
                {/* Legacy maps route should redirect to the new tabbed view */}
                <Route path="maps" element={<Navigate to="/fleet" replace />} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
            
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