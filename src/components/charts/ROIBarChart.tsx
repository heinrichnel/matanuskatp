import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "ROI %",
      data: [75, 62, 85, 78, 91, 88, 94],
      backgroundColor: "#2563eb",
    },
  ],
};

export function ROIBarChart() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
        }}
      />
    </div>
  );
}

export default ROIBarChart;
