import React from 'react';

const InventoryReportsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Inventory Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Stock Level Reports</h2>
          <p className="text-gray-600 mb-4">View current stock levels, minimum thresholds, and reorder recommendations.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" onClick={onClick || (() => {})}}>
            Generate Report
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Usage Analytics</h2>
          <p className="text-gray-600 mb-4">Analyze part usage patterns, consumption rates, and forecasting.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" onClick={onClick || (() => {})}}>
            Generate Report
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Cost Analysis</h2>
          <p className="text-gray-600 mb-4">Track spending, price changes, and budget compliance.</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors" onClick={onClick || (() => {})}}>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryReportsPage;
