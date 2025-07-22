import React from "react";
import { useAppContext } from "../../context/AppContext";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
import { CheckCircle, Calendar, Truck, DollarSign } from "lucide-react";

const CompletedTrips: React.FC = () => {
  const { isLoading } = useAppContext();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Completed Trips</h1>
        <div className="text-sm text-gray-500">View and analyze completed trip data</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">This Month</h3>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500 mt-1">Completed trips</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">$0.00</div>
            <p className="text-xs text-gray-500 mt-1">From completed trips</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Completed Trips Overview</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No completed trips found</p>
            <p className="text-sm mt-2">Completed trips will appear here once trips are finished</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletedTrips;
