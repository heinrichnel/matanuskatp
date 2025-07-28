import React from 'react';
import { ZimbabweSupplierItem, ZimbabwePettyCashItem } from '../../types/cashManagerTypes';
import { Input } from '../ui/FormElements';
import { Button } from '../ui/Button';
import { Trash2, Plus } from 'lucide-react';

interface ZimbabweExpensesFormProps {
  supplierItems: ZimbabweSupplierItem[];
  pettyCashItems: ZimbabwePettyCashItem[];
  onAddSupplierItem: () => void;
  onRemoveSupplierItem: (id: string) => void;
  onUpdateSupplierItem: (id: string, field: keyof ZimbabweSupplierItem, value: any) => void;
  onUpdatePettyCashItem: (id: string, field: keyof ZimbabwePettyCashItem, value: any) => void;
}

const ZimbabweExpensesForm: React.FC<ZimbabweExpensesFormProps> = ({
  supplierItems,
  pettyCashItems,
  onAddSupplierItem,
  onRemoveSupplierItem,
  onUpdateSupplierItem,
  onUpdatePettyCashItem
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">ZIMBABWE</h2>

      {/* Supplier Items */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Supplier Expenses</h3>
          <Button
            onClick={onAddSupplierItem}
            variant="outline"
            className="flex items-center gap-1 text-sm"
          >
            <Plus size={16} /> Add Supplier
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 mb-2 font-semibold text-sm">
            <div className="col-span-4">Supplier</div>
            <div className="col-span-3">Description</div>
            <div className="col-span-2">IR</div>
            <div className="col-span-2">USD</div>
            <div className="col-span-1"></div>
          </div>

          {/* Supplier Items */}
          {supplierItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-4">
                <input
                  type="text"
                  value={item.supplier || ''}
                  onChange={(e) => onUpdateSupplierItem(item.id, 'supplier', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Supplier name"
                />
              </div>
              <div className="col-span-3">
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => onUpdateSupplierItem(item.id, 'description', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Description"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  value={item.ir || ''}
                  onChange={(e) => onUpdateSupplierItem(item.id, 'ir', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="IR number"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.usd !== null ? item.usd : ''}
                  onChange={(e) => onUpdateSupplierItem(
                    item.id,
                    'usd',
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
                  onClick={() => onRemoveSupplierItem(item.id)}
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

      {/* Petty Cash Items */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Petty Cash & Services</h3>

        <div className="bg-gray-50 p-4 rounded-md">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-2 mb-2 font-semibold text-sm">
            <div className="col-span-4">Description</div>
            <div className="col-span-2">USD</div>
          </div>

          {/* Petty Cash Items */}
          {pettyCashItems.map((item) => (
            <div key={item.id} className="grid grid-cols-6 gap-2 mb-2">
              <div className="col-span-4">
                <input
                  type="text"
                  value={item.description || ''}
                  onChange={(e) => onUpdatePettyCashItem(item.id, 'description', e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Description"
                  disabled={true} // These are fixed items
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  value={item.usd !== null ? item.usd : ''}
                  onChange={(e) => onUpdatePettyCashItem(
                    item.id,
                    'usd',
                    e.target.value === '' ? null : parseFloat(e.target.value)
                  )}
                  className="w-full border rounded px-3 py-2"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZimbabweExpensesForm;
