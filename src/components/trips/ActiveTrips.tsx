import React, { useState } from 'react';

// ─── Types & Constants ───────────────────────────────────────────
import { Trip } from '../../types';

// ─── UI Components ───────────────────────────────────────────────
import { Select } from '../ui/FormElements';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { Edit, Trash2, Eye, AlertTriangle, Upload, Truck, CheckCircle, Calendar, User, MapPin, DollarSign } from 'lucide-react';
import { formatCurrency, formatDate, getAllFlaggedCosts, getUnresolvedFlagsCount, canCompleteTrip } from '../../utils/helpers';
import LoadImportModal from './LoadImportModal';
import TripStatusUpdateModal from './TripStatusUpdateModal';
import { useAppContext } from '../../context/AppContext';
import SyncIndicator from '../ui/SyncIndicator';
import { useOutletContext, useNavigate } from 'react-router-dom';
import LoadingIndicator from '../ui/LoadingIndicator';
import ErrorMessage from '../ui/ErrorMessage';

interface ActiveTripsProps {
  trips?: Trip[];
  onView?: (trip: Trip) => void;
  onEdit?: (trip: Trip) => void;
  onDelete?: (id: string) => void;
  onCompleteTrip?: (tripId: string) => void;
}

// Type for context provided by the outlet
interface OutletContextType {
  setSelectedTrip: (trip: Trip | null) => void;
  setEditingTrip: (trip: Trip | undefined) => void;
  setShowTripForm: (show: boolean) => void;
}

const ActiveTrips: React.FC<ActiveTripsProps> = (props) => {
  // Get functions from context
  const { trips: contextTrips, updateTripStatus, deleteTrip, completeTrip, isLoading } = useAppContext();
  const context = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  // Use props if provided, otherwise use context
  const trips = props.trips || contextTrips.filter(t => t.status === 'active');
  const onView = props.onView || context.setSelectedTrip;
  const onEdit = props.onEdit || ((trip: Trip) => {
    context.setEditingTrip(trip);
    context.setShowTripForm(true);
  });
  const onDelete = props.onDelete || deleteTrip;
  const onCompleteTrip = props.onCompleteTrip || completeTrip;

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [filterFleet, setFilterFleet] = useState<string>('');
  const [filterDriver, setFilterDriver] = useState<string>('');
  const [filterClient, setFilterClient] = useState<string>('');
  const [statusUpdateTrip, setStatusUpdateTrip] = useState<Trip | null>(null);
  const [statusUpdateType] = useState<'shipped' | 'delivered'>('shipped');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openImportModal = () => setIsImportModalOpen(true);
  const closeImportModal = () => setIsImportModalOpen(false);

  const handleDelete = async (id: string) => {
    const trip = trips.find((t) => t.id === id);
    if (trip && window.confirm(`Delete trip for fleet ${trip.fleetNumber}? This action cannot be undone.`)) {
      try {
        setIsDeleting(id);
        setError(null);
        await onDelete(id);
      } catch (error) {
        setError(`Failed to delete trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      setError(null);
      await updateTripStatus(tripId, status, notes);
      console.log(`✅ Trip ${tripId} status updated to ${status}`);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Active Trips</h2>
          <div className="flex items-center mt-1">
            <p className="text-gray-600 mr-3">Manage ongoing trips and track their status</p>
            <SyncIndicator />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="md" icon={<Upload className="w-5 h-5" />} onClick={openImportModal}>
            Import Trips
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={() => setError(null)} 
          className="mb-4"
        />
      )}
      
      {/* Loading state for the entire component */}
      {isLoading.loadTrips && (
        <LoadingIndicator text="Loading trips..." className="my-4" />
      )}
      <Card>
        <CardHeader title="Filter Active Trips" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Trip List - Vertical Layout */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No active trips found</h3>
          <p className="mt-1 text-gray-500">
            {filterFleet || filterDriver || filterClient ?
              'No trips match your current filter criteria.' :
              'Start by adding a new trip or importing trips from your system.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrips.map(trip => (
            <Card key={trip.id} className="hover:shadow-md transition-shadow">
              {/* Trip Card Content */}
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  {/* Trip Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <Truck className="w-5 h-5 text-blue-500 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Fleet {trip.fleetNumber}</h3>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      Active
                    </span>
                  </div>

                  {/* Trip Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-start space-x-2">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Driver</p>
                        <p className="font-medium">{trip.driverName}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Route</p>
                        <p className="font-medium">{trip.route}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Client</p>
                        <p className="font-medium">{trip.clientName}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Revenue</p>
                        <p className="font-medium text-green-600">{formatCurrency(trip.baseRevenue, trip.revenueCurrency)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Dates</p>
                      <p className="font-medium">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
                    </div>
                  </div>

                  {/* Flag indicator */}
                  {getAllFlaggedCosts([trip]).length > 0 && (
                    <div className="flex items-center text-amber-600 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      <span>
                        {getAllFlaggedCosts([trip]).length} flagged item{getAllFlaggedCosts([trip]).length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Button size="sm" variant="outline" icon={<Eye className="w-4 h-4" />} onClick={() => onView(trip)}>
                      View
                    </Button>
                    <Button size="sm" variant="outline" icon={<Edit className="w-4 h-4" />} onClick={() => onEdit(trip)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      icon={isDeleting === trip.id ? undefined : <Trash2 className="w-4 h-4" />}
                      onClick={() => handleDelete(trip.id)}
                      isLoading={isLoading[`deleteTrip-${trip.id}`] || isDeleting === trip.id}
                      disabled={isLoading[`deleteTrip-${trip.id}`] || isDeleting !== null}
                    >
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      icon={<CheckCircle className="w-4 h-4" />}
                      onClick={() => onCompleteTrip(trip.id)}
                      disabled={!canCompleteTrip(trip)}
                      isLoading={isLoading[`completeTrip-${trip.id}`]}
                      title={!canCompleteTrip(trip) ?
                        'Cannot complete: Unresolved flags' : 'Mark as completed'}
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <LoadImportModal isOpen={isImportModalOpen} onClose={closeImportModal} />
      {/* Status Update Modal */}
      {statusUpdateTrip && (
        <TripStatusUpdateModal
          isOpen={Boolean(statusUpdateTrip)}
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