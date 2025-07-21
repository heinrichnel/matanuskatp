import React from "react";
import { useAppContext } from "../../context/AppContext";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
import { BarChart2, TrendingUp, Droplet, DollarSign, Clock } from "lucide-react";

const DieselDashboardComponent: React.FC = () => {
  const { isLoading } = useAppContext();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diesel Management Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor fuel consumption, costs and efficiency</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Total Consumption</h3>
              <Droplet className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0 L</div>
            <p className="text-xs text-gray-500 mt-1">Month to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Fuel Cost</h3>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">$0.00</div>
            <p className="text-xs text-gray-500 mt-1">Month to date</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Average Efficiency</h3>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">-- km/L</div>
            <p className="text-xs text-gray-500 mt-1">Fleet average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Last Refueling</h3>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">--</div>
            <p className="text-xs text-gray-500 mt-1">Days ago</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Consumption Trends</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <BarChart2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No consumption data available</p>
            <p className="text-sm mt-2">Start adding fuel entries to see consumption trends</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DieselDashboardComponent;
