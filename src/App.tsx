import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import { SyncProvider } from "./context/SyncContext";
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/layout/Layout';

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

// Main App component with Router implementation
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <SyncProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/ytd-kpis" replace />} />
                <Route path="ytd-kpis" element={<YearToDateKPIs />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="active-trips" element={<ActiveTrips />} />
                <Route path="completed-trips" element={<CompletedTrips />} />
                <Route path="flags" element={<FlagsInvestigations />} />
                <Route path="reports" element={<CurrencyFleetReport />} />
                <Route path="invoice-aging" element={<InvoiceAgingDashboard />} />
                <Route path="customer-retention" element={<CustomerRetentionDashboard />} />
                <Route path="missed-loads" element={<MissedLoadsTracker />} />
                <Route path="diesel-dashboard" element={<DieselDashboard />} />
                <Route path="driver-behavior" element={<DriverBehaviorPage />} />
                <Route path="action-log" element={<ActionLog />} />
                <Route path="audit-log" element={<AuditLogPage />} />
                <Route path="*" element={<Navigate to="/ytd-kpis" replace />} />
              </Route>
            </Routes>
          </Router>
        </SyncProvider>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;