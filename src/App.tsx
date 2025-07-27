import React, { useEffect, useState } from "react";
// FIXED: Removed 'BrowserRouter as Router' from this import
import { Route, Routes } from "react-router-dom";

// Context Providers
import { AppProvider } from "./context/AppContext";
import { DriverBehaviorProvider } from "./context/DriverBehaviorContext";
import { SyncProvider } from "./context/SyncContext";
import { TripProvider } from "./context/TripContext";
import { TyreReferenceDataProvider } from "./context/TyreReferenceDataContext";
import { TyreStoresProvider } from "./context/TyreStoresContext";
import { WialonProvider, useWialon } from "./context/WialonProvider";
import { WorkshopProvider } from "./context/WorkshopContext";

// Error Handling
import ErrorBoundary from "./components/ErrorBoundary";
import ConnectionStatusIndicator from "./components/ui/ConnectionStatusIndicator";
import FirestoreConnectionError from "./components/ui/FirestoreConnectionError";
import OfflineBanner from "./components/ui/OfflineBanner";

// Offline & Network Support
import { startNetworkMonitoring } from "./utils/networkDetection";
import { initOfflineCache } from "./utils/offlineCache";
import { syncOfflineOperations } from "./utils/offlineOperations";

// Auto-initialize Wialon
import "./api/wialon"; // Import for side effects - auto-initialization
// Wialon Status Indicator Component
const WialonStatusIndicator: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { initialized, initializing, error } = useWialon();

  if (error) {
    return <div className={`text-sm text-red-500 ${className}`}>Wialon: Error</div>;
  }

  if (initializing) {
    return <div className={`text-sm text-amber-500 ${className}`}>Wialon: Connecting...</div>;
  }

  if (initialized) {
    return <div className={`text-sm text-green-500 ${className}`}>Wialon: Connected</div>;
  }

  return <div className={`text-sm text-gray-500 ${className}`}>Wialon: Disconnected</div>;
};
// Error Handling
import {
  ErrorCategory,
  ErrorSeverity,
  handleError,
  logError,
  registerErrorHandler,
} from "./utils/errorHandling";

// Layout
import Layout from "./components/layout/Layout";

// Core Components
import TripFormModal from "./components/Models/Trips/TripFormModal";
import DashboardPage from "./pages/DashboardPage";

// === TRIPS ===
import FleetLocationMapPage from "./components/Map/pages/FleetLocationMapPage";
import ActiveTrips from "./components/TripManagement/ActiveTrips";
import ActiveTripsPage from "./pages/ActiveTripsPage";
import AddTripPage from "./pages/AddTripPage";
import CompletedTrips from "./pages/CompletedTrips";
import FlagsInvestigations from "./pages/FlagsInvestigationsPage";
import LoadPlanningPage from "./pages/LoadPlanningPage";
import RouteOptimizationPage from "./pages/RouteOptimizationPage";
import RoutePlanningPage from "./pages/RoutePlanningPage";
import TripCalendarPage from "./pages/TripCalendarPage";
import TripDashboard from "./pages/TripDashboard";
import TripManagementPage from "./pages/TripManagementPage";
import CreateLoadConfirmationPage from "./pages/trips/CreateLoadConfirmationPage";
import TripTimelinePage from "./pages/trips/TripTimelinePage";

// === INVOICES ===
import CreateInvoicePage from "./pages/invoices/CreateInvoicePage";
import CreateQuotePage from "./pages/invoices/CreateQuotePage";
import InvoiceApprovalFlow from "./pages/invoices/InvoiceApprovalFlow";
import InvoiceBuilder from "./pages/invoices/InvoiceBuilder";
import InvoiceDashboard from "./pages/invoices/InvoiceDashboard";
import InvoiceManagementPage from "./pages/invoices/InvoiceManagementPage";
import InvoiceTemplatesPage from "./pages/invoices/InvoiceTemplatesPage";
import PaidInvoicesPage from "./pages/invoices/PaidInvoicesPage";
import PendingInvoicesPage from "./pages/invoices/PendingInvoicesPage";
import TaxReportExport from "./pages/invoices/TaxReportExport";

