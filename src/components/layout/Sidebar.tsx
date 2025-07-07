import { FC } from 'react';
import {
  Activity,
  BarChart3,
  Clipboard,
  CheckCircle,
  FileText,
  Flag,
  Shield,
  Settings,
  AlertTriangle,
  Truck,
  Users,
  Wrench,
  Bell,
  Target,
  User,
  Map,
  Award,
  BookOpen
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
        { id: 'workshop', label: 'Workshop Dashboard', path: 'workshop?tab=dashboard', icon: Wrench },
        { id: 'workshop-tires', label: 'Tyre Management', path: 'workshop?tab=tires', icon: Target },
        { id: 'workshop-inspections', label: 'Inspections', path: 'workshop?tab=inspections', icon: Clipboard },
        { id: 'workshop-jobcards', label: 'Job Cards', path: 'workshop?tab=jobcards', icon: FileText },
        { id: 'workshop-faults', label: 'Fault List', path: 'workshop?tab=faults', icon: AlertTriangle },
        { id: 'workshop-fleet', label: 'Fleet Management', path: 'workshop?tab=fleet', icon: Truck },
        { id: 'workshop-actions', label: 'Action Log', path: 'workshop?tab=actions', icon: CheckCircle }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      items: [
        { id: 'reports', label: 'Reports & Exports', icon: BarChart3 },
        { id: 'invoice-aging', label: 'Invoice Aging', icon: FileText },
        { id: 'customer-retention', label: 'Customer Retention', icon: Users },
        { id: 'audit-log', label: 'Audit Log', icon: BookOpen }
      ]
    },
    {
      id: 'system',
      label: 'System',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'settings', label: 'Settings', icon: Settings }
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
                      <button
                        className={`w-full flex items-center justify-between gap-3 px-6 py-2 rounded-lg transition-colors text-left ${
                          currentView.startsWith(id) ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => onNavigate(path || id)}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span>{label}</span>
                        </div>
                      </button>
                      {children.map(child => {
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