import { Outlet, useLocation } from 'react-router-dom';
import { 
  BarChart3, FileText, Truck, 
  Clipboard, AlertTriangle, HardDrive,
  Package, ShoppingBag, QrCode, FileBarChart2 
} from 'lucide-react';

const WorkshopPage = () => {
  const location = useLocation();
  
  return (
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
  );
};

export default WorkshopPage;