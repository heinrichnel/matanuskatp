import { addDays, format, isSameDay, isWithinInterval, startOfWeek } from "date-fns";
import React, { useState } from "react";
import useWorkshopJobCards from "../../hooks/useWorkshopJobCards";
import { JOB_CARD_TEMPLATES, JobCardCategory, JobCardTemplate } from "../../types/jobCard";
import { CalendarEvent, JobCardModal } from "../../components/workshop/JobCardModal";

interface WorkshopCalendarProps {}

const CATEGORY_ICONS: Record<JobCardCategory, string> = {
  preventive_maintenance: "🔧",
  corrective_maintenance: "🛠️",
  inspection_followup: "🔍",
  safety_repair: "⚠️",
  emergency_repair: "🚨",
  tyre_service: "🛞",
  body_repair: "🚚",
};

const STATUS_COLORS: Record<string, string> = {
  open: "border-green-500 bg-green-50",
  booked: "border-blue-500 bg-blue-50",
  in_progress: "border-yellow-500 bg-yellow-50",
  closed: "border-gray-500 bg-gray-50",
};

const WorkshopCalendarPage: React.FC<WorkshopCalendarProps> = () => {
  const [selectedJobCardId, setSelectedJobCardId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterVehicleType, setFilterVehicleType] = useState<string>("all");
  const {
    jobCards,
    loading,
    stats,
    currentWeek,
    updateJobCard,
    changeJobCardStatus,
    assignTechnician,
    addJobCard,
  } = useWorkshopJobCards(currentDate);

  // Convert job cards to calendar events
  const calendarEvents: CalendarEvent[] = jobCards
    .map(card => ({
      id: card.id,
      title: card.title,
      start: card.startDate,
      end: card.endDate,
      status: card.status,
      category: card.category,
      vehicleId: card.vehicleId,
      vehicleType: card.vehicleType,
      assignedTechnician: card.assignedTechnician,
      priority: card.priority
    }))
    // Apply filters
    .filter(event => {
      if (filterStatus && event.status !== filterStatus) return false;
      if (filterVehicleType !== "all" && event.vehicleType !== filterVehicleType) return false;
      return true;
    });

  // Generate calendar days for the week
  const renderWeekDays = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Week starts on Monday
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      days.push(
        <div key={i} className="calendar-day border-r border-b border-gray-200 min-h-[150px]">
          <div className="day-header bg-gray-100 p-2 border-b border-gray-200 text-center">
            <div className="font-bold">{format(day, "EEEE")}</div>
            <div>{format(day, "MMM d")}</div>
          </div>
          <div className="day-events p-1">{renderEventsForDay(day)}</div>
        </div>
      );
    }

    return days;
  };

  // Render events for a specific day
  const renderEventsForDay = (day: Date) => {
    const dayEvents = calendarEvents.filter(
      (event) =>
        isSameDay(event.start, day) ||
        (event.start && event.end && isWithinInterval(day, { start: event.start, end: event.end }))
    );

    if (dayEvents.length === 0)
      return (
        <div className="empty-day text-xs text-gray-400 text-center py-2">No jobs scheduled</div>
      );

    return dayEvents.map((event) => (
      <div
        key={event.id}
        className={`event-item mb-1 p-2 rounded border-l-4 text-xs ${STATUS_COLORS[event.status]}`}
        onClick={() => handleEventClick(event)}
      >
        <div className="font-bold flex items-center">
          <span className="mr-1">{CATEGORY_ICONS[event.category]}</span>
          {event.title}
        </div>
        <div className="text-xs">
          Status: <span className="font-medium capitalize">{event.status.replace("_", " ")}</span>
        </div>
        <div className="text-xs">
          {event.vehicleId} • {event.vehicleType === "truck" ? "🚚" : "🚛"}
        </div>
      </div>
    ));
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleScheduleJob = (template: JobCardTemplate) => {
    // Create a new job card from the template
    const tomorrow = addDays(new Date(), 1);
    tomorrow.setHours(9, 0, 0, 0); // Set to 9 AM

    addJobCard({
      title: `New ${template.name}`,
      vehicleId: "",  // Would be selected by the user in a real app
      vehicleType: template.vehicleType,
      templateId: template.id,
      startDate: tomorrow,
      endDate: addDays(tomorrow, 1),
      status: "open",
      category: template.category,
      priority: "medium",
      completedTasks: 0,
      totalTasks: template.tasks.length
    });

    alert("New job has been scheduled.");
  };

  const handleStatusChange = (eventId: string, newStatus: string) => {
    changeJobCardStatus(eventId, newStatus as "open" | "booked" | "in_progress" | "closed");
    setShowModal(false);
  };

  const navigateToPreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const navigateToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const navigateToCurrentWeek = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="workshop-calendar p-4">
      <div className="calendar-header flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Workshop Schedule</h1>
          {stats && (
            <div className="stats-summary flex gap-4 mt-2 text-sm">
              <div className="stat">
                <span className="font-medium">{stats.totalOpen}</span> Open
              </div>
              <div className="stat">
                <span className="font-medium">{stats.totalInProgress}</span> In Progress
              </div>
              <div className="stat">
                <span className="font-medium">{stats.totalBooked}</span> Booked
              </div>
              <div className="stat">
                <span className="font-medium">{stats.totalClosed}</span> Closed
              </div>
              <div className="stat">
                <span className="font-medium">{stats.completionRate.toFixed(0)}%</span> Completion Rate
              </div>
            </div>
          )}
        </div>
        <div className="calendar-navigation flex items-center space-x-4">
          <button
            onClick={navigateToPreviousWeek}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            ← Previous Week
          </button>
          <button
            onClick={navigateToCurrentWeek}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Current Week
          </button>
          <button
            onClick={navigateToNextWeek}
            className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Next Week →
          </button>
        </div>
      </div>

      <div className="calendar-filters mb-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Filter by status:</span>
          <div className="filter-status flex space-x-2">
            <button
              onClick={() => setFilterStatus(filterStatus === "open" ? null : "open")}
              className={`flex items-center ${filterStatus === "open" ? "border-b-2 border-green-500" : ""}`}
            >
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span className="text-xs">Open</span>
            </button>
            <button
              onClick={() => setFilterStatus(filterStatus === "booked" ? null : "booked")}
              className={`flex items-center ${filterStatus === "booked" ? "border-b-2 border-blue-500" : ""}`}
            >
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              <span className="text-xs">Booked</span>
            </button>
            <button
              onClick={() => setFilterStatus(filterStatus === "in_progress" ? null : "in_progress")}
              className={`flex items-center ${filterStatus === "in_progress" ? "border-b-2 border-yellow-500" : ""}`}
            >
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
              <span className="text-xs">In Progress</span>
            </button>
            <button
              onClick={() => setFilterStatus(filterStatus === "closed" ? null : "closed")}
              className={`flex items-center ${filterStatus === "closed" ? "border-b-2 border-gray-500" : ""}`}
            >
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
              <span className="text-xs">Closed</span>
            </button>
            {filterStatus && (
              <button
                onClick={() => setFilterStatus(null)}
                className="text-xs text-blue-600 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="filter-vehicle flex items-center space-x-2">
          <span className="text-sm font-medium">Vehicle type:</span>
          <select
            className="text-xs border border-gray-300 rounded p-1"
            value={filterVehicleType}
            onChange={(e) => setFilterVehicleType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="truck">Trucks</option>
            <option value="trailer">Trailers</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>

      <div className="calendar-grid grid grid-cols-7 border-t border-l border-gray-200 bg-white rounded-lg shadow">
        {renderWeekDays()}
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Available Job Card Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {JOB_CARD_TEMPLATES.slice(0, 3).map((template: JobCardTemplate) => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">{CATEGORY_ICONS[template.category]}</span>
                <h3 className="font-bold">{template.name}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Duration: {template.estimatedDuration}h</span>
                <span>Vehicle: {template.vehicleType}</span>
              </div>
              <button
                className="mt-2 w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                onClick={() => handleScheduleJob(template)}
              >
                Schedule Job
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Job Card Detail Modal */}
      {showModal && selectedEvent && (
        <JobCardModal
          event={selectedEvent}
          onClose={handleCloseModal}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default WorkshopCalendarPage;
