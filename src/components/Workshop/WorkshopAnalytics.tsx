import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { BarChart3, Wrench, Clock, TrendingUp, Filter, Truck, Calendar } from 'lucide-react';

interface RepairStats {
  totalJobs: number;
  completedJobs: number;
  inProgressJobs: number;
  averageCompletionTimeHours: number;
  mostCommonIssues: {issue: string, count: number}[];
  repairCostsByVehicle: {vehicleReg: string, costs: number}[];
  vehiclesWithMostFaults: {vehicleReg: string, faults: number}[];
  monthlyRepairCounts: {month: string, count: number}[];
  faultDistributionByType: {type: string, count: number}[];
  mechanicPerformance: {mechanic: string, jobsCompleted: number, avgTime: number}[];
}

// Color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

const WorkshopAnalytics: React.FC = () => {
  const [repairStats, setRepairStats] = useState<RepairStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  useEffect(() => {
    const fetchWorkshopData = async () => {
      try {
        setLoading(true);
        
        // This would normally fetch real data from Firestore
        // Since this is a stub component, we'll simulate the data
        
        // Simulate API fetch time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        const mockRepairStats: RepairStats = {
          totalJobs: 148,
          completedJobs: 124,
          inProgressJobs: 24,
          averageCompletionTimeHours: 8.5,
          mostCommonIssues: [
            { issue: 'Brake Problems', count: 28 },
            { issue: 'Engine Overheating', count: 22 },
            { issue: 'Electrical Issues', count: 18 },
            { issue: 'Tire Damage', count: 16 },
            { issue: 'Transmission Problems', count: 12 }
          ],
          repairCostsByVehicle: [
            { vehicleReg: 'TRK-001', costs: 4500 },
            { vehicleReg: 'TRK-002', costs: 3200 },
            { vehicleReg: 'TRK-003', costs: 5600 },
            { vehicleReg: 'TRK-004', costs: 2800 },
            { vehicleReg: 'TRK-005', costs: 4100 }
          ],
          vehiclesWithMostFaults: [
            { vehicleReg: 'TRK-003', faults: 8 },
            { vehicleReg: 'TRK-007', faults: 7 },
            { vehicleReg: 'TRK-001', faults: 6 },
            { vehicleReg: 'TRK-012', faults: 5 },
            { vehicleReg: 'TRK-005', faults: 4 }
          ],
          monthlyRepairCounts: [
            { month: 'Jan', count: 12 },
            { month: 'Feb', count: 15 },
            { month: 'Mar', count: 18 },
            { month: 'Apr', count: 14 },
            { month: 'May', count: 21 },
            { month: 'Jun', count: 22 },
            { month: 'Jul', count: 26 },
            { month: 'Aug', count: 20 },
            { month: 'Sep', count: 17 },
            { month: 'Oct', count: 14 },
            { month: 'Nov', count: 12 },
            { month: 'Dec', count: 10 }
          ],
          faultDistributionByType: [
            { type: 'Mechanical', count: 48 },
            { type: 'Electrical', count: 32 },
            { type: 'Tires', count: 24 },
            { type: 'Brakes', count: 18 },
            { type: 'Suspension', count: 14 },
            { type: 'Other', count: 12 }
          ],
          mechanicPerformance: [
            { mechanic: 'John D.', jobsCompleted: 45, avgTime: 7.2 },
            { mechanic: 'Sarah M.', jobsCompleted: 38, avgTime: 8.1 },
            { mechanic: 'Michael T.', jobsCompleted: 41, avgTime: 6.8 },
            { mechanic: 'Robert K.', jobsCompleted: 29, avgTime: 9.4 },
            { mechanic: 'Lisa P.', jobsCompleted: 33, avgTime: 7.9 }
          ]
        };
        
        setRepairStats(mockRepairStats);
        setError(null);
      } catch (err) {
        console.error("Error fetching workshop analytics:", err);
        setError('Failed to load workshop analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshopData();
  }, [timeFrame]);

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!repairStats) {
    return null;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <BarChart3 className="mr-2 text-primary-600" size={28} />
          Workshop Analytics
        </h1>
        
        <div className="flex items-center gap-2">
          <Calendar className="text-gray-500" size={20} />
          <select
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center mb-2">
            <Wrench className="text-blue-500 mr-3" size={20} />
            <h3 className="text-sm text-gray-600 font-medium">Total Jobs</h3>
          </div>
          <p className="text-3xl font-bold">{repairStats.totalJobs}</p>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-green-600">Completed: {repairStats.completedJobs}</span>
            <span className="text-sm text-amber-600">In Progress: {repairStats.inProgressJobs}</span>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center mb-2">
            <Clock className="text-green-500 mr-3" size={20} />
            <h3 className="text-sm text-gray-600 font-medium">Avg. Completion Time</h3>
          </div>
          <p className="text-3xl font-bold">{repairStats.averageCompletionTimeHours} hrs</p>
          <p className="text-sm text-gray-600 mt-2">Target: 8 hours</p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-amber-500">
          <div className="flex items-center mb-2">
            <Truck className="text-amber-500 mr-3" size={20} />
            <h3 className="text-sm text-gray-600 font-medium">Highest Repair Cost</h3>
          </div>
          <p className="text-3xl font-bold">
            {formatCurrency(Math.max(...repairStats.repairCostsByVehicle.map(v => v.costs)))}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Vehicle: {repairStats.repairCostsByVehicle.sort((a, b) => b.costs - a.costs)[0].vehicleReg}
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center mb-2">
            <TrendingUp className="text-purple-500 mr-3" size={20} />
            <h3 className="text-sm text-gray-600 font-medium">Most Common Issue</h3>
          </div>
          <p className="text-xl font-bold">
            {repairStats.mostCommonIssues[0].issue}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Occurrences: {repairStats.mostCommonIssues[0].count}
          </p>
        </div>
      </div>
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Repair Trends */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Repair Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={repairStats.monthlyRepairCounts}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} name="Repairs" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Fault Distribution by Type */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Fault Distribution by Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={repairStats.faultDistributionByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="type"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {repairStats.faultDistributionByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} faults`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Repair Costs by Vehicle */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Repair Costs by Vehicle</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={repairStats.repairCostsByVehicle}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="vehicleReg" />
                <YAxis tickFormatter={formatCurrency} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Repair Cost']} />
                <Legend />
                <Bar dataKey="costs" name="Repair Cost" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Mechanic Performance */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Mechanic Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={repairStats.mechanicPerformance}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mechanic" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="jobsCompleted" name="Jobs Completed" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="avgTime" name="Avg. Hours per Job" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Most Common Issues & Problematic Vehicles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Most Common Issues</h3>
          <div className="space-y-4">
            {repairStats.mostCommonIssues.map((issue, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{issue.issue}</span>
                <div className="flex items-center">
                  <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(issue.count / repairStats.mostCommonIssues[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{issue.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Vehicles with Most Faults</h3>
          <div className="space-y-4">
            {repairStats.vehiclesWithMostFaults.map((vehicle, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Truck size={16} className="mr-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{vehicle.vehicleReg}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-red-500 h-2.5 rounded-full" 
                      style={{ width: `${(vehicle.faults / repairStats.vehiclesWithMostFaults[0].faults) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{vehicle.faults} faults</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Filter className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Pro Tip: Use the timeframe selector to compare performance across different periods and identify trends.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopAnalytics;
