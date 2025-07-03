import React from 'react';
import { 
  Clock,
  CheckCircle,
  Wrench,
  Truck,
  Settings,
  Search
} from "lucide-react";
import Button from "../../ui/Button";

interface JobCardHeaderProps {
  title: string;
  onCreateJob?: () => void;
  onFilterChange?: (filter: string) => void;
  totalJobs?: number;
  pendingJobs?: number;
  completedJobs?: number;
}

export const JobCardHeader: React.FC<JobCardHeaderProps> = ({
  title,
  onCreateJob,
  onFilterChange,
  totalJobs = 0,
  pendingJobs = 0,
  completedJobs = 0
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Wrench className="w-6 h-6 mr-2 text-blue-600" />
          {title}
        </h1>
        
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search job cards..."
              className="pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          
          {onCreateJob && (
            <Button onClick={onCreateJob}>
              Create Job Card
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 flex items-center">
          <Truck className="w-10 h-10 text-blue-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-blue-600">Total Job Cards</p>
            <p className="text-2xl font-bold">{totalJobs}</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 flex items-center">
          <Clock className="w-10 h-10 text-yellow-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-yellow-600">Pending</p>
            <p className="text-2xl font-bold">{pendingJobs}</p>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 flex items-center">
          <CheckCircle className="w-10 h-10 text-green-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-green-600">Completed</p>
            <p className="text-2xl font-bold">{completedJobs}</p>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 flex items-center">
          <Settings className="w-10 h-10 text-purple-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-purple-600">Efficiency</p>
            <p className="text-2xl font-bold">
              {totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCardHeader;