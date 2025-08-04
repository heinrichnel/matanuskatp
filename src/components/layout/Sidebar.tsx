import { ChevronDown, ChevronRight, Users, X } from "lucide-react";
import React, { FC, useState } from "react";
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

  const handleNavigate = (route: string) => {
    onNavigate(route);
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

  // Fix for window.innerWidth on server (SSR/Next.js)
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  const isDesktop = isClient && window.innerWidth >= 768;

  const renderSidebarItems = (items: SidebarItem[], isChild: boolean = false) => {
    return (
      <ul className={`space-y-1 ${isChild ? "mt-1 pl-4" : ""}`}>
        {items.map((item) => {
          const isActive = item.path
            ? currentPath === item.path ||
              (item.path.includes(":") && currentPath.startsWith(item.path.split(":")[0]))
            : false;
          const isParentActive = item.children && item.path && currentPath.startsWith(item.path);

          if (item.children) {
            return (
              <li key={item.id} className="mb-2">
                <button
                  className={`w-full flex items-center justify-between gap-3 px-6 py-2 rounded-lg transition-colors text-left ${
                    expandedItems[item.id] || isParentActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => toggleExpand(item.id)}
                  aria-expanded={!!expandedItems[item.id]}
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
                    {expandedItems[item.id] ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </span>
                </button>
                {isOpen && expandedItems[item.id] && (
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
    <aside
      className={`fixed left-0 top-0 h-screen bg-gray-100 border-r shadow flex flex-col z-30 transition-all duration-300 ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64 md:translate-x-0 md:w-16"}`}
    >
      {/* Close button (visible on mobile) */}
      <button
        className="md:hidden absolute top-4 right-4 p-3 rounded-full hover:bg-gray-200"
        onClick={onClose}
        aria-label="Close sidebar"
        style={{
          minWidth: "44px",
          minHeight: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <X size={24} />
      </button>
      <div className="flex items-center justify-center px-6 py-4 border-b bg-gray-100">
        {isOpen || isDesktop ? (
          <h1 className="font-bold text-black text-lg">MATANUSKA TRANSPORT</h1>
        ) : (
          <h1 className="font-bold text-black text-lg">MT</h1>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto py-2 max-h-[calc(100vh-160px)]">
        {renderSidebarItems(sidebarConfig)}
      </nav>
      <div className={`px-6 py-4 border-t ${isOpen ? "" : "hidden md:block"}`}>
        <div className="flex flex-col space-y-2 mb-3">
          <ConnectionStatusIndicator showText={isOpen} />
          <SyncIndicator showText={isOpen} className="mt-1" />
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Users className="w-5 h-5 text-gray-400" />
          {isOpen && <span className="text-sm text-gray-700">User</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
