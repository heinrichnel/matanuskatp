import React from 'react';
import { Location } from '../../types/mapTypes';

interface LocationDetailPanelProps {
  location: Location | null;
  onClose: () => void;
  isVisible: boolean;
}

const LocationDetailPanel: React.FC<LocationDetailPanelProps> = ({
  location,
  onClose,
  isVisible
}) => {
  if (!isVisible || !location) {
    return null;
  }

  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-10">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{location.name}</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>
      
      {location.description && (
        <p className="text-gray-600 mb-2">{location.description}</p>
      )}
      
      <div className="space-y-1 text-sm text-gray-500">
        <div>Lat: {location.lat.toFixed(6)}</div>
        <div>Lng: {location.lng.toFixed(6)}</div>
        
        {location.address && (
          <div className="mt-2">
            <span className="font-medium">Address:</span> {location.address}
          </div>
        )}
        
        {location.type && (
          <div>
            <span className="font-medium">Type:</span> {location.type}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDetailPanel;
