import React, { useEffect, useState } from "react";
import Timeline, { TimelineHeaders, SidebarHeader, DateHeader, TimelineMarkers } from "react-calendar-timeline";
import 'react-calendar-timeline/lib/Timeline.css';
import { format, addWeeks, subWeeks, parseISO, isValid, startOfWeek, endOfWeek } from 'date-fns';
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase"; // Adjust to your path
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Truck, Flag, AlertTriangle, 
  CheckCircle, Filter, Search, Download, DollarSign } from 'lucide-react';

interface Vehicle {
  id: string;
  title: string;
  fleetNumber?: string;
  registration?: string;
  group?: string;
}

interface Trip {
  id: string;
  group: string; // vehicleId or fleetNo
  title: string;
  start_time: number;
  end_time: number;
  color?: string;
  type?: string;
  status?: string;
  fleetNumber?: string;
  clientName?: string;
  route?: string;
  driverName?: string;
  background?: string;
  fromFirestore?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  Retail: "#f59e42",
  Vendor: "#22c55e",
  Maintenance: "#f87171",
  Empty: "#a3a3a3",
  Lime: "#84cc16",
  active: "#3b82f6",
  completed: "#10b981",
  invoiced: "#f59e0b",
  paid: "#6366f1"
};

function getTripColor(type: string) {
  return TYPE_COLORS[type] || "#64748b"; 
}

