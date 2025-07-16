import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TyreManagementPage from "./pages/tyres/TyreManagementPage";
import TyreInspection from "./pages/tyres/inspection";
import TyreInventory from "./pages/tyres/inventory";
import TyreReports from "./pages/tyres/reports";
import ReportNewIncidentPage from "./pages/compliance/ReportNewIncidentPage";
import ReceivePartsPage from "./pages/inventory/receive-parts";
import AddNewTyrePage from "./pages/tyres/add-new-tyre";
// Lazy load workshop pages
const RequestPartsPage = lazy(() => import("./pages/workshop/request-parts"));
const VehicleInspectionPage = lazy(() => import("./pages/workshop/vehicle-inspection"));
const CreatePurchaseOrderPage = lazy(() => import("./pages/workshop/create-purchase-order"));
import { AppProvider } from "./context/AppContext";
import { SyncProvider } from "./context/SyncContext";
import { TyreStoresProvider } from "./context/TyreStoresContext";
import { TripProvider } from "./context/TripContext";
import { DriverBehaviorProvider } from "./context/DriverBehaviorContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from './components/layout/Layout';
import TripFormModal from "./components/TripManagement/TripFormModal";
import FirestoreConnectionError from "./components/ui/FirestoreConnectionError";
import { getConnectionStatus, onConnectionStatusChanged } from "./utils/firebaseConnectionHandler";
import { Trip } from "./types";

// Workshop Components
import FleetTable from "./components/Workshop Management/FleetTable";
import JobCardManagement from "./components/Workshop Management/JobCardManagement";
import JobCardKanbanBoard from "./components/Workshop Management/JobCardKanbanBoard";
import InspectionManagement from "./components/Workshop Management/InspectionManagement";
import InspectionForm from "./components/Workshop Management/InspectionForm";
import FaultTracking from "./components/Workshop Management/FaultTracking";
import TyreManagement from "./components/TyreManagement/TyreManagement";

// UI Components
// Removed Sidebar import as it will be used inside Layout

// Feature Components
import ActiveTrips from "./components/TripManagement/ActiveTrips";
import ActiveTripsPage from "./pages/ActiveTripsPage";
import CompletedTrips from "./components/TripManagement/CompletedTrips";
import FlagsInvestigations from "./components/Flags/FlagsInvestigations";
import ClientManagementPage from "./pages/ClientManagementPage";
import CurrencyFleetReport from "./components/InvoiceManagement/CurrencyFleetReport";
import TripDashboard from "./components/TripManagement/TripDashboard";
import InvoiceAgingDashboard from "./components/InvoiceManagement/InvoiceAgingDashboard";
import CustomerRetentionDashboard from "./components/Performance/CustomerRetentionDashboard";
import ActionLog from "./components/actionlog/ActionLog";
import TripManagementPage from "./pages/TripManagementPage";
import WorkshopPage from "./pages/WorkshopPage";
import RoutePlanningPage from "./pages/RoutePlanningPage";
import InvoiceManagementPage from "./pages/InvoiceManagementPage";
import DieselManagementPage from "./pages/DieselManagementPage";
import DriverManagementPage from "./pages/DriverManagementPage";
import ComplianceManagementPage from "./pages/ComplianceManagementPage";
import TripTimelinePage from "./pages/TripTimelinePage";

// Invoice Management Components
import InvoiceDashboard from "./components/InvoiceManagement/InvoiceDashboard";
import InvoiceBuilder from "./components/InvoiceManagement/InvoiceBuilder";
import InvoiceApprovalFlow from "./components/InvoiceManagement/InvoiceApprovalFlow";
import TaxReportExport from "./components/InvoiceManagement/TaxReportExport";
// import CreateInvoicePage from "./pages/invoices/CreateInvoice"; // Uncomment if needed
import PendingInvoicesPage from "./pages/invoices/PendingInvoices";
import PaidInvoicesPage from "./pages/invoices/PaidInvoices";
import InvoiceTemplatesPage from "./pages/invoices/InvoiceTemplates";
import DriverBehaviorEvents from "./components/DriverManagement/DriverBehaviorEvents";

