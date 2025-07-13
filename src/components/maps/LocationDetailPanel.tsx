import React from 'react';
import { Location } from '@/types/mapTypes';

interface LocationDetailPanelProps {
  location: Location | null;
  onClose?: () => void;
  onViewDirections?: (location: Location) => void;
  onShareLocation?: (location: Location) => void;
  className?: string;
}

/**
 * LocationDetailPanel - A component to display detailed information about a selected location
 * 
 * Features:
 * - Shows detailed information about a selected map location
 * - Displays address, coordinates, and custom fields
 * - Provides action buttons (directions, share)
 * - Responsive design with custom styling options
 */
const LocationDetailPanel: React.FC<LocationDetailPanelProps> = ({
  location,
  onClose,
  onViewDirections,
  onShareLocation,
  className = ''
}) => {
  if (!location) return null;
  
  return (
    <div className={`bg-white rounded-md shadow-lg p-4 max-w-md ${className}`}>
      {/* Header with title and close button */}
      <div className="flex justify-between items-center mb-3 border-b pb-2">
        <h3 className="font-medium text-lg text-gray-800">
          {location.title || 'Location Details'}
        </h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Location information */}
      <div className="space-y-3 mb-4">
        {/* Basic info */}
        <div>
          {location.address && (
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-base text-gray-800">{location.address}</p>
            </div>
          )}
          
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-500">Coordinates</p>
            <p className="text-base text-gray-800">
              {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          </div>
        </div>
        
        {/* Additional info */}
        {location.info && (
          <div>
            <p className="text-sm font-medium text-gray-500">Information</p>
            <p className="text-base text-gray-800">{location.info}</p>
          </div>
        )}
        
        {/* Custom fields - dynamically rendered */}
        {location.customFields && Object.entries(location.customFields).map(([key, value]) => (
          <div key={key}>
            <p className="text-sm font-medium text-gray-500">{key}</p>
            <p className="text-base text-gray-800">{String(value)}</p>
          </div>
        ))}
      </div>
      
      {/* Action buttons */}
      <div className="flex space-x-2 pt-2 border-t">
        {onViewDirections && (
          <button
            onClick={() => onViewDirections(location)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Directions
          </button>
        )}
        
        {onShareLocation && (
          <button
            onClick={() => onShareLocation(location)}
            className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors focus:ring-2 focus:ring-gray-400 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share
          </button>
        )}
      </div>
    </div>
  );
};

export default LocationDetailPanel;
