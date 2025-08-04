import { useFleetAnalytics } from "@/context/FleetAnalyticsContext";
import { Calendar, Download, Filter, RefreshCw } from "lucide-react";
import { FleetAnalyticsLineChart } from "../charts/FleetAnalyticsLineChart";
import { FleetCostAreaChart } from "../charts/FleetCostAreaChart";
import { FleetStatusDoughnut } from "../charts/FleetStatusDoughnut";
import { FleetUtilizationLine } from "../charts/FleetUtilizationLine";
import { ROIBarChart } from "../charts/ROIBarChart";

export function ModernFleetAnalyticsDashboard() {
  const { activeFilters, updateFilters, dateRange, updateDateRange, refreshData, isLoading } =
    useFleetAnalytics();

  // Handle filter changes
  const handleFilterChange = (filter: string) => {
    if (activeFilters.includes(filter)) {
      updateFilters(activeFilters.filter((f) => f !== filter));
    } else {
      updateFilters([...activeFilters, filter]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Fleet Analytics Dashboard</h1>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-outline btn-sm flex items-center gap-2"
            aria-label="Date Range"
          >
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </button>
          <button
            className="btn btn-outline btn-sm"
            aria-label="Refresh Data"
            onClick={() => refreshData()}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button className="btn btn-outline btn-sm">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Card */}
      <div className="card p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4" />
          <h2 className="font-medium">Filters</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={activeFilters.includes("fuelConsumption")}
              onChange={() => handleFilterChange("fuelConsumption")}
              className="mr-2 h-4 w-4"
            />
            Fuel Consumption
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={activeFilters.includes("maintenance")}
              onChange={() => handleFilterChange("maintenance")}
              className="mr-2 h-4 w-4"
            />
            Maintenance
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={activeFilters.includes("tyreWear")}
              onChange={() => handleFilterChange("tyreWear")}
              className="mr-2 h-4 w-4"
            />
            Tyre Wear
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={activeFilters.includes("efficiency")}
              onChange={() => handleFilterChange("efficiency")}
              className="mr-2 h-4 w-4"
            />
            Efficiency Metrics
          </label>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Vehicles</div>
          <div className="text-2xl font-bold mt-1">42</div>
          <div className="text-xs text-green-500 mt-1">↑ 4% from last month</div>
        </div>
        <div className="card p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Active Trips</div>
          <div className="text-2xl font-bold mt-1">18</div>
          <div className="text-xs text-amber-500 mt-1">↓ 2% from yesterday</div>
        </div>
        <div className="card p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Fuel Usage</div>
          <div className="text-2xl font-bold mt-1">2,845L</div>
          <div className="text-xs text-green-500 mt-1">↑ 5% efficiency</div>
        </div>
        <div className="card p-4 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Revenue</div>
          <div className="text-2xl font-bold mt-1">$89,521</div>
          <div className="text-xs text-green-500 mt-1">↑ 12% from last month</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <h3 className="font-medium mb-4">Fleet Status Overview</h3>
          <div className="h-80">
            <FleetStatusDoughnut />
          </div>
        </div>
        <div className="card p-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <h3 className="font-medium mb-4">Fleet Utilization</h3>
          <div className="h-80">
            <FleetUtilizationLine />
          </div>
        </div>
        <div className="card p-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <h3 className="font-medium mb-4">Cost Analysis</h3>
          <div className="h-80">
            <FleetCostAreaChart />
          </div>
        </div>
        <div className="card p-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <h3 className="font-medium mb-4">ROI by Vehicle Type</h3>
          <div className="h-80">
            <ROIBarChart />
          </div>
        </div>
      </div>

      {/* Full Width Chart */}
      <div className="card p-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg">
        <h3 className="font-medium mb-4">Performance Metrics Over Time</h3>
        <div className="h-80">
          <FleetAnalyticsLineChart />
        </div>
      </div>
    </div>
  );
}

export default ModernFleetAnalyticsDashboard;
