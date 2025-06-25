import React, { useState } from 'react';
import { Trip } from '../../types';
import { useAppContext } from '../../context/AppContext';
import TripCalendarView from './TripCalendarView';
import TripDetails from './TripDetails';
import TripForm from './TripForm';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Select, Input } from '../ui/FormElements';
import { Calendar, Filter, Plus } from 'lucide-react';
import Modal from '../ui/Modal';

const TripCalendarPage: React.FC = () => {
  const { trips, updateTrip, addTrip, deleteTrip, completeTrip } = useAppContext();
  
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showTripForm, setShowTripForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    client: '',
    driver: '',
    dateRange: { start: '', end: '' }
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Apply filters
  const filteredTrips = trips.filter(trip => {
    if (filters.status && trip.status !== filters.status) return false;
    if (filters.client && trip.clientName !== filters.client) return false;
    if (filters.driver && trip.driverName !== filters.driver) return false;
    if (filters.dateRange.start && trip.endDate < filters.dateRange.start) return false;
    if (filters.dateRange.end && trip.endDate > filters.dateRange.end) return false;
    return true;
  });
  
  // Get unique values for filters
  const uniqueClients = [...new Set(trips.map(t => t.clientName))].sort();
  const uniqueDrivers = [...new Set(trips.map(t => t.driverName))].sort();
  
  // Handle filter changes
  const handleFilterChange = (field: string, value: string) => {
    if (field.includes('dateRange')) {
      const [, dateField] = field.split('.');
      setFilters(prev => ({
        ...prev,
        dateRange: {
          ...prev.dateRange,
          [dateField]: value
        }
      }));
    } else {
      setFilters(prev => ({ ...prev, [field]: value }));
    }
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: '',
      client: '',
      driver: '',
      dateRange: { start: '', end: '' }
    });
  };
  
  // Handle add trip
  const handleAddTrip = async (tripData: Omit<Trip, "id" | "costs" | "status">) => {
    try {
      setIsLoading(true);
      const tripId = await addTrip(tripData);
      setShowTripForm(false);
      setEditingTrip(undefined);
      alert(`Trip created successfully!\n\nFleet: ${tripData.fleetNumber}\nDriver: ${tripData.driverName}\nRoute: ${tripData.route}\n\nTrip ID: ${tripId}`);
    } catch (error) {
      console.error("Error adding trip:", error);
      alert("Error creating trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle update trip
  const handleUpdateTrip = async (tripData: Omit<Trip, "id" | "costs" | "status">) => {
    if (editingTrip) {
      try {
        setIsLoading(true);
        const updatedTrip: Trip = {
          ...editingTrip,
          ...tripData,
          id: editingTrip.id,
          costs: editingTrip.costs,
          status: editingTrip.status,
          additionalCosts: editingTrip.additionalCosts || [],
          delayReasons: editingTrip.delayReasons || [],
          followUpHistory: editingTrip.followUpHistory || [],
        };
        await updateTrip(updatedTrip);
        setShowTripForm(false);
        setEditingTrip(undefined);
        alert("Trip updated successfully!");
      } catch (error) {
        console.error("Error updating trip:", error);
        alert("Error updating trip. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Handle delete trip
  const handleDeleteTrip = async (id: string) => {
    if (confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
      try {
        setIsLoading(true);
        await deleteTrip(id);
        alert("Trip deleted successfully!");
      } catch (error) {
        console.error("Error deleting trip:", error);
        alert("Error deleting trip. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Handle complete trip
  const handleCompleteTrip = async (tripId: string) => {
    try {
      setIsLoading(true);
      await completeTrip(tripId);
      alert("Trip marked as completed successfully!");
    } catch (error) {
      console.error("Error completing trip:", error);
      alert("Error completing trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Calendar</h1>
          <p className="text-lg text-gray-600 mt-1">View and manage trips organized by completion date</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="w-4 h-4" />}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            onClick={() => {
              setEditingTrip(undefined);
              setShowTripForm(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Trip
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader title="Filter Trips" />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Status"
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                options={[
                  { label: 'All Statuses', value: '' },
                  { label: 'Active', value: 'active' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Invoiced', value: 'invoiced' }
                ]}
              />
              
              <Select
                label="Client"
                value={filters.client}
                onChange={(value) => handleFilterChange('client', value)}
                options={[
                  { label: 'All Clients', value: '' },
                  ...uniqueClients.map(c => ({ label: c, value: c }))
                ]}
              />
              
              <Select
                label="Driver"
                value={filters.driver}
                onChange={(value) => handleFilterChange('driver', value)}
                options={[
                  { label: 'All Drivers', value: '' },
                  ...uniqueDrivers.map(d => ({ label: d, value: d }))
                ]}
              />
              
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="From Date"
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(value) => handleFilterChange('dateRange.start', value)}
                />
                <Input
                  label="To Date"
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(value) => handleFilterChange('dateRange.end', value)}
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Calendar View */}
      <TripCalendarView
        trips={filteredTrips}
        onView={setSelectedTrip}
        onEdit={(trip) => {
          setEditingTrip(trip);
          setShowTripForm(true);
        }}
        onDelete={handleDeleteTrip}
        onCompleteTrip={handleCompleteTrip}
      />
      
      {/* Trip Details Modal */}
      {selectedTrip && (
        <TripDetails
          trip={selectedTrip}
          onBack={() => setSelectedTrip(null)}
        />
      )}
      
      {/* Trip Form Modal */}
      <Modal
        isOpen={showTripForm}
        onClose={() => {
          setShowTripForm(false);
          setEditingTrip(undefined);
        }}
        title={editingTrip ? "Edit Trip" : "Add New Trip"}
        maxWidth="lg"
      >
        <TripForm
          onSubmit={editingTrip ? handleUpdateTrip : handleAddTrip}
          onCancel={() => {
            setShowTripForm(false);
            setEditingTrip(undefined);
          }}
          trip={editingTrip}
        />
      </Modal>
    </div>
  );
};

export default TripCalendarPage;