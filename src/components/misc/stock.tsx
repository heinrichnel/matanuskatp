import React from 'react';
import StockManager from '../../components/Inventory Management/StockManager';

const InventoryStockPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Stock Management</h1>
      <StockManager />
    </div>
  );
};

export default InventoryStockPage;
