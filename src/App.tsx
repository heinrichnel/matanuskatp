// src/App.tsx

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context Providers
import { AppProvider } from "./context/AppContext";
import { SyncProvider } from "./context/SyncContext";
import { TyreStoresProvider } from "./context/TyreStoresContext";
import { TripProvider } from "./context/TripContext";
import { DriverBehaviorProvider } from "./context/DriverBehaviorContext";

// Error Boundary and Layout
import ErrorBoundary from "./components/ErrorBoundary";
import FirestoreConnectionError from "./components/ui/FirestoreConnectionError";
import Layout from "./components/layout/Layout";
import TripFormModal from "./components/TripManagement/TripFormModal";

// Main pages (import all real ones)
import DashboardPage from "./pages/DashboardPage";
import TripManagementPage from "./pages/trips/TripManagementPage";
import ActiveTripsPage from "./pages/trips/ActiveTripsPage";
import TripTimelinePage from "./pages/trips/TripTimelinePage";
import RoutePlanningPage from "./pages/trips/RoutePlanningPage";
import RouteOptimizationPage from "./pages/trips/RouteOptimizationPage";
import LoadPlanningPage from "./pages/trips/LoadPlanningPage";
import TripCalendarPage from "./pages/trips/TripCalendarPage";
import AddTripPage from "./pages/trips/AddTripPage";
import FleetLocationMapPage from "./pages/trips/FleetLocationMapPage";
import ActiveTrips from "./components/TripManagement/ActiveTrips";
import CompletedTrips from "./pages/trips/CompletedTrips";
import FlagsInvestigations from "./pages/trips/FlagsInvestigations";
import TripDashboard from "./pages/trips/TripDashboard";

import InvoiceManagementPage from "./pages/invoices/InvoiceManagementPage";
import InvoiceTemplatesPage from "./pages/invoices/InvoiceTemplates";
import InvoiceDashboard from "./pages/invoices/Dashboard";
import InvoiceBuilder from "./pages/invoices/InvoiceBuilder";
import InvoiceApprovalFlow from "./pages/invoices/InvoiceApprovalFlow";
import TaxReportExport from "./pages/invoices/TaxReportExport";
import PendingInvoicesPage from "./pages/invoices/PendingInvoices";
import PaidInvoicesPage from "./pages/invoices/PaidInvoices";

import DieselManagementPage from "./pages/diesel/DieselManagementPage";
import AddFuelEntryPage from "./pages/diesel/AddFuelEntryPage";
import DieselDashboardComponent from "./pages/diesel/DieselDashboardComponent";
import FuelLogs from "./pages/diesel/FuelLogs";
import FuelCardManager from "./pages/diesel/FuelCardManager";
import FuelTheftDetection from "./pages/diesel/FuelTheftDetection";
import CarbonFootprintCalc from "./pages/diesel/CarbonFootprintCalc";
import DriverFuelBehavior from "./pages/diesel/DriverFuelBehavior";
import FuelEfficiencyReport from "./pages/diesel/FuelEfficiencyReport";

import ClientManagementPage from "./pages/clients/ClientManagementPage";
import AddNewCustomer from "./pages/clients/AddNewCustomer";
import ActiveCustomers from "./pages/clients/ActiveCustomers";
import CustomerReports from "./pages/clients/CustomerReports";
import RetentionMetrics from "./pages/clients/RetentionMetrics";
import ClientNetworkMap from "./pages/clients/ClientNetworkMap";

import DriverManagementPage from "./pages/drivers/DriverManagementPage";
import AddNewDriver from "./pages/drivers/AddNewDriver";
import DriverProfiles from "./pages/drivers/DriverProfiles";
import DriverBehaviorEvents from "./pages/drivers/DriverBehaviorEvents";
import DriverDashboard from "./pages/drivers/DriverDashboard";

import ComplianceManagementPage from "./pages/compliance/ComplianceManagementPage";
import ComplianceDashboard from "./pages/compliance/ComplianceDashboard";

import FleetAnalyticsPage from "./pages/analytics/FleetAnalyticsPage";
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";

