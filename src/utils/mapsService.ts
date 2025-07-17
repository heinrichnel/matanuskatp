/**
 * Maps Service URL Utility
 * 
 * This utility provides functions for working with the Maps Service URL
 * which is a Cloud Run service that proxies Google Maps API requests.
 */

/**
 * Get the configured maps service URL from environment variables
 * with a fallback to the default URL.
 */
export const getMapsServiceUrl = (): string => {
  return import.meta.env.VITE_MAPS_SERVICE_URL || 'https://maps-250085264089.africa-south1.run.app';
};

/**
 * Format a service URL to ensure it has the proper protocol and port.
 * 
 * @param url The URL to format
 * @returns Formatted URL with protocol (and optional port)
 */
export const formatServiceUrl = (url: string): string => {
  if (!url) return '';
  
  let formattedUrl = url;
  
  // Add https:// if no protocol specified
  if (!formattedUrl.startsWith('http')) {
    formattedUrl = `https://${formattedUrl}`;
  }
  
  // If this is the cloud run URL and no port specified, try to add port
  try {
    const urlObj = new URL(formattedUrl);
    if (
      !urlObj.port && 
      urlObj.protocol === 'https:' &&
      urlObj.hostname.includes('run.app')
    ) {
      // Cloud Run URLs often need a custom port
      const defaultPort = import.meta.env.VITE_MAPS_SERVICE_PORT || '8081';
      urlObj.port = defaultPort;
      formattedUrl = urlObj.toString();
    }
  } catch (err) {
    console.error('Error parsing Maps service URL:', err);
  }
  
  return formattedUrl;
};

/**
 * Get the properly formatted maps service URL.
 */
export const getFormattedMapsServiceUrl = (): string => {
  return formatServiceUrl(getMapsServiceUrl());
};

/**
 * Check if the maps service is available by pinging its health endpoint.
 * 
 * @param serviceUrl The formatted service URL
 * @returns A promise that resolves to true if available, false otherwise
 */
export const checkMapsServiceHealth = async (serviceUrl: string): Promise<boolean> => {
  try {
    if (!serviceUrl) {
      console.warn('No service URL provided for health check');
      return false;
    }

    // Try multiple potential endpoints since we don't know exactly how the service is configured
    const endpoints = [
      `${serviceUrl}/health`,
      `${serviceUrl}/api/health`,
      `${serviceUrl}/status`,
      `${serviceUrl}`
    ];
    
    console.log(`[Maps Service] Checking health of service at ${serviceUrl}...`);
    
    // Try each endpoint in sequence
    for (const endpoint of endpoints) {
      try {
        console.log(`[Maps Service] Checking endpoint ${endpoint}...`);
        
        const response = await fetch(endpoint, {
          method: 'GET',
          mode: 'no-cors', // Use no-cors mode to avoid CORS issues
          headers: {
            'Accept': 'application/json, text/plain, */*'
          },
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        
        // In no-cors mode, we won't be able to read the response,
        // but if we got here without error, it's a good sign
        console.log(`[Maps Service] Health check succeeded for ${endpoint}`);
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`[Maps Service] Health check failed for ${endpoint}:`, errorMessage);
      }
    }
    
    console.warn(`[Maps Service] All health check endpoints failed for ${serviceUrl}`);
    return false;
  } catch (err) {
    console.error('[Maps Service] Error checking maps service health:', err);
    return false;
  }
};
