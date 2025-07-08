import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

const WorkshopPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems = [
    { label: 'Job Cards', path: '/workshop/job-cards' },
    { label: 'Fault Management', path: '/workshop/fault-management' },
    { label: 'Fleet Management', path: '/workshop/fleet-management' },
    { label: 'Inspections', path: '/workshop/inspections' },
  ];

  return (
    <div className="flex">
      <Sidebar
        items={sidebarItems}
        currentPath={location.pathname}
        onNavigate={(path) => navigate(path)}
      />
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