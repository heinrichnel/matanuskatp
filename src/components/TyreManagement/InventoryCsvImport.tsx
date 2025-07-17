import React, { useState } from 'react';

// Define TypeScript interfaces for our state
interface ImportResult {
  success: boolean;
  message: string;
  importResult?: {
    message: string;
    recordsProcessed?: number;
  };
  recordCount?: number;
  sampleRecords?: Record<string, any>[];
}

// CSV Import component for inventory
const InventoryCsvImport = () => {
  const [csvData, setCsvData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sampleData, setSampleData] = useState<Record<string, any>[] | null>(null);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setCsvData(result);
      }
    };
    reader.readAsText(file);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!csvData.trim()) {
      setError('Please upload a CSV file or enter CSV data');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setSampleData(null);

    try {
      const response = await fetch('/api/inventory/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csvData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to import CSV data');
      }

      setResult(data);
      if (data.sampleRecords) {
        setSampleData(data.sampleRecords);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during import';
      setError(errorMessage);
      console.error('Import error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle paste from clipboard
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedData = e.clipboardData.getData('text');
    if (pastedData) {
      setCsvData(pastedData);
    }
  };

  // Generate sample CSV data
  const generateSampleCsv = () => {
    const sampleCsv = `SCRAPPED TYRES,"XA12083P215","RETREAD XA12083P215","KL303","4.0000","Scrapped/Sold","Trailer","315/80R22.5","XA12083P215","RETREAD","","","0.0000","HOLDING BAY - SCRAPPED TYRES","20/09/2024","01/07/2024","0"
VEHICLE STORE,"MAT0054","POWERTRAC M3","EXCHANGE FRO ABS","4.0000","Recap One","Trailer","315/80R22.5","M3","POWERTRAC","T4","ADZ9011/ADZ9010","0.0000","HOLDING BAY - VEHICLE STORE","18/11/2024","01/07/2024","0"
VEHICLE STORE,"MAT0052","POWERTRAC M3","new retread","12.0000","Recap One","Trailer","315/80R22.5","M3","POWERTRAC","T6","ABB1578/ABB1577","0.0000","HOLDING BAY - VEHICLE STORE","14/06/2025","01/07/2024","39952"`;
    
    setCsvData(sampleCsv);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventory CSV Import</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">Success:</strong> {result.message}
          {result.importResult && (
            <p className="mt-2">
              {result.importResult.message}
            </p>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border rounded-md p-4">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Upload CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">
              Or Paste CSV Data
            </label>
            <textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              onPaste={handlePaste}
              placeholder="Paste CSV data here..."
              className="w-full p-2 border rounded-md h-64 font-mono text-sm"
            />
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              type="button"
              onClick={generateSampleCsv}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Load Sample Data
            </button>
            <button
              type="button"
              onClick={() => setCsvData('')}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading || !csvData}
            className={`w-full py-2 px-4 rounded ${
              isLoading || !csvData
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? 'Importing...' : 'Import CSV Data'}
          </button>
        </div>
      </form>
      
      {sampleData && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Sample of Imported Records</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(sampleData[0]).slice(0, 10).map((key) => (
                    <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sampleData.map((item, idx) => (
                  <tr key={idx}>
                    {Object.keys(item).slice(0, 10).map((key) => (
                      <td key={`${idx}-${key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {typeof item[key] === 'object' ? JSON.stringify(item[key]) : String(item[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Showing {sampleData.length} of {result?.recordCount || sampleData.length} records (simplified view)
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryCsvImport;
