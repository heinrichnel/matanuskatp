import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ChartFilterProps {
  filters: Array<{
    id: string;
    label: string;
    color?: string;
  }>;
  selectedFilters: string[];
  onChange: (selected: string[]) => void;
}

export /**
 * ChartFilters
 *
 * A ChartFilters component
 *
 * @example
 * ```tsx
 * <ChartFilters />
 * ```
 *
 * @param props - Component props
 * @returns React component
 */
function ChartFilters({ filters, selectedFilters, onChange }: ChartFilterProps) {
  const handleFilterChange = (id: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedFilters, id]);
    } else {
      onChange(selectedFilters.filter((f) => f !== id));
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {filters.map((filter) => (
        <div key={filter.id} className="flex items-center gap-2">
          <Checkbox
            id={`filter-${filter.id}`}
            checked={selectedFilters.includes(filter.id)}
            onCheckedChange={(checked) => handleFilterChange(filter.id, checked as boolean)}
          />
          <Label htmlFor={`filter-${filter.id}`} className="flex items-center gap-1.5">
            {filter.color && (
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: filter.color }}
              />
            )}
            {filter.label}
          </Label>
        </div>
      ))}
    </div>
  );
}

export default ChartFilters;
