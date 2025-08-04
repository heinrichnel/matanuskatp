import { AlertTriangle } from "lucide-react";
import React, { useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { Trip } from "../../../types";
import TripForm from "../../forms/TripForm";
import Modal from "../../ui/Modal";

interface TripFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTrip?: Trip;
}

const TripFormModal: React.FC<TripFormModalProps> = ({ isOpen, onClose, editingTrip }) => {
  const { addTrip, updateTrip } = useAppContext();
  const [error, setError] = useState<string | null>(null);

  // Original handler expecting Trip data
  const handleTripData = async (
    tripData: Omit<Trip, "id" | "costs" | "status" | "additionalCosts">
  ) => {
    try {
      setError(null);
      if (editingTrip) {
        // Update existing trip
        await updateTrip({
          ...editingTrip,
          ...tripData,
        });
        console.log("Trip updated successfully");
      } else {
        // Add new trip
        await addTrip({
          ...tripData,
          additionalCosts: [], // Initialize additionalCosts as empty array
        });
        console.log("Trip added successfully");
      }
      // Close the modal after successful submission
      onClose();
    } catch (error) {
      console.error("Error saving trip:", error);
      setError(error instanceof Error ? error.message : "Failed to save trip. Please try again.");
    }
  };

  // Adapter function to convert FormData to Trip format
  const handleSubmit = async (formData: any) => {
    try {
      // Map FormData to Trip format
      const tripData: Omit<Trip, "id" | "costs" | "status" | "additionalCosts"> = {
        fleetNumber: formData.vehicle || "",
        driverName: formData.driver || "",
        clientName: formData.origin || "", // Using origin as client for this example
        clientType: "external", // Default client type
        startDate: formData.startDate || new Date().toISOString(),
        endDate: formData.endDate || new Date().toISOString(),
        route: `${formData.origin} to ${formData.destination}`,
        description: formData.notes || "",
        baseRevenue: parseFloat(formData.estimatedCost) || 0,
        revenueCurrency: "ZAR", // Default currency
        distanceKm: parseFloat(formData.distance) || 0,
        paymentStatus: "unpaid", // Default payment status
        followUpHistory: [], // Initialize with empty array
      };

      // Call the original handler with converted data
      await handleTripData(tripData);
    } catch (error) {
      console.error("Error in form adapter:", error);
      setError(error instanceof Error ? error.message : "Failed to process form data.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTrip ? "Edit Trip" : "Add New Trip"}
      maxWidth="lg"
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      <TripForm
        initialData={
          editingTrip
            ? {
                tripNumber: editingTrip.id,
                origin: editingTrip.route.split(" to ")[0] || "",
                destination: editingTrip.route.split(" to ")[1] || "",
                driver: editingTrip.driverName,
                vehicle: editingTrip.fleetNumber,
                startDate: editingTrip.startDate.split("T")[0],
                startTime: "08:00",
                endDate: editingTrip.endDate.split("T")[0],
                endTime: "17:00",
                distance: editingTrip.distanceKm?.toString() || "",
                estimatedCost: editingTrip.baseRevenue.toString(),
                notes: editingTrip.description || "",
                priority: "normal",
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default TripFormModal;
