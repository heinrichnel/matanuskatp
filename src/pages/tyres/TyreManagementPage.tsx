import React, { useState, useEffect } from 'react';
import TyreDashboard from '../../components/TyreManagement/TyreDashboard';
import Button from '../../components/ui/Button';
import Card, { CardContent } from '../../components/ui/Card';
import { Download, BarChart, PieChart } from 'lucide-react';

// Define the TyreEntry interface to match our data structure
interface TyreEntry {
  tyreNumber: string;
  manufacturer: string;
  pattern: string;
  size: string;
  type: string;
  vehicleAssign: string;
  axlePosition: string;
  status: string;
  condition: string;
  milesRun: number;
  treadDepth: number;
  mountStatus: string;
  lastInspection: string;
  costPerKM: number;
  notes?: string;
}

// Mock data for initial rendering
const mockTyreData: TyreEntry[] = [
  {
    tyreNumber: 'TYR-001',
    manufacturer: 'Michelin',
    pattern: 'XZA2',
    size: '315/80R22.5',
    type: 'Steer',
    vehicleAssign: '28H',
    axlePosition: 'Front Left',
    status: 'NEW',
    condition: 'OK',
    milesRun: 12500,
    treadDepth: 12.5,
    mountStatus: 'On Vehicle',
    lastInspection: '2025-06-15',
    costPerKM: 0.024,
    notes: 'Standard steer tyre'
  },
  {
    tyreNumber: 'TYR-002',
    manufacturer: 'Michelin',
    pattern: 'XZA2',
    size: '315/80R22.5',
    type: 'Steer',
    vehicleAssign: '28H',
    axlePosition: 'Front Right',
    status: 'NEW',
    condition: 'OK',
    milesRun: 12500,
    treadDepth: 12.2,
    mountStatus: 'On Vehicle',
    lastInspection: '2025-06-15',
    costPerKM: 0.024,
    notes: 'Standard steer tyre'
  },
  {
    tyreNumber: 'TYR-003',
    manufacturer: 'Bridgestone',
    pattern: 'R150',
    size: '315/80R22.5',
    type: 'Drive',
    vehicleAssign: '28H',
    axlePosition: 'Rear Left',
    status: 'USED',
    condition: 'Attention',
    milesRun: 45000,
    treadDepth: 6.8,
    mountStatus: 'On Vehicle',
    lastInspection: '2025-06-15',
    costPerKM: 0.035,
    notes: 'Showing uneven wear pattern on outer edge'
  },
  {
    tyreNumber: 'TYR-004',
    manufacturer: 'Bridgestone',
    pattern: 'R150',
    size: '315/80R22.5',
    type: 'Drive',
    vehicleAssign: '28H',
    axlePosition: 'Rear Right',
    status: 'USED',
    condition: 'OK',
    milesRun: 45000,
    treadDepth: 7.2,
    mountStatus: 'On Vehicle',
    lastInspection: '2025-06-15',
    costPerKM: 0.035,
    notes: 'Normal wear pattern'
  },
  {
    tyreNumber: 'TYR-005',
    manufacturer: 'Goodyear',
    pattern: 'Marathon LHS',
    size: '11R22.5',
    type: 'Trailer',
    vehicleAssign: '3T',
    axlePosition: 'T1',
    status: 'RETREADED',
    condition: 'OK',
    milesRun: 35000,
    treadDepth: 8.5,
    mountStatus: 'On Vehicle',
    lastInspection: '2025-06-10',
    costPerKM: 0.028,
    notes: 'First retread performed on 2025-03-15'
  },
  {
    tyreNumber: 'TYR-006',
    manufacturer: 'Continental',
    pattern: 'HDL2',
    size: '11R22.5',
    type: 'Drive',
    vehicleAssign: '',
    axlePosition: '',
    status: 'NEW',
    condition: 'OK',
    milesRun: 0,
    treadDepth: 15.0,
    mountStatus: 'In Store',
    lastInspection: '2025-06-01',
    costPerKM: 0,
    notes: 'Spare tyre for emergency replacement'
  }
];

