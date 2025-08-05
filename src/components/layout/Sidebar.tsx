import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Users, X as CloseIcon } from "lucide-react";
import { SidebarItem, sidebarConfig } from "../../sidebarConfig";
import ConnectionStatusIndicator from "../ui/ConnectionStatusIndicator";
import SyncIndicator from "../ui/SyncIndicator";

interface SidebarProps {
  currentView: string;
  onNavigate: (route: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpand = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderItems = (items: SidebarItem[], level = 0) => (
    <ul className={`${level > 0 ? "pl-4" : ""} space-y-1`}>
      {items.map((item) => {
        const isActive =
          item.path &&
          (currentView === item.path ||
            (item.path.includes(":") && currentView.startsWith(item.path.split(":")[0])));
        const isParent = !!item.children && item.children.length > 0;
        const isExpanded =
          expanded[item.id] ||
          (isParent &&
            item.path &&
            (currentView.startsWith(item.path) ||
              (item.children ?? []).some((child) => currentView.startsWith(child.path ?? ""))));
        return (
          <li key={item.id} className="mb-1">
            {/* Parent (Collapsible) */}
            {isParent ? (
              <>
                <button
                  className={`w-full flex items-center justify-between gap-3 px-6 py-2 rounded-lg transition-colors text-left ${
                    isExpanded
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={(e) => toggleExpand(item.id, e)}
                  aria-expanded={!!isExpanded}
                  aria-controls={`submenu-${item.id}`}
                >
                  <div className="flex items-center gap-3 flex-grow">
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                {isExpanded && item.children && (
                  <div id={`submenu-${item.id}`}>{renderItems(item.children, level + 1)}</div>
                )}
              </>
            ) : (
              // Leaf
              <button
                className={`w-full flex items-center gap-3 px-6 py-2 rounded-lg transition-colors text-left ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => item.path && onNavigate(item.path)}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span>{item.label}</span>
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {isOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 border-r shadow-lg flex flex-col z-40 transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Mobile close button */}
        <button
          className="md:hidden absolute top-4 right-4 p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <CloseIcon size={20} />
        </button>
        {/* Logo */}
        <div className="flex items-center justify-center px-6 py-4 border-b bg-white dark:bg-gray-900">
          <h1 className="font-bold text-lg tracking-wider text-black dark:text-white">MATANUSKA</h1>
        </div>
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 max-h-[calc(100vh-160px)]">
          {renderItems(sidebarConfig)}
        </nav>
        {/* Status & User */}
        <div className="px-6 py-4 border-t">
          <div className="flex flex-col gap-2 mb-3">
            <ConnectionStatusIndicator />
            <SyncIndicator className="mt-1" />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-200">User</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
