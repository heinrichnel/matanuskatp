import React, { useState, useEffect, useMemo } from 'react';
import { Trip, TripEditRecord, TRIP_EDIT_REASONS, AdditionalCost } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input, Select, TextArea } from '../ui/FormElements';
import { Save, X, DollarSign } from 'lucide-react';
import AdditionalCostsForm from '../Cost Management/AdditionalCostsForm';
import { useAppContext } from '../../context/AppContext';

interface CompletedTripEditModalProps {
  isOpen: boolean;
  trip: Trip;
  onClose: () => void;
  // Hardened onSave to accept a single, complete Trip object
  onSave: (updatedTrip: Trip) => Promise<void>;
}

const CompletedTripEditModal: React.FC<CompletedTripEditModalProps> = ({
  isOpen,
  trip,
  onClose,
  onSave
}) => {
  const { addAdditionalCost, removeAdditionalCost } = useAppContext();
  const [activeTab, setActiveTab] = useState<'basic' | 'costs'>('basic');
  const [formData, setFormData] = useState({
    baseRevenue: trip.baseRevenue.toString(),
    distanceKm: trip.distanceKm?.toString() || '0',
  });
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>(trip.additionalCosts || []);
  const [editReason, setEditReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (trip) {
      setFormData({
        baseRevenue: trip.baseRevenue.toString(),
        distanceKm: trip.distanceKm?.toString() || '0',
      });
      setAdditionalCosts(trip.additionalCosts || []);
      setEditReason('');
      setCustomReason('');
      setErrors({});
    }
  }, [trip, isOpen]);

  const changedFields = useMemo(() => {
    const changes: Array<{ field: keyof typeof formData; oldValue: string; newValue: string }> = [];
    if (parseFloat(formData.baseRevenue) !== trip.baseRevenue) {
      changes.push({ field: 'baseRevenue', oldValue: trip.baseRevenue.toString(), newValue: formData.baseRevenue });
    }
    if (parseFloat(formData.distanceKm) !== (trip.distanceKm || 0)) {
      changes.push({ field: 'distanceKm', oldValue: trip.distanceKm?.toString() || '0', newValue: formData.distanceKm });
    }
    return changes;
  }, [formData, trip]);
  
  const hasAdditionalCostsChanges = useMemo(() => {
    return additionalCosts.length !== (trip.additionalCosts?.length || 0);
  }, [additionalCosts, trip.additionalCosts]);

  const handleAddCost = async (cost: Omit<AdditionalCost, 'id'>, files?: FileList) => {
    try {
      // If addAdditionalCost from context is implemented, use it
      // Otherwise, handle locally for now
      const costId = await addAdditionalCost(trip.id, cost, files) || `cost-${Date.now()}`;
      
      const newCost: AdditionalCost = {
        ...cost,
        id: costId,
        // Make sure to set these if they're not set by the context function
        supportingDocuments: cost.supportingDocuments || []
      };
      
      setAdditionalCosts(prev => [...prev, newCost]);
    } catch (error) {
      console.error("Failed to add additional cost:", error);
      alert("Failed to add cost. Please try again.");
    }
  };

  const handleRemoveCost = async (costId: string) => {
    try {
      // If removeAdditionalCost from context is implemented, use it
      // Otherwise, handle locally for now
      await removeAdditionalCost(trip.id, costId).catch(() => {
        console.log("Using local fallback for cost removal");
      });
      
      setAdditionalCosts(prev => prev.filter(cost => cost.id !== costId));
    } catch (error) {
      console.error("Failed to remove additional cost:", error);
      alert("Failed to remove cost. Please try again.");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const finalReason = editReason === 'Other (specify in comments)' ? customReason.trim() : editReason;

    if (!finalReason) {
      newErrors.editReason = 'An edit reason is mandatory.';
    }
    if (changedFields.length === 0 && !hasAdditionalCostsChanges) {
      newErrors.general = 'No changes have been made to the trip data.';
    }
    if (isNaN(parseFloat(formData.baseRevenue)) || parseFloat(formData.baseRevenue) <= 0) {
      newErrors.baseRevenue = "Revenue must be a positive number.";
    }
    if (isNaN(parseFloat(formData.distanceKm)) || parseFloat(formData.distanceKm) < 0) {
      newErrors.distanceKm = "Distance cannot be negative.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const finalReason = editReason === 'Other (specify in comments)' ? customReason.trim() : editReason;

    try {
      // Create a new edit record for each actual change
      const newEditRecords: TripEditRecord[] = changedFields.map(change => ({
        id: crypto.randomUUID(),
        tripId: trip.id,
        editedBy: 'Current User', // STUB: Replace with actual authenticated user
        editedAt: new Date().toISOString(),
        reason: finalReason,
        fieldChanged: change.field,
        oldValue: change.oldValue,
        newValue: change.newValue,
        changeType: 'update',
      }));

      // Add an edit record for additional costs if changed
      if (hasAdditionalCostsChanges) {
        newEditRecords.push({
          id: crypto.randomUUID(),
          tripId: trip.id,
          editedBy: 'Current User',
          editedAt: new Date().toISOString(),
          reason: finalReason,
          fieldChanged: 'additionalCosts',
          oldValue: `${trip.additionalCosts?.length || 0} costs`,
          newValue: `${additionalCosts.length} costs`,
          changeType: 'update',
        });
      }

      console.log(`Creating ${newEditRecords.length} edit records for trip ${trip.id}`);

      const updatedTrip: Trip = {
        ...trip,
        baseRevenue: parseFloat(formData.baseRevenue),
        distanceKm: parseFloat(formData.distanceKm),
        additionalCosts: additionalCosts,
        editHistory: [...(trip.editHistory || []), ...newEditRecords]
      };

      console.log(`Saving updated trip: ${trip.id}`, {
        baseRevenue: updatedTrip.baseRevenue,
        distanceKm: updatedTrip.distanceKm,
        additionalCostsLength: updatedTrip.additionalCosts?.length,
        editHistoryLength: updatedTrip.editHistory?.length
      });

      await onSave(updatedTrip);
      onClose();
    } catch (error) {
      console.error("KILO CODE AUDIT // Failed to save completed trip:", error);
      setErrors({ general: 'Failed to save changes. Please try again.' });

      // Throw error after setting UI error state
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Completed Trip: ${trip.fleetNumber}`}>
      <div className="p-4 space-y-4">
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'basic' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'costs' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('costs')}
          >
            Additional Costs
          </button>
        </div>
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-lg text-gray-800">Trip Summary</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
            <span><strong>Fleet:</strong> {trip.fleetNumber}</span>
            <span><strong>Driver:</strong> {trip.driverName}</span>
            <span><strong>Client:</strong> {trip.clientName}</span>
            <span><strong>Route:</strong> {trip.route}</span>
          </div>
        </div>

        {activeTab === 'basic' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Base Revenue"
                type="number"
                value={formData.baseRevenue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData(p => ({ ...p, baseRevenue: e.target.value }))
                }
                error={errors.baseRevenue}
              />
              <Input
                label="Distance (km)"
                type="number"
                value={formData.distanceKm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData(p => ({ ...p, distanceKm: e.target.value }))
                }
                error={errors.distanceKm}
              />
            </div>
          </>
        )}

        {activeTab === 'costs' && (
          <div className="mt-4">
            <AdditionalCostsForm
              tripId={trip.id}
              additionalCosts={additionalCosts}
              onAddCost={handleAddCost}
              onRemoveCost={handleRemoveCost}
            />
          </div>
        )}

        {/* Edit Reason - Required */}
        <div className="space-y-4 border-t pt-4 mt-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Justification (Required)</h3>
          <Select
            label="Reason for Edit *"
            value={editReason}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditReason(e.target.value)}
            options={[
              { label: 'Select reason...', value: '' },
              ...TRIP_EDIT_REASONS.map(reason => ({ label: reason, value: reason }))
            ]}
            error={errors.editReason}
          />
          {editReason === 'Other (specify in comments)' && (
            <TextArea
              label="Please specify reason"
              value={customReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomReason(e.target.value)}
              error={errors.editReason}
              rows={2}
            />
          )}
        </div>

        {errors.general && <div className="text-red-600 text-sm font-medium p-2 bg-red-50 rounded-md">{errors.general}</div>}

        <div className="flex justify-end space-x-2 pt-2">
          <Button icon={<X className="h-4 w-4" />} variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button
            icon={<Save className="h-4 w-4" />}
            onClick={handleSave}
            disabled={isSubmitting || (changedFields.length === 0 && !hasAdditionalCostsChanges) || Object.keys(errors).length > 0}
            isLoading={isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CompletedTripEditModal;
