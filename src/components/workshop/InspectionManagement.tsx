import React, { useState } from 'react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Clipboard, ClipboardCheck, FileText, Plus, Search, RefreshCw } from 'lucide-react';
import InspectionList from './InspectionList';

const InspectionManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inspection Management</h2>
          <p className="text-gray-600">Create, track and manage vehicle inspections</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
          <Button
            icon={<Plus className="w-4 h-4" />}
          >
            New Inspection
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Clipboard className="w-4 h-4" />
            <span>Active Inspections</span>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" />
            <span>Completed Inspections</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Inspection Templates</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <InspectionList status="active" />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <InspectionList status="completed" />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader title="Inspection Templates" />
            <CardContent>
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No templates available yet</h3>
                <p className="mt-1 text-sm text-gray-500">Templates will be displayed here</p>
                <div className="mt-6">
                  <Button
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Create Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InspectionManagement;