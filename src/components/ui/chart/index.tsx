import {
  ArcElement,
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  type: "bar" | "line" | "doughnut";
  data: ChartData<any>;
  options?: ChartOptions<any>;
  className?: string;
  height?: number;
  width?: number;
}

export function Chart({ type, data, options, className = "", height, width }: ChartProps) {
  const renderChart = () => {
    switch (type) {
      case "bar":
        return <Bar data={data} options={options} height={height} width={width} />;
      case "line":
        return <Line data={data} options={options} height={height} width={width} />;
      case "doughnut":
        return <Doughnut data={data} options={options} height={height} width={width} />;
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return <div className={className}>{renderChart()}</div>;
}
