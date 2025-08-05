import React, { lazy, Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProviders } from "./components/AppProviders";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";
import "./styles/theme.css";
import { getEnvVar, initBrowserEnv } from "./utils/envUtils";
import { initializeConnectionMonitoring } from "./utils/firebaseConnectionHandler";

// Import Leaflet and MarkerCluster CSS here to avoid build errors from local CSS files
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";

// The core logic of a React application's entry point is to render the root component.
// All business logic, like API initialization, should be handled within React components or hooks.
// This refactored file separates concerns, making it cleaner and more predictable.

/**
 * Initializes and validates environment variables globally.
 * This is performed once before the app renders to ensure consistent access.
 */
function initializeEnv() {
  const envVars: Record<string, string> = {};
  const envKeys = [
    "VITE_WIALON_SESSION_TOKEN",
    "VITE_WIALON_LOGIN_URL",
    "VITE_GOOGLE_MAPS_API_KEY",
    "VITE_ENV_MODE",
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_USE_EMULATOR",
  ];

  envKeys.forEach((key) => {
    // We use a guard to prevent errors if import.meta.env is not available
    if (typeof import.meta !== "undefined" && import.meta.env) {
      envVars[key] = import.meta.env[key] as string;
    }
  });

  initBrowserEnv(envVars);
}

/**
 * Handles the asynchronous initialization of Firebase and other services.
 * This component will manage the loading state and render the main App once ready.
 */
const AppInitializer: React.FC = () => {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initServices() {
      try {
        // Dynamically import Firebase core services
        await import("./firebase/core");
        console.log("🔥 Firebase core services initialized successfully");

        // Initialize connection monitoring
        await initializeConnectionMonitoring();
        console.log("🔄 Firebase connection monitoring initialized");

        // Check for emulators in development mode
        const isDev =
          getEnvVar("MODE", "") === "development" || process.env.NODE_ENV === "development";
        if (isDev) {
          const { checkEmulatorsStatus } = await import("./firebaseEmulators");
          const status = await checkEmulatorsStatus();
          if (status.firestore && status.storage) {
            console.log("✅ Firebase emulators are running and accessible");
          } else {
            console.warn("⚠️ Firebase emulators not detected - using production configuration");
          }
        }

        setIsFirebaseInitialized(true);
      } catch (err) {
        console.error("❌ Failed to initialize application services:", err);
        setError("Failed to initialize core services. Please check the console for details.");
      }
    }

    initializeEnv();
    initServices();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-red-500">
        <div className="p-8 border border-red-300 rounded-lg shadow-lg">
          <p className="text-lg font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!isFirebaseInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        <p className="text-lg">Initializing application...</p>
      </div>
    );
  }

  // AntDesignProvider is now lazy-loaded, so we wrap it in Suspense
  const AntDesignProvider = lazy(() => import("./components/ui/AntDesignProvider"));
  const isDev = getEnvVar("MODE", "") === "development" || process.env.NODE_ENV === "development";

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading UI components...</div>}>
          <AntDesignProvider>
            <AppProviders>
              {isDev && <div className="dev-indicator">Development Mode</div>}
              <App />
            </AppProviders>
          </AntDesignProvider>
        </Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// Render the AppInitializer component as the entry point
ReactDOM.createRoot(document.getElementById("root")!).render(<AppInitializer />);
