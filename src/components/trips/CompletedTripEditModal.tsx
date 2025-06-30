/*
 KILO CODE RATIONALE // FILE: src/components/trips/CompletedTripEditModal.tsx
 --------------------------------------------------------------------------------
 // WHAT: Corrected a critical bug in the `handleSave` function and hardened the component's state and validation logic.
 // WHY: The original code contained a loop that called `onSave` multiple times, which is incorrect for atomic database updates and would cause unpredictable UI behavior. The hardened version now correctly calculates all changes, generates a single array of `TripEditRecord` objects, and calls `onSave` only ONCE with the fully updated trip object. This ensures data integrity and atomicity. State management was also improved to provide clearer validation feedback and prevent submission if no actual changes have been made.
 // PREVENTION: This fix prevents data corruption and ensures that the audit trail (`editHistory`) is accurate and complete for every update transaction. Disabling the save button during submission prevents duplicate updates from accidental double-clicks.
*/
import React, { useState, useEffect, useMemo } from 'react';
import { Trip, TripEditRecord, TRIP_EDIT_REASONS } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input, Select, TextArea } from '../ui/FormElements';
import { Save, X } from 'lucide-react';

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
  const [formData, setFormData] = useState({
    baseRevenue: trip.baseRevenue.toString(),
    distanceKm: trip.distanceKm?.toString() || '0',
  });
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const finalReason = editReason === 'Other (specify in comments)' ? customReason.trim() : editReason;

    if (!finalReason) {
      newErrors.editReason = 'An edit reason is mandatory.';
    }
    if (changedFields.length === 0) {
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

      console.log(`Creating ${newEditRecords.length} edit records for trip ${trip.id}`);

      const updatedTrip: Trip = {
        ...trip,
        baseRevenue: parseFloat(formData.baseRevenue),
        distanceKm: parseFloat(formData.distanceKm),
        editHistory: [...(trip.editHistory || []), ...newEditRecords]
      };

      console.log(`Saving updated trip: ${trip.id}`, {
        baseRevenue: updatedTrip.baseRevenue,
        distanceKm: updatedTrip.distanceKm,
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
    };
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit Completed Trip: ${trip.fleetNumber}`}>
      <div className="p-4 space-y-4">
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-lg text-gray-800">Trip Summary</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-sm">
            <span><strong>Fleet:</strong> {trip.fleetNumber}</span>
            <span><strong>Driver:</strong> {trip.driverName}</span>
            <span><strong>Client:</strong> {trip.clientName}</span>
            <span><strong>Route:</strong> {trip.route}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Base Revenue"
            type="number"
            value={formData.baseRevenue}
            onChange={val => setFormData(p => ({ ...p, baseRevenue: val }))}
            error={errors.baseRevenue}
          />
          <Input
            label="Distance (km)"
            type="number"
            value={formData.distanceKm}
            onChange={val => setFormData(p => ({ ...p, distanceKm: val }))}
            error={errors.distanceKm}
          />
        </div>

        {/* Edit Reason - Required */}
        <div className="space-y-4 border-t pt-4 mt-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Justification (Required)</h3>
          <Select
            label="Reason for Edit *"
            value={editReason}
            onChange={setEditReason}
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
              onChange={setCustomReason}
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
            disabled={isSubmitting || changedFields.length === 0 || Object.keys(errors).length > 0}
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
