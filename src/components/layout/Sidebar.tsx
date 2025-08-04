import { ChevronDown, ChevronRight, Users, X } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { SidebarItem, sidebarConfig } from "../../sidebarConfig";
import ConnectionStatusIndicator from "../ui/ConnectionStatusIndicator";
import SyncIndicator from "../ui/SyncIndicator";

interface SidebarProps {
  currentView: string;
  onNavigate: (route: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const currentPath = currentView;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check initial window size on the client side
    setIsDesktop(window.innerWidth >= 768);

    const handleResize = () => {
      const newIsDesktop = window.innerWidth >= 768;
      setIsDesktop(newIsDesktop);
      // Close sidebar on mobile when window resizes and is open
      if (!newIsDesktop && isOpen) {
        onClose();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  const handleNavigate = (route: string) => {
    onNavigate(route);
    // Close sidebar on mobile after navigation
    if (!isDesktop) {
      onClose();
    }
  };

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderSidebarItems = (items: SidebarItem[], isChild: boolean = false) => {
    return (
      <ul className={`space-y-1 ${isChild ? "mt-1 pl-4" : ""}`}>
        {items.map((item) => {
          const isActive = item.path
            ? currentPath === item.path ||
              (item.path.includes(":") && currentPath.startsWith(item.path.split(":")[0]))
            : false;

          const isParentActive = item.children && item.path && currentPath.startsWith(item.path);
          const isExpanded = expandedItems[item.id] || isParentActive;

          if (item.children) {
            return (
              <li key={item.id} className="mb-2">
                <button
                  className={`w-full flex items-center justify-between gap-3 px-6 py-2 rounded-lg transition-colors text-left ${
                    isExpanded
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => toggleExpand(item.id)}
                  aria-expanded={Boolean(isExpanded)}
                  aria-controls={`submenu-${item.id}`}
                >
                  <div className="flex items-center gap-3 flex-grow text-left">
                    {item.icon && (
                      <item.icon
                        className="w-5 h-5 flex-shrink-0"
                        style={{ width: "20px", height: "20px" }}
                      />
                    )}
                    <span id={`heading-${item.id}`}>{item.label}</span>
                  </div>
                  <span
                    className="p-3 rounded-md"
                    aria-hidden="true"
                    style={{
                      minWidth: "44px",
                      minHeight: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </span>
                </button>
                {isExpanded && (
                  <div
                    id={`submenu-${item.id}`}
                    role="region"
                    aria-labelledby={`heading-${item.id}`}
                  >
                    {renderSidebarItems(item.children, true)}
                  </div>
                )}
              </li>
            );
          }

          return (
            <li key={item.id}>
              <button
                className={`w-full flex items-center gap-3 ${isChild ? "px-8" : "px-6"} py-2 rounded-lg transition-colors text-left ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => item.path && handleNavigate(item.path)}
              >
                {item.icon && (
                  <item.icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{ width: "20px", height: "20px" }}
                  />
                )}
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <>
      {/* Backdrop overlay (mobile only) */}
      {isOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed md:static h-screen md:h-auto bg-white dark:bg-gray-800 border-r shadow-lg flex flex-col z-40 transition-all duration-300 w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Close button (visible on mobile) */}
        <button
          className="md:hidden absolute top-4 right-4 p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        {/* Logo area hidden on mobile since we have it in the header */}
        <div className="hidden md:flex items-center px-6 py-4 border-b">
          <h1 className="font-bold text-lg">MATANUSKA</h1>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 overflow-y-auto py-4">{renderSidebarItems(sidebarConfig)}</nav>

        {/* User and Status Area */}
        <div className="px-6 py-4 border-t flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <ConnectionStatusIndicator />
            <span>Connection Status</span>
          </div>
          <div className="flex items-center gap-3">
            <SyncIndicator />
            <span>Sync Status</span>
          </div>
          {/* User details can go here */}
          <div className="flex items-center gap-3 mt-2">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-sm">User</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
