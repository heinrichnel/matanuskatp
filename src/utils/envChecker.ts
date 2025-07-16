/**
 * Utility to check if environment variables are properly loaded
 */

export const checkEnvVariables = () => {
  // Get all environment variables that start with VITE_
  const envVars = Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'));
  
  console.group('🔍 Environment Variables Check');
  console.log('Environment mode:', import.meta.env.MODE);
  console.log('Available variables:', envVars);
  
  // Check for specific variables
  const criticalVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_GOOGLE_MAPS_API_KEY',
    'VITE_GOOGLE_MAPS_IFRAME_URL'
  ];
  
  const results = criticalVars.map(varName => {
    const value = import.meta.env[varName];
    const exists = typeof value === 'string';
    const masked = exists ? `${value.substring(0, 5)}...${value.substring(value.length - 4)}` : 'undefined';
    
    return {
      name: varName,
      exists,
      length: exists ? value.length : 0,
      preview: masked
    };
  });
  
  console.table(results);
  console.groupEnd();
  
  return {
    variables: results,
    allVariables: envVars,
    mode: import.meta.env.MODE
  };
};

/**
 * Makes sure the Google Maps API key is properly configured
 */
export const verifyGoogleMapsConfig = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const iframeUrl = import.meta.env.VITE_GOOGLE_MAPS_IFRAME_URL;
  
  if (!apiKey) {
    console.error('❌ Google Maps API Key is missing. Add VITE_GOOGLE_MAPS_API_KEY to .env file');
    return false;
  }
  
  if (apiKey.includes('VITE_GOOGLE_MAPS_API_KEY') || apiKey === '${VITE_GOOGLE_MAPS_API_KEY}') {
    console.error('❌ Google Maps API Key is not correctly substituted. Check Vite environment variable handling');
    return false;
  }
  
  console.log('✅ Google Maps configuration verified successfully');
  return true;
};
