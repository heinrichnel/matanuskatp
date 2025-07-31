import React, { useState, useEffect, useCallback } from "react";
import { useWialon } from "../../../context/WialonProvider";

// Define access types as constants for better readability
const ACCESS_TYPES = {
  FULL_ACCESS: "0xffff", // Full access to everything
  ONLINE_TRACKING: "0x100", // Online tracking only
};

// Define duration constants in seconds
const DURATIONS = {
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
  ONE_MONTH: 2592000,
};

// Define flags
const FLAGS = {
  RETURN_USER_NAME: "0x1", // Return user name in result
};

interface WialonIntegrationProps {
  /** Button label text */
  buttonLabel?: string;
  /** Whether to open in a new tab or use an iframe */
  displayMode?: "button" | "iframe" | "auth";
  /** Height of the iframe (only used when displayMode is 'iframe') */
  height?: number | string;
  /** Language to use for the Wialon interface */
  language?: string;
  /** Client ID for the application */
  clientId?: string;
  /** Access type (permission level) */
  accessType?: string;
  /** Activation time (0 for immediate) */
  activationTime?: number;
  /** Duration in seconds */
  duration?: number;
  /** Flags for additional options */
  flags?: string;
  /** Redirect URI after successful authentication */
  redirectUri?: string;
  /** Callback function when token is received */
  onTokenReceived?: (token: string, userName?: string) => void;
}

/**
 * WialonIntegration Component
 *
 * A component that provides integration with Wialon Hosting platform.
 * It supports:
 * 1. OAuth-like authorization flow with various permission levels
 * 2. Direct access with an existing token
 * 3. Display as a button or embedded iframe
 */
const WialonIntegration: React.FC<WialonIntegrationProps> = ({
  buttonLabel = "Authorize Wialon Access",
  displayMode = "auth",
  height = "600px",
  language = "en",
  clientId = "matanuska",
  accessType = ACCESS_TYPES.FULL_ACCESS,
  activationTime = 0,
  duration = DURATIONS.ONE_WEEK,
  flags = FLAGS.RETURN_USER_NAME,
  redirectUri = window.location.origin + "/wialon-callback",
  onTokenReceived,
}) => {
  const { setToken } = useWialon();
  const [wialonUrl, setWialonUrl] = useState<string>("");
  const [iframeSupported, setIframeSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setLocalToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // Function to build the authorization URL
  const buildAuthUrl = useCallback(() => {
    const baseUrl = "https://hosting.wialon.com/login.html";
    const params = new URLSearchParams({
      client_id: clientId,
      access_type: accessType,
      activation_time: activationTime.toString(),
      duration: duration.toString(),
      flags: flags,
      redirect_uri: redirectUri,
      lang: language,
    });

    return `${baseUrl}?${params.toString()}`;
  }, [clientId, accessType, activationTime, duration, flags, redirectUri, language]);

  // Function to build the direct access URL with token
  const buildDirectUrl = useCallback((token: string) => {
    const baseUrl = "https://hosting.wialon.com/";
    const params = new URLSearchParams({
      token: token,
      lang: language,
    });

    return `${baseUrl}?${params.toString()}`;
  }, [language]);

  // Handle token received from URL or post message
  const handleTokenReceived = useCallback((newToken: string, newUserName?: string) => {
    setLocalToken(newToken);
    if (newUserName) setUserName(newUserName);

    // Store token in local storage for persistence
    localStorage.setItem('wialonToken', newToken);
    if (newUserName) localStorage.setItem('wialonUserName', newUserName);

    // Update token in context
    setToken(newToken);

    // Call the callback if provided
    if (onTokenReceived) onTokenReceived(newToken, newUserName);
  }, [onTokenReceived, setToken]);

  // Check for token in URL on component mount (for redirect flow)
  useEffect(() => {
    const checkUrlForToken = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const userName = urlParams.get('user_name');

      if (accessToken) {
        handleTokenReceived(accessToken, userName || undefined);

        // Clean up URL if needed
        if (window.history && window.history.replaceState) {
          const cleanUrl = window.location.href.split('?')[0];
          window.history.replaceState({}, document.title, cleanUrl);
        }
      }
    };

    checkUrlForToken();

    // Set up listener for post messages (for popup flow)
    const handlePostMessage = (event: MessageEvent) => {
      if (typeof event.data === 'string' && event.data.startsWith('access_token=')) {
        const token = event.data.replace('access_token=', '');
        handleTokenReceived(token);
      }
    };

    window.addEventListener('message', handlePostMessage);
    return () => window.removeEventListener('message', handlePostMessage);
  }, [handleTokenReceived]);

  // Set up the URL based on mode and token availability
  useEffect(() => {
    // Check for stored token
    const storedToken = localStorage.getItem('wialonToken');
    const storedUserName = localStorage.getItem('wialonUserName');

    if (storedToken) {
      setLocalToken(storedToken);
      if (storedUserName) setUserName(storedUserName);
    }

    // Determine which URL to use
    if (displayMode === 'auth' || !token) {
      // For auth mode, use the authorization URL
      setWialonUrl(buildAuthUrl());
    } else {
      // For direct access, use the token URL
      setWialonUrl(buildDirectUrl(token));
    }

    // Check if iframe is supported (only if we're in iframe mode)
    if (displayMode === "iframe") {
      checkIframeSupport(token ? buildDirectUrl(token) : buildAuthUrl());
    } else {
      setIsLoading(false);
    }
  }, [displayMode, token, buildAuthUrl, buildDirectUrl]);

  const checkIframeSupport = async (url: string) => {
    try {
      // Try to fetch the headers to check X-Frame-Options
      const response = await fetch(url, { method: "HEAD" });
      const frameOptions = response.headers.get("X-Frame-Options");

      // If DENY or SAMEORIGIN is present, iframe embedding is not allowed
      const supported =
        !frameOptions || !(frameOptions.includes("DENY") || frameOptions.includes("SAMEORIGIN"));

      setIframeSupported(supported);
    } catch (error) {
      console.error("Error checking iframe support:", error);
      setIframeSupported(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenWialon = () => {
    // For auth mode, open in a popup window
    if (displayMode === 'auth') {
      window.open(wialonUrl, "wialonAuth", "width=760, height=500, top=300, left=500");
    } else {
      // For direct access, open in a new tab
      window.open(wialonUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Show user info if we have a token and username
  const renderUserInfo = () => {
    if (token && userName) {
      return (
        <div className="mb-3 text-sm text-gray-600">
          Authorized as: <span className="font-medium">{userName}</span>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div className="p-4 text-center">Loading Wialon integration...</div>;
  }

  if (displayMode === "iframe") {
    if (iframeSupported === false) {
      return (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg">
          <h3 className="font-medium">Iframe Embedding Not Supported</h3>
          <p className="mt-1">
            Wialon has X-Frame-Options that prevent embedding in an iframe. Please use the button
            mode instead.
          </p>
          <button
            onClick={handleOpenWialon}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {buttonLabel}
          </button>
        </div>
      );
    }

    return (
      <div className="wialon-iframe-container w-full">
        {renderUserInfo()}
        <iframe
          src={wialonUrl}
          width="100%"
          height={height}
          style={{ border: "none" }}
          title="Wialon Dashboard"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    );
  }

  // Button display mode
  return (
    <div className="wialon-button-container">
      {renderUserInfo()}
      <button
        onClick={handleOpenWialon}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        {token ? "Open Wialon Dashboard" : buttonLabel}
      </button>
    </div>
  );
};

export default WialonIntegration;
