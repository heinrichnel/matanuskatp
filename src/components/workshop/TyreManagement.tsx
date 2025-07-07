import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Target } from 'lucide-react';
import TyreManagementView from './TyreManagementView';
  
interface TyreManagementProps {
  activeTab?: string;
}

const TyreManagement: React.FC<TyreManagementProps> = ({ activeTab = 'dashboard' }) => {
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
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {item ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TyreManagement;