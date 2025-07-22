import React from 'react';
import { Users, AlertTriangle, Clock, Award, TrendingUp, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Driver Dashboard Component
 * Main dashboard for driver management showing key metrics and driver status
 */
const DriverDashboard: React.FC = () => {
  // Mock data for driver metrics
  const metrics = {
    totalDrivers: 42,
    activeDrivers: 36,
    inactiveDrivers: 6,
    onDuty: 28,
    offDuty: 14,
    newThisMonth: 3,
    expiringSoonLicenses: 4,
    upcomingTraining: 7,
    averageSafetyScore: 92.5,
    violationsThisMonth: 5
  };

  // Mock data for driver status
  const driverStatus = [
    { id: 'DR-1001', name: 'John Smith', status: 'On Duty', hours: 6.5, violations: 0, safetyScore: 95 },
    { id: 'DR-1002', name: 'Michael Johnson', status: 'On Duty', hours: 4.2, violations: 0, safetyScore: 98 },
    { id: 'DR-1003', name: 'Robert Williams', status: 'Off Duty', hours: 0, violations: 1, safetyScore: 88 },
    { id: 'DR-1004', name: 'David Brown', status: 'On Duty', hours: 7.8, violations: 0, safetyScore: 94 },
    { id: 'DR-1005', name: 'Sarah Davis', status: 'On Duty', hours: 2.3, violations: 0, safetyScore: 97 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
        <div className="flex space-x-2">
          <Link to="/drivers/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Add New Driver
          </Link>
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick || (() => {})}}>
            Export Driver Data
          </button>
        </div>
      </div>

      {/* Driver Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Drivers</h3>
          <p className="text-2xl font-bold text-blue-600">{metrics.totalDrivers}</p>
          <div className="mt-2 flex items-center text-sm">
            <Users className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-gray-600">{metrics.activeDrivers} active, {metrics.inactiveDrivers} inactive</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Duty Status</h3>
          <p className="text-2xl font-bold text-green-600">{metrics.onDuty} on duty</p>
          <div className="mt-2 flex items-center text-sm">
            <Clock className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-gray-600">{metrics.offDuty} off duty</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Safety Score (Avg)</h3>
          <p className="text-2xl font-bold text-blue-600">{metrics.averageSafetyScore}</p>
          <div className="mt-2 flex items-center text-sm">
            <Award className="w-4 h-4 text-gray-500 mr-1" />
            <span className="text-green-600">{5} drivers above 95%</span>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Alerts</h3>
          <p className="text-2xl font-bold text-amber-600">{metrics.expiringSoonLicenses + metrics.violationsThisMonth}</p>
          <div className="mt-2 flex items-center text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-500 mr-1" />
            <span className="text-amber-600">{metrics.expiringSoonLicenses} licenses expiring, {metrics.violationsThisMonth} violations</span>
          </div>
        </div>
      </div>

      {/* Active Drivers Status */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Driver Status</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours Today</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Safety Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {driverStatus.map((driver) => (
                <tr key={driver.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{driver.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      driver.status === 'On Duty' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.hours} hrs</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{driver.safetyScore}</div>
                        <div className="text-xs text-gray-500">
                          {driver.safetyScore >= 95 ? 'Excellent' : 
                           driver.safetyScore >= 90 ? 'Good' : 
                           driver.safetyScore >= 80 ? 'Average' : 'Needs Improvement'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/drivers/profiles/${driver.id}`} className="text-blue-600 hover:text-blue-900 mr-3">View</Link>
                    <button className="text-blue-600 hover:text-blue-900" onClick={onClick || (() => {})}}>Contact</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Upcoming Training
          </h3>
          <p className="text-sm text-gray-600 mb-2">{metrics.upcomingTraining} drivers have scheduled training sessions</p>
          <Link to="/drivers/training" className="text-blue-600 text-sm hover:underline">View Training Schedule →</Link>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
            License Renewals
          </h3>
          <p className="text-sm text-gray-600 mb-2">{metrics.expiringSoonLicenses} drivers have licenses expiring soon</p>
          <Link to="/drivers/licenses" className="text-blue-600 text-sm hover:underline">View License Status →</Link>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Performance Analytics
          </h3>
          <p className="text-sm text-gray-600 mb-2">View detailed performance metrics and trends</p>
          <Link to="/drivers/performance" className="text-blue-600 text-sm hover:underline">View Analytics →</Link>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
