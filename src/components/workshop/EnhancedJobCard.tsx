import React, { useState, useEffect } from 'react';
import { JobCardHeader } from './jobcard/JobCardHeader';
import EnhancedJobCardItem from './jobcard/EnhancedJobCardItem';
import syncService from '../../utils/syncService';
import LoadingIndicator from '../ui/LoadingIndicator';
import { useAppContext } from '../../context/AppContext';
import { EnhancedJobCard } from '../../types/workshop-job-card';
import { Vehicle } from '../../types/vehicle';
import { FLEET_VEHICLES } from '../../data/vehicles/fleetVehicles';

// Sample data for initial testing - will be replaced with Firebase data
const SAMPLE_ENHANCED_JOB_CARDS: EnhancedJobCard[] = [
  {
    id: 'EJC-2023-001',
    workOrderInfo: {
      workOrderNumber: 'WO-2023-001',
      date: '2023-10-15',
      title: 'Routine Engine Maintenance',
      createdBy: 'John Technician'
    },
    vehicleAssetDetails: {
      vehicleNumber: '21',
      vehicleName: 'SCANIA G460',
      model: 'Heavy Truck',
      meterReading: 45000,
      status: 'in_progress',
      priority: 'medium',
      type: 'maintenance',
      assignedTo: 'David Mechanic'
    },
    linkedRecords: {
      linkedInspection: 'INSP-2023-42'
    },
    schedulingInfo: {
      startDate: '2023-10-16',
      dueDate: '2023-10-18',
      estimatedTimeHours: 4,
      actualTimeHours: 3.5
    },
    taskDetails: [
      {
        sn: 1,
        task: 'Engine oil change',
        status: 'completed',
        type: 'service'
      },
      {
        sn: 2,
        task: 'Oil filter replacement',
        status: 'completed',
        type: 'replace'
      },
      {
        sn: 3,
        task: 'Air filter check',
        status: 'completed',
        type: 'inspect'
      },
      {
        sn: 4,
        task: 'Coolant level check',
        status: 'in_progress',
        type: 'inspect'
      },
      {
        sn: 5,
        task: 'Belt tension check',
        status: 'initiated',
        type: 'inspect'
      }
    ],
    partsAndMaterials: [
      {
        sn: 1,
        itemNumber: 'OIL-5W40-20L',
        itemName: 'Engine Oil 5W40',
        quantity: 20,
        totalCost: 1200,
        note: 'Premium synthetic oil'
      },
      {
        sn: 2,
        itemNumber: 'FLT-OIL-SCANIA',
        itemName: 'Oil Filter for Scania',
        quantity: 1,
        totalCost: 350
      }
    ],
    laborDetails: [
      {
        sn: 1,
        laborName: 'Engine Service',
        laborCode: 'ENG-SRV-STD',
        rate: 450,
        hours: '3.5',
        cost: 1575,
        note: 'Standard engine service'
      }
    ],
    additionalCosts: [
      {
        sn: 1,
        costDescription: 'Disposal fees',
        cost: 100
      }
    ],
    costSummary: {
      partsMaterialCost: 1550,
      totalLaborCost: 1575,
      additionalCost: 100,
      taxAmount: 483.75,
      taxRate: 15,
      totalWOCost: 3708.75
    },
    customBusinessFields: [
      {
        fieldName: 'Department',
        fieldValue: 'Fleet Maintenance'
      },
      {
        fieldName: 'Cost Center',
        fieldValue: 'CC-FLEET-001'
      }
    ],
    workOrderMemo: 'Customer requested service to be completed before weekend trip',
    createdAt: '2023-10-15T08:00:00Z',
    updatedAt: '2023-10-16T14:30:00Z'
  }
];

