import React from 'react';
import InventoryDashboard from '../../components/Inventory Management/InventoryDashboard';

const InventoryDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Inventory Dashboard</h1>
      <InventoryDashboard />
    </div>
  );
};

export default InventoryDashboardPage;
