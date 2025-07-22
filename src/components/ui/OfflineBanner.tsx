import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Database, AlertTriangle } from 'lucide-react';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { syncOfflineOperations } from '../../utils/offlineOperations';

const OfflineBanner: React.FC = () => {
  const networkStatus = useNetworkStatus();
  const [isVisible, setIsVisible] = useState<boolean>(networkStatus.isOffline || networkStatus.isLimited);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStats, setSyncStats] = useState<{success: number, failed: number} | null>(null);

  useEffect(() => {
    if (networkStatus.isOffline || networkStatus.isLimited) {
      setIsVisible(true);
      setIsDismissed(false);
    } else if (networkStatus.isOnline) {
      setIsVisible(false);
    }
  }, [networkStatus.isOffline, networkStatus.isLimited, networkStatus.isOnline]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleRetry = async () => {
    await networkStatus.checkConnection();
    
    if (networkStatus.isOnline) {
      // If we're back online, try to sync offline operations
      setIsSyncing(true);
      try {
        const result = await syncOfflineOperations();
        setSyncStats(result);
        
        // Show the sync results briefly, then hide
        setTimeout(() => {
          setIsVisible(false);
          setSyncStats(null);
        }, 3000);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  if ((networkStatus.isOnline && !isSyncing && !syncStats) || isDismissed || !isVisible) {
    return null;
  }

  // Different messages based on current state
  let message = '';
  let bgColor = '';
  let icon = null;
  
  if (isSyncing) {
    message = "Syncing offline changes...";
    bgColor = "bg-blue-500";
    icon = <Database className="h-5 w-5 mr-2 animate-pulse" />;
  } else if (syncStats) {
    message = `Sync complete: ${syncStats.success} changes applied, ${syncStats.failed} failed`;
    bgColor = syncStats.failed > 0 ? "bg-amber-500" : "bg-green-500";
    icon = syncStats.failed > 0 
      ? <AlertTriangle className="h-5 w-5 mr-2" />
      : <Database className="h-5 w-5 mr-2" />;
  } else if (networkStatus.isLimited) {
    message = "Limited connectivity. Some features may be unavailable.";
    bgColor = "bg-amber-500";
    icon = <AlertTriangle className="h-5 w-5 mr-2" />;
  } else {
    message = "You are currently offline. Some features may be unavailable.";
    bgColor = "bg-amber-500";
    icon = <WifiOff className="h-5 w-5 mr-2" />;
  }

  return (
    <div className={`fixed top-0 left-0 w-full ${bgColor} text-white z-50 shadow-md`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {icon}
          <span className="font-medium">
            {message}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {!isSyncing && (
            <>
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-3 py-1 bg-white text-gray-600 rounded hover:bg-gray-50"
                disabled={isSyncing}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                {networkStatus.isOffline ? 'Check Connection' : 'Sync Data'}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1 text-white hover:bg-opacity-80 rounded"
                aria-label="Dismiss"
              >
                Dismiss
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineBanner;
