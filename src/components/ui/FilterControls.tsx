import React from "react";
import { Filter, Calendar } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter 
} from "./Card";

export interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}

interface FilterControlsProps {
  title?: string;
  subtitle?: string;
  filterOptions: FilterOption[];
  dateRange?: DateRange;
  onFilterChange: (filterId: string) => void;
  onDateRangeChange?: (start: Date, end: Date) => void;
  onApply?: () => void;
  onClose?: () => void;
  className?: string;
}

/**
 * FilterControls
 * 
 * A reusable component for filter controls that can be used across the application
 * for consistent UI and behavior.
 */
export function FilterControls({
  title = "Filters",
  subtitle = "Refine your view",
  filterOptions,
  dateRange,
  onFilterChange,
  onDateRangeChange,
  onApply,
  onClose,
  className = "",
}: FilterControlsProps) {
  return (
    <Card className={`border border-gray-200 ${className}`}>
      <CardHeader heading={title} subtitle={subtitle}>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close filters"
          >
            ×
          </button>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filterOptions.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase">Metrics</h3>
              <div className="space-y-2">
                {filterOptions.map(option => (
                  <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={option.checked}
                      onChange={() => onFilterChange(option.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          {dateRange && onDateRangeChange && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Date Range</h3>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-500" />
                  <select
                    className="border rounded-md p-2"
                    value={dateRange.start.getMonth()}
                    onChange={(e) => {
                      const newStart = new Date(dateRange.start);
                      newStart.setMonth(parseInt(e.target.value));
                      onDateRangeChange(newStart, dateRange.end);
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {new Date(2025, i, 1).toLocaleString("default", { month: "long" })}
                      </option>
                    ))}
                  </select>
                </div>
                
                <span className="text-gray-500">to</span>
                
                <select
                  className="border rounded-md p-2"
                  value={dateRange.end.getMonth()}
                  onChange={(e) => {
                    const newEnd = new Date(dateRange.end);
                    newEnd.setMonth(parseInt(e.target.value));
                    onDateRangeChange(dateRange.start, newEnd);
                  }}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(2025, i, 1).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      {onApply && (
        <CardFooter className="justify-end">
          {onClose && (
            <button 
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
          )}
          <button 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            onClick={onApply}
          >
            Apply Filters
          </button>
        </CardFooter>
      )}
    </Card>
  );
}

/**
 * FilterButton
 * 
 * A button component for toggling filter visibility
 */
export function FilterButton({ 
  isExpanded, 
  onClick, 
  className = "" 
}: {
  isExpanded: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
      aria-expanded={isExpanded}
    >
      <Filter size={16} />
      <span>Filters</span>
    </button>
  );
}

export default FilterControls;
