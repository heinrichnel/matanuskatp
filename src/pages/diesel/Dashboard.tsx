import React from 'react';
import DieselDashboardComponent from '../../components/DieselManagement/DieselDashboardComponent';

/**
 * Dashboard page for diesel management
 */
const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Diesel Dashboard</h1>
      <DieselDashboardComponent />
    </div>
  );
};

export default Dashboard;
