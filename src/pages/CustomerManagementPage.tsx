import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Main Customer Management page that serves as a container for all customer-related views
 */
const CustomerManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Customer Management</h1>
      <Outlet />
    </div>
  );
};

export default CustomerManagementPage;
