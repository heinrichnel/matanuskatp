import { FleetAnalyticsDashboard } from "./components/dashboard/FleetAnalyticsDashboard";
import { FleetAnalyticsProvider } from "./context/FleetAnalyticsContext";

function FleetAnalyticsApp() {
  return (
    <FleetAnalyticsProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-700 text-white py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">Fleet Management System</h1>
          </div>
        </header>

        <main className="container mx-auto py-6 px-4">
          <FleetAnalyticsDashboard />
        </main>

        <footer className="bg-gray-200 py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-600">
            Fleet Analytics Dashboard &copy; 2025
          </div>
        </footer>
      </div>
    </FleetAnalyticsProvider>
  );
}

export default FleetAnalyticsApp;
