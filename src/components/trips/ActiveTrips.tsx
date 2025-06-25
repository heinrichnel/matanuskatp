import React, { useState, useEffect } from 'react';

// ─── Types & Constants ───────────────────────────────────────────
import { Trip } from '../../types';

// ─── UI Components ───────────────────────────────────────────────
import { Select } from '../ui/FormElements';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { Edit, Trash2, Eye, AlertTriangle, Upload, Truck, CheckCircle, Calendar } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import LoadImportModal from './LoadImportModal';
import TripStatusUpdateModal from './TripStatusUpdateModal';
import { useAppContext } from '../../context/AppContext';
import SyncIndicator from '../ui/SyncIndicator';
import { useSyncContext } from '../../context/SyncContext';

interface ActiveTripsProps {
  trips: Trip[];
  onView: (trip: Trip) => void;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
  onCompleteTrip: (tripId: string) => void;
}

const ActiveTrips: React.FC<ActiveTripsProps> = ({ trips, onEdit, onDelete, onView, onCompleteTrip }) => {
  const { updateTripStatus } = useAppContext();
  const { subscribeToTrip } = useSyncContext();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [filterFleet, setFilterFleet] = useState<string>('');
  const [filterDriver, setFilterDriver] = useState<string>('');
  const [filterClient, setFilterClient] = useState<string>('');
  const [statusUpdateTrip, setStatusUpdateTrip] = useState<Trip | null>(null);
  const [statusUpdateType] = useState<'shipped' | 'delivered'>('shipped');
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const openImportModal = () => setIsImportModalOpen(true);
  const closeImportModal = () => setIsImportModalOpen(false);

  // Subscribe to real-time updates for all active trips
  useEffect(() => {
    trips.forEach(trip => {
      subscribeToTrip(trip.id);
    });
  }, [trips, subscribeToTrip]);

  const handleDelete = async (id: string) => {
    const trip = trips.find(t => t.id === id);
    if (trip && confirm(`Delete trip for fleet ${trip.fleetNumber}? This cannot be undone.`)) {
      setIsLoading(prev => ({ ...prev, [id]: true }));
      try {
        await onDelete(id);
      } finally {
        setIsLoading(prev => ({ ...prev, [id]: false }));
      }
    }
  };

  const handleCompleteTrip = async (tripId: string) => {
    setIsLoading(prev => ({ ...prev, [tripId]: true }));
    try {
      await onCompleteTrip(tripId);
    } finally {
      setIsLoading(prev => ({ ...prev, [tripId]: false }));
    }
  };

  // Handle trip status update
  const handleUpdateTripStatus = async (tripId: string, status: 'shipped' | 'delivered', notes: string) => {
    setIsLoading(prev => ({ ...prev, [tripId]: true }));
    try {
      await updateTripStatus(tripId, status, notes);
      setStatusUpdateTrip(null);
    } catch (error) {
      console.error(`Error updating trip status to ${status}:`, error);
      throw error;
    } finally {
      setIsLoading(prev => ({ ...prev, [tripId]: false }));
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

  // Group trips by date
  const tripsByDate: Record<string, Trip[]> = {};
  filteredTrips.forEach(trip => {
    const date = new Date(trip.startDate).toISOString().split('T')[0];
    if (!tripsByDate[date]) {
      tripsByDate[date] = [];
    }
    tripsByDate[date].push(trip);
  });

  // Sort dates in descending order
  const sortedDates = Object.keys(tripsByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Active Trips</h2>
          <div className="flex items-center mt-1">
            <p className="text-gray-600 mr-3">Manage ongoing trips and track their status</p>
            <SyncIndicator />
          </div>
        </div>
        <Button variant="primary" size="md" icon={<Upload className="w-5 h-5" />} onClick={openImportModal}>
          Import Trips
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
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trips by Date */}
      {sortedDates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No active trips</h3>
          <p className="mt-1 text-gray-500">Get started by adding a new trip or importing trips.</p>
        </div>
      ) : (
        sortedDates.map(date => (
          <div key={date} className="space-y-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <span className="ml-2 text-sm text-gray-500">
                ({tripsByDate[date].length} trip{tripsByDate[date].length !== 1 ? 's' : ''})
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripsByDate[date].map(trip => (
                <Card key={trip.id}>
                  <CardHeader
                    title={<span className="flex items-center gap-2"><Truck className="w-5 h-5 text-blue-500" />Fleet {trip.fleetNumber}</span>}
                    subtitle={<span className="text-xs text-gray-500">{trip.route}</span>}
                    action={
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" icon={<Eye className="w-4 h-4" />} onClick={() => onView(trip)}>
                          View
                        </Button>
                        <Button size="sm" variant="outline" icon={<Edit className="w-4 h-4" />} onClick={() => onEdit(trip)}>
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger" 
                          icon={<Trash2 className="w-4 h-4" />} 
                          onClick={() => handleDelete(trip.id)}
                          isLoading={isLoading[trip.id]}
                        >
                          Delete
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
                      
                      {/* Flag indicator */}
                      {trip.costs && trip.costs.some(c => c.isFlagged) && (
                        <div className="flex items-center mt-1 text-amber-600 text-sm">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          <span>
                            {trip.costs.filter(c => c.isFlagged).length} flagged item{trip.costs.filter(c => c.isFlagged).length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-2">
                        <Button 
                          size="xs" 
                          variant="success" 
                          icon={<CheckCircle className="w-4 h-4" />} 
                          onClick={() => handleCompleteTrip(trip.id)}
                          isLoading={isLoading[trip.id]}
                          disabled={trip.costs && trip.costs.some(c => c.isFlagged && c.investigationStatus !== 'resolved')}
                          title={trip.costs && trip.costs.some(c => c.isFlagged && c.investigationStatus !== 'resolved') ? 
                            'Cannot complete: Unresolved flags' : 'Mark as completed'}
                        >
                          Complete
                        </Button>
                        <Button 
                          size="xs" 
                          variant="outline" 
                          icon={<AlertTriangle className="w-4 h-4" />} 
                          onClick={() => setStatusUpdateTrip(trip)}
                        >
                          Update Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}

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