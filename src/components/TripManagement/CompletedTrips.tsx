import React, { useState, useEffect } from "react";
import { SupportedCurrency } from "../../lib/currency";

interface Trip {
  id: string;
  fleetNumber: string;
  origin: string;
  destination: string;
  driver: string;
  startDate: string;
  endDate: string;
  status: string;
  cost: number;
}

interface CompletedTripsProps {
  displayCurrency: SupportedCurrency;
}

const CompletedTrips: React.FC<CompletedTripsProps> = ({ displayCurrency }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate fetching completed trips
  useEffect(() => {
    // In a real implementation, this would fetch from Firestore
    const fetchCompletedTrips = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        const mockTrips: Trip[] = [
          {
            id: "trip1",
            fleetNumber: "MAT001",
            origin: "Harare",
            destination: "Johannesburg",
            driver: "John Doe",
            startDate: "2025-07-15",
            endDate: "2025-07-18",
            status: "completed",
            cost: 2500
          },
          {
            id: "trip2",
            fleetNumber: "MAT003",
            origin: "Bulawayo",
            destination: "Lusaka",
            driver: "Jane Smith",
            startDate: "2025-07-10",
            endDate: "2025-07-13",
            status: "completed",
            cost: 1800
          },
          {
            id: "trip3",
            fleetNumber: "MAT007",
            origin: "Gaborone",
            destination: "Maputo",
            driver: "Michael Johnson",
            startDate: "2025-07-05",
            endDate: "2025-07-09",
            status: "completed",
            cost: 2200
          }
        ];

        setTrips(mockTrips);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching completed trips:", error);
        setLoading(false);
      }
    };

    fetchCompletedTrips();
  }, []);

  // Format currency based on the displayCurrency prop
  const formatCurrency = (amount: number): string => {
    switch (displayCurrency) {
      case "USD":
        return `$${amount.toFixed(2)}`;
      case "ZAR":
        return `R${amount.toFixed(2)}`;
      case "EUR":
        return `€${amount.toFixed(2)}`;
      default:
        return `$${amount.toFixed(2)}`;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Completed Trips</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Completed Trips</h1>

      {trips.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600">No completed trips found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fleet Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {trip.fleetNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trip.origin} to {trip.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trip.driver}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {trip.startDate} - {trip.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(trip.cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => console.log(`View details for trip ${trip.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900"
                      onClick={() => console.log(`Generate invoice for trip ${trip.id}`)}
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompletedTrips;
