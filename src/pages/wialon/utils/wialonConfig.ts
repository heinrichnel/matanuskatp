/**
 * Wialon Configuration for Matanuska Transportation Project
 *
 * This file provides centralized access to Wialon API configuration
 * including API URLs, login URLs, and session token management.
 */
import { getEnvVar } from "../../../utils/envUtils";

// Base API URL for Wialon requests
export const WIALON_API_URL = getEnvVar("VITE_WIALON_API_URL", "https://hst-api.wialon.com");

// Direct login URL with token for Wialon hosting
export const WIALON_LOGIN_URL = getEnvVar(
  "VITE_WIALON_LOGIN_URL",
  "https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en"
);

// Session token for API authentication
export const WIALON_SESSION_TOKEN = getEnvVar(
  "VITE_WIALON_SESSION_TOKEN",
  "c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053"
);

// SDK URL for loading the Wialon JavaScript SDK
export const WIALON_SDK_URL = "https://hst-api.wialon.com/wsdk/script/wialon.js";

// Helper function to get the Wialon login URL with a specific token
export const getWialonLoginUrlWithToken = (token: string): string => {
  if (!token) {
    return WIALON_LOGIN_URL; // Use default URL with embedded token
  }

  // Extract base URL without token
  const baseUrl = "https://hosting.wialon.com/";
  return `${baseUrl}?token=${token}&lang=en`;
};

// Helper to open Wialon login in a new tab
export const openWialonLogin = (token?: string): void => {
  const url = token ? getWialonLoginUrlWithToken(token) : WIALON_LOGIN_URL;
  window.open(url, "_blank", "noopener,noreferrer");
};

// Helper to format date for Wialon API
export const formatWialonDate = (date: Date): number => {
  return Math.floor(date.getTime() / 1000);
};

// Helper to parse Wialon timestamp to JS Date
export const parseWialonTimestamp = (timestamp: number): Date => {
  return new Date(timestamp * 1000);
};

// Check if Wialon token is expired (typically used for UI indicators)
export const isTokenExpired = (expiryDate: Date | null): boolean => {
  if (!expiryDate) return true;
  return expiryDate < new Date();
};
