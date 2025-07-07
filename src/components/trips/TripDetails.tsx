import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Trip } from '../../types';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { 
  Route as RouteIcon, 
  Truck, 
  User, 
  DollarSign, 
  Calendar, 
  Package, 
  Edit, 
  Clock, 
  ArrowLeft,
  FileText
} from 'lucide-react';
import TripFinancialsPanel from './TripFinancialsPanel';
import LoadPlanningComponent from './LoadPlanningComponent';
import LoadingIndicator from '../ui/LoadingIndicator';

// This is a new component that shows detailed trip information 
// and integrates the new components we've implemented
const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getTrip, 
    updateTrip, 
    updateTripProgress,
    generateTripFinancialAnalysis,
    generateQuoteConfirmationPdf,
    generateLoadConfirmationPdf,
    isLoading 
  } = useAppContext();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'load' | 'route'>('overview');
  
  // Fetch trip data
  useEffect(() => {
    if (id) {
      const tripData = getTrip(id);
      if (tripData) {
        setTrip(tripData);
      } else {
        setError(`Trip with ID ${id} not found`);
      }
    }
  }, [id, getTrip]);
  
  // Handle trip progress update
  const handleUpdateProgress = async (status: Trip['tripProgressStatus']) => {
    if (!trip || !id) return;
    
    try {
      await updateTripProgress(id, status);
      
      // Refresh trip data
      const updatedTrip = getTrip(id);
      if (updatedTrip) {
        setTrip(updatedTrip);
      }
      
      alert(`Trip progress updated to: ${status}`);
    } catch (err: any) {
      setError(err.message || "Failed to update trip progress");
    }
  };
  
  // Handle generating quote PDF
  const handleGenerateQuote = async () => {
    if (!trip || !id) return;
    
    try {
      const pdfUrl = await generateQuoteConfirmationPdf(id);
      
      // Refresh trip data
      const updatedTrip = getTrip(id);
      if (updatedTrip) {
        setTrip(updatedTrip);
      }
      
      // Open PDF in new tab
      window.open(pdfUrl, '_blank');
    } catch (err: any) {
      setError(err.message || "Failed to generate quote PDF");
    }
  };
  
  // Handle generating load confirmation PDF
  const handleGenerateLoadConfirmation = async () => {
    if (!trip || !id) return;
    
    try {
      const pdfUrl = await generateLoadConfirmationPdf(id);
      
      // Refresh trip data
      const updatedTrip = getTrip(id);
      if (updatedTrip) {
        setTrip(updatedTrip);
      }
      
      // Open PDF in new tab
      window.open(pdfUrl, '_blank');
    } catch (err: any) {
      setError(err.message || "Failed to generate load confirmation PDF");
    }
  };
  
  if (!trip) {
    return (
      <div className="flex items-center justify-center h-96">
        {error ? (
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/trips')}
            >
              Go Back to Trips
            </Button>
          </div>
        ) : (
          <LoadingIndicator text="Loading trip details..." />
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm"
            className="mr-4"
            onClick={() => navigate('/trips')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Trips
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trip Details: {trip.fleetNumber} - {trip.route}</h1>
            <p className="text-gray-600">
              {formatDate(trip.startDate)} to {formatDate(trip.endDate)}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/route-planning/${id}`)}
            icon={<RouteIcon className="w-4 h-4" />}
          >
            Route Planning
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Navigate to edit trip (using existing EditTripModal or TripForm component)
              // Implementation would depend on your app's navigation structure
              alert("Edit trip functionality would be implemented here");
            }}
            icon={<Edit className="w-4 h-4" />}
          >
            Edit Trip
          </Button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'financials'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('financials')}
          >
            Financials
          </button>
          
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'load'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('load')}
          >
            Load Planning
          </button>
          
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'route'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('route')}
          >
            Route
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Trip Details Card */}
            <Card>
              <CardHeader title="Trip Details" />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Fleet</h3>
                      <p className="mt-1 text-lg text-gray-900">{trip.fleetNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Driver</h3>
                      <p className="mt-1 text-lg text-gray-900">{trip.driverName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <RouteIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Route</h3>
                      <p className="mt-1 text-lg text-gray-900">{trip.route}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                      <p className="mt-1 text-lg text-gray-900">{formatCurrency(trip.baseRevenue, trip.revenueCurrency)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Dates</h3>
                      <p className="mt-1 text-lg text-gray-900">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Distance</h3>
                      <p className="mt-1 text-lg text-gray-900">{trip.distanceKm?.toLocaleString() || 0} km</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs text-gray-500">Client</h4>
                      <p className="text-sm text-gray-900">{trip.clientName}</p>
                      <p className="text-xs text-gray-500">
                        {trip.clientType === 'internal' ? 'Internal Client' : 'External Client'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs text-gray-500">Status</h4>
                      <p className="text-sm text-gray-900 capitalize">{trip.status}</p>
                      {trip.completedAt && (
                        <p className="text-xs text-gray-500">Completed: {formatDate(trip.completedAt)}</p>
                      )}
                    </div>
                    
                    {trip.description && (
                      <div className="md:col-span-2">
                        <h4 className="text-xs text-gray-500">Description</h4>
                        <p className="text-sm text-gray-900">{trip.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Trip Progress Card */}
            <Card>
              <CardHeader title="Trip Progress" />
              <CardContent>
                <div className="mb-6">
                  <div className="relative">
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div 
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500`}
                        style={{ 
                          width: `${
                            trip.tripProgressStatus === 'completed' ? '100' :
                            trip.tripProgressStatus === 'delivered' ? '80' :
                            trip.tripProgressStatus === 'in_transit' ? '60' :
                            trip.tripProgressStatus === 'loaded' ? '40' :
                            trip.tripProgressStatus === 'confirmed' ? '20' :
                            '10'
                          }%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Booked</span>
                      <span>Confirmed</span>
                      <span>Loaded</span>
                      <span>In Transit</span>
                      <span>Delivered</span>
                      <span>Completed</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateProgress('confirmed')}
                    icon={<Clock className="w-4 h-4" />}
                  >
                    Mark as Confirmed
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateProgress('loaded')}
                    icon={<Package className="w-4 h-4" />}
                  >
                    Mark as Loaded
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateProgress('in_transit')}
                    icon={<Truck className="w-4 h-4" />}
                  >
                    Mark as In Transit
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateProgress('delivered')}
                    icon={<CheckCircle className="w-4 h-4" />}
                  >
                    Mark as Delivered
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleUpdateProgress('completed')}
                    icon={<CheckSquare className="w-4 h-4" />}
                  >
                    Mark as Completed
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Documents Card */}
            <Card>
              <CardHeader title="Trip Documents" />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Quote Confirmation */}
                  <div className={`p-4 rounded-lg ${trip.quoteConfirmationPdfUrl ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-start">
                      <FileText className={`w-6 h-6 ${trip.quoteConfirmationPdfUrl ? 'text-green-500' : 'text-gray-400'} mr-3`} />
                      <div>
                        <h3 className="text-md font-medium text-gray-900">Quote Confirmation</h3>
                        {trip.quoteConfirmationPdfUrl ? (
                          <div className="mt-2">
                            <p className="text-sm text-green-700 mb-2">Quote confirmation PDF is available.</p>
                            <Button
                              size="sm"
                              onClick={() => window.open(trip.quoteConfirmationPdfUrl, '_blank')}
                              icon={<Eye className="w-3 h-3" />}
                            >
                              View PDF
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-2">No quote confirmation PDF available.</p>
                            <Button
                              size="sm"
                              onClick={handleGenerateQuote}
                              isLoading={isLoading[`generateQuotePdf-${id}`]}
                              disabled={isLoading[`generateQuotePdf-${id}`]}
                              icon={<FileText className="w-3 h-3" />}
                            >
                              Generate PDF
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Load Confirmation */}
                  <div className={`p-4 rounded-lg ${trip.loadConfirmationPdfUrl ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-start">
                      <FileText className={`w-6 h-6 ${trip.loadConfirmationPdfUrl ? 'text-green-500' : 'text-gray-400'} mr-3`} />
                      <div>
                        <h3 className="text-md font-medium text-gray-900">Load Confirmation</h3>
                        {trip.loadConfirmationPdfUrl ? (
                          <div className="mt-2">
                            <p className="text-sm text-green-700 mb-2">Load confirmation PDF is available.</p>
                            <Button
                              size="sm"
                              onClick={() => window.open(trip.loadConfirmationPdfUrl, '_blank')}
                              icon={<Eye className="w-3 h-3" />}
                            >
                              View PDF
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-2">No load confirmation PDF available.</p>
                            <Button
                              size="sm"
                              onClick={handleGenerateLoadConfirmation}
                              isLoading={isLoading[`generateLoadPdf-${id}`]}
                              disabled={isLoading[`generateLoadPdf-${id}`]}
                              icon={<FileText className="w-3 h-3" />}
                            >
                              Generate PDF
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {activeTab === 'financials' && id && (
          <TripFinancialsPanel tripId={id} />
        )}
        
        {activeTab === 'load' && id && (
          <LoadPlanningComponent tripId={id} />
        )}
        
        {activeTab === 'route' && (
          <div className="bg-white rounded-lg shadow p-6">
            {trip.plannedRoute ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Route Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-700 mb-2">Origin</h3>
                    <p className="text-gray-800">{trip.plannedRoute.origin}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-700 mb-2">Destination</h3>
                    <p className="text-gray-800">{trip.plannedRoute.destination}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-700 mb-2">Distance</h3>
                    <p className="text-gray-800">{trip.plannedRoute.estimatedDistance?.toLocaleString()} km</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-700 mb-2">Duration</h3>
                    <p className="text-gray-800">{Math.round(trip.plannedRoute.estimatedDuration || 0)} minutes</p>
                  </div>
                </div>
                
                {trip.plannedRoute.waypoints && trip.plannedRoute.waypoints.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-md font-medium text-gray-800 mb-2">Waypoints</h3>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <ul className="space-y-2">
                        {trip.plannedRoute.waypoints.map((waypoint, index) => (
                          <li key={index} className="flex items-center">
                            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                              <span className="text-xs text-blue-600">{index + 1}</span>
                            </div>
                            <span>{waypoint}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button
                    onClick={() => navigate(`/route-planning/${id}`)}
                    icon={<RouteIcon className="w-4 h-4" />}
                  >
                    View Route Details
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <RouteIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Route Planned</h3>
                <p className="mt-1 text-gray-500">
                  Plan a route for this trip to see detailed routing information.
                </p>
                
                <div className="mt-6">
                  <Button
                    onClick={() => navigate(`/route-planning/${id}`)}
                    icon={<RouteIcon className="w-4 h-4" />}
                  >
                    Plan Route
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function CheckSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="9 11 12 14 22 4"></polyline>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  );
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}

function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
}

export default TripDetails;