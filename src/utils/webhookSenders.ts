// FIXME: The original URL for TRIP_WEBHOOK_URL seemed corrupted and DRIVER_BEHAVIOR_WEBHOOK_URL was incomplete/missing.
// It is recommended to store these in environment variables for security and flexibility.
const TRIP_WEBHOOK_URL = 'https://docs.google.com/spreadsheets/d/1vFV3gzb-85PmPTqEgsgXwVZxei_XDpAaWPJVUguioYQ/edit?gid=166024345#gid=166024345'; // TODO: Replace with your actual trip webhook URL
const DRIVER_BEHAVIOR_WEBHOOK_URL = 'https://docs.google.com/spreadsheets/d/1HeCGDcKLnGaBnqRroAIxpX6GeUv-_A2oK8RU7j6UTiQ/edit?gid=0#gid=0'; // TODO: Replace with your actual driver behavior webhook URL

/**
 * Sends a trip-related event to the specified webhook URL.
 *
 * @param {object} payload - The event data payload to send.
 * @returns {Promise<object>} - The JSON response from the server.
 * @throws {Error} - If the request fails or the server returns an error.
 */
export async function sendTripEvent(payload: object): Promise<object> {
    try {
        const response = await fetch(TRIP_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to send trip event:', error);
        throw error;
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
    try {
        const response = await fetch(DRIVER_BEHAVIOR_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to send driver behavior event:', error);
        throw error;
    }
}