import { FC } from 'react';
import {
  Activity,
  BarChart3,
  CheckCircle,
  ClipboardList,
  Clock,
  Flag,
  Fuel,
  Plus,
  Settings,
  Shield,
  Target,
  Truck,
  Upload,
  Users,
  Bell,
  User,
  History,
  Map
} from 'lucide-react';
import SyncIndicator from '../ui/SyncIndicator';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: FC<HeaderProps> = ({
  currentView,
  onNavigate
}) => {
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
        <span className="text-xl font-bold text-primary-600 tracking-tight">TripPro</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-colors text-left ${currentView === id ? 'bg-gray-100 text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
                onClick={() => onNavigate(id)}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-6 py-4 border-t">
        <div className="mb-3">
          <SyncIndicator showText={true} />
        </div>
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-700">User</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;