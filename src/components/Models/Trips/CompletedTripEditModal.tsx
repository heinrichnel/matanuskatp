import React, { useState } from "react";
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import { Trip, CostEntry } from '../../../types';

interface CompletedTripEditModalProps {
  isOpen: boolean;
  trip: Trip;
  onClose: () => void;
  onSave: (trip: Trip) => void;
}

const CompletedTripEditModal: React.FC<CompletedTripEditModalProps> = ({
  isOpen,
  trip,
  onClose,
  onSave,
}) => {
  const [editedTrip, setEditedTrip] = useState<Trip>(trip);
  const [additionalCost, setAdditionalCost] = useState({
    description: "",
    amount: 0,
    currency: "ZAR"
  });

  const handleAddCost = () => {
    if (!additionalCost.description || additionalCost.amount <= 0) {
      return;
    }

    setEditedTrip({
      ...editedTrip,
      additionalCosts: [
        ,
        {
          ...additionalCost,
          id: `cost-${Date.now()}`,
          date: new Date().toISOString()
        }...editedTrip.additionalCosts
      ]
    });

    setAdditionalCost({
      description: "",
      amount: 0,
      currency: "ZAR"
    });
  };

  const handleRemoveCost = (costId: string) => {
    setEditedTrip({
      ...editedTrip,
      additionalCosts: editedTrip.additionalCosts.filter(cost => cost.id !== costId)
    });
  };

  const handleSave = () => {
    onSave(editedTrip);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Trip: ${trip.loadRef || trip.fleetNumber}`}
    >
      <div className="space-y-6">
        <div className="border rounded-md p-4 bg-gray-50">
          <h3 className="text-md font-medium mb-2">Trip Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-medium">{trip.clientName || trip.customer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Route</p>
              <p className="font-medium">{trip.route}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-medium">{new Date(trip.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">End Date</p>
              <p className="font-medium">{new Date(trip.endDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium mb-2">Additional Costs</h3>

          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Cost description"
                className="flex-1 p-2 border rounded"
                value={additionalCost.description}
                onChange={(e) => setAdditionalCost({...additionalCost, description: e.target.value})}
              />
              <input
                type="number"
                placeholder="Amount"
                className="w-24 p-2 border rounded"
                value={additionalCost.amount || ""}
                onChange={(e) => setAdditionalCost({...additionalCost, amount: parseFloat(e.target.value) || 0})}
              />
              <Button onClick={handleAddCost}>Add</Button>
            </div>
          </div>

          {editedTrip.additionalCosts.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {editedTrip.additionalCosts.map((cost) => (
                    <tr key={cost.id}>
                      <td className="px-4 py-2">{cost.description}</td>
                      <td className="px-4 py-2">{cost.amount} {cost.currency}</td>
                      <td className="px-4 py-2">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveCost(cost.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4 border rounded-md">No additional costs added yet</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CompletedTripEditModal;
