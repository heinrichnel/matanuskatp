import React, { useEffect, useState } from "react";
import Timeline, { TimelineHeaders, SidebarHeader, DateHeader, TimelineMarkers } from "react-calendar-timeline";
import 'react-calendar-timeline/dist/style.css';
import { format, addWeeks, subWeeks, parseISO, isValid, startOfWeek, endOfWeek } from 'date-fns';
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "../../../firebase"; // Adjust to your path
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
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
  status?: string;
  origin?: string;
  destination?: string;
  driver?: string;
  itemProps?: {
    className?: string;
    style?: Record<string, string | number>;
  };
}

const TripTimelinePage: React.FC = () => {
  const [groups, setGroups] = useState<Vehicle[]>([]);
  const [items, setItems] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleTimeStart, setVisibleTimeStart] = useState<number>(startOfWeek(new Date()).getTime());
  const [visibleTimeEnd, setVisibleTimeEnd] = useState<number>(endOfWeek(addWeeks(new Date(), 2)).getTime());
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch vehicles
      const vehiclesRef = collection(db, 'vehicles');
      const vehicleSnapshot = await getDocs(vehiclesRef);
      const vehiclesData = vehicleSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.fleetNumber || data.registration || `Vehicle ${doc.id}`,
          fleetNumber: data.fleetNumber,
          registration: data.registration
        };
      });

      // Fetch trips
      const tripsRef = collection(db, 'trips');
      const q = query(
        tripsRef,
        orderBy('startDate', 'asc'),
        limit(100)
      );
      const tripSnapshot = await getDocs(q);
      
      const tripsData = tripSnapshot.docs.map((doc) => {
        const data = doc.data();
        const startDate = data.startDate?.toDate?.() || parseISO(data.startDate);
        const endDate = data.endDate?.toDate?.() || parseISO(data.endDate) || addWeeks(startDate, 1);
        
        return {
          id: doc.id,
          group: data.vehicleId,
          title: data.tripNumber || `Trip to ${data.destination}`,
          start_time: isValid(startDate) ? startDate.getTime() : new Date().getTime(),
          end_time: isValid(endDate) ? endDate.getTime() : addWeeks(new Date(), 1).getTime(),
          color: getTripColor(data.status),
          status: data.status,
          origin: data.origin,
          destination: data.destination,
          driver: data.driver,
          itemProps: {
            className: `trip-item trip-status-${data.status?.toLowerCase() || 'planned'}`
          }
        };
      });
      
      setGroups(vehiclesData);
      setItems(tripsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching data: ", err);
      setError("Failed to load timeline data");
    } finally {
      setLoading(false);
    }
  };
  
  const getTripColor = (status?: string): string => {
    switch(status?.toLowerCase()) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#3b82f6';
      case 'delayed': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6366f1';
    }
  };
  
  const handleTimeChange = (visibleTimeStart: number, visibleTimeEnd: number) => {
    setVisibleTimeStart(visibleTimeStart);
    setVisibleTimeEnd(visibleTimeEnd);
  };
  
  const handlePreviousClick = () => {
    const newStart = subWeeks(new Date(visibleTimeStart), 1).getTime();
    const newEnd = subWeeks(new Date(visibleTimeEnd), 1).getTime();
    setVisibleTimeStart(newStart);
    setVisibleTimeEnd(newEnd);
  };
  
  const handleNextClick = () => {
    const newStart = addWeeks(new Date(visibleTimeStart), 1).getTime();
    const newEnd = addWeeks(new Date(visibleTimeEnd), 1).getTime();
    setVisibleTimeStart(newStart);
    setVisibleTimeEnd(newEnd);
  };
  
  const handleTodayClick = () => {
    const today = new Date();
    const start = startOfWeek(today).getTime();
    const end = endOfWeek(addWeeks(today, 2)).getTime();
    setVisibleTimeStart(start);
    setVisibleTimeEnd(end);
  };
  
  const handleItemSelect = (itemId: number) => {
    const selectedItem = items.find(item => item.id === itemId.toString());
    setSelectedTrip(selectedItem || null);
  };
  
  const filteredItems = items.filter(item => {
    const matchesText = filterValue === "" || 
      item.title.toLowerCase().includes(filterValue.toLowerCase()) ||
      item.origin?.toLowerCase().includes(filterValue.toLowerCase()) ||
      item.destination?.toLowerCase().includes(filterValue.toLowerCase()) ||
      item.driver?.toLowerCase().includes(filterValue.toLowerCase());
      
    const matchesStatus = statusFilter === "" || 
      item.status?.toLowerCase() === statusFilter.toLowerCase();
      
    return matchesText && matchesStatus;
  });
  
  const filteredGroups = groups.filter(group => {
    return filteredItems.some(item => item.group === group.id);
  });
  
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Trip Timeline</h2>
            <p className="text-muted-foreground">View and manage scheduled trips</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePreviousClick}>
              <ChevronLeft size={18} />
            </Button>
            <Button variant="outline" onClick={handleTodayClick}>
              <CalendarIcon size={18} className="mr-1" /> Today
            </Button>
            <Button variant="outline" onClick={handleNextClick}>
              <ChevronRight size={18} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex items-center mb-2 md:mb-0">
              <Search size={18} className="mr-2 text-gray-500" />
              <input
                type="text"
                placeholder="Search trips..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="border rounded px-2 py-1 w-48"
              />
            </div>
            <div className="flex items-center mb-2 md:mb-0">
              <Filter size={18} className="mr-2 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded px-2 py-1 w-36"
              >
                <option value="">All Statuses</option>
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex-grow"></div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center">
                <Download size={18} className="mr-1" /> Export
              </Button>
              <Button variant="primary" className="flex items-center">
                <DollarSign size={18} className="mr-1" /> View Revenue
              </Button>
            </div>
          </div>
          
          <div className="trip-timeline-legends mb-2 flex flex-wrap gap-3">
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block mr-1 bg-[#6366f1] rounded"></span>
              <span className="text-sm">Planned</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block mr-1 bg-[#3b82f6] rounded"></span>
              <span className="text-sm">In Progress</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block mr-1 bg-[#10b981] rounded"></span>
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block mr-1 bg-[#f59e0b] rounded"></span>
              <span className="text-sm">Delayed</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block mr-1 bg-[#ef4444] rounded"></span>
              <span className="text-sm">Cancelled</span>
            </div>
          </div>
          
          {error ? (
            <div className="p-4 bg-red-50 text-red-700 rounded flex items-center">
              <AlertTriangle size={20} className="mr-2" />
              {error}
            </div>
          ) : loading ? (
            <div className="p-4 text-center">Loading trip timeline data...</div>
          ) : (
            <div className="trip-timeline-container" style={{ height: '500px' }}>
              <Timeline
                groups={filteredGroups}
                items={filteredItems}
                defaultTimeStart={visibleTimeStart}
                defaultTimeEnd={visibleTimeEnd}
                visibleTimeStart={visibleTimeStart}
                visibleTimeEnd={visibleTimeEnd}
                onTimeChange={handleTimeChange}
                onItemSelect={handleItemSelect}
                stackItems
                lineHeight={50}
                itemHeightRatio={0.7}
                canMove={false}
                canResize={false}
                minZoom={60 * 60 * 1000} // 1 hour
                maxZoom={30 * 24 * 60 * 60 * 1000} // 30 days
              >
                <TimelineHeaders>
                  <SidebarHeader>
                    {({ getRootProps }) => (
                      <div {...getRootProps()} className="p-2 font-medium bg-gray-100">
                        <div className="flex items-center">
                          <Truck size={16} className="mr-1" /> 
                          Vehicle
                        </div>
                      </div>
                    )}
                  </SidebarHeader>
                  <DateHeader unit="day" />
                  <DateHeader unit="hour" height={15} labelFormat="HH:00" />
                </TimelineHeaders>
                <TimelineMarkers>
                  {/* Current time marker */}
                  <div
                    className="current-time-marker"
                    style={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: `calc(((${Date.now()} - ${visibleTimeStart}) / (${visibleTimeEnd} - ${visibleTimeStart})) * 100%)`,
                      width: '2px',
                      backgroundColor: 'red',
                      zIndex: 999
                    }}
                  />
                </TimelineMarkers>
              </Timeline>
            </div>
          )}
          
          {selectedTrip && (
            <div className="mt-4 p-3 border rounded-md bg-gray-50">
              <h3 className="font-medium mb-2">{selectedTrip.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">From:</span> {selectedTrip.origin || 'Not specified'}
                </div>
                <div>
                  <span className="text-gray-500">To:</span> {selectedTrip.destination || 'Not specified'}
                </div>
                <div>
                  <span className="text-gray-500">Driver:</span> {selectedTrip.driver || 'Not assigned'}
                </div>
                <div>
                  <span className="text-gray-500">Start:</span> {format(new Date(selectedTrip.start_time), 'PPpp')}
                </div>
                <div>
                  <span className="text-gray-500">End:</span> {format(new Date(selectedTrip.end_time), 'PPpp')}
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>{' '}
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                    ${selectedTrip.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      selectedTrip.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      selectedTrip.status === 'delayed' ? 'bg-yellow-100 text-yellow-800' :
                      selectedTrip.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-indigo-100 text-indigo-800'}`}>
                    {selectedTrip.status || 'Planned'}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex justify-end">
                <Button 
                  variant="outline" 
                  className="text-xs" 
                  onClick={() => setSelectedTrip(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TripTimelinePage;
