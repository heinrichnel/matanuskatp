
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/FormElements";
import { FileText, Download, BarChart3 } from "lucide-react";

interface TyreReportGeneratorProps {
  onGenerateReport: (type: string, dateRange: string, brand: string) => void;
}

export const TyreReportGenerator: React.FC<TyreReportGeneratorProps> = ({ onGenerateReport }) => {
  const [reportType, setReportType] = React.useState('');
  const [dateRange, setDateRange] = React.useState('30');
  const [selectedBrand, setSelectedBrand] = React.useState('');

  const reportTypes = [
    { label: 'Select report type...', value: '' },
    { label: 'Tyre Performance Summary', value: 'performance' },
    { label: 'Brand Comparison', value: 'brand_comparison' },
    { label: 'Position-wise Analysis', value: 'position_analysis' },
    { label: 'Cost Analysis', value: 'cost_analysis' },
    { label: 'Maintenance Schedule', value: 'maintenance' },
    { label: 'Inventory Status', value: 'inventory' }
  ];

  const dateRanges = [
    { label: 'Last 30 days', value: '30' },
    { label: 'Last 90 days', value: '90' },
    { label: 'Last 6 months', value: '180' },
    { label: 'Last year', value: '365' }
  ];

  const handleGenerate = () => {
    onGenerateReport(reportType, dateRange, selectedBrand);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Generate Report</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Report Type"
            value={reportType}
            onChange={setReportType}
            options={reportTypes}
          />
          <Select
            label="Date Range"
            value={dateRange}
            onChange={setDateRange}
            options={dateRanges}
          />
          <Select
            label="Brand Filter"
            value={selectedBrand}
            onChange={setSelectedBrand}
            options={[
              { label: 'All Brands', value: '' }
            ]}
          />
          <div className="flex items-end">
            <Button 
              onClick={handleGenerate}
              disabled={!reportType}
              className="w-full"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
