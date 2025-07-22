import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { 
  onConnectionStatusChanged, 
  getConnectionStatus, 
  ConnectionStatus,
  attemptReconnect
} from '../../utils/firebaseConnectionHandler';

interface ConnectionStatusIndicatorProps {
  showText?: boolean;
  className?: string;
}

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  showText = false,
  className = ''
}) => {
  const [status, setStatus] = useState<ConnectionStatus>(getConnectionStatus().status);
  const [error, setError] = useState<Error | null>(getConnectionStatus().error);
  const [isReconnecting, setIsReconnecting] = useState(false);

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
      await attemptReconnect();
    } finally {
      setIsReconnecting(false);
    }
  };

  // Render different indicators based on status
  const renderIndicator = () => {
    switch (status) {
      case 'connected':
        return (
          <div className="flex items-center text-green-600">
            <Wifi className="w-4 h-4" />
            {showText && <span className="ml-2 text-sm">Connected</span>}
          </div>
        );
      
      case 'disconnected':
        return (
          <div className="flex items-center text-amber-600">
            <WifiOff className="w-4 h-4" />
            {showText && <span className="ml-2 text-sm">Offline Mode</span>}
            <button 
              onClick={onClick || (() => {})} 
              className="ml-2 p-1 rounded hover:bg-gray-100"
              disabled={isReconnecting}
              title="Try to reconnect"
            >
              <RefreshCw className={`w-3 h-3 text-amber-600 ${isReconnecting ? 'animate-spin' : ''}`} />
            </button>
          </div>
        );
      
      case 'connecting':
        return (
          <div className="flex items-center text-blue-600">
            <RefreshCw className="w-4 h-4 animate-spin" />
            {showText && <span className="ml-2 text-sm">Connecting...</span>}
          </div>
        );
      
      case 'error':
        return (
          <div className="flex items-center text-red-600">
            <AlertTriangle className="w-4 h-4" />
            {showText && (
              <span className="ml-2 text-sm">
                Connection Error
                {error && <span className="hidden md:inline"> - {error.message}</span>}
              </span>
            )}
            <button 
              onClick={onClick || (() => {})} 
              className="ml-2 p-1 rounded hover:bg-gray-100"
              disabled={isReconnecting}
              title="Try to reconnect"
            >
              <RefreshCw className={`w-3 h-3 text-red-600 ${isReconnecting ? 'animate-spin' : ''}`} />
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      {renderIndicator()}
    </div>
  );
};

export default ConnectionStatusIndicator;