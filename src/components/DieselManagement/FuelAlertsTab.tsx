import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { 
  AlertTriangle, 
  BarChart3, 
  Droplet, 
  Flag, 
  Search, 
  CheckCircle,
  Bell,
  Info,
  Eye,
  User,
  Clock,
  RefreshCw
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { DieselConsumptionRecord } from '../../types';

const FuelAlertsTab: React.FC = () => {
  const { dieselRecords, driverBehaviorEvents, updateDieselRecord, FLEETS_WITH_PROBES } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to refresh alerts (simulated)
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Define alert categories
  const alertCategories = [
    { id: 'all', label: 'All Alerts' },
    { id: 'probe_discrepancy', label: 'Probe Discrepancies' },
    { id: 'efficiency', label: 'Efficiency Alerts' },
    { id: 'missing_verification', label: 'Missing Verification' },
    { id: 'unlinked', label: 'Unlinked Records' },
    { id: 'resolved', label: 'Resolved Alerts' }
  ];

  // Helper function to identify records with probe discrepancies
  const getProbeDiscrepancies = (records: DieselConsumptionRecord[]) => {
    return records.filter(record => 
      FLEETS_WITH_PROBES.includes(record.fleetNumber) &&
      record.probeReading !== undefined &&
      record.probeDiscrepancy !== undefined &&
      Math.abs(record.probeDiscrepancy) > 50 // Alert threshold: 50 liters
    );
  };

  // Helper function to identify efficiency alerts (poor km/l or l/hr)
  const getEfficiencyAlerts = (records: DieselConsumptionRecord[]) => {
    return records.filter(record => {
      if (record.isReeferUnit && record.litresPerHour) {
        // Reefer units: Alert if litres/hour is over 4.0
        return record.litresPerHour > 4.0;
      } else if (!record.isReeferUnit && record.kmPerLitre) {
        // Regular units: Alert if km/liter is under 2.5
        return record.kmPerLitre < 2.5;
      }
      return false;
    });
  };

  // Helper function to identify records missing probe verification
  const getMissingVerification = (records: DieselConsumptionRecord[]) => {
    return records.filter(record =>
      FLEETS_WITH_PROBES.includes(record.fleetNumber) &&
      !record.isReeferUnit &&
      !record.probeVerified
    );
  };

  // Helper function to identify unlinked records
  const getUnlinkedRecords = (records: DieselConsumptionRecord[]) => {
    return records.filter(record => 
      !record.isReeferUnit && 
      !record.tripId
    );
  };

  // Helper function to identify resolved alerts
  const getResolvedAlerts = (records: DieselConsumptionRecord[]) => {
    return records.filter(record => 
      (record.probeVerified && record.probeDiscrepancy !== undefined && Math.abs(record.probeDiscrepancy) > 50) ||
      (record.debriefDate !== undefined)
    );
  };

  // Filter diesel records based on selected category and search term
  const filterDieselRecords = () => {
    let filteredRecords: DieselConsumptionRecord[] = [];

    switch (selectedCategory) {
      case 'probe_discrepancy':
        filteredRecords = getProbeDiscrepancies(dieselRecords);
        break;
      case 'efficiency':
        filteredRecords = getEfficiencyAlerts(dieselRecords);
        break;
      case 'missing_verification':
        filteredRecords = getMissingVerification(dieselRecords);
        break;
      case 'unlinked':
        filteredRecords = getUnlinkedRecords(dieselRecords);
        break;
      case 'resolved':
        filteredRecords = getResolvedAlerts(dieselRecords);
        break;
      default:
        // All alerts
        const probeDiscrepancies = getProbeDiscrepancies(dieselRecords);
        const efficiencyAlerts = getEfficiencyAlerts(dieselRecords);
        const missingVerification = getMissingVerification(dieselRecords);
        const unlinkedRecords = getUnlinkedRecords(dieselRecords);
        
        // Combine all alerts (excluding resolved ones)
        filteredRecords = [...new Set([...probeDiscrepancies, ...efficiencyAlerts, ...missingVerification, ...unlinkedRecords])];
        break;
    }

    // Apply search filter if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredRecords = filteredRecords.filter(record => 
        record.fleetNumber.toLowerCase().includes(term) || 
        record.driverName.toLowerCase().includes(term) || 
        record.fuelStation.toLowerCase().includes(term)
      );
    }

    return filteredRecords;
  };

  const alertRecords = filterDieselRecords();

  // Summary statistics
  const alertSummary = {
    probeDiscrepancies: getProbeDiscrepancies(dieselRecords).length,
    efficiencyAlerts: getEfficiencyAlerts(dieselRecords).length,
    missingVerification: getMissingVerification(dieselRecords).length,
    unlinkedRecords: getUnlinkedRecords(dieselRecords).length,
    resolvedAlerts: getResolvedAlerts(dieselRecords).length,
    totalAlerts: getProbeDiscrepancies(dieselRecords).length + 
                 getEfficiencyAlerts(dieselRecords).length + 
                 getMissingVerification(dieselRecords).length + 
                 getUnlinkedRecords(dieselRecords).length
  };

  // Handle marking an alert as resolved
  const handleResolveAlert = async (recordId: string) => {
    const record = dieselRecords.find(r => r.id === recordId);
    if (!record) return;

    try {
      // Update the record with resolution data
      const updatedRecord = {
        ...record,
        debriefDate: new Date().toISOString(),
        debriefSignedBy: 'Current User', // In a real app, use logged-in user
        debriefNotes: 'Alert reviewed and resolved',
        updatedAt: new Date().toISOString()
      };

      await updateDieselRecord(updatedRecord);
      alert('Alert marked as resolved');
    } catch (error) {
      console.error('Error resolving alert:', error);
      alert('Failed to resolve alert. Please try again.');
    }
  };

  // Render the appropriate alert badge based on type
  const renderAlertBadge = (record: DieselConsumptionRecord) => {
    if (FLEETS_WITH_PROBES.includes(record.fleetNumber) &&
        record.probeReading !== undefined &&
        record.probeDiscrepancy !== undefined &&
        Math.abs(record.probeDiscrepancy) > 50) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Probe Discrepancy
        </span>
      );
    } else if (record.isReeferUnit && record.litresPerHour && record.litresPerHour > 4.0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <Droplet className="w-3 h-3 mr-1" />
          High Reefer Consumption
        </span>
      );
    } else if (!record.isReeferUnit && record.kmPerLitre && record.kmPerLitre < 2.5) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <BarChart3 className="w-3 h-3 mr-1" />
          Low Efficiency
        </span>
      );
    } else if (FLEETS_WITH_PROBES.includes(record.fleetNumber) && !record.isReeferUnit && !record.probeVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <Info className="w-3 h-3 mr-1" />
          Needs Verification
        </span>
      );
    } else if (!record.isReeferUnit && !record.tripId) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Flag className="w-3 h-3 mr-1" />
          Unlinked Record
        </span>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fuel Alerts</h2>
          <p className="text-gray-600">Monitor and address potential diesel consumption issues</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onClick}
            icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            disabled={isRefreshing}
          >
            Refresh Alerts
          </Button>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{alertSummary.totalAlerts}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Probe Discrepancies</p>
                <p className="text-2xl font-bold text-red-600">{alertSummary.probeDiscrepancies}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Efficiency Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{alertSummary.efficiencyAlerts}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Needs Verification</p>
                <p className="text-2xl font-bold text-amber-600">{alertSummary.missingVerification}</p>
              </div>
              <Info className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unlinked Records</p>
                <p className="text-2xl font-bold text-blue-600">{alertSummary.unlinkedRecords}</p>
              </div>
              <Flag className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{alertSummary.resolvedAlerts}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alert Category</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {alertCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by fleet, driver, or fuel station"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert List */}
      <Card>
        <CardHeader title={`Fuel Alerts (${alertRecords.length})`} />
        <CardContent>
          {alertRecords.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedCategory !== 'all' || searchTerm 
                  ? 'No alerts match your current filter criteria.' 
                  : 'Great job! There are no fuel alerts that need your attention.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alertRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900 mr-2">Fleet {record.fleetNumber}</h3>
                        {renderAlertBadge(record)}
                        {record.debriefDate && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolved
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{record.driverName}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{formatDate(record.date)}</span>
                        </div>
                        
                        <div className="flex items-center">
                          <Droplet className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{record.litresFilled.toFixed(1)} L</span>
                        </div>
                        
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600">
                            {formatCurrency(record.totalCost, record.currency || 'ZAR')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        {/* Specific alert details based on type */}
                        {record.probeDiscrepancy !== undefined && Math.abs(record.probeDiscrepancy) > 50 && (
                          <div className="p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm font-medium text-red-700">
                              Probe Discrepancy: {record.probeDiscrepancy.toFixed(1)} liters
                              ({((record.probeDiscrepancy / record.litresFilled) * 100).toFixed(1)}%)
                            </p>
                            {record.probeVerificationNotes && (
                              <p className="text-xs text-red-600 mt-1">
                                Notes: {record.probeVerificationNotes}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {record.isReeferUnit && record.litresPerHour && record.litresPerHour > 4.0 && (
                          <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                            <p className="text-sm font-medium text-orange-700">
                              High Reefer Consumption: {record.litresPerHour.toFixed(2)} L/hr (Expected: &lt;4.0)
                            </p>
                          </div>
                        )}
                        
                        {!record.isReeferUnit && record.kmPerLitre && record.kmPerLitre < 2.5 && (
                          <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                            <p className="text-sm font-medium text-orange-700">
                              Low Efficiency: {record.kmPerLitre.toFixed(2)} km/L (Expected: &gt;2.5)
                            </p>
                            {record.distanceTravelled && (
                              <p className="text-xs text-orange-600 mt-1">
                                Distance: {record.distanceTravelled.toLocaleString()} km
                              </p>
                            )}
                          </div>
                        )}
                        
                        {FLEETS_WITH_PROBES.includes(record.fleetNumber) && !record.isReeferUnit && !record.probeVerified && (
                          <div className="p-2 bg-amber-50 border border-amber-200 rounded">
                            <p className="text-sm font-medium text-amber-700">
                              This record requires probe verification
                            </p>
                          </div>
                        )}
                        
                        {!record.isReeferUnit && !record.tripId && (
                          <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm font-medium text-blue-700">
                              This diesel record is not linked to any trip
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {record.debriefDate && (
                        <div className="p-2 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 mr-1" />
                            <div>
                              <p className="text-sm font-medium text-green-700">
                                Resolved on {formatDate(record.debriefDate)} by {record.debriefSignedBy}
                              </p>
                              {record.debriefNotes && (
                                <p className="text-xs text-green-600 mt-1">
                                  Notes: {record.debriefNotes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Eye className="w-3 h-3" />}
                        onClick={() => {
                          // This would navigate to the diesel detail view in a real app
                          alert(`View details for diesel record: ${record.id}`);
                        }}
                      >
                        View
                      </Button>
                      
                      {!record.debriefDate && (
                        <Button
                          size="sm"
                          variant="outline"
                          icon={<CheckCircle className="w-3 h-3" />}
                          onClick={onClick}
                        >
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Efficiency Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-3">Fuel Efficiency Guidelines</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-blue-700 mb-2">Regular Vehicles (Trucks)</h4>
            <ul className="space-y-1 list-disc list-inside text-sm text-blue-600">
              <li>Expected Range: 2.5 - 3.5 km/L</li>
              <li>Alert Threshold: Below 2.5 km/L</li>
              <li>Ideal Range: 3.0 - 3.5 km/L</li>
              <li>Exceptional: Above 3.5 km/L</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-blue-700 mb-2">Reefer Units</h4>
            <ul className="space-y-1 list-disc list-inside text-sm text-blue-600">
              <li>Expected Range: 3.0 - 4.0 L/hr</li>
              <li>Alert Threshold: Above 4.0 L/hr</li>
              <li>Ideal Range: 3.0 - 3.5 L/hr</li>
              <li>Exceptional: Below 3.0 L/hr</li>
            </ul>
          </div>
        </div>
        
        <h4 className="text-sm font-medium text-blue-700 mt-4 mb-2">Probe Verification</h4>
        <p className="text-sm text-blue-600">
          Probe discrepancies greater than 50 liters or 10% of the filled amount trigger an alert
          and require investigation. All probe-equipped vehicles should have their readings verified.
        </p>
      </div>
    </div>
  );
};

export default FuelAlertsTab;