import React from 'react';

interface TyreInventoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  brandFilter: string;
  setBrandFilter: (value: string) => void;
  brands: string[];
  onSearchChange?: (value: string) => void;
  onBrandChange?: (value: string) => void;
  onAddStock?: () => void;
  // Added filters for status, condition, vehicle
  statusFilter?: string;
  onStatusChange?: (value: string) => void;
  statuses?: { label: string; value: string }[];
  conditionFilter?: string;
  onConditionChange?: (value: string) => void;
  conditions?: { label: string; value: string }[];
  vehicleFilter?: string;
  onVehicleChange?: (value: string) => void;
  vehicles?: { label: string; value: string }[];
}

export const TyreInventoryFilters: React.FC<TyreInventoryFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  brandFilter,
  setBrandFilter,
  brands,
  onSearchChange = setSearchTerm,
  onBrandChange = setBrandFilter,
  statusFilter,
  onStatusChange,
  statuses = [],
  conditionFilter,
  onConditionChange,
  conditions = [],
  vehicleFilter,
  onVehicleChange,
  vehicles = [],
}) => {
  return (
    <div className="flex space-x-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        placeholder="Search inventory..."
        className="p-2 border rounded-lg"
      />
      {/* Brand filter */}
      <select
        value={brandFilter}
        onChange={(e) => onBrandChange && onBrandChange(e.target.value)}
        className="p-2 border rounded-lg"
      >
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </select>
      {/* Status filter */}
      {statuses.length > 0 && (
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange && onStatusChange(e.target.value)}
          className="p-2 border rounded-lg"
        >
          {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      )}
      {/* Condition filter */}
      {conditions.length > 0 && (
        <select
          value={conditionFilter}
          onChange={(e) => onConditionChange && onConditionChange(e.target.value)}
          className="p-2 border rounded-lg"
        >
          {conditions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      )}
      {/* Vehicle filter */}
      {vehicles.length > 0 && (
        <select
          value={vehicleFilter}
          onChange={(e) => onVehicleChange && onVehicleChange(e.target.value)}
          className="p-2 border rounded-lg"
        >
          {vehicles.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
        </select>
      )}
    </div>
  );
};

export default TyreInventoryFilters;