// === DIESEL ===
import AddFuelEntryPage from "./pages/diesel/AddFuelEntryPage";
import BudgetPlanning from "./pages/diesel/BudgetPlanning";
import CarbonFootprintCalc from "./pages/diesel/CarbonFootprintCalc";
import DieselDashboardComponent from "./pages/diesel/DieselDashboardComponent";
import DieselManagementPage from "./pages/diesel/DieselManagementPage";
import DriverFuelBehavior from "./pages/diesel/DriverFuelBehavior";
import FuelCardManager from "./pages/diesel/FuelCardManager";
import FuelEfficiencyReport from "./pages/diesel/FuelEfficiencyReport";
import FuelLogs from "./pages/diesel/FuelLogs";
import FuelTheftDetection from "./pages/diesel/FuelTheftDetection";

// === CLIENTS ===
import ActiveCustomers from "./pages/clients/ActiveCustomers";
import AddNewCustomer from "./pages/clients/AddNewCustomer";
import ClientManagementPage from "./pages/clients/ClientManagementPage";
import ClientNetworkMap from "./pages/clients/ClientNetworkMap";
import CustomerReports from "./pages/clients/CustomerReports";
import RetentionMetrics from "./pages/clients/RetentionMetrics";

// === DRIVERS ===
import AddNewDriver from "./pages/drivers/AddNewDriver";
import DriverBehaviorPage from "./pages/drivers/DriverBehaviorPage";
import DriverDashboard from "./pages/drivers/DriverDashboard";
import DriverDetailsPage from "./pages/drivers/DriverDetailsPage";
import DriverManagementPage from "./pages/drivers/DriverManagementPage";
import DriverProfiles from "./pages/drivers/DriverProfiles";
import DriverRewards from "./pages/drivers/DriverRewards";
import DriverScheduling from "./pages/drivers/DriverScheduling";
import EditDriver from "./pages/drivers/EditDriver";
import HoursOfService from "./pages/drivers/HoursOfService";
import LicenseManagement from "./pages/drivers/LicenseManagement";
import PerformanceAnalytics from "./pages/drivers/PerformanceAnalytics";
import TrainingRecords from "./pages/drivers/TrainingRecords";

// === EXAMPLES ===

// === COMPLIANCE ===

// === ANALYTICS ===

// === WORKSHOP ===
import FaultTracking from "./components/WorkshopManagement/FaultTracking";
import InspectionHistoryPage from "./components/WorkshopManagement/inspections";
import VehicleInspectionPage from "./components/WorkshopManagement/vehicle-inspection";
import InventoryDashboard from "./pages/InventoryDashboard";
import JobCardManagement from "./pages/JobCardManagement";
import PartsOrderingPage from "./pages/PartsOrderingPage";
import TyreFleetMap from "./pages/TyreFleetMap";
import TyreHistoryPage from "./pages/TyreHistoryPage";
import TyrePerformanceDashboard from "./pages/TyrePerformanceDashboard";
import TyreMobilePage from "./pages/mobile/TyreMobilePage";
import MainTripWorkflow from "./pages/trips/MainTripWorkflow";
import TripDetailsPage from "./pages/trips/TripDetailsPage";
import TyreManagementPage from "./pages/tyres/TyreManagementPage";
import PurchaseOrderPage from "./pages/workshop/PurchaseOrderPage";
import QRGenerator from "./pages/workshop/QRGenerator";
import QRScannerPage from "./pages/workshop/QRScannerPage";
import StockInventoryPage from "./pages/workshop/StockInventoryPage";
import VendorPage from "./pages/workshop/VendorPage";
import WorkshopPage from "./pages/workshop/WorkshopPage";

