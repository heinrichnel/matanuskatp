import React from 'react';

interface VehicleTyreViewProps {
  selectedVehicle: string;
  onVehicleSelect: (vehicle: string) => void;
}

const VehicleTyreView: React.FC<VehicleTyreViewProps> = ({ selectedVehicle, onVehicleSelect }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h4 className="text-lg font-bold">Vehicle Tyre View</h4>
      <p>Selected Vehicle: {selectedVehicle || 'None'}</p>
      <button
        onClick={() => onVehicleSelect('Vehicle-123')}
        className="mt-2 p-2 bg-blue-500 text-white rounded"
      >
        Select Vehicle
      </button>
    </div>
  );
};

export default VehicleTyreView;
