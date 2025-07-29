import React, { useState } from "react";

// Define interface for trip form data (matching the one in TripRouter.tsx)
interface TripFormData {
  origin: string;
  destination: string;
  date: string;
  driver: string;
  vehicle: string;
  [key: string]: any; // Allow for additional fields
}

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  onCancel: () => void;
  initialData?: Partial<TripFormData>;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState<TripFormData>({
    origin: initialData.origin || "",
    destination: initialData.destination || "",
    date: initialData.date || new Date().toISOString().split("T")[0],
    driver: initialData.driver || "",
    vehicle: initialData.vehicle || "",
    notes: initialData.notes || "",
    cargo: initialData.cargo || "",
    estimatedDistance: initialData.estimatedDistance || "",
    estimatedDuration: initialData.estimatedDuration || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TripFormData, string>>>({});

  // Mock data for dropdowns
  const drivers = [
    { id: "driver1", name: "John Doe" },
    { id: "driver2", name: "Jane Smith" },
    { id: "driver3", name: "Michael Johnson" },
    { id: "driver4", name: "Sarah Williams" },
  ];

  const vehicles = [
    { id: "vehicle1", name: "MAT001 - Volvo FH16" },
    { id: "vehicle2", name: "MAT002 - Scania R500" },
    { id: "vehicle3", name: "MAT003 - Mercedes Actros" },
    { id: "vehicle4", name: "MAT004 - MAN TGX" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name as keyof TripFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TripFormData, string>> = {};

    if (!formData.origin.trim()) {
      newErrors.origin = "Origin is required";
    }

    if (!formData.destination.trim()) {
      newErrors.destination = "Destination is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.driver) {
      newErrors.driver = "Driver is required";
    }

    if (!formData.vehicle) {
      newErrors.vehicle = "Vehicle is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Origin */}
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
              Origin *
            </label>
            <input
              type="text"
              id="origin"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.origin ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Enter origin location"
            />
            {errors.origin && <p className="mt-1 text-sm text-red-500">{errors.origin}</p>}
          </div>

          {/* Destination */}
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              Destination *
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.destination ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Enter destination location"
            />
            {errors.destination && <p className="mt-1 text-sm text-red-500">{errors.destination}</p>}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.date ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
          </div>

          {/* Driver */}
          <div>
            <label htmlFor="driver" className="block text-sm font-medium text-gray-700 mb-1">
              Driver *
            </label>
            <select
              id="driver"
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.driver ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <option value="">Select a driver</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
            {errors.driver && <p className="mt-1 text-sm text-red-500">{errors.driver}</p>}
          </div>

          {/* Vehicle */}
          <div>
            <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle *
            </label>
            <select
              id="vehicle"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.vehicle ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name}
                </option>
              ))}
            </select>
            {errors.vehicle && <p className="mt-1 text-sm text-red-500">{errors.vehicle}</p>}
          </div>

          {/* Cargo */}
          <div>
            <label htmlFor="cargo" className="block text-sm font-medium text-gray-700 mb-1">
              Cargo
            </label>
            <input
              type="text"
              id="cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter cargo details"
            />
          </div>

          {/* Estimated Distance */}
          <div>
            <label htmlFor="estimatedDistance" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Distance (km)
            </label>
            <input
              type="number"
              id="estimatedDistance"
              name="estimatedDistance"
              value={formData.estimatedDistance}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter estimated distance"
              min="0"
            />
          </div>

          {/* Estimated Duration */}
          <div>
            <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Duration (hours)
            </label>
            <input
              type="number"
              id="estimatedDuration"
              name="estimatedDuration"
              value={formData.estimatedDuration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter estimated duration"
              min="0"
              step="0.5"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter any additional notes"
          ></textarea>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default TripForm;
