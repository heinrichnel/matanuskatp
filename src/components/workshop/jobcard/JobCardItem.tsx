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
  Tag
} from "lucide-react";
import { Vehicle } from '../../../types/vehicle';

interface JobCard {
  id: string;
  vehicleId: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'created' | 'assigned' | 'in_progress' | 'parts_pending' | 'completed' | 'invoiced';
  createdDate: string;
  scheduledDate?: string;
  completedDate?: string;
  assignedTechnician?: string;
  customerName: string;
  workDescription: string;
  estimatedHours: number;
  actualHours?: number;
  laborRate: number;
  partsCost: number;
  totalEstimate: number;
  actualTotal?: number;
  faultIds: string[];
  notes: string;
  requiresRCA?: boolean;
  vehicle?: Vehicle; // Added to access the full vehicle object
}

interface JobCardItemProps {
  jobCard: JobCard;
}

export const JobCardItem: React.FC<JobCardItemProps> = ({ jobCard }) => {
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
      case 'assigned': return 'bg-purple-100 text-purple-800';
      case 'parts_pending': return 'bg-yellow-100 text-yellow-800';
      case 'created': return 'bg-gray-100 text-gray-800';
      case 'invoiced': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Wrench className="w-4 h-4" />;
      case 'assigned': return <User className="w-4 h-4" />;
      case 'parts_pending': return <Package className="w-4 h-4" />;
      case 'created': return <FileText className="w-4 h-4" />;
      case 'invoiced': return <DollarSign className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-semibold">{jobCard.id}</span>
              <Badge className={getStatusColor(jobCard.status)}>
                {getStatusIcon(jobCard.status)}
                <span className="ml-1 capitalize">{jobCard.status.replace('_', ' ')}</span>
              </Badge>
              <Badge className={getPriorityColor(jobCard.priority)}>
                {jobCard.priority.toUpperCase()}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-col mb-2">
            <h3 className="font-semibold text-gray-800">
              {jobCard.customerName}
            </h3>
            {jobCard.vehicle ? (
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm">
                <div className="flex items-center">
                  <Truck className="w-4 h-4 mr-1 text-gray-500" />
                  <span className="font-medium">{jobCard.vehicle.manufacturer} {jobCard.vehicle.model}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-1 text-gray-500" />
                  <span>Fleet No: <span className="font-medium">{jobCard.vehicle.fleetNo}</span></span>
                </div>
                <div>
                  <span>Reg: <span className="font-medium">{jobCard.vehicle.registrationNo}</span></span>
                </div>
                {jobCard.vehicle.mileage && (
                  <div>
                    <span>Mileage: <span className="font-medium">{jobCard.vehicle.mileage.toLocaleString()} km</span></span>
                  </div>
                )}
                <Badge 
                  className={
                    jobCard.vehicle.status === 'active' ? 'bg-green-100 text-green-800' : 
                    jobCard.vehicle.status === 'maintenance' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }
                >
                  {jobCard.vehicle.status.toUpperCase()}
                </Badge>
              </div>
            ) : (
              <div className="text-gray-800 mt-1">
                Vehicle ID: {jobCard.vehicleId} <span className="text-red-500">(Vehicle details not found)</span>
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-2">{jobCard.workDescription}</p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-2">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Created: {new Date(jobCard.createdDate).toLocaleDateString()}</span>
            </div>
            {jobCard.scheduledDate && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Scheduled: {new Date(jobCard.scheduledDate).toLocaleDateString()}</span>
              </div>
            )}
            {jobCard.completedDate && (
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Completed: {new Date(jobCard.completedDate).toLocaleDateString()}</span>
              </div>
            )}
            {jobCard.assignedTechnician && (
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>Technician: {jobCard.assignedTechnician}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Est. Hours:</span>
              <p className="font-semibold">{jobCard.estimatedHours}h</p>
            </div>
            {jobCard.actualHours && (
              <div>
                <span className="text-gray-500">Actual Hours:</span>
                <p className="font-semibold text-blue-600">{jobCard.actualHours}h</p>
              </div>
            )}
            <div>
              <span className="text-gray-500">Labor Rate:</span>
              <p className="font-semibold">R{jobCard.laborRate}/h</p>
            </div>
            <div>
              <span className="text-gray-500">Parts Cost:</span>
              <p className="font-semibold">R{jobCard.partsCost}</p>
            </div>
            <div>
              <span className="text-gray-500">Total:</span>
              <p className="font-semibold text-green-600">
                R{(jobCard.actualTotal || jobCard.totalEstimate).toLocaleString()}
              </p>
            </div>
          </div>

          {jobCard.faultIds.length > 0 && (
            <div className="mt-2">
              <span className="text-sm text-gray-500">Related Faults: </span>
              {jobCard.faultIds.map(faultId => (
                <Badge key={faultId} variant="outline" className="mr-1 text-xs">
                  {faultId}
                </Badge>
              ))}
            </div>
          )}

          {jobCard.notes && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
              <strong>Notes:</strong> {jobCard.notes}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Timer className="w-4 h-4 mr-2" />
            Time Log
          </Button>
          <Button size="sm">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};