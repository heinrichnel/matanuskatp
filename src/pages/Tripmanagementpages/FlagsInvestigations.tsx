import React from "react";
import { useAppContext } from "../../context/AppContext";
import Card, { CardContent, CardHeader } from "../../components/ui/Card";
import { Flag, AlertTriangle, Search, Filter } from "lucide-react";

const FlagsInvestigations: React.FC = () => {
  const { isLoading } = useAppContext();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Flags & Investigations</h1>
        <div className="text-sm text-gray-500">Monitor and investigate trip anomalies</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Active Flags</h3>
              <Flag className="w-5 h-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500 mt-1">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Investigations</h3>
              <Search className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500 mt-1">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">Critical Issues</h3>
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500 mt-1">High priority</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Investigation Dashboard</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Flag className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No active investigations</p>
            <p className="text-sm mt-2">Flagged trips and investigations will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlagsInvestigations;
