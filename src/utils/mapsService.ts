/**
 * Maps Service URL Utility
 *
 * This utility provides functions for working with the Maps Service URL,
 * which is a Cloud Run service that can proxy Google Maps API requests.
 */

/**
 * Gets the configured maps service URL from environment variables.
 * @returns The service URL or an empty string if not set.
 */
export const getMapsServiceUrl = (): string => {
  // It's safer to return an empty string if the variable is not set.
  return import.meta.env.VITE_MAPS_SERVICE_URL || '';
};

/**
 * Checks if the maps service is available by pinging its health endpoint.
 *
 * @param serviceUrl The URL of the maps proxy service.
 * @returns A promise that resolves to true if the service is available, false otherwise.
 */
export const checkMapsServiceHealth = async (serviceUrl: string): Promise<boolean> => {
  if (!serviceUrl) {
    console.warn('[Maps Service] No service URL provided for health check.');
    return false;
  }

  // A common health check endpoint is `/health` or `/status`.
  // We will try the base URL as a fallback.
  const healthEndpoint = `${serviceUrl}/health`;

  console.log(`[Maps Service] Checking health of service at: ${healthEndpoint}`);

  try {
    // We use a timeout to prevent the app from waiting too long for a response.
    const response = await fetch(healthEndpoint, {
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3-second timeout
    });

    // A successful response (e.g., status 200 OK) means the service is healthy.
    if (response.ok) {
      console.log(`[Maps Service] Health check succeeded for ${healthEndpoint}`);
      return true;
    } else {
      console.warn(`[Maps Service] Health check failed for ${healthEndpoint} with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    // This catch block will handle network errors, timeouts, or if the server is down.
    console.error(`[Maps Service] Health check failed for ${healthEndpoint}:`, errorMessage);
    return false;
  }
};
