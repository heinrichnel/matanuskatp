import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSyncContext } from "../../context/SyncContext";

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

/**
 * Main Navigation Component
 *
 * Provides consistent navigation across the application,
 * connecting all major features and forms.
 */
const Navigation: React.FC = () => {
  const location = useLocation();
  const syncContext = useSyncContext();

  const navigationItems: NavigationItem[] = [
    // ... your nav items unchanged ...
    // For brevity, not pasting SVGs again
  ];

  return (
    <nav className="bg-gray-800 text-white w-full z-40 shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between py-3">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold flex items-center">
              {/* logo svg here */}
              <span className="ml-2">Fleet Manager</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Connection status indicator */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                syncContext.isOnline ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"
              }`}
            >
              {syncContext.isOnline ? "Online" : "Offline"}
            </div>

            {/* User profile button */}
            <button
              className="p-3 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              style={{
                minWidth: "44px",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* profile svg here */}
            </button>
            {/* Settings button */}
            <button
              className="p-3 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              style={{
                minWidth: "44px",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* settings svg here */}
            </button>
          </div>
        </div>
      </div>
      {/* Main navigation menu */}
      <div className="bg-gray-700 w-full overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 whitespace-nowrap ${
                  location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
