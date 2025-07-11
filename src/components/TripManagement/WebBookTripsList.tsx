import React from "react";
import { useWebBookTrips } from "../../hooks/useWebBookTrips";
import Card, { CardContent, CardHeader } from "../ui/Card";
import LoadingIndicator from "../ui/LoadingIndicator";
import ErrorMessage from "../ui/ErrorMessage";
import { formatDateTime } from "../../utils/helpers";
import { CheckCircle, Clock, Truck, MapPin, User, Calendar } from "lucide-react";

export default function WebBookTripsList() {
  const { trips, loading, error, activeTrips, deliveredTrips } = useWebBookTrips();

  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={`Error loading trips: ${error}`} />;
  if (trips.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No web book trips found in the system.</p>
        </CardContent>
      </Card>
    );
  }

  const StatusBadge = ({ status, shipped, delivered }: { 
    status: string; 
    shipped: boolean; 
    delivered: boolean; 
  }) => {
    if (delivered || status === "delivered") {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Delivered
      </span>;
    }
    if (shipped || status === "shipped") {
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center gap-1">
        <Truck className="w-3 h-3" />
        In Transit
      </span>;
    }
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
      <Clock className="w-3 h-3" />
      {status}
    </span>;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Web Book Trips</p>
                <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active/In Transit</p>
                <p className="text-2xl font-bold text-gray-900">{activeTrips.length}</p>
              </div>
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">{deliveredTrips.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trips Table */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Web Book Trips</h2>
          <p className="text-sm text-gray-600">Trips imported from the web booking system</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Load Ref</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipped</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trips.map(trip => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{trip.loadRef}</div>
                      <div className="text-xs text-gray-500">ID: {trip.id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{trip.customer}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{trip.origin}</div>
                        <div className="text-xs text-gray-500">↓ to</div>
                        <div>{trip.destination}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge 
                        status={trip.status} 
                        shipped={trip.shippedStatus} 
                        delivered={trip.deliveredStatus} 
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trip.shippedStatus ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {trip.shippedDate && <span>{formatDateTime(trip.shippedDate).split(' ')[0]}</span>}
                        </div>
                      ) : (
                        <span className="text-gray-400">Not shipped</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trip.deliveredStatus ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {trip.deliveredDate && <span>{formatDateTime(trip.deliveredDate).split(' ')[0]}</span>}
                        </div>
                      ) : (
                        <span className="text-gray-400">Not delivered</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trip.tripDurationHours ? (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {trip.tripDurationHours} hrs
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
