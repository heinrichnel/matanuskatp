import React from 'react';

interface TyreInventoryStatsProps {
  inventory: Array<{
    quantity: number;
    minStock: number;
  }>;
}

export const TyreInventoryStats: React.FC<TyreInventoryStatsProps> = ({ inventory }) => {
  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = inventory.filter(item => item.quantity <= item.minStock).length;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h4 className="text-lg font-bold">Inventory Statistics</h4>
      <p>Total Stock: {totalStock}</p>
      <p>Low Stock Items: {lowStockCount}</p>
    </div>
  );
};

export default TyreInventoryStats;
