import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SupportedCurrency, formatCurrency } from '../../lib/currency';

interface Trip {
  id: string;
  tripNumber: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'scheduled';
  driver: string;
  vehicle: string;
  distance: number;
  cost: number;
  costBreakdown?: {
    fuel?: number;
    maintenance?: number;
    driver?: number;
    tolls?: number;
    other?: number;
  };
}

interface ActiveTripsProps {
  displayCurrency: SupportedCurrency;
}

// Mock active trips data with cost breakdown
const initialActiveTrips: Trip[] = [
  {
    id: '1',
    tripNumber: 'TR-2023-001',
    origin: 'Chicago, IL',
    destination: 'Indianapolis, IN',
    startDate: '2025-07-15T08:00:00',
    endDate: '2025-07-17T16:00:00',
    status: 'active',
    driver: 'John Smith',
    vehicle: 'Truck 123',
    distance: 295,
    cost: 1250.75,
    costBreakdown: {
      fuel: 650.25,
      maintenance: 150.00,
      driver: 350.50,
      tolls: 75.00,
      other: 25.00
    }
  },
  {
    id: '2',
    tripNumber: 'TR-2023-002',
    origin: 'Detroit, MI',
    destination: 'Columbus, OH',
    startDate: '2025-07-16T09:00:00',
    endDate: '2025-07-18T14:00:00',
    status: 'active',
    driver: 'Sarah Johnson',
    vehicle: 'Truck 456',
    distance: 356,
    cost: 1450.50,
    costBreakdown: {
      fuel: 725.50,
      maintenance: 175.00,
      driver: 400.00,
      tolls: 100.00,
      other: 50.00
    }
  },
  {
    id: '3',
    tripNumber: 'TR-2023-003',
    origin: 'St. Louis, MO',
    destination: 'Nashville, TN',
    startDate: '2025-07-16T10:30:00',
    endDate: '2025-07-18T12:00:00',
    status: 'active',
    driver: 'Mike Wilson',
    vehicle: 'Truck 789',
    distance: 478,
    cost: 1875.25,
    costBreakdown: {
      fuel: 950.25,
      maintenance: 225.00,
      driver: 500.00,
      tolls: 125.00,
      other: 75.00
    }
  }
];

const ActiveTrips: React.FC<ActiveTripsProps> = ({ displayCurrency }) => {
  const [activeTrips, setActiveTrips] = useState<Trip[]>(initialActiveTrips);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [editForm, setEditForm] = useState<{
    cost: number;
    fuel?: number;
    maintenance?: number;
    driver?: number;
    tolls?: number;
    other?: number;
  }>({
    cost: 0,
    fuel: 0,
    maintenance: 0,
    driver: 0,
    tolls: 0,
    other: 0
  });

  const handleEditClick = (trip: Trip) => {
    setEditingTrip(trip);
    setEditForm({
      cost: trip.cost,
      fuel: trip.costBreakdown?.fuel || 0,
      maintenance: trip.costBreakdown?.maintenance || 0,
      driver: trip.costBreakdown?.driver || 0,
      tolls: trip.costBreakdown?.tolls || 0,
      other: trip.costBreakdown?.other || 0,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    setEditForm(prev => ({ 
      ...prev, 
      [name]: numValue 
    }));
    
    // Auto-calculate total cost
    if (name !== 'cost') {
      const updatedValues = { ...editForm, [name]: numValue };
      const totalCost = (updatedValues.fuel || 0) + 
                        (updatedValues.maintenance || 0) + 
                        (updatedValues.driver || 0) + 
                        (updatedValues.tolls || 0) + 
                        (updatedValues.other || 0);
      
      setEditForm(prev => ({
        ...prev,
        [name]: numValue,
        cost: totalCost
      }));
    }
  };

  const handleSave = () => {
    if (!editingTrip) return;

    const updatedTrips = activeTrips.map(trip => {
      if (trip.id === editingTrip.id) {
        return {
          ...trip,
          cost: editForm.cost,
          costBreakdown: {
            fuel: editForm.fuel,
            maintenance: editForm.maintenance,
            driver: editForm.driver,
            tolls: editForm.tolls,
            other: editForm.other
          }
        };
      }
      return trip;
    });

    setActiveTrips(updatedTrips);
    setEditingTrip(null);
  };

  const handleCancel = () => {
    setEditingTrip(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Active Trips</h1>
          <p className="text-gray-600">Showing {activeTrips.length} active trips</p>
        </div>
        <div>
          <Link
            to="/trips/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + New Trip
          </Link>
        </div>
      </div>

      {editingTrip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit Trip Costs: {editingTrip.tripNumber}</h2>
            <div className="mb-4">
              <p><span className="font-medium">Origin:</span> {editingTrip.origin}</p>
              <p><span className="font-medium">Destination:</span> {editingTrip.destination}</p>
              <p><span className="font-medium">Driver:</span> {editingTrip.driver}</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Cost</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="fuel"
                      value={editForm.fuel}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Cost</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="maintenance"
                      value={editForm.maintenance}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver Cost</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="driver"
                      value={editForm.driver}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tolls</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="tolls"
                      value={editForm.tolls}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Costs</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="other"
                      value={editForm.other}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
                  <div className="mt-1 relative rounded-md shadow-sm bg-gray-50">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="cost"
                      value={editForm.cost}
                      readOnly
                      className="bg-gray-50 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Total is calculated automatically</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trip Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver / Vehicle</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Completion</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTrips.map((trip) => (
                <tr key={trip.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {trip.tripNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium">From: {trip.origin}</span>
                      <span>To: {trip.destination}</span>
                      <span className="text-xs text-gray-400">{trip.distance} miles</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium">{trip.driver}</span>
                      <span className="text-xs">{trip.vehicle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(trip.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(trip.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      In Progress
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{formatCurrency(trip.cost, displayCurrency)}</div>
                      {trip.costBreakdown && (
                        <button 
                          className="text-xs text-blue-600 hover:underline mt-1"
                          onClick={() => handleEditClick(trip)}
                        >
                          View Breakdown
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">View</button>
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleEditClick(trip)}
                      >
                        Edit Costs
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActiveTrips;