const TripTimelinePage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfWeek(addWeeks(new Date(), 1)));
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [timelineMode, setTimelineMode] = useState<"week" | "month">("week");
  const [filterType, setFilterType] = useState<string>("all");

  // Fetch data from Firestore, or use your trip API
  useEffect(() => {
    async function fetchTrips() {
      try {
        setLoading(true);
        
        // Get trips from Firestore, with proper filtering and ordering
        const tripsQuery = query(
          collection(db, "trips"),
          orderBy("startDate", "desc"),
          limit(100) // Limit for performance
        );
        
        const snap = await getDocs(tripsQuery);
        console.log(`Found ${snap.size} trips in Firestore`);
        
        // Process trip documents
        const tripDocs = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
        
        // Extract unique vehicles from trips
        const vehicleMap: Record<string, Vehicle> = {};
        
        // Create timeline items from trips
        const tripItems: Trip[] = tripDocs.map(trip => {
          // Use fleetNumber as the group identifier
          const groupId = trip.fleetNumber || trip.vehicleId || 'unknown';
          
          // Store vehicle info
          if (!vehicleMap[groupId]) {
            vehicleMap[groupId] = { 
              id: groupId,
              title: trip.fleetNumber || trip.vehicleName || groupId,
              fleetNumber: trip.fleetNumber,
              registration: trip.registration
            };
          }
          
          // Parse dates, checking if they're valid
          let startTime: number, endTime: number;
          
          // Try to parse startDate or startTime
          if (trip.startDate && isValid(parseISO(trip.startDate))) {
            startTime = parseISO(trip.startDate).getTime();
          } else if (trip.startTime && isValid(parseISO(trip.startTime))) {
            startTime = parseISO(trip.startTime).getTime();
          } else {
            startTime = Date.now(); // Fallback
          }
          
          // Try to parse endDate or endTime
          if (trip.endDate && isValid(parseISO(trip.endDate))) {
            endTime = parseISO(trip.endDate).getTime();
          } else if (trip.endTime && isValid(parseISO(trip.endTime))) {
            endTime = parseISO(trip.endTime).getTime();
          } else {
            endTime = startTime + (24 * 60 * 60 * 1000); // Default to 1 day duration
          }
          
          // Format title based on available data
          const title = trip.route || 
                       (trip.clientName ? `Trip to ${trip.clientName}` : 
                       trip.label || 'Untitled Trip');
                        
          return {
            id: trip.id,
            group: groupId,
            title: title,
            start_time: startTime,
            end_time: endTime,
            color: getTripColor(trip.status || trip.type || 'active'),
            type: trip.type,
            status: trip.status,
            fleetNumber: trip.fleetNumber,
            clientName: trip.clientName,
            route: trip.route,
            driverName: trip.driverName,
            background: trip.status === 'completed' ? '#dcfce7' : 
                        trip.status === 'invoiced' ? '#fef3c7' : 
                        trip.status === 'paid' ? '#e0e7ff' : '#dbeafe',
            fromFirestore: true
          };
        });
        
        // Convert vehicle map to array
        const vehiclesArray = Object.values(vehicleMap);
        
        console.log(`Processed ${tripItems.length} trips for timeline`);
        console.log(`Found ${vehiclesArray.length} unique vehicles`);
        
        setTrips(tripItems);
        setVehicles(vehiclesArray);
      } catch (error) {
        console.error('Error fetching trips for timeline:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, [timelineMode]);

  // Navigation functions
  const goToNextPeriod = () => {
    if (timelineMode === 'week') {
      setStartDate(addWeeks(startDate, 1));
      setEndDate(addWeeks(endDate, 1));
    } else {
      setStartDate(addWeeks(startDate, 4));
      setEndDate(addWeeks(endDate, 4));
    }
  };
  
  const goToPreviousPeriod = () => {
    if (timelineMode === 'week') {
      setStartDate(subWeeks(startDate, 1));
      setEndDate(subWeeks(endDate, 1));
    } else {
      setStartDate(subWeeks(startDate, 4));
      setEndDate(subWeeks(endDate, 4));
    }
  };
  
  const goToToday = () => {
    if (timelineMode === 'week') {
      setStartDate(startOfWeek(new Date()));
      setEndDate(endOfWeek(addWeeks(new Date(), 1)));
    } else {
      setStartDate(startOfWeek(new Date()));
      setEndDate(endOfWeek(addWeeks(new Date(), 4)));
    }
  };
  
  const toggleTimelineMode = () => {
    if (timelineMode === 'week') {
      setTimelineMode('month');
      // Expand to a month view
      setEndDate(endOfWeek(addWeeks(startDate, 3)));
    } else {
      setTimelineMode('week');
      // Contract to a week view
      setEndDate(endOfWeek(addWeeks(startDate, 1)));
    }
  };

  // Filter trips by type/status
  const filteredTrips = trips.filter(trip => {
    if (filterType === 'all') return true;
    return trip.status === filterType || trip.type === filterType;
  });
  
  // Filter vehicles for search and only show vehicles with trips
  const vehiclesWithTrips = new Set(filteredTrips.map(t => t.group));
  const filteredVehicles = vehicles
    .filter(v => vehiclesWithTrips.has(v.id))
    .filter(v => search 
      ? v.title.toLowerCase().includes(search.toLowerCase()) 
      : true
    );

  // Custom item renderer for trip bars
  const itemRenderer = ({ item, itemContext, getItemProps }: any) => {
    const { left: leftResizer, right: rightResizer } = itemContext.dimensions;
    
    // Background style for different trip statuses
    const backgroundColor = item.background || '#dbeafe';
    
    // Base style with background color
    const baseStyle = {
      ...getItemProps({}),
      background: backgroundColor,
      border: `1px solid ${item.color || '#3b82f6'}`,
      borderLeft: `4px solid ${item.color || '#3b82f6'}`,
      borderRadius: '4px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
    };
    
    return (
      <div {...baseStyle}>
        <div style={{ 
          height: '100%', 
          paddingLeft: '8px', 
          paddingRight: '8px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center'
        }}>
          {item.status === 'completed' && <CheckCircle size={12} className="mr-1 text-green-600" />}
          {item.status === 'invoiced' && <Flag size={12} className="mr-1 text-amber-600" />}
          {item.status === 'paid' && <DollarSign size={12} className="mr-1 text-indigo-600" />}
          <div className="whitespace-nowrap overflow-hidden overflow-ellipsis text-xs">
            {item.title}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Trip Timeline</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            icon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            {/* Left side: Timeline controls */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={goToPreviousPeriod}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={goToToday}
              >
                Today
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={goToNextPeriod}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <span className="text-sm font-medium px-2">
                {format(startDate, 'MMM d, yyyy')} - {format(endDate, 'MMM d, yyyy')}
              </span>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleTimelineMode}
              >
                {timelineMode === 'week' ? 'Month View' : 'Week View'}
              </Button>
            </div>
            
            {/* Right side: Search and filter */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <select 
                value={filterType} 
                onChange={e => setFilterType(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Trips</option>
                <option value="active">Active Trips</option>
                <option value="completed">Completed Trips</option>
                <option value="invoiced">Invoiced Trips</option>
                <option value="paid">Paid Trips</option>
                <option value="Retail">Retail</option>
                <option value="Vendor">Vendor</option>
              </select>
            </div>
          </div>
          
          {/* Timeline Component */}
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-700">Loading timeline data...</span>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg border">
              <Truck className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No vehicles found</h3>
              <p className="text-gray-500 mt-2">
                {search ? 'Try adjusting your search criteria.' : 'No trips available for the selected period.'}
              </p>
            </div>
          ) : (
            <div className="h-[600px]">
              <Timeline
                groups={filteredVehicles}
                items={filteredTrips}
                defaultTimeStart={startDate.getTime()}
                defaultTimeEnd={endDate.getTime()}
                canMove={false}
                canResize={false}
                stackItems
                itemRenderer={itemRenderer}
                lineHeight={50}
                itemHeightRatio={0.65}
                sidebarWidth={200}
              >
                <TimelineHeaders>
                  <SidebarHeader>
                    {({ getRootProps }) => (
                      <div {...getRootProps()} className="bg-gray-100 p-2 text-sm font-medium text-gray-700 border-b">
                        Fleet Vehicles
                      </div>
                    )}
                  </SidebarHeader>
                  <DateHeader unit="day" />
                </TimelineHeaders>
              </Timeline>
            </div>
          )}
          
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
            <div className="text-sm font-medium">Trip Status Legend:</div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded" style={{ background: TYPE_COLORS['active'] || '#3b82f6' }}></span>
              <span className="ml-1 text-sm">Active</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded" style={{ background: TYPE_COLORS['completed'] || '#10b981' }}></span>
              <span className="ml-1 text-sm">Completed</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded" style={{ background: TYPE_COLORS['invoiced'] || '#f59e0b' }}></span>
              <span className="ml-1 text-sm">Invoiced</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded" style={{ background: TYPE_COLORS['paid'] || '#6366f1' }}></span>
              <span className="ml-1 text-sm">Paid</span>
            </div>
            {Object.entries(TYPE_COLORS)
              .filter(([type]) => !['active', 'completed', 'invoiced', 'paid'].includes(type))
              .map(([type, color]) => (
                <div key={type} className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded" style={{ background: color }}></span>
                  <span className="ml-1 text-sm">{type}</span>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripTimelinePage;