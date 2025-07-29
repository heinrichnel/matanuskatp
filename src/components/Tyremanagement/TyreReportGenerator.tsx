import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/FormElements';
import { FileText, Download } from 'lucide-react';

interface TyreReportGeneratorProps {
  onGenerateReport: (type: string, dateRange: string, brand: string) => void;
}

interface ReportOptions {
  reportType: string;
  dateRange: string;
  format: string;
  includeScrapped: boolean;
}

const reportTypes = [
  { value: 'inventory', label: 'Inventory Report' },
  { value: 'wear', label: 'Wear Analysis Report' },
  { value: 'cost', label: 'Cost Analysis Report' },
  { value: 'maintenance', label: 'Maintenance History Report' },
  { value: 'performance', label: 'Performance Comparison Report' },
];

const dateRanges = [
  { value: 'last30', label: 'Last 30 Days' },
  { value: 'last90', label: 'Last 90 Days' },
  { value: 'last180', label: 'Last 180 Days' },
  { value: 'lastYear', label: 'Last Year' },
  { value: 'allTime', label: 'All Time' },
];

const reportFormats = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'excel', label: 'Excel Spreadsheet' },
  { value: 'csv', label: 'CSV File' },
];

export const TyreReportGenerator: React.FC<TyreReportGeneratorProps> = ({ onGenerateReport }) => {
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    reportType: 'inventory',
    dateRange: 'last30',
    format: 'pdf',
    includeScrapped: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOptionChange = (option: keyof ReportOptions, value: string | boolean) => {
    setReportOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);

    // Call the provided callback function
    onGenerateReport(
      reportOptions.reportType,
      reportOptions.dateRange,
      'All Brands' // In a real implementation, this would be a selected brand
    );

    // Simulate report generation with timeout
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Generate Tyre Reports</CardTitle>
          <FileText className="h-5 w-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Select
            label="Report Type"
            value={reportOptions.reportType}
            onChange={(e) => handleOptionChange('reportType', e.target.value)}
            className="w-full"
            options={reportTypes}
            name="reportType"
          />
        </div>

        <div>
          <Select
            label="Date Range"
            value={reportOptions.dateRange}
            onChange={(e) => handleOptionChange('dateRange', e.target.value)}
            className="w-full"
            options={dateRanges}
            name="dateRange"
          />
        </div>

        <div>
          <Select
            label="Format"
            value={reportOptions.format}
            onChange={(e) => handleOptionChange('format', e.target.value)}
            className="w-full"
            options={reportFormats}
            name="format"
          />
        </div>

        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="includeScrapped"
            checked={reportOptions.includeScrapped}
            onChange={(e) => handleOptionChange('includeScrapped', e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="includeScrapped" className="text-sm text-gray-700">
            Include scrapped tyres
          </label>
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => alert('Preview not available in this version')}
            disabled={isGenerating}
          >
            <FileText className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TyreReportGenerator;
