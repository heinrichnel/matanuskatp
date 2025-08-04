import { AlertTriangle, RefreshCw, Wifi, WifiLow, WifiOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import useNetworkStatus from "../../hooks/useNetworkStatus";
import {
  ConnectionStatus,
  attemptReconnect,
  getConnectionStatus,
  onConnectionStatusChanged,
} from "../../utils/firebaseConnectionHandler";

interface ConnectionStatusIndicatorProps {
  showText?: boolean;
  className?: string;
}

/**
 * ConnectionStatusIndicator
 *
 * A ConnectionStatusIndicator component
 *
 * @example
 * ```tsx
 * <ConnectionStatusIndicator showText={true} className="example" />
 * ```
 *
 * @param props - Component props
 * @param props.showText - showText of the component
 * @param props.className - className of the component
 * @returns React component
 */
const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  showText = false,
  className = "",
}) => {
  const [status, setStatus] = useState<ConnectionStatus>(getConnectionStatus().status);
  const [error, setError] = useState<Error | null>(getConnectionStatus().error);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const networkStatus = useNetworkStatus();

  useEffect(() => {
    // Subscribe to connection status changes
    const unsubscribe = onConnectionStatusChanged((newStatus, newError) => {
      setStatus(newStatus);
      setError(newError || null);
    });

    return unsubscribe;
  }, []);

  const handleReconnect = async () => {
    setIsReconnecting(true);
    try {
      // Check network connectivity first
      await networkStatus.checkConnection();

      if (networkStatus.isOnline) {
        await attemptReconnect();
      }
    } finally {
      setIsReconnecting(false);
    }
  };

  // Accessibility-enhanced button for reconnection
  const ReconnectButton = () => (
    <button
      onClick={handleReconnect}
      className="ml-2 p-2 rounded hover:bg-gray-100"
      disabled={isReconnecting}
      title="Try to reconnect"
      style={{
        minWidth: "36px",
        minHeight: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <RefreshCw className={`w-4 h-4 ${isReconnecting ? "animate-spin" : ""}`} />
    </button>
  );

  // Render different indicators based on status and network quality
  const renderIndicator = () => {
    // If network is being checked or reconnecting
    if (networkStatus.isChecking || isReconnecting) {
      return (
        <div className="flex items-center text-blue-600">
          <RefreshCw className="w-4 h-4 animate-spin" />
          {showText && <span className="ml-2 text-sm">Checking connection...</span>}
        </div>
      );
    }

    // If network is limited (connected to internet but not to Firebase)
    if (networkStatus.isLimited) {
      return (
        <div className="flex items-center text-amber-600">
          <WifiLow className="w-4 h-4" />
          {showText && <span className="ml-2 text-sm">Limited Connectivity</span>}
          <ReconnectButton />
        </div>
      );
    }

    // If network is offline
    if (networkStatus.isOffline) {
      return (
        <div className="flex items-center text-amber-600">
          <WifiOff className="w-4 h-4" />
          {showText && <span className="ml-2 text-sm">Offline Mode</span>}
          <ReconnectButton />
        </div>
      );
    }

    // If Firestore status is used for the rest
    switch (status) {
      case "connected":
        return (
          <div className="flex items-center text-green-600">
            <Wifi className="w-4 h-4" />
            {showText && (
              <span className="ml-2 text-sm">
                Connected
                {networkStatus.quality === "poor" && <span className="text-xs ml-1">(Slow)</span>}
              </span>
            )}
          </div>
        );

      case "disconnected":
        return (
          <div className="flex items-center text-amber-600">
            <WifiOff className="w-4 h-4" />
            {showText && <span className="ml-2 text-sm">Offline Mode</span>}
            <ReconnectButton />
          </div>
        );

      case "connecting":
        return (
          <div className="flex items-center text-blue-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            {showText && <span className="ml-2 text-sm">Connecting...</span>}
          </div>
        );

      case "error":
        return (
          <div className="flex items-center text-red-600">
            <AlertTriangle className="w-4 h-4" />
            {showText && (
              <span className="ml-2 text-sm">
                Connection Error
                {error && <span className="hidden md:inline"> - {error.message}</span>}
              </span>
            )}
            <ReconnectButton />
          </div>
        );

      default:
        return null;
    }
  };

  return <div className={`inline-flex items-center ${className}`}>{renderIndicator()}</div>;
};

export default ConnectionStatusIndicator;
