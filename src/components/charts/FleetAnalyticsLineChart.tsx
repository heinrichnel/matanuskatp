import React from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  TooltipProps
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Example data for the chart
const chartData = [
  { date: '2025-01', fuel: 45, maintenance: 32, roi: 8.2 },
  { date: '2025-02', fuel: 52, maintenance: 28, roi: 7.8 },
  { date: '2025-03', fuel: 48, maintenance: 35, roi: 8.5 },
  { date: '2025-04', fuel: 61, maintenance: 42, roi: 7.2 },
  { date: '2025-05', fuel: 55, maintenance: 29, roi: 8.9 },
  { date: '2025-06', fuel: 67, maintenance: 37, roi: 9.2 },
  { date: '2025-07', fuel: 60, maintenance: 32, roi: 9.5 },
];

// Define chart configuration
const chartConfig = {
  fuel: {
    label: 'Fuel Cost (K)',
    color: '#8884d8',
  },
  maintenance: {
    label: 'Maintenance Cost (K)',
    color: '#82ca9d',
  },
  roi: {
    label: 'ROI %',
    color: '#ff7300',
  },
};

export type ChartType = keyof typeof chartConfig;

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-md">
        <p className="font-semibold">{new Date(label).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric'
        })}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {chartConfig[entry.dataKey as ChartType].label}: {entry.dataKey === 'roi' ? `${entry.value}%` : `$${entry.value}K`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function FleetAnalyticsLineChart() {
  const [activeCharts, setActiveCharts] = React.useState<ChartType[]>(['fuel', 'maintenance']);

  const toggleChart = (chart: ChartType) => {
    if (activeCharts.includes(chart)) {
      setActiveCharts(activeCharts.filter(c => c !== chart));
    } else {
      setActiveCharts([...activeCharts, chart]);
    }
  };

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Fleet Cost Analytics</CardTitle>
          <CardDescription>
            Cost metrics and ROI over the last 6 months
          </CardDescription>
        </div>
        <div className="flex">
          {(Object.keys(chartConfig) as ChartType[]).map((key) => (
            <button
              key={key}
              data-active={activeCharts.includes(key)}
              className="data-[active=true]:bg-blue-50 flex flex-1 flex-col justify-center gap-1 border-t px-4 py-3 text-left even:border-l sm:border-t-0 sm:border-l sm:px-6 sm:py-4"
              onClick={() => toggleChart(key)}
            >
              <span className="text-gray-500 text-xs">
                {chartConfig[key].label}
              </span>
              <span 
                className="text-lg leading-none font-bold sm:text-xl"
                style={{ color: chartConfig[key].color }}
              >
                {key === 'roi' ? `${chartData[chartData.length - 1][key]}%` : `$${chartData[chartData.length - 1][key]}K`}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <div className="aspect-auto h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                  });
                }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {activeCharts.includes('fuel') && (
                <Line
                  type="monotone"
                  dataKey="fuel"
                  stroke={chartConfig.fuel.color}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              )}
              {activeCharts.includes('maintenance') && (
                <Line
                  type="monotone"
                  dataKey="maintenance"
                  stroke={chartConfig.maintenance.color}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              )}
              {activeCharts.includes('roi') && (
                <Line
                  type="monotone"
                  dataKey="roi"
                  stroke={chartConfig.roi.color}
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default FleetAnalyticsLineChart;
