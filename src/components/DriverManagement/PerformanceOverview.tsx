import React from 'react';
import Card, { CardHeader, CardContent } from '@/components/ui/consolidated/Card';
import Button from '../ui/Button';
import { Calendar, Download, Filter, Plus, Eye, Edit, RefreshCw } from 'lucide-react';
import { DriverBehaviorEvent } from '../../types';

interface DriverPerformanceOverviewProps {
  onAddEvent?: () => void;
  onViewEvent?: (event: DriverBehaviorEvent) => void;
  onEditEvent?: (event: DriverBehaviorEvent) => void;
  onSyncNow?: () => Promise<void>;
}

const DriverPerformanceOverview: React.FC<DriverPerformanceOverviewProps> = ({
  onAddEvent,
  onViewEvent,
  onEditEvent,
  onSyncNow
}) => {
  // These would be replaced with actual charts in a real implementation
  // For now, using colored bars to simulate charts
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Driver Performance Analytics</h1>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option value="last30">Last 30 Days</option>
              <option value="last90">Last 90 Days</option>
              <option value="last180">Last 6 Months</option>
              <option value="last365">Last Year</option>
            </select>
          </div>

          {onAddEvent && (
            <Button
              variant="outline"
              onClick={onAddEvent}
              icon={<Plus className="h-4 w-4" />}
            >
              Record Event
            </Button>
          )}

          {onSyncNow && (
            <Button
              variant="outline"
              onClick={onSyncNow}
              icon={<RefreshCw className="h-4 w-4" />}
            >
              Sync Now
            </Button>
          )}

          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Overall Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">Safety Score</p>
              <p className="text-3xl font-bold text-green-600">92.7%</p>
              <p className="text-xs text-green-600">+2.3% from last period</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">On-Time Rate</p>
              <p className="text-3xl font-bold text-blue-600">87.5%</p>
              <p className="text-xs text-red-600">-1.2% from last period</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">Fuel Efficiency</p>
              <p className="text-3xl font-bold text-purple-600">78.9%</p>
              <p className="text-xs text-green-600">+0.8% from last period</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col">
              <p className="text-sm text-gray-600">Compliance Rate</p>
              <p className="text-3xl font-bold text-yellow-600">96.3%</p>
              <p className="text-xs text-gray-600">No change from last period</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Driver Behavior Events */}
      {(onViewEvent || onEditEvent) && (
        <Card>
          <CardHeader title="Recent Driver Behavior Events" />
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Sample data - in a real app, this would be populated from props */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-07-25</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Speeding</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        High
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {onViewEvent && (
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {onEditEvent && (
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-07-24</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Jane Smith</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Harsh Braking</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Medium
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {onViewEvent && (
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {onEditEvent && (
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Safety Score Trend */}
        <Card>
          <CardHeader title="Safety Score Trend" />
          <CardContent>
            {/* Simulated Line Chart */}
            <div className="h-64 flex items-end justify-between px-2">
              <div className="w-[8%] bg-blue-500 rounded-t-md h-[60%]"></div>
              <div className="w-[8%] bg-blue-500 rounded-t-md h-[70%]"></div>
              <div className="w-[8%] bg-blue-500 rounded-t-md h-[65%]"></div>
              <div className="w-[8%] bg-blue-500 rounded-t-md h-[75%]"></div>
              <div className="w-[8%] bg-blue-500 rounded-t-md h-[72%]"></div>
              <div className="w-[8%] bg-blue-500 rounded-t-md h-[80%]"></div>
              <div className="w-[8%] bg-blue-500 rounded-t-md h-[82%]"></div>
              <div className="w-[8%] bg-blue-500 rounded-t-md h-[85%]"></div>
              <div className="w-[8%] bg-blue-500 rounded-t-md h-[90%]"></div>
              <div className="w-[8%] bg-blue-500 rounded-t-md h-[93%]"></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <div>Jan</div>
              <div>Feb</div>
              <div>Mar</div>
              <div>Apr</div>
              <div>May</div>
              <div>Jun</div>
              <div>Jul</div>
              <div>Aug</div>
              <div>Sep</div>
              <div>Oct</div>
            </div>
          </CardContent>
        </Card>

        {/* Event Frequency Trend */}
        <Card>
          <CardHeader title="Event Frequency Trend" />
          <CardContent>
            {/* Simulated Line Chart */}
            <div className="h-64 flex items-end justify-between px-2">
              <div className="w-[8%] bg-red-500 rounded-t-md h-[88%]"></div>
              <div className="w-[8%] bg-red-500 rounded-t-md h-[85%]"></div>
              <div className="w-[8%] bg-red-500 rounded-t-md h-[90%]"></div>
              <div className="w-[8%] bg-red-500 rounded-t-md h-[82%]"></div>
              <div className="w-[8%] bg-red-500 rounded-t-md h-[80%]"></div>
              <div className="w-[8%] bg-red-500 rounded-t-md h-[75%]"></div>
              <div className="w-[8%] bg-red-500 rounded-t-md h-[83%]"></div>
              <div className="w-[8%] bg-red-500 rounded-t-md h-[87%]"></div>
              <div className="w-[8%] bg-red-500 rounded-t-md h-[85%]"></div>
              <div className="w-[8%] bg-red-500 rounded-t-md h-[87%]"></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <div>Jan</div>
              <div>Feb</div>
              <div>Mar</div>
              <div>Apr</div>
              <div>May</div>
              <div>Jun</div>
              <div>Jul</div>
              <div>Aug</div>
              <div>Sep</div>
              <div>Oct</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverPerformanceOverview;
