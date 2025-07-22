import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Component for displaying and managing fuel logs
 */
const FuelLogsPage: React.FC = () => {
  // Mock data
  const fuelLogs = Array.from({ length: 15 }, (_, i) => ({
    id: `FL-${1230 + i}`,
    vehicle: `TRK-${101 + (i % 5)}`,
    liters: 150 + (i * 10),
    cost: (150 + (i * 10)) * 1.45,
    date: `2023-07-${21 - i}`,
    location: i % 3 === 0 ? 'Main Depot' : i % 3 === 1 ? 'Highway Station' : 'City Gas',
    driver: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown'][i % 5],
    odometer: 45000 + (i * 500),
    fuelType: i % 4 === 0 ? 'Premium' : 'Regular',
    fuelCard: `FC-${5000 + i}`
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fuel Logs</h1>
        <div className="flex space-x-2">
          <Link to="/diesel/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Add Fuel Entry
          </Link>
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick}}>
            Export Logs
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option value="">All Vehicles</option>
              <option>TRK-101</option>
              <option>TRK-102</option>
              <option>TRK-103</option>
              <option>TRK-104</option>
              <option>TRK-105</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This month</option>
              <option>Last month</option>
              <option>Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option value="">All Drivers</option>
              <option>John Doe</option>
              <option>Jane Smith</option>
              <option>Mike Johnson</option>
              <option>Sarah Williams</option>
              <option>David Brown</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option value="">All Locations</option>
              <option>Main Depot</option>
              <option>Highway Station</option>
              <option>City Gas</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={onClick}}>
            Apply Filters
          </button>
        </div>
      </div>
      
      {/* Fuel logs table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="mr-2" /> ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liters</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odometer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fuelLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    <input type="checkbox" className="mr-2" />
                    {log.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{log.vehicle}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{log.liters}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">${log.cost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{log.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{log.odometer.toLocaleString()} km</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{log.location}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{log.driver}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" onClick={onClick}}>View</button>
                      <button className="text-gray-600 hover:text-gray-800" onClick={onClick}}>Edit</button>
                      <button className="text-red-600 hover:text-red-800" onClick={onClick}}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" onClick={onClick}}>
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" onClick={onClick}}>
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">15</span> of{' '}
                <span className="font-medium">50</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" onClick={onClick}}>
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-gray-50" onClick={onClick}}>
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={onClick}}>
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={onClick}}>
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" onClick={onClick}}>
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Fuel</h3>
          <p className="text-2xl font-bold text-blue-600">2,850 L</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Total Cost</h3>
          <p className="text-2xl font-bold text-red-600">$4,132.50</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Average per Vehicle</h3>
          <p className="text-2xl font-bold text-gray-700">570 L</p>
        </div>
      </div>
    </div>
  );
};

export default FuelLogsPage;
