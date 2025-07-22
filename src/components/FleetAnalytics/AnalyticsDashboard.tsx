import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  ArrowUpRight, 
  Truck
} from 'lucide-react';

/**
 * Fleet Analytics Dashboard Component
 * Main dashboard for fleet analytics showing key metrics and trends
 */
const AnalyticsDashboard: React.FC = () => {
  // Mock data for analytics metrics
  const metrics = {
    fleetUtilization: 87.2,
    fleetUtilizationTrend: 2.5,
    fuelEfficiency: 8.4,
    fuelEfficiencyTrend: -0.7,
    operatingCosts: 24800,
    operatingCostsTrend: -5.3,
    onTimeDeliveries: 94.5,
    onTimeDeliveriesTrend: 1.2,
    idleTime: 6.8,
    idleTimeTrend: -1.5,
    totalVehicles: 45,
    operationalVehicles: 42,
    maintenanceVehicles: 3,
    averageTripDistance: 342,
    revenuePerKm: 18.5
  };

  // Mock data for ROI trends
  const roiTrends = [
    { id: 1, month: 'Jan', value: 75 },
    { id: 2, month: 'Feb', value: 62 },
    { id: 3, month: 'Mar', value: 85 },
    { id: 4, month: 'Apr', value: 78 },
    { id: 5, month: 'May', value: 91 },
    { id: 6, month: 'Jun', value: 88 },
    { id: 7, month: 'Jul', value: 94 }
  ];

  // Mock data for top performing vehicles
  const topVehicles = [
    { id: 'TRK-104', model: '2021 Freightliner', efficiency: 9.2, trips: 42, revenue: 368500 },
    { id: 'TRK-117', model: '2020 Peterbilt', efficiency: 8.9, trips: 38, revenue: 352000 },
    { id: 'TRK-122', model: '2022 Volvo', efficiency: 8.8, trips: 45, revenue: 413500 },
    { id: 'TRK-105', model: '2019 Kenworth', efficiency: 8.5, trips: 36, revenue: 312000 },
    { id: 'TRK-111', model: '2021 Mack', efficiency: 8.3, trips: 39, revenue: 327500 }
  ];

  // Calculate simple chart data for trend lines
  const maxRoiValue = Math.max(...roiTrends.map(item => item.value));
  const chartWidth = 200;
  const chartHeight = 50;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fleet Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <select className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last Quarter</option>
            <option value="365d">Last Year</option>
          </select>
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200" onClick={onClick || (() => {})}}>
            Export Data
          </button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Fleet Utilization */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Fleet Utilization</p>
              <p className="text-2xl font-bold">{metrics.fleetUtilization}%</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {metrics.fleetUtilizationTrend > 0 ? (
              <>
                <ChevronUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">{metrics.fleetUtilizationTrend}%</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-500">{Math.abs(metrics.fleetUtilizationTrend)}%</span>
              </>
            )}
            <span className="text-xs text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        {/* Fuel Efficiency */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Fuel Efficiency</p>
              <p className="text-2xl font-bold">{metrics.fuelEfficiency} km/L</p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {metrics.fuelEfficiencyTrend > 0 ? (
              <>
                <ChevronUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">{metrics.fuelEfficiencyTrend}%</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-500">{Math.abs(metrics.fuelEfficiencyTrend)}%</span>
              </>
            )}
            <span className="text-xs text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        {/* Operating Costs */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Operating Costs</p>
              <p className="text-2xl font-bold">${metrics.operatingCosts.toLocaleString()}</p>
            </div>
            <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {metrics.operatingCostsTrend < 0 ? (
              <>
                <ChevronDown className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">{Math.abs(metrics.operatingCostsTrend)}%</span>
              </>
            ) : (
              <>
                <ChevronUp className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-500">{metrics.operatingCostsTrend}%</span>
              </>
            )}
            <span className="text-xs text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        {/* On-Time Deliveries */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">On-Time Deliveries</p>
              <p className="text-2xl font-bold">{metrics.onTimeDeliveries}%</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {metrics.onTimeDeliveriesTrend > 0 ? (
              <>
                <ChevronUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">{metrics.onTimeDeliveriesTrend}%</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-500">{Math.abs(metrics.onTimeDeliveriesTrend)}%</span>
              </>
            )}
            <span className="text-xs text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        {/* Idle Time */}
        <div className="bg-white p-5 rounded-lg shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Idle Time</p>
              <p className="text-2xl font-bold">{metrics.idleTime}%</p>
            </div>
            <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            {metrics.idleTimeTrend < 0 ? (
              <>
                <ChevronDown className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">{Math.abs(metrics.idleTimeTrend)}%</span>
              </>
            ) : (
              <>
                <ChevronUp className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-500">{metrics.idleTimeTrend}%</span>
              </>
            )}
            <span className="text-xs text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
      </div>

      {/* ROI Trends and Vehicle Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ROI Trends Chart */}
        <div className="bg-white rounded-lg shadow lg:col-span-2">
          <div className="p-5 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">ROI Trends</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                  <span className="text-xs text-gray-500">This Year</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-1"></span>
                  <span className="text-xs text-gray-500">Last Year</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="flex justify-between items-end h-[200px] mb-5">
              {roiTrends.map((item) => (
                <div key={item.id} className="flex flex-col items-center">
                  <div className="relative w-12">
                    <div className="absolute bottom-0 w-8 mx-auto bg-blue-500 rounded-t"
                         style={{ height: `${(item.value / maxRoiValue) * 100}%` }}>
                      <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-blue-100 text-blue-800 text-xs font-medium px-1 rounded">
                        {item.value}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              {roiTrends.map((item) => (
                <div key={item.id} className="text-xs text-gray-500 text-center w-12">
                  {item.month}
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 border-t text-right">
            <Link to="/analytics/roi" className="text-blue-600 hover:underline text-sm inline-flex items-center">
              View Detailed ROI Reports 
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Vehicle Status */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-5 border-b">
            <h2 className="text-lg font-medium">Vehicle Status</h2>
          </div>
          <div className="p-5">
            {/* Vehicle Status Donut Chart */}
            <div className="flex justify-center mb-4">
              <div className="relative h-48 w-48">
                {/* This is a simplified donut chart - in production you'd use a charting library */}
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e5e7eb" strokeWidth="15" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent" 
                    stroke="#3b82f6" 
                    strokeWidth="15" 
                    strokeDasharray={`${(metrics.operationalVehicles / metrics.totalVehicles) * 251} 251`} 
                    strokeDashoffset="0" 
                    transform="rotate(-90 50 50)" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{Math.round((metrics.operationalVehicles / metrics.totalVehicles) * 100)}%</span>
                  <span className="text-sm text-gray-500">Operational</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-sm">Operational</span>
                </div>
                <span className="text-sm font-medium">{metrics.operationalVehicles} vehicles</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span className="text-sm">Under Maintenance</span>
                </div>
                <span className="text-sm font-medium">{metrics.maintenanceVehicles} vehicles</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                  <span className="text-sm">Total Fleet</span>
                </div>
                <span className="text-sm font-medium">{metrics.totalVehicles} vehicles</span>
              </div>
            </div>
          </div>
          <div className="p-5 border-t text-right">
            <Link to="/fleet" className="text-blue-600 hover:underline text-sm inline-flex items-center">
              View Fleet Details 
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Top Performing Vehicles */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Top Performing Vehicles</h2>
          <Link to="/analytics/vehicle-performance" className="text-blue-600 hover:underline text-sm">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trips Completed
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue Generated
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vehicle.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.efficiency} km/L
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle.trips}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${vehicle.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Operational
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Key Insights
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <div className="min-w-[8px] h-2 w-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
              <span className="text-gray-600">Average trip distance increased by {metrics.averageTripDistance} km vs last month</span>
            </li>
            <li className="flex items-start">
              <div className="min-w-[8px] h-2 w-2 bg-amber-500 rounded-full mt-1.5 mr-2"></div>
              <span className="text-gray-600">Revenue per km is ${metrics.revenuePerKm}, up 2.3% from previous quarter</span>
            </li>
            <li className="flex items-start">
              <div className="min-w-[8px] h-2 w-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
              <span className="text-gray-600">Best performing route is Johannesburg to Durban with 97.8% on-time rate</span>
            </li>
          </ul>
          <Link to="/analytics/insights" className="text-blue-600 text-sm hover:underline mt-3 inline-block">View All Insights →</Link>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
            <LineChart className="w-5 h-5 mr-2 text-blue-500" />
            Predictive Analytics
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <div className="min-w-[8px] h-2 w-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
              <span className="text-gray-600">Maintenance predictions show 2 vehicles requiring service next week</span>
            </li>
            <li className="flex items-start">
              <div className="min-w-[8px] h-2 w-2 bg-amber-500 rounded-full mt-1.5 mr-2"></div>
              <span className="text-gray-600">Fuel consumption forecast predicts 5% increase due to upcoming route changes</span>
            </li>
            <li className="flex items-start">
              <div className="min-w-[8px] h-2 w-2 bg-red-500 rounded-full mt-1.5 mr-2"></div>
              <span className="text-gray-600">Tyre replacements due for 8 vehicles within the next month</span>
            </li>
          </ul>
          <Link to="/analytics/predictive" className="text-blue-600 text-sm hover:underline mt-3 inline-block">View Predictions →</Link>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-blue-500" />
            Cost Analysis
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <div className="min-w-[8px] h-2 w-2 bg-green-500 rounded-full mt-1.5 mr-2"></div>
              <span className="text-gray-600">Fuel costs decreased by 3.2% due to route optimization</span>
            </li>
            <li className="flex items-start">
              <div className="min-w-[8px] h-2 w-2 bg-amber-500 rounded-full mt-1.5 mr-2"></div>
              <span className="text-gray-600">Maintenance costs are within 5% of quarterly budget</span>
            </li>
            <li className="flex items-start">
              <div className="min-w-[8px] h-2 w-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
              <span className="text-gray-600">Cost per kilometer decreased to $0.58, down from $0.62 last quarter</span>
            </li>
          </ul>
          <Link to="/analytics/costs" className="text-blue-600 text-sm hover:underline mt-3 inline-block">View Cost Analysis →</Link>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
