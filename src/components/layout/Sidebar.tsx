import { ChevronDown, ChevronRight, Users } from "lucide-react";
import React, { FC, useState } from "react";
import { sidebarConfig, SidebarItem } from "../../config/sidebarConfig";
import ConnectionStatusIndicator from "../ui/ConnectionStatusIndicator";
import SyncIndicator from "../ui/SyncIndicator";

const Truck = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    {...props}
  >
    <path d="M10 17h4V5H2v12h3"></path>
    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h1"></path>
    <path d="M14 17a2 2 0 1 0 4 0"></path>
    <path d="M5 17a2 2 0 1 0 4 0"></path>
  </svg>
);

interface SidebarProps {
  currentView: string;
  onNavigate: (route: string) => void;
}

const Sidebar: FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const currentPath = currentView; // Use currentView as the current path

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

  // No need for navCategories anymore as we're using sidebarConfig directly

  // Render sidebar items recursively
  const renderSidebarItems = (items: SidebarItem[], isChild: boolean = false) => {
    return (
      <ul className={`space-y-1 ${isChild ? 'mt-1 pl-4' : ''}`}>
        {items.map((item) => {
          // Determine if the item is active
          const isActive = item.path
            ? currentPath === item.path || (item.path.includes(':') && currentPath.startsWith(item.path.split(':')[0]))
            : false; // Parent items without direct path are not 'active' themselves

          // Determine if a parent category is active (for styling expanded parents)
          const isParentActive = item.children && item.path && currentPath.startsWith(item.path);

          if (item.children) {
            return (
              <li key={item.id} className="mb-2">
                <div
                  className={`w-full flex items-center justify-between gap-3 px-6 py-2 rounded-lg transition-colors text-left ${
                    expandedItems[item.id] || isParentActive // Expand if active or explicitly expanded
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => toggleExpand(item.id)} // Toggle on click
                  style={{ cursor: "pointer" }}
                  aria-expanded={!!expandedItems[item.id]}
                >
                  <div className="flex items-center gap-3 flex-grow text-left">
                    {item.icon && <item.icon className="w-5 h-5 flex-shrink-0" style={{ width: '20px', height: '20px' }} />}
                    <span>{item.label}</span>
                  </div>
                  <button
                    className="p-1 rounded-md hover:bg-gray-200 focus:outline-none"
                    onClick={(e) => toggleExpand(item.id, e)} // Use button to toggle explicitly
                    aria-label={expandedItems[item.id] ? "Collapse menu" : "Expand menu"}
                  >
                    {expandedItems[item.id] ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {expandedItems[item.id] && renderSidebarItems(item.children, true)}
              </li>
            );
          }

          // Render leaf item (no children)
          return (
            <li key={item.id}>
              <button
                className={`w-full flex items-center gap-3 ${isChild ? 'px-8' : 'px-6'} py-2 rounded-lg transition-colors text-left ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => item.path && handleNavigate(item.path)} // Only navigate if path exists
              >
                {item.icon && <item.icon className="w-5 h-5 flex-shrink-0" style={{ width: '20px', height: '20px' }} />}
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 !w-64 bg-gray-100 border-r shadow flex flex-col z-30" style={{ width: '16rem' }}>
      <div className="flex items-center justify-center px-6 py-4 border-b bg-gray-100">
        <h1 className="font-bold text-black text-lg">MATANUSKA TRANSPORT</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-2 max-h-[calc(100vh-160px)]">
        {/* Render all sidebar items directly from sidebarConfig */}
        {renderSidebarItems(sidebarConfig)}
      </nav>
      <div className="px-6 py-4 border-t">
        <div className="flex flex-col space-y-2 mb-3">
          <ConnectionStatusIndicator showText={true} />
          <SyncIndicator showText={true} className="mt-1" />
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-700">User</span> {/* Replace with actual user name */}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
