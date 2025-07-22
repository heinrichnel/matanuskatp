import React from 'react';
import { Location } from '../../types/mapTypes';

interface LocationDetailPanelProps {
  selectedLocation: Location;
  onClose: () => void;
  onViewDirections: (location: Location) => void;
}

/**
 * LocationDetailPanel - A component to display detailed information about a selected location
 * 
 * Features:
 * - Shows detailed info about a location
 * - Provides options to view directions, close the panel, etc.
 * - Customizable styling
 */
const LocationDetailPanel: React.FC<LocationDetailPanelProps> = ({
  selectedLocation,
  onClose,
  onViewDirections
}) => {
  if (!selectedLocation) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-800">{selectedLocation.title || 'Location Details'}</h3>
        <button 
          onClick={onClick})}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        {selectedLocation.info && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Information</h4>
            <p className="text-gray-800">{selectedLocation.info}</p>
          </div>
        )}
        
        {selectedLocation.address && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
            <p className="text-gray-800">{selectedLocation.address}</p>
          </div>
        )}
        
        {selectedLocation.customFields?.phone && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
            <p className="text-gray-800">
              <a href={`tel:${selectedLocation.customFields.phone}`} className="text-blue-600 hover:underline">
                {selectedLocation.customFields.phone}
              </a>
            </p>
          </div>
        )}
        
        {selectedLocation.customFields?.website && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
            <p className="text-gray-800">
              <a 
                href={selectedLocation.customFields.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {selectedLocation.customFields.website}
              </a>
            </p>
          </div>
        )}
        
        <div className="mt-4 flex gap-2">
          <button
            onClick={onClick}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailPanel;
