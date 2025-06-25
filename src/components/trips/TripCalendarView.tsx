import React, { useMemo } from 'react';
import { Trip } from '../../types';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { Calendar, Truck, User, MapPin, DollarSign, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/helpers';
import SyncIndicator from '../ui/SyncIndicator';

interface TripCalendarViewProps {
  trips: Trip[];
  onView: (trip: Trip) => void;
  onEdit?: (trip: Trip) => void;
  onDelete?: (id: string) => void;
  onCompleteTrip?: (tripId: string) => void;
}

const TripCalendarView: React.FC<TripCalendarViewProps> = ({
  trips,
  onView,
  onEdit,
  onDelete,
  onCompleteTrip
}) => {
  // Group trips by end date
  const tripsByEndDate = useMemo(() => {
    const grouped: Record<string, Trip[]> = {};
    
    trips.forEach(trip => {
      const endDate = trip.endDate;
      if (!grouped[endDate]) {
        grouped[endDate] = [];
      }
      grouped[endDate].push(trip);
    });
    
    return grouped;
  }, [trips]);
  
  // Sort dates in descending order (newest first)
  const sortedDates = useMemo(() => {
    return Object.keys(tripsByEndDate).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
  }, [tripsByEndDate]);
  
  // Format date for display
  const formatDateHeader = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trip Calendar</h2>
          <div className="flex items-center mt-1">
            <p className="text-gray-600 mr-3">View trips organized by completion date</p>
            <SyncIndicator />
          </div>
        </div>
      </div>
      
      {sortedDates.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No trips found</h3>
          <p className="mt-1 text-gray-500">No trips are available for the selected criteria.</p>
        </div>
      ) : (
        sortedDates.map(date => (
          <div key={date} className="space-y-4">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                {formatDateHeader(date)}
              </h3>
              <span className="ml-2 text-sm text-gray-500">
                ({tripsByEndDate[date].length} trip{tripsByEndDate[date].length !== 1 ? 's' : ''})
              </span>
            </div>
            
            <div className="space-y-4">
              {tripsByEndDate[date].map(trip => (
                <Card key={trip.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      {/* Trip Details */}
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Truck className="w-5 h-5 text-blue-500 mr-2" />
                          <h4 className="text-lg font-medium text-gray-900">
                            Fleet {trip.fleetNumber} - {trip.route}
                          </h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-3">
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
                              <p className="text-sm text-gray-500">Client</p>
                              <p className="font-medium">{trip.clientName}</p>
                              <p className="text-xs text-gray-500">
                                {trip.clientType === 'internal' ? 'Internal Client' : 'External Client'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Duration</p>
                              <p className="font-medium">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-sm text-gray-500">Revenue</p>
                              <p className="font-medium text-green-600">
                                {formatCurrency(trip.baseRevenue, trip.revenueCurrency)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Flag indicator */}
                        {trip.costs && trip.costs.some(c => c.isFlagged) && (
                          <div className="flex items-center mt-3 text-amber-600 text-sm">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            <span>
                              {trip.costs.filter(c => c.isFlagged).length} flagged item{trip.costs.filter(c => c.isFlagged).length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                        
                        {/* Status indicator */}
                        <div className="mt-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            trip.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            trip.status === 'invoiced' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {trip.status === 'completed' ? (
                              <><CheckCircle className="w-3 h-3 mr-1" /> Completed</>
                            ) : trip.status === 'invoiced' ? (
                              <><DollarSign className="w-3 h-3 mr-1" /> Invoiced</>
                            ) : (
                              <><Clock className="w-3 h-3 mr-1" /> Active</>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex md:flex-col gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => onView(trip)}
                        >
                          View Details
                        </Button>
                        
                        {onEdit && trip.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => onEdit(trip)}
                          >
                            Edit
                          </Button>
                        )}
                        
                        {onCompleteTrip && trip.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="success" 
                            onClick={() => onCompleteTrip(trip.id)}
                            disabled={trip.costs && trip.costs.some(c => c.isFlagged && c.investigationStatus !== 'resolved')}
                            title={trip.costs && trip.costs.some(c => c.isFlagged && c.investigationStatus !== 'resolved') ? 
                              'Cannot complete: Unresolved flags' : 'Mark as completed'}
                          >
                            Complete
                          </Button>
                        )}
                        
                        {onDelete && trip.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="danger" 
                            onClick={() => onDelete(trip.id)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TripCalendarView;