import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Main Invoice Management page that serves as a container for all invoice-related views
 */
const InvoiceManagementPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Invoice Management</h1>
      <Outlet />
    </div>
  );
};

export default InvoiceManagementPage;
