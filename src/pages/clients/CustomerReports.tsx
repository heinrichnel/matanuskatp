import React, { useState } from 'react';

/**
 * Component for displaying customer analytics and reports
 */
const CustomerReportsPage: React.FC = () => {
  // State for report type selection
  const [reportType, setReportType] = useState<string>('customer-growth');
  // State for date range
  const [dateRange, setDateRange] = useState<string>('thisYear');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customer Reports</h1>
        <div className="flex space-x-2">
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick || (() => {})}}>
            Export Report
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={onClick || (() => {})}}>
            Schedule Report
          </button>
        </div>
      </div>

      {/* Report Controls */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="customer-growth">Customer Growth</option>
              <option value="revenue-by-customer">Revenue by Customer</option>
              <option value="customer-retention">Customer Retention</option>
              <option value="customer-acquisition">Customer Acquisition</option>
              <option value="customer-lifetime-value">Customer Lifetime Value</option>
              <option value="customer-segmentation">Customer Segmentation</option>
              <option value="order-frequency">Order Frequency</option>
              <option value="geographic-distribution">Geographic Distribution</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisQuarter">This Quarter</option>
              <option value="lastQuarter">Last Quarter</option>
              <option value="thisYear">This Year</option>
              <option value="lastYear">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={onClick || (() => {})}}>
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Report Visualization */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">
          {reportType === 'customer-growth' && 'Customer Growth'}
          {reportType === 'revenue-by-customer' && 'Revenue by Customer'}
          {reportType === 'customer-retention' && 'Customer Retention'}
          {reportType === 'customer-acquisition' && 'Customer Acquisition'}
          {reportType === 'customer-lifetime-value' && 'Customer Lifetime Value'}
          {reportType === 'customer-segmentation' && 'Customer Segmentation'}
          {reportType === 'order-frequency' && 'Order Frequency'}
          {reportType === 'geographic-distribution' && 'Geographic Distribution'}
        </h2>
        
        {/* Chart placeholder - would be replaced with actual chart component */}
        <div className="h-80 bg-gray-50 rounded flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Report Visualization</p>
            <p className="text-gray-400 text-sm">{reportType} data would be displayed here</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Customers</h3>
          <p className="text-2xl font-bold text-blue-600">128</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600 font-medium">+12%</span>
            <span className="ml-1 text-gray-500">vs previous period</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Average Revenue Per Customer</h3>
          <p className="text-2xl font-bold text-green-600">$8,500</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600 font-medium">+5.3%</span>
            <span className="ml-1 text-gray-500">vs previous period</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Customer Retention Rate</h3>
          <p className="text-2xl font-bold text-blue-600">94.5%</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600 font-medium">+2.1%</span>
            <span className="ml-1 text-gray-500">vs previous period</span>
          </div>
        </div>
      </div>

      {/* Report Details */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Report Details</h2>
        
        {reportType === 'customer-growth' && (
          <div className="space-y-4">
            <p>This report shows the growth of your customer base over time. Key observations:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Customer growth rate has increased by 12% compared to previous period</li>
              <li>New customer acquisition cost has decreased by 8%</li>
              <li>The Logistics sector shows the strongest growth at 18%</li>
              <li>Customers from urban areas represent 65% of new acquisitions</li>
            </ul>
            
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New Customers</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lost Customers</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Growth</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">January</td>
                    <td className="px-4 py-3 text-sm text-gray-500">8</td>
                    <td className="px-4 py-3 text-sm text-gray-500">2</td>
                    <td className="px-4 py-3 text-sm text-gray-500">+6</td>
                    <td className="px-4 py-3 text-sm text-green-600">+5.8%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">February</td>
                    <td className="px-4 py-3 text-sm text-gray-500">6</td>
                    <td className="px-4 py-3 text-sm text-gray-500">1</td>
                    <td className="px-4 py-3 text-sm text-gray-500">+5</td>
                    <td className="px-4 py-3 text-sm text-green-600">+4.5%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">March</td>
                    <td className="px-4 py-3 text-sm text-gray-500">9</td>
                    <td className="px-4 py-3 text-sm text-gray-500">0</td>
                    <td className="px-4 py-3 text-sm text-gray-500">+9</td>
                    <td className="px-4 py-3 text-sm text-green-600">+7.8%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">April</td>
                    <td className="px-4 py-3 text-sm text-gray-500">4</td>
                    <td className="px-4 py-3 text-sm text-gray-500">3</td>
                    <td className="px-4 py-3 text-sm text-gray-500">+1</td>
                    <td className="px-4 py-3 text-sm text-green-600">+0.8%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">May</td>
                    <td className="px-4 py-3 text-sm text-gray-500">7</td>
                    <td className="px-4 py-3 text-sm text-gray-500">2</td>
                    <td className="px-4 py-3 text-sm text-gray-500">+5</td>
                    <td className="px-4 py-3 text-sm text-green-600">+4.1%</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">June</td>
                    <td className="px-4 py-3 text-sm text-gray-500">10</td>
                    <td className="px-4 py-3 text-sm text-gray-500">1</td>
                    <td className="px-4 py-3 text-sm text-gray-500">+9</td>
                    <td className="px-4 py-3 text-sm text-green-600">+7.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {reportType !== 'customer-growth' && (
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500">Detailed Report Data</p>
              <p className="text-gray-400 text-sm">Select a report type to view detailed information</p>
            </div>
          </div>
        )}
      </div>

      {/* Report Actions */}
      <div className="flex justify-end space-x-3">
        <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick || (() => {})}}>
          Download PDF
        </button>
        <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick || (() => {})}}>
          Export to Excel
        </button>
        <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick || (() => {})}}>
          Schedule Report
        </button>
        <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick || (() => {})}}>
          Share Report
        </button>
      </div>
    </div>
  );
};

export default CustomerReportsPage;
