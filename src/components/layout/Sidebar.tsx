import React, { FC, useState } from 'react';
import { Activity, BarChart3, ChevronDown, ChevronRight, CircleDot, FileText, Users, Globe } from 'lucide-react';
import ConnectionStatusIndicator from '../ui/ConnectionStatusIndicator';
import SyncIndicator from '../ui/SyncIndicator';

// Refine the NavItem type to ensure icons support SVG props
interface NavItem {
  id: string; // Unique ID for state management (e.g., expansion)
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  route: string; // The actual route path for navigation and highlighting
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

const Sidebar: FC<SidebarProps> = ({
  currentView,
  onNavigate
}) => {
  // State to track which menu items are expanded
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // Toggle expansion state for a menu item
  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Define navigation categories
  const navCategories: { id: string; label: string; items: NavItem[]; route?: string; icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>; }[] = [
    // Main Navigation
    {
      id: 'main',
      label: 'Main Navigation',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Activity, route: 'dashboard' }
      ]
    },

    // Trip Management
    {
      id: 'core',
      label: 'Core Business Operations',
      items: [
        {
          id: 'trips',
          label: 'Trip Management',
          icon: Truck,
          route: 'trips', // Parent route, not directly navigable
          children: [
            { id: 'trips-dashboard', label: 'Trip Dashboard', route: 'trips' },
            { id: 'active-trips', label: 'Active Trips', route: 'trips/active' },
            { id: 'completed-trips', label: 'Completed Trips', route: 'trips/completed' },
            { id: 'route-planning', label: 'Route Planning', route: 'trips/route-planning' },
            { id: 'route-optimization', label: 'Route Optimization', route: 'trips/optimization' },
            { id: 'load-planning', label: 'Load Planning', route: 'trips/load-planning' },
            { id: 'add-new-trip', label: 'Add New Trip', route: 'trips/new' },
            { id: 'trip-calendar', label: 'Trip Calendar', route: 'trips/calendar' },
            { id: 'driver-performance', label: 'Driver Performance', route: 'trips/driver-performance' },
            { id: 'trip-cost-analysis', label: 'Trip Cost Analysis', route: 'trips/cost-analysis' },
            { id: 'fleet-utilization', label: 'Fleet Utilization', route: 'trips/utilization' },
            { id: 'delivery-confirmations', label: 'Delivery Confirmations', route: 'trips/confirmations' },
            { id: 'trip-templates', label: 'Trip Templates', route: 'trips/templates' },
            { id: 'trip-reports', label: 'Trip Reports', route: 'trips/reports' },
            { id: 'maps-tracking', label: 'Maps & Tracking', route: 'trips/maps' },
            { id: 'fleet-location', label: 'Fleet Location Map', route: 'trips/fleet-location' },
            { id: 'wialon-tracking', label: 'Wialon Integration', route: 'wialon' }
          ]
        },

        // Invoice Management
        {
          id: 'invoices',
          label: 'Invoice Management',
          icon: FileText,
          route: 'invoices', // Parent route
          children: [
            { id: 'invoice-dashboard', label: 'Invoice Dashboard', route: 'invoices' },
            { id: 'create-invoice', label: 'Create Invoice', route: 'invoices/new' },
            { id: 'pending-invoices', label: 'Pending Invoices', route: 'invoices/pending' },
            { id: 'paid-invoices', label: 'Paid Invoices', route: 'invoices/paid' },
            { id: 'overdue-invoices', label: 'Overdue Invoices', route: 'invoices/overdue' },
            { id: 'invoice-approval', label: 'Invoice Approval', route: 'invoices/approval' },
            { id: 'payment-reminders', label: 'Payment Reminders', route: 'invoices/reminders' },
            { id: 'credit-notes', label: 'Credit Notes', route: 'invoices/credit-notes' },
            { id: 'invoice-templates', label: 'Invoice Templates', route: 'invoices/templates' },
            { id: 'payment-tracking', label: 'Payment Tracking', route: 'invoices/payments' },
            { id: 'tax-reports', label: 'Tax Reports', route: 'invoices/tax-reports' },
            { id: 'invoice-analytics', label: 'Invoice Analytics', route: 'invoices/analytics' },
            { id: 'load-confirmation', label: 'Load Confirmation', route: 'invoices/load-confirmation' }
          ]
        },

        // Diesel Management
        {
          id: 'diesel',
          label: 'Diesel Management',
          icon: CircleDot,
          route: 'diesel', // Parent route
          children: [
            { id: 'diesel-dashboard', label: 'Diesel Dashboard', route: 'diesel' },
            { id: 'fuel-logs', label: 'Fuel Logs', route: 'diesel/logs' },
            { id: 'add-fuel-entry', label: 'Add Fuel Entry', route: 'diesel/new' },
            { id: 'fuel-card-management', label: 'Fuel Card Management', route: 'diesel/fuel-cards' },
            { id: 'fuel-analytics', label: 'Fuel Analytics', route: 'diesel/analytics' },
            { id: 'fuel-stations', label: 'Fuel Stations', route: 'diesel/stations' },
            { id: 'cost-analysis', label: 'Cost Analysis', route: 'diesel/costs' },
            { id: 'efficiency-reports', label: 'Efficiency Reports', route: 'diesel/efficiency' },
            { id: 'fuel-theft-detection', label: 'Fuel Theft Detection', route: 'diesel/theft-detection' },
            { id: 'carbon-footprint', label: 'Carbon Footprint', route: 'diesel/carbon-tracking' },
            { id: 'budget-planning', label: 'Budget Planning', route: 'diesel/budget' },
            { id: 'driver-fuel-behavior', label: 'Driver Fuel Behavior', route: 'diesel/driver-behavior' }
          ]
        },

        // Customer Management
        {
          id: 'customers',
          label: 'Customer Management',
          icon: Users,
          route: 'clients', // Parent route
          children: [
            { id: 'customer-dashboard', label: 'Customer Dashboard', route: 'clients' },
            { id: 'add-new-customer', label: 'Add New Customer', route: 'clients/new' },
            { id: 'active-customers', label: 'Active Customers', route: 'clients/active' },
            { id: 'customer-reports', label: 'Customer Reports', route: 'clients/reports' },
            { id: 'customer-retention', label: 'Customer Retention', route: 'customers/retention' },
            { id: 'client-relationships', label: 'Client Relationships', route: 'clients/relationships' },
          ]
        }
      ]
    },

