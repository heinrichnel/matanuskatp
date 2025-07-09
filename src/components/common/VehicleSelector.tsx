// Placeholder for VehicleSelector component
export const VehicleSelector = ({
  value,
  onChange,
  label,
  placeholder,
  activeOnly,
  showDetails,
}: {
  value: string;
  onChange: (vehicleId: string) => void;
  label: string;
  placeholder: string;
  activeOnly: boolean;
  showDetails: boolean;
}) => (
  <div>
    <label>{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
    {activeOnly && <p>Active vehicles only</p>}
    {showDetails && <p>Show vehicle details</p>}
  </div>
);
