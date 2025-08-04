import React from "react";
import { ChevronRight, Layers, Package, Plus, RefreshCw } from "lucide-react";
import Button from "../../components/ui/Button";
import Card, {  CardContent, CardHeader  } from '../../components/ui/consolidated/Card';
import { useAppContext } from "../../context/AppContext";

// Mock Data - vervang later met API data of props
const pendingLoads = [
  {
    id: 1001,
    scheduled: "2025-07-11",
    origin: "Windhoek",
    destination: "Walvis Bay",
    items: 13,
    weight: 1250,
  },
  {
    id: 1002,
    scheduled: "2025-07-12",
    origin: "Windhoek",
    destination: "Walvis Bay",
    items: 16,
    weight: 1500,
  },
  {
    id: 1003,
    scheduled: "2025-07-13",
    origin: "Windhoek",
    destination: "Walvis Bay",
    items: 19,
    weight: 1750,
  },
];

const availableVehicles = [
  {
    id: "VH-2001",
    type: "Semi-Trailer",
    capacity: 15000,
    location: "Windhoek",
    status: "Available",
  },
  {
    id: "VH-2002",
    type: "Box Truck",
    capacity: 8000,
    location: "Walvis Bay",
    status: "Available",
  },
  {
    id: "VH-2003",
    type: "Flatbed",
    capacity: 12000,
    location: "Windhoek",
    status: "Available",
  },
  {
    id: "VH-2004",
    type: "Container Truck",
    capacity: 20000,
    location: "Swakopmund",
    status: "Available",
  },
];

const loadTemplates = [
  {
    name: "Standard Container",
    description: "40ft Container",
    items: 24,
    weight: 22000,
    time: 60,
  },
  {
    name: "Mixed Cargo",
    description: "Semi-Trailer",
    items: 18,
    weight: 15000,
    time: 90,
  },
];

const LoadPlanningPage: React.FC = () => {
  const { isLoading } = useAppContext();

  // Hier kan jy jou loadPlan/assignLoad funksies later bysit

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Load Planning</h1>
          <p className="text-gray-600">Optimize cargo loading for maximum efficiency</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" icon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
          <Button icon={<Plus className="w-4 h-4" />} disabled={isLoading.trips}>
            New Load Plan
          </Button>
        </div>
      </div>

      {/* PENDING LOADS */}
      <Card>
        <CardHeader title="Pending Loads" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingLoads.map((load) => (
              <div
                key={load.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Load #{load.id}</h3>
                      <p className="text-sm text-gray-500">Scheduled: {load.scheduled}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Origin:</span>
                    <span className="font-medium">{load.origin}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Destination:</span>
                    <span className="font-medium">{load.destination}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{load.items}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{load.weight} kg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AVAILABLE VEHICLES */}
      <Card>
        <CardHeader title="Available Vehicles for Loading" />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availableVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{vehicle.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.capacity} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button size="sm" variant="outline">
                        Assign Load
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* LOAD TEMPLATES */}
      <Card>
        <CardHeader title="Load Templates" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadTemplates.map((tpl, idx) => (
              <div
                key={tpl.name}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg mr-3">
                      <Layers className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{tpl.name}</h3>
                      <p className="text-sm text-gray-500">{tpl.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items per Load:</span>
                    <span className="font-medium">{tpl.items}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Optimal Weight:</span>
                    <span className="font-medium">{tpl.weight} kg</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Loading Time:</span>
                    <span className="font-medium">{tpl.time} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadPlanningPage;
