import { FleetCostAreaChart } from "@/components/charts/FleetCostAreaChart";
import { FleetStatusDoughnut } from "@/components/charts/FleetStatusDoughnut";
import { ROIBarChart } from "@/components/charts/ROIBarChart";
import { useFleetAnalytics } from "@/context/FleetAnalyticsContext";
import { BarChart, ChevronRight, TrendingUp, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";

interface TripFleetAnalyticsProps {
  tripCount?: number;
  revenueAmount?: number;
  completedThisMonth?: number;
}

export function TripFleetAnalytics({
  tripCount = 0,
  revenueAmount = 0,
  completedThisMonth = 0,
}: TripFleetAnalyticsProps) {
  const { fleetStatus, isLoading, refreshData } = useFleetAnalytics();

  // Combine fleet status with trip data for a comprehensive view
  const fleetEfficiency = fleetStatus.percentOperational || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Fleet Status</h3>
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? "Loading..." : `${fleetStatus.operational}/${fleetStatus.total}`}
            </div>
            <p className="text-xs text-gray-500 mt-1">Operational Vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Trip Count</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{tripCount}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${revenueAmount.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Fleet Efficiency</h3>
              <BarChart className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {isLoading ? "--%" : `${fleetEfficiency}%`}
            </div>
            <p className="text-xs text-gray-500 mt-1">Operational Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Status Chart */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Fleet Status</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-gray-500">Loading...</div>
            ) : (
              <div className="py-4">
                <FleetStatusDoughnut />
              </div>
            )}
          </CardContent>
        </Card>

        {/* ROI Analysis */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">ROI Analysis</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-gray-500">Loading...</div>
            ) : (
              <div className="py-4">
                <ROIBarChart />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Cost Analysis</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-gray-500">Loading...</div>
            ) : (
              <div className="py-4">
                <FleetCostAreaChart />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Full Analytics Button */}
      <div className="flex justify-end">
        <Link
          to="/fleet-analytics"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
        >
          View Full Fleet Analytics
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Refresh Data Button */}
      <div className="flex justify-center">
        <button
          onClick={() => refreshData()}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
        >
          {isLoading ? "Refreshing..." : "Refresh Analytics"}
        </button>
      </div>
    </div>
  );
}

export default TripFleetAnalytics
