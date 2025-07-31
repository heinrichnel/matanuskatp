// src/pages/WialonUnitsPage.tsx
import React from "react";
import { useWialonUnits } from "../hooks/useWialonUnits";
import Card, { CardContent, CardHeader } from "../components/ui/Card";
import Button from "../components/ui/Button";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import ErrorMessage from "../components/ui/ErrorMessage";
import { Truck, RefreshCw, XCircle } from "lucide-react";

const WialonUnitsPage: React.FC = () => {
  const { units, loading, error, refreshUnits } = useWialonUnits();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wialon Units</h1>
          <p className="text-gray-600">Overview of all active tracking units</p>
        </div>
        <Button onClick={refreshUnits} icon={<RefreshCw className="w-4 h-4" />} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Units"}
        </Button>
      </div>

      {/* Main Content Card */}
      <Card>
        {loading ? (
          <div className="p-8 flex justify-center items-center">
            <LoadingIndicator />
            <span className="ml-3 text-gray-700">Loading units from Wialon...</span>
          </div>
        ) : error ? (
          <div className="p-8">
            <ErrorMessage message={error} />
          </div>
        ) : (
          <>
            <CardHeader
              title={`Active Units (${units.length})`}
              className="bg-gray-50 border-b border-gray-200"
            />
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hardware
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vehicle Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profile
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Position
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {units.length > 0 ? (
                      units.map((unit) => (
                        <tr key={unit.uid}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {unit.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {unit.hardwareType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {unit.profile?.registration_plate || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {unit.profile?.brand} {unit.profile?.model}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {unit.lastPosition
                              ? `${unit.lastPosition.y.toFixed(4)}, ${unit.lastPosition.x.toFixed(4)}`
                              : "No data"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          <XCircle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No units found</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Check your Wialon connection or try refreshing.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default WialonUnitsPage;