// Diesel Management Components
import DieselDashboardComponent from "./components/DieselManagement/DieselDashboardComponent";
import FuelLogs from "./components/DieselManagement/FuelLogs";
import FuelCardManager from "./components/DieselManagement/FuelCardManager";
import FuelEfficiencyReport from "./components/DieselManagement/FuelEfficiencyReport";
import FuelTheftDetection from "./components/DieselManagement/FuelTheftDetection";
import CarbonFootprintCalc from "./components/DieselManagement/CarbonFootprintCalc";
import DriverFuelBehavior from "./components/DieselManagement/DriverFuelBehavior";
import AddFuelEntryPage from "./pages/diesel/AddFuelEntry";

// Driver Management Components
import DriverDashboard from "./components/DriverManagement/DriverDashboard";
import AddNewDriver from "./pages/drivers/AddNewDriver";
import DriverProfiles from "./pages/drivers/DriverProfiles";

// Customer Management Components
import RetentionMetrics from "./components/CustomerManagement/RetentionMetrics";
import ClientNetworkMap from "./components/CustomerManagement/ClientNetworkMap";

// Compliance & Safety Components
import ComplianceDashboard from "./components/ComplianceSafety/ComplianceDashboard";
import IncidentManagement from "./pages/compliance/IncidentManagement";

// Fleet Analytics Components
import FleetAnalyticsPage from "./pages/FleetAnalyticsPage";
import AnalyticsDashboard from "./components/FleetAnalytics/AnalyticsDashboard";

// Placeholder components for new routes
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";

// Workshop components
import QRGenerator from "./components/Workshop Management/QRGenerator";
import WorkshopAnalyticsComp from "./components/Workshop Management/WorkshopAnalytics";
import PartsOrdering from "./components/Workshop Management/PartsOrdering";

// Inventory Components
import VendorScorecard from "./components/Inventory Management/VendorScorecard";
import IndirectCostBreakdown from "./components/Inventory Management/IndirectCostBreakdown";
import InventoryDashboard from "./components/Inventory Management/InventoryDashboard";
import StockManager from "./components/Inventory Management/StockManager";
import PurchaseOrderTracker from "./components/Inventory Management/PurchaseOrderTracker";
import FleetLocationMapPage from "./pages/FleetLocationMapPage";
import InventoryPage from "./pages/InventoryPage";
import MyMapComponent from "./components/MyMapComponent";
import WialonUnitList from './components/WialonUnitList';
import MapsView from "./components/maps/MapsView"; // Fixed path to correct directory
  
