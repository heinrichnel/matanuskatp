import {
  Activity,
  BarChart3,
  ChevronDown,
  ChevronRight,
  CircleDot,
  FileText,
  Globe,
  Users,
} from "lucide-react";
import React, { FC, useState } from "react";
import ConnectionStatusIndicator from "../ui/ConnectionStatusIndicator";
import SyncIndicator from "../ui/SyncIndicator";

interface NavItem {
  id: string;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  route: string;
  children?: NavItem[];
}

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

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // *** ONLY ROUTES THAT EXIST IN App.tsx ***
  const navCategories: {
    id: string;
    label: string;
    items: NavItem[];
    route?: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }[] = [
    // Main Navigation
    {
      id: "main",
      label: "Main Navigation",
      items: [{ id: "dashboard", label: "Dashboard", icon: Activity, route: "dashboard" }],
    },

    // Core Business Operations
    {
      id: "core",
      label: "Core Business Operations",
      items: [
        {
          id: "trips",
          label: "Trip Management",
          icon: Truck,
          route: "trips",
          children: [
            { id: "trips-dashboard", label: "Trip Dashboard", route: "trips/dashboard" },
            { id: "trips-main", label: "Trip Management Home", route: "trips" },
            { id: "active-trips", label: "Active Trips", route: "trips/active" },
            {
              id: "completed-trips",
              label: "Completed Trips (Dashboard)",
              route: "trips/completed-dashboard",
            },
            { id: "route-planning", label: "Route Planning", route: "trips/planning" },
            { id: "route-optimization", label: "Route Optimization", route: "trips/optimization" },
            { id: "load-planning", label: "Load Planning", route: "trips/load-planning" },
            { id: "add-new-trip", label: "Add New Trip", route: "trips/add" },
            { id: "trip-calendar", label: "Trip Calendar", route: "trips/calendar" },
            { id: "trip-timeline", label: "Trip Timeline", route: "trips/timeline" },
            { id: "trip-workflow", label: "Main Trip Workflow", route: "trips/workflow" },
            { id: "maps-tracking", label: "Maps & Tracking", route: "trips/maps" },
            { id: "fleet-location", label: "Fleet Location Map", route: "trips/fleet-location" },
            { id: "wialon-tracking", label: "Wialon Tracking", route: "trips/wialon-tracking" },
            { id: "flags", label: "Flags / Investigations", route: "trips/flags" },
            {
              id: "driver-performance",
              label: "Driver Performance",
              route: "trips/driver-performance",
            },
            { id: "trip-cost-analysis", label: "Trip Cost Analysis", route: "trips/cost-analysis" },
            { id: "fleet-utilization", label: "Fleet Utilization", route: "trips/utilization" },
            {
              id: "delivery-confirmations",
              label: "Delivery Confirmations",
              route: "trips/confirmations",
            },
            {
              id: "load-confirmation",
              label: "New Load Confirmation",
              route: "trips/new-load-confirmation",
            },
            { id: "trip-templates", label: "Trip Templates", route: "trips/templates" },
            { id: "trip-reports", label: "Trip Reports", route: "trips/reports" },
          ],
        },

        {
          id: "invoices",
          label: "Invoice Management",
          icon: FileText,
          route: "invoices",
          children: [
            { id: "invoice-dashboard", label: "Invoice Dashboard", route: "invoices/dashboard" },
            { id: "invoice-home", label: "Invoice Management Home", route: "invoices" },
            { id: "create-invoice", label: "Create Invoice", route: "invoices/new" },
            { id: "create-quote", label: "Create Quote", route: "invoices/new-quote" },
            { id: "pending-invoices", label: "Pending Invoices", route: "invoices/pending" },
            { id: "paid-invoices", label: "Paid Invoices", route: "invoices/paid" },
            { id: "invoice-approval", label: "Invoice Approval", route: "invoices/approval" },
            { id: "tax-export", label: "Tax Report Export", route: "invoices/tax-export" },
            { id: "invoice-templates", label: "Invoice Templates", route: "invoices/templates" },
            { id: "invoice-reports", label: "Invoice Reports", route: "invoices/reports" },
            { id: "invoice-builder", label: "Invoice Builder", route: "invoices/builder" },
            { id: "invoice-batch", label: "Batch Processing", route: "invoices/batch-processing" },
            {
              id: "invoice-reconciliation",
              label: "Invoice Reconciliation",
              route: "invoices/reconciliation",
            },
            { id: "invoice-archives", label: "Invoice Archives", route: "invoices/archives" },
          ],
        },

        {
          id: "diesel",
          label: "Diesel Management",
          icon: CircleDot,
          route: "diesel",
          children: [
            { id: "diesel-dashboard", label: "Diesel Dashboard", route: "diesel/dashboard" },
            { id: "diesel-home", label: "Diesel Management Home", route: "diesel" },
            { id: "fuel-logs", label: "Fuel Logs", route: "diesel/logs" },
            { id: "add-fuel-entry", label: "Add Fuel Entry", route: "diesel/add-fuel" },
            {
              id: "fuel-card-management",
              label: "Fuel Card Management",
              route: "diesel/card-manager",
            },
            {
              id: "fuel-theft-detection",
              label: "Fuel Theft Detection",
              route: "diesel/theft-detection",
            },
            { id: "carbon-footprint", label: "Carbon Footprint", route: "diesel/carbon-footprint" },
            {
              id: "driver-fuel-behavior",
              label: "Driver Fuel Behavior",
              route: "diesel/driver-behavior",
            },
            { id: "efficiency-reports", label: "Fuel Efficiency", route: "diesel/efficiency" },
            { id: "budget-planning", label: "Budget Planning", route: "diesel/budget" },
          ],
        },

        {
          id: "customers",
          label: "Customer Management",
          icon: Users,
          route: "clients",
          children: [
            { id: "customer-dashboard", label: "Customer Dashboard", route: "clients" },
            { id: "add-new-customer", label: "Add New Customer", route: "clients/new" },
            { id: "active-customers", label: "Active Customers", route: "clients/active" },
            { id: "customer-reports", label: "Customer Reports", route: "clients/reports" },
            { id: "customer-retention", label: "Customer Retention", route: "customers/retention" }, // matches App.tsx
            {
              id: "client-relationships",
              label: "Client Relationships",
              route: "clients/relationships",
            },
            { id: "client-network", label: "Client Network Map", route: "clients/network" },
          ],
        },
      ],
    },

    // HR & Compliance (only what exists)
    {
      id: "hr-compliance",
      label: "Human Resources & Compliance",
      items: [
        {
          id: "drivers",
          label: "Driver Management",
          icon: BarChart3,
          route: "drivers",
          children: [
            { id: "driver-dashboard", label: "Driver Dashboard", route: "drivers/dashboard" },
            { id: "driver-home", label: "Driver Management Home", route: "drivers" },
            { id: "add-new-driver", label: "Add New Driver", route: "drivers/new" },
            { id: "driver-profiles", label: "Driver Profiles", route: "drivers/profiles" },
            { id: "license-management", label: "License Management", route: "drivers/licenses" },
            { id: "training-records", label: "Training Records", route: "drivers/training" },
            {
              id: "performance-analytics",
              label: "Performance Analytics",
              route: "drivers/performance",
            },
            { id: "driver-scheduling", label: "Driver Scheduling", route: "drivers/scheduling" },
            { id: "hours-of-service", label: "Hours of Service", route: "drivers/hours" },
            { id: "driver-violations", label: "Driver Violations", route: "drivers/violations" },
            { id: "driver-rewards", label: "Driver Rewards", route: "drivers/rewards" },
            {
              id: "driver-behavior-analytics",
              label: "Driver Behavior Analytics",
              route: "drivers/behavior",
            },
            { id: "safety-scores", label: "Safety Scores", route: "drivers/safety-scores" },
          ],
        },
      ],
    },

    // Wialon Integration (mapped to existing route)
    {
      id: "wialon",
      label: "Wialon Integration",
      route: "wialon",
      icon: Globe,
      items: [{ id: "wialon-dashboard", label: "Wialon Dashboard", route: "wialon/dashboard" }],
    },

    // Workshop Management
    {
      id: "workshop",
      label: "Workshop Management",
      route: "workshop",
      icon: BarChart3,
      items: [
        { id: "workshop-dashboard", label: "Workshop Dashboard", route: "workshop" },
        { id: "qr-generator", label: "QR Generator", route: "workshop/qr-generator" },
        { id: "qr-scanner", label: "QR Scanner", route: "workshop/qr-scanner" },
        { id: "inspections", label: "Inspections", route: "workshop/inspections" },
        { id: "job-cards", label: "Job Cards", route: "workshop/job-cards" },
        { id: "faults", label: "Fault Tracking", route: "workshop/faults" },
        { id: "workshop-tyres", label: "Tyre Management", route: "workshop/tyres" },
        {
          id: "tyre-reference-data",
          label: "Tyre Reference Data",
          route: "workshop/tyres/reference-data",
        },
        { id: "parts-ordering", label: "Parts Ordering", route: "workshop/parts-ordering" },
        {
          id: "vehicle-inspection",
          label: "Vehicle Inspection",
          route: "workshop/vehicle-inspection",
        },
        { id: "purchase-orders", label: "Purchase Orders", route: "workshop/purchase-orders" },
        { id: "stock-inventory", label: "Stock Inventory", route: "workshop/stock-inventory" },
        { id: "vendors", label: "Vendors", route: "workshop/vendors" },
        {
          id: "workshop-integration-debug",
          label: "Integration Debug",
          route: "integration-debug/workshop",
        },
      ],
    },

    // Tyre Management
    {
      id: "tyres",
      label: "Tyre Management",
      route: "tyres",
      icon: BarChart3,
      items: [
        { id: "tyres-home", label: "Tyre Management Home", route: "tyres" },
        { id: "tyre-dashboard", label: "Tyre Performance Dashboard", route: "tyres/dashboard" },
        { id: "tyre-add", label: "Add New Tyre", route: "tyres/add" },
        { id: "tyre-reference-data2", label: "Tyre Reference Data", route: "tyres/reference-data" },
        { id: "tyre-fleet-map", label: "Tyre Fleet Map", route: "tyres/fleet-map" },
        { id: "tyre-history", label: "Tyre History", route: "tyres/history" },
        { id: "tyre-mobile", label: "Tyre Mobile", route: "tyres/mobile" },
        { id: "tyre-mobile-scanner", label: "Tyre Mobile Scanner", route: "tyres/mobile/scanner" },
        {
          id: "tyre-integration-debug",
          label: "Integration Debug",
          route: "integration-debug/tyres",
        },
      ],
    },

    // Inventory Management
    {
      id: "inventory",
      label: "Inventory Management",
      route: "inventory",
      icon: BarChart3,
      items: [
        { id: "inventory-home", label: "Inventory Home", route: "inventory" },
        { id: "inventory-dashboard", label: "Inventory Dashboard", route: "inventory/dashboard" },
        { id: "inventory-stock", label: "Parts Inventory", route: "inventory/stock" },
        { id: "inventory-ordering", label: "Ordering", route: "inventory/ordering" },
        { id: "inventory-receive", label: "Receive Parts", route: "inventory/receive" },
        { id: "inventory-reports", label: "Inventory Reports", route: "inventory/reports" },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-100 border-r shadow flex flex-col z-30">
      <div className="flex items-center justify-center px-6 py-4 border-b bg-gray-100">
        <h1 className="font-bold text-black text-lg">MATANUSKA TRANSPORT</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-2 max-h-[calc(100vh-160px)]">
        {navCategories.map((category) => (
          <div key={category.id} className="mb-4">
            {category.label && (
              <h3 className="px-6 mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                {category.label}
              </h3>
            )}
            <ul className="space-y-1">
              {category.items.map(({ id, label, icon: Icon, route, children }) => {
                const normalizedRoute = route
                  ? route.startsWith("/")
                    ? route.substring(1)
                    : route
                  : "";
                const normalizedCurrentView = currentView.startsWith("/")
                  ? currentView.substring(1)
                  : currentView;

                const isActive = children
                  ? normalizedCurrentView === normalizedRoute ||
                    normalizedCurrentView.startsWith(`${normalizedRoute}/`)
                  : normalizedCurrentView === normalizedRoute;

                if (children) {
                  return (
                    <li key={id} className="mb-2">
                      <div
                        className={`w-full flex items-center justify-between gap-3 px-6 py-2 rounded-lg transition-colors text-left ${
                          isActive
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div
                          className="flex items-center gap-3 flex-grow text-left cursor-pointer"
                          onClick={(e) => {
                            toggleExpand(id, e);
                            if (route) {
                              onNavigate(route);
                            }
                          }}
                        >
                          {Icon && <Icon className="w-5 h-5" />}
                          <span>{label}</span>
                        </div>

                        <button
                          className="p-1 rounded-md hover:bg-gray-200 focus:outline-none"
                          onClick={(e) => toggleExpand(id, e)}
                          aria-label={expandedItems[id] ? "Collapse menu" : "Expand menu"}
                        >
                          {expandedItems[id] ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {expandedItems[id] && (
                        <ul className="space-y-1 mt-1">
                          {children.map((child: NavItem) => (
                            <li key={child.id}>
                              <button
                                className={`w-full flex items-center gap-3 px-12 py-2 rounded-lg transition-colors text-left ${
                                  currentView === child.route ||
                                  currentView === "/" + child.route ||
                                  currentView.startsWith(child.route + "/") ||
                                  currentView.startsWith("/" + child.route + "/")
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                                onClick={() => onNavigate(child.route)}
                              >
                                {child.icon && <child.icon className="w-5 h-5" />}
                                <span>{child.label}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                }

                return (
                  <li key={id}>
                    <button
                      className={`w-full flex items-center gap-3 px-6 py-2 rounded-lg transition-colors text-left ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => onNavigate(route)}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      <span>{label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="px-6 py-4 border-t">
        <div className="flex flex-col space-y-2 mb-3">
          <ConnectionStatusIndicator showText={true} />
          <SyncIndicator showText={true} className="mt-1" />
        </div>
        <div className="flex items-center gap-3 mt-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-700">User</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
function openWialonDashboard(event: React.MouseEvent<HTMLButtonElement>): void {
  throw new Error("Function not implemented.");
}
