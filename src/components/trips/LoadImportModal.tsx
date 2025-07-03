



import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Upload, X, WifiOff, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { useSyncContext } from '../../context/SyncContext';
import { FLEET_VEHICLES } from '../../types/vehicle';

interface LoadImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Create a fleet master mapping object for quick lookups
const createFleetMasterMapping = () => {
  const mapping: { [key: string]: string } = {};
  FLEET_VEHICLES.forEach(vehicle => {
    mapping[vehicle.registrationNo] = vehicle.fleetNo;
  });
  return mapping;
};

const LoadImportModal: React.FC<LoadImportModalProps> = ({ isOpen, onClose }) => {
  const { importTripsFromCSV, importTripsFromWebhook } = useAppContext();
  const { isOnline } = useSyncContext();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWebhookProcessing, setIsWebhookProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mappingResults, setMappingResults] = useState<{
    mapped: number;
    unmapped: number;
    total: number;
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];
      setCsvFile(file);

      // Generate preview
      try {
        const text = await file.text();
        const data = parseCSV(text);
        setPreviewData(data.slice(0, 3)); // Show first 3 rows
      } catch (error) {
        console.error('Failed to parse CSV for preview:', error);
      }
    }
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        data.push(row);
      }
    }

    return data;
  };

  const handleImport = async () => {
    if (!csvFile) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    setMappingResults(null);

    try {
      const text = await csvFile.text();
      const data = parseCSV(text);
      
      // Create fleet master mapping
      const fleetMasterMapping = createFleetMasterMapping();
      
      // Track mapping results
      let mappedCount = 0;
      let unmappedCount = 0;

      const trips = data.map((row: any) => {
        // Get registration from the CSV row
        const registration = row.Registration || row.registration || '';
        
        // Look up fleet number in the mapping
        let fleetNumber = '';
        
        if (registration) {
          // Try to get the fleet number from the mapping
          fleetNumber = fleetMasterMapping[registration] || '';
          
          if (fleetNumber) {
            mappedCount++;
          } else {
            unmappedCount++;
            // Use registration as fallback if no fleet number is found
            fleetNumber = registration;
          }
        } else {
          // If no registration is provided, try to use fleetNumber or fleet directly
          fleetNumber = row.fleetNumber || row.fleet || '';
          if (fleetNumber) {
            mappedCount++;
          } else {
            unmappedCount++;
          }
        }
        
        return {
          fleetNumber,
          route: row.route || '',
          clientName: row.clientName || row.client || '',
          baseRevenue: parseFloat(row.baseRevenue || row.revenue || '0'),
          revenueCurrency: row.revenueCurrency || row.currency || 'ZAR',
          startDate: row.startDate || '',
          endDate: row.endDate || '',
          driverName: row.driverName || row.driver || '',
          distanceKm: parseFloat(row.distanceKm || row.distance || '0'),
          clientType: row.clientType || 'external',
          description: row.description || '',
          paymentStatus: (['unpaid', 'partial', 'paid'].includes((row.paymentStatus || '').toLowerCase())
            ? (row.paymentStatus || '').toLowerCase()
            : 'unpaid') as 'unpaid' | 'partial' | 'paid',
          additionalCosts: [],
          followUpHistory: [],
          status: 'active' as 'active', // Ensure trips are set to active status
        };
      });
      
      // Set mapping results
      setMappingResults({
        mapped: mappedCount,
        unmapped: unmappedCount,
        total: data.length
      });
      await importTripsFromCSV(trips);
      setSuccess(`Successfully imported ${trips.length} trips from CSV file.${!isOnline ? '\n\nData will be synced when your connection is restored.' : ''}`);
      setCsvFile(null);
      setPreviewData([]);

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Failed to import CSV:', err);
      setError(`Error importing trips: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWebhookImport = async () => {
    setIsWebhookProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await importTripsFromWebhook();
      setSuccess(`Webhook import completed!\n\nImported: ${result.imported} trips\nSkipped: ${result.skipped} trips${!isOnline ? '\n\nData will be synced when your connection is restored.' : ''}`);

      // Close modal after a short delay if successful
      if (result.imported > 0) {
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err: any) {
      console.error('Failed to import from webhook:', err);
      setError(`Error importing from webhook: ${err.message}`);
    } finally {
      setIsWebhookProcessing(false);
    }
  };

  const handleClose = () => {
    setCsvFile(null);
    setIsProcessing(false);
    setIsWebhookProcessing(false);
    setPreviewData([]);
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'Registration',
      'driverName',
      'clientName',
      'route',
      'baseRevenue',
      'revenueCurrency',
      'startDate',
      'endDate',
      'distanceKm',
      'clientType',
      'description',
      'paymentStatus'
    ];
    const sample = [
      'ABJ3739',
      'John Doe',
      'Acme Corp',
      'JHB-DBN',
      '12000',
      'ZAR',
      '2025-06-01',
      '2025-06-03',
      '600',
      'external',
      'Sample trip',
      'unpaid'
    ];
    const csv = `${headers.join(',')}\n${sample.join(',')}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trip_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Trips"
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Connection Status Warning */}
        {!isOnline && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <WifiOff className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Working Offline</h4>
                <p className="text-sm text-amber-700 mt-1">
                  You can still import trips while offline. Your data will be stored locally and synced with the server when your connection is restored.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-red-800">Import Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-green-800">Import Successful</h3>
                <div className="mt-2 text-sm text-green-700 whitespace-pre-line">
                  <p>{success}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mapping Results */}
        {mappingResults && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-800">Fleet Mapping Results</h4>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Total vehicles: {mappingResults.total}</p>
                  <p>Successfully mapped: {mappingResults.mapped}</p>
                  {mappingResults.unmapped > 0 && (
                    <p className="text-amber-600">
                      Unmapped registrations: {mappingResults.unmapped} 
                      <span className="ml-1 text-xs">(Registration used as fallback)</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Webhook Import Section */}
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-green-800 mb-2">Import from Google Sheets Webhook</h4>
          <div className="text-sm text-green-700 space-y-2">
            <p>Import completed trips directly from your Google Apps Script webhook.</p>
            <p><strong>Requirements:</strong> Trips must have both SHIPPED and DELIVERED status to be imported.</p>
            <Button
              onClick={handleWebhookImport}
              disabled={isWebhookProcessing}
              isLoading={isWebhookProcessing}
              className="mt-2"
              variant="outline"
              icon={isWebhookProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : undefined}
            >
              {isWebhookProcessing ? 'Importing from Webhook...' : 'Import from Webhook'}
            </Button>
          </div>
        </div>

        <div className="text-center text-gray-500 font-medium">OR</div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">CSV Format Requirements & Fleet Mapping</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>Your CSV file should include the following columns:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Registration</strong> - Vehicle registration number (e.g., "ABJ3739", "AFQ1327")</li>
              <li><strong>driverName</strong> - Driver name</li>
              <li><strong>clientName</strong> - Client/customer name</li>
              <li><strong>route</strong> - Trip route description</li>
              <li><strong>baseRevenue</strong> - Revenue amount (numeric)</li>
              <li><strong>revenueCurrency</strong> - Currency (USD or ZAR)</li>
              <li><strong>startDate</strong> - Start date (YYYY-MM-DD)</li>
              <li><strong>endDate</strong> - End date (YYYY-MM-DD)</li>
              <li><strong>distanceKm</strong> - Distance in kilometers (optional)</li>
              <li><strong>clientType</strong> - "internal" or "external" (optional)</li>
            </ul>
            <p className="mt-2 font-medium">Fleet Number Mapping:</p>
            <p>
              Registration numbers will be automatically mapped to fleet numbers using the Fleet Master List.
              If a registration is not found in the list, the registration number itself will be used as the fleet number.
            </p>
            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              className="mt-3"
            >
              Download CSV Template
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select CSV File
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                file:rounded-md file:border-0 file:text-sm file:font-medium 
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                file:cursor-pointer cursor-pointer"
            />
          </div>

          {csvFile && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Selected: {csvFile.name}
                </span>
                <span className="text-sm text-green-600">
                  ({(csvFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
            </div>
          )}

          {/* Data Preview */}
          {previewData.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Data Preview (First 3 rows):</h4>
              <div className="bg-gray-50 p-3 rounded border overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      {Object.keys(previewData[0]).slice(0, 5).map((header) => (
                        <th key={header} className="px-2 py-1 text-left font-medium text-gray-700">
                          {header}
                        </th>
                      ))}
                      {Object.keys(previewData[0]).length > 5 && (
                        <th className="px-2 py-1 text-left font-medium text-gray-700">...</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b">
                        {Object.entries(row).slice(0, 5).map(([_, value], colIndex) => (
                          <td key={`${rowIndex}-${colIndex}`} className="px-2 py-1 text-gray-600">
                            {String(value)}
                          </td>
                        ))}
                        {Object.keys(row).length > 5 && (
                          <td className="px-2 py-1 text-gray-600">...</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isProcessing || isWebhookProcessing}
            icon={<X className="w-4 h-4" />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!csvFile || isProcessing || isWebhookProcessing}
            isLoading={isProcessing}
            icon={<Upload className="w-4 h-4" />}
          >
            {isProcessing ? 'Importing...' : 'Import CSV'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LoadImportModal;