import React, { useState, useEffect } from 'react';

// ─── Types & Constants ───────────────────────────────────────────
import { Trip } from '../../types';

// ─── Utilities ─────────────────────────────────────────────────
import { getTripsByStatus, analyzeTripData } from '../../utils/tripDebugger';

// ─── UI Components ───────────────────────────────────────────────
import { Select } from '../ui/FormElements';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { Edit, Trash2, Eye, AlertTriangle, Upload, Truck, CheckCircle, Calendar, User, MapPin, DollarSign, Plus, RefreshCcw, Download } from 'lucide-react';
import { formatCurrency, formatDate, getAllFlaggedCosts, canCompleteTrip } from '../../utils/helpers';
import LoadImportModal from './LoadImportModal';
import TripStatusUpdateModal from './TripStatusUpdateModal';
import { useAppContext } from '../../context/AppContext';
import SyncIndicator from '../ui/SyncIndicator';
import { useOutletContext } from 'react-router-dom';
import FirestoreConnectionError from '../ui/FirestoreConnectionError';
import LoadingIndicator from '../ui/LoadingIndicator';
import ErrorMessage from '../ui/ErrorMessage';

interface OutletContextType {
  setSelectedTrip: (trip: Trip | null) => void;
  setEditingTrip?: (trip: Trip | undefined) => void;
  setShowTripForm?: (show: boolean) => void;
}

interface ActiveTripsProps {
  trips?: Trip[];
  onView?: (trip: Trip) => void;
  onEdit?: (trip: Trip) => void;
  onDelete?: (id: string) => void;
  onCompleteTrip?: (tripId: string) => void;
}

