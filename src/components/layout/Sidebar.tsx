import { FC } from 'react';
import { Activity, BarChart3, CheckCircle, ClipboardList, Clock, Flag, Fuel, Plus, Settings, Shield, Target, Truck, Upload, Users, Bell, User, History } from 'lucide-react';

const Header: FC<{
  onProfileClick,
  onNotificationsClick,
  onSettingsClick
}> => {
  const navItems = [
    { id: 'ytd-kpis', label: 'YTD KPIs', icon: Target },
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'active-trips', label: 'Active Trips', icon: Truck },
    { id: 'completed-trips', label: 'Completed Trips', icon: CheckCircle },
    { id: 'flags', label: 'Flags & Investigations', icon: Flag },
    { id: 'reports', label: 'Reports & Exports', icon: BarChart3 },
    { id: 'invoice-aging', label: 'Invoice Aging', icon: Clock },
    { id: 'customer-retention', label: 'Customer Retention', icon: Users },
  User,
    { id: 'diesel-dashboard', label: 'Diesel Dashboard', icon: Fuel },
    { id: 'driver-behavior', label: 'Driver Behavior', icon: UserRound },
    { id: 'action-log', label: 'Action Log', icon: Upload },
    { id: 'audit-log', label: 'Audit Log', icon: History }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r shadow flex flex-col z-30">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <span className="text-xl font-bold text-primary tracking-tight">TripPro</span>
        <Button size="sm" variant="primary" onClick={onNewTrip} icon={<Plus className="w-4 h-4" />}>Add Trip</Button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded transition-colors text-left ${currentView === id ? 'bg-secondary text-primary font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
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
          <span className="text-sm text-gray-700">{userName}</span>
          <button
            className="ml-auto p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            onClick={onNotificationsClick}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-400" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            onClick={onSettingsClick}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
            onClick={onProfileClick}
            aria-label="Profile"
          >
            <Shield className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Header;