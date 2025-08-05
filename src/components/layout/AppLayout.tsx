// src/components/layout/AppLayout.tsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SyncProvider } from "../../context/SyncContext";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

/**
 * Main Application Layout
 *
 * Provides responsive sidebar, mobile header, and wraps all content in SyncProvider.
 */
const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SyncProvider>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        <Sidebar
          currentView={location.pathname}
          onNavigate={navigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area */}
        <div className="flex flex-col flex-1 min-h-screen">
          {/* Mobile header */}
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