const TyreManagementPage: React.FC = () => {
  const [tyres, setTyres] = useState<TyreEntry[]>(mockTyreData);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'analytics'>('inventory');
  
  // Loading state is now used directly in the JSX

  useEffect(() => {
    // In a real implementation, we would fetch from Firestore
    const fetchTyres = async () => {
      try {
        setIsLoading(true);
        // Uncomment when Firestore collection is ready
        // const tyreCollection = collection(db, 'tyres');
        // const snapshot = await getDocs(tyreCollection);
        // const tyreData = snapshot.docs.map(doc => ({
        //   ...doc.data(),
        //   id: doc.id
        // })) as TyreEntry[];
        // setTyres(tyreData);

        // Using mock data for now
        setTimeout(() => {
          setTyres(mockTyreData);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching tyre data:", error);
        setIsLoading(false);
      }
    };

    fetchTyres();
  }, []);

  const handleEditTyre = (tyreNumber: string) => {
    console.log('Edit tyre:', tyreNumber);
    // Implement edit functionality - e.g. open a modal
  };

  const handleDeleteTyre = (tyreNumber: string) => {
    console.log('Delete tyre:', tyreNumber);
    if (confirm('Are you sure you want to delete this tyre?')) {
      setTyres(tyres.filter(t => t.tyreNumber !== tyreNumber));
      // In a real implementation, delete from Firestore
    }
  };

  const handleExport = () => {
    console.log('Export tyres to CSV/PDF');
    // Generate and download CSV
    const headers = [
      'Tyre Number', 'Manufacturer', 'Pattern', 'Size', 'Type',
      'Vehicle', 'Axle Position', 'Status', 'Condition',
      'Miles Run', 'Tread Depth', 'Mount Status', 'Last Inspection',
      'Cost/KM', 'Notes'
    ];
    
    const csvRows = [
      headers.join(','),
      ...tyres.map(t => [
        t.tyreNumber,
        t.manufacturer,
        t.pattern,
        t.size,
        t.type,
        t.vehicleAssign,
        t.axlePosition,
        t.status,
        t.condition,
        t.milesRun,
        t.treadDepth,
        t.mountStatus,
        t.lastInspection,
        t.costPerKM?.toFixed(3) || '0',
        t.notes ? `"${t.notes.replace(/"/g, '""')}"` : ''
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tyre_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddTyre = () => {
    console.log('Add new tyre');
    // Implement add functionality - e.g. open a modal
  };

  const handleImport = (file: File) => {
    console.log('Import from file:', file.name);
    // Implement CSV import
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (!event.target?.result) return;
        
        const csvText = event.target.result as string;
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        // Skip header row
        const newTyres: TyreEntry[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',');
          const tyre: any = {};
          
          // Map CSV columns to TyreEntry fields
          headers.forEach((header, index) => {
            let value = values[index]?.trim();
            
            // No pre-processing needed here as we handle types in the field assignment below
            
            // Map header to field name
            const fieldMapping: Record<string, keyof TyreEntry> = {
              'Tyre Number': 'tyreNumber',
              'Manufacturer': 'manufacturer',
              'Pattern': 'pattern',
              'Size': 'size',
              'Type': 'type',
              'Vehicle': 'vehicleAssign',
              'Axle Position': 'axlePosition',
              'Status': 'status',
              'Condition': 'condition',
              'Miles Run': 'milesRun',
              'Tread Depth': 'treadDepth',
              'Mount Status': 'mountStatus',
              'Last Inspection': 'lastInspection',
              'Cost/KM': 'costPerKM',
              'Notes': 'notes'
            };
            
            const field = fieldMapping[header];
            if (field) {
              // Handle specific field types
              if (header === 'Miles Run' || header === 'Tread Depth' || header === 'Cost/KM') {
                const numericValue = parseFloat(value) || 0;
                tyre[field] = numericValue;
              } else if (field === 'axlePosition') {
                // Ensure axlePosition is a string when assigning
                tyre[field] = String(value);
              } else {
                tyre[field] = value;
              }
            }
          });
          
          if (tyre.tyreNumber) {
            newTyres.push(tyre as TyreEntry);
          }
        }
        
        // Merge with existing tyres or replace them
        setTyres(prev => {
          // Create a map of existing tyres
          const existingMap = new Map(prev.map(t => [t.tyreNumber, t]));
          
          // Update or add new tyres
          newTyres.forEach(newTyre => {
            existingMap.set(newTyre.tyreNumber, {
              ...existingMap.get(newTyre.tyreNumber),
              ...newTyre
            });
          });
          
          return Array.from(existingMap.values());
        });
        
        alert(`Successfully imported ${newTyres.length} tyres.`);
      } catch (error) {
        console.error('Error importing CSV:', error);
        alert('Failed to import CSV. Please check the format and try again.');
      }
    };
    
    reader.readAsText(file);
  };

  const stats = {
    totalTyres: tyres.length,
    onVehicle: tyres.filter(t => t.mountStatus === 'On Vehicle').length,
    inStore: tyres.filter(t => t.mountStatus === 'In Store').length,
    needingAttention: tyres.filter(t => t.condition === 'Attention').length,
    averageTreadDepth: tyres.length > 0 ? 
      tyres.reduce((sum, t) => sum + t.treadDepth, 0) / tyres.length : 0,
    averageCostPerKM: tyres.filter(t => t.costPerKM && t.costPerKM > 0).length > 0 ?
      tyres.reduce((sum, t) => sum + (t.costPerKM || 0), 0) / 
      tyres.filter(t => t.costPerKM && t.costPerKM > 0).length : 0
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Tyre Management</h1>
          <p className="text-gray-600">Track, analyze and manage fleet tyres</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button
            variant={activeTab === 'inventory' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </Button>
          <Button
            variant={activeTab === 'analytics' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </Button>
          <Button variant="outline" size="sm" icon={<Download size={16} />} onClick={handleExport}>
            Export Data
          </Button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <div className="space-y-4">
          {/* Custom tyre dashboard implementation using our data */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-medium">Tyre Inventory</h2>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handleAddTyre}>Add Tyre</Button>
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm">Import CSV</Button>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".csv"
                    onChange={(e) => e.target.files?.[0] && handleImport(e.target.files[0])} 
                  />
                </label>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tyre Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tread Depth</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tyres.map(tyre => (
                    <tr key={tyre.tyreNumber}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tyre.tyreNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tyre.manufacturer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tyre.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tyre.vehicleAssign || 'None'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tyre.axlePosition || 'None'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tyre.condition === 'OK' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {tyre.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tyre.treadDepth.toFixed(1)} mm</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          onClick={() => handleEditTyre(tyre.tyreNumber)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteTyre(tyre.tyreNumber)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Tyre Status Overview</h3>
                <BarChart className="text-blue-500" size={20} />
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Tyres:</span>
                  <span className="font-bold">{stats.totalTyres}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">On Vehicles:</span>
                  <span className="font-bold">{stats.onVehicle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">In Store:</span>
                  <span className="font-bold">{stats.inStore}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Need Attention:</span>
                  <span className="font-bold text-yellow-600">{stats.needingAttention}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Performance Metrics</h3>
                <PieChart className="text-green-500" size={20} />
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Tread Depth:</span>
                  <span className="font-bold">{stats.averageTreadDepth.toFixed(1)} mm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Cost/KM:</span>
                  <span className="font-bold">${stats.averageCostPerKM.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Retreaded Tyres:</span>
                  <span className="font-bold">{tyres.filter(t => t.status === 'RETREADED').length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Quick Actions</h3>
              </div>
              <div className="mt-4 space-y-3">
                <Button variant="primary" fullWidth onClick={handleAddTyre}>
                  Add New Tyre
                </Button>
                <Button variant="secondary" fullWidth onClick={() => console.log('Run inspection')}>
                  Run Tyre Inspection
                </Button>
                <Button variant="outline" fullWidth onClick={() => console.log('Generate report')}>
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TyreManagementPage;
