import { useFleetAnalytics } from "@/context/FleetAnalyticsContext";
import { FleetAnalyticsLineChart } from "../charts/FleetAnalyticsLineChart";
import { FleetCostAreaChart } from "../charts/FleetCostAreaChart";
import { FleetStatusDoughnut } from "../charts/FleetStatusDoughnut";
import { FleetUtilizationLine } from "../charts/FleetUtilizationLine";
import { ROIBarChart } from "../charts/ROIBarChart";

export function FleetAnalyticsDashboard() {
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

  // Handle date range changes
  const handleDateRangeChange = (start: Date, end: Date) => {
    updateDateRange(start, end);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fleet Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => refreshData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh Data"}
          </button>
        </div>
      </div>

      {/* Filter controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Filters</h2>
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
              checked={activeFilters.includes("utilization")}
              onChange={() => handleFilterChange("utilization")}
              className="mr-2 h-4 w-4"
            />
            Utilization
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={activeFilters.includes("roi")}
              onChange={() => handleFilterChange("roi")}
              className="mr-2 h-4 w-4"
            />
            ROI
          </label>
        </div>

        {/* Simple date range selector - in a real app, you'd use a date picker */}
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Date Range</h3>
          <div className="flex gap-4">
            <select
              className="border rounded p-2"
              value={dateRange.start.getMonth()}
              onChange={(e) => {
                const newStart = new Date(dateRange.start);
                newStart.setMonth(parseInt(e.target.value));
                handleDateRangeChange(newStart, dateRange.end);
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2025, i, 1).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
            <span className="self-center">to</span>
            <select
              className="border rounded p-2"
              value={dateRange.end.getMonth()}
              onChange={(e) => {
                const newEnd = new Date(dateRange.end);
                newEnd.setMonth(parseInt(e.target.value));
                handleDateRangeChange(dateRange.start, newEnd);
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2025, i, 1).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Fleet Status */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Fleet Status</h2>
          <FleetStatusDoughnut />
        </div>

        {/* ROI Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Monthly ROI</h2>
          <ROIBarChart />
        </div>

        {/* Fleet Utilization */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Fleet Utilization</h2>
          <FleetUtilizationLine />
        </div>

        {/* Fleet Performance - spans 2 columns */}
        <div className="bg-white p-4 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Fleet Performance Metrics</h2>
          <FleetAnalyticsLineChart />
        </div>

        {/* Fleet Costs */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Cost Analysis</h2>
          <FleetCostAreaChart />
        </div>
      </div>
    </div>
  );
}

export default FleetAnalyticsDashboard;
