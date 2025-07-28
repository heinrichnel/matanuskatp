import React from 'react';
import { DieselItem } from '../../types/cashManagerTypes';
import { Button } from '../ui/Button';
import { Trash2, Plus } from 'lucide-react';

interface DieselExpensesFormProps {
  dieselItems: DieselItem[];
  onAddDieselItem: () => void;
  onRemoveDieselItem: (id: string) => void;
  onUpdateDieselItem: (id: string, field: keyof DieselItem, value: any) => void;
}

const DieselExpensesForm: React.FC<DieselExpensesFormProps> = ({
  dieselItems,
  onAddDieselItem,
  onRemoveDieselItem,
  onUpdateDieselItem
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">DIESEL</h2>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Diesel Expenses</h3>
          <Button
            onClick={onAddDieselItem}
            variant="outline"
            className="flex items-center gap-1 text-sm"
          >
            <Plus size={16} /> Add Diesel Entry
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 mb-2 font-semibold text-sm">
            <div className="col-span-4">Supplier</div>
            <div className="col-span-2">QTY</div>
            <div className="col-span-2">PRIZE</div>
            <div className="col-span-3">TOTAL</div>
            <div className="col-span-1"></div>
          </div>

          {/* Diesel Items */}
          {dieselItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-4">
                <input
                  type="text"
                  value={item.supplier || ''}
                  onChange={(e) => onUpdateDieselItem(item.id, 'supplier', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Supplier name"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.qty !== null ? item.qty : ''}
                  onChange={(e) => onUpdateDieselItem(
                    item.id,
                    'qty',
                    e.target.value === '' ? null : parseFloat(e.target.value)
                  )}
                  className="w-full border rounded px-3 py-2"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.price !== null ? item.price : ''}
                  onChange={(e) => onUpdateDieselItem(
                    item.id,
                    'price',
                    e.target.value === '' ? null : parseFloat(e.target.value)
                  )}
                  className="w-full border rounded px-3 py-2"
                  placeholder="0.000"
                  step="0.001"
                  min="0"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="number"
                  value={item.total !== null ? item.total : ''}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  placeholder="0.00"
                />
              </div>
              <div className="col-span-1 flex justify-center items-center">
                <button
                  onClick={() => onRemoveDieselItem(item.id)}
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
    </div>
  );
};

export default DieselExpensesForm;
