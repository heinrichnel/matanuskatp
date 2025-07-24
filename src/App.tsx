/**
 * Main App component that handles routing and application state
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';

// Context Providers
import { AppProvider } from './context/AppContext';
import { SyncProvider } from './context/SyncContext';
import { TyreStoresProvider } from './context/TyreStoresContext';
import { TripProvider } from './context/TripContext';
import { DriverBehaviorProvider } from './context/DriverBehaviorContext';
import { WorkshopProvider } from './context/WorkshopContext';

// Error Handling
import ErrorBoundary from './components/ErrorBoundary';
import FirestoreConnectionError from './components/ui/FirestoreConnectionError';
import ConnectionStatusIndicator from './components/ui/ConnectionStatusIndicator';
import OfflineBanner from './components/ui/OfflineBanner';

// Offline & Network Support
import { initOfflineCache } from './utils/offlineCache';
import { startNetworkMonitoring } from './utils/networkDetection';
import { syncOfflineOperations } from './utils/offlineOperations';

// Error Handling
import { 
  registerErrorHandler, 
  handleError, 
  logError, 
  ErrorCategory,
  ErrorSeverity
} from './utils/errorHandling';

// Layout
import Layout from './components/layout/Layout';

// Core Components
import TripFormModal from './components/Models/Trips/TripFormModal';
import DashboardPage from './pages/DashboardPage';

// === TRIPS ===
import TripManagementPage from './pages/TripManagementPage';
import ActiveTripsPage from './pages/ActiveTripsPage';
import TripTimelinePage from './pages/trips/TripTimelinePage';
import RoutePlanningPage from './pages/RoutePlanningPage';
import RouteOptimizationPage from './pages/RouteOptimizationPage';
import LoadPlanningPage from './pages/LoadPlanningPage';
import TripCalendarPage from './pages/TripCalendarPage';
import AddTripPage from './pages/AddTripPage';
import FleetLocationMapPage from './components/Map/pages/FleetLocationMapPage';
import ActiveTrips from './components/TripManagement/ActiveTrips';
import CompletedTrips from './pages/CompletedTrips';
import FlagsInvestigations from './pages/FlagsInvestigationsPage';
import TripDashboard from './pages/TripDashboard';
import CreateLoadConfirmationPage from './pages/trips/CreateLoadConfirmationPage';

// === INVOICES ===
import InvoiceManagementPage from './pages/invoices/InvoiceManagementPage';
import InvoiceTemplatesPage from './pages/invoices/InvoiceTemplatesPage';
import InvoiceDashboard from './pages/invoices/InvoiceDashboard';
import InvoiceBuilder from './pages/invoices/InvoiceBuilder';
import InvoiceApprovalFlow from './pages/invoices/InvoiceApprovalFlow';
import TaxReportExport from './pages/invoices/TaxReportExport';
import PendingInvoicesPage from './pages/invoices/PendingInvoicesPage';
import PaidInvoicesPage from './pages/invoices/PaidInvoicesPage';
import CreateInvoicePage from './pages/invoices/CreateInvoicePage';
import CreateQuotePage from './pages/invoices/CreateQuotePage';

// === DIESEL ===
import DieselManagementPage from './pages/diesel/DieselManagementPage';
import AddFuelEntryPage from './pages/diesel/AddFuelEntryPage';
import DieselDashboardComponent from './pages/diesel/DieselDashboardComponent';
import FuelLogs from './pages/diesel/FuelLogs';
import FuelCardManager from './pages/diesel/FuelCardManager';
import FuelTheftDetection from './pages/diesel/FuelTheftDetection';
import CarbonFootprintCalc from './pages/diesel/CarbonFootprintCalc';
import DriverFuelBehavior from './pages/diesel/DriverFuelBehavior';
import FuelEfficiencyReport from './pages/diesel/FuelEfficiencyReport';
import BudgetPlanning from './pages/diesel/BudgetPlanning';
import FuelStations from './pages/diesel/FuelStations';
import CostAnalysis from './pages/diesel/CostAnalysis';

// === CLIENTS ===
import ClientManagementPage from './pages/clients/ClientManagementPage';
import AddNewCustomer from './pages/clients/AddNewCustomer';
import ActiveCustomers from './pages/clients/ActiveCustomers';
import CustomerReports from './pages/clients/CustomerReports';
import RetentionMetrics from './pages/clients/RetentionMetrics';
import ClientNetworkMap from './pages/clients/ClientNetworkMap';

// === DRIVERS ===
import DriverManagementPage from './pages/drivers/DriverManagementPage';
import AddNewDriver from './pages/drivers/AddNewDriver';
import DriverProfiles from './pages/drivers/DriverProfiles';
import DriverDetails from './pages/drivers/DriverDetails';
import DriverDetailsPage from './pages/drivers/DriverDetailsPage';
import EditDriver from './pages/drivers/EditDriver';
import LicenseManagement from './pages/drivers/LicenseManagement';
import TrainingRecords from './pages/drivers/TrainingRecords';
import PerformanceAnalytics from './pages/drivers/PerformanceAnalytics';
import DriverScheduling from './pages/drivers/DriverScheduling';
import HoursOfService from './pages/drivers/HoursOfService';
import DriverViolations from './pages/drivers/DriverViolations';
import DriverRewards from './pages/drivers/DriverRewards';
import DriverBehaviorPage from './pages/drivers/DriverBehaviorPage';
import SafetyScores from './pages/drivers/SafetyScores';
import DriverDashboard from './pages/drivers/DriverDashboard';

// === EXAMPLES ===
import ClientSelectionExample from './pages/examples/ClientSelectionExample';

// === COMPLIANCE ===
import ComplianceManagementPage from './pages/compliance/ComplianceManagementPage';
import AuditManagement from './pages/compliance/AuditManagement';
import ViolationTracking from './pages/compliance/ViolationTracking';
import InsuranceManagement from './pages/compliance/InsuranceManagement';
import ComplianceDashboard from './pages/compliance/ComplianceDashboard';

// === ANALYTICS ===
import FleetAnalyticsPage from './pages/analytics/FleetAnalyticsPage';
import CreateCustomReport from './pages/analytics/CreateCustomReport';
import AnalyticsInsights from './pages/analytics/AnalyticsInsights';
import VehiclePerformance from './pages/analytics/VehiclePerformance';
import AnalyticsDashboard from './pages/analytics/AnalyticsDashboard';

    // === WORKSHOP ===
import WorkshopPage from './pages/workshop/WorkshopPage';
import QRGenerator from './pages/workshop/QRGenerator';
import QRScannerPage from './pages/workshop/QRScannerPage';
import QRCodeBatchGenerator from './components/WorkshopManagement/QRCodeBatchGenerator';
import DriverInspectionForm from './pages/workshop/DriverInspectionForm';
import InspectionHistory from './pages/workshop/InspectionHistory';
import InspectionHistoryPage from './pages/workshop/inspections';
import InspectionForm from './components/workshop/InspectionForm';
import InspectionManagement from './components/workshop/InspectionManagement';
import InspectionTemplatesPage from './pages/workshop/InspectionTemplatesPage';
import JobCardManagement from './pages/workshop/JobCardManagement';
import JobCardKanbanBoard from './components/workshop/JobCardKanbanBoard';
import JobCardTemplatesPage from './pages/workshop/JobCardTemplatesPage';
import FaultTracking from './pages/workshop/FaultTracking';
import TyreManagement from './pages/workshop/TyreManagement';
import TyreStoresPage from './pages/tyres/TyreStoresPage';
import TyreFleetMap from './pages/tyres/TyreFleetMap';
import TyreHistoryPage from './pages/tyres/TyreHistoryPage';
import TyrePerformanceDashboard from './pages/tyres/TyrePerformanceDashboard';
import TyreAddPage from './pages/tyres/AddNewTyre';
import TyreManagementPage from './pages/tyres/TyreManagementPage';
import StockAlertsPage from './pages/inventory/StockAlertsPage';
import PartsOrderingPage from './pages/inventory/PartsOrderingPage';
import VehicleInspectionPage from './pages/workshop/vehicle-inspection';
import PurchaseOrderTracker from './pages/inventory/PurchaseOrderTracker';
import VendorScorecard from './pages/inventory/VendorScorecard';
import InventoryDashboard from './pages/inventory/InventoryDashboard';
import StockManager from './components/workshop/StockManager';
import IndirectCostBreakdown from './pages/workshop/IndirectCostBreakdown';
import WorkshopAnalyticsComp from './pages/workshop/WorkshopAnalytics';
import WorkshopReportsPage from './pages/workshop/WorkshopReportsPage';
import WorkshopCostReportsPage from './pages/workshop/WorkshopCostReportsPage';
import VendorPage from './pages/workshop/VendorPage';
import StockInventoryPage from './pages/workshop/StockInventoryPage';
import PurchaseOrderPage from './pages/workshop/PurchaseOrderPage';
import TripDetailsPage from './pages/trips/TripDetailsPage';

// === TYRES ===
import TyreInspection from './pages/tyres/inspection';
import TyreInventory from './pages/tyres/inventory';
import TyreReports from './pages/tyres/reports';
import AddNewTyrePage from './pages/tyres/add-new-tyre';

// === INVENTORY ===
import InventoryPage from './pages/inventory/InventoryPage';
import PartsInventoryPage from './pages/inventory/PartsInventoryPage';
import ReceivePartsPage from './pages/inventory/ReceivePartsPage';
import InventoryReportsPage from './pages/inventory/InventoryReportsPage';

// === WIALON ===
import WialonDashboard from './pages/wialon/WialonDashboard';
import WialonUnitsPage from './pages/wialon/WialonUnitsPage';
import WialonConfigPage from './pages/wialon/WialonConfigPage';

// === REPORTS & OTHER ===
import ActionLog from './pages/reports/ActionLog';
import CurrencyFleetReport from './pages/reports/CurrencyFleetReport';
import InvoiceAgingDashboard from './pages/reports/InvoiceAgingDashboard';
import CustomerRetentionDashboard from './pages/Performance/CustomerRetentionDashboard';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import MapTestPage from './pages/Map/MapTestPage';
import MapsView from './pages/Map/MapsView';
import UIConnector from './components/UIConnector';
import { ScanQRButton } from "./components/ScanQRButton";

// UI Components
import { GenericPlaceholderPage } from './components/ui';

// App.tsx - Simplified version to fix build errors
const App: React.FC = () => {
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [editingTrip, setEditingTrip] = useState<any>();
  const [showTripForm, setShowTripForm] = useState(false);

  useEffect(() => {
    console.log('App is running');
    
    // Initialize error handlers
    const unregisterErrorHandler = registerErrorHandler((error) => {
      // Add application-wide error handling logic
      if (error.severity === ErrorSeverity.FATAL) {
        setConnectionError(error.originalError);
      }
      
      // Send errors to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // Example: send to an analytics service
        // analyticsService.trackError(error);
      }
    });
    
    // Initialize offline cache with error handling
    handleError(
      async () => await initOfflineCache(),
      {
        category: ErrorCategory.DATABASE,
        context: { component: 'App', operation: 'initOfflineCache' },
        maxRetries: 3
      }
    ).catch(error => {
      setConnectionError(new Error(`Failed to initialize offline cache: ${error.message}`));
    });
    
    // Start network monitoring
    startNetworkMonitoring(30000); // Check every 30 seconds
    
    // Sync offline operations when online with enhanced error handling
    const handleOnline = async () => {
      try {
        const result = await handleError(
          async () => await syncOfflineOperations(),
          {
            category: ErrorCategory.NETWORK,
            context: { component: 'App', operation: 'syncOfflineOperations' },
            maxRetries: 3
          }
        );
        
        if (result) {
          console.log(`Synced offline operations: ${result.success} succeeded, ${result.failed} failed`);
        }
      } catch (error) {
        // This will be handled by the error handler
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    // Setup global error handling for uncaught errors
    const handleGlobalError = (event: ErrorEvent) => {
      event.preventDefault();
      logError(event.error || event.message, {
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.ERROR,
        context: { source: 'window.onerror' }
      });
    };

    window.addEventListener('error', handleGlobalError);
    
    // Setup global promise rejection handling
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      logError(event.reason || 'Unhandled Promise Rejection', {
        category: ErrorCategory.UNKNOWN,
        severity: ErrorSeverity.ERROR,
        context: { source: 'unhandledrejection' }
      });
    };
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      unregisterErrorHandler();
    };
  }, []);

  // Conditional UI connector rendering
  const renderUIConnector = () => {
    if (process.env.NODE_ENV !== 'production') {
      return <UIConnector />;
    }
    return null;
  };

  return (
    <ErrorBoundary>
      <AppProvider>
        <SyncProvider>
          <TyreStoresProvider>
            <TripProvider>
              <DriverBehaviorProvider>
                <WorkshopProvider>
                {connectionError ? (
                  <div className="fixed top-0 left-0 right-0 z-50 p-4">
                    <FirestoreConnectionError error={connectionError} />
                  </div>
                ) : null}
                
                {/* Connection status components */}
                <OfflineBanner />
                <ConnectionStatusIndicator showText={true} className="fixed bottom-4 right-4 z-40" />
                
                {renderUIConnector()}
                
                <Router>
                  <Routes>
                    <Route path="/*" element={
                      <Layout
                        setShowTripForm={setShowTripForm}
                        setEditingTrip={setEditingTrip}
                      />
                    }>
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
                      <Route path="/trips/map" element={<FleetLocationMapPage />} />
                      <Route path="/trips/active-dashboard" element={<ActiveTrips />} />
                      <Route path="/trips/completed-dashboard" element={<CompletedTrips />} />
                      <Route path="/trips/flags" element={<FlagsInvestigations />} />
                      <Route path="/trips/dashboard" element={<TripDashboard />} />
                      <Route path="/trips/driver-performance" element={<GenericPlaceholderPage title="Driver Performance" />} />
                      <Route path="/trips/cost-analysis" element={<GenericPlaceholderPage title="Trip Cost Analysis" />} />
                      <Route path="/trips/utilization" element={<GenericPlaceholderPage title="Fleet Utilization" />} />
                      <Route path="/trips/confirmations" element={<GenericPlaceholderPage title="Delivery Confirmations" />} />
                      <Route path="/trips/new-load-confirmation" element={<CreateLoadConfirmationPage />} />
                      <Route path="/trips/templates" element={<GenericPlaceholderPage title="Trip Templates" />} />
                      <Route path="/trips/reports" element={<GenericPlaceholderPage title="Trip Reports" />} />
                      <Route path="/trips/maps" element={<GenericPlaceholderPage title="Trip Maps" />} />
                      <Route path="/trips/fleet-location" element={<GenericPlaceholderPage title="Fleet Location" />} />
                      <Route path="/trips/wialon-tracking" element={<GenericPlaceholderPage title="Wialon Tracking" />} />

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
                      <Route path="/invoices/batch-processing" element={<GenericPlaceholderPage title="Batch Invoice Processing" />} />
                      <Route path="/invoices/reconciliation" element={<GenericPlaceholderPage title="Invoice Reconciliation" />} />
                      <Route path="/invoices/archives" element={<GenericPlaceholderPage title="Invoice Archives" />} />
                      <Route path="/invoices/reports" element={<GenericPlaceholderPage title="Invoice Reports" />} />

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
                      <Route path="/diesel/budget" element={<BudgetPlanning />} />

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
                      <Route path="/drivers/safety-scores" element={<GenericPlaceholderPage title="Safety Scores" />} />
                      <Route path="/drivers/dashboard" element={<DriverDashboard />} />

                      {/* === WORKSHOP === */}
                      <Route path="/workshop" element={<WorkshopPage />} />
                      <Route path="/workshop/vendors" element={<VendorPage />} />
                      <Route path="/workshop/purchase-orders" element={<PurchaseOrderPage />} />
                      <Route path="/workshop/stock-inventory" element={<StockInventoryPage />} />
                      {/* TODO: Implement FleetTable component */}
                      <Route path="/workshop/qr-generator" element={<QRGenerator />} />
                      <Route path="/workshop/qr-scanner" element={<QRScannerPage />} />
                      <Route path="/workshop/qr-generator" element={<QRGenerator />} />
                      <Route path="/workshop/inspections" element={<InspectionHistoryPage />} />
                      <Route path="/workshop/job-cards" element={<JobCardManagement />} />
                      <Route path="/workshop/faults" element={<FaultTracking />} />
                      <Route path="/workshop/tyres" element={<TyreManagement />} />
                      <Route path="/workshop/parts-ordering" element={<PartsOrderingPage />} />
                      <Route path="/workshop/vehicle-inspection" element={<VehicleInspectionPage />} />

                      {/* === EXAMPLES ===
                      <Route path="/examples/clients" element={<ClientSelectionExample />} />

                      {/* === FALLBACK === */}
                      <Route path="*" element={<DashboardPage />} />

                      {/* Dynamic routes from config */}
                      <AppRoutes />
                    </Route>
                  </Routes>
                </Router>
                
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
                </WorkshopProvider>
              </DriverBehaviorProvider>
            </TripProvider>
          </TyreStoresProvider>
        </SyncProvider>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
