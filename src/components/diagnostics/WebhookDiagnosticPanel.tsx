import React, { useState } from 'react';
import {
    DiagnosticResult,
    runDiagnosticOnAllEndpoints,
    runDiagnosticOnEndpoint,
    getServiceAccountAuthHeader
} from '../../utils/webhookDiagnosticAdapters';

/**
 * WebhookDiagnosticPanel - A component for testing and monitoring webhook health
 * 
 * This component provides tools to validate webhook connectivity, diagnose issues,
 * and test both predefined and custom endpoints.
 */
const WebhookDiagnosticPanel: React.FC = () => {
    const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [customEndpoint, setCustomEndpoint] = useState<string>('');
    const [customPayload, setCustomPayload] = useState<string>('{}');
    const [customEndpointResult, setCustomEndpointResult] = useState<DiagnosticResult | null>(null);

    // Predefined webhook endpoints to test
    const knownWebhooks = [
        { name: 'Driver Behavior', endpoint: '/importDriverBehaviorWebhook' },
        { name: 'Trip Import', endpoint: '/importTripsFromWebBook' },
    ];

    const runAllDiagnostics = async () => {
        setLoading(true);
        try {
            const results = await runDiagnosticOnAllEndpoints();
            setDiagnosticResults(results);
        } catch (error) {
            console.error('Failed to run diagnostics:', error);
        } finally {
            setLoading(false);
        }
    };

    const runSingleDiagnostic = async (endpoint: string) => {
        setLoading(true);
        try {
            const result = await runDiagnosticOnEndpoint(endpoint);

            // Update the existing results if this endpoint was already tested
            const existingIndex = diagnosticResults.findIndex(r => r.endpoint === endpoint);
            if (existingIndex >= 0) {
                const updatedResults = [...diagnosticResults];
                updatedResults[existingIndex] = result;
                setDiagnosticResults(updatedResults);
            } else {
                setDiagnosticResults(prev => [...prev, result]);
            }
        } catch (error) {
            console.error(`Failed to run diagnostic for ${endpoint}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const testCustomEndpoint = async () => {
        if (!customEndpoint) return;

        setLoading(true);
        try {
            const result = await runDiagnosticOnEndpoint(
                customEndpoint,
                customPayload ? JSON.parse(customPayload) : undefined
            );
            setCustomEndpointResult(result);
        } catch (error) {
            console.error('Failed to test custom endpoint:', error);
            setCustomEndpointResult({
                endpoint: customEndpoint,
                status: 'error',
                statusCode: 0,
                responseTime: 0,
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Unknown error',
                authHeader: await getServiceAccountAuthHeader()
            });
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get status color
    const getStatusColor = (status: string): string => {
        switch (status) {
            case 'success':
                return 'text-green-500';
            case 'error':
                return 'text-red-500';
            case 'warning':
                return 'text-yellow-500';
            default:
                return 'text-gray-500';
        }
    };

    // Helper function to format response time with appropriate unit
    const formatResponseTime = (time: number): string => {
        if (time < 1000) {
            return `${time.toFixed(0)}ms`;
        }
        return `${(time / 1000).toFixed(2)}s`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Webhook Diagnostics
            </h2>

            {/* System Webhooks Panel */}
            <div className="mb-8">
                <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-700">System Webhooks</h3>
                    <button
                        onClick={runAllDiagnostics}
                        disabled={loading}
                        className="px-4 py-2 bg-[#005f73] hover:bg-[#003844] text-white rounded-md transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Running Tests...' : 'Test All Webhooks'}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Webhook</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Response Time</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Last Tested</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {knownWebhooks.map((webhook) => {
                                const result = diagnosticResults.find(r => r.endpoint === webhook.endpoint);

                                return (
                                    <tr key={webhook.endpoint} className="hover:bg-gray-50">
                                        <td className="py-4 px-4 text-sm">{webhook.name}</td>
                                        <td className="py-4 px-4 text-sm">
                                            {result ? (
                                                <span className={`font-medium ${getStatusColor(result.status)}`}>
                                                    {result.status.toUpperCase()}
                                                    {result.statusCode ? ` (${result.statusCode})` : ''}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">Not Tested</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-sm">
                                            {result ? formatResponseTime(result.responseTime) : '-'}
                                        </td>
                                        <td className="py-4 px-4 text-sm">
                                            {result?.timestamp ? new Date(result.timestamp).toLocaleString() : '-'}
                                        </td>
                                        <td className="py-4 px-4 text-sm">
                                            <button
                                                onClick={() => runSingleDiagnostic(webhook.endpoint)}
                                                disabled={loading}
                                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors disabled:opacity-50"
                                            >
                                                {loading ? 'Testing...' : 'Test'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Endpoint Test Panel */}
            <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Test Custom Endpoint</h3>

                <div className="mb-4">
                    <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 mb-1">
                        Endpoint URL
                    </label>
                    <input
                        type="text"
                        id="endpoint"
                        value={customEndpoint}
                        onChange={(e) => setCustomEndpoint(e.target.value)}
                        placeholder="https://us-central1-mat1-9e6b3.cloudfunctions.net/yourFunction"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f73] focus:border-transparent"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="payload" className="block text-sm font-medium text-gray-700 mb-1">
                        Payload (JSON)
                    </label>
                    <textarea
                        id="payload"
                        value={customPayload}
                        onChange={(e) => setCustomPayload(e.target.value)}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005f73] focus:border-transparent font-mono text-sm"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={testCustomEndpoint}
                        disabled={loading || !customEndpoint}
                        className="px-4 py-2 bg-[#005f73] hover:bg-[#003844] text-white rounded-md transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Testing...' : 'Run Test'}
                    </button>
                </div>

                {/* Custom Endpoint Result */}
                {customEndpointResult && (
                    <div className="mt-4 p-4 border rounded-md bg-white">
                        <h4 className="font-medium text-gray-700 mb-2">Test Results</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex">
                                <span className="font-medium w-32">Status:</span>
                                <span className={getStatusColor(customEndpointResult.status)}>
                                    {customEndpointResult.status.toUpperCase()}
                                    {customEndpointResult.statusCode ? ` (${customEndpointResult.statusCode})` : ''}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="font-medium w-32">Response Time:</span>
                                <span>{formatResponseTime(customEndpointResult.responseTime)}</span>
                            </div>
                            <div className="flex">
                                <span className="font-medium w-32">Timestamp:</span>
                                <span>{new Date(customEndpointResult.timestamp).toLocaleString()}</span>
                            </div>
                            {customEndpointResult.error && (
                                <div className="flex">
                                    <span className="font-medium w-32">Error:</span>
                                    <span className="text-red-500">{customEndpointResult.error}</span>
                                </div>
                            )}
                            {customEndpointResult.responseBody && (
                                <div className="mt-2">
                                    <span className="font-medium block mb-1">Response Body:</span>
                                    <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-48">
                                        {typeof customEndpointResult.responseBody === 'string'
                                            ? customEndpointResult.responseBody
                                            : JSON.stringify(customEndpointResult.responseBody, null, 2)
                                        }
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WebhookDiagnosticPanel;