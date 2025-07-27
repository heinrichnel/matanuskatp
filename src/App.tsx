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
import { initializeConnectionMonitoring } from "./utils/firebaseConnectionHandler";
import { startNetworkMonitoring } from "./utils/networkDetection";
import { initOfflineCache } from "./utils/offlineCache";
import { syncOfflineOperations } from "./utils/offlineOperations";

// Import AppRoutes for comprehensive routing structure
import { AppRoutes } from "./AppRoutes";

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

// === TRIPS ===

// === INVOICES ===

// === DIESEL ===

// === CLIENTS ===

// === DRIVERS ===

// === EXAMPLES ===

// === COMPLIANCE ===

// === ANALYTICS ===

// === WORKSHOP ===

// === TYRES ===
// === INVENTORY ===
// === WIALON ===
// === REPORTS & OTHER ===
import { ScanQRButton } from "./components/ScanQRButton";
import UIConnector from "./components/UIConnector";
// UI Components
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
    // Initialize Firebase connection monitoring
    initializeConnectionMonitoring().catch((error) => {
      console.error("Failed to initialize Firebase connection monitoring:", error);
      setConnectionError(new Error(`Failed to initialize Firebase connection: ${error.message}`));
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
                      {/* Enhanced FirestoreConnectionError that listens for connection events */}
                      <div className="fixed top-0 left-0 right-0 z-50 p-4">
                        {/* This instance listens for connection events and custom errors */}
                        <FirestoreConnectionError />

                        {/* Also show the explicit error if one is set at app level */}
                        {connectionError && <FirestoreConnectionError error={connectionError} />}
                      </div>

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
                      {/* Use the comprehensive AppRoutes component for better navigation structure */}
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
                          <Route element={<AppRoutes />} path="*" />
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