// === TYRES ===
import AddNewTyrePage from "./pages/tyres/AddNewTyrePage";
import TyreReferenceManagerPage from "./pages/tyres/TyreReferenceManagerPage";

// === INVENTORY ===
import InventoryPage from "./pages/InventoryPage";
import InventoryReportsPage from "./pages/InventoryReportsPage";
import PartsInventoryPage from "./pages/PartsInventoryPage";
import ReceivePartsPage from "./pages/ReceivePartsPage";

// === WIALON ===

// === REPORTS & OTHER ===
import { ScanQRButton } from "./components/ScanQRButton";
import UIConnector from "./components/UIConnector";

// UI Components
import { GenericPlaceholderPage } from "./components/ui";

// App.tsx - Simplified version to fix build errors
const App: React.FC = () => {
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [editingTrip, setEditingTrip] = useState<any>();
  const [showTripForm, setShowTripForm] = useState(false);

  useEffect(() => {
    console.log("App is running");

    // Initialize error handlers
    const unregisterErrorHandler = registerErrorHandler((error) => {
      // Add application-wide error handling logic
      if (error.severity === ErrorSeverity.FATAL) {
        setConnectionError(error.originalError);
      }

      // Send errors to analytics in production
      if (process.env.NODE_ENV === "production") {
        // Example: send to an analytics service
        // analyticsService.trackError(error);
      }
    });

    // Initialize offline cache with error handling
    handleError(async () => await initOfflineCache(), {
      category: ErrorCategory.DATABASE,
      context: { component: "App", operation: "initOfflineCache" },
      maxRetries: 3,
    }).catch((error) => {
      setConnectionError(new Error(`Failed to initialize offline cache: ${error.message}`));
    });

    // Start network monitoring
    startNetworkMonitoring(30000); // Check every 30 seconds

    // Sync offline operations when online with enhanced error handling
    const handleOnline = async () => {
      try {
        const result = await handleError(async () => await syncOfflineOperations(), {
          category: ErrorCategory.NETWORK,
          context: { component: "App", operation: "syncOfflineOperations" },
          maxRetries: 3,
        });

        if (result) {
          console.log(
            `Synced offline operations: ${result.success} succeeded, ${result.failed} failed`
          );
        }
      } catch (error) {
        // This will be handled by the error handler
      }
    };

    window.addEventListener("online", handleOnline);

    // Setup global error handling for uncaught errors
    const handleGlobalError = (event: ErrorEvent) => {
      event.preventDefault();
      logError(event.error || event.message, {
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.ERROR,
        context: { source: "window.onerror" },
      });
    };

    window.addEventListener("error", handleGlobalError);

    // Setup global promise rejection handling
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      logError(event.reason || "Unhandled Promise Rejection", {
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.ERROR,
        context: { source: "unhandledrejection" },
      });
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      unregisterErrorHandler();
    };
  }, []);

  // Conditional UI connector rendering
  const renderUIConnector = () => {
    if (process.env.NODE_ENV !== "production") {
      return <UIConnector />;
    }
    return null;
  };

  return (
    <ErrorBoundary>
      <AppProvider>
        <SyncProvider>
          <WialonProvider>
            <TyreStoresProvider>
              <TripProvider>
                <DriverBehaviorProvider>
                  <WorkshopProvider>
                    <TyreReferenceDataProvider>
                      {connectionError ? (
                        <div className="fixed top-0 left-0 right-0 z-50 p-4">
                          <FirestoreConnectionError error={connectionError} />
                        </div>
                      ) : null}

                      {/* Wialon Status Indicator */}
                      <WialonStatusIndicator className="fixed bottom-16 right-4 z-40" />
                      {/* Connection status components */}
                      <OfflineBanner />
                      <ConnectionStatusIndicator
                        showText={true}
                        className="fixed bottom-4 right-4 z-40"
                      />

                      {renderUIConnector()}

                      {/* FIXED: The extra <Router> component was removed from here. */}
                      {/* The <Routes> component now correctly uses the router from main.tsx */}
                      <Routes>
                        <Route
                          path="/*"
                          element={
                            <Layout
                              setShowTripForm={setShowTripForm}
                              setEditingTrip={setEditingTrip}
                            />
                          }
                        >
                          {/* ==== Main Navigation ==== */}
                          <Route path="/" element={<DashboardPage />} />
                          <Route path="/dashboard" element={<DashboardPage />} />

                          {/* ==== TRIPS ==== */}
                          <Route path="/trips" element={<TripManagementPage />} />
                          <Route path="/trips/active" element={<ActiveTripsPage />} />
                          <Route path="/trips/:id" element={<TripDetailsPage />} />
                          <Route path="/trips/timeline" element={<TripTimelinePage />} />
                          <Route path="/trips/planning" element={<RoutePlanningPage />} />
                          <Route path="/trips/optimization" element={<RouteOptimizationPage />} />
                          <Route path="/trips/load-planning" element={<LoadPlanningPage />} />
                          <Route path="/trips/calendar" element={<TripCalendarPage />} />
                          <Route path="/trips/add" element={<AddTripPage />} />
                          <Route path="/trips/workflow" element={<MainTripWorkflow />} />
                          <Route path="/trips/map" element={<FleetLocationMapPage />} />
                          <Route
                            path="/trips/active-dashboard"
                            element={<ActiveTrips displayCurrency="ZAR" />}
                          />
                          <Route
                            path="/trips/completed-dashboard"
                            element={<CompletedTrips displayCurrency="ZAR" />}
                          />
                          <Route path="/trips/flags" element={<FlagsInvestigations />} />
                          <Route path="/trips/dashboard" element={<TripDashboard />} />
                          <Route
                            path="/trips/driver-performance"
                            element={<GenericPlaceholderPage title="Driver Performance" />}
                          />
                          <Route
                            path="/trips/cost-analysis"
                            element={<GenericPlaceholderPage title="Trip Cost Analysis" />}
                          />
                          <Route
                            path="/trips/utilization"
                            element={<GenericPlaceholderPage title="Fleet Utilization" />}
                          />
                          <Route
                            path="/trips/confirmations"
                            element={<GenericPlaceholderPage title="Delivery Confirmations" />}
                          />
                          <Route
                            path="/trips/new-load-confirmation"
                            element={<CreateLoadConfirmationPage />}
                          />
                          <Route
                            path="/trips/templates"
                            element={<GenericPlaceholderPage title="Trip Templates" />}
                          />
                          <Route
                            path="/trips/reports"
                            element={<GenericPlaceholderPage title="Trip Reports" />}
                          />
                          <Route
                            path="/trips/maps"
                            element={<GenericPlaceholderPage title="Trip Maps" />}
                          />
                          <Route
                            path="/trips/fleet-location"
                            element={<GenericPlaceholderPage title="Fleet Location" />}
                          />
                          <Route
                            path="/trips/wialon-tracking"
                            element={<GenericPlaceholderPage title="Wialon Tracking" />}
                          />

                          {/* ==== INVOICES ==== */}
                          <Route path="/invoices" element={<InvoiceManagementPage />} />
                          <Route path="/invoices/templates" element={<InvoiceTemplatesPage />} />
                          <Route path="/invoices/dashboard" element={<InvoiceDashboard />} />
                          <Route path="/invoices/builder" element={<InvoiceBuilder />} />
                          <Route path="/invoices/approval" element={<InvoiceApprovalFlow />} />
                          <Route path="/invoices/tax-export" element={<TaxReportExport />} />
                          <Route path="/invoices/pending" element={<PendingInvoicesPage />} />
                          <Route path="/invoices/paid" element={<PaidInvoicesPage />} />
                          <Route path="/invoices/new" element={<CreateInvoicePage />} />
                          <Route path="/invoices/new-quote" element={<CreateQuotePage />} />
                          <Route
                            path="/invoices/batch-processing"
                            element={<GenericPlaceholderPage title="Batch Invoice Processing" />}
                          />
                          <Route
                            path="/invoices/reconciliation"
                            element={<GenericPlaceholderPage title="Invoice Reconciliation" />}
                          />
                          <Route
                            path="/invoices/archives"
                            element={<GenericPlaceholderPage title="Invoice Archives" />}
                          />
                          <Route
                            path="/invoices/reports"
                            element={<GenericPlaceholderPage title="Invoice Reports" />}
                          />

                          {/* ==== DIESEL ==== */}
                          <Route path="/diesel" element={<DieselManagementPage />} />
                          <Route path="/diesel/add-fuel" element={<AddFuelEntryPage />} />
                          <Route
                            path="/diesel/dashboard"
                            element={<DieselDashboardComponent />}
                          />
                          <Route path="/diesel/logs" element={<FuelLogs />} />
                          <Route path="/diesel/card-manager" element={<FuelCardManager />} />
                          <Route
                            path="/diesel/theft-detection"
                            element={<FuelTheftDetection />}
                          />
                          <Route
                            path="/diesel/carbon-footprint"
                            element={<CarbonFootprintCalc />}
                          />
                          <Route
                            path="/diesel/driver-behavior"
                            element={<DriverFuelBehavior />}
                          />
                          <Route path="/diesel/efficiency" element={<FuelEfficiencyReport />} />
                          <Route path="/diesel/budget" element={<BudgetPlanning />} />

                          {/* ==== CLIENTS ==== */}
                          <Route path="/clients" element={<ClientManagementPage />} />
                          <Route path="/clients/new" element={<AddNewCustomer />} />
                          <Route
                            path="/clients/active"
                            element={
                              <ActiveCustomers
                                clients={[]}
                                searchTerm=""
                                onSelectClient={() => {}}
                                onAddClient={() => {}}
                              />
                            }
                          />
                          <Route
                            path="/clients/reports"
                            element={
                              <CustomerReports
                                clients={[]}
                                trips={[]}
                                selectedClientId={null}
                                onSelectClient={() => {}}
                              />
                            }
                          />
                          <Route
                            path="/customers/retention"
                            element={
                              <RetentionMetrics
                                clients={[]}
                                selectedClientId={null}
                                onSelectClient={() => {}}
                              />
                            }
                          />
                          <Route path="/clients/relationships" element={<ClientNetworkMap />} />
                          <Route path="/clients/network" element={<ClientNetworkMap />} />

                          {/* ==== DRIVERS ==== */}
                          <Route path="/drivers" element={<DriverManagementPage />} />
                          <Route path="/drivers/new" element={<AddNewDriver />} />
                          <Route path="/drivers/profiles" element={<DriverProfiles />} />
                          <Route path="/drivers/profiles/:id" element={<DriverDetailsPage />} />
                          <Route path="/drivers/profiles/:id/edit" element={<EditDriver />} />
                          <Route path="/drivers/licenses" element={<LicenseManagement />} />
                          <Route path="/drivers/training" element={<TrainingRecords />} />
                          <Route path="/drivers/performance" element={<PerformanceAnalytics />} />
                          <Route path="/drivers/scheduling" element={<DriverScheduling />} />
                          <Route path="/drivers/hours" element={<HoursOfService />} />
                          <Route path="/drivers/violations" element={<DriverBehaviorPage />} />
                          <Route path="/drivers/rewards" element={<DriverRewards />} />
                          <Route path="/drivers/behavior" element={<DriverBehaviorPage />} />
                          <Route
                            path="/drivers/safety-scores"
                            element={<GenericPlaceholderPage title="Safety Scores" />}
                          />
                          <Route path="/drivers/dashboard" element={<DriverDashboard />} />

                          {/* ==== WORKSHOP ==== */}
                          <Route path="/workshop" element={<WorkshopPage />} />
                          <Route path="/workshop/vendors" element={<VendorPage />} />
                          <Route
                            path="/workshop/purchase-orders"
                            element={<PurchaseOrderPage />}
                          />
                          <Route
                            path="/workshop/stock-inventory"
                            element={<StockInventoryPage />}
                          />
                          {/* TODO: Implement FleetTable component */}
                          <Route path="/workshop/qr-generator" element={<QRGenerator />} />
                          <Route path="/workshop/qr-scanner" element={<QRScannerPage />} />
                          <Route path="/workshop/qr-generator" element={<QRGenerator />} />
                          <Route
                            path="/workshop/inspections"
                            element={<InspectionHistoryPage />}
                          />
                          <Route path="/workshop/job-cards" element={<JobCardManagement />} />
                          <Route path="/workshop/faults" element={<FaultTracking />} />
                          <Route path="/workshop/tyres" element={<TyreManagementPage />} />
                          <Route
                            path="/workshop/tyres/reference-data"
                            element={<TyreReferenceManagerPage />}
                          />
                          <Route
                            path="/workshop/parts-ordering"
                            element={<PartsOrderingPage />}
                          />
                          <Route
                            path="/workshop/vehicle-inspection"
                            element={<VehicleInspectionPage />}
                          />

                          {/* ==== TYRES ==== */}
                          <Route path="/tyres" element={<TyreManagementPage />} />
                          <Route path="/tyres/mobile" element={<TyreMobilePage />} />
                          <Route
                            path="/tyres/mobile/inspection/:tyreId?"
                            element={<TyreMobilePage mode="inspection" />}
                          />
                          <Route
                            path="/tyres/mobile/scanner"
                            element={<TyreMobilePage mode="scanner" />}
                          />
                          <Route path="/tyres/add" element={<AddNewTyrePage />} />
                          <Route
                            path="/tyres/reference-data"
                            element={<TyreReferenceManagerPage />}
                          />
                          <Route path="/tyres/fleet-map" element={<TyreFleetMap />} />
                          <Route path="/tyres/history" element={<TyreHistoryPage />} />
                          <Route path="/tyres/dashboard" element={<TyrePerformanceDashboard />} />

                          {/* ==== INVENTORY ==== */}
                          <Route path="/inventory" element={<InventoryPage />} />
                          <Route path="/inventory/dashboard" element={<InventoryDashboard />} />
                          <Route path="/inventory/stock" element={<PartsInventoryPage />} />
                          <Route path="/inventory/ordering" element={<PartsOrderingPage />} />
                          <Route path="/inventory/receive" element={<ReceivePartsPage />} />
                          <Route path="/inventory/reports" element={<InventoryReportsPage />} />

                          {/* === EXAMPLES ===
                    <Route path="/examples/clients" element={<ClientSelectionExample />} />

                    {/* === FALLBACK === */}
                          <Route path="*" element={<DashboardPage />} />

                          {/* Dynamic routes from config - commented out as file doesn't exist */}
                          {/* <AppRoutes /> */}
                        </Route>
                      </Routes>

                      <TripFormModal
                        isOpen={showTripForm}
                        onClose={() => setShowTripForm(false)}
                        editingTrip={editingTrip}
                      />
                      {/* Show Scan QR button only on mobile app */}
                      {typeof window !== "undefined" && (window as any).Capacitor && (
                        <div className="fixed bottom-6 right-6 z-50">
                          <ScanQRButton />
                        </div>
                      )}
                    </TyreReferenceDataProvider>
                  </WorkshopProvider>
                </DriverBehaviorProvider>
              </TripProvider>
            </TyreStoresProvider>
          </WialonProvider>
        </SyncProvider>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
