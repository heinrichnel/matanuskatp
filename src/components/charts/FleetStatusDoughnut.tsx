import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ["Operational", "Under Maintenance"],
  datasets: [
    {
      label: "Vehicles",
      data: [42, 3],
      backgroundColor: ["#2563eb", "#ef4444"],
      borderWidth: 1,
    },
  ],
};

export function FleetStatusDoughnut() {
  return (
    <div className="w-full max-w-xs mx-auto">
      <Doughnut
        data={data}
        options={{
          plugins: {
            legend: {
              display: true,
              position: "bottom" as const,
            },
          },
        }}
      />
      <div className="text-center mt-2 text-lg font-semibold">93% Operational</div>
      <div className="text-xs text-gray-500">42 vehicles, 3 under maintenance</div>
    </div>
  );
}

export default FleetStatusDoughnut;
