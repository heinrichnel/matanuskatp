import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useFleetList, FleetOption } from '@/hooks/useFleetList';

interface Fleet {
  fleetNumber: string;
  registration?: string;
  make?: string;
  model?: string;
  status?: string;
}

interface FleetSelectorProps {
  onSelect: (fleet: Fleet) => void;
  selectedFleet?: string;
  className?: string;
  placeholder?: string;
  filterType?: 'Truck' | 'Trailer' | 'Reefer' | string[];
  activeOnly?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

// We're using the centralized fleet data from useFleetList hook instead of mock data

const FleetSelector: React.FC<FleetSelectorProps> = ({
  onSelect,
  selectedFleet = '',
  className = '',
  placeholder = 'Select a fleet...',
  filterType,
  activeOnly = false,
  required = false,
  disabled = false,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Use our central fleet hook
  const { fleetOptions } = useFleetList({ 
    onlyActive: activeOnly,
    filterType,
    includeDetails: true
  });
  
  // Filter fleet data based on search term
  const filteredFleets = searchTerm
    ? fleetOptions.filter(option => {
        const term = searchTerm.toLowerCase();
        return (
          option.value.toLowerCase().includes(term) || 
          option.label.toLowerCase().includes(term) || 
          option.registration.toLowerCase().includes(term)
        );
      })
    : fleetOptions;
  
  // Find selected fleet data
  const selectedFleetData = selectedFleet 
    ? fleetOptions.find(option => option.value === selectedFleet) 
    : null;
  
  // Handle fleet selection
  const handleSelectFleet = (option: FleetOption) => {
    setSearchTerm('');
    setShowDropdown(false);
    
    // Convert from FleetOption to Fleet format
    const fleet: Fleet = {
      fleetNumber: option.value,
      registration: option.registration,
      make: option.details?.manufacturer,
      model: option.details?.model,
      status: option.status
    };
    
    onSelect(fleet);
  };
  
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!showDropdown) setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => {
            // Delay hiding dropdown to allow click to register
            setTimeout(() => setShowDropdown(false), 200);
          }}
        />
      </div>
      
      {/* Show selected fleet data if any */}
      {selectedFleetData && !searchTerm && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">Fleet {selectedFleetData.value}</p>
              <p className="text-sm text-gray-600">
                {selectedFleetData.details?.manufacturer} {selectedFleetData.details?.model}
                {selectedFleetData.registration && ` • ${selectedFleetData.registration}`}
              </p>
            </div>
            <button
              className="text-gray-400 hover:text-gray-500"
              onClick={() => {
                onSelect({ fleetNumber: '' });
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
      
      {/* Dropdown of options */}
      {showDropdown && filteredFleets.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          {filteredFleets.map(fleet => (
            <div
              key={fleet.value}
              className="cursor-pointer hover:bg-gray-100 p-2"
              onMouseDown={() => handleSelectFleet(fleet)}
            >
              <div className="font-medium">{fleet.value}</div>
              <div className="text-sm text-gray-600">
                {fleet.registration && <span>{fleet.registration} • </span>}
                {fleet.details?.manufacturer} {fleet.details?.model}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* No results message */}
      {showDropdown && searchTerm && filteredFleets.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-2 px-3 text-sm text-gray-700">
          No matching fleets found
        </div>
      )}
    </div>
  );
};

export default FleetSelector;