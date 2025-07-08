import React from 'react';
import { Tyre } from '../../types';

interface VehicleTyreViewProps {
  selectedVehicle: string;
  onTyreSelect: (tyre: Tyre | null) => void;
}

const VehicleTyreView: React.FC<VehicleTyreViewProps> = ({ selectedVehicle, onTyreSelect }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h4 className="text-lg font-bold">Vehicle Tyre View</h4>
      <p>Selected Vehicle: {selectedVehicle || 'None'}</p>
      <button
        onClick={() => onTyreSelect(null)}
        className="mt-2 p-2 bg-blue-500 text-white rounded"
      >
        Select Vehicle
      </button>
    </div>
  );
};

export default VehicleTyreView;
