import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Truck, Search, Plus, Trash2, Edit, Filter, RefreshCw, Download, Target, Tag } from 'lucide-react';
import TyreManagementView from './TyreManagementView';
import { Input, Select } from '../ui/FormElements';
import TyreInventoryForm from './TyreInventoryForm';
import { TyreInventoryItem, getUniqueTyreBrands, getUniqueTyreSizes, getUniqueTyrePatterns, VENDORS } from '../../utils/tyreConstants';

interface AddEditTyreModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: TyreInventoryItem;
  onSave: (item: Omit<TyreInventoryItem, 'id'>) => Promise<void>;
}

const AddEditTyreModal: React.FC<AddEditTyreModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave
}) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    pattern: '',
    size: '',
    quantity: '0',
    minStock: '0',
    cost: '0',
    supplier: '',
    location: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (item) {
      setFormData({
        brand: item.brand,
        model: item.model || '',
        pattern: item.pattern || '',
        size: item.size,
        quantity: item.quantity.toString(),
        minStock: item.reorderLevel.toString(),
        cost: item.cost.toString(),
        supplier: item.supplierId,
        location: item.storeLocation,
        notes: item.notes || ''
      });
    } else {
      setFormData({
        brand: '',
        model: '',
        pattern: '',
        size: '',
        quantity: '0',
        minStock: '0',
        cost: '0',
        supplier: '',
        location: 'Vichels Store',
        notes: ''
      });
    }
    setErrors({});
  }, [item, isOpen]);
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.size) newErrors.size = 'Size is required';
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    if (!formData.minStock || parseInt(formData.minStock) < 0) {
      newErrors.minStock = 'Minimum stock must be a positive number';
    }
    if (!formData.cost || parseFloat(formData.cost) <= 0) {
      newErrors.cost = 'Cost must be greater than 0';
    }
    if (!formData.location) newErrors.location = 'Storage location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      // Prepare the item data
      const newItem: Omit<TyreInventoryItem, 'id'> = {
        tyreRef: {
          brand: formData.brand,
          pattern: formData.pattern,
          size: formData.size,
          position: 'Drive' // Default position
        },
        serialNumber: '', // These can be added later when an actual tyre is assigned
        dotCode: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        cost: parseFloat(formData.cost),
        supplier: VENDORS.find(v => v.id === formData.supplier) || VENDORS[0],
        status: 'in_stock',
        storeLocation: formData.location as any,
        notes: formData.notes,
        quantity: parseInt(formData.quantity),
        reorderLevel: parseInt(formData.minStock),
        brand: formData.brand,
        pattern: formData.pattern,
        size: formData.size,
        position: 'Drive', // Default position
        supplierId: formData.supplier
      };
      
      await onSave(newItem);
      onClose();
    } catch (error) {
      console.error('Error saving tyre inventory item:', error);
      setErrors({ submit: 'Failed to save item. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Tyre Inventory Item' : 'Add New Tyre Inventory Item'}
      maxWidth="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Brand *"
            value={formData.brand}
            onChange={(value) => handleChange('brand', value)}
            options={[
              { label: 'Select brand...', value: '' },
              ...getUniqueTyreBrands().map(brand => ({ label: brand, value: brand }))
            ]}
            error={errors.brand}
          />
          
          <Input
            label="Model"
            value={formData.model}
            onChange={(value) => handleChange('model', value)}
            placeholder="e.g., TR688"
          />
          
          <Select
            label="Pattern"
            value={formData.pattern}
            onChange={(value) => handleChange('pattern', value)}
            options={[
              { label: 'Select pattern...', value: '' },
              ...getUniqueTyrePatterns().map(pattern => ({ label: pattern, value: pattern }))
            ]}
          />
          
          <Select
            label="Size *"
            value={formData.size}
            onChange={(value) => handleChange('size', value)}
            options={[
              { label: 'Select size...', value: '' },
              ...getUniqueTyreSizes().map(size => ({ label: size, value: size }))
            ]}
            error={errors.size}
          />
          
          <Input
            label="Quantity *"
            type="number"
            value={formData.quantity}
            onChange={(value) => handleChange('quantity', value)}
            min="0"
            error={errors.quantity}
          />
          
          <Input
            label="Minimum Stock Level *"
            type="number"
            value={formData.minStock}
            onChange={(value) => handleChange('minStock', value)}
            min="0"
            error={errors.minStock}
          />
          
          <Input
            label="Cost per Unit *"
            type="number"
            value={formData.cost}
            onChange={(value) => handleChange('cost', value)}
            min="0.01"
            step="0.01"
            error={errors.cost}
          />
          
          <Select
            label="Supplier"
            value={formData.supplier}
            onChange={(value) => handleChange('supplier', value)}
            options={[
              { label: 'Select supplier...', value: '' },
              ...VENDORS.map(vendor => ({ label: vendor.name, value: vendor.id }))
            ]}
          />
          
          <Select
            label="Storage Location *"
            value={formData.location}
            onChange={(value) => handleChange('location', value)}
            options={[
              { label: 'Vichels Store', value: 'Vichels Store' },
              { label: 'Holding Bay', value: 'Holding Bay' },
              { label: 'RFR', value: 'RFR' },
              { label: 'Scrapped', value: 'Scrapped' }
            ]}
            error={errors.location}
          />
        </div>
        
        <TextArea
          label="Notes"
          value={formData.notes}
          onChange={(value) => handleChange('notes', value)}
          placeholder="Additional information about this inventory item..."
          rows={3}
        />
        
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
            {errors.submit}
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {item ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const TyreManagement: React.FC = () => {
  const {
    workshopInventory,
    addWorkshopInventoryItem,
    updateWorkshopInventoryItem,
    deleteWorkshopInventoryItem,
    refreshWorkshopInventory,
    isLoading
  } = useAppContext();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<TyreInventoryItem | undefined>(undefined);
  const [filters, setFilters] = useState({
    brand: '',
    size: '',
    location: '',
    lowStock: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleTyreSubmit = (tyreData: any) => {
    console.log('Tyre submitted:', tyreData);
    alert(`Tyre added: ${tyreData.brand} ${tyreData.model} (${tyreData.tyreSize})`);
    // In a real app, this would save to Firestore
  };

  // Apply filters to inventory
  const filteredInventory = workshopInventory.filter(item => {
    if (filters.brand && item.brand !== filters.brand) return false;
    if (filters.size && item.size !== filters.size) return false;
    if (filters.location && item.storeLocation !== filters.location) return false;
    if (filters.lowStock && item.quantity > item.reorderLevel) return false;
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        item.brand.toLowerCase().includes(term) ||
        item.model?.toLowerCase().includes(term) ||
        item.pattern?.toLowerCase().includes(term) ||
        item.size.toLowerCase().includes(term) ||
        item.supplier.name.toLowerCase().includes(term)
      );
    }
    
    return true;
  });
  
  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddItem = async (item: Omit<TyreInventoryItem, 'id'>) => {
    await addWorkshopInventoryItem(item);
    alert('Tyre inventory item added successfully!');
  };
  
  const handleUpdateItem = async (item: Omit<TyreInventoryItem, 'id'>) => {
    if (!editingItem) return;
    await updateWorkshopInventoryItem({
      ...item,
      id: editingItem.id
    });
    setEditingItem(undefined);
    alert('Tyre inventory item updated successfully!');
  };
  
  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this inventory item? This action cannot be undone.')) {
      await deleteWorkshopInventoryItem(id);
      alert('Tyre inventory item deleted successfully!');
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshWorkshopInventory();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const exportInventory = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Brand,Model,Pattern,Size,Quantity,Min Stock,Cost,Supplier,Location,Notes\n";
    
    filteredInventory.forEach(item => {
      const row = [
        item.brand,
        item.model || '',
        item.pattern || '',
        item.size,
        item.quantity,
        item.reorderLevel,
        item.cost,
        item.supplier.name,
        item.storeLocation,
        (item.notes || '').replace(/,/g, ';') // Replace commas in notes to avoid breaking CSV
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tyre_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    document.body.removeChild(link);
  };
  
  // Group by brand for summary
  const brandSummary = workshopInventory.reduce((acc, item) => {
    const brand = item.brand;
    if (!acc[brand]) {
      acc[brand] = {
        totalItems: 0,
        totalValue: 0,
        lowStock: 0
      };
    }
    
    acc[brand].totalItems += item.quantity;
    acc[brand].totalValue += item.cost * item.quantity;
    if (item.quantity <= item.reorderLevel) {
      acc[brand].lowStock += 1;
    }
    
    return acc;
  }, {} as Record<string, { totalItems: number, totalValue: number, lowStock: number }>);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tyre Inventory Management</h2>
          <p className="text-gray-600">Track and manage your tyre inventory across all locations</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            icon={isRefreshing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            disabled={isRefreshing}
          >
            Refresh
          </Button>
          
          <Button
            variant="outline"
            onClick={exportInventory}
            icon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          
          <Button
            onClick={() => {
              setEditingItem(undefined);
              setShowAddModal(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Tyre Stock
          </Button>
        </div>
      </div>
      
      {/* Inventory Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(brandSummary).slice(0, 5).map(([brand, data]) => (
          <Card key={brand}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{brand}</h3>
                  <div className="text-sm text-gray-500 mt-1">{data.totalItems} tyres in stock</div>
                </div>
                <Tag className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-medium">R{data.totalValue.toLocaleString()}</span>
                </div>
                {data.lowStock > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Low Stock Items:</span>
                    <span className="font-medium">{data.lowStock}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Filters */}
      <Card>
        <CardHeader title="Filter Inventory" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search tyre inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select
              label="Brand"
              value={filters.brand}
              onChange={(value) => handleFilterChange('brand', value)}
              options={[
                { label: 'All Brands', value: '' },
                ...getUniqueTyreBrands().map(brand => ({ label: brand, value: brand }))
              ]}
            />
            
            <Select
              label="Size"
              value={filters.size}
              onChange={(value) => handleFilterChange('size', value)}
              options={[
                { label: 'All Sizes', value: '' },
                ...getUniqueTyreSizes().map(size => ({ label: size, value: size }))
              ]}
            />
            
            <Select
              label="Location"
              value={filters.location}
              onChange={(value) => handleFilterChange('location', value)}
              options={[
                { label: 'All Locations', value: '' },
              ]}
            />
            <div className="flex items-center space-x-3 md:col-span-5">
              <input
                type="checkbox"
                id="lowStock"
                checked={filters.lowStock}
                onChange={(e) => handleFilterChange('lowStock', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="lowStock" className="text-sm font-medium text-gray-700">
                Show Only Low Stock Items
              </label>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({
                  brand: '',
                  size: '',
                  location: '',
                  lowStock: false
                })}
                className="ml-auto"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <TyreManagementView />
      
      {/* Inventory Table */}
      <Card>
        <CardHeader 
          title={`Tyre Inventory (${filteredInventory.length} items)`}
          action={
            <Button
              size="sm"
              onClick={() => {
                setEditingItem(undefined);
                setShowAddModal(true);
              }}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Item
            </Button>
          }
        />
        <CardContent>
          {filteredInventory.length === 0 ? (
            <div className="text-center py-8">
              <Truck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tyre inventory items</h3>
              <p className="mt-1 text-sm text-gray-500">
                {Object.values(filters).some(v => v !== '' && v !== false) || searchTerm
                  ? 'No items match your current filter criteria.'
                  : 'Get started by adding your first tyre inventory item.'}
              </p>
              {!Object.values(filters).some(v => v !== '' && v !== false) && !searchTerm && (
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      setEditingItem(undefined);
                      setShowAddModal(true);
                    }}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Add Tyre Stock
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand/Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size/Pattern</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className={item.quantity <= item.reorderLevel ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{item.brand}</div>
                        <div className="text-sm text-gray-500">{item.model || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.size}</div>
                        <div className="text-sm text-gray-500">{item.pattern || '-'}</div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right ${
                        item.quantity <= item.reorderLevel ? 'text-red-600 font-bold' : 'text-gray-900'
                      }`}>
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">{item.reorderLevel}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900">R{item.cost.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.storeLocation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.supplier.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            icon={<Edit className="w-3 h-3" />}
                            onClick={() => {
                              setEditingItem(item);
                              setShowAddModal(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            icon={<Trash2 className="w-3 h-3" />}
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Delete
                          </Button>
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
      
      {/* Add/Edit Modal */}
      <AddEditTyreModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(undefined);
        }}
        item={editingItem}
        onSave={editingItem ? handleUpdateItem : handleAddItem}
      />
    </div>
  );
};

export default TyreManagement;