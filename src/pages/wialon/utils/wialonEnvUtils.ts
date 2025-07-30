/**
 * Environment Variable Utilities specifically for Wialon integration
 *
 * Provides methods to safely load environment variables for Wialon configuration
 */

// Import the global environment utility
import { getEnvVar } from "../../../utils/envUtils";

/**
 * Load Wialon environment configuration
 * This centralizes all Wialon-related env vars in one place
 */
export const loadWialonConfig = () => {
  return {
    apiUrl: getEnvVar("VITE_WIALON_API_URL", "https://hst-api.wialon.com"),
    loginUrl: getEnvVar(
      "VITE_WIALON_LOGIN_URL",
      "https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en"
    ),
    sessionToken: getEnvVar(
      "VITE_WIALON_SESSION_TOKEN",
      "c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053"
    ),
  };
};

/**
 * Initialize Wialon environment variables in the browser
 */
export const initWialonEnv = () => {
  const config = loadWialonConfig();

  // Make config available in the global scope for debugging
  if (typeof window !== "undefined") {
    (window as any).WIALON_CONFIG = config;
  }

  return config;
};

/**
 * Check if Wialon environment variables are properly configured
 */
export const validateWialonEnv = (): { valid: boolean; issues: string[] } => {
  const config = loadWialonConfig();
  const issues: string[] = [];

  if (!config.sessionToken) {
    issues.push("Missing Wialon session token (VITE_WIALON_SESSION_TOKEN)");
  }

  if (!config.apiUrl) {
    issues.push("Missing Wialon API URL (VITE_WIALON_API_URL)");
  }

  if (!config.loginUrl) {
    issues.push("Missing Wialon login URL (VITE_WIALON_LOGIN_URL)");
  }

  return {
    valid: issues.length === 0,
    issues,
  };
};
