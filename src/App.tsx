import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context Providers
import { AppProvider } from './context/AppContext';
import { SyncProvider } from './context/SyncContext';
import { TyreStoresProvider } from './context/TyreStoresContext';
import { TripProvider } from './context/TripContext';
import { DriverBehaviorProvider } from './context/DriverBehaviorContext';

// Error Handling
import ErrorBoundary from './components/ErrorBoundary';
import FirestoreConnectionError from './components/common/FirestoreConnectionError';

// Layout
import Layout from './components/layout/Layout';

// Core Components
import TripFormModal from './components/trips/TripFormModal';
import DashboardPage from './pages/DashboardPage';

// === TRIPS ===
import TripManagementPage from './pages/trips/TripManagementPage';
import ActiveTripsPage from './pages/trips/ActiveTripsPage';
import TripTimelinePage from './pages/trips/TripTimelinePage';
import RoutePlanningPage from './pages/trips/RoutePlanningPage';
import RouteOptimizationPage from './pages/trips/RouteOptimizationPage';
import LoadPlanningPage from './pages/trips/LoadPlanningPage';
import TripCalendarPage from './pages/trips/TripCalendarPage';
import AddTripPage from './pages/trips/AddTripPage';
import FleetLocationMapPage from './pages/trips/FleetLocationMapPage';
import ActiveTrips from './pages/trips/ActiveTrips';
import CompletedTrips from './pages/trips/CompletedTrips';
import FlagsInvestigations from './pages/trips/FlagsInvestigations';
import TripDashboard from './pages/trips/TripDashboard';

// === INVOICES ===
import InvoiceManagementPage from './pages/invoices/InvoiceManagementPage';
import InvoiceTemplatesPage from './pages/invoices/InvoiceTemplatesPage';
import InvoiceDashboard from './pages/invoices/InvoiceDashboard';
import InvoiceBuilder from './pages/invoices/InvoiceBuilder';
import InvoiceApprovalFlow from './pages/invoices/InvoiceApprovalFlow';
import TaxReportExport from './pages/invoices/TaxReportExport';
import PendingInvoicesPage from './pages/invoices/PendingInvoicesPage';
import PaidInvoicesPage from './pages/invoices/PaidInvoicesPage';

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
import EditDriver from './pages/drivers/EditDriver';
import LicenseManagement from './pages/drivers/LicenseManagement';
import TrainingRecords from './pages/drivers/TrainingRecords';
import PerformanceAnalytics from './pages/drivers/PerformanceAnalytics';
import DriverScheduling from './pages/drivers/DriverScheduling';
import HoursOfService from './pages/drivers/HoursOfService';
import DriverViolations from './pages/drivers/DriverViolations';
import DriverRewards from './pages/drivers/DriverRewards';
import DriverBehaviorEvents from './pages/drivers/DriverBehaviorPage';
import SafetyScores from './pages/drivers/SafetyScores';
import DriverDashboard from './pages/drivers/DriverDashboard';

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
import FleetTable from './pages/workshop/FleetTable';
import QRGenerator from './pages/workshop/QRGenerator';
import QRCodeBatchGenerator from './pages/workshop/QRCodeBatchGenerator';
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

const App: React.FC = () => {
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const [editingTrip, setEditingTrip] = useState<any>();
  const [showTripForm, setShowTripForm] = useState(false);

  useEffect(() => {
    console.log('App is running');
  }, []);

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
                          setShowTripForm={setShowTripForm}
                          setEditingTrip={setEditingTrip}
                        />
                      }
                    >
                      {/* === Al jou roetes kom hier === */}
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      {/* Voeg hier al bogenoemde roetes in soos jy reeds het */}
                      {/* Ek het dit reeds in jou vorige kopie van `App.tsx` ingesluit */}
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