// Main App component with Router implementation
const App: React.FC = () => {
  const [connectionError, setConnectionError] = useState<Error | null>(
    getConnectionStatus().status === 'error' ? getConnectionStatus().error : null
  );
  // State variables for trip form management
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>(undefined);
  const [showTripForm, setShowTripForm] = useState(false);
  
  // Handler functions for trip form
  const handleSetEditingTrip = (trip: Trip | undefined) => {
    setEditingTrip(trip);
  };
  
  const handleShowTripForm = (show: boolean) => {
    setShowTripForm(show);
  };

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
            <TripProvider>
              <DriverBehaviorProvider>
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
                    setEditingTrip={handleSetEditingTrip} 
                    setShowTripForm={handleShowTripForm}
                  />
                }
              >
                <Route path="dashboard" element={<Navigate to="/" replace />} />
                
                {/* Trip Management Section */}
                <Route path="trips" element={<TripManagementPage />}>
                  <Route index element={<ActiveTripsPage />} />
                  <Route path="active" element={<ActiveTripsPage />} />
                  <Route path="completed" element={<CompletedTrips />} />
                  <Route path="flags" element={<FlagsInvestigations />} />
                  <Route path="dashboard" element={<TripDashboard />} />
                  <Route path="timeline" element={<TripTimelinePage />} />
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
                  <Route path="maps" element={<MapsView />} />
                  <Route path="fleet-location" element={<FleetLocationMapPage />} />
                </Route>
                {/* Redirect legacy routes to new nested routes */}
                <Route path="active-trips" element={<Navigate to="/trips?tab=active" replace />} />
                <Route path="completed-trips" element={<Navigate to="/trips?tab=completed" replace />} />
                <Route path="flags" element={<Navigate to="/trips?tab=flags" replace />} />
                
                {/* Route Planning Routes */}
                <Route path="route-planning" element={<RoutePlanningPage />} />
                <Route path="route-planning/:tripId" element={<RoutePlanningPage />} />
                
                {/* Invoice Management Section */}
                <Route path="invoices" element={<InvoiceManagementPage />}>
                  <Route index element={<InvoiceDashboard />} />
                  <Route path="new" element={<InvoiceBuilder />} />
                  <Route path="pending" element={<PendingInvoicesPage />} />
                  <Route path="paid" element={<PaidInvoicesPage />} />
                  <Route path="overdue" element={<div>Overdue Invoices</div>} />
                  <Route path="approval" element={<InvoiceApprovalFlow />} />
                  <Route path="reminders" element={<div>Payment Reminders</div>} />
                  <Route path="credit-notes" element={<div>Credit Notes</div>} />
                  <Route path="templates" element={<InvoiceTemplatesPage />} />
                  <Route path="payments" element={<div>Payment Tracking</div>} />
                  <Route path="tax-reports" element={<TaxReportExport />} />
                  <Route path="analytics" element={<div>Invoice Analytics</div>} />
                  <Route path="load-confirmation" element={<React.Suspense fallback={<div>Loading...</div>}>
                    {/* Import LoadConfirmation page lazily to improve initial load time */}
                    {React.createElement(lazy(() => import('./pages/invoices/LoadConfirmation')))}
                  </React.Suspense>} />
                </Route>
                
                {/* Diesel Management Section */}
                <Route path="diesel" element={<DieselManagementPage />}>
                  <Route index element={<DieselDashboardComponent />} />
                  <Route path="logs" element={<FuelLogs />} />
                  <Route path="new" element={<AddFuelEntryPage />} />
                  <Route path="fuel-cards" element={<FuelCardManager />} />
                  <Route path="analytics" element={<div>Fuel Analytics</div>} />
                  <Route path="stations" element={<div>Fuel Stations</div>} />
                  <Route path="costs" element={<div>Cost Analysis</div>} />
                  <Route path="efficiency" element={<FuelEfficiencyReport />} />
                  <Route path="theft-detection" element={<FuelTheftDetection />} />
                  <Route path="carbon-tracking" element={<CarbonFootprintCalc />} />
                  <Route path="budget" element={<div>Budget Planning</div>} />
                  <Route path="driver-behavior" element={<DriverFuelBehavior />} />
                </Route>
                
                {/* Fleet Management Section */}
                <Route path="fleet" element={<div>Fleet Management</div>} />
                <Route path="driver-behavior" element={<div>Driver Behavior</div>} />
                <Route path="diesel-dashboard" element={<div>Legacy Diesel Dashboard</div>} />
                <Route path="missed-loads" element={<div>Missed Loads Tracker</div>} />
                {/* Map view is now integrated into FleetManagementPage */}
                
                {/* Customer Management Section */}
                <Route path="clients/*" element={<ClientManagementPage />} />
                <Route path="customers/retention" element={<RetentionMetrics />} />
                <Route path="clients/network" element={<ClientNetworkMap />} />
                
                {/* Driver Management Section */}
                <Route path="drivers" element={<DriverManagementPage />}>
                  <Route index element={<DriverDashboard />} />
                  <Route path="new" element={<AddNewDriver />} />
                  <Route path="profiles" element={<DriverProfiles />} />
                  <Route path="profiles/:id" element={<div>Driver Details</div>} />
                  <Route path="profiles/:id/edit" element={<div>Edit Driver</div>} />
                  <Route path="licenses" element={<div>License Management</div>} />
                  <Route path="training" element={<div>Training Records</div>} />
                  <Route path="performance" element={<div>Performance Analytics</div>} />
                  <Route path="scheduling" element={<div>Driver Scheduling</div>} />
                  <Route path="hours" element={<div>Hours of Service</div>} />
                  <Route path="violations" element={<div>Driver Violations</div>} />
                  <Route path="rewards" element={<div>Driver Rewards</div>} />
                  <Route path="behavior" element={<DriverBehaviorEvents />} />
                  <Route path="safety-scores" element={<div>Safety Scores</div>} />
                </Route>
                
                {/* Compliance & Safety Section */}
                <Route path="compliance" element={<ComplianceManagementPage />}>
                  <Route index element={<ComplianceDashboard />} />
                  <Route path="dot" element={<div>DOT Compliance</div>} />
                  <Route path="safety-inspections" element={<div>Safety Inspections</div>} />
                  <Route path="incidents" element={<IncidentManagement />} />
                  <Route path="incidents/new" element={<ReportNewIncidentPage />} />
                  <Route path="incidents/:id" element={<div>Incident Details</div>} />
                  <Route path="incidents/:id/edit" element={<div>Edit Incident</div>} />
                  <Route path="training" element={<div>Safety Training</div>} />
                  <Route path="audits" element={<div>Audit Management</div>} />
                  <Route path="violations" element={<div>Violation Tracking</div>} />
                  <Route path="insurance" element={<div>Insurance Management</div>} />
                </Route>
                
                {/* Fleet Analytics Section */}
                <Route path="analytics" element={<FleetAnalyticsPage />}>
                  <Route index element={<AnalyticsDashboard />} />
                  <Route path="kpi" element={<div>KPI Overview</div>} />
                  <Route path="predictive" element={<div>Predictive Analytics</div>} />
                  <Route path="costs" element={<div>Cost Analysis</div>} />
                  <Route path="roi" element={<div>ROI Reports</div>} />
                  <Route path="benchmarks" element={<div>Performance Benchmarks</div>} />
                  <Route path="custom-reports" element={<div>Custom Reports</div>} />
                  <Route path="custom-reports/new" element={<div>Create Custom Report</div>} />
                  <Route path="insights" element={<div>Analytics Insights</div>} />
                  <Route path="vehicle-performance" element={<div>Vehicle Performance</div>} />
                </Route>
                
                
                {/* Workshop Section */}
                <Route path="workshop" element={<WorkshopPage />}>
                  <Route index element={<WorkshopAnalyticsComp />} />
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
                  <Route path="tyres/management" element={<TyreManagementPage />} />
                  
                  {/* Inventory Management Routes */}
                  <Route path="stock-alerts" element={<div>Stock Alerts</div>} />
                  <Route path="parts-ordering" element={<PartsOrdering />} />
                  <Route path="request-parts" element={
                    <Suspense fallback={<div>Loading parts request form...</div>}>
                      <RequestPartsPage />
                    </Suspense>
                  } />
                  <Route path="vehicle-inspection" element={
                    <Suspense fallback={<div>Loading inspection form...</div>}>
                      <VehicleInspectionPage />
                    </Suspense>
                  } />
                  <Route path="create-purchase-order" element={
                    <Suspense fallback={<div>Loading purchase order form...</div>}>
                      <CreatePurchaseOrderPage />
                    </Suspense>
                  } />
                  <Route path="work-orders" element={<div>Work Orders</div>} />
                  <Route path="purchase-orders" element={<PurchaseOrderTracker />} />
                  <Route path="vendors" element={<VendorScorecard />} />
                  <Route path="inventory" element={<InventoryDashboard />} />
                  <Route path="stock" element={<StockManager />} />
                  <Route path="indirect-costs" element={<IndirectCostBreakdown />} />
                  
                  {/* Analytics & Reports */}
                  <Route path="analytics" element={<WorkshopAnalyticsComp />} />
                  <Route path="reports" element={<div>Workshop Reports</div>} />
                  <Route path="reports/costs" element={<div>Cost Analysis Reports</div>} />
                </Route>
                
                {/* Standalone Tyres Management Section */}
                <Route path="tyres/dashboard" element={<TyreManagementPage />} />
                <Route path="tyres/inspection" element={<TyreInspection />} />
                <Route path="tyres/inventory" element={<TyreInventory />} />
                <Route path="tyres/reports" element={<TyreReports />} />
                <Route path="tyres/add-new" element={<AddNewTyrePage />} />
                
                {/* Standalone Inventory Management Section */}
                <Route path="inventory/dashboard" element={<InventoryPage />} />
                <Route path="inventory/stock" element={<StockManager />} />
                <Route path="inventory/reports" element={<div>Inventory Reports</div>} />
                <Route path="inventory/receive-parts" element={<ReceivePartsPage />} />
                
                
                <Route path="action-log" element={<ActionLog />} />
                
                {/* Reports Section */}
                <Route path="reports" element={<CurrencyFleetReport />} />
                <Route path="invoice-aging" element={<InvoiceAgingDashboard />} />
                <Route path="customer-retention" element={<CustomerRetentionDashboard />} />
                
                {/* System Section */}
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                  </Routes>
                </Router>
                
                {/* Trip Form Modal */}
                <TripFormModal
                  isOpen={showTripForm}
                  onClose={() => setShowTripForm(false)}
                  editingTrip={editingTrip}
                />
              </DriverBehaviorProvider>
            </TripProvider>
          </TyreStoresProvider>
        </SyncProvider>
      </AppProvider>
    </ErrorBoundary>
  );
};

// Removed duplicate components that were causing TypeScript errors

export default App;