const ActiveTrips: React.FC<ActiveTripsProps> = (props) => {
  const { trips: contextTrips, deleteTrip, completeTrip, updateTripStatus, isLoading, refreshTrips } = useAppContext();
  // Create a default context with empty functions to avoid TypeScript errors
  const defaultContext: OutletContextType = {
    setSelectedTrip: () => { },
    setEditingTrip: () => { },
    setShowTripForm: () => { }
  };

  const context = useOutletContext<OutletContextType | undefined>() || defaultContext;

  // Use props if provided, otherwise use context
  // Replace direct filter with improved getTripsByStatus utility that handles case sensitivity
  const trips = props.trips || getTripsByStatus(contextTrips, 'active');
  // Use fallbacks when context or context methods are undefined
  const onView = props.onView || context.setSelectedTrip;
  const onEdit = props.onEdit || ((trip: Trip) => {
    if (context.setEditingTrip) context.setEditingTrip(trip);
    if (context.setShowTripForm) context.setShowTripForm(true);
  });
  const onDelete = props.onDelete || deleteTrip;
  const onCompleteTrip = props.onCompleteTrip || completeTrip;
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Effect to analyze trip data when component mounts or trips change
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // In development mode, analyze trip data to help diagnose issues
      const analysis = analyzeTripData(contextTrips);
      setDebugInfo(analysis);

      // Enhanced logging for imported trips visibility
      console.log('=== TRIP VISIBILITY DEBUG ===');
      console.log('Total trips in context:', contextTrips.length);
      console.log('Active trips (filtered):', trips.length);
      console.log('Trip status analysis:', analysis);
      
      // Log recent trips (last 5) with their status
      const recentTrips = contextTrips
        .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
        .slice(0, 5);
      
      console.log('Recent trips (last 5):', recentTrips.map(trip => ({
        id: trip.id.substring(0, 8),
        status: trip.status,
        source: trip.loadRef ? 'Web Import' : 'Manual',
        loadRef: trip.loadRef,
        createdAt: trip.createdAt
      })));
      
      // Check for web-imported trips specifically
      const webImportedTrips = contextTrips.filter(trip => trip.loadRef);
      console.log('Web-imported trips:', webImportedTrips.length);
      console.log('Web-imported trip statuses:', webImportedTrips.map(trip => trip.status));
      
      console.log('=== END DEBUG ===');
    }
  }, [contextTrips, trips]);

  // Handle manual data refresh
  const handleRefreshData = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      setConnectionError(null);
      await refreshTrips();
      console.log('Trip data refreshed successfully');
    } catch (err) {
      console.error('Error refreshing trip data:', err);
      if (err instanceof Error && err.message.includes('Could not reach Cloud Firestore backend')) {
        setConnectionError(err);
      } else {
        setError('Failed to refresh trip data. Please try again.');
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [filterFleet, setFilterFleet] = useState<string>('');
  const [filterDriver, setFilterDriver] = useState<string>('');
  const [filterClient, setFilterClient] = useState<string>('');
  const [statusUpdateTrip, setStatusUpdateTrip] = useState<Trip | null>(null);
  const statusUpdateType: 'shipped' | 'delivered' = 'shipped';
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  <Button
    variant="outline"
    size="md"
    icon={<RefreshCcw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />}
    onClick={onClick || (() => {})}
    isLoading={isRefreshing}
    disabled={isRefreshing}
  >
    Refresh
  </Button>
  const openImportModal = () => setIsImportModalOpen(true);
  const closeImportModal = () => setIsImportModalOpen(false);
  {/* Debug information (only in development mode) */ }
  {
    process.env.NODE_ENV === 'development' && debugInfo && debugInfo.potentialIssues && debugInfo.potentialIssues.length > 0 && (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Trip Status Issues Detected</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc pl-5 space-y-1">
                {debugInfo.potentialIssues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-yellow-600 mt-2">
              Total trips: {debugInfo.totalTrips} |
              Active: {debugInfo.activeTrips} |
              Completed: {debugInfo.completedTrips}
            </p>
          </div>
        </div>
      </div>
    )
  }
  const handleDelete = async (id: string) => {
    const trip = trips.find((t) => t.id === id);
    if (trip && window.confirm(`Delete trip for fleet ${trip.fleetNumber}? This will permanently remove the trip and all related data. This action cannot be undone.`)) {
      try {
        setIsDeleting(id);
        setError(null);
        console.log(`🗑️ User confirmed delete for trip ${id}`);

        // Call onDelete (which maps to deleteTrip from context)
        await onDelete(id);

        console.log(`✅ Delete operation completed for trip ${id}`);

        // Optional: Refresh the trips list after deletion
        // (This would be needed if the real-time listeners aren't picking up the deletion)
      } catch (error) {
        console.error(`❌ Error in trip deletion UI flow:`, error);
        setError(`Failed to delete trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center">
              <p className="text-gray-600 mr-3">Manage ongoing trips and track their status</p>
              <SyncIndicator />
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="md"
            icon={<Download className="w-5 h-5" />}
            onClick={() => {
              // Create CSV export
              const headers = ['Fleet Number', 'Driver', 'Client', 'Route', 'Start Date', 'End Date', 'Revenue', 'Currency', 'Distance', 'Status'];
              const rows = filteredTrips.map(trip => [
                trip.fleetNumber,
                trip.driverName,
                trip.clientName,
                trip.route,
                trip.startDate,
                trip.endDate,
                trip.baseRevenue,
                trip.revenueCurrency,
                trip.distanceKm || 0,
                trip.status
              ]);
              
              const csvContent = [
                headers.join(','),
                ...rows.map(row => row.map(cell => 
                  typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
                ).join(','))
              ].join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `active-trips-${new Date().toISOString().split('T')[0]}.csv`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }}
            disabled={filteredTrips.length === 0 || isDeleting !== null}
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={<Upload className="w-5 h-5" />}
            onClick={onClick || (() => {})}
          >
            Import Trips
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => {
              // Enhanced Add Trip functionality - always clears previous trip data
              if (context.setEditingTrip) {
                context.setEditingTrip(undefined);
              }
              if (context.setShowTripForm) {
                context.setShowTripForm(true);
              } else {
                // Fallback: navigate to add trip page if context is unavailable
                console.log("🚀 Add Trip: Context unavailable, implementing fallback navigation");
                // You can add navigation logic here if needed
                alert("Add Trip functionality is being activated...");
              }
            }}
            disabled={isLoading.refreshTrips}
          >
            Add Trip
          </Button>
        </div>
      </div>

      {/* Connection error message */}
      {connectionError && (
        <FirestoreConnectionError
          error={connectionError}
          onRetry={handleRefreshData}
          className="mb-4"
        />
      )}

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
              onChange={e => setFilterFleet(e.target.value)}
              options={[{ label: 'All Fleets', value: '' }, ...uniqueFleets.map(f => ({ label: f, value: f }))]}
            />
            <Select
              label="Driver"
              value={filterDriver}
              onChange={e => setFilterDriver(e.target.value)}
              options={[{ label: 'All Drivers', value: '' }, ...uniqueDrivers.map(d => ({ label: d, value: d }))]}
            />
            <Select
              label="Client"
              value={filterClient}
              onChange={e => setFilterClient(e.target.value)}
              options={[{ label: 'All Clients', value: '' }, ...uniqueClients.map(c => ({ label: c, value: c }))]}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button size="sm" variant="outline" onClick={onClick || (() => {})}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trip List - Vertical Layout */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-100">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No active trips found</h3>
          <p className="mt-1 text-gray-500">
            {filterFleet || filterDriver || filterClient ?
              'No trips match your current filter criteria.' :
              'Start by adding a new trip or importing trips from your system.'}
          </p>
          {!filterFleet && !filterDriver && !filterClient && contextTrips.length > 0 && (
            <div className="mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={onClick || (() => {})}
                icon={<RefreshCcw className="w-4 h-4 mr-2" />}
              >
                Refresh Data
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                There are {contextTrips.length} total trips in the system, but none with 'active' status.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">

          {filteredTrips.map(trip => (
            <Card key={trip.id} className="hover:shadow-md transition-shadow">
              {/* Action Banner */}
              <div className="flex flex-wrap items-center justify-between bg-blue-50 border-b border-blue-200 px-4 py-2 rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-blue-900">Fleet {trip.fleetNumber}</span>
                  <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Active</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" icon={<Eye className="w-4 h-4" />} onClick={onClick || (() => {})}>
                    View
                  </Button>
                  <Button size="sm" variant="outline" icon={<Edit className="w-4 h-4" />} onClick={onClick || (() => {})}>
                    Edit
                  </Button>
                  <Button size="sm" variant="success" icon={<CheckCircle className="w-4 h-4" />} onClick={onClick || (() => {})} disabled={!canCompleteTrip(trip) || isLoading[`completeTrip-${trip.id}`]} isLoading={isLoading[`completeTrip-${trip.id}`]} title={!canCompleteTrip(trip) ? 'Cannot complete: Unresolved flags' : 'Mark as completed'}>
                    Complete
                  </Button>
                </div>
              </div>
              {/* Trip Card Content */}
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  {/* Trip Header */}
                  {/* ...existing code... */}

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
                    <Button size="sm" variant="outline" icon={<Eye className="w-4 h-4" />} onClick={onClick || (() => {})}>
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      icon={<Edit className="w-4 h-4" />}
                      onClick={onClick || (() => {})}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      icon={isDeleting === trip.id ? undefined : <Trash2 className="w-4 h-4" />}
                      onClick={onClick || (() => {})}
                      isLoading={isLoading[`deleteTrip-${trip.id}`] || isDeleting === trip.id}
                      disabled={isLoading[`deleteTrip-${trip.id}`] || isDeleting !== null}
                    >
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      icon={<CheckCircle className="w-4 h-4" />}
                      onClick={onClick || (() => {})}
                      disabled={!canCompleteTrip(trip) || isLoading[`completeTrip-${trip.id}`]}
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