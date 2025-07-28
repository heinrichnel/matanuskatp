import React from 'react';
import { SouthAfricaItem } from '../../types/cashManagerTypes';
import { Button } from '../ui/Button';
import { Trash2, Plus } from 'lucide-react';

interface SouthAfricaExpensesFormProps {
  southAfricaItems: SouthAfricaItem[];
  onAddSouthAfricaItem: () => void;
  onRemoveSouthAfricaItem: (id: string) => void;
  onUpdateSouthAfricaItem: (id: string, field: keyof SouthAfricaItem, value: any) => void;
}

const SouthAfricaExpensesForm: React.FC<SouthAfricaExpensesFormProps> = ({
  southAfricaItems,
  onAddSouthAfricaItem,
  onRemoveSouthAfricaItem,
  onUpdateSouthAfricaItem
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">SOUTH AFRICA</h2>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">South Africa Expenses</h3>
          <Button
            onClick={onAddSouthAfricaItem}
            variant="outline"
            className="flex items-center gap-1 text-sm"
          >
            <Plus size={16} /> Add Expense
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 mb-2 font-semibold text-sm">
            <div className="col-span-4">Supplier</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2">IR</div>
            <div className="col-span-2">ZAR</div>
            <div className="col-span-1"></div>
          </div>

          {/* South Africa Items */}
          {southAfricaItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-4">
                <input
                  type="text"
                  value={item.supplier || ''}
                  onChange={(e) => onUpdateSouthAfricaItem(item.id, 'supplier', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Supplier name"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => onUpdateSouthAfricaItem(item.id, 'description', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Description"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  value={item.ir || ''}
                  onChange={(e) => onUpdateSouthAfricaItem(item.id, 'ir', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="IR number"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.zar !== null ? item.zar : ''}
                  onChange={(e) => onUpdateSouthAfricaItem(
                    item.id,
                    'zar',
                    e.target.value === '' ? null : parseFloat(e.target.value)
                  )}
                  className="w-full border rounded px-3 py-2"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <button
                  onClick={() => onRemoveSouthAfricaItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Display */}
      <div className="mt-4 text-right">
        <div className="text-lg font-bold text-red-600">
          Total ZAR: R{southAfricaItems.reduce((sum, item) => sum + (item.zar || 0), 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default SouthAfricaExpensesForm;
