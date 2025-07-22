import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle, RefreshCw, WifiLow } from 'lucide-react';
import { 
  onConnectionStatusChanged, 
  getConnectionStatus, 
  ConnectionStatus,
  attemptReconnect
} from '../../utils/firebaseConnectionHandler';
import useNetworkStatus from '../../hooks/useNetworkStatus';

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
      
      // Attempt to reconnect to Firebase
      await attemptReconnect();
    } catch (err) {
      console.error('Failed to reconnect:', err);
    } finally {
      setIsReconnecting(false);
    }
  };

  // Determine display elements based on status
  const getStatusDisplay = () => {
    switch (status) {
      case 'connected':
        return {
          icon: <Wifi size={18} className="text-green-500" />,
          text: 'Connected',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'connecting':
        return {
          icon: <WifiLow size={18} className="text-yellow-500" />,
          text: 'Connecting...',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case 'disconnected':
        return {
          icon: <WifiOff size={18} className="text-red-500" />,
          text: 'Disconnected',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'error':
        return {
          icon: <AlertTriangle size={18} className="text-red-500" />,
          text: 'Connection Error',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: <WifiOff size={18} className="text-gray-500" />,
          text: 'Unknown',
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };
  
  const statusDisplay = getStatusDisplay();
  const isDisconnected = ['disconnected', 'error'].includes(status);
  
  // Compact version (icon only)
  if (!showText) {
    return (
      <div 
        className={`relative flex h-8 w-8 items-center justify-center rounded-full ${statusDisplay.bgColor} ${className}`}
        title={`${statusDisplay.text}${error ? `: ${error.message}` : ''}`}
      >
        {statusDisplay.icon}
        {isReconnecting && (
          <RefreshCw 
            size={18} 
            className="absolute animate-spin text-blue-500" 
          />
        )}
      </div>
    );
  }
  
  // Full version with text and reconnect button
  return (
    <div 
      className={`flex items-center rounded-md border p-2 ${statusDisplay.borderColor} ${statusDisplay.bgColor} ${className}`}
    >
      <div className="flex flex-1 items-center">
        {statusDisplay.icon}
        <span className={`ml-2 text-sm font-medium ${statusDisplay.color}`}>
          {statusDisplay.text}
        </span>
      </div>
      
      {isDisconnected && (
        <button
          onClick={handleReconnect}
          disabled={isReconnecting}
          className={`ml-2 flex items-center rounded px-2 py-1 text-xs font-medium ${
            isReconnecting
              ? 'cursor-not-allowed bg-blue-100 text-blue-400'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          <RefreshCw 
            size={14} 
            className={`mr-1 ${isReconnecting ? 'animate-spin' : ''}`} 
          />
          {isReconnecting ? 'Reconnecting...' : 'Reconnect'}
        </button>
      )}
      
      {error && (
        <div className="mt-1 w-full text-xs text-red-500">
          {error.message}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator;
