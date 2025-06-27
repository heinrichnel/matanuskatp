import React, { useState } from 'react';
import { AdditionalCost } from '../../types';
import Button from '../ui/Button';
import { Input, TextArea } from '../ui/FormElements';
import { X } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

interface AdditionalCostsFormProps {
  tripId: string;
  currency: 'USD' | 'ZAR';
  costs: AdditionalCost[];
  onAdd: (costData: Omit<AdditionalCost, 'id'>) => void;
  onRemove: (costId: string) => void;
  onCancel: () => void;
}

const AdditionalCostsForm: React.FC<AdditionalCostsFormProps> = ({ tripId, currency, costs, onAdd, onRemove, onCancel }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
      alert('Please fill out all required fields.');
      return;
    }

    onAdd({
      description,
      amount: parseFloat(amount),
      notes,
      date: new Date().toISOString().split('T')[0],
      costType: 'other', // Defaulting to 'other'
      supportingDocuments: [],
      addedAt: new Date().toISOString(),
      addedBy: 'System', // Placeholder
      tripId,
      currency,
    });

    setDescription('');
    setAmount('');
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900">Add an Additional Cost</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Description"
              value={description}
              onChange={setDescription}
              placeholder="e.g., Border Fees"
              required
            />
            <Input
              label="Amount"
              type="number"
              value={amount}
              onChange={setAmount}
              placeholder="250.00"
              required
            />
        </div>
        <TextArea
          label="Notes (Optional)"
          value={notes}
          onChange={setNotes}
          placeholder="Additional details about the cost"
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Add Cost</Button>
        </div>
      </form>

      {costs && costs.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-md font-medium text-gray-700">Current Additional Costs</h4>
          <ul className="divide-y divide-gray-200 rounded-md border bg-white">
            {costs.map((cost) => (
              <li key={cost.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="font-medium text-gray-800">{cost.description}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(cost.amount, cost.currency)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(cost.id)}
                    className="p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                    aria-label={`Remove cost: ${cost.description}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdditionalCostsForm;