// Workshop and submodules
import WorkshopPage from "./pages/workshop/WorkshopPage";
import FleetTable from "./components/Workshop Management/FleetTable";
import QRGenerator from "./components/Workshop Management/QRGenerator";
import QRCodeBatchGenerator from "./components/Workshop Management/QRCodeBatchGenerator";
import DriverInspectionForm from "./components/Workshop Management/DriverInspectionForm";
import InspectionHistory from "./components/Workshop Management/InspectionHistory";
import InspectionHistoryPage from "./pages/workshop/inspections";
import InspectionForm from "./components/Workshop Management/InspectionForm";
import InspectionManagement from "./components/Workshop Management/InspectionManagement";
import JobCardManagement from "./components/Workshop Management/JobCardManagement";
import JobCardKanbanBoard from "./components/Workshop Management/JobCardKanbanBoard";
import FaultTracking from "./components/Workshop Management/FaultTracking";

// Tyres
import TyreManagement from "./components/TyreManagement/TyreManagement";
import TyreManagementPage from "./pages/tyres/TyreManagementPage";
import TyreInspection from "./pages/tyres/inspection";
import TyreInventory from "./pages/tyres/inventory";
import TyreReports from "./pages/tyres/reports";
import AddNewTyrePage from "./pages/tyres/add-new-tyre";

// Inventory
import InventoryPage from "./pages/inventory/InventoryPage";
import StockManager from "./components/Inventory Management/StockManager";
import PartsInventoryPage from "./pages/inventory/PartsInventoryPage";
import ReceivePartsPage from "./pages/inventory/receive-parts";

// Wialon
import WialonDashboard from "./pages/wialon/WialonDashboard";
import WialonUnitsPage from "./pages/wialon/WialonUnitsPage";
import WialonConfigPage from "./pages/wialon/WialonConfigPage";

// Misc
import ActionLog from "./components/ComplianceSafety/ActionLog";
import CurrencyFleetReport from "./components/reports/CurrencyFleetReport";
import InvoiceAgingDashboard from "./components/reports/InvoiceAgingDashboard";
import CustomerRetentionDashboard from "./components/reports/CustomerRetentionDashboard";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";
import MapTestPage from "./pages/MapTestPage";
import MapsView from "./pages/MapsView";
import GenericPlaceholderPage from "./components/GenericPlaceholderPage";

// Placeholders for missing pages/components. Add as needed:
const JobCardTemplatesPage = () => <GenericPlaceholderPage title="Job Card Templates" />;
const InspectionTemplatesPage = () => <GenericPlaceholderPage title="Inspection Templates" />;
const StockAlertsPage = () => <GenericPlaceholderPage title="Stock Alerts" />;
const PartsOrderingPage = () => <GenericPlaceholderPage title="Parts Ordering" />;
const IndirectCostBreakdown = () => <GenericPlaceholderPage title="Indirect Cost Breakdown" />;
const WorkshopAnalyticsComp = () => <GenericPlaceholderPage title="Workshop Analytics" />;
const WorkshopReportsPage = () => <GenericPlaceholderPage title="Workshop Reports" />;
const WorkshopCostReportsPage = () => (
  <GenericPlaceholderPage title="Workshop Cost Analysis Reports" />
);
const InventoryReportsPage = () => <GenericPlaceholderPage title="Inventory Reports" />;
const TyrePerformanceDashboard = () => (
  <GenericPlaceholderPage title="Tyre Performance Dashboard" />
);
const TyreStoresPage = () => <GenericPlaceholderPage title="Tyre Stores" />;
const TyreFleetMap = () => <GenericPlaceholderPage title="Tyre Fleet Map" />;
const TyreHistoryPage = () => <GenericPlaceholderPage title="Tyre History" />;
const TyreAddPage = () => <GenericPlaceholderPage title="Add New Tyre" />;
const VendorScorecard = () => <GenericPlaceholderPage title="Vendor Scorecard" />;
const PurchaseOrderTracker = () => <GenericPlaceholderPage title="Purchase Order Tracker" />;
const InventoryDashboard = () => <GenericPlaceholderPage title="Inventory Dashboard" />;

