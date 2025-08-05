import { FleetAnalyticsLineChart } from "@/components/charts/FleetAnalyticsLineChart";
import { FleetCostAreaChart } from "@/components/charts/FleetCostAreaChart";
import { FleetStatusDoughnut } from "@/components/charts/FleetStatusDoughnut";
import { FleetUtilizationLine } from "@/components/charts/FleetUtilizationLine";
import { ROIBarChart } from "@/components/charts/ROIBarChart";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { FilterButton, FilterControls } from "@/components/ui/FilterControls";
import { useFleetAnalytics } from "@/context/FleetAnalyticsContext";
import { Download, RefreshCw } from "lucide-react";
import { useState } from "react";

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

/**
 * ModernFleetAnalyticsDashboard
 *
 * A modern, responsive dashboard for fleet analytics that follows best practices
 * for layout, component organization, and user experience.
 */
export function ModernFleetAnalyticsDashboard() {
  const { activeFilters, updateFilters, dateRange, updateDateRange, refreshData, isLoading } =
    useFleetAnalytics();

  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Filter options
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([
    {
      id: "fuelConsumption",
      label: "Fuel Consumption",
      checked: activeFilters.includes("fuelConsumption"),
    },
    { id: "maintenance", label: "Maintenance", checked: activeFilters.includes("maintenance") },
    { id: "utilization", label: "Utilization", checked: activeFilters.includes("utilization") },
    { id: "roi", label: "ROI", checked: activeFilters.includes("roi") },
  ]);

  // Handle filter changes
  const handleFilterChange = (filterId: string) => {
    // Update local state
    setFilterOptions(
      filterOptions.map((option) =>
        option.id === filterId ? { ...option, checked: !option.checked } : option
      )
    );

    // Update context state
    if (activeFilters.includes(filterId)) {
      updateFilters(activeFilters.filter((f) => f !== filterId));
    } else {
      updateFilters([...activeFilters, filterId]);
    }
  };

  // Handle date range changes
  const handleDateRangeChange = (start: Date, end: Date) => {
    updateDateRange(start, end);
  };

  // Export data (placeholder function)
  const handleExportData = () => {
    console.log("Exporting data...");
    alert("Data export started. Your file will be ready shortly.");
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Fleet Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor and analyze your fleet performance metrics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterButton
            isExpanded={isFilterExpanded}
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          />

          <button
            onClick={() => refreshData()}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Expandable Filter Panel */}
      {isFilterExpanded && (
        <FilterControls
          title="Dashboard Filters"
          subtitle="Customize your analytics view"
          filterOptions={filterOptions}
          dateRange={dateRange}
          onFilterChange={handleFilterChange}
          onDateRangeChange={handleDateRangeChange}
          onApply={() => setIsFilterExpanded(false)}
          onClose={() => setIsFilterExpanded(false)}
        />
      )}

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Fleet", value: "213 vehicles", change: "+2%", up: true },
          { label: "Active Vehicles", value: "189", change: "0%", up: false },
          { label: "Maintenance Needed", value: "24", change: "-5%", up: true },
          { label: "Avg. Utilization", value: "87%", change: "+3%", up: true },
        ].map((stat, i) => (
          <Card key={i} className="border border-gray-200">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p
                  className={`text-xs font-medium ${stat.up ? "text-green-500" : "text-gray-500"}`}
                >
                  {stat.change} from last month
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Fleet Status */}
        <Card className="border border-gray-200">
          <CardHeader heading="Fleet Status" subtitle="Current vehicle status distribution" />
          <CardContent className="p-4 h-64">
            <FleetStatusDoughnut />
          </CardContent>
        </Card>

        {/* ROI Chart */}
        <Card className="border border-gray-200">
          <CardHeader heading="Monthly ROI" subtitle="Return on investment by month" />
          <CardContent className="p-4 h-64">
            <ROIBarChart />
          </CardContent>
        </Card>

        {/* Fleet Utilization */}
        <Card className="border border-gray-200">
          <CardHeader heading="Fleet Utilization" subtitle="Vehicle usage efficiency" />
          <CardContent className="p-4 h-64">
            <FleetUtilizationLine />
          </CardContent>
        </Card>

        {/* Fleet Performance - spans full width on larger screens */}
        <Card className="border border-gray-200 lg:col-span-2">
          <CardHeader
            heading="Fleet Performance Metrics"
            subtitle="Key performance indicators over time"
          />
          <CardContent className="p-4 h-72">
            <FleetAnalyticsLineChart />
          </CardContent>
        </Card>

        {/* Fleet Costs */}
        <Card className="border border-gray-200">
          <CardHeader heading="Cost Analysis" subtitle="Breakdown of fleet expenses" />
          <CardContent className="p-4 h-72">
            <FleetCostAreaChart />
          </CardContent>
        </Card>
      </div>

      {/* Vehicle List */}
      <Card className="border border-gray-200">
        <CardHeader heading="Vehicle Fleet" subtitle="Details of your top performing vehicles" />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuel Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maintenance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  id: "V-1001",
                  name: "Volvo FH16",
                  status: "Active",
                  utilization: "92%",
                  efficiency: "High",
                  maintenance: "Up to date",
                },
                {
                  id: "V-1002",
                  name: "Scania R450",
                  status: "Active",
                  utilization: "88%",
                  efficiency: "Medium",
                  maintenance: "Due in 2 weeks",
                },
                {
                  id: "V-1003",
                  name: "Mercedes Actros",
                  status: "Maintenance",
                  utilization: "0%",
                  efficiency: "High",
                  maintenance: "In progress",
                },
                {
                  id: "V-1004",
                  name: "MAN TGX",
                  status: "Active",
                  utilization: "95%",
                  efficiency: "Low",
                  maintenance: "Due tomorrow",
                },
                {
                  id: "V-1005",
                  name: "DAF XF",
                  status: "Active",
                  utilization: "79%",
                  efficiency: "Medium",
                  maintenance: "Up to date",
                },
              ].map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                        <div className="text-sm text-gray-500">{vehicle.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vehicle.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vehicle.utilization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vehicle.efficiency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {vehicle.maintenance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CardFooter className="justify-between">
          <div className="text-sm text-gray-500">Showing 5 of 213 vehicles</div>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All Vehicles</button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ModernFleetAnalyticsDashboard;