const EnhancedJobCardComponent: React.FC = () => {
  const { isLoading } = useAppContext();
  const [jobCards, setJobCards] = useState<EnhancedJobCard[]>([]);
  const [filteredJobCards, setFilteredJobCards] = useState<EnhancedJobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobCard, setSelectedJobCard] = useState<EnhancedJobCard | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Register enhanced jobCards state update callback with syncService
  useEffect(() => {
    // Register the setEnhancedJobCards callback with syncService
    syncService.registerDataCallbacks({
      setEnhancedJobCards: (cards: EnhancedJobCard[]) => {
        setJobCards(cards);
        setFilteredJobCards(cards);
        setLoading(false);
      }
    });

    // Subscribe to enhanced job cards collection
    syncService.subscribeToAllEnhancedJobCards();

    // If no data comes back in 2 seconds, use sample data (for development only)
    const timer = setTimeout(() => {
      if (jobCards.length === 0) {
        console.warn('No enhanced job cards found in Firestore, using sample data');
        setJobCards(SAMPLE_ENHANCED_JOB_CARDS);
        setFilteredJobCards(SAMPLE_ENHANCED_JOB_CARDS);
        setLoading(false);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
      // Unsubscribe from enhanced job cards
      syncService.unsubscribeFromAllEnhancedJobCards();
    };
  }, []);

  // Handle filter change
  const handleFilterChange = (filterText: string) => {
    if (!filterText.trim()) {
      setFilteredJobCards(jobCards);
      return;
    }
    
    const searchTermLower = filterText.toLowerCase();
    const filtered = jobCards.filter(jobCard => 
      jobCard.workOrderInfo.workOrderNumber.toLowerCase().includes(searchTermLower) ||
      jobCard.workOrderInfo.title.toLowerCase().includes(searchTermLower) ||
      jobCard.vehicleAssetDetails.vehicleNumber.toLowerCase().includes(searchTermLower) ||
      jobCard.vehicleAssetDetails.vehicleName.toLowerCase().includes(searchTermLower) ||
      jobCard.vehicleAssetDetails.model.toLowerCase().includes(searchTermLower) ||
      jobCard.vehicleAssetDetails.assignedTo.toLowerCase().includes(searchTermLower) ||
      jobCard.workOrderMemo?.toLowerCase().includes(searchTermLower)
    );
    
    setFilteredJobCards(filtered);
  };

  // Handle job card creation
  const handleCreateJob = async () => {
    try {
      // In a real implementation, this would open a form modal first
      // For now, we'll create a sample enhanced job card with all required fields
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      
      const newJobCard: Omit<EnhancedJobCard, 'id'> = {
        workOrderInfo: {
          workOrderNumber: `WO-${now.getFullYear()}-${String(now.getTime()).slice(-5)}`,
          date: dateStr,
          title: 'New Work Order',
          createdBy: 'System User'
        },
        vehicleAssetDetails: {
          vehicleNumber: '21', // Example vehicle
          vehicleName: 'SCANIA G460',
          model: 'Heavy Truck',
          meterReading: 50000,
          status: 'initiated',
          priority: 'medium',
          type: 'general',
          assignedTo: 'Unassigned'
        },
        linkedRecords: {},
        schedulingInfo: {
          startDate: dateStr,
          dueDate: new Date(now.setDate(now.getDate() + 7)).toISOString().split('T')[0],
          estimatedTimeHours: 2
        },
        taskDetails: [
          {
            sn: 1,
            task: 'Initial assessment',
            status: 'initiated',
            type: 'inspect'
          }
        ],
        partsAndMaterials: [],
        laborDetails: [],
        additionalCosts: [],
        costSummary: {
          partsMaterialCost: 0,
          totalLaborCost: 0,
          additionalCost: 0,
          taxAmount: 0,
          taxRate: 15,
          totalWOCost: 0
        },
        customBusinessFields: [],
        workOrderMemo: 'New work order created from dashboard',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to Firestore using syncService
      await syncService.addEnhancedJobCard(newJobCard);
      
      // The UI will update automatically when the Firestore listener fires
    } catch (error) {
      console.error('Error creating enhanced job card:', error);
      alert('Failed to create job card. Please try again.');
    }
  };

  // Handle view details
  const handleViewDetails = (jobCard: EnhancedJobCard) => {
    setSelectedJobCard(jobCard);
    setShowDetailsModal(true);
    // In a real implementation, this would open a modal with detailed information
    console.log('View details for job card:', jobCard.id);
  };

  // Calculate statistics
  const totalJobs = jobCards.length;
  const pendingJobs = jobCards.filter(job => 
    job.vehicleAssetDetails.status !== 'completed' && 
    job.vehicleAssetDetails.status !== 'cancelled'
  ).length;
  const completedJobs = jobCards.filter(job => 
    job.vehicleAssetDetails.status === 'completed'
  ).length;

  return (
    <div className="container mx-auto px-4 py-6">
      {loading || isLoading?.loadJobCards ? (
        <div className="flex justify-center items-center h-64">
          <LoadingIndicator />
          <span className="ml-2 text-gray-600">Loading enhanced job cards...</span>
        </div>
      ) : (
        <>
          <JobCardHeader 
            title="Enhanced Workshop Job Cards"
            onCreateJob={handleCreateJob}
            onFilterChange={handleFilterChange}
            totalJobs={totalJobs}
            pendingJobs={pendingJobs}
            completedJobs={completedJobs}
          />
          
          <div className="space-y-4">
            {filteredJobCards.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No job cards found matching your criteria</p>
              </div>
            ) : (
              filteredJobCards.map(jobCard => (
                <EnhancedJobCardItem 
                  key={jobCard.id} 
                  jobCard={jobCard} 
                  onViewDetails={handleViewDetails} 
                />
              ))
            )}
          </div>
          
          {/* In a real implementation, you would add a details modal here */}
          {showDetailsModal && selectedJobCard && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
                <h2 className="text-2xl font-bold mb-4">
                  {selectedJobCard.workOrderInfo.workOrderNumber}: {selectedJobCard.workOrderInfo.title}
                </h2>
                <p className="text-gray-500 mb-4">
                  This is a placeholder for a detailed view of the job card. In a real implementation, 
                  this would show all details and allow editing of the job card.
                </p>
                <div className="mt-6 flex justify-end">
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EnhancedJobCardComponent;