import { FC, useState } from 'react';
import {
  Activity,
  Clipboard, 
  CheckCircle, 
  BarChart3,
  FileText,
  Flag as FlagIcon,
  Target,
  Database,
  QrCode,
  Folder,
  Kanban,
  AlertTriangle,
  Plus,
  Users,
  Wrench,
  Shield,
  Settings,
  Truck,
  CircleDot,
  Package,
  Store,
  Eye,
  History,
  TrendingUp,
  ShoppingCart,
  Warehouse,
  User,
  Map,
  Award,
  DollarSign,
  List
} from 'lucide-react';
import { ChevronDown, ChevronRight } from 'lucide-react'; 
import SyncIndicator from '../ui/SyncIndicator';
import ConnectionStatusIndicator from '../ui/ConnectionStatusIndicator';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: FC<HeaderProps> = ({
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
  const navCategories = [
    {
      id: 'main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Activity }
      ]
    },
    {
      id: 'trips',
      label: 'Trip Management',
      items: [
        { 
          id: 'trips', 
          label: 'Trip Management', 
          icon: Truck,
          path: 'trips',
          children: [
            { id: 'active-trips', label: 'Active Trips', icon: Truck, path: 'trips?tab=active' },
            { id: 'completed-trips', label: 'Completed Trips', icon: CheckCircle, path: 'trips?tab=completed' }
          ]
        }
      ]
    },
    {
      id: 'fleet',
      label: 'Fleet Management',
      items: [
        { 
          id: 'fleet', 
          label: 'Fleet Management', 
          icon: Truck, 
          path: 'fleet?tab=overview',
          children: [
            { id: 'fleet-overview', label: 'Fleet Overview', icon: Truck, path: 'fleet?tab=overview' },
            { id: 'driver-behavior', label: 'Driver Management', icon: Shield, path: 'fleet?tab=drivers' },
            { id: 'diesel-dashboard', label: 'Diesel Management', icon: Target, path: 'fleet?tab=diesel' },
            { id: 'maps', label: 'Maps', icon: Map, path: 'fleet?tab=maps' },
            { id: 'missed-loads', label: 'Missed Loads', icon: FileText, path: 'fleet?tab=missed-loads' }
          ]
        }
      ]
    },
    {
      id: 'workshop',
      label: 'Workshop',
      items: [
        {
          id: 'workshop',
          label: 'Workshop Management',
          icon: Wrench,
          path: 'workshop',
          children: [
            { id: 'workshop-overview', label: 'Workshop Overview', path: 'workshop', icon: Wrench },
            { id: 'workshop-fleet-setup', label: 'Fleet Setup', path: 'workshop/fleet-setup', icon: Database },
            { id: 'workshop-qr-generator', label: 'QR Code Generator', path: 'workshop/qr-generator', icon: QrCode },
            {
              id: 'workshop-inspections',
              label: 'Inspections',
              icon: Clipboard,
              children: [
                { id: 'workshop-enhanced-inspection', label: 'New Enhanced Inspection', path: 'workshop/inspections', icon: Plus },
                { id: 'workshop-active-inspections', label: 'Active Inspections', path: 'workshop/inspections/active', icon: Clipboard },
                { id: 'workshop-completed-inspections', label: 'Completed Inspections', path: 'workshop/inspections/completed', icon: List },
                { id: 'workshop-inspection-templates', label: 'Inspection Templates', path: 'workshop/inspections/templates', icon: Folder }
              ]
            },
            {
              id: 'workshop-job-cards',
              label: 'Job Cards',
              icon: FileText,
              children: [
                { id: 'workshop-create-job-card', label: 'Create Enhanced Job Card', path: 'workshop/job-cards', icon: FileText },
                { id: 'workshop-kanban-board', label: 'Kanban Board', path: 'workshop/job-cards/kanban', icon: Kanban },
                { id: 'workshop-open-job-cards', label: 'Open Job Cards', path: 'workshop/job-cards/open', icon: FileText },
                { id: 'workshop-completed-job-cards', label: 'Completed Job Cards', path: 'workshop/job-cards/completed', icon: List },
                { id: 'workshop-job-card-templates', label: 'Job Card Templates', path: 'workshop/job-cards/templates', icon: Folder }
              ]
            },
            {
              id: 'workshop-faults',
              label: 'Fault Management',
              icon: AlertTriangle,
              children: [
                { id: 'workshop-enhanced-fault', label: 'Enhanced Fault Management', path: 'workshop/faults', icon: AlertTriangle },
                { id: 'workshop-report-fault', label: 'Report New Fault', path: 'workshop/faults/new', icon: Plus },
                { id: 'workshop-critical-faults', label: 'Critical Faults', path: 'workshop/faults/critical', icon: Target }
              ]
            },
            {
              id: 'workshop-tyres',
              label: 'Tyre Management',
              icon: CircleDot,
              children: [
                { id: 'workshop-tyre-dashboard', label: 'Tyre Dashboard', path: 'workshop/tyres', icon: CircleDot },
                { id: 'workshop-tyre-inventory', label: 'Tyre Inventory', path: 'workshop/tyres/inventory', icon: Package },
                { id: 'workshop-tyre-stores', label: 'Tyre Stores', path: 'workshop/tyres/stores', icon: Store },
                { id: 'workshop-tyre-fleet', label: 'Fleet Overview', path: 'workshop/tyres/fleet', icon: Eye },
                { id: 'workshop-tyre-history', label: 'Tyre History', path: 'workshop/tyres/history', icon: History },
                { id: 'workshop-tyre-performance', label: 'Performance Analytics', path: 'workshop/tyres/performance', icon: TrendingUp },
                { id: 'workshop-tyre-add', label: 'Add New Tyre', path: 'workshop/tyres/add', icon: Plus }
              ]
            },
            {
              id: 'workshop-inventory',
              label: 'Inventory Management',
              icon: Package,
              children: [
                { id: 'workshop-stock-alerts', label: 'Stock Alerts', path: 'workshop/stock-alerts', icon: Bell },
                { id: 'workshop-parts-ordering', label: 'Parts Ordering', path: 'workshop/parts-ordering', icon: ShoppingCart },
                { id: 'workshop-work-orders', label: 'Work Orders', path: 'workshop/work-orders', icon: FileText },
                { id: 'workshop-purchase-orders', label: 'Purchase Orders', path: 'workshop/purchase-orders', icon: ShoppingCart },
                { id: 'workshop-vendors', label: 'Vendor Management', path: 'workshop/vendors', icon: Users },
                { id: 'workshop-inventory-general', label: 'General Inventory', path: 'workshop/inventory', icon: Warehouse }
              ]
            },
            { id: 'workshop-analytics', label: 'Analytics Dashboard', path: 'workshop/analytics', icon: BarChart3 },
            {
              id: 'workshop-reports',
              label: 'Workshop Reports',
              icon: FileText,
              children: [
                { id: 'workshop-reports-main', label: 'Workshop Reports', path: 'workshop/reports', icon: FileText },
                { id: 'workshop-cost-analysis', label: 'Cost Analysis', path: 'workshop/reports/costs', icon: DollarSign }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      items: [
        { id: 'reports', label: 'Reports & Exports', icon: BarChart3, path: 'reports' },
        { id: 'invoice-aging', label: 'Invoice Aging', icon: FileText },
        { id: 'customer-retention', label: 'Customer Retention', icon: Users },
        { id: 'audit-log', label: 'Audit Log', icon: FileText }
      ]
    },
    {
      id: 'system',
      label: 'System',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell, path: 'notifications' },
        { id: 'settings', label: 'Settings', icon: Settings, path: 'settings' }
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow flex flex-col z-30">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <span className="text-xl font-bold text-primary-600 tracking-tight">TransportMat</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {navCategories.map((category) => (
          <div key={category.id} className="mb-4">
            {category.label && (
              <h3 className="px-6 mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                {category.label}
              </h3>
            )}
            <ul className="space-y-1">
              {category.items.map(({ id, label, icon: Icon, path, children }) => {
                if (children) {
                  return (
                    <li key={id} className="mb-2">
                      <div
                        className={`w-full flex items-center justify-between gap-3 px-6 py-2 rounded-lg transition-colors text-left ${
                          currentView.startsWith(id) ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <button 
                          className="flex items-center gap-3 flex-grow text-left"
                          onClick={() => onNavigate(path || id)}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{label}</span>
                        </button>
                        
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
                      {expandedItems[id] && children.map(child => {
                        if (child.children) {
                          return (
                            <div key={child.id} className="ml-6 mt-1">
                              <div className="flex items-center gap-2 px-6 py-1 text-sm font-medium text-gray-600">
                                {child.icon && <child.icon className="w-4 h-4" />}
                                <span>{child.label}</span>
                              </div>
                              <ul className="pl-10 mt-1 space-y-1">
                                {child.children.map(subitem => (
                                  <li key={subitem.id}>
                                    <button
                                      className={`w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                                        currentView === subitem.id ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                      }`}
                                      onClick={() => onNavigate(subitem.path || subitem.id)}
                                    >
                                      {subitem.label}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        }
                        return (
                          <li key={child.id} className="ml-6 mt-1">
                            <button
                              className={`w-full flex items-center gap-2 px-6 py-1 text-sm rounded transition-colors text-left ${
                                currentView === child.id ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                              }`}
                              onClick={() => onNavigate(child.path || child.id)}
                            >
                              {child.icon && <child.icon className="w-4 h-4" />}
                              <span>{child.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </li>
                  );
                }
                
                return (
                  <li key={id}>
                    <button
                      className={`w-full flex items-center gap-3 px-6 py-2 rounded-lg transition-colors text-left ${
                        currentView === id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => onNavigate(path || id)}
                    >
                      <Icon className="w-5 h-5" />
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
          <User className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-700">User</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;