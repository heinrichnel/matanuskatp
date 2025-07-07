import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Wrench, FileText, Clipboard, AlertTriangle, Info, Truck, Flag as FlagIcon } from 'lucide-react';
import ActionLog from '../components/actionlog/ActionLog';
import TyreManagement from '../components/workshop/TyreManagement';
import InspectionManagement from '../components/workshop/InspectionManagement';

import { useSearchParams, useNavigate } from 'react-router-dom';

const WorkshopPage = () => {
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
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="inspections" className="flex items-center gap-2">
            <Clipboard className="w-4 h-4" />
            <span>Inspections</span>
          </TabsTrigger>
          <TabsTrigger value="jobcards" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Job Cards</span>
          </TabsTrigger>
          <TabsTrigger value="faults" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Fault List</span>
          </TabsTrigger>
          <TabsTrigger value="tires" className="flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>Tyre Management</span>
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex items-center gap-2">
            <FlagIcon className="w-4 h-4" />
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
        
        <TabsContent value="inspections" className="mt-6">
          <InspectionManagement />
        </TabsContent>
        
        <TabsContent value="fleet" className="mt-6">
          <FleetTable />
        </TabsContent>
        
        <TabsContent value="tires" className="mt-6">
          <TyreManagement />
        </TabsContent>

        <TabsContent value="actions" className="mt-6">
          <ActionLog />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkshopPage;