// ─── React ───────────────────────────────────────────────────────
import React from 'react';

// ─── Types ───────────────────────────────────────────────────────
import { CostEntry } from '../../types/index';

// ─── UI Components ───────────────────────────────────────────────
import Card, { CardContent } from '../ui/Card';
import Button from '../ui/Button';

// ─── Icons ───────────────────────────────────────────────────────
import {
  Edit,
  FileText,
  Trash2
} from 'lucide-react';

// ─── Utilities ───────────────────────────────────────────────────
import { formatDate, formatCurrency } from '../../utils/helpers';

interface CostListProps {
  costs: CostEntry[];
  onEdit?: (cost: CostEntry) => void;
  onDelete?: (id: string) => void;
}

const CostList: React.FC<CostListProps> = ({ costs, onEdit, onDelete }) => {
  if (costs.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No cost entries</h3>
        <p className="mt-1 text-sm text-gray-500">
          Add cost entries to track expenses for this trip.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {costs.map((cost) => (
        <Card key={cost.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{cost.category}</h4>
                <p className="text-sm text-gray-600">{cost.subCategory}</p>
                <p className="text-sm text-gray-500">{formatDate(cost.date)}</p>
                <p className="text-sm text-gray-500">{formatCurrency(cost.amount, cost.currency)}</p>
              </div>
              <div className="flex space-x-2">
                {onEdit && (
                  <Button size="sm" variant="outline" onClick={() => onEdit(cost)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button size="sm" variant="danger" onClick={() => onDelete(cost.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CostList;
