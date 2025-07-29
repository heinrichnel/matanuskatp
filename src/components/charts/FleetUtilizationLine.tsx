import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Utilization %",
      data: [80, 81, 83, 84, 87, 86, 88],
      fill: false,
      borderColor: "#2563eb",
      backgroundColor: "#2563eb",
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 7,
    },
  ],
};

export function FleetUtilizationLine() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Line
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: {
              display: true,
              text: 'Fleet Utilization Trend',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            },
          },
        }}
      />
    </div>
  );
}

export default FleetUtilizationLine;
