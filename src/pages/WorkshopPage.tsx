import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Wrench, FileText, Info } from 'lucide-react';
import ActionLog from '../components/actionlog/ActionLog';
import { useSearchParams, useNavigate } from 'react-router-dom';

const WorkshopPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const defaultTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams(value === 'dashboard' ? {} : { tab: value });
  };

  // Update tab state when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab') || 'dashboard';
    setActiveTab(tab);
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Workshop Operations</h1>
          <p className="text-gray-600">Manage workshop activities, job cards, and maintenance</p>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            <span>Workshop Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="tires" className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Tire Management</span>
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Action Log</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Workshop Dashboard</h2>
            <p className="text-gray-600">Workshop dashboard content will be displayed here.</p>
            {/* This would be replaced with a proper Workshop Dashboard component */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-2 text-blue-700">Open Job Cards</h3>
                <p className="text-3xl font-bold text-blue-800">8</p>
                <p className="text-sm text-blue-600 mt-1">2 high priority</p>
              </div>
              <div className="bg-green-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-2 text-green-700">Completed Today</h3>
                <p className="text-3xl font-bold text-green-800">5</p>
                <p className="text-sm text-green-600 mt-1">3 pending approval</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-2 text-amber-700">Parts on Order</h3>
                <p className="text-3xl font-bold text-amber-800">12</p>
                <p className="text-sm text-amber-600 mt-1">4 awaiting delivery</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tires" className="mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Tire Management</h2>
            <p className="text-gray-600">Tire management dashboard will be displayed here.</p>
            {/* This would be replaced with a proper Tire Management component */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-blue-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-2 text-blue-700">Total Tires</h3>
                <p className="text-3xl font-bold text-blue-800">247</p>
                <p className="text-sm text-blue-600 mt-1">185 in service</p>
              </div>
              <div className="bg-red-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-2 text-red-700">Due for Replacement</h3>
                <p className="text-3xl font-bold text-red-800">18</p>
                <p className="text-sm text-red-600 mt-1">8 critical</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-2 text-amber-700">Pending Inspection</h3>
                <p className="text-3xl font-bold text-amber-800">24</p>
                <p className="text-sm text-amber-600 mt-1">Next: 15 July</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="mt-6">
          <ActionLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkshopPage;