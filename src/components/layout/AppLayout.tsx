import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SyncProvider } from "../../context/SyncContext";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

/**
 * Application Layout Component
 *
 * Provides consistent layout with navigation and footer
 * for all application pages. Wraps content in SyncContext
 * for online/offline functionality.
 *
 * Sidebar navigation is included, responsive for desktop and mobile.
 */
const AppLayout: React.FC = () => {
  // Routing and sidebar state
  const location = useLocation();
  const navigate = useNavigate();
  // Sidebar open state (mobile responsive)
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(true);

  return (
    <SyncProvider>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar navigation */}
        <Sidebar
          currentView={location.pathname}
          onNavigate={navigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content and footer */}
        <div className="flex flex-col flex-1 min-h-screen">
          {/* Optional top bar (can add a mobile hamburger here to open sidebar) */}
          <header className="md:hidden flex items-center justify-between px-4 py-2 bg-gray-100 border-b dark:bg-gray-900">
            <button
              className="p-2 rounded-md text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
            >
              {/* Hamburger icon */}
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-menu"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div className="font-bold text-lg">Matanuska Transport</div>
            <div className="w-6" /> {/* For spacing */}
          </header>

          <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SyncProvider>
  );
};

export default AppLayout;
