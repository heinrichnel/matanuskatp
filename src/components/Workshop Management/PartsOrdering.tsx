import React, { useState } from 'react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Input, Select } from '../ui/FormElements';
import { 
  ShoppingBag, 
  Plus, 
  Edit, 
  Trash2, 
  CheckSquare, 
  Download,
  Clock,
  Truck,
  PackageCheck,
  ListFilter,
  Search
} from 'lucide-react';

interface PartOrderItem {
  id: string;
  partNumber: string;
  partName: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requestedBy: string;
  requestedDate: string;
  expectedDelivery?: string;
  jobCardId?: string;
  notes?: string;
}

const PartsOrdering: React.FC = () => {
  const [orderItems, setOrderItems] = useState<PartOrderItem[]>([
    {
      id: 'po1',
      partNumber: 'FLT-123456',
      partName: 'Air Filter Element',
      quantity: 5,
      unitPrice: 450,
      supplier: 'Field Tyre Services',
      status: 'ordered',
      priority: 'medium',
      requestedBy: 'John Smith',
      requestedDate: '2025-07-01',
      expectedDelivery: '2025-07-15',
      jobCardId: 'JC-2025-0042'
    },
    {
      id: 'po2',
      partNumber: 'OIL-987654',
      partName: 'Engine Oil Filter',
      quantity: 10,
      unitPrice: 120,
      supplier: 'Matanuska',
      status: 'pending',
      priority: 'high',
      requestedBy: 'Maria Rodriguez',
      requestedDate: '2025-07-05'
    },
    {
      id: 'po3',
      partNumber: 'BRK-567890',
      partName: 'Brake Pads (Front)',
      quantity: 2,
      unitPrice: 980,
      supplier: 'Spare Parts Exchange',
      status: 'approved',
      priority: 'critical',
      requestedBy: 'David Johnson',
      requestedDate: '2025-07-03',
      expectedDelivery: '2025-07-10',
      jobCardId: 'JC-2025-0045'
    }
  ]);
  
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterPriority, setFilterPriority] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<Partial<PartOrderItem>>({
    partNumber: '',
    partName: '',
    quantity: 1,
    unitPrice: 0,
    supplier: '',
    status: 'draft',
    priority: 'medium',
    requestedBy: 'Current User',
    requestedDate: new Date().toISOString().split('T')[0]
  });
  
  // Filter order items
  const filteredItems = orderItems.filter(item => {
    if (filterStatus && item.status !== filterStatus) return false;
    if (filterPriority && item.priority !== filterPriority) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return item.partNumber.toLowerCase().includes(term) ||
             item.partName.toLowerCase().includes(term) ||
             item.supplier.toLowerCase().includes(term);
    }
    return true;
  });
  
  // Handle form submission
  const handleAddItem = () => {
    if (!newItem.partNumber || !newItem.partName || !newItem.supplier) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newOrderItem: PartOrderItem = {
      id: `po${Date.now()}`,
      partNumber: newItem.partNumber || '',
      partName: newItem.partName || '',
      quantity: newItem.quantity || 1,
      unitPrice: newItem.unitPrice || 0,
      supplier: newItem.supplier || '',
      status: newItem.status as 'draft' || 'draft',
      priority: newItem.priority as 'medium' || 'medium',
      requestedBy: newItem.requestedBy || 'Current User',
      requestedDate: newItem.requestedDate || new Date().toISOString().split('T')[0],
      expectedDelivery: newItem.expectedDelivery,
      jobCardId: newItem.jobCardId,
      notes: newItem.notes
    };
    
    setOrderItems([...orderItems, newOrderItem]);
    setShowAddForm(false);
    setNewItem({
      partNumber: '',
      partName: '',
      quantity: 1,
      unitPrice: 0,
      supplier: '',
      status: 'draft',
      priority: 'medium',
      requestedBy: 'Current User',
      requestedDate: new Date().toISOString().split('T')[0]
    });
    
    // In a real implementation, this would save to Firestore
    alert('In a production environment, this would save the order item to Firestore.');
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'ordered': return 'bg-purple-100 text-purple-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get priority badge class
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Calculate total cost
  const getTotalCost = () => {
    return filteredItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };
  
  // Suppliers for dropdown
  const suppliers = [
    'Field Tyre Services',
    'Matanuska',
    'Spare Parts Exchange',
    'Horse Tech Engineering',
    'Victor Onions',
    'Braford Investments',
    'BSI Motor Spares',
    'Ace Hardware Zimbabwe'
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingBag className="w-7 h-7 mr-2 text-blue-500" />
            Parts Ordering
          </h2>
          <p className="text-gray-600">Manage parts ordering, suppliers, and purchase orders</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
          >
            Export PO List
          </Button>
          <Button
            onClick={() => setShowAddForm(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Part Order
          </Button>
        </div>
      </div>
      
      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-3 flex flex-col items-center">
            <p className="text-sm text-gray-500">Draft</p>
            <p className="text-2xl font-bold text-gray-900">{orderItems.filter(item => item.status === 'draft').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex flex-col items-center">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{orderItems.filter(item => item.status === 'pending').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex flex-col items-center">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-blue-600">{orderItems.filter(item => item.status === 'approved').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex flex-col items-center">
            <p className="text-sm text-gray-500">Ordered</p>
            <p className="text-2xl font-bold text-purple-600">{orderItems.filter(item => item.status === 'ordered').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex flex-col items-center">
            <p className="text-sm text-gray-500">Received</p>
            <p className="text-2xl font-bold text-green-600">{orderItems.filter(item => item.status === 'received').length}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader title="Filter Parts Orders" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search parts..."
                className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'Draft', value: 'draft' },
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Ordered', value: 'ordered' },
                { label: 'Received', value: 'received' },
                { label: 'Cancelled', value: 'cancelled' }
              ]}
            />
            
            <Select
              label="Priority"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              options={[
                { label: 'All Priorities', value: '' },
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
                { label: 'Critical', value: 'critical' }
              ]}
            />
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button
              size="sm"
              variant="outline"
              icon={<ListFilter className="w-4 h-4" />}
              onClick={() => {
                setFilterStatus('');
                setFilterPriority('');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Part Order Form */}
      {showAddForm && (
        <Card>
          <CardHeader title="Add New Part Order" />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Part Number *"
                value={newItem.partNumber || ''}
                onChange={(e) => setNewItem({ ...newItem, partNumber: e.target.value })}
                placeholder="e.g. FLT-123456"
              />
              
              <Input
                label="Part Name *"
                value={newItem.partName || ''}
                onChange={(e) => setNewItem({ ...newItem, partName: e.target.value })}
                placeholder="e.g. Air Filter Element"
              />
              
              <Input
                label="Quantity *"
                type="number"
                min="1"
                value={newItem.quantity?.toString() || '1'}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
              />
              
              <Input
                label="Unit Price (ZAR) *"
                type="number"
                min="0"
                step="0.01"
                value={newItem.unitPrice?.toString() || '0'}
                onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) })}
              />
              
              <Select
                label="Supplier *"
                value={newItem.supplier || ''}
                onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                options={[
                  { label: 'Select supplier...', value: '' },
                  ...suppliers.map(s => ({ label: s, value: s }))
                ]}
              />
              
              <Select
                label="Priority *"
                value={newItem.priority || 'medium'}
                onChange={(value) => setNewItem({ ...newItem, priority: value as any })}
                options={[
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                  { label: 'Critical', value: 'critical' }
                ]}
              />
              
              <Input
                label="Job Card ID (Optional)"
                value={newItem.jobCardId || ''}
                onChange={(e) => setNewItem({ ...newItem, jobCardId: e.target.value })}
                placeholder="e.g. JC-2025-0042"
              />
              
              <Input
                label="Expected Delivery (Optional)"
                type="date"
                value={newItem.expectedDelivery || ''}
                onChange={(e) => setNewItem({ ...newItem, expectedDelivery: e.target.value })}
              />
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  value={newItem.notes || ''}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  placeholder="Any special instructions or notes about this order"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddItem}
                disabled={!newItem.partNumber || !newItem.partName || !newItem.supplier}
              >
                Add to Order
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Parts Order List */}
      <Card>
        <CardHeader 
          title={`Parts Orders (${filteredItems.length})`}
          action={
            <div className="text-sm text-gray-700">
              Total Value: <span className="font-medium">R{getTotalCost().toLocaleString()}</span>
            </div>
          }
        />
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No parts orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus || filterPriority ? 
                  'No parts orders match your current filter criteria.' :
                  'Get started by adding a new parts order.'
                }
              </p>
              {!searchTerm && !filterStatus && !filterPriority && (
                <div className="mt-6">
                  <Button
                    onClick={() => setShowAddForm(true)}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Add Part Order
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
                      Part Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.partName}</p>
                          <p className="text-xs text-gray-500">{item.partNumber}</p>
                          <p className="text-xs text-gray-500">{item.supplier}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        R{item.unitPrice.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        R{(item.quantity * item.unitPrice).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeClass(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getPriorityBadgeClass(item.priority)}`}>
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="xs"
                            variant="outline"
                            icon={<Edit className="w-3 h-3" />}
                            title="Edit"
                          >
                            Edit
                          </Button>
                          
                          {item.status === 'pending' && (
                            <Button
                              size="xs"
                              variant="outline"
                              icon={<CheckSquare className="w-3 h-3" />}
                              title="Approve"
                            >
                              Approve
                            </Button>
                          )}
                          
                          {item.status === 'approved' && (
                            <Button
                              size="xs"
                              variant="outline"
                              icon={<Truck className="w-3 h-3" />}
                              title="Order"
                            >
                              Order
                            </Button>
                          )}
                          
                          {item.status === 'ordered' && (
                            <Button
                              size="xs"
                              variant="outline"
                              icon={<PackageCheck className="w-3 h-3" />}
                              title="Receive"
                            >
                              Receive
                            </Button>
                          )}
                          
                          {['draft', 'pending'].includes(item.status) && (
                            <Button
                              size="xs"
                              variant="danger"
                              icon={<Trash2 className="w-3 h-3" />}
                              title="Delete"
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Lifecycle Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-blue-800 mb-4">Parts Ordering Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-blue-700 mb-2">Order Lifecycle</h3>
            <ol className="space-y-2 text-blue-700">
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-blue-200 text-blue-800 w-5 h-5 text-xs font-medium mr-2 mt-0.5">1</span>
                <span><strong>Draft:</strong> Initial order creation</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-blue-200 text-blue-800 w-5 h-5 text-xs font-medium mr-2 mt-0.5">2</span>
                <span><strong>Pending:</strong> Awaiting approval</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-blue-200 text-blue-800 w-5 h-5 text-xs font-medium mr-2 mt-0.5">3</span>
                <span><strong>Approved:</strong> Ready to order from supplier</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-blue-200 text-blue-800 w-5 h-5 text-xs font-medium mr-2 mt-0.5">4</span>
                <span><strong>Ordered:</strong> Purchase order sent to supplier</span>
              </li>
              <li className="flex items-start">
                <span className="flex items-center justify-center rounded-full bg-blue-200 text-blue-800 w-5 h-5 text-xs font-medium mr-2 mt-0.5">5</span>
                <span><strong>Received:</strong> Parts received in inventory</span>
              </li>
            </ol>
          </div>
          
          <div>
            <h3 className="font-medium text-blue-700 mb-2">Key Features</h3>
            <ul className="list-disc pl-5 space-y-1 text-blue-700">
              <li>Track parts from request to delivery</li>
              <li>Link orders to specific job cards</li>
              <li>Monitor order status and history</li>
              <li>Generate purchase orders for suppliers</li>
              <li>Set priorities for critical parts</li>
              <li>Automatic inventory updates upon receipt</li>
              <li>Supplier performance tracking</li>
            </ul>
          </div>
        </div>
        <p className="text-blue-700 mt-4">
          In a production environment, this module would interact with Firestore to store order data 
          and would be integrated with the inventory management system to automatically update stock levels.
        </p>
      </div>
    </div>
  );
};

export default PartsOrdering;