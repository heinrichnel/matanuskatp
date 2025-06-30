/**
 * Webhook Diagnostic Adapters
 *
 * This module provides compatibility adapters between the WebhookDiagnosticPanel component
 * and the actual webhook utilities implementation. It maps function names and type structures
 * to ensure backward compatibility with components that were migrated from other projects.
 */

import {
    DiagnosticResult as OriginalDiagnosticResult,
    checkAllWebhookEndpoints,
    testWebhookEndpoint
} from './webhookDiagnostics';

// Constants for diagnostic testing
const DEFAULT_BASE_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net';

/**
 * DiagnosticResult interface adapted to what WebhookDiagnosticPanel expects
 */
export interface DiagnosticResult {
    timestamp: string;
    status: string;          // Maps to success (boolean) in original
    statusCode?: number;     // Same as original
    endpoint: string;        // Same as original
    responseTime: number;    // Maps to duration in original
    error?: string;          // Maps to errorDetails in original
    responseBody?: any;      // Not in original
    authHeader?: string;     // Not in original
}

/**
 * Convert the original DiagnosticResult to the format expected by the WebhookDiagnosticPanel
 */
function adaptDiagnosticResult(original: OriginalDiagnosticResult): DiagnosticResult {
    // Map the original result to the expected format
    return {
        timestamp: original.timestamp,
        status: original.success ? 'success' : 'error', // Convert boolean to string status
        statusCode: original.statusCode,
        endpoint: original.endpoint,
        responseTime: original.duration, // Map duration to responseTime
        error: original.errorDetails, // Map errorDetails to error
        responseBody: original.responseSize ? { size: original.responseSize } : undefined
    };
}

/**
 * Replacement for runDiagnosticOnAllEndpoints that calls the actual implementation
 * and adapts the result to the expected format
 */
export async function runDiagnosticOnAllEndpoints(
    baseUrl: string = DEFAULT_BASE_URL
): Promise<DiagnosticResult[]> {
    // Add debugging to track calls to this function
    console.log(`🔍 Running diagnostics on all endpoints with base URL: ${baseUrl}`);

    try {
        // Call the actual implementation
        const results = await checkAllWebhookEndpoints(baseUrl);

        // Convert map to array and adapt each result
        const adaptedResults = Object.values(results).map(adaptDiagnosticResult);
        console.log(`✅ Successfully ran diagnostics on ${adaptedResults.length} endpoints`);

        return adaptedResults;
    } catch (error) {
        console.error('❌ Error running diagnostics on all endpoints:', error);
        throw error;
    }
}

/**
 * Replacement for runDiagnosticOnEndpoint that calls the actual implementation
 * and adapts the result to the expected format
 */
export async function runDiagnosticOnEndpoint(
    endpoint: string,
    payload?: any
): Promise<DiagnosticResult> {
    // Add debugging for tracking when and how this function is called
    console.log(`🔍 Running diagnostic on endpoint: ${endpoint}`);

    // If the endpoint is a full URL, use it directly; otherwise, ensure it has a leading slash
    const fullEndpoint = endpoint.startsWith('http')
        ? endpoint
        : endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    try {
        // If payload is provided but testWebhookEndpoint doesn't support it,
        // we need to handle this discrepancy
        if (payload) {
            console.log('📦 Custom payload provided but not supported by implementation:',
                JSON.stringify(payload).substring(0, 100) + '...');
            // In a production version, we would ideally extend testWebhookEndpoint
            // to support custom payloads
        }

        // Call the actual implementation
        const result = await testWebhookEndpoint(fullEndpoint);

        // Adapt the result to the expected format
        const adaptedResult = adaptDiagnosticResult(result);

        // Add the auth header to the result for the component
        adaptedResult.authHeader = await getServiceAccountAuthHeader();

        console.log(`✅ Diagnostic completed for ${endpoint} with status: ${adaptedResult.status}`);
        return adaptedResult;
    } catch (error) {
        console.error(`❌ Error running diagnostic on ${endpoint}:`, error);

        // Create a failure result that matches the expected format
        const failureResult: DiagnosticResult = {
            timestamp: new Date().toISOString(),
            status: 'error',
            endpoint: fullEndpoint,
            responseTime: 0,
            error: error instanceof Error ? error.message : String(error),
            authHeader: await getServiceAccountAuthHeader()
        };

        return failureResult;
    }
}

/**
 * Provides a service account auth header for webhook requests.
 * This implements a standalone version that doesn't rely on the
 * non-exported getAuthToken function from webhookSenders.ts.
 */
export async function getServiceAccountAuthHeader(): Promise<string> {
    try {
        // In production, this should be replaced with actual Firebase auth token retrieval
        // For development, we use a temporary token approach
        console.log('🔑 Generating service account auth header for webhook request');
        const token = 'temporary-development-token';

        // Return the formatted Bearer token
        return `Bearer ${token}`;
    } catch (error) {
        console.error('❌ Failed to get service account auth header:', error);
        return '';
    }
}