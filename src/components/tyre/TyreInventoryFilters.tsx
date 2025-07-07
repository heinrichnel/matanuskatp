import React from 'react';

interface TyreInventoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  brandFilter: string;
  setBrandFilter: (value: string) => void;
  brands: string[];
  onSearchChange?: (value: string) => void; // Added optional onSearchChange prop
  onBrandChange?: (value: string) => void; // Added optional onBrandChange prop
  onAddStock?: () => void; // Added optional onAddStock prop
}

export const TyreInventoryFilters: React.FC<TyreInventoryFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  brandFilter,
  setBrandFilter,
  brands,
  onSearchChange = setSearchTerm, // Default to setSearchTerm if onSearchChange is not provided
  onBrandChange = setBrandFilter, // Default to setBrandFilter if onBrandChange is not provided
}) => {
  return (
    <div className="flex space-x-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search inventory..."
        className="p-2 border rounded-lg"
      />
      <select
        value={brandFilter}
        onChange={(e) => onBrandChange(e.target.value)}
        className="p-2 border rounded-lg"
      >
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </select>
    </div>
  );
};

export default TyreInventoryFilters;
