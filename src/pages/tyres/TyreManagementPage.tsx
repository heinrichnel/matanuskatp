import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import AddNewTyreForm from '../../components/forms/AddTyreForm';

// Mock tyre data
const mockTyres = [
  { id: 'TY-4321', size: '295/80R22.5', manufacturer: 'Michelin', pattern: 'X Multi D', status: 'In-Service', vehicle: 'TRK-7890', position: 'Front Right' },
  { id: 'TY-4322', size: '295/80R22.5', manufacturer: 'Michelin', pattern: 'X Multi D', status: 'In-Service', vehicle: 'TRK-7890', position: 'Front Left' },
  { id: 'TY-4323', size: '295/80R22.5', manufacturer: 'Bridgestone', pattern: 'R297', status: 'In-Stock', vehicle: '', position: '' },
  { id: 'TY-4324', size: '295/80R22.5', manufacturer: 'Goodyear', pattern: 'Marathon LHS', status: 'Repair', vehicle: 'TRK-5432', position: 'Rear Right Inner' },
  { id: 'TY-4325', size: '315/70R22.5', manufacturer: 'Continental', pattern: 'HDR2+', status: 'In-Service', vehicle: 'TRK-3344', position: 'Rear Left Outer' },
  { id: 'TY-4326', size: '315/70R22.5', manufacturer: 'Continental', pattern: 'HDR2+', status: 'Scrap', vehicle: '', position: '' },
  { id: 'TY-4327', size: '315/80R22.5', manufacturer: 'Dunlop', pattern: 'SP246', status: 'In-Stock', vehicle: '', position: '' },
];

const TyreManagementPage: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // Filter tyres based on search query and status filter
  const filteredTyres = mockTyres.filter(tyre => {
    const matchesSearch = !searchQuery || 
      Object.values(tyre).some(value => 
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesFilter = !filterStatus || tyre.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });
  
  const handleAddTyre = (data: any) => {
    console.log('Adding new tyre:', data);
    // In a real app, this would save to Firestore
    // After successful addition, close the form
    setShowAddForm(false);
    // Show a success toast/notification here
    alert('Tyre added successfully!');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In-Service': return 'text-green-600 bg-green-50';
      case 'In-Stock': return 'text-blue-600 bg-blue-50';
      case 'Repair': return 'text-amber-600 bg-amber-50';
      case 'Scrap': return 'text-red-600 bg-red-50';
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
        </div>
      </div>

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
                <p className="text-xl font-bold text-gray-900">{mockTyres.length}</p>
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
                  {mockTyres.filter(t => t.status === 'In-Service').length}
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
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-xl font-bold text-gray-900">
                  {mockTyres.filter(t => t.status === 'In-Stock').length}
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
                <p className="text-sm text-gray-600">For Repair/Scrap</p>
                <p className="text-xl font-bold text-gray-900">
                  {mockTyres.filter(t => ['Repair', 'Scrap'].includes(t.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
            variant={filterStatus === 'In-Service' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterStatus('In-Service')}
          >
            In Service
          </Button>
          <Button 
            variant={filterStatus === 'In-Stock' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterStatus('In-Stock')}
          >
            In Stock
          </Button>
          <Button 
            variant={filterStatus === 'Repair' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilterStatus('Repair')}
          >
            Repair
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tyre ID</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tyre.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tyre.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tyre.manufacturer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tyre.pattern}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tyre.status)}`}>
                        {tyre.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tyre.vehicle || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tyre.position || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
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

      {/* Add Tyre Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Add New Tyre"
        maxWidth="3xl"
      >
        <AddNewTyreForm
          onSubmit={handleAddTyre}
          onCancel={() => setShowAddForm(false)}
          initialData={{
            tyreNumber: 'TY-' + Math.floor(1000 + Math.random() * 9000),
            condition: 'New',
            status: 'In-Stock',
            mountStatus: 'Not Mounted',
            tyreSize: '',
            type: '',
            pattern: '',
            manufacturer: '',
            year: new Date().getFullYear().toString(),
            cost: 0,
            vehicleAssigned: '',
            axlePosition: ''
          }}
        />
      </Modal>
    </div>
  );
};

export default TyreManagementPage;
