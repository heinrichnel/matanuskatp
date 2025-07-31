import { addDays, addWeeks, format, isSameDay, isWithinInterval, subWeeks } from "date-fns";
import React, { useState } from "react";
import { JobCardCategory, JobCardTemplate } from "../../../types/jobCard";

interface JobCard {
  id: string;
  title: string;
  vehicleId: string;
  vehicleType: "truck" | "trailer" | "both";
  templateId: string;
  startDate: Date;
  endDate: Date;
  status: "open" | "closed" | "booked" | "in_progress";
  category: JobCardCategory;
  assignedTechnician?: string;
  priority: "low" | "medium" | "high" | "urgent";
  notes?: string;
  completedTasks: number;
  totalTasks: number;
}

interface WeeklyCalendarProps {
  jobCards: JobCard[];
  templates: JobCardTemplate[];
  onJobCardSelect?: (jobCard: JobCard) => void;
  onNewJobCard?: (date: Date) => void;
}

const STATUS_COLORS = {
  open: "bg-green-100 border-green-500 text-green-800",
  closed: "bg-gray-100 border-gray-500 text-gray-800",
  booked: "bg-blue-100 border-blue-500 text-blue-800",
  in_progress: "bg-yellow-100 border-yellow-500 text-yellow-800",
};

const CATEGORY_ICONS = {
  preventive_maintenance: "🔧",
  corrective_maintenance: "🛠️",
  inspection_followup: "🔍",
  safety_repair: "⚠️",
  emergency_repair: "🚨",
  tyre_service: "🛞",
  body_repair: "🚚",
};

