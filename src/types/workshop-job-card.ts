export interface JobCardItem {
  id: string;
  type: 'repair' | 'maintenance' | 'inspection';
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'deferred';
  assignedTo?: string;
  estimatedHours?: number;
  actualHours?: number;
  parts?: {
    id: string;
    name: string;
    partNumber: string;
    quantity: number;
    unitCost: number;
  }[];
  notes?: string;
  images?: string[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobCard {
  id: string;
  vehicleId: string;
  vehicleRegNumber: string;
  jobNumber: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  reportedIssues?: string;
  items: JobCardItem[];
  mileage?: number;
  scheduledDate?: string;
  completionDate?: string;
  mechanicNotes?: string;
  customerNotes?: string;
  createdDate: string;
  updatedDate?: string;
  createdBy: string;
  assignedTo?: string;
  images?: string[];
  documents?: string[];
  totalCost?: number;
  currency?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  paymentStatus?: 'pending' | 'partial' | 'paid';
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}