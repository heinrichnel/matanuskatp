import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useFleetAnalytics } from "@/context/FleetAnalyticsContext";

const dataPoints = [
  { id: "fuelConsumption", label: "Fuel Consumption", color: "#8884d8" },
  { id: "maintenance", label: "Maintenance", color: "#82ca9d" },
  { id: "utilization", label: "Utilization", color: "#ffc658" },
  { id: "emissions", label: "Emissions", color: "#ff8042" },
  { id: "roi", label: "ROI", color: "#0088fe" },
];

export function AnalyticsControls() {
  const { activeFilters, updateFilters } = useFleetAnalytics();

  const handleFilterChange = (id: string, checked: boolean) => {
    if (checked) {
      updateFilters([...activeFilters, id]);
    } else {
      updateFilters(activeFilters.filter((filter) => filter !== id));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 mb-4">
            {dataPoints.map((filter) => (
              <div key={filter.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`filter-${filter.id}`}
                  checked={activeFilters.includes(filter.id)}
                  onCheckedChange={(checked) => handleFilterChange(filter.id, !!checked)}
                />
                <label
                  htmlFor={`filter-${filter.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1.5"
                >
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: filter.color }}
                  ></span>
                  {filter.label}
                </label>
              </div>
            ))}
          </div>

          {/* Can expand this section with date range pickers and other controls */}
        </div>
      </CardContent>
    </Card>
  );
}

export default AnalyticsControls;
