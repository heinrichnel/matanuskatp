import {
  Activity,
  AlertTriangle,
  Award,
  Calendar,
  Clock,
  LineChart,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AddDriverModal from "../../components/Models/Driver/AddDriverModal";

/**
 * Driver Management Page
 * Container for all driver management related functionality
 */
const DriverManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);

  const driverManagementFeatures = [
    { name: "Dashboard", icon: <Activity className="h-6 w-6" />, path: "/drivers" },
    {
      name: "Add Driver",
      icon: <PlusCircle className="h-6 w-6" />,
      action: () => setShowAddDriverModal(true),
    },
    { name: "Driver Profiles", icon: <Users className="h-6 w-6" />, path: "/drivers/profiles" },
    {
      name: "License Management",
      icon: <ShieldCheck className="h-6 w-6" />,
      path: "/drivers/licenses",
    },
    { name: "Training Records", icon: <Award className="h-6 w-6" />, path: "/drivers/training" },
    { name: "Performance", icon: <LineChart className="h-6 w-6" />, path: "/drivers/performance" },
    { name: "Scheduling", icon: <Calendar className="h-6 w-6" />, path: "/drivers/scheduling" },
    { name: "Hours of Service", icon: <Clock className="h-6 w-6" />, path: "/drivers/hours" },
    {
      name: "Violations",
      icon: <AlertTriangle className="h-6 w-6" />,
      path: "/drivers/violations",
    },
  ];

  const handleFeatureClick = (feature: any) => {
    if (feature.action) {
      feature.action();
    } else if (feature.path) {
      navigate(feature.path);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Driver Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddDriverModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add New Driver
          </button>
          <button
            onClick={() => console.log("Export driver list")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Export Driver List
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-2 p-4">
          {driverManagementFeatures.map((feature, index) => (
            <button
              key={index}
              className="flex flex-col items-center justify-center p-4 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => handleFeatureClick(feature)}
            >
              <div className="p-2 bg-blue-100 rounded-full text-blue-600 mb-2">{feature.icon}</div>
              <span className="text-sm font-medium text-gray-700">{feature.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Outlet for nested routes */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <Outlet />
      </div>

      {/* Add Driver Modal */}
      <AddDriverModal
        isOpen={showAddDriverModal}
        onClose={() => setShowAddDriverModal(false)}
        onSubmit={(driverData) => {
          console.log("Driver data submitted:", driverData);
          // In a real application, this would save the driver to the database
          alert("Driver added successfully!");
          setShowAddDriverModal(false);
        }}
      />
    </div>
  );
};

export default DriverManagementPage;
