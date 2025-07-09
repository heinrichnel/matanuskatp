import { Outlet, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, FileText, Truck, 
  Clipboard, AlertTriangle, HardDrive,
  Package, ShoppingBag, QrCode, FileBarChart2 
} from 'lucide-react';

const WorkshopPage = () => {
  const location = useLocation();
  
  // Workshop navigation items
  const navItems = [
    {
      icon: <BarChart3 size={18} />,
      label: 'Dashboard',
      path: '/workshop'
    },
    {
      icon: <Clipboard size={18} />,
      label: 'Job Cards',
      path: '/workshop/job-cards'
    },
    {
      icon: <FileText size={18} />,
      label: 'Inspections',
      path: '/workshop/inspections'
    },
    {
      icon: <AlertTriangle size={18} />,
      label: 'Fault Tracking',
      path: '/workshop/faults'
    },
    {
      icon: <HardDrive size={18} />,
      label: 'Tyre Management',
      path: '/workshop/tyres/management'
    },
    {
      icon: <Package size={18} />,
      label: 'Parts & Inventory',
      path: '/workshop/inventory'
    },
    {
      icon: <ShoppingBag size={18} />,
      label: 'Purchase Orders',
      path: '/workshop/purchase-orders'
    },
    {
      icon: <Truck size={18} />,
      label: 'Fleet Setup',
      path: '/workshop/fleet-setup'
    },
    {
      icon: <QrCode size={18} />,
      label: 'QR Generator',
      path: '/workshop/qr-generator'
    },
    {
      icon: <FileBarChart2 size={18} />,
      label: 'Reports',
      path: '/workshop/reports'
    }
  ];

  return (
    <div className="flex">
      {/* Custom sidebar navigation */}
      <div className="w-64 bg-gray-100 min-h-screen border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-xl text-gray-800">Workshop</h2>
          <p className="text-sm text-gray-500">Maintenance Management</p>
        </div>
        <nav className="mt-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 text-sm ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-200'
                    }`
                  }
                  end={item.path === '/workshop'}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Workshop Operations</h1>
            <p className="text-gray-600">Manage workshop activities, job cards, and maintenance</p>
          </div>
        </div>

        {/* Nested routes will be rendered here */}
        <Outlet />
      </div>
    </div>
  );
};

export default WorkshopPage;