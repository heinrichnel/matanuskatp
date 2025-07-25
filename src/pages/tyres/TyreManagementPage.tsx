import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Archive, 
  CircleDashed, 
  FileSearch, 
  Truck, 
  TrendingUp, 
  Plus, 
  Search, 
  RotateCw,
  Download,
  AlertCircle,
  BarChart3,
  Layout,
  Gauge,
  ClipboardList
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import TyreFormModal from '../../components/Models/Tyre/TyreFormModal';
import { collection, query, getDocs, orderBy, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Tyre } from '../../components/Models/Tyre/TyreModel';

// Import tyre components that need to be integrated
import TyreDashboard from '../../components/Tyremanagement/TyreDashboard';
import TyreAnalytics from '../../components/Tyremanagement/TyreAnalytics';
import { TyreInventory } from '../../components/Tyremanagement/TyreInventory';
import { TyreInventoryStats } from '../../components/Tyremanagement/TyreInventoryStats';
import { TyreReports } from '../../components/Tyremanagement/TyreReports';

// Using Tyre type from TyreModel

// Define tabs for navigation
type TabType = 'inventory' | 'dashboard' | 'analytics' | 'reports';

// Adapter function to convert between different tyre formats if needed
// This allows us to use the same data across all components regardless of what format they expect
// Adapter functions to handle compatibility between different component data formats
const adaptTyreFormatIfNeeded = (tyres: Tyre[], targetComponent: string) => {
  // For some legacy components that might expect a different format
  switch (targetComponent) {
    case 'TyreDashboard':
      // TyreDashboard expects a format from workshop-tyre-inventory
      return tyres.map(tyre => ({
        ...tyre,
        // Map any missing properties needed by TyreDashboard
        installDetails: tyre.installation ? {
          date: tyre.installation.installationDate,
          position: tyre.installation.position,
          mileage: tyre.installation.mileageAtInstallation,
          vehicle: tyre.installation.vehicleId
        } : undefined,
        // Add any other fields needed by the dashboard
        condition: {
          ...tyre.condition,
          // Ensure these fields exist for compatibility
          currentDepth: tyre.condition?.treadDepth || 0,
          wearStatus: tyre.condition?.status || 'unknown'
        },
        // Always ensure these properties exist
        type: tyre.type || { code: 'unknown', name: 'Unknown' },
        size: tyre.size || { width: 0, profile: 0, rimSize: 0, displayString: 'Unknown' },
      }));
      
    case 'TyreAnalytics':
      // TyreAnalytics expects types from the tyre.ts file
      return tyres;
      
    case 'TyreInventory':
      // TyreInventory works with the standard Tyre format
      return tyres;
      
    default:
      return tyres;
  }
};

