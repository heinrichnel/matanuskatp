// ─── React & Context ─────────────────────────────────────────────
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

// ─── Types ───────────────────────────────────────────────────────
import { Trip } from '../../types';

// ─── UI Components ───────────────────────────────────────────────
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Input, Select } from '../ui/FormElements';
import { CheckCircle, Truck, Edit, Trash2, Eye, Download } from 'lucide-react';

// ─── Feature Components ──────────────────────────────────────────
import CompletedTripEditModal from './CompletedTripEditModal';
import TripDeletionModal from './TripDeletionModal';
import { useOutletContext } from 'react-router-dom';

// ─── Helper Functions ────────────────────────────────────────────
import { formatCurrency } from '../../utils/helpers';


interface CompletedTripsProps {
  trips?: Trip[];
  onView?: (trip: Trip) => void;
}

// Type for context provided by the outlet
interface OutletContextType {
  setSelectedTrip: (trip: Trip | null) => void;
  setEditingTrip: (trip: Trip | undefined) => void;
  setShowTripForm: (show: boolean) => void;
}

const CompletedTrips: React.FC<CompletedTripsProps> = (props) => {
  const { trips: contextTrips, updateTrip, deleteTrip } = useAppContext();
  const context = useOutletContext<OutletContextType>();
  
  // Use props if provided, otherwise use context
  const trips = props.trips || contextTrips.filter(t => t.status === 'completed');
  const onView = props.onView || context.setSelectedTrip;
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    client: '',
    driver: '',
    currency: ''
  });
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const userRole: 'admin' | 'manager' | 'operator' = 'admin';

  const filteredTrips = trips.filter(trip => {
    if (filters.startDate && trip.startDate < filters.startDate) return false;
    if (filters.endDate && trip.endDate > filters.endDate) return false;
    if (filters.client && trip.clientName !== filters.client) return false;
    if (filters.driver && trip.driverName !== filters.driver) return false;
    if (filters.currency && trip.revenueCurrency !== filters.currency) return false;
    return true;
  });

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      client: '',
      driver: '',
      currency: ''
    });
  };

  const handleEditSave = async (updatedTrip: Trip) => {
    await updateTrip(updatedTrip);
    setEditingTrip(null);
    alert('Trip updated successfully. Edit logged.');
  };

  const handleDelete = async (trip: Trip) => {
    try {
      setIsDeleting(true);
      await deleteTrip(trip.id);
      setDeletingTrip(null);
      alert('Trip deleted successfully. Deletion logged.');
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert(`Failed to delete trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const uniqueClients = [...new Set(trips.map(t => t.clientName))];
  const uniqueDrivers = [...new Set(trips.map(t => t.driverName))];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Completed Trips</h2>
        <Button variant="primary" size="md" icon={<Download className="w-5 h-5" />}>
          <span className="sr-only">Export</span>
        </Button>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader title="Filter Completed Trips" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={value => handleFilterChange('startDate', value)}
            />
            <Input
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={value => handleFilterChange('endDate', value)}
            />
            <Select
              label="Client"
              value={filters.client}
              onChange={value => handleFilterChange('client', value)}
              options={[{ label: 'All Clients', value: '' }, ...uniqueClients.map(c => ({ label: c, value: c }))]}
            />
            <Select
              label="Driver"
              value={filters.driver}
              onChange={value => handleFilterChange('driver', value)}
              options={[{ label: 'All Drivers', value: '' }, ...uniqueDrivers.map(d => ({ label: d, value: d }))]}
            />
            <Select
              label="Currency"
              value={filters.currency}
              onChange={value => handleFilterChange('currency', value)}
              options={[
                { label: 'All Currencies', value: '' },
                { label: 'ZAR (R)', value: 'ZAR' },
                { label: 'USD ($)', value: 'USD' }
              ]}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button size="sm" variant="outline" onClick={clearFilters}>
              <span className="sr-only">Clear Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-6">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <div>
          <div className="font-semibold text-green-800">Completed trips are shown below. Use filters to find specific trips or export data for reporting.</div>
        </div>
      </div>

      {/* Trip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map(trip => (
          <Card key={trip.id}>
            <CardHeader
              title={<span className="flex items-center gap-2"><Truck className="w-5 h-5 text-blue-500" />Fleet {trip.fleetNumber}</span>}
              subtitle={<span className="text-xs text-gray-500">{trip.route}</span>}
              action={
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" icon={<Eye className="w-4 h-4 text-blue-500" />} onClick={() => onView(trip)}>
                    <span className="sr-only">View</span>
                  </Button>
                  <Button size="sm" variant="outline" icon={<Edit className="w-4 h-4 text-green-600" />} onClick={() => setEditingTrip(trip)}>
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger" 
                    icon={<Trash2 className="w-4 h-4 text-red-600" />} 
                    onClick={() => setDeletingTrip(trip)}
                    disabled={isDeleting}
                  >
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              }
            />
            <CardContent>
              <div className="flex flex-col gap-2">
                <div className="text-lg font-bold text-gray-900">{trip.driverName}</div>
                <div className="text-sm text-gray-500">Client: {trip.clientName}</div>
                <div className="text-sm text-gray-500">Start: {trip.startDate} | End: {trip.endDate}</div>
                <div className="text-sm text-gray-500">Revenue: {formatCurrency(trip.baseRevenue, trip.revenueCurrency)}</div>
                <div className="flex gap-2 mt-2">
                  <Button size="xs" variant="outline" icon={<Eye className="w-4 h-4 text-blue-500" />} onClick={() => onView(trip)}>
                    <span className="sr-only">View</span>
                  </Button>
                  <Button size="xs" variant="outline" icon={<Edit className="w-4 h-4 text-green-600" />} onClick={() => setEditingTrip(trip)}>
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    size="xs" 
                    variant="danger" 
                    icon={<Trash2 className="w-4 h-4 text-red-600" />} 
                    onClick={() => setDeletingTrip(trip)}
                    disabled={isDeleting}
                    isLoading={isDeleting && deletingTrip?.id === trip.id}
                  >
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingTrip && (
        <CompletedTripEditModal
          isOpen={!!editingTrip}
          trip={editingTrip}
          onClose={() => setEditingTrip(null)}
          onSave={handleEditSave}
        />
      )}

      {deletingTrip && (
        <TripDeletionModal
          isOpen={!!deletingTrip}
          trip={deletingTrip}
          onClose={() => setDeletingTrip(null)}
          onDelete={handleDelete}
          userRole={userRole}
        />
      )}
    </div>
  );
};

export default CompletedTrips;