const App: React.FC = () => {
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [editingTrip, setEditingTrip] = useState<any>();
  const [showTripForm, setShowTripForm] = useState(false);

  // Add effect for connection logic, etc, if needed

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
                        <Layout setShowTripForm={setShowTripForm} setEditingTrip={setEditingTrip} />
                      }
                    >
                      {/* ==== Main Navigation ==== */}
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      {/* ==== TRIPS ==== */}
                      <Route path="/trips" element={<TripManagementPage />} />
                      <Route path="/trips/active" element={<ActiveTripsPage />} />
                      <Route path="/trips/timeline" element={<TripTimelinePage />} />
                      <Route path="/trips/planning" element={<RoutePlanningPage />} />
                      <Route path="/trips/optimization" element={<RouteOptimizationPage />} />
                      <Route path="/trips/load-planning" element={<LoadPlanningPage />} />
                      <Route path="/trips/calendar" element={<TripCalendarPage />} />
                      <Route path="/trips/add" element={<AddTripPage />} />
                      <Route path="/trips/map" element={<FleetLocationMapPage />} />
                      <Route path="/trips/active-dashboard" element={<ActiveTrips />} />
                      <Route path="/trips/completed-dashboard" element={<CompletedTrips />} />
                      <Route path="/trips/flags" element={<FlagsInvestigations />} />
                      <Route path="/trips/dashboard" element={<TripDashboard />} />
                      {/* ==== INVOICES ==== */}
                      <Route path="/invoices" element={<InvoiceManagementPage />} />
                      <Route path="/invoices/templates" element={<InvoiceTemplatesPage />} />
                      <Route path="/invoices/dashboard" element={<InvoiceDashboard />} />
                      <Route path="/invoices/builder" element={<InvoiceBuilder />} />
                      <Route path="/invoices/approval" element={<InvoiceApprovalFlow />} />
                      <Route path="/invoices/tax-export" element={<TaxReportExport />} />
                      <Route path="/invoices/pending" element={<PendingInvoicesPage />} />
                      <Route path="/invoices/paid" element={<PaidInvoicesPage />} />
                      {/* ==== DIESEL ==== */}
                      <Route path="/diesel" element={<DieselManagementPage />} />
                      <Route path="/diesel/add-fuel" element={<AddFuelEntryPage />} />
                      <Route path="/diesel/dashboard" element={<DieselDashboardComponent />} />
                      <Route path="/diesel/logs" element={<FuelLogs />} />
                      <Route path="/diesel/card-manager" element={<FuelCardManager />} />
                      <Route path="/diesel/theft-detection" element={<FuelTheftDetection />} />
                      <Route path="/diesel/carbon-footprint" element={<CarbonFootprintCalc />} />
                      <Route path="/diesel/driver-behavior" element={<DriverFuelBehavior />} />
                      <Route path="/diesel/efficiency" element={<FuelEfficiencyReport />} />
                      <Route
                        path="/diesel/budget"
                        element={<GenericPlaceholderPage title="Budget Planning" />}
                      />
                      {/* ==== CLIENTS ==== */}
                      <Route path="/clients" element={<ClientManagementPage />} />
                      <Route path="/clients/new" element={<AddNewCustomer />} />
                      <Route path="/clients/active" element={<ActiveCustomers />} />
                      <Route path="/clients/reports" element={<CustomerReports />} />
                      <Route path="/customers/retention" element={<RetentionMetrics />} />
                      <Route path="/clients/relationships" element={<ClientNetworkMap />} />
                      <Route path="/clients/network" element={<ClientNetworkMap />} />
                      {/* ==== DRIVERS ==== */}
                      <Route path="/drivers" element={<DriverManagementPage />} />
                      <Route path="/drivers/new" element={<AddNewDriver />} />
                      <Route path="/drivers/profiles" element={<DriverProfiles />} />
                      <Route
                        path="/drivers/profiles/:id"
                        element={<GenericPlaceholderPage title="Driver Details" />}
                      />
                      <Route
                        path="/drivers/profiles/:id/edit"
                        element={<GenericPlaceholderPage title="Edit Driver" />}
                      />
                      <Route
                        path="/drivers/licenses"
                        element={<GenericPlaceholderPage title="License Management" />}
                      />
                      <Route
                        path="/drivers/training"
                        element={<GenericPlaceholderPage title="Training Records" />}
                      />
                      <Route
                        path="/drivers/performance"
                        element={<GenericPlaceholderPage title="Performance Analytics" />}
                      />
                      <Route
                        path="/drivers/scheduling"
                        element={<GenericPlaceholderPage title="Driver Scheduling" />}
                      />
                      <Route
                        path="/drivers/hours"
                        element={<GenericPlaceholderPage title="Hours of Service" />}
                      />
                      <Route
                        path="/drivers/violations"
                        element={<GenericPlaceholderPage title="Driver Violations" />}
                      />
                      <Route
                        path="/drivers/rewards"
                        element={<GenericPlaceholderPage title="Driver Rewards" />}
                      />
                      <Route path="/drivers/behavior" element={<DriverBehaviorEvents />} />
                      <Route
                        path="/drivers/safety-scores"
                        element={<GenericPlaceholderPage title="Safety Scores" />}
                      />
                      <Route path="/drivers/dashboard" element={<DriverDashboard />} />
                      {/* ==== COMPLIANCE ==== */}
                      <Route path="/compliance" element={<ComplianceManagementPage />} />
                      <Route
                        path="/compliance/audits"
                        element={<GenericPlaceholderPage title="Audit Management" />}
                      />
                      <Route
                        path="/compliance/violations"
                        element={<GenericPlaceholderPage title="Violation Tracking" />}
                      />
                      <Route
                        path="/compliance/insurance"
                        element={<GenericPlaceholderPage title="Insurance Management" />}
                      />
                      <Route path="/compliance/dashboard" element={<ComplianceDashboard />} />
                      {/* ==== ANALYTICS ==== */}
                      <Route path="/analytics" element={<FleetAnalyticsPage />} />
                      <Route
                        path="/analytics/custom-reports/new"
                        element={<GenericPlaceholderPage title="Create Custom Report" />}
                      />
                      <Route
                        path="/analytics/insights"
                        element={<GenericPlaceholderPage title="Analytics Insights" />}
                      />
                      <Route
                        path="/analytics/vehicle-performance"
                        element={<GenericPlaceholderPage title="Vehicle Performance" />}
                      />
                      <Route path="/analytics/dashboard" element={<AnalyticsDashboard />} />
                      {/* ==== WORKSHOP ==== */}
                      <Route path="/workshop" element={<WorkshopPage />} />
                      <Route path="/workshop/fleet-setup" element={<FleetTable />} />
                      <Route path="/workshop/qr-generator" element={<QRGenerator />} />
                      <Route
                        path="/workshop/qr-generator/batch"
                        element={<QRCodeBatchGenerator />}
                      />
                      <Route
                        path="/workshop/driver-inspection"
                        element={<DriverInspectionForm />}
                      />
                      <Route path="/workshop/inspection-history" element={<InspectionHistory />} />
                      {/* Inspections */}
                      <Route path="/workshop/inspections" element={<InspectionHistoryPage />} />
                      <Route
                        path="/workshop/inspections/new"
                        element={<InspectionForm onBack={() => {}} />}
                      />
                      <Route
                        path="/workshop/inspections/active"
                        element={<InspectionManagement status="active" />}
                      />
                      <Route
                        path="/workshop/inspections/completed"
                        element={<InspectionManagement status="completed" />}
                      />
                      <Route
                        path="/workshop/inspections/templates"
                        element={<InspectionTemplatesPage />}
                      />
                      {/* Job Cards */}
                      <Route path="/workshop/job-cards" element={<JobCardManagement />} />
                      <Route path="/workshop/job-cards/kanban" element={<JobCardKanbanBoard />} />
                      <Route
                        path="/workshop/job-cards/open"
                        element={<JobCardManagement activeTab="open" />}
                      />
                      <Route
                        path="/workshop/job-cards/completed"
                        element={<JobCardManagement activeTab="completed" />}
                      />
                      <Route
                        path="/workshop/job-cards/templates"
                        element={<JobCardTemplatesPage />}
                      />
                      {/* Faults */}
                      <Route path="/workshop/faults" element={<FaultTracking />} />
                      <Route
                        path="/workshop/faults/new"
                        element={<GenericPlaceholderPage title="Report New Fault" />}
                      />
                      <Route
                        path="/workshop/faults/critical"
                        element={<GenericPlaceholderPage title="Critical Faults" />}
                      />
                      {/* Tyre Management */}
                      <Route path="/workshop/tyres" element={<TyreManagement />} />
                      <Route
                        path="/workshop/tyres/inventory"
                        element={<TyreManagement activeTab="inventory" />}
                      />
                      <Route path="/workshop/tyres/stores" element={<TyreStoresPage />} />
                      <Route path="/workshop/tyres/fleet" element={<TyreFleetMap />} />
                      <Route path="/workshop/tyres/history" element={<TyreHistoryPage />} />
                      <Route
                        path="/workshop/tyres/performance"
                        element={<TyrePerformanceDashboard />}
                      />
                      <Route path="/workshop/tyres/add" element={<TyreAddPage />} />
                      <Route path="/workshop/tyres/management" element={<TyreManagementPage />} />
                      {/* Inventory Management */}
                      <Route path="/workshop/stock-alerts" element={<StockAlertsPage />} />
                      <Route path="/workshop/parts-ordering" element={<PartsOrderingPage />} />
                      <Route
                        path="/workshop/request-parts"
                        element={<GenericPlaceholderPage title="Request Parts" />}
                      />
                      <Route
                        path="/workshop/vehicle-inspection"
                        element={<GenericPlaceholderPage title="Vehicle Inspection" />}
                      />
                      <Route
                        path="/workshop/create-purchase-order"
                        element={<GenericPlaceholderPage title="Create Purchase Order" />}
                      />
                      <Route
                        path="/workshop/work-orders"
                        element={<GenericPlaceholderPage title="Work Orders" />}
                      />
                      <Route path="/workshop/purchase-orders" element={<PurchaseOrderTracker />} />
                      <Route path="/workshop/vendors" element={<VendorScorecard />} />
                      <Route path="/workshop/inventory" element={<InventoryDashboard />} />
                      <Route path="/workshop/stock" element={<StockManager />} />
                      <Route path="/workshop/indirect-costs" element={<IndirectCostBreakdown />} />
                      {/* Analytics & Reports */}
                      <Route path="/workshop/analytics" element={<WorkshopAnalyticsComp />} />
                      <Route path="/workshop/reports" element={<WorkshopReportsPage />} />
                      <Route path="/workshop/reports/costs" element={<WorkshopCostReportsPage />} />
                      {/* ==== TYRES ==== */}
                      <Route path="/tyres" element={<TyreManagementPage />} />
                      <Route path="/tyres/dashboard" element={<TyreManagementPage />} />
                      <Route path="/tyres/inspection" element={<TyreInspection />} />
                      <Route path="/tyres/inventory" element={<TyreInventory />} />
                      <Route path="/tyres/reports" element={<TyreReports />} />
                      <Route path="/tyres/add-new" element={<AddNewTyrePage />} />
                      {/* ==== INVENTORY ==== */}
                      <Route path="/inventory" element={<InventoryPage />} />
                      <Route path="/inventory/dashboard" element={<InventoryPage />} />
                      <Route path="/inventory/stock" element={<StockManager />} />
                      <Route path="/inventory/parts" element={<PartsInventoryPage />} />
                      // App.tsx (volledig, einde klaar) ...
                      {/* === FALLBACK === */}
                      <Route path="*" element={<DashboardPage />} />
                    </Route>
                  </Routes>
                </Router>
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

export default App;
