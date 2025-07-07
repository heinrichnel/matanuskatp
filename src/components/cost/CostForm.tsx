// ─── React ───────────────────────────────────────────────────────
import React, { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────
import { CostEntry, COST_CATEGORIES } from '../../types/index';

// ─── Components ───────────────────────────────────────────────────────
import Button from '../ui/Button';
import { Input, Select } from '../ui/FormElements';

interface CostFormProps {
  tripId: string;
  cost?: CostEntry;
  onSubmit: (costData: Omit<CostEntry, 'id' | 'attachments'>, files?: FileList) => void;
  onCancel: () => void;
}

const CostForm: React.FC<Omit<CostFormProps, 'cost'>> = ({ tripId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    category: '',
    subCategory: '',
    amount: '',
    currency: 'ZAR',
    referenceNumber: '',
    date: '',
    notes: '',
    isFlagged: false,
    flagReason: '',
    noDocumentReason: ''
  });

  const handleChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const costData: Omit<CostEntry, 'id' | 'attachments'> = {
      tripId,
      category: formData.category,
      subCategory: formData.subCategory,
      amount: Number(formData.amount),
      currency: formData.currency as 'USD' | 'ZAR',
      referenceNumber: formData.referenceNumber,
      date: formData.date,
      notes: formData.notes,
      isFlagged: formData.isFlagged,
      flagReason: formData.flagReason,
      noDocumentReason: formData.noDocumentReason
    };
    onSubmit(costData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Select
        label="Category"
        value={formData.category}
        onChange={(value) => handleChange('category', value)}
        options={Object.keys(COST_CATEGORIES).map(category => ({ label: category, value: category }))}
      />
      <Input
        label="Amount"
        type="number"
        value={formData.amount}
        onChange={(value) => handleChange('amount', value)}
      />
      <Button type="submit">Submit</Button>
      <Button type="button" onClick={onCancel}>Cancel</Button>
    </form>
  );
};

export default CostForm;
