import { FleetAnalyticsProvider } from "@/context/FleetAnalyticsContext";
import { BarChart } from "lucide-react";
import React from "react";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
import { useAppContext } from "../../context/AppContext";
import { TripFleetAnalytics } from "./TripFleetAnalytics";

const TripDashboard: React.FC = () => {
  const { isLoading } = useAppContext();

  // Sample trip data - in a real app this would come from your trip context or API
  const tripData = {
    tripCount: 127,
    revenueAmount: 18650.75,
    completedThisMonth: 24,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Trip Dashboard</h1>
        <div className="text-sm text-gray-500">Overview of all trip activities</div>
      </div>

      <FleetAnalyticsProvider>
        <TripFleetAnalytics
          tripCount={tripData.tripCount}
          revenueAmount={tripData.revenueAmount}
          completedThisMonth={tripData.completedThisMonth}
        />
      </FleetAnalyticsProvider>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Trip Details Analytics</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <BarChart className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Detailed trip analytics coming soon</p>
            <p className="text-sm mt-2">
              Advanced trip analytics will appear here in a future update
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripDashboard;
