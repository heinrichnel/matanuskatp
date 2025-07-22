import React from 'react';

/**
 * Component for displaying and managing paid invoices
 */
const PaidInvoicesPage: React.FC = () => {
  // Mock data
  const paidInvoices = Array.from({ length: 10 }, (_, i) => ({
    id: `INV-${2023050 + i}`,
    client: `Client ${i + 1}`,
    amount: 1800 * (i + 1),
    issueDate: `2023-06-${15 - (i % 10)}`,
    paidDate: `2023-07-${5 - (i % 10)}`,
    paymentMethod: i % 3 === 0 ? 'Credit Card' : i % 3 === 1 ? 'Bank Transfer' : 'Cash'
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Paid Invoices</h1>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={onClick}}>
            Export to CSV
          </button>
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick}}>
            Print Report
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option value="">All Clients</option>
              <option>Client 1</option>
              <option>Client 2</option>
              <option>Client 3</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option>Last 30 days</option>
              <option>This month</option>
              <option>Last month</option>
              <option>Custom</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select className="w-full border border-gray-300 rounded-md p-2">
              <option>All</option>
              <option>Bank Transfer</option>
              <option>Credit Card</option>
              <option>Cash</option>
              <option>Check</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick}}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Table of paid invoices */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paidInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{invoice.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{invoice.client}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">${invoice.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{invoice.issueDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{invoice.paidDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{invoice.paymentMethod}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" onClick={onClick}}>View</button>
                      <button className="text-gray-600 hover:text-gray-800" onClick={onClick}}>Print</button>
                      <button className="text-green-600 hover:text-green-800" onClick={onClick}}>Receipt</button>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                <span className="font-medium">30</span> results
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
          <h3 className="text-lg font-medium mb-2">Total Paid Amount</h3>
          <p className="text-2xl font-bold text-green-600">$54,000.00</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Average Payment Time</h3>
          <p className="text-2xl font-bold text-blue-600">18 days</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Most Common Payment Method</h3>
          <p className="text-2xl font-bold text-gray-700">Bank Transfer</p>
        </div>
      </div>
    </div>
  );
};

export default PaidInvoicesPage;
