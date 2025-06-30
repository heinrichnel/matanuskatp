/**
 * Webhook Diagnostics Utility
 * 
 * This module provides debugging and diagnostic tools for webhook interactions.
 * It helps identify issues with Firebase Cloud Functions connectivity,
 * authentication, and payload processing.
 */

export type DiagnosticResult = {
    timestamp: string;
    success: boolean;
    statusCode?: number;
    endpoint: string;
    duration: number;
    errorDetails?: string;
    responseSize?: number;
};

const diagnosticLog: DiagnosticResult[] = [];

/**
 * Records diagnostic information about a webhook call
 */
export function recordDiagnostic(result: DiagnosticResult): void {
    diagnosticLog.push(result);
    console.log(`📊 Webhook diagnostic recorded for ${result.endpoint}: ${result.success ? '✅ Success' : '❌ Failed'}`);

    // Keep only the last 20 records to avoid memory issues
    if (diagnosticLog.length > 20) {
        diagnosticLog.shift();
    }
}

/**
 * Get the recent diagnostic log 
 */
export function getDiagnosticLog(): DiagnosticResult[] {
    return [...diagnosticLog];
}

/**
 * Test connectivity to a webhook endpoint with simplified payload
 */
export async function testWebhookEndpoint(url: string): Promise<DiagnosticResult> {
    console.log(`🔍 Testing webhook connectivity to: ${url}`);
    const startTime = Date.now();

    try {
        // Send a minimal test payload
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Diagnostic-Mode': 'true'
            },
            body: JSON.stringify({
                eventType: 'webhook.connectivity_test',
                timestamp: new Date().toISOString(),
                diagnosticMode: true
            }),
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        let responseSize: number | undefined;
        try {
            const text = await response.text();
            responseSize = text.length;
        } catch (e) {
            // Unable to get response size
        }

        const result: DiagnosticResult = {
            timestamp: new Date().toISOString(),
            success: response.ok,
            statusCode: response.status,
            endpoint: url,
            duration,
            responseSize
        };

        if (!response.ok) {
            result.errorDetails = `HTTP error: ${response.status} ${response.statusText}`;
        }

        recordDiagnostic(result);
        return result;
    } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        const result: DiagnosticResult = {
            timestamp: new Date().toISOString(),
            success: false,
            endpoint: url,
            duration,
            errorDetails: `Network error: ${error instanceof Error ? error.message : String(error)}`
        };

        recordDiagnostic(result);
        return result;
    }
}

/**
 * Check all Firebase cloud functions for connectivity issues
 */
export async function checkAllWebhookEndpoints(
    baseUrl: string = 'https://us-central1-mat1-9e6b3.cloudfunctions.net'
): Promise<{ [key: string]: DiagnosticResult }> {
    // List of endpoints to check
    const endpoints = [
        `/importTripsFromWebBook`,
        `/importDriverBehaviorWebhook`
    ];

    const results: { [key: string]: DiagnosticResult } = {};

    console.log(`🔍 Running diagnostic check on ${endpoints.length} webhook endpoints...`);

    for (const endpoint of endpoints) {
        const url = `${baseUrl}${endpoint}`;
        results[endpoint] = await testWebhookEndpoint(url);
    }

    console.log('📊 Webhook diagnostics complete. Results:', results);

    return results;
}

/**
 * Create a report of webhook usage and error patterns
 */
export function generateWebhookHealthReport(): {
    totalCalls: number;
    successRate: number;
    avgResponseTime: number;
    failuresByEndpoint: { [key: string]: number };
    recommendations: string[];
} {
    // Filter to recent entries (last 20)
    const recentLogs = diagnosticLog.slice(-20);

    if (recentLogs.length === 0) {
        return {
            totalCalls: 0,
            successRate: 0,
            avgResponseTime: 0,
            failuresByEndpoint: {},
            recommendations: ['No webhook calls recorded yet. Run diagnostics first.']
        };
    }

    // Calculate metrics
    const totalCalls = recentLogs.length;
    const successfulCalls = recentLogs.filter(log => log.success).length;
    const successRate = (successfulCalls / totalCalls) * 100;

    const totalResponseTime = recentLogs.reduce((sum, log) => sum + log.duration, 0);
    const avgResponseTime = totalResponseTime / totalCalls;

    // Count failures by endpoint
    const failuresByEndpoint: { [key: string]: number } = {};
    recentLogs
        .filter(log => !log.success)
        .forEach(log => {
            const endpoint = log.endpoint;
            failuresByEndpoint[endpoint] = (failuresByEndpoint[endpoint] || 0) + 1;
        });

    // Generate recommendations
    const recommendations: string[] = [];

    if (successRate < 90) {
        recommendations.push('Webhook success rate is below 90%. Check network connectivity and authentication.');
    }

    if (avgResponseTime > 2000) {
        recommendations.push('Average response time exceeds 2 seconds. Consider optimizing cloud function execution time.');
    }

    // Look for patterns in status codes
    const status403Count = recentLogs.filter(log => log.statusCode === 403).length;
    if (status403Count > 0) {
        recommendations.push('Received 403 Forbidden errors. Verify authentication credentials and IAM permissions.');
    }

    const status500Count = recentLogs.filter(log => log.statusCode === 500).length;
    if (status500Count > 0) {
        recommendations.push('Received 500 Internal Server errors. Check cloud function logs for exceptions.');
    }

    if (recommendations.length === 0 && successRate > 98) {
        recommendations.push('Webhook system appears healthy. No immediate actions required.');
    }

    return {
        totalCalls,
        successRate,
        avgResponseTime,
        failuresByEndpoint,
        recommendations
    };
}

// Helper to validate a webhook payload before sending
export function validateWebhookPayload(
    payload: any,
    requiredFields: string[] = ['eventType', 'timestamp']
): { valid: boolean; missingFields: string[] } {
    const missingFields: string[] = [];

    for (const field of requiredFields) {
        if (payload[field] === undefined || payload[field] === null) {
            missingFields.push(field);
        }
    }

    return {
        valid: missingFields.length === 0,
        missingFields
    };
}