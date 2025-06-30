// Use Firebase Cloud Function URLs instead of direct Google Sheets access
const TRIP_WEBHOOK_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/importTripsFromWebBook';
const DRIVER_BEHAVIOR_WEBHOOK_URL = 'https://us-central1-mat1-9e6b3.cloudfunctions.net/importDriverBehaviorWebhook'; // Fixed function name

// Get Firebase ID token for authentication - this should be replaced with actual auth mechanism
async function getAuthToken(): Promise<string | null> {
    try {
        // This is a placeholder - in production, you should get this from Firebase Auth
        // return await firebase.auth().currentUser?.getIdToken() || null;
        console.log('⚠️ Using temporary auth token for development');
        return 'temporary-development-token';
    } catch (error) {
        console.error('Failed to get auth token:', error);
        return null;
    }
}

/**
 * Sends a trip-related event to the specified webhook URL.
 *
 * @param {object} payload - The event data payload to send.
 * @returns {Promise<object>} - The JSON response from the server.
 * @throws {Error} - If the request fails or the server returns an error.
 */
export async function sendTripEvent(payload: object): Promise<object> {
    console.log(`📤 Sending trip event to webhook: ${TRIP_WEBHOOK_URL}`);

    try {
        // Get auth token
        const token = await getAuthToken();

        // Log the payload for debugging
        console.log('Trip event payload:', JSON.stringify(payload));

        // Make the request with retry logic
        const response = await retryWebhookCall(async () => {
            const res = await fetch(TRIP_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                let errorMessage = `HTTP error! status: ${res.status}`;
                try {
                    const errorText = await res.text();
                    errorMessage += `, message: ${errorText}`;
                    console.error(`Error response from trip webhook: ${errorText}`);
                } catch (err) {
                    // If we can't read the response body, just use the status
                    console.error(`Could not read error response body: ${err}`);
                }
                throw new Error(errorMessage);
            }

            return res;
        });

        // Try to parse JSON response, but handle text responses too
        let responseData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            const text = await response.text();
            responseData = { message: text };
        }

        console.log(`✅ Trip event sent successfully:`, responseData);
        return responseData;
    } catch (error) {
        console.error('Failed to send trip event:', error);
        // Re-throw with more diagnostic info
        throw new Error(`Trip webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}. Check network tab for details.`);
    }
}

/**
 * Sends a driver behavior event to the specified webhook URL.
 *
 * @param {object} payload - The event data payload to send.
 * @returns {Promise<object>} - The JSON response from the server.
 * @throws {Error} - If the request fails or the server returns an error.
 */
export async function sendDriverBehaviorEvent(payload: object): Promise<object> {
    console.log(`📤 Sending driver behavior event to webhook: ${DRIVER_BEHAVIOR_WEBHOOK_URL}`);

    try {
        // Get auth token
        const token = await getAuthToken();

        // Log the payload for debugging
        console.log('Driver behavior event payload:', JSON.stringify(payload));

        // Make the request with retry logic
        const response = await retryWebhookCall(async () => {
            const res = await fetch(DRIVER_BEHAVIOR_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                let errorMessage = `HTTP error! status: ${res.status}`;
                try {
                    const errorText = await res.text();
                    errorMessage += `, message: ${errorText}`;
                    console.error(`Error response from driver behavior webhook: ${errorText}`);
                } catch (err) {
                    // If we can't read the response body, just use the status
                    console.error(`Could not read error response body: ${err}`);
                }
                throw new Error(errorMessage);
            }

            return res;
        });

        // Try to parse JSON response, but handle text responses too
        let responseData;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
        } else {
            const text = await response.text();
            responseData = { message: text };
        }

        console.log(`✅ Driver behavior event sent successfully:`, responseData);
        return responseData;
    } catch (error) {
        console.error('Failed to send driver behavior event:', error);
        // Re-throw with more diagnostic info
        throw new Error(`Driver behavior webhook failed: ${error instanceof Error ? error.message : 'Unknown error'}. Check network tab for details.`);
    }
}

// Utility function to retry a webhook call with exponential backoff
export async function retryWebhookCall(
    callFn: () => Promise<Response>,
    maxRetries = 3,
    initialDelay = 1000
): Promise<Response> {
    let lastError: Error | null = null;
    let attempt = 1;
    let delay = initialDelay;

    while (attempt <= maxRetries) {
        try {
            console.log(`🔄 Webhook call attempt ${attempt}/${maxRetries}`);
            const response = await callFn();
            return response;
        } catch (error: any) {
            lastError = error;
            console.warn(`❌ Attempt ${attempt}/${maxRetries} failed:`, error.message);

            if (attempt < maxRetries) {
                console.log(`⏱️ Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
                attempt++;
            } else {
                break;
            }
        }
    }

    throw lastError || new Error('All webhook call attempts failed');
}