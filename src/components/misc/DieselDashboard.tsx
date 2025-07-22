import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useSyncContext } from '../../context/SyncContext';
import { DieselConsumptionRecord } from '../../types';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Select } from '../ui/FormElements';
import { 
  Fuel, 
  Plus, 
  Search,
  Upload, 
  Download, 
  Settings, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Link,
  Trash2
} from 'lucide-react';
import FleetSelector from '../common/FleetSelector';
import { formatCurrency, formatDate } from '../../utils/helpers';
import SyncIndicator from '../ui/SyncIndicator';
import ManualDieselEntryModal from './ManualDieselEntryModal';
import DieselImportModal from './DieselImportModal';
import DieselNormsModal from './DieselNormsModal';
import EnhancedDieselDebriefModal from './EnhancedDieselDebriefModal';
import EnhancedProbeVerificationModal from './EnhancedProbeVerificationModal';
import TripLinkageModal from './TripLinkageModal';
import DieselEditModal from './DieselEditModal';

const DieselDashboard: React.FC = () => {
  const { dieselRecords = [], trips = [], deleteDieselRecord } = useAppContext();
  const { subscribeToDieselRecords } = useSyncContext();
  
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showNormsModal, setShowNormsModal] = useState(false);
  const [showDebriefModal, setShowDebriefModal] = useState(false);
  const [showProbeModal, setShowProbeModal] = useState(false);
  const [showLinkageModal, setShowLinkageModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [selectedDieselId, setSelectedDieselId] = useState<string>('');
  const [filterFleet, setFilterFleet] = useState<string>('');
  const [filterDriver, setFilterDriver] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' });
  const [filterFuelStation, setFilterFuelStation] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all'); // 'all', 'horse', 'reefer'
  
  const [dieselNorms, setDieselNorms] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Subscribe to diesel records for the selected fleet
  useEffect(() => {
    if (filterFleet) {
      subscribeToDieselRecords(filterFleet);
    }
  }, [filterFleet, subscribeToDieselRecords]);
  
  // Apply filters
  const filteredRecords = dieselRecords.filter(record => {
    if (filterFleet && record.fleetNumber !== filterFleet) return false;
    if (filterDriver && record.driverName !== filterDriver) return false;
    if (filterDateRange.start && record.date < filterDateRange.start) return false;
    if (filterDateRange.end && record.date > filterDateRange.end) return false;
    if (filterFuelStation && record.fuelStation !== filterFuelStation) return false;
    if (filterType === 'horse' && record.isReeferUnit) return false;
    if (filterType === 'reefer' && !record.isReeferUnit) return false;
    return true;
  });
  
  // Sort by date (newest first)
  const sortedRecords = [...filteredRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get unique values for filters
  const uniqueFleets = [...new Set(dieselRecords.map(r => r.fleetNumber))].sort();
  const uniqueDrivers = [...new Set(dieselRecords.map(r => r.driverName))].sort();
  const uniqueFuelStations = [...new Set(dieselRecords.map(r => r.fuelStation))].sort();
  
  // Calculate summary statistics
  const totalLitres = sortedRecords.reduce((sum, r) => sum + r.litresFilled, 0);
  const totalCostZAR = sortedRecords
    .filter(r => r.currency !== 'USD')
    .reduce((sum, r) => sum + r.totalCost, 0);
  const totalCostUSD = sortedRecords
    .filter(r => r.currency === 'USD')
    .reduce((sum, r) => sum + r.totalCost, 0);
  
  const avgKmPerLitre = sortedRecords
    .filter(r => r.kmPerLitre && !r.isReeferUnit)
    .reduce((sum, r, _, arr) => sum + (r.kmPerLitre || 0) / arr.length, 0);
  
  const recordsNeedingProbeVerification = sortedRecords.filter(r => 
    !r.isReeferUnit && 
    !r.probeVerified && 
    ['22H', '23H', '24H', '26H', '28H', '31H', '30H'].includes(r.fleetNumber)
  );
  
  const recordsForDebrief = sortedRecords.map(r => {
    const norm = dieselNorms.find(n => n.fleetNumber === r.fleetNumber);
    const isReefer = r.isReeferUnit;

    const expectedKmPerLitre = (!isReefer && norm?.expectedKmPerLitre) ? norm.expectedKmPerLitre : 3.0;
    const expectedLitresPerHour = (isReefer && norm?.litresPerHour) ? norm.litresPerHour : 3.5;
    const tolerancePercentage = norm?.tolerancePercentage || (isReefer ? 15 : 10);
    const tolerance = tolerancePercentage / 100;

    let efficiencyMetric = 0;
    let expectedMetric = 0;
    let efficiencyVariance = 0;
    let performanceStatus: 'poor' | 'normal' | 'excellent' = 'normal';

    if (isReefer) {
      efficiencyMetric = r.litresPerHour || (r.hoursOperated && r.hoursOperated > 0 ? r.litresFilled / r.hoursOperated : 0);
      expectedMetric = expectedLitresPerHour;
      
      if (efficiencyMetric > 0) {
        efficiencyVariance = ((efficiencyMetric - expectedMetric) / expectedMetric) * 100;

        if (efficiencyMetric > expectedMetric * (1 + tolerance)) {
            performanceStatus = 'poor';
        } else if (efficiencyMetric < expectedMetric * (1 - tolerance)) {
            performanceStatus = 'excellent';
        } else {
            performanceStatus = 'normal';
        }
      }
    } else {
      efficiencyMetric = r.kmPerLitre || 0;
      expectedMetric = expectedKmPerLitre;

      if (efficiencyMetric > 0) {
        efficiencyVariance = ((efficiencyMetric - expectedMetric) / expectedMetric) * 100;
        
        if (efficiencyMetric < expectedMetric * (1 - tolerance)) {
          performanceStatus = 'poor';
        } else if (efficiencyMetric > expectedMetric * (1 + tolerance)) {
          performanceStatus = 'excellent';
        } else {
          performanceStatus = 'normal';
        }
      }
    }

    const requiresDebrief = performanceStatus === 'poor' && !r.debriefDate;

    return {
      ...r,
      expectedKmPerLitre: isReefer ? 0 : expectedKmPerLitre,
      expectedLitresPerHour: isReefer ? expectedLitresPerHour : undefined,
      efficiencyVariance: efficiencyVariance,
      performanceStatus: performanceStatus,
      requiresDebrief: requiresDebrief,
      toleranceRange: tolerancePercentage,
    };
  });
  
  const recordsNeedingDebrief = recordsForDebrief.filter(r => r.requiresDebrief);
  
  const recordsWithoutTripLinkage = sortedRecords.filter(r => 
    !r.isReeferUnit && !r.tripId
  );
  
  // Handle opening probe verification modal
  const handleOpenProbeModal = (recordId: string) => {
    setSelectedDieselId(recordId);
    setShowProbeModal(true);
  };
  
  // Handle opening trip linkage modal
  const handleOpenLinkageModal = (recordId: string) => {
    setSelectedDieselId(recordId);
    setShowLinkageModal(true);
  };

  // Handle updating diesel norms
  const handleUpdateNorms = (norms: any[]) => {
    setDieselNorms(norms);
    // In a real app, this would save to Firestore
    localStorage.setItem('dieselNorms', JSON.stringify(norms));
  };
  
  // Export diesel records
  const handleExportRecords = () => {
    setIsLoading(true);
    
    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "fleetNumber,date,kmReading,previousKmReading,litresFilled,costPerLitre,totalCost,fuelStation,driverName,notes,currency,kmPerLitre,distanceTravelled,tripId,isReeferUnit,hoursOperated,litresPerHour\n";
      
      sortedRecords.forEach(record => {
        const row = [
          record.fleetNumber,
          record.date,
          record.kmReading,
          record.previousKmReading || '',
          record.litresFilled,
          record.costPerLitre || (record.totalCost / record.litresFilled).toFixed(2),
          record.totalCost,
          record.fuelStation,
          record.driverName,
          (record.notes || '').replace(/,/g, ';'),
          record.currency || 'ZAR',
          record.kmPerLitre || '',
          record.distanceTravelled || '',
          record.tripId || '',
          record.isReeferUnit ? 'true' : 'false',
          record.hoursOperated || '',
          record.litresPerHour || ''
        ];
        
        csvContent += row.join(',') + '\n';
      });
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `diesel_records_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting diesel records:', error);
      alert('Error exporting diesel records. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete diesel record
  const handleDeleteDieselRecord = async (id: string) => {
    if (confirm('Are you sure you want to delete this diesel record? This action cannot be undone.')) {
      try {
        setIsDeleting(id);
        await deleteDieselRecord(id);
        alert('Diesel record deleted successfully');
      } catch (error) {
        console.error('Error deleting diesel record:', error);
        alert('Error deleting diesel record. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilterFleet('');
    setFilterDriver('');
    setFilterDateRange({start: '', end: ''});
    setFilterFuelStation('');
    setFilterType('all');
  };
  
  // Get efficiency class based on km/l or l/hr
  const getEfficiencyClass = (record: DieselConsumptionRecord) => {
    if (record.isReeferUnit) {
      // For reefer units, check litres per hour
      const litresPerHour = record.litresPerHour || (record.hoursOperated ? record.litresFilled / record.hoursOperated : 0);
      const expectedLitresPerHour = 3.5; // Default value
      const tolerance = 0.15; // 15% tolerance
      
      if (litresPerHour === 0) return 'text-gray-600';
      if (litresPerHour < expectedLitresPerHour * (1 - tolerance)) return 'text-red-600';
      if (litresPerHour > expectedLitresPerHour * (1 + tolerance)) return 'text-red-600';
      return 'text-green-600';
    } else {
      // For regular units, check km per litre
      const kmPerLitre = record.kmPerLitre || 0;
      const expectedKmPerLitre = 3.0; // Default value
      const tolerance = 0.10; // 10% tolerance
      
      if (kmPerLitre === 0) return 'text-gray-600';
      if (kmPerLitre < expectedKmPerLitre * (1 - tolerance)) return 'text-red-600';
      if (kmPerLitre > expectedKmPerLitre * (1 + tolerance)) return 'text-green-600';
      return 'text-green-600';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Diesel Dashboard</h2>
          <div className="flex items-center mt-1">
            <p className="text-gray-600 mr-3">Track and analyze diesel consumption across your fleet</p>
            <SyncIndicator />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={onClick}
            icon={<Settings className="w-4 h-4" />}
          >
            Configure Norms
          </Button>
          <Button
            variant="outline"
            onClick={onClick}
            icon={<Upload className="w-4 h-4" />}
          >
            Import
          </Button>
          <Button
            onClick={onClick}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Diesel Entry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{sortedRecords.length}</p>
                <p className="text-xs text-gray-400">
                  {sortedRecords.filter(r => !r.isReeferUnit).length} horse • 
                  {sortedRecords.filter(r => r.isReeferUnit).length} reefer
                </p>
              </div>
              <Fuel className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Litres</p>
                <p className="text-2xl font-bold text-blue-600">{totalLitres.toLocaleString()}</p>
                <p className="text-xs text-gray-400">
                  {avgKmPerLitre.toFixed(2)} km/l average
                </p>
              </div>
              <Fuel className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Cost (ZAR)</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalCostZAR, 'ZAR')}
                </p>
                <p className="text-xs text-gray-400">
                  {sortedRecords.filter(r => r.currency !== 'USD').length} records
                </p>
              </div>
              <Fuel className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        {totalCostUSD > 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Cost (USD)</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalCostUSD, 'USD')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {sortedRecords.filter(r => r.currency === 'USD').length} records
                  </p>
                </div>
                <Fuel className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recordsNeedingProbeVerification.length > 0 && (
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">Probe Verification Required</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    {recordsNeedingProbeVerification.length} record{recordsNeedingProbeVerification.length !== 1 ? 's' : ''} need probe verification
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      if (recordsNeedingProbeVerification.length > 0) {
                        handleOpenProbeModal(recordsNeedingProbeVerification[0].id);
                      }
                    }}
                  >
                    Verify Next Record
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {recordsNeedingDebrief.length > 0 && (
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Efficiency Debrief Required</h4>
                  <p className="text-sm text-red-700 mt-1">
                    {recordsNeedingDebrief.length} record{recordsNeedingDebrief.length !== 1 ? 's' : ''} need driver debrief
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={onClick}
                  >
                    Start Debrief Process
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {recordsWithoutTripLinkage.length > 0 && (
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Link className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">Trip Linkage Required</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {recordsWithoutTripLinkage.length} record{recordsWithoutTripLinkage.length !== 1 ? 's' : ''} need to be linked to trips
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      if (recordsWithoutTripLinkage.length > 0) {
                        handleOpenLinkageModal(recordsWithoutTripLinkage[0].id);
                      }
                    }}
                  >
                    Link Next Record
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader 
          title="Filter Diesel Records" 
          action={
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onClick}
              >
                Clear Filters
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onClick}
                icon={<Download className="w-4 h-4" />}
                isLoading={isLoading}
              >
                Export
              </Button>
            </div>
          }
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fleet
              </label>
              <FleetSelector 
                value={filterFleet}
                onChange={(value) => setFilterFleet(value)}
                placeholder="All Fleets"
                className="w-full"
              />
            </div>
            
            <Select
              label="Driver"
              value={filterDriver}
              onChange={(e) => setFilterDriver(e.target.value)}
              options={[
                { label: 'All Drivers', value: '' },
                ...uniqueDrivers.map(d => ({ label: d, value: d }))
              ]}
            />
            
            <Select
              label="Fuel Station"
              value={filterFuelStation}
              onChange={(e) => setFilterFuelStation(e.target.value)}
              options={[
                { label: 'All Stations', value: '' },
                ...uniqueFuelStations.map(s => ({ label: s, value: s }))
              ]}
            />
            
            <Select
              label="Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { label: 'All Types', value: 'all' },
                { label: 'Horse Only', value: 'horse' },
                { label: 'Reefer Only', value: 'reefer' }
              ]}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                value={filterDateRange.start}
                onChange={(e) => setFilterDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                value={filterDateRange.end}
                onChange={(e) => setFilterDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diesel Records */}
      <Card>
        <CardHeader 
          title={`Diesel Records (${sortedRecords.length})`}
          action={
            <Button
              size="sm"
              onClick={onClick}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Record
            </Button>
          }
        />
        <CardContent>
          {sortedRecords.length === 0 ? (
            <div className="text-center py-8">
              <Fuel className="mx-auto h-10 w-10 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No diesel records found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filterFleet || filterDriver || filterFuelStation || filterDateRange.start || filterDateRange.end || filterType !== 'all'
                  ? 'No records match your current filter criteria.'
                  : 'Start by adding your first diesel record.'}
              </p>
              {!filterFleet && !filterDriver && !filterFuelStation && !filterDateRange.start && !filterDateRange.end && filterType === 'all' && (
                <div className="mt-4">
                  <Button
                    onClick={onClick}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Add First Diesel Record
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fleet
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Litres
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Efficiency
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedRecords.map((record) => {
                    // Calculate efficiency metric (km/l or l/hr)
                    const efficiencyMetric = record.isReeferUnit
                      ? record.litresPerHour || (record.hoursOperated ? record.litresFilled / record.hoursOperated : 0)
                      : record.kmPerLitre || 0;
                    
                    // Determine if linked to trip
                    const linkedTrip = record.tripId ? trips.find(t => t.id === record.tripId) : undefined;
                    
                    return (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {record.fleetNumber}
                              {record.isReeferUnit && <span className="ml-1 text-xs text-purple-600">(Reefer)</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(record.date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{record.driverName}</div>
                          <div className="text-xs text-gray-500">{record.fuelStation}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm text-gray-900">{record.litresFilled.toFixed(1)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(record.totalCost, record.currency || 'ZAR')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(record.costPerLitre || (record.totalCost / record.litresFilled), record.currency || 'ZAR')}/L
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className={`text-sm font-medium ${getEfficiencyClass(record)}`}>
                            {record.isReeferUnit
                              ? `${efficiencyMetric.toFixed(2)} L/hr`
                              : `${efficiencyMetric.toFixed(2)} km/L`
                            }
                          </div>
                          {!record.isReeferUnit && record.distanceTravelled && (
                            <div className="text-xs text-gray-500">
                              {record.distanceTravelled.toLocaleString()} km
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center space-y-1">
                            {record.probeVerified && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Probe Verified
                              </span>
                            )}
                            
                            {record.tripId && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                <Link className="w-3 h-3 mr-1" />
                                {linkedTrip ? `Linked to ${linkedTrip.fleetNumber}` : 'Linked'}
                              </span>
                            )}
                            
                            {record.debriefDate && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                <FileText className="w-3 h-3 mr-1" />
                                Debriefed
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {!record.isReeferUnit && !record.probeVerified && 
                             ['22H', '23H', '24H', '26H', '28H', '31H', '30H'].includes(record.fleetNumber) && (
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={onClick}
                              >
                                Verify
                              </Button>
                            )}
                            
                            {!record.isReeferUnit && !record.tripId && (
                              <Button
                                size="xs"
                                variant="outline"
                                onClick={onClick}
                              >
                                Link
                              </Button>
                            )}
                            
                            <Button
                              size="xs"
                              variant="danger"
                              icon={<Trash2 className="w-3 h-3" />}
                              onClick={onClick}
                              isLoading={isDeleting === record.id}
                              disabled={isDeleting !== null}
                            >
                              Delete
                            </Button>
                            
                            <Button
                              size="xs"
                              variant="outline"
                              icon={<Search className="w-3 h-3" />}
                            >
                              View
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ManualDieselEntryModal
        isOpen={showManualEntryModal}
        onClose={() => setShowManualEntryModal(false)}
        dieselRecords={dieselRecords}
      />
      
      <DieselImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        dieselRecords={dieselRecords}
      />
      
      <DieselNormsModal
        isOpen={showNormsModal}
        onClose={() => setShowNormsModal(false)}
        norms={dieselNorms}
        onUpdateNorms={handleUpdateNorms}
      />
      
      <EnhancedDieselDebriefModal
        isOpen={showDebriefModal}
        onClose={() => setShowDebriefModal(false)}
        records={recordsNeedingDebrief}
        norms={dieselNorms}
      />
      
      {showProbeModal && (
        <EnhancedProbeVerificationModal
          isOpen={showProbeModal}
          onClose={() => setShowProbeModal(false)}
          dieselRecordId={selectedDieselId}
        />
      )}
      
      {showLinkageModal && (
        <TripLinkageModal
          isOpen={showLinkageModal}
          onClose={() => setShowLinkageModal(false)}
          dieselRecordId={selectedDieselId}
        />
      )}

      {showEditModal && (
        <DieselEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          dieselRecordId={selectedDieselId}
        />
      )}
    </div>
  );
};

export default DieselDashboard;