    // HR & Compliance
    {
      id: 'hr-compliance',
      label: 'Human Resources & Compliance',
      items: [
        // Driver Management
        {
          id: 'drivers',
          label: 'Driver Management',
          icon: BarChart3,
          route: 'drivers', // Parent route
          children: [
            { id: 'driver-dashboard', label: 'Driver Dashboard', route: 'drivers' },
            { id: 'add-new-driver', label: 'Add New Driver', route: 'drivers/new' },
            { id: 'driver-profiles', label: 'Driver Profiles', route: 'drivers/profiles' },
            { id: 'license-management', label: 'License Management', route: 'drivers/licenses' },
            { id: 'training-records', label: 'Training Records', route: 'drivers/training' },
            { id: 'performance-analytics', label: 'Performance Analytics', route: 'drivers/performance' },
            { id: 'driver-scheduling', label: 'Driver Scheduling', route: 'drivers/scheduling' },
            { id: 'hours-of-service', label: 'Hours of Service', route: 'drivers/hours' },
            { id: 'driver-violations', label: 'Driver Violations', route: 'drivers/violations' },
            { id: 'driver-rewards', label: 'Driver Rewards', route: 'drivers/rewards' },
            { id: 'driver-behavior-analytics', label: 'Driver Behavior Analytics', route: 'drivers/behavior' },
            { id: 'safety-scores', label: 'Safety Scores', route: 'drivers/safety-scores' }
          ]
        },

        // Compliance & Safety
        {
          id: 'compliance',
          label: 'Compliance & Safety',
          icon: BarChart3,
          route: 'compliance', // Parent route
          children: [
            { id: 'compliance-dashboard', label: 'Compliance Dashboard', route: 'compliance' },
            { id: 'dot-compliance', label: 'DOT Compliance', route: 'compliance/dot' },
            { id: 'safety-inspections', label: 'Safety Inspections', route: 'compliance/safety-inspections' },
            { id: 'incident-reports', label: 'Incident Reports', route: 'compliance/incidents' },
            { id: 'safety-training', label: 'Safety Training', route: 'compliance/training' },
            { id: 'audit-management', label: 'Audit Management', route: 'compliance/audits' },
            { id: 'violation-tracking', label: 'Violation Tracking', route: 'compliance/violations' },
            { id: 'insurance-management', label: 'Insurance Management', route: 'compliance/insurance' }
          ]
        }
      ]
    },

    // Analytics & Business Intelligence
    {
      id: 'analytics',
      label: 'Analytics & Business Intelligence',
      items: [
        {
          id: 'fleet-analytics',
          label: 'Fleet Analytics',
          icon: BarChart3,
          route: 'analytics', // Parent route
          children: [
            { id: 'analytics-dashboard', label: 'Analytics Dashboard', route: 'analytics' },
            { id: 'kpi-overview', label: 'KPI Overview', route: 'analytics/kpi' },
            { id: 'predictive-analytics', label: 'Predictive Analytics', route: 'analytics/predictive' },
            { id: 'cost-analysis', label: 'Cost Analysis', route: 'analytics/costs' },
            { id: 'roi-reports', label: 'ROI Reports', route: 'analytics/roi' },
            { id: 'performance-benchmarks', label: 'Performance Benchmarks', route: 'analytics/benchmarks' },
            { id: 'custom-reports', label: 'Custom Reports', route: 'analytics/custom-reports' }
          ]
        }
      ]
    },

