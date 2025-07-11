import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

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
}

// Mock fleet data - in a real app, this would come from Firestore
const mockFleetData: Fleet[] = [
  { fleetNumber: '21H', registration: 'ADS4865', make: 'SCANIA', model: 'G460', status: 'Active' },
  { fleetNumber: '22H', registration: 'ADS4866', make: 'SCANIA', model: 'G460', status: 'Maintenance' },
  { fleetNumber: '23H', registration: 'AFQ1324', make: 'SHACMAN', model: 'X3000', status: 'Active' },
  { fleetNumber: '24H', registration: 'AFQ1325', make: 'SHACMAN', model: 'X3000', status: 'Active' },
  { fleetNumber: '26H', registration: 'AFQ1327', make: 'SHACMAN', model: 'X3000', status: 'Active' },
  { fleetNumber: '28H', registration: 'AFQ1329', make: 'SHACMAN', model: 'X3000', status: 'Active' },
  { fleetNumber: '31H', registration: 'AGZ1963', make: 'SHACMAN', model: 'X3000', status: 'Active' }
];

const FleetSelector: React.FC<FleetSelectorProps> = ({
  onSelect,
  selectedFleet = '',
  className = '',
  placeholder = 'Select a fleet...'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredFleets, setFilteredFleets] = useState<Fleet[]>([]);
  const [selectedFleetData, setSelectedFleetData] = useState<Fleet | null>(null);
  
  // Filter fleet data based on search term
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const filtered = mockFleetData.filter(fleet => 
        fleet.fleetNumber.toLowerCase().includes(term) || 
        (fleet.registration && fleet.registration.toLowerCase().includes(term)) ||
        (fleet.make && fleet.make.toLowerCase().includes(term)) ||
        (fleet.model && fleet.model.toLowerCase().includes(term))
      );
      setFilteredFleets(filtered);
    } else {
      setFilteredFleets(mockFleetData);
    }
  }, [searchTerm]);
  
  // Set selected fleet on initial render if provided
  useEffect(() => {
    if (selectedFleet) {
      const fleetData = mockFleetData.find(fleet => fleet.fleetNumber === selectedFleet);
      if (fleetData) {
        setSelectedFleetData(fleetData);
      }
    }
  }, [selectedFleet]);
  
  // Handle fleet selection
  const handleSelectFleet = (fleet: Fleet) => {
    setSelectedFleetData(fleet);
    setSearchTerm('');
    setShowDropdown(false);
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
              <p className="font-medium text-gray-900">Fleet {selectedFleetData.fleetNumber}</p>
              <p className="text-sm text-gray-600">
                {selectedFleetData.make} {selectedFleetData.model}
                {selectedFleetData.registration && ` • ${selectedFleetData.registration}`}
              </p>
            </div>
            <button
              className="text-gray-400 hover:text-gray-500"
              onClick={() => {
                setSelectedFleetData(null);
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
              key={fleet.fleetNumber}
              className="cursor-pointer hover:bg-gray-100 p-2"
              onMouseDown={() => handleSelectFleet(fleet)}
            >
              <div className="font-medium">{fleet.fleetNumber}</div>
              <div className="text-sm text-gray-600">
                {fleet.registration && <span>{fleet.registration} • </span>}
                {fleet.make} {fleet.model}
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