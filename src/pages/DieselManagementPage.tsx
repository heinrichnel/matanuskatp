import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Main Diesel Management page that serves as a container for all diesel-related views
 */
const DieselManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Diesel Management</h1>
      <Outlet />
    </div>
  );
};

export default DieselManagementPage;
