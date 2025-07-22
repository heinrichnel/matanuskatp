import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Invoice Dashboard component for displaying key invoice metrics and statuses
 */
const InvoiceDashboard: React.FC = () => {
  // Mock data for demonstration purposes
  const invoiceStats = {
    totalOutstanding: 125000,
    overdue: 45000,
    paid30Days: 78000,
    invoicesThisMonth: 24,
    averagePaymentTime: 18 // days
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Outstanding</h3>
          <p className="text-2xl font-bold text-blue-600">${invoiceStats.totalOutstanding.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Overdue Amount</h3>
          <p className="text-2xl font-bold text-red-600">${invoiceStats.overdue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Paid Last 30 Days</h3>
          <p className="text-2xl font-bold text-green-600">${invoiceStats.paid30Days.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Invoices This Month</h3>
          <p className="text-2xl font-bold text-blue-600">{invoiceStats.invoicesThisMonth}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Avg. Payment Time</h3>
          <p className="text-2xl font-bold text-blue-600">{invoiceStats.averagePaymentTime} days</p>
        </div>
      </div>

      {/* Invoice Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/invoices/new" className="bg-blue-600 text-white py-2 px-4 rounded-md text-center hover:bg-blue-700">
              Create Invoice
            </Link>
            <Link to="/invoices/templates" className="bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-center hover:bg-gray-200">
              Invoice Templates
            </Link>
            <Link to="/invoices/reminders" className="bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-center hover:bg-gray-200">
              Send Reminders
            </Link>
            <Link to="/invoices/analytics" className="bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-center hover:bg-gray-200">
              View Analytics
            </Link>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Invoice Status</h2>
          <div className="space-y-3">
            <Link to="/invoices/pending" className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
              <span>Pending Invoices</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">12</span>
            </Link>
            <Link to="/invoices/overdue" className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
              <span>Overdue Invoices</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">8</span>
            </Link>
            <Link to="/invoices/paid" className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
              <span>Paid Invoices</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">24</span>
            </Link>
            <Link to="/invoices/approval" className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
              <span>Awaiting Approval</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">4</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Invoices</h2>
          <Link to="/invoices/all" className="text-blue-600 hover:text-blue-800">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">INV-{2023001 + index}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">Client {index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">${(1500 * (index + 1)).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">2023-07-{15 - index}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      index % 3 === 0 ? 'bg-green-100 text-green-800' : 
                      index % 3 === 1 ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {index % 3 === 0 ? 'Paid' : index % 3 === 1 ? 'Pending' : 'Overdue'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" onClick={onClick || (() => {})}}>View</button>
                      <button className="text-gray-600 hover:text-gray-800" onClick={onClick || (() => {})}}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDashboard;
