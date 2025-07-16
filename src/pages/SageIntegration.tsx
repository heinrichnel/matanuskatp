import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { sageAuthConfig } from '../../config/sageAuth';
import { syncPurchaseOrderToSage, importVendorsFromSage, importInventoryFromSage, importPurchaseOrdersFromSage } from '../../api/sageIntegration';
import { PurchaseOrder, Vendor, InventoryItem } from '../../types/inventory';

const SageIntegration: React.FC = () => {
  const [configStatus, setConfigStatus] = useState<'unconfigured' | 'partial' | 'complete'>('unconfigured');
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncResults, setSyncResults] = useState<{
    vendors: number;
    inventory: number;
    purchaseOrders: number;
    errors: string[];
  }>({
    vendors: 0,
    inventory: 0,
    purchaseOrders: 0,
    errors: []
  });

  // Check configuration status on component mount
  useEffect(() => {
    checkConfigStatus();
  }, []);

  const checkConfigStatus = () => {
    const { apiKey, endpoint, companyId } = sageAuthConfig;
    
    if (!apiKey && !endpoint && !companyId) {
      setConfigStatus('unconfigured');
    } else if (!apiKey || !endpoint || !companyId) {
      setConfigStatus('partial');
    } else {
      setConfigStatus('complete');
    }
  };

  const handleSyncWithSage = async () => {
    setSyncing(true);
    const results = {
      vendors: 0,
      inventory: 0,
      purchaseOrders: 0,
      errors: [] as string[]
    };

    try {
      // Import vendors from Sage
      try {
        const vendors = await importVendorsFromSage();
        results.vendors = vendors.length;
      } catch (error) {
        results.errors.push(`Failed to import vendors: ${(error as Error).message}`);
      }

      // Import inventory from Sage
      try {
        const inventory = await importInventoryFromSage();
        results.inventory = inventory.length;
      } catch (error) {
        results.errors.push(`Failed to import inventory: ${(error as Error).message}`);
      }

      // Import purchase orders from Sage
      try {
        const purchaseOrders = await importPurchaseOrdersFromSage();
        results.purchaseOrders = purchaseOrders.length;
      } catch (error) {
        results.errors.push(`Failed to import purchase orders: ${(error as Error).message}`);
      }

      // Update last sync time
      setLastSync(new Date());
    } catch (error) {
      results.errors.push(`General sync error: ${(error as Error).message}`);
    } finally {
      setSyncing(false);
      setSyncResults(results);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sage Integration</h1>
          <p className="text-gray-600">Manage Sage data synchronization and configuration</p>
        </div>
        <Button 
          onClick={handleSyncWithSage}
          disabled={configStatus !== 'complete' || syncing}
          isLoading={syncing}
        >
          Sync with Sage
        </Button>
      </div>

      {/* Configuration Status */}
      <Card>
        <CardHeader title="Connection Configuration" />
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Configuration Status</h3>
                <p className="text-sm text-gray-500">
                  {configStatus === 'complete' 
                    ? 'Sage integration is properly configured' 
                    : configStatus === 'partial'
                      ? 'Sage integration is partially configured'
                      : 'Sage integration is not configured'
                  }
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                configStatus === 'complete'
                  ? 'bg-green-100 text-green-800'
                  : configStatus === 'partial'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {configStatus === 'complete' 
                  ? 'Configured' 
                  : configStatus === 'partial'
                    ? 'Partial'
                    : 'Not Configured'
                }
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">API Key</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="password"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100"
                    value={sageAuthConfig.apiKey ? '•••••••••••••••••' : ''}
                    readOnly
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {sageAuthConfig.apiKey ? 'API Key is configured' : 'API Key is not configured'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">API Endpoint</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100"
                    value={sageAuthConfig.endpoint || ''}
                    readOnly
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {sageAuthConfig.endpoint ? 'Endpoint is configured' : 'Endpoint is not configured'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Company ID</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100"
                    value={sageAuthConfig.companyId || ''}
                    readOnly
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {sageAuthConfig.companyId ? 'Company ID is configured' : 'Company ID is not configured'}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-blue-800 mb-2">How to Configure Sage Integration</h4>
              <p className="text-sm text-blue-700">
                To configure Sage integration, you need to set the following environment variables:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-blue-700">
                <li>VITE_SAGE_API_KEY: Your Sage API key</li>
                <li>VITE_SAGE_API_ENDPOINT: Your Sage API endpoint URL</li>
                <li>VITE_SAGE_COMPANY_ID: Your Sage company ID</li>
              </ul>
              <p className="text-sm text-blue-700 mt-2">
                Add these to your <code>.env</code> file and restart the application.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Status */}
      <Card>
        <CardHeader title="Synchronization Status" />
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Last Synchronization</h3>
                <p className="text-sm text-gray-500">
                  {lastSync 
                    ? `Last synchronized on ${lastSync.toLocaleString()}` 
                    : 'No synchronization has been performed yet'
                  }
                </p>
              </div>
              {lastSync && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  Synced
                </div>
              )}
            </div>

            {/* Sync Results */}
            {(syncResults.vendors > 0 || syncResults.inventory > 0 || syncResults.purchaseOrders > 0) && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sync Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-sm text-gray-500">Vendors</p>
                    <p className="text-xl font-semibold">{syncResults.vendors}</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-sm text-gray-500">Inventory Items</p>
                    <p className="text-xl font-semibold">{syncResults.inventory}</p>
                  </div>
                  <div className="bg-white p-3 rounded-md shadow-sm">
                    <p className="text-sm text-gray-500">Purchase Orders</p>
                    <p className="text-xl font-semibold">{syncResults.purchaseOrders}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Errors */}
            {syncResults.errors.length > 0 && (
              <div className="bg-red-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-red-800 mb-2">Sync Errors</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-red-700">
                  {syncResults.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/*  Sync Options */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sync Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline"
                  disabled=