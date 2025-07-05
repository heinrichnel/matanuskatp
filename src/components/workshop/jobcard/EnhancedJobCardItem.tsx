import React from 'react';
import { Badge } from "../../ui/Badge";
import Button from "../../ui/Button";
import { 
  Calendar,
  Clock,
  CheckCircle,
  User,
  Timer,
  FileText,
  Wrench,
  Package,
  DollarSign,
  Truck,
  Tag,
  Clipboard,
  Settings,
  AlertTriangle,
  Link
} from "lucide-react";
import { EnhancedJobCard } from '../../../types/workshop-job-card';

interface EnhancedJobCardItemProps {
  jobCard: EnhancedJobCard;
  onViewDetails?: (jobCard: EnhancedJobCard) => void;
}

export const EnhancedJobCardItem: React.FC<EnhancedJobCardItemProps> = ({ 
  jobCard, 
  onViewDetails 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'initiated': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Wrench className="w-4 h-4" />;
      case 'initiated': return <FileText className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'maintenance': return <Settings className="w-4 h-4" />;
      case 'repair': return <Wrench className="w-4 h-4" />;
      case 'inspection': return <Clipboard className="w-4 h-4" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'repair': return 'bg-orange-100 text-orange-800';
      case 'inspection': return 'bg-purple-100 text-purple-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', { 
      style: 'currency', 
      currency: 'ZAR' 
    }).format(amount);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(jobCard);
    }
  };

  // Calculate completion percentage of tasks
  const completedTasks = jobCard.taskDetails.filter(task => task.status === 'completed').length;
  const totalTasks = jobCard.taskDetails.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-semibold">
                {jobCard.workOrderInfo.workOrderNumber}
              </span>
              <Badge className={getStatusColor(jobCard.vehicleAssetDetails.status)}>
                {getStatusIcon(jobCard.vehicleAssetDetails.status)}
                <span className="ml-1 capitalize">
                  {jobCard.vehicleAssetDetails.status.replace('_', ' ')}
                </span>
              </Badge>
              <Badge className={getPriorityColor(jobCard.vehicleAssetDetails.priority)}>
                {jobCard.vehicleAssetDetails.priority.toUpperCase()}
              </Badge>
              <Badge className={getTypeColor(jobCard.vehicleAssetDetails.type)}>
                {getTypeIcon(jobCard.vehicleAssetDetails.type)}
                <span className="ml-1 capitalize">
                  {jobCard.vehicleAssetDetails.type}
                </span>
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col mb-2">
            <h3 className="font-semibold text-gray-800">
              {jobCard.workOrderInfo.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
              <div className="flex items-center">
                <Truck className="w-4 h-4 mr-1 text-gray-500" />
                <span className="font-medium">
                  {jobCard.vehicleAssetDetails.vehicleName} ({jobCard.vehicleAssetDetails.model})
                </span>
              </div>
              <div className="flex items-center">
                <Tag className="w-4 h-4 mr-1 text-gray-500" />
                <span>Vehicle No: <span className="font-medium">
                  {jobCard.vehicleAssetDetails.vehicleNumber}
                </span></span>
              </div>
              <div>
                <span>Meter: <span className="font-medium">
                  {jobCard.vehicleAssetDetails.meterReading.toLocaleString()} km
                </span></span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-2">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Created: {new Date(jobCard.workOrderInfo.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Due: {new Date(jobCard.schedulingInfo.dueDate).toLocaleDateString()}</span>
            </div>
            {jobCard.schedulingInfo.completionDate && (
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Completed: {new Date(jobCard.schedulingInfo.completionDate).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>Assigned: {jobCard.vehicleAssetDetails.assignedTo}</span>
            </div>
          </div>

          {/* Task Progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Task Completion: {completedTasks}/{totalTasks} tasks completed</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
            <div>
              <span className="text-gray-500">Est. Time:</span>
              <p className="font-semibold">
                {jobCard.schedulingInfo.estimatedTimeHours || 0}h
              </p>
            </div>
            {jobCard.schedulingInfo.actualTimeHours !== undefined && (
              <div>
                <span className="text-gray-500">Actual Time:</span>
                <p className="font-semibold text-blue-600">
                  {jobCard.schedulingInfo.actualTimeHours}h
                </p>
              </div>
            )}
            <div>
              <span className="text-gray-500">Parts Cost:</span>
              <p className="font-semibold">
                {formatCurrency(jobCard.costSummary.partsMaterialCost)}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Total Cost:</span>
              <p className="font-semibold text-green-600">
                {formatCurrency(jobCard.costSummary.totalWOCost)}
              </p>
            </div>
          </div>

          {/* Task Summary */}
          {jobCard.taskDetails.length > 0 && (
            <div className="mt-2 mb-2">
              <h4 className="text-sm font-semibold mb-1">Tasks:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {jobCard.taskDetails.slice(0, 4).map((task) => (
                  <div key={task.sn} className="flex items-center text-sm">
                    <Badge className={getStatusColor(task.status)} />
                    <span className="ml-2 truncate">{task.task}</span>
                  </div>
                ))}
                {jobCard.taskDetails.length > 4 && (
                  <div className="text-sm text-blue-600">
                    +{jobCard.taskDetails.length - 4} more tasks...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Linked Records */}
          {(jobCard.linkedRecords.linkedInspection || jobCard.linkedRecords.linkedWorkorder) && (
            <div className="mt-2 mb-2">
              <h4 className="text-sm font-semibold mb-1">Linked Records:</h4>
              <div className="flex gap-2">
                {jobCard.linkedRecords.linkedInspection && (
                  <Badge variant="outline" className="flex items-center">
                    <Link className="w-3 h-3 mr-1" />
                    Inspection: {jobCard.linkedRecords.linkedInspection}
                  </Badge>
                )}
                {jobCard.linkedRecords.linkedWorkorder && (
                  <Badge variant="outline" className="flex items-center">
                    <Link className="w-3 h-3 mr-1" />
                    Work Order: {jobCard.linkedRecords.linkedWorkorder}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {jobCard.workOrderMemo && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
              <strong>Memo:</strong> {jobCard.workOrderMemo}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Timer className="w-4 h-4 mr-2" />
            Time Log
          </Button>
          <Button size="sm" onClick={handleViewDetails}>
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedJobCardItem;