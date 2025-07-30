import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import Button from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import LoadingIndicator from "../../components/ui/LoadingIndicator";
import ErrorMessage from "../../components/ui/ErrorMessage"; // Assuming you have this
import { useAppContext } from "../../context/AppContext"; // Keep if isLoading is needed for global app state
import { useTrips } from "../../hooks/useTrips"; // Import the new useTrips hook
import { Trip } from "../../types/trip"; // Import Trip interface
import { formatDate } from "../../utils/helpers"; // Import formatDate function

const TripCalendarPage: React.FC = () => {
  // const { isLoading: appIsLoading } = useAppContext(); // If you need global app loading status
  const navigate = useNavigate();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Derive start and end dates for the current month to pass to useTrips hook
  const monthStartDate = useMemo(() => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    return start.toISOString().split('T')[0]; // Format to YYYY-MM-DD
  }, [currentMonth]);

  const monthEndDate = useMemo(() => {
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0); // Last day of month
    return end.toISOString().split('T')[0]; // Format to YYYY-MM-DD
  }, [currentMonth]);

  // Hook into real trip data
  const { trips, loading, error, fetchTrips } = useTrips({
    startDate: monthStartDate,
    endDate: monthEndDate,
    status: 'all', // Fetch all statuses for the calendar view
  });

  // --- Calendar Logic ---
  const prevMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null); // Clear selected date when changing month
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null); // Clear selected date when changing month
  }, []);

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday

    const days = [];
    // Add nulls for leading empty days
    for (let i = 0; i < firstDayIndex; i++) days.push(null);
    // Add actual dates
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  }, []);

  const getMonthName = useCallback((date: Date) =>
    date.toLocaleString("default", { month: "long", year: "numeric" }),
    []
  );

  // Memoize trips for the selected date to avoid re-filtering on every render
  const getTripsForDate = useCallback((date: Date | null): Trip[] => {
    if (!date) return [];
    const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD
    return trips.filter((trip) => {
      // Check if trip's loadDate falls on the selected date
      return trip.loadDate === dateString;
    });
  }, [trips]);

  const handleDayClick = useCallback((day: Date) => {
    setSelectedDate(day);
  }, []);

  const daysInCalendar = useMemo(() => getDaysInMonth(currentMonth), [currentMonth, getDaysInMonth]);

  // --- Navigation Handlers ---
  const handleAddTrip = () => {
    navigate('/trips/add'); // Navigate to your Add Trip page
  };

  const handleViewTrip = (tripId: string) => {
    navigate(`/trips/${tripId}`); // Navigate to Trip Details page
  };

  const handleEditTrip = (tripId: string) => {
    navigate(`/trips/${tripId}/edit`); // Navigate to Trip Edit page
  };

  const handleDeleteTrip = (tripId: string) => {
    // Implement actual delete logic here, potentially using a global TripContext or a dedicated hook
    // For now, a simple confirmation
    if (window.confirm(`Are you sure you want to delete trip ${tripId}?`)) {
      console.log(`Deleting trip ${tripId}`);
      // Call your deleteTrip function from useTrips or TripContext
      // e.g., deleteTrip(tripId).then(() => showToast('Trip deleted', 'success'));
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trip Calendar</h1>
          <p className="text-gray-600">View and manage trips by date</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<Plus className="w-4 h-4" />}
            onClick={handleAddTrip}
            // disabled={appIsLoading?.addTrip} // Use global loading if applicable
          >
            Add Trip
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{getMonthName(currentMonth)}</h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevMonth}
                icon={<ChevronLeft className="w-4 h-4" />}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={nextMonth}
                icon={<ChevronRight className="w-4 h-4" />}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex justify-center items-center py-8">
              <LoadingIndicator />
              <span className="ml-3 text-gray-700">Loading trips...</span>
            </div>
          )}

          {error && (
            <ErrorMessage message={error} />
          )}

          {!loading && !error && (
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                <div key={i} className="text-center font-medium py-2">
                  {day}
                </div>
              ))}
              {daysInCalendar.map((day, i) => {
                const tripsOnDay = day ? getTripsForDate(day) : [];
                const isSelected = selectedDate && day?.toDateString() === selectedDate?.toDateString();
                const isToday = day && day.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={i}
                    className={`min-h-[100px] border rounded-md p-1 relative ${!day ? "bg-gray-50" : isSelected ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50 cursor-pointer"} ${isToday ? 'border-2 border-indigo-600' : ''}`}
                    onClick={() => day && handleDayClick(day)}
                  >
                    {day && (
                      <>
                        <div className={`text-right text-sm font-medium mb-1 ${isToday ? 'text-indigo-700' : ''}`}>{day.getDate()}</div>
                        <div className="space-y-1 overflow-hidden max-h-[70px] text-ellipsis"> {/* Limit height for event display */}
                          {tripsOnDay.map((trip) => (
                            <div
                              key={trip.id}
                              className={`text-xs p-1 rounded truncate ${
                                trip.status === "active"
                                  ? "bg-blue-100 text-blue-800"
                                  : trip.status === "completed"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                              title={trip.route} // Show full title on hover
                            >
                              {trip.route}
                            </div>
                          ))}
                          {tripsOnDay.length > 3 && ( // Indicate more trips if space is limited
                            <div className="text-xs text-gray-600 mt-1">+{tripsOnDay.length - 3} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <CardHeader title={`Trips on ${formatDate(selectedDate.toISOString().split('T')[0])}`} /> {/* Use formatDate for consistency */}
          <CardContent>
            {getTripsForDate(selectedDate).length > 0 ? (
              <div className="space-y-4">
                {getTripsForDate(selectedDate).map((trip) => (
                  <div
                    key={trip.id}
                    className="flex justify-between items-center p-3 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{trip.route}</h3>
                      <p className="text-sm text-gray-500">Status: {trip.status.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-sm text-gray-500">Vehicle: {trip.vehicleId}</p> {/* Assuming vehicleId exists */}
                      <p className="text-sm text-gray-500">Driver: {trip.driverId}</p> {/* Assuming driverId exists */}
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" icon={<Eye className="w-4 h-4" />} onClick={() => handleViewTrip(trip.id)}>
                        View
                      </Button>
                      <Button size="sm" variant="outline" icon={<Edit className="w-4 h-4" />} onClick={() => handleEditTrip(trip.id)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" icon={<Trash2 className="w-4 h-4" />} onClick={() => handleDeleteTrip(trip.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No trips scheduled</h3>
                <p>There are no trips scheduled for this date.</p>
                <Button variant="outline" className="mt-4" icon={<Plus className="w-4 h-4" />} onClick={handleAddTrip}>
                  Schedule Trip
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TripCalendarPage;
