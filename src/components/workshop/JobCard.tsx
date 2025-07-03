import React, { useState, useEffect } from 'react';
import { JobCardHeader } from './jobcard/JobCardHeader';
import { JobCardItem } from './jobcard/JobCardItem';
import RCAModal from './RCAModal';
import { FLEET_VEHICLES, Vehicle } from '../../types/vehicle';
import syncService from '../../utils/syncService';
import LoadingIndicator from '../ui/LoadingIndicator';
import { useAppContext } from '../../context/AppContext';

// Import and export JobCard type for use in other components
export interface JobCard {
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
  createdAt?: string;
  updatedAt?: string;
}

// Sample data for initial testing only - will be replaced with Firebase data
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
  }
];

const JobCardComponent: React.FC = () => {
  const { isLoading } = useAppContext();
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [filteredJobCards, setFilteredJobCards] = useState<JobCard[]>([]);
  const [showRCAModal, setShowRCAModal] = useState(false);
  const [selectedJobCard, setSelectedJobCard] = useState<JobCard | null>(null);
  const [loading, setLoading] = useState(true);

  // Register jobCards state update callback with syncService
  useEffect(() => {
    // Register the setJobCards callback with syncService
    syncService.registerDataCallbacks({
      setJobCards: (cards: JobCard[]) => {
        // Attach vehicle data to each job card
        const jobCardsWithVehicles = cards.map(jobCard => {
          const vehicle = FLEET_VEHICLES.find((v: Vehicle) => v.id === jobCard.vehicleId);
          return {
            ...jobCard,
            vehicle
          };
        });
        
        setJobCards(jobCardsWithVehicles);
        setFilteredJobCards(jobCardsWithVehicles);
        setLoading(false);
      }
    });

    // Subscribe to job cards collection
    syncService.subscribeToAllJobCards();

    // If no data comes back in 2 seconds, use sample data (for development only)
    const timer = setTimeout(() => {
      if (jobCards.length === 0) {
        console.warn('No job cards found in Firestore, using sample data');
        const jobCardsWithVehicles = SAMPLE_JOB_CARDS.map(jobCard => {
          const vehicle = FLEET_VEHICLES.find((v: Vehicle) => v.id === jobCard.vehicleId);
          return {
            ...jobCard,
            vehicle
          };
        });
        
        setJobCards(jobCardsWithVehicles);
        setFilteredJobCards(jobCardsWithVehicles);
        setLoading(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
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

  // Handle job card creation
  const handleCreateJob = async () => {
    try {
      // In a real implementation, this would open a form modal first
      // For now, we'll create a sample job card
      const newJobCard: Omit<JobCard, 'id'> = {
        vehicleId: '21', // SCANIA G460 - Heavy Truck
        priority: 'medium',
        status: 'created',
        createdDate: new Date().toISOString().split('T')[0],
        customerName: 'New Customer',
        workDescription: 'Sample maintenance task',
        estimatedHours: 2,
        laborRate: 350,
        partsCost: 1000,
        totalEstimate: 1700,
        faultIds: [],
        notes: 'New job card created from UI'
      };

      // Add to Firestore
      await syncService.addJobCard(newJobCard);
      
      // The UI will update automatically when the Firestore listener fires
    } catch (error) {
      console.error('Error creating job card:', error);
      alert('Failed to create job card. Please try again.');
    }
  };

  // Handle RCA submission
  const handleRCASubmit = async (rcaData: any) => {
    console.log('RCA submitted:', rcaData);
    setShowRCAModal(false);
    
    if (!selectedJobCard) return;
    
    try {
      // Update the job card with the RCA data
      const updatedJobCard = {
        ...selectedJobCard,
        requiresRCA: false,
        notes: selectedJobCard.notes + ' | RCA completed: ' + rcaData.rootCause
      };
      
      // Update in Firestore
      await syncService.updateJobCard(selectedJobCard.id, updatedJobCard);
      
      // The UI will update automatically when the Firestore listener fires
    } catch (error) {
      console.error('Error updating job card with RCA data:', error);
      alert('Failed to save RCA data. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {loading || isLoading?.loadJobCards ? (
        <div className="flex justify-center items-center h-64">
          <LoadingIndicator />
          <span className="ml-2 text-gray-600">Loading job cards...</span>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default JobCardComponent;