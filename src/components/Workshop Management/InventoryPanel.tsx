import React, { useState } from 'react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Package, Search, Plus, Trash2, ArrowDown, AlertTriangle, CheckCircle, X } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
  location?: string;
  status: 'in_stock' | 'on_order' | 'backordered' | 'unavailable';
}

interface InventoryPanelProps {
  jobCardId: string;
  assignedParts: {
    id: string;
    itemId: string;
    quantity: number;
    assignedAt: string;
    assignedBy: string;
    notes?: string;
    status: 'assigned' | 'used' | 'returned';
  }[];
  onAssignPart: (partId: string, quantity: number) => void;
  onRemovePart: (assignmentId: string) => void;
  onUpdatePart: (assignmentId: string, updates: any) => void;
  readonly?: boolean;
}

// Mock inventory data
const mockInventory: InventoryItem[] = [
  {
    id: 'p1',
    name: 'Brake Pad Set',
    partNumber: 'BP-1234',
    quantity: 5,
    unitPrice: 120.50,
    location: 'Shelf A3',
    status: 'in_stock'
  },
  {
    id: 'p2',
    name: 'Oil Filter',
    partNumber: 'OF-5678',
    quantity: 12,
    unitPrice: 35.75,
    location: 'Shelf B1',
    status: 'in_stock'
  },
  {
    id: 'p3',
    name: 'Alternator',
    partNumber: 'ALT-9012',
    quantity: 2,
    unitPrice: 450.00,
    location: 'Shelf C4',
    status: 'in_stock'
  },
  {
    id: 'p4',
    name: 'Water Pump',
    partNumber: 'WP-3456',
    quantity: 0,
    unitPrice: 325.25,
    status: 'on_order'
  },
  {
    id: 'p5',
    name: 'Radiator',
    partNumber: 'RAD-7890',
    quantity: 1,
    unitPrice: 580.00,
    location: 'Shelf D2',
    status: 'in_stock'
  }
];

const InventoryPanel: React.FC<InventoryPanelProps> = ({
  jobCardId,
  assignedParts,
  onAssignPart,
  onRemovePart,
  onUpdatePart,
  readonly = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState<InventoryItem | null>(null);
  const [assignQuantity, setAssignQuantity] = useState(1);
  
  const filteredInventory = mockInventory.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return item.name.toLowerCase().includes(term) ||
      item.partNumber.toLowerCase().includes(term);
  });
  
  const openAssignModal = (part: InventoryItem) => {
    setSelectedPart(part);
    setAssignQuantity(1);
    setShowAssignModal(true);
  };
  
  const handleAssignPart = () => {
    if (!selectedPart) return;
    
    onAssignPart(selectedPart.id, assignQuantity);
    setShowAssignModal(false);
    setSelectedPart(null);
    setAssignQuantity(1);
  };
  
  const getPartDetails = (partId: string) => {
    return mockInventory.find(part => part.id === partId);
  };
  
  const calculateTotalCost = () => {
    let total = 0;
    assignedParts.forEach(assignment => {
      const part = getPartDetails(assignment.itemId);
      if (part) {
        total += part.unitPrice * assignment.quantity;
      }
    });
    return total.toFixed(2);
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'on_order': return 'bg-blue-100 text-blue-800';
      case 'backordered': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Assigned Parts Section */}
      <Card>
        <CardHeader 
          title="Assigned Parts" 
          action={
            !readonly && (
              <Button
                size="sm"
                onClick={onClick || (() => {})}
                icon={<Plus className="w-4 h-4" />}
              >
                Assign Parts
              </Button>
            )
          }
        />
        <CardContent>
          {assignedParts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No parts assigned</h3>
              <p className="mt-1 text-sm text-gray-500">
                {readonly 
                  ? 'No parts have been assigned to this job card.' 
                  : 'Assign parts to this job card to track usage and costs.'}
              </p>
              {!readonly && (
                <div className="mt-6">
                  <Button
                    onClick={onClick || (() => {})}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Assign Parts
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Part Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Part Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                      {!readonly && (
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {assignedParts.map(assignment => {
                      const part = getPartDetails(assignment.itemId);
                      if (!part) return null;
                      
                      return (
                        <tr key={assignment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {part.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {part.partNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {assignment.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            ${part.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                            ${(part.unitPrice * assignment.quantity).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(part.status)}`}>
                              {part.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          {!readonly && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                size="xs"
                                variant="danger"
                                icon={<Trash2 className="w-3 h-3" />}
                                onClick={onClick || (() => {})}
                              >
                                Remove
                              </Button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium">
                        Total Cost:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right">
                        ${calculateTotalCost()}
                      </td>
                      <td colSpan={readonly ? 1 : 2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Part Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-gray-900">Assign Parts</h3>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedPart(null);
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {selectedPart ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="text-md font-medium text-blue-800">{selectedPart.name}</h4>
                    <p className="text-sm text-blue-700 mt-1">Part #: {selectedPart.partNumber}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-blue-700">
                        Available: <span className="font-medium">{selectedPart.quantity}</span>
                      </p>
                      <p className="text-sm text-blue-700">
                        Unit Price: <span className="font-medium">${selectedPart.unitPrice.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity to Assign
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={selectedPart.quantity}
                      className="w-full border rounded-md px-3 py-2"
                      value={assignQuantity}
                      onChange={(e) => setAssignQuantity(parseInt(e.target.value))}
                    />
                  </div>
                  
                  {selectedPart.quantity === 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Out of Stock</p>
                        <p className="text-sm text-yellow-700">
                          This part is currently out of stock or on order. 
                          You can still assign it, but it may delay the job completion.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPart(null);
                      }}
                    >
                      Back to List
                    </Button>
                    <Button
                      onClick={onClick || (() => {})}
                      disabled={assignQuantity < 1}
                    >
                      Assign Part
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="pl-10 block w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Search parts by name or part number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="border rounded-md divide-y max-h-[50vh] overflow-y-auto">
                    {filteredInventory.map(part => (
                      <div
                        key={part.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={onClick || (() => {})}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{part.name}</h4>
                            <p className="text-sm text-gray-500">Part #: {part.partNumber}</p>
                            {part.location && (
                              <p className="text-xs text-gray-500">Location: {part.location}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">${part.unitPrice.toFixed(2)}</p>
                            <div className="flex items-center mt-1">
                              {part.status === 'in_stock' ? (
                                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                              )}
                              <span className={`text-xs font-medium ${
                                part.status === 'in_stock' ? 'text-green-700' : 'text-yellow-700'
                              }`}>
                                {part.quantity} in stock
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {filteredInventory.length === 0 && (
                      <div className="p-8 text-center">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No parts found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Try adjusting your search or adding a new part to inventory.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={onClick || (() => {})}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      icon={<Plus className="w-4 h-4" />}
                    >
                      Add New Part
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPanel;