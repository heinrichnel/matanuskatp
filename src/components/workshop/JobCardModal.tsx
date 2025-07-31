import { format } from "date-fns";
import React from "react";
import { JobCardCategory } from "../../types/jobCard";

// Calendar event interface that matches our job card data
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: "open" | "booked" | "in_progress" | "closed";
  category: JobCardCategory;
  vehicleId: string;
  vehicleType: "truck" | "trailer" | "both";
  assignedTechnician?: string;
  priority: "low" | "medium" | "high" | "urgent";
}

interface JobCardModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

export const JobCardModal: React.FC<JobCardModalProps> = ({ event, onClose, onStatusChange }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">{event.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs font-semibold uppercase text-gray-500">Vehicle</p>
              <p>
                {event.vehicleId} ({event.vehicleType})
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs font-semibold uppercase text-gray-500">Status</p>
              <p className="capitalize">{event.status.replace("_", " ")}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs font-semibold uppercase text-gray-500">Category</p>
              <p className="capitalize">{event.category.replace("_", " ")}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs font-semibold uppercase text-gray-500">Priority</p>
              <p className="capitalize">{event.priority}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs font-semibold uppercase text-gray-500">Scheduled</p>
              <p>{format(event.start, "MMM d, yyyy h:mm a")}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs font-semibold uppercase text-gray-500">Assigned To</p>
              <p>{event.assignedTechnician || "Not assigned"}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Update Status</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onStatusChange(event.id, "open")}
                className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
              >
                Open
              </button>
              <button
                onClick={() => onStatusChange(event.id, "booked")}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
              >
                Booked
              </button>
              <button
                onClick={() => onStatusChange(event.id, "in_progress")}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
              >
                In Progress
              </button>
              <button
                onClick={() => onStatusChange(event.id, "closed")}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200"
              >
                Closed
              </button>
            </div>
          </div>

          <div className="flex justify-end border-t pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