const TyreManagementPage: React.FC = () => {
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTyre, setEditTyre] = useState<Tyre | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('inventory');
  
  // Function to fetch tyres from Firestore
  const fetchTyres = async () => {
    try {
      setLoading(true);
      
      // Create a query against the 'tyres' collection
      const q = query(
        collection(db, 'tyres'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tyreList: Tyre[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Tyre, 'id'>;
        tyreList.push({
          id: doc.id,
          ...data
        } as Tyre);
      });
      
      setTyres(tyreList);
      setError(null);
    } catch (err) {
      console.error('Error fetching tyre data:', err);
      setError('Failed to load tyre inventory data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load tyres on component mount
  useEffect(() => {
    fetchTyres();
  }, []);
  
  // Filter tyres based on search query and status filter
  const filteredTyres = tyres.filter(tyre => {
    // Create a searchable string from relevant tyre properties
    const searchableText = [
      tyre.serialNumber,
      tyre.brand,
      tyre.model,
      tyre.pattern,
      tyre.size?.displayString,
      tyre.status,
      tyre.notes
    ].filter(Boolean).join(' ').toLowerCase();
    
    const matchesSearch = !searchQuery || searchableText.includes(searchQuery.toLowerCase());
    const matchesFilter = !filterStatus || tyre.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });
  
  // Handle adding a new tyre
  const handleAddTyre = async (data: Omit<Tyre, 'id'>) => {
    try {
      console.log('Adding new tyre:', data);
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'tyres'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      
      // Add the new tyre to the local state with the Firestore ID
      setTyres(prevTyres => [
        {
          id: docRef.id,
          ...data
        } as Tyre,
        ...prevTyres
      ]);
      
      // Close the form
      setShowAddForm(false);
      
      // Show a success toast/notification
      alert('Tyre added successfully!');
    } catch (err) {
      console.error('Error adding tyre:', err);
      alert('Failed to add tyre. Please try again.');
    }
  };
  
  // Handle updating an existing tyre
  const handleUpdateTyre = async (data: Tyre) => {
    try {
      if (!data.id) throw new Error("Tyre ID is required for updates");
      
      // Reference to the tyre document
      const tyreRef = doc(db, 'tyres', data.id);
      
      // Remove id from the data to be updated
      const { id, ...updateData } = data;
      
      // Update the document
      await updateDoc(tyreRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
      
      // Update the tyre in the local state
      setTyres(prevTyres => 
        prevTyres.map(tyre => 
          tyre.id === data.id ? data : tyre
        )
      );
      
      // Reset edit state
      setEditTyre(null);
      
      // Show success message
      alert('Tyre updated successfully!');
    } catch (err) {
      console.error('Error updating tyre:', err);
      alert('Failed to update tyre. Please try again.');
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_service': return 'text-green-600 bg-green-50';
      case 'new': return 'text-blue-600 bg-blue-50';
      case 'spare': return 'text-blue-600 bg-blue-50';
      case 'retreaded': return 'text-amber-600 bg-amber-50';
      case 'scrapped': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tyre Management</h1>
          <p className="text-gray-500">Manage your vehicle tyres and track their lifecycle</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            icon={<RotateCw className="w-4 h-4" />}
            onClick={() => {
              setLoading(true);
              setError(null);
              // Re-fetch data
              fetchTyres();
            }}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
          <Button
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowAddForm(true)}
          >
            Add New Tyre
          </Button>
          <Link to="/tyres/reference-data">
            <Button
              variant="outline"
            >
              Reference Data
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'inventory'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Layout className="mr-2 h-5 w-5" />
            Inventory
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Gauge className="mr-2 h-5 w-5" />
            Analytics
          </button>
          
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ClipboardList className="mr-2 h-5 w-5" />
            Reports
          </button>
        </nav>
      </div>
      
      {/* Loading and Error States */}
      {loading && (
        <div className="bg-white p-8 rounded-lg shadow flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
          <span className="ml-3 text-gray-700">Loading tyre inventory...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 p-4 rounded-lg shadow border border-red-200">
          <p className="text-red-700 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </p>
        </div>
      )}

      {/* Tab Content - Render different components based on active tab */}
      {!loading && !error && (
        <>
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg mr-4">
                        <Archive className="text-blue-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Tyres</p>
                        <p className="text-xl font-bold text-gray-900">{tyres.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
    
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg mr-4">
                        <Truck className="text-green-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">In Service</p>
                        <p className="text-xl font-bold text-gray-900">
                          {tyres.filter(t => t.status === 'in_service').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
    
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-amber-100 rounded-lg mr-4">
                        <CircleDashed className="text-amber-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Available (New/Spare)</p>
                        <p className="text-xl font-bold text-gray-900">
                          {tyres.filter(t => ['new', 'spare'].includes(t.status)).length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
    
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-red-100 rounded-lg mr-4">
                        <AlertCircle className="text-red-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Retreaded/Scrapped</p>
                        <p className="text-xl font-bold text-gray-900">
                          {tyres.filter(t => ['retreaded', 'scrapped'].includes(t.status)).length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Render the TyreDashboard component */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Tyre Dashboard</h2>
                </CardHeader>
                <CardContent>
                  {tyres.length > 0 ? (
                    <TyreDashboard 
                      tyres={adaptTyreFormatIfNeeded(tyres, 'TyreDashboard')}
                    />
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">No tyre data available for the dashboard.</p>
                      <p className="mt-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowAddForm(true)}
                          icon={<Plus className="w-4 h-4 mr-1" />}
                        >
                          Add Tyres
                        </Button>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              {/* Inventory Stats from TyreInventoryStats */}
              <TyreInventoryStats tyres={tyres} />
              
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tyres by ID, size, manufacturer..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant={filterStatus === null ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus(null)}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filterStatus === 'in_service' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('in_service')}
                  >
                    In Service
                  </Button>
                  <Button 
                    variant={filterStatus === 'new' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('new')}
                  >
                    New
                  </Button>
                  <Button 
                    variant={filterStatus === 'spare' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('spare')}
                  >
                    Spare
                  </Button>
                  <Button 
                    variant={filterStatus === 'retreaded' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('retreaded')}
                  >
                    Retreaded
                  </Button>
                  <Button 
                    variant={filterStatus === 'scrapped' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterStatus('scrapped')}
                  >
                    Scrapped
                  </Button>
                </div>
              </div>

              {/* Tyres Table */}
              <Card>
                <CardHeader title="Tyre Inventory" />
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tyre Number</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pattern</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTyres.map((tyre) => (
                          <tr key={tyre.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tyre.serialNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tyre.size?.displayString || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tyre.brand}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tyre.pattern}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tyre.status)}`}>
                                {tyre.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {tyre.installation?.vehicleId || '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {tyre.installation?.position?.name || '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Edit Tyre"
                                  onClick={() => setEditTyre(tyre)}
                                >
                                  <FileSearch className="w-4 h-4" />
                                </button>
                                <Link 
                                  to={`/tyres/${tyre.id}/history`}
                                  className="text-green-600 hover:text-green-900"
                                  title="View History"
                                >
                                  <TrendingUp className="w-4 h-4" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                        
                        {filteredTyres.length === 0 && (
                          <tr>
                            <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                              No tyres found matching your search criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Wrap components with error boundaries or try-catch as needed */}
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Tyre Analytics</h2>
                </CardHeader>
                <CardContent>
                  {tyres.length > 0 ? (
                    <TyreAnalytics />
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">No tyre data available for analytics.</p>
                      <p className="mt-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowAddForm(true)}
                          icon={<Plus className="w-4 h-4 mr-1" />}
                        >
                          Add Tyres
                        </Button>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Tyre Reports</h2>
                </CardHeader>
                <CardContent>
                  {tyres.length > 0 ? (
                    <TyreReports />
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-gray-500">No tyre data available for reporting.</p>
                      <p className="mt-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowAddForm(true)}
                          icon={<Plus className="w-4 h-4 mr-1" />}
                        >
                          Add Tyres
                        </Button>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Add Tyre Modal */}
      {showAddForm && (
        <TyreFormModal
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddTyre}
          mode="add"
          defaultValues={{
            serialNumber: 'TY-' + Math.floor(1000 + Math.random() * 9000),
            dotCode: '',
            manufacturingDate: new Date().toISOString().split('T')[0],
            brand: '',
            model: '',
            pattern: '',
            size: { width: 0, profile: 0, rimSize: 0, displayString: '' },
            loadIndex: 0,
            speedRating: '',
            type: { code: '', name: '' },
            purchaseDetails: {
              date: new Date().toISOString().split('T')[0],
              cost: 0,
              supplier: '',
              warranty: '',
            },
            condition: {
              treadDepth: 0,
              pressure: 0,
              temperature: 0,
              status: 'good',
              lastInspectionDate: new Date().toISOString().split('T')[0],
              nextInspectionDue: new Date().toISOString().split('T')[0],
            },
            status: 'new',
            mountStatus: 'unmounted',
            maintenanceHistory: {
              rotations: [],
              repairs: [],
              inspections: [],
            },
            milesRun: 0,
            kmRunLimit: 0,
            notes: '',
            location: { code: '', name: '' },
          }}
        />
      )}

      {/* Edit Tyre Modal */}
      {editTyre && (
        <TyreFormModal
          isOpen={!!editTyre}
          onClose={() => setEditTyre(null)}
          onSubmit={handleUpdateTyre}
          mode="edit"
          defaultValues={editTyre}
        />
      )}
    </div>
  );
};

export default TyreManagementPage;
