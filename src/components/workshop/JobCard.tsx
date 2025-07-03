import React, { useState, useEffect } from 'react';
import { JobCardHeader } from './jobcard/JobCardHeader';
import { JobCardItem } from './jobcard/JobCardItem';
import RCAModal from './RCAModal';
import { FLEET_VEHICLES, Vehicle } from '../../types/vehicle';

interface JobCard {
  id: string;
  vehicleId: string; // References the vehicle.id
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
  vehicle?: Vehicle; // Added to store the full vehicle object
}

// Sample data - using real fleet vehicles
const SAMPLE_JOB_CARDS: JobCard[] = [
  {
    id: 'JC-2023-001',
    vehicleId: '21', // SCANIA G460 - Heavy Truck
    priority: 'high',
    status: 'in_progress',
    createdDate: '2023-10-15',
    scheduledDate: '2023-10-16',
    customerName: 'Transport Company A',
    workDescription: 'Engine oil change and filter replacement',
    estimatedHours: 2,
    actualHours: 1.5,
    laborRate: 350,
    partsCost: 1200,
    totalEstimate: 1900,
    actualTotal: 1725,
    faultIds: ['FLT-123', 'FLT-124'],
    notes: 'Customer requested premium oil brand',
    assignedTechnician: 'John Smith'
  },
  {
    id: 'JC-2023-002',
    vehicleId: '22', // SCANIA G460 - Heavy Truck (maintenance status)
    priority: 'critical',
    status: 'parts_pending',
    createdDate: '2023-10-14',
    scheduledDate: '2023-10-15',
    customerName: 'Logistics Ltd',
    workDescription: 'Brake pad replacement - front and rear',
    estimatedHours: 3,
    laborRate: 350,
    partsCost: 2500,
    totalEstimate: 3550,
    faultIds: ['FLT-125'],
    notes: 'Parts ordered, waiting for delivery',
    requiresRCA: true
  },
  {
    id: 'JC-2023-003',
    vehicleId: '14', // ISUZU KB250 - Light Vehicle
    priority: 'medium',
    status: 'completed',
    createdDate: '2023-10-10',
    scheduledDate: '2023-10-12',
    completedDate: '2023-10-13',
    customerName: 'City Distributors',
    workDescription: 'Annual service and inspection',
    estimatedHours: 4,
    actualHours: 4.5,
    laborRate: 350,
    partsCost: 1800,
    totalEstimate: 3200,
    actualTotal: 3375,
    faultIds: [],
    notes: 'All maintenance completed successfully',
    assignedTechnician: 'Mary Johnson'
  }
];

const JobCardComponent: React.FC = () => {
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [filteredJobCards, setFilteredJobCards] = useState<JobCard[]>([]);
  const [showRCAModal, setShowRCAModal] = useState(false);
  const [selectedJobCard, setSelectedJobCard] = useState<JobCard | null>(null);

  // Initialize job cards with vehicle information
  useEffect(() => {
    // Attach vehicle data to each job card
    const jobCardsWithVehicles = SAMPLE_JOB_CARDS.map(jobCard => {
      const vehicle = FLEET_VEHICLES.find((v: Vehicle) => v.id === jobCard.vehicleId);
      return {
        ...jobCard,
        vehicle
      };
    });
    
    setJobCards(jobCardsWithVehicles);
    setFilteredJobCards(jobCardsWithVehicles);
  }, []);

  // Handle filter change
  const handleFilterChange = (filterText: string) => {
    if (!filterText.trim()) {
      setFilteredJobCards(jobCards);
      return;
    }
    
    const filtered = jobCards.filter(jobCard => 
      jobCard.id.toLowerCase().includes(filterText.toLowerCase()) ||
      (jobCard.vehicle?.registrationNo || '').toLowerCase().includes(filterText.toLowerCase()) ||
      (jobCard.vehicle?.fleetNo || '').toLowerCase().includes(filterText.toLowerCase()) ||
      (jobCard.vehicle?.manufacturer || '').toLowerCase().includes(filterText.toLowerCase()) ||
      (jobCard.vehicle?.model || '').toLowerCase().includes(filterText.toLowerCase()) ||
      jobCard.customerName.toLowerCase().includes(filterText.toLowerCase()) ||
      jobCard.workDescription.toLowerCase().includes(filterText.toLowerCase())
    );
    
    setFilteredJobCards(filtered);
  };

  // Handle job card creation (placeholder)
  const handleCreateJob = () => {
    alert('Create job functionality would open a form modal');
  };

  // Handle RCA submission
  const handleRCASubmit = (rcaData: any) => {
    console.log('RCA submitted:', rcaData);
    setShowRCAModal(false);
    
    // Update the job card with the RCA data
    if (selectedJobCard) {
      const updatedJobCards = jobCards.map(job => 
        job.id === selectedJobCard.id 
          ? { ...job, requiresRCA: false, notes: job.notes + ' | RCA completed: ' + rcaData.rootCause } 
          : job
      );
      setJobCards(updatedJobCards);
      setFilteredJobCards(updatedJobCards);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <JobCardHeader 
        title="Workshop Job Cards"
        onCreateJob={handleCreateJob}
        onFilterChange={handleFilterChange}
        totalJobs={jobCards.length}
        pendingJobs={jobCards.filter(job => job.status !== 'completed' && job.status !== 'invoiced').length}
        completedJobs={jobCards.filter(job => job.status === 'completed' || job.status === 'invoiced').length}
      />
      
      <div className="space-y-4">
        {filteredJobCards.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No job cards found matching your criteria</p>
          </div>
        ) : (
          filteredJobCards.map(jobCard => (
            <div key={jobCard.id}>
              <JobCardItem jobCard={jobCard} />
              {jobCard.requiresRCA && (
                <div className="mt-1 mb-4 bg-red-50 border border-red-200 rounded-md p-2 text-sm text-red-700 flex items-center justify-between">
                  <span>This job card requires Root Cause Analysis (RCA) before completion</span>
                  <button 
                    className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded-md"
                    onClick={() => {
                      setSelectedJobCard(jobCard);
                      setShowRCAModal(true);
                    }}
                  >
                    Complete RCA
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* RCA Modal */}
      <RCAModal 
        isOpen={showRCAModal}
        onClose={() => setShowRCAModal(false)}
        onSubmit={handleRCASubmit}
      />
    </div>
  );
};

export default JobCardComponent;