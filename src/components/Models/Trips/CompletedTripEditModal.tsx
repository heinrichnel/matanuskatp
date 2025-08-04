import { Save, X } from "lucide-react";
import React, { useState } from "react";
import { Trip, TRIP_EDIT_REASONS, TripEditRecord } from "../../../types";
import Button from "../../ui/Button";
import { Input, Select, TextArea } from "../../ui/FormElements";
import Modal from "../../ui/Modal";

interface CompletedTripEditModalProps {
  isOpen: boolean;
  trip: Trip;
  onClose: () => void;
  onSave: (updatedTrip: Trip, editRecord: Omit<TripEditRecord, "id">) => void;
}

const CompletedTripEditModal: React.FC<CompletedTripEditModalProps> = ({
  isOpen,
  trip,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    fleetNumber: trip.fleetNumber,
    driverName: trip.driverName,
    clientName: trip.clientName,
    startDate: trip.startDate,
    endDate: trip.endDate,
    route: trip.route,
    description: trip.description || "",
    baseRevenue: trip.baseRevenue.toString(),
    revenueCurrency: trip.revenueCurrency,
    distanceKm: trip.distanceKm?.toString() || "",
  });

  const [editReason, setEditReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Declare finalReason before use
  const finalReason = customReason || editReason;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!editReason && !customReason) {
      newErrors["editReason"] = "Please select or enter a reason for editing.";
    }
    if (editReason === "Other (specify in comments)" && !customReason.trim()) {
      newErrors.customReason = "Please specify the reason for editing";
    }
    // Check if any changes were made
    const hasChanges = Object.keys(formData).some((key) => {
      const originalValue = trip[key as keyof Trip]?.toString() || "";
      const newValue = formData[key as keyof typeof formData] || "";
      return originalValue !== newValue;
    });
    if (!hasChanges) {
      newErrors.general = "No changes detected. Please make changes before saving.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const updatedTrip: Trip = {
      ...trip,
      ...formData,
      baseRevenue: parseFloat(formData.baseRevenue),
      distanceKm: parseFloat(formData.distanceKm),
    };
    // Identify changed fields
    const changes: Array<{ field: string; oldValue: string; newValue: string }> = [];
    Object.keys(formData).forEach((key) => {
      const originalValue = trip[key as keyof Trip]?.toString() || "";
      const newValue = formData[key as keyof typeof formData] || "";
      if (originalValue !== newValue) {
        changes.push({
          field: key,
          oldValue: originalValue,
          newValue: newValue,
        });
      }
    });
    // Create a single comprehensive edit record for all changes
    const editRecord: Omit<TripEditRecord, "id"> = {
      tripId: trip.id,
      editedBy: "Current User", // Replace with actual user
      editedAt: new Date().toISOString(),
      reason: finalReason,
      fieldChanged: changes.map((c) => c.field).join(", "),
      oldValue: changes.map((c) => `${c.field}: ${c.oldValue}`).join("; "),
      newValue: changes.map((c) => `${c.field}: ${c.newValue}`).join("; "),
      changeType: "update",
    };

    // Only update the trip once with all changes
    const updatedWithHistory: Trip = {
      ...updatedTrip,
      // Don't add the editRecord directly to editHistory here
      // The parent component should handle adding it with an ID
    };

    // Let the parent component handle the edit record and trip update
    onSave(updatedWithHistory, editRecord);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Completed Trip">
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">Edit Completed Trip</h2>
        <Input
          label="Fleet Number"
          value={formData.fleetNumber}
          onChange={(e) => handleChange("fleetNumber", e.target.value)}
        />
        <Input
          label="Driver Name"
          value={formData.driverName}
          onChange={(e) => handleChange("driverName", e.target.value)}
        />
        <Input
          label="Client Name"
          value={formData.clientName}
          onChange={(e) => handleChange("clientName", e.target.value)}
        />
        <Input
          label="Start Date"
          value={formData.startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
        />
        <Input
          label="End Date"
          value={formData.endDate}
          onChange={(e) => handleChange("endDate", e.target.value)}
        />
        <Input
          label="Route"
          value={formData.route}
          onChange={(e) => handleChange("route", e.target.value)}
        />
        <TextArea
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <Input
          label="Base Revenue"
          value={formData.baseRevenue}
          onChange={(e) => handleChange("baseRevenue", e.target.value)}
        />
        <Input
          label="Revenue Currency"
          value={formData.revenueCurrency}
          onChange={(e) => handleChange("revenueCurrency", e.target.value)}
        />
        <Input
          label="Distance (km)"
          value={formData.distanceKm}
          onChange={(e) => handleChange("distanceKm", e.target.value)}
        />
        {/* Edit Reason - Required */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Justification (Required)</h3>
          <Select
            label="Reason for Edit *"
            value={editReason}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditReason(e.target.value)}
            options={[
              { label: "Select reason for editing...", value: "" },
              ...TRIP_EDIT_REASONS.map((reason) => ({ label: reason, value: reason })),
            ]}
            error={errors.editReason}
          />
          <Input
            label="Custom Reason"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
          {errors.editReason && <div className="text-red-500">{errors.editReason}</div>}
        </div>
        <div className="flex justify-end space-x-2">
          <Button icon={<X />} variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button icon={<Save />} onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CompletedTripEditModal;
