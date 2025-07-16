/**
 * Environment Variable Checker Utility
 * 
 * This utility provides functions to check and verify the presence 
 * and validity of environment variables required by the application.
 */

/**
 * Check if a specific environment variable exists and is not empty
 * @param name - Name of the environment variable to check
 * @returns Object with existence status and a safe preview of the value
 */
export function checkEnvVariable(name: string): { 
  name: string;
  exists: boolean;
  preview: string;
  value: string | undefined;
} {
  const value = (import.meta.env as Record<string, string>)[name];
  const exists = !!value && value.length > 0;
  
  // Create a safe preview (first 4 chars + length info for sensitive values)
  let preview = 'undefined';
  
  if (value) {
    if (name.includes('KEY') || name.includes('SECRET') || name.includes('PASSWORD') || name.includes('TOKEN')) {
      // Handle sensitive values
      preview = value.length > 0 
        ? `${value.substring(0, 4)}... (${value.length} chars)`
        : '(empty string)';
    } else {
      // Non-sensitive values
      preview = value.length > 50 ? `${value.substring(0, 47)}...` : value;
    }
  }
  
  return { name, exists, preview, value };
}

/**
 * Check all important environment variables for the application
 * @returns Object with check results for specific and all variables
 */
export function checkEnvVariables(): {
  variables: Array<{ name: string; exists: boolean; preview: string }>;
  allVariables: string[];
  missingVariables: string[];
} {
  // Define critical environment variables
  const criticalVars = [
    'VITE_GOOGLE_MAPS_API_KEY',
    'VITE_GOOGLE_MAPS_IFRAME_URL',
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  // Check each critical variable
  const variables = criticalVars.map(name => {
    const check = checkEnvVariable(name);
    return {
      name,
      exists: check.exists,
      preview: check.preview,
    };
  });

  // Get all available environment variables
  const allVariables = Object.keys(import.meta.env).filter(key => 
    key.startsWith('VITE_') || !key.includes('_')
  );

  // Find missing critical variables
  const missingVariables = variables
    .filter(v => !v.exists)
    .map(v => v.name);

  return {
    variables,
    allVariables,
    missingVariables,
  };
}

/**
 * Verify Google Maps configuration is valid
 * @returns Boolean indicating if Google Maps environment variables are properly configured
 */
export function verifyGoogleMapsConfig(): boolean {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const iframeUrl = import.meta.env.VITE_GOOGLE_MAPS_IFRAME_URL;
  
  // Check basic existence
  if (!apiKey || !iframeUrl) {
    return false;
  }
  
  // Check API key length (valid keys are usually >30 characters)
  if (apiKey.length < 30) {
    return false;
  }
  
  // Check if iframeUrl contains valid Google Maps URL
  if (!iframeUrl.includes('google.com/maps') && 
      !iframeUrl.includes('maps.googleapis.com')) {
    return false;
  }
  
  // Check for unresolved template variables
  if (iframeUrl.includes('${') || iframeUrl.includes('${}')) {
    return false;
  }
  
  return true;
}

/**
 * Check if environment mode is production
 * @returns Boolean indicating if environment is production
 */
export function isProductionEnv(): boolean {
  return import.meta.env.PROD === true || 
         import.meta.env.MODE === 'production';
}

/**
 * Get a safe environment variable value or fallback
 * @param name - Name of the environment variable
 * @param fallback - Default value if the environment variable is not set
 * @returns The environment variable value or the fallback
 */
export function getEnvVar(name: string, fallback: string): string {
  const value = (import.meta.env as Record<string, string>)[name];
  return value || fallback;
}
