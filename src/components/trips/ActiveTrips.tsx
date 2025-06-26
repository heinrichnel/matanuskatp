import React, { useState } from 'react';

// ─── Types & Constants ───────────────────────────────────────────
import { Trip } from '../../types';

// ─── UI Components ───────────────────────────────────────────────
import { Select } from '../ui/FormElements';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { Edit, Trash2, Eye, AlertTriangle, Upload, Truck, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import LoadImportModal from './LoadImportModal';
import TripStatusUpdateModal from './TripStatusUpdateModal';
import { useAppContext } from '../../context/AppContext';

interface ActiveTripsProps {
  trips: Trip[];
  onView: (trip: Trip) => void;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
  onCompleteTrip: (tripId: string) => void;
}

const ActiveTrips: React.FC<ActiveTripsProps> = ({ trips, onEdit, onDelete, onView, onCompleteTrip }) => {
  const { updateTripStatus } = useAppContext();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [filterFleet, setFilterFleet] = useState<string>('');
  const [filterDriver, setFilterDriver] = useState<string>('');
  const [filterClient, setFilterClient] = useState<string>('');
  const [statusUpdateTrip, setStatusUpdateTrip] = useState<Trip | null>(null);
  const [statusUpdateType] = useState<'shipped' | 'delivered'>('shipped');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const openImportModal = () => setIsImportModalOpen(true);
  const closeImportModal = () => setIsImportModalOpen(false);

  const handleDelete = async (id: string) => {
    const trip = trips.find(t => t.id === id);
    if (trip && confirm(`Delete trip for fleet ${trip.fleetNumber}? This cannot be undone.`)) {
      try {
        setIsDeleting(id); // Set loading state for this specific trip
        await onDelete(id);
        // No need to manually update UI - real-time listener will handle it
      } catch (error) {
        console.error("Error deleting trip:", error);
        alert(`Failed to delete trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsDeleting(null); // Clear loading state
      }
    }
  };

  // Handle trip status update
  const handleUpdateTripStatus = async (tripId: string, status: 'shipped' | 'delivered', notes: string) => {
    try {
      await updateTripStatus(tripId, status, notes);
      setStatusUpdateTrip(null);
    } catch (error) {
      console.error(`Error updating trip status to ${status}:`, error);
      throw error;
    }
  };

  // Apply filters
  const filteredTrips = trips.filter(trip => {
    if (filterFleet && trip.fleetNumber !== filterFleet) return false;
    if (filterDriver && trip.driverName !== filterDriver) return false;
    if (filterClient && trip.clientName !== filterClient) return false;
    return true;
  });

  // Get unique values for filters
  const uniqueFleets = [...new Set(trips.map(t => t.fleetNumber))].sort();
  const uniqueDrivers = [...new Set(trips.map(t => t.driverName))].sort();
  const uniqueClients = [...new Set(trips.map(t => t.clientName))].sort();

  // Clear filters
  const clearFilters = () => {
    setFilterFleet('');
    setFilterDriver('');
    setFilterClient('');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Active Trips</h2>
        <Button variant="primary" size="md" icon={<Upload className="w-5 h-5" />} onClick={openImportModal}>
          <span className="sr-only">Import Loads</span>
        </Button>
      </div>
      {/* Info Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-6">
        <CheckCircle className="w-6 h-6 text-green-500" />
        <div>
          <div className="font-semibold text-green-800">
            All trips imported via CSV, webhook, or added manually will appear here as active trips. You can view, edit, or delete any trip.
          </div>
        </div>
      </div>
      {/* Filters Section */}
      <Card>
        <CardHeader title="Filter Active Trips" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Select
              label="Fleet"
              value={filterFleet}
              onChange={setFilterFleet}
              options={[{ label: 'All Fleets', value: '' }, ...uniqueFleets.map(f => ({ label: f, value: f }))]}
            />
            <Select
              label="Driver"
              value={filterDriver}
              onChange={setFilterDriver}
              options={[{ label: 'All Drivers', value: '' }, ...uniqueDrivers.map(d => ({ label: d, value: d }))]}
            />
            <Select
              label="Client"
              value={filterClient}
              onChange={setFilterClient}
              options={[{ label: 'All Clients', value: '' }, ...uniqueClients.map(c => ({ label: c, value: c }))]}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button size="sm" variant="outline" onClick={clearFilters}>
              <span className="sr-only">Clear Filters</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Trip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrips.map(trip => (
          <Card key={trip.id}>
            <CardHeader
              title={<span className="flex items-center gap-2"><Truck className="w-5 h-5 text-blue-500" />Fleet {trip.fleetNumber}</span>}
              subtitle={<span className="text-xs text-gray-500">{trip.route}</span>}
              action={
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" icon={<Eye className="w-4 h-4" />} onClick={() => onView(trip)}>
                    <span className="sr-only">View</span>
                  </Button>
                  <Button size="sm" variant="outline" icon={<Edit className="w-4 h-4" />} onClick={() => onEdit(trip)}>
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger" 
                    icon={<Trash2 className="w-4 h-4" />} 
                    onClick={() => handleDelete(trip.id)}
                    isLoading={isDeleting === trip.id}
                    disabled={isDeleting !== null}
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
                  <Button size="xs" variant="success" icon={<CheckCircle className="w-4 h-4" />} onClick={() => onCompleteTrip(trip.id)}>
                    <span className="sr-only">Complete</span>
                  </Button>
                  <Button size="xs" variant="outline" icon={<AlertTriangle className="w-4 h-4" />} onClick={() => setStatusUpdateTrip(trip)}>
                    <span className="sr-only">Update Status</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <LoadImportModal isOpen={isImportModalOpen} onClose={closeImportModal} />
      {/* Status Update Modal */}
      {statusUpdateTrip && (
        <TripStatusUpdateModal
          isOpen={!!statusUpdateTrip}
          onClose={() => setStatusUpdateTrip(null)}
          trip={statusUpdateTrip}
          status={statusUpdateType}
          onUpdateStatus={handleUpdateTripStatus}
        />
      )}
    </div>
  );
};

export default ActiveTrips;