    // Wialon Integration
    {
      id: 'wialon-integration',
      label: 'Wialon Integration',
      items: [
        { 
          id: 'wialon', 
          label: 'Wialon Platform', 
          icon: Globe, 
          route: 'wialon',
          children: [
            { id: 'wialon-dashboard', label: 'Wialon Dashboard', route: 'wialon' },
            { id: 'wialon-units', label: 'Vehicle Units', route: 'wialon/units' },
            { id: 'wialon-config', label: 'Configuration', route: 'wialon/config' }
          ]
        }
      ]
    },

    // Workshop Management
    {
      id: 'workshop',
      label: 'Workshop Management',
      route: 'workshop', // Parent route
      icon: BarChart3, // Using BarChart3 as a placeholder icon
      items: [
        { id: 'workshop-dashboard', label: 'Workshop Dashboard', route: 'workshop' },
        { id: 'fleet-setup', label: 'Fleet Setup', route: 'workshop/fleet-setup' },
        { id: 'qr-generator', label: 'QR Generator', route: 'workshop/qr-generator' },
        { id: 'inspections', label: 'Inspections', route: 'workshop/inspections' },
        { id: 'job-cards', label: 'Job Cards', route: 'workshop/job-cards' },
        { id: 'faults', label: 'Fault Tracking', route: 'workshop/faults' },
        { id: 'workshop-tyres', label: 'Tyre Management', route: 'workshop/tyres' },
        { id: 'parts-ordering', label: 'Parts Ordering', route: 'workshop/parts-ordering' },
        { id: 'request-parts', label: 'Request Parts', route: 'workshop/request-parts' },
        { id: 'vehicle-inspection', label: 'Vehicle Inspection', route: 'workshop/vehicle-inspection' },
        { id: 'create-purchase-order', label: 'Create Purchase Order', route: 'workshop/create-purchase-order' }
      ]
    },

    // Tyre Management
    {
      id: 'tyres',
      label: 'Tyre Management',
      route: 'tyres', // Parent route
      icon: BarChart3, // Using BarChart3 as a placeholder icon
      items: [
        { id: 'tyre-dashboard', label: 'Tyre Dashboard', route: 'tyres/dashboard' },
        { id: 'tyre-inspection', label: 'Tyre Inspection', route: 'tyres/inspection' },
        { id: 'tyre-inventory', label: 'Tyre Inventory', route: 'tyres/inventory' },
        { id: 'tyre-reports', label: 'Tyre Reports', route: 'tyres/reports' }
      ]
    },

    // Inventory Management
    {
      id: 'inventory',
      label: 'Inventory Management',
      route: 'inventory', // Parent route
      icon: BarChart3, // Using BarChart3 as a placeholder icon
      items: [
        { id: 'inventory-dashboard', label: 'Inventory Dashboard', route: 'inventory/dashboard' },
        { id: 'inventory-stock', label: 'Stock Management', route: 'inventory/stock' },
        { id: 'inventory-parts', label: 'Parts Inventory', route: 'inventory/parts' },
        { id: 'inventory-reports', label: 'Inventory Reports', route: 'inventory/reports' }
      ]
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow flex flex-col z-30">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <span className="text-xl font-bold text-primary-600 tracking-tight">MATANUSKA TRANSPORT</span>
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
                // Determine if a parent item or a child item is active
                const isActive = children
                  ? currentView.startsWith(route) // For parent, check if any child route starts with parent route
                  : currentView === route; // For child, exact match

                if (children) {
                  return (
                    <li key={id} className="mb-2">
                      <div
                        className={`w-full flex items-center justify-between gap-3 px-6 py-2 rounded-lg transition-colors text-left ${
                          isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div
                          className="flex items-center gap-3 flex-grow text-left cursor-pointer"
                          onClick={(e) => toggleExpand(id, e)} // Only toggle expansion for parent items
                        >
                          {Icon && <Icon className="w-5 h-5" />}
                          <span>{label}</span>
                        </div>

                        <button
                          className="p-1 rounded-md hover:bg-gray-200 focus:outline-none"
                          onClick={(e) => toggleExpand(id, e)}
                          aria-label={expandedItems[id] ? 'Collapse menu' : 'Expand menu'}
                        >
                          {expandedItems[id] ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Only render children if this item is expanded */}
                      {expandedItems[id] && (
                        <ul className="space-y-1 mt-1">
                          {children.map((child: NavItem) => (
                            <li key={child.id}>
                              <button
                                className={`w-full flex items-center gap-3 px-12 py-2 rounded-lg transition-colors text-left ${
                                  currentView === child.route ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
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
                        isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
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
