import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'; // Fixed casing
import TyreReportGenerator from './tyre/TyreReportGenerator'; // Updated to default import
import { TyreCostAnalysis } from './TyreCostAnalysis';

export const TyreReports: React.FC = () => {
  const handleGenerateReport = (type: string, dateRange: string, brand: string) => {
    console.log('Generating report:', { type, dateRange, brand });
    alert(`Generating ${type} report for ${dateRange} days`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Tyre Reports & Analytics</h3>
        <p className="text-gray-600">Generate comprehensive tyre performance and cost reports</p>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports">Standard Reports</TabsTrigger>
          <TabsTrigger value="cost-analysis">Cost per KM Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="space-y-6">
          <TyreReportGenerator onGenerateReport={handleGenerateReport} />
        </TabsContent>
        
        <TabsContent value="cost-analysis">
          <TyreCostAnalysis />
        </TabsContent>
      </Tabs>
    </div>
  );
};