const PRIORITY_INDICATORS = {
  low: { color: "bg-gray-300", label: "Low" },
  medium: { color: "bg-blue-300", label: "Medium" },
  high: { color: "bg-orange-400", label: "High" },
  urgent: { color: "bg-red-500", label: "Urgent" },
};

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  jobCards = [],
  templates = [],
  onJobCardSelect,
  onNewJobCard,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState({
    status: "all",
    vehicleType: "all",
    category: "all",
  });

  const navigateToPreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const navigateToNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const filterJobCards = (cards: JobCard[]) => {
    return cards.filter((card) => {
      const statusMatch = filters.status === "all" || card.status === filters.status;
      const vehicleMatch =
        filters.vehicleType === "all" || card.vehicleType === filters.vehicleType;
      const categoryMatch = filters.category === "all" || card.category === filters.category;

      return statusMatch && vehicleMatch && categoryMatch;
    });
  };

  const getDaysOfWeek = () => {
    const days = [];
    // Get Monday of current week
    let startDay = new Date(currentDate);
    startDay.setDate(
      currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1)
    );

    for (let i = 0; i < 7; i++) {
      days.push(addDays(startDay, i));
    }

    return days;
  };

  const getJobCardsForDay = (day: Date, cards: JobCard[]) => {
    return cards.filter(
      (card) =>
        isSameDay(card.startDate, day) ||
        (card.startDate &&
          card.endDate &&
          isWithinInterval(day, { start: card.startDate, end: card.endDate }))
    );
  };

  const handleDayClick = (day: Date) => {
    if (onNewJobCard) {
      onNewJobCard(day);
    }
  };

  const renderDays = () => {
    const daysOfWeek = getDaysOfWeek();
    const filteredCards = filterJobCards(jobCards);

    return daysOfWeek.map((day, index) => {
      const dayJobCards = getJobCardsForDay(day, filteredCards);
      const isToday = isSameDay(day, new Date());

      return (
        <div
          key={index}
          className={`calendar-day border-r border-b border-gray-200 min-h-[200px] ${isToday ? "bg-blue-50" : ""}`}
        >
          <div
            className={`day-header p-2 border-b ${isToday ? "bg-blue-100 font-bold" : "bg-gray-100"} text-center cursor-pointer`}
            onClick={() => handleDayClick(day)}
          >
            <div className="font-bold">{format(day, "EEEE")}</div>
            <div className="text-sm">{format(day, "MMM d")}</div>
          </div>
          <div className="day-events p-1 overflow-y-auto max-h-[160px]">
            {dayJobCards.length === 0 ? (
              <div className="empty-day text-xs text-gray-400 text-center py-2 italic">
                No jobs scheduled
              </div>
            ) : (
              dayJobCards.map((jobCard) => (
                <div
                  key={jobCard.id}
                  className={`event-item mb-2 p-2 rounded border-l-4 text-xs shadow-sm ${STATUS_COLORS[jobCard.status]}`}
                  onClick={() => onJobCardSelect && onJobCardSelect(jobCard)}
                >
                  <div className="font-bold flex items-center justify-between">
                    <div>
                      <span className="mr-1">{CATEGORY_ICONS[jobCard.category]}</span>
                      <span className="truncate">{jobCard.title}</span>
                    </div>
                    <div
                      className={`h-2 w-2 rounded-full ${PRIORITY_INDICATORS[jobCard.priority].color}`}
                      title={`Priority: ${PRIORITY_INDICATORS[jobCard.priority].label}`}
                    ></div>
                  </div>
                  <div className="text-xs mt-1 flex items-center justify-between">
                    <span className="capitalize">{jobCard.vehicleId}</span>
                    <span>
                      {jobCard.completedTasks}/{jobCard.totalTasks} tasks
                    </span>
                  </div>
                  <div className="text-xs mt-1">
                    {jobCard.assignedTechnician ? (
                      <span>Tech: {jobCard.assignedTechnician}</span>
                    ) : (
                      <span className="italic text-gray-500">Unassigned</span>
                    )}
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 h-1.5 mt-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${jobCard.status === "closed" ? "bg-gray-500" : "bg-blue-500"}`}
                      style={{ width: `${(jobCard.completedTasks / jobCard.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="workshop-weekly-calendar">
      <div className="calendar-controls flex items-center justify-between mb-4 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <h2 className="text-lg font-bold mr-4">Workshop Schedule</h2>
          <div className="text-sm">
            Week of {format(getDaysOfWeek()[0], "MMM d")} -{" "}
            {format(getDaysOfWeek()[6], "MMM d, yyyy")}
          </div>
        </div>

        <div className="navigation-controls flex items-center space-x-2">
          <button
            className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
            onClick={navigateToPreviousWeek}
          >
            ← Previous
          </button>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            onClick={navigateToToday}
          >
            Today
          </button>
          <button
            className="px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
            onClick={navigateToNextWeek}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="filters mb-4 bg-white p-4 rounded-lg shadow flex flex-wrap gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
          <select
            className="border-gray-300 rounded-md shadow-sm text-sm"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="booked">Booked</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Vehicle Type</label>
          <select
            className="border-gray-300 rounded-md shadow-sm text-sm"
            value={filters.vehicleType}
            onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value as any })}
          >
            <option value="all">All Types</option>
            <option value="truck">Trucks</option>
            <option value="trailer">Trailers</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
          <select
            className="border-gray-300 rounded-md shadow-sm text-sm"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value as any })}
          >
            <option value="all">All Categories</option>
            <option value="preventive_maintenance">Preventive Maintenance</option>
            <option value="corrective_maintenance">Corrective Maintenance</option>
            <option value="inspection_followup">Inspection Follow-up</option>
            <option value="safety_repair">Safety Repair</option>
            <option value="emergency_repair">Emergency Repair</option>
            <option value="tyre_service">Tyre Service</option>
            <option value="body_repair">Body Repair</option>
          </select>
        </div>

        <div className="ml-auto self-end">
          <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Job Card
          </button>
        </div>
      </div>

      <div className="calendar-legend flex flex-wrap gap-x-4 gap-y-2 mb-2 px-2">
        <div className="text-xs font-medium">Status:</div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>Open</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
          <span>Closed</span>
        </div>

        <div className="ml-6 text-xs font-medium">Priority:</div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-gray-300 rounded-full mr-1"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-blue-300 rounded-full mr-1"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-orange-400 rounded-full mr-1"></div>
          <span>High</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
          <span>Urgent</span>
        </div>
      </div>

      <div className="calendar-grid grid grid-cols-7 border-t border-l border-gray-200 bg-white rounded-lg shadow">
        {renderDays()}
      </div>

      <div className="tech-allocation mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-4">Technician Allocation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {["John Smith", "Maria Garcia", "David Johnson", "Sarah Lee"].map((tech) => (
            <div key={tech} className="border rounded p-3">
              <div className="font-medium">{tech}</div>
              <div className="flex items-center mt-1">
                <div className="h-2 bg-blue-500 rounded-full mr-1" style={{ width: "70%" }}></div>
                <span className="text-xs text-gray-500">70% Allocated</span>
              </div>
              <div className="mt-2 text-xs text-gray-600">4 tasks assigned today</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
