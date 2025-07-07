import { FC } from 'react';
import {
  Activity,
  BarChart3,
  CheckCircle,
  FileText,
  Flag,
  Info,
  Shield,
  Settings,
  Truck,
  Users,
  Wrench,
  Bell,
  Plus
} from 'lucide-react';
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
  // Define navigation categories
  const navCategories = [
    {
      id: 'main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Activity },
      ]
    },
    {
      id: 'trips',
      label: 'Trip Management',
      items: [
        { id: 'trips', label: 'All Trips', icon: Truck },
        { id: 'active-trips', label: 'Active Trips', icon: Truck },
        { id: 'completed-trips', label: 'Completed Trips', icon: CheckCircle },
        { id: 'flags', label: 'Flags & Investigations', icon: Flag },
      ]
    },
    {
      id: 'fleet',
      label: 'Fleet Management',
      items: [
        { id: 'fleet', label: 'Fleet Overview', icon: Truck },
        { id: 'driver-behavior', label: 'Driver Management', icon: Shield },
        { id: 'missed-loads', label: 'Missed Loads', icon: FileText },
      ]
    },
    {
      id: 'workshop',
      label: 'Workshop Operations',
      items: [
        { id: 'workshop', label: 'Workshop Dashboard', icon: Wrench },
        { id: 'workshop-tires', label: 'Tire Management', icon: Info, path: 'workshop?tab=tires' },
        { id: 'action-log', label: 'Action Log', icon: FileText },
      ]
    },
    {
      id: 'reports',
      label: 'Reporting',
      items: [
        { id: 'reports', label: 'Reports & Exports', icon: BarChart3 },
        { id: 'invoice-aging', label: 'Invoice Aging', icon: FileText },
        { id: 'customer-retention', label: 'Customer Retention', icon: Users }
      ]
    },
    {
      id: 'system',
      label: 'System',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'audit-log', label: 'Audit Log', icon: FileText }
      ]
    }
  ];

  const navItems = [
    { id: 'add-trip', label: 'Add Trip', icon: Plus },
    { id: 'ytd-kpis', label: 'YTD KPIs', icon: Target },
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'active-trips', label: 'Active Trips', icon: Truck },
    { id: 'completed-trips', label: 'Completed Trips', icon: CheckCircle },
    { id: 'maps', label: 'Maps', icon: Map },
    { id: 'flags', label: 'Flags & Investigations', icon: Flag },
    { id: 'reports', label: 'Reports & Exports', icon: BarChart3 },
    { id: 'invoice-aging', label: 'Invoice Aging', icon: Clock },
    { id: 'customer-retention', label: 'Customer Retention', icon: Users },
    { id: 'missed-loads', label: 'Missed Loads', icon: ClipboardList },
    { id: 'diesel-dashboard', label: 'Diesel Dashboard', icon: Fuel },
    { id: 'driver-behavior', label: 'Driver Behavior', icon: User },
    { id: 'action-log', label: 'Action Log', icon: Upload },
    { id: 'audit-log', label: 'Audit Log', icon: History },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: Shield }
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
              {category.items.map(({ id, label, icon: Icon, path }) => (
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
              ))}
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