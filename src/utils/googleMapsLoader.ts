import { useEffect, useState } from "react";
import { ErrorCategory, ErrorSeverity, logError } from "./errorHandling";
import { checkMapsServiceHealth } from "./mapsService";
import { getNetworkState } from "./networkDetection";

declare global {
  interface Window {
    google?: { maps: any };
    gm_authFailure?: () => void;
  }
}

let promise: Promise<void> | null = null;
let useDirectApi = false;
let serviceCheckAttempted = false;
let authErrorDetected = false;
let lastErrorMessage: string | null = null;
let scriptElement: HTMLScriptElement | null = null;
let scriptLoaded = false;

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const MAPS_SERVICE_URL = import.meta.env.VITE_MAPS_SERVICE_URL;
const CURRENT_DOMAIN = typeof window !== "undefined" ? window.location.hostname : "";
const hasFallbackOption = !!GOOGLE_MAPS_API_KEY;

export const isGoogleMapsAPILoaded = (): boolean =>
  !!(window.google && window.google.maps);

const setupAuthFailureHandler = (): void => {
  if (typeof window !== "undefined" && !window.gm_authFailure) {
    window.gm_authFailure = () => {
      authErrorDetected = true;
      const errorMsg = `Google Maps authentication failed. The domain '${CURRENT_DOMAIN}' is not authorized to use this API key.`;
      lastErrorMessage = errorMsg;

      logError(errorMsg, {
        category: ErrorCategory.AUTHENTICATION,
        severity: ErrorSeverity.ERROR,
        message: errorMsg,
        context: { domain: CURRENT_DOMAIN },
      });

      console.error("[Maps Loader] AUTH ERROR: " + errorMsg);
      console.info(
        "[Maps Loader] To fix this, add this domain to the allowed referrers in the Google Cloud Console:"
      );
      console.info(`[Maps Loader] https://console.cloud.google.com/google/maps-apis/credentials`);
    };
  }
};

export const checkMapsServiceAvailability = async (): Promise<boolean> => {
  if (!MAPS_SERVICE_URL) return false;

  try {
    const isAvailable = await checkMapsServiceHealth(MAPS_SERVICE_URL);
    serviceCheckAttempted = true;

    if (!isAvailable) {
      logError("Maps service proxy is unavailable", {
        category: ErrorCategory.API,
        severity: ErrorSeverity.WARNING,
        message: "[Maps Loader] Maps service proxy is unavailable",
      });

      useDirectApi = hasFallbackOption;
      if (useDirectApi) {
        console.log("[Maps Loader] Falling back to direct Google Maps API");
      } else {
        logError("No fallback API key available", {
          category: ErrorCategory.API,
          severity: ErrorSeverity.ERROR,
          message: "[Maps Loader] No fallback API key available - map functionality may be limited",
        });
      }
    } else {
      useDirectApi = false;
      console.log(`[Maps Loader] Maps service proxy is available at: ${MAPS_SERVICE_URL}`);
    }

    return isAvailable;
  } catch (error) {
    logError(error instanceof Error ? error : new Error("Error checking maps service"), {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.WARNING,
      message: "[Maps Loader] Error checking maps service",
      context: { serviceUrl: MAPS_SERVICE_URL },
    });

    serviceCheckAttempted = true;
    useDirectApi = hasFallbackOption;
    return false;
  }
};

export const isValidApiKeyFormat = (apiKey: string | undefined): boolean => {
  if (!apiKey) return false;
  return apiKey.length >= 30 && !apiKey.includes(" ");
};

export const loadGoogleMapsScript = async (libraries: string = "places"): Promise<void> => {
  if (promise) return promise;
  setupAuthFailureHandler();

  if (GOOGLE_MAPS_API_KEY && !isValidApiKeyFormat(GOOGLE_MAPS_API_KEY)) {
    const error = new Error("Invalid Google Maps API key format");
    logError(error, {
      category: ErrorCategory.API,
      severity: ErrorSeverity.ERROR,
      message: "[Maps Loader] Invalid Google Maps API key format",
    });
    throw error;
  }

  const networkState = getNetworkState();
  if (networkState.status === "offline") {
    const error = new Error("Cannot load Google Maps while offline");
    logError(error, {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.WARNING,
      message: "[Maps Loader] Cannot load Google Maps while offline",
    });
    throw error;
  }

  if (!serviceCheckAttempted && MAPS_SERVICE_URL) {
    await checkMapsServiceAvailability();
  }

  promise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      console.log("[Maps Loader] Google Maps already loaded");
      resolve();
      return;
    }

    if (scriptElement) {
      console.log("[Maps Loader] Script element already exists, waiting for it to load");
      if (scriptLoaded && !window.google?.maps) {
        console.warn("[Maps Loader] Script loaded but Google Maps not available, possible initialization issue");
      }
      return;
    }

    scriptElement = document.createElement("script");
    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"], script[src*="maps/api/js"]');
    if (existingScripts.length > 0) {
      console.warn(`[Maps Loader] Found ${existingScripts.length} existing Google Maps script tags. Using existing scripts.`);
      const checkExisting = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkExisting);
          scriptLoaded = true;
          resolve();
        }
      }, 200);
      setTimeout(() => {
        clearInterval(checkExisting);
        if (!window.google?.maps) {
          const error = new Error("Existing Google Maps scripts failed to initialize properly");
          promise = null;
          reject(error);
        }
      }, 10000);
      return;
    }

    if (MAPS_SERVICE_URL && !useDirectApi) {
      const url = `${MAPS_SERVICE_URL}/maps/api/js?libraries=${libraries}`;
      console.log(`[Maps Loader] Loading Google Maps via proxy: ${url}`);
      scriptElement.src = url;
    } else if (GOOGLE_MAPS_API_KEY) {
      const url = `https://maps.googleapis.com/maps/api/js?key=$AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg&loading=async&libraries=${libraries}`;
      console.log("[Maps Loader] Loading Google Maps directly with API key");
      scriptElement.src = url;
    } else {
      const error = new Error("Maps configuration error: No valid API source available");
      logError(error, {
        category: ErrorCategory.API,
        severity: ErrorSeverity.ERROR,
        message: "[Maps Loader] Neither VITE_GOOGLE_MAPS_API_KEY nor VITE_MAPS_SERVICE_URL is properly set or available",
      });
      scriptElement = null;
      promise = null;
      reject(error);
      return;
    }

    scriptElement.async = true;
    scriptElement.defer = true;
    scriptElement.id = 'google-maps-script';

    scriptElement.onload = () => {
      scriptLoaded = true;
      setTimeout(() => {
        if (authErrorDetected) {
          scriptElement = null;
          promise = null;
          reject(new Error(lastErrorMessage || "Google Maps authentication failed"));
        } else {
          resolve();
        }
      }, 200);
    };

    scriptElement.onerror = (error) => {
      const errorMsg = "Failed to load Google Maps API script";
      lastErrorMessage = errorMsg;
      scriptLoaded = false;

      logError(error instanceof Error ? error : new Error(errorMsg), {
        category: ErrorCategory.NETWORK,
        severity: ErrorSeverity.ERROR,
        message: "[Maps Loader] " + errorMsg,
      });

      if (error instanceof Event) {
        console.warn(
          "[Maps Loader] Error details: This is likely due to an invalid API key, network issues, or billing not enabled"
        );
        console.log(
          "[Maps Loader] Verify your Google Cloud project has Maps JavaScript API enabled and billing configured"
        );
      }

      if (!useDirectApi && hasFallbackOption && MAPS_SERVICE_URL) {
        console.log("[Maps Loader] Proxy service failed, attempting fallback to direct API");
        useDirectApi = true;
        scriptElement = null;
        promise = null;
        loadGoogleMapsScript(libraries).then(resolve).catch(reject);
      } else {
        scriptElement = null;
        promise = null;
        reject(error);
      }
    };

    document.head.appendChild(scriptElement);
  });

  return promise;
};

export const useLoadGoogleMaps = (libraries: string = "places") => {
  const [isLoaded, setIsLoaded] = useState(isGoogleMapsAPILoaded());
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(!isLoaded);
  const [errorDetails, setErrorDetails] = useState<{
    isAuthError: boolean;
    isDomainError: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isLoaded) return;

    setIsLoading(true);

    const loadMaps = async () => {
      try {
        if (!serviceCheckAttempted && MAPS_SERVICE_URL) {
          await checkMapsServiceAvailability();
        }

        await loadGoogleMapsScript(libraries);

        if (authErrorDetected) {
          throw new Error(lastErrorMessage || "Google Maps authentication failed");
        }

        setIsLoaded(true);
        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load Google Maps";
        const isAuthError =
          authErrorDetected || errorMessage.includes("auth") || errorMessage.includes("key");
        const isDomainError =
          errorMessage.includes("domain") ||
          errorMessage.includes("referrer") ||
          errorMessage.includes("allowed");

        logError(err instanceof Error ? err : new Error(errorMessage), {
          category: isAuthError ? ErrorCategory.AUTHENTICATION : ErrorCategory.NETWORK,
          severity: ErrorSeverity.ERROR,
          message: "[Maps Loader] " + errorMessage,
        });

        setErrorDetails({
          isAuthError,
          isDomainError,
          message: errorMessage,
        });

        setError(err instanceof Error ? err : new Error(errorMessage));
        setIsLoading(false);
      }
    };

    loadMaps();
  }, [libraries, isLoaded]);

  return { isLoaded, isLoading, error, errorDetails };
};
