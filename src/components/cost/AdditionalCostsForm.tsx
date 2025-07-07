// ─── React ───────────────────────────────────────────────────────
import React, { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────
import { AdditionalCost, ADDITIONAL_COST_TYPES } from '../../types/index';

// ─── UI Components ───────────────────────────────────────────────
import { Button } from '../ui/Button';
import { Input, Select, TextArea } from '../ui/FormElements';

interface AdditionalCostsFormProps {
  tripId: string;
  additionalCosts: AdditionalCost[];
  onAddCost: (cost: Omit<AdditionalCost, 'id'>) => void;
  onRemoveCost: (costId: string) => void;
}

const AdditionalCostsForm: React.FC<AdditionalCostsFormProps> = ({
  tripId,
  additionalCosts,
  onAddCost,
  onRemoveCost
}) => {
  const [formData, setFormData] = useState({
    costType: 'demurrage' as 'demurrage' | 'clearing_fees' | 'toll_charges' | 'detention' | 'escort_fees' | 'storage' | 'other',
    amount: '',
    currency: 'ZAR' as 'USD' | 'ZAR',
    notes: '',
    description: ''
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.description) {
      // Basic validation
      alert('Please fill in all required fields');
      return;
    }

    const costData: Omit<AdditionalCost, 'id'> = {
      tripId,
      costType: formData.costType,
      amount: Number(formData.amount),
      currency: formData.currency,
      notes: formData.notes,
      description: formData.description,
      supportingDocuments: [],
      addedAt: new Date().toISOString(),
      addedBy: 'Current User', // In a real app, this would come from auth context
      date: new Date().toISOString()
    };
    onAddCost(costData);
    
    // Reset form after submission
    setFormData({
      costType: 'demurrage',
      amount: '',
      currency: 'ZAR',
      notes: '',
      description: ''
    });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">Add Additional Cost</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Cost Type"
          value={formData.costType}
          onChange={(value) => handleChange('costType', value as any)}
          options={ADDITIONAL_COST_TYPES}
        />
        
        <Input
          label="Description"
          value={formData.description}
          onChange={(value) => handleChange('description', value)}
          required
        />
        
        <Input
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={(value) => handleChange('amount', value)}
          required
        />
        
        <Select
          label="Currency"
          value={formData.currency}
          onChange={(value) => handleChange('currency', value as any)}
          options={[
            { value: 'USD', label: 'USD' },
            { value: 'ZAR', label: 'ZAR' }
          ]}
        />
      </div>
      
      <TextArea
        label="Notes"
        value={formData.notes}
        onChange={(value) => handleChange('notes', value)}
        placeholder="Additional notes about this cost..."
      />
      
      <div className="flex justify-end mt-4">
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
          Add Cost
        </Button>
      </div>
      
      {additionalCosts.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-2">Added Costs</h4>
          <div className="divide-y">
            {additionalCosts.map(cost => (
              <div key={cost.id} className="py-2 flex justify-between items-center">
                <div>
                  <span className="font-medium">{cost.description}</span>
                  <div className="text-sm text-gray-600">
                    {cost.costType} - {cost.amount} {cost.currency}
                  </div>
                </div>
                <Button 
                  onClick={() => onRemoveCost(cost.id)}
                  variant="danger"
                  size="sm"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalCostsForm;
