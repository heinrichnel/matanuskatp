import React from 'react';
import { Link } from 'react-router-dom';

const TripManagement: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Trip Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Active Trips</h3>
          <p className="text-gray-600 mb-4">View and manage ongoing trips</p>
          <Link to="/trips/active" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Active
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Plan New Trip</h3>
          <p className="text-gray-600 mb-4">Create a new trip</p>
          <Link to="/trips/new" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Create Trip
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Completed Trips</h3>
          <p className="text-gray-600 mb-4">View history and analytics</p>
          <Link to="/trips/completed" className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            View History
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Trip Calendar</h3>
          <p className="text-gray-600 mb-4">View scheduled trips in calendar format</p>
          <Link to="/trips/calendar" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Open Calendar
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Route Planning</h3>
          <p className="text-gray-600 mb-4">Plan and optimize routes</p>
          <Link to="/trips/routes" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Plan Routes
          </Link>
        </div>
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Tools & Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/trips/maps" className="bg-white p-6 rounded-lg shadow-sm border hover:bg-gray-50 block">
            <h3 className="text-lg font-semibold mb-3">Fleet Tracking Map</h3>
            <p className="text-gray-600">Live map tracking with Wialon integration</p>
          </Link>
          
          <Link to="/trips/optimization" className="bg-white p-6 rounded-lg shadow-sm border hover:bg-gray-50 block">
            <h3 className="text-lg font-semibold mb-3">Route Optimization</h3>
            <p className="text-gray-600">Optimize route planning and execution</p>
          </Link>
          
          <Link to="/trips/driver-performance" className="bg-white p-6 rounded-lg shadow-sm border hover:bg-gray-50 block">
            <h3 className="text-lg font-semibold mb-3">Driver Performance</h3>
            <p className="text-gray-600">Monitor and improve driver metrics</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripManagement;
