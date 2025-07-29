# Fleet Analytics Dashboard

## Overview
This component provides a comprehensive dashboard for fleet analytics, featuring real-time data visualization through various chart types:

- Fleet Status Doughnut Chart - Shows operational vs. maintenance vehicle counts
- Monthly ROI Bar Chart - Displays return on investment metrics by month
- Fleet Utilization Line Chart - Tracks fleet utilization percentages over time
- Fleet Performance Metrics - Multi-line chart showing fuel efficiency and maintenance costs
- Cost Analysis Area Chart - Visualizes operational and maintenance costs over time

## Architecture

The dashboard follows a clean architecture pattern:

1. **API Layer** (`/src/api/fleetAnalyticsApi.ts`)
   - Simulates API calls to fetch various types of fleet data
   - Implements filtering by date range and data categories
   - Handles loading states and error handling

2. **Context Provider** (`/src/context/FleetAnalyticsContext.tsx`)
   - Centralized state management using React Context API
   - Manages data fetching, loading states, and error handling
   - Provides filter and date range selection functionality

3. **Chart Components** (`/src/components/charts/`)
   - Modular, reusable chart components
   - Each chart connects to the context for data and loading states
   - Implements proper error handling and loading indicators

4. **Dashboard Component** (`/src/components/dashboard/FleetAnalyticsDashboard.tsx`)
   - Organizes and arranges chart components
   - Provides filter controls and date range selectors
   - Responsive layout adapting to different screen sizes

## Features

- **Real-time Data Updates**: Refresh data with a single click
- **Filtering**: Toggle visibility of different metrics (fuel consumption, maintenance, utilization, ROI)
- **Date Range Selection**: Filter data by specific time periods
- **Loading States**: Visual indicators when data is being fetched
- **Error Handling**: Graceful error handling with user feedback
- **Responsive Design**: Adapts to different screen sizes

## How to Run

To run the Fleet Analytics Dashboard:

```bash
# Make sure the script is executable
chmod +x run-fleet-analytics.sh

# Run the dashboard
./run-fleet-analytics.sh
```

This will start a development server with the Fleet Analytics Dashboard as the main application.

## Implementation Details

- Uses Chart.js with react-chartjs-2 for the doughnut and bar charts
- Uses Recharts for the line and area charts
- Implements React Context API for state management
- Simulates API calls with configurable delay for realistic testing
- Utilizes TypeScript for type safety and better developer experience
