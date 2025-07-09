import React from 'react';
import InvoiceDashboard from '../../components/InvoiceManagement/InvoiceDashboard';

const InvoiceDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Invoice Dashboard</h1>
      <InvoiceDashboard />
    </div>
  );
};

export default InvoiceDashboardPage;
