import React, { useState, useEffect } from 'react';
import { Trip, CostEntry, Attachment, AdditionalCost, DelayReason } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { useSyncContext } from '../../context/SyncContext';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import CostForm from '../costs/CostForm';
import CostList from '../costs/CostList';
import TripReport from '../reports/TripReport';
import IndirectCost from '../costs/IndirectCost';
import TripPlanningForm from '../planning/TripPlanningForm';
import { 
  ArrowLeft, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Flag, 
  Calculator,
  Send,
  Clock,
  Calendar,
  Truck,
  User,
  MapPin,
  DollarSign,
  Plus
} from 'lucide-react';
import { 
  formatCurrency, 
  calculateKPIs, 
  getFlaggedCostsCount, 
  getUnresolvedFlagsCount, 
  canCompleteTrip,
  formatDate
} from '../../utils/helpers';
import SyncIndicator from '../ui/SyncIndicator';

interface TripDashboardProps {
  trip: Trip;
  onBack: () => void;
}

const TripDashboard: React.FC<TripDashboardProps> = ({ trip, onBack }) => {
  const { addCostEntry, updateCostEntry, deleteCostEntry, updateTrip, addAdditionalCost, removeAdditionalCost, addDelayReason } = useAppContext();
  const { subscribeToTrip } = useSyncContext();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showCostForm, setShowCostForm] = useState(false);
  const [showSystemCostGenerator, setShowSystemCostGenerator] = useState(false);
  const [editingCost, setEditingCost] = useState<CostEntry | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to real-time updates for this trip
  React.useEffect(() => {
    subscribeToTrip(trip.id);
  }, [trip.id, subscribeToTrip]);

  // Enhanced handleAddCost with file support
  const handleAddCost = async (costData: Omit<CostEntry, 'id' | 'attachments'>, files?: FileList) => {
    try {
      setIsLoading(true);
      await addCostEntry(costData, files);
      setShowCostForm(false);
      
      // Show success message with cost details
      alert(`Cost entry added successfully!\n\nCategory: ${costData.category}\nAmount: ${formatCurrency(costData.amount, costData.currency)}\nReference: ${costData.referenceNumber}`);
    } catch (error) {
      console.error('Error adding cost entry:', error);
      alert('Error adding cost entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced handleUpdateCost with file support
  const handleUpdateCost = async (costData: Omit<CostEntry, 'id' | 'attachments'>, files?: FileList) => {
    if (editingCost) {
      try {
        setIsLoading(true);
        // Process new files if provided
        const newAttachments = files ? Array.from(files).map((file, index) => ({
          id: `A${Date.now()}-${index}`,
          costEntryId: editingCost.id,
          filename: file.name,
          fileUrl: URL.createObjectURL(file),
          fileType: file.type,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
          fileData: ''
        })) : [];

        const updatedCost: CostEntry = {
          ...editingCost,
          ...costData,
          attachments: [...editingCost.attachments, ...newAttachments]
        };

        await updateCostEntry(updatedCost);
        setEditingCost(undefined);
        setShowCostForm(false);
        
        alert('Cost entry updated successfully!');
      } catch (error) {
        console.error('Error updating cost entry:', error);
        alert('Error updating cost entry. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditCost = (cost: CostEntry) => {
    setEditingCost(cost);
    setShowCostForm(true);
  };

  const handleDeleteCost = async (id: string) => {
    if (confirm('Are you sure you want to delete this cost entry? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        await deleteCostEntry(id);
        alert('Cost entry deleted successfully!');
      } catch (error) {
        console.error('Error deleting cost entry:', error);
        alert('Error deleting cost entry. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGenerateSystemCosts = async (systemCosts: Omit<CostEntry, 'id' | 'attachments'>[]) => {
    try {
      setIsLoading(true);
      // Add each system cost entry individually
      for (const costData of systemCosts) {
        await addCostEntry(costData);
      }
      
      setShowSystemCostGenerator(false);
      
      // Show detailed success message
      alert(`System costs generated successfully!\n\n${systemCosts.length} cost entries have been added:\n\n${systemCosts.map(cost => `• ${cost.subCategory}: ${formatCurrency(cost.amount, cost.currency)}`).join('\n')}\n\nTotal system costs: ${formatCurrency(systemCosts.reduce((sum, cost) => sum + cost.amount, 0), trip.revenueCurrency)}`);
    } catch (error) {
      console.error('Error generating system costs:', error);
      alert('Error generating system costs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTrip = async () => {
    const unresolvedFlags = getUnresolvedFlagsCount(trip.costs);
    
    if (unresolvedFlags > 0) {
      alert(`Cannot complete trip: ${unresolvedFlags} unresolved flagged items must be resolved before completing the trip.\n\nPlease go to the Flags & Investigations section to resolve all outstanding issues.`);
      return;
    }

    const confirmMessage = `Are you sure you want to mark this trip as COMPLETED?\n\n` +
      `This will:\n` +
      `• Lock the trip from further editing\n` +
      `• Move it to the Completed Trips section\n` +
      `• Make it available for invoicing\n\n` +
      `This action cannot be undone.`;

    if (confirm(confirmMessage)) {
      try {
        setIsLoading(true);
        await updateTrip({
          ...trip,
          status: 'completed',
          completedAt: new Date().toISOString().split('T')[0],
          completedBy: 'Current User' // In a real app, this would be the logged-in user
        });
        
        alert('Trip has been successfully completed and is now ready for invoicing.');
        onBack();
      } catch (error) {
        console.error('Error completing trip:', error);
        alert('Error completing trip. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle additional cost management
  const handleAddAdditionalCost = async (cost: Omit<AdditionalCost, 'id'>, files?: FileList) => {
    try {
      setIsLoading(true);
      await addAdditionalCost(trip.id, cost, files);
      alert('Additional cost added successfully!');
    } catch (error) {
      console.error('Error adding additional cost:', error);
      alert('Error adding additional cost. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAdditionalCost = async (costId: string) => {
    try {
      setIsLoading(true);
      await removeAdditionalCost(trip.id, costId);
      alert('Additional cost removed successfully!');
    } catch (error) {
      console.error('Error removing additional cost:', error);
      alert('Error removing additional cost. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDelayReason = async (delay: Omit<DelayReason, 'id'>) => {
    try {
      setIsLoading(true);
      await addDelayReason(trip.id, delay);
      alert('Delay reason added successfully!');
    } catch (error) {
      console.error('Error adding delay reason:', error);
      alert('Error adding delay reason. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const kpis = calculateKPIs(trip);
  const flaggedCount = getFlaggedCostsCount(trip.costs);
  const unresolvedFlags = getUnresolvedFlagsCount(trip.costs);
  const canComplete = canCompleteTrip(trip);
  
  // Check if system costs have been generated
  const hasSystemCosts = trip.costs.some(cost => cost.isSystemGenerated);
  const systemCosts = trip.costs.filter(cost => cost.isSystemGenerated);
  const manualCosts = trip.costs.filter(cost => !cost.isSystemGenerated);

  return (
    <div className="space-y-6">
      {/* Header with Navigation and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button variant="outline" onClick={onBack} icon={<ArrowLeft className="w-4 h-4" />}>
          Back to Trips
        </Button>
        
        <div className="flex flex-wrap gap-3">
          {trip.status === 'active' && (
            <>
              {!hasSystemCosts && (
                <Button 
                  variant="outline"
                  onClick={() => setShowSystemCostGenerator(true)} 
                  icon={<Calculator className="w-4 h-4" />}
                  isLoading={isLoading}
                >
                  Generate System Costs
                </Button>
              )}
              
              <Button 
                onClick={() => setShowCostForm(true)} 
                icon={<Plus className="w-4 h-4" />}
                isLoading={isLoading}
              >
                Add Cost Entry
              </Button>
              
              <Button 
                onClick={handleCompleteTrip}
                disabled={!canComplete || isLoading}
                icon={<CheckCircle className="w-4 h-4" />}
                isLoading={isLoading}
                title={!canComplete ? `Cannot complete: ${unresolvedFlags} unresolved flags` : 'Mark trip as completed'}
              >
                Complete Trip
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Trip Overview Card */}
      <Card>
        <CardHeader title={`Trip Dashboard: Fleet ${trip.fleetNumber}`}>
          <div className="flex items-center mt-1">
            <p className="text-gray-600 mr-3">Manage trip details, costs, and status</p>
            <SyncIndicator />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trip Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-medium text-gray-900">Trip Details</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <User className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Driver</p>
                    <p className="font-medium">{trip.driverName}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Route</p>
                    <p className="font-medium">{trip.route}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-medium">{trip.clientName}</p>
                    <p className="text-xs text-gray-500">
                      {trip.clientType === 'internal' ? 'Internal Client' : 'External Client'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Financial Summary */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-medium text-gray-900">Financial Summary</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <DollarSign className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="font-medium text-green-600">{formatCurrency(kpis.totalRevenue, kpis.currency)}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <DollarSign className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Expenses</p>
                    <p className="font-medium text-red-600">{formatCurrency(kpis.totalExpenses, kpis.currency)}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <DollarSign className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Net Profit</p>
                    <p className={`font-medium ${kpis.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(kpis.netProfit, kpis.currency)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <BarChart3 className="w-4 h-4 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Profit Margin</p>
                    <p className={`font-medium ${kpis.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {kpis.profitMargin.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status & Flags */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Flag className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-medium text-gray-900">Status & Flags</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      trip.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      trip.status === 'invoiced' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {trip.status === 'completed' ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> Completed</>
                      ) : trip.status === 'invoiced' ? (
                        <><DollarSign className="w-3 h-3 mr-1" /> Invoiced</>
                      ) : (
                        <><Clock className="w-3 h-3 mr-1" /> Active</>
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Flag className="w-4 h-4 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Flagged Items</p>
                    <p className="font-medium">
                      {flaggedCount} total
                      {flaggedCount > 0 && (
                        <span className="ml-2">
                          ({unresolvedFlags} unresolved)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Completion Status</p>
                    <p className={`font-medium ${canComplete ? 'text-green-600' : 'text-red-600'}`}>
                      {canComplete ? 'Ready to Complete' : 'Cannot Complete'}
                    </p>
                    {!canComplete && (
                      <p className="text-xs text-red-500 mt-1">
                        Resolve {unresolvedFlags} flag{unresolvedFlags !== 1 ? 's' : ''} first
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Calculator className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Cost Entries</p>
                    <p className="font-medium">{trip.costs.length} entries</p>
                    {hasSystemCosts && (
                      <p className="text-xs text-gray-500">
                        {manualCosts.length} manual • {systemCosts.length} system
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="costs">Cost Management</TabsTrigger>
          <TabsTrigger value="planning">Trip Planning</TabsTrigger>
          <TabsTrigger value="report">Trip Report</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <TripReport trip={trip} />
        </TabsContent>
        
        <TabsContent value="costs">
          <div className="space-y-6">
            {/* Cost Management Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium text-gray-900">Cost Management</h3>
              {trip.status === 'active' && (
                <Button 
                  onClick={() => setShowCostForm(true)} 
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Cost Entry
                </Button>
              )}
            </div>
            
            {/* System Costs Alert */}
            {trip.status === 'active' && !hasSystemCosts && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
                <div className="flex items-start">
                  <Calculator className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">
                      System Costs Not Generated
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Automatic operational overhead costs have not been applied to this trip. 
                      Generate system costs to ensure accurate profitability assessment including per-kilometer and per-day fixed costs.
                    </p>
                    <div className="mt-2">
                      <Button 
                        size="sm"
                        onClick={() => setShowSystemCostGenerator(true)} 
                        icon={<Calculator className="w-4 h-4" />}
                      >
                        Generate System Costs Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Cost List */}
            <CostList 
              costs={trip.costs} 
              onEdit={trip.status === 'active' ? handleEditCost : undefined}
              onDelete={trip.status === 'active' ? handleDeleteCost : undefined}
            />
            
            {/* Cost Form */}
            {showCostForm && (
              <Card>
                <CardHeader 
                  title={editingCost ? "Edit Cost Entry" : "Add Cost Entry"}
                  action={
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowCostForm(false);
                        setEditingCost(undefined);
                      }}
                    >
                      Cancel
                    </Button>
                  }
                />
                <CardContent>
                  <CostForm
                    tripId={trip.id}
                    cost={editingCost}
                    onSubmit={editingCost ? handleUpdateCost : handleAddCost}
                    onCancel={() => {
                      setShowCostForm(false);
                      setEditingCost(undefined);
                    }}
                  />
                </CardContent>
              </Card>
            )}
            
            {/* System Cost Generator */}
            {showSystemCostGenerator && (
              <Card>
                <CardHeader 
                  title="Generate System Costs"
                  action={
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowSystemCostGenerator(false)}
                    >
                      Cancel
                    </Button>
                  }
                />
                <CardContent>
                  <IndirectCost
                    trip={trip}
                    onGenerateSystemCosts={handleGenerateSystemCosts}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="planning">
          <Card>
            <CardHeader title="Trip Planning & Timeline" />
            <CardContent>
              <TripPlanningForm
                trip={trip}
                onUpdate={updateTrip}
                onAddDelay={handleAddDelayReason}
                readOnly={trip.status !== 'active'}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="report">
          <TripReport trip={trip} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TripDashboard;