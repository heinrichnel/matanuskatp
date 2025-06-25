import React from 'react';
import { useSyncContext } from '../../context/SyncContext';
import { RefreshCw, Database, CheckCircle, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import Button from './Button';

interface SyncStatusProps {
  className?: string;
}

const SyncStatus: React.FC<SyncStatusProps> = ({ className = '' }) => {
  const { syncStatus, isOnline, lastSynced, pendingChangesCount } = useSyncContext();
  
  // Format time since last sync
  const getTimeSinceSync = () => {
    if (!lastSynced) return 'Never';
    
    const seconds = Math.floor((new Date().getTime() - lastSynced.getTime()) / 1000);
    
    if (seconds < 5) return 'Just now';
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };
  
  // Force sync (placeholder for now)
  const handleForceSync = () => {
    // This would trigger a manual sync of pending changes
    alert('Manual sync triggered. This would sync all pending changes.');
  };
  
  return (
    <div className={`p-4 bg-white rounded-lg shadow ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Sync Status</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-sm font-medium">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Pending Changes */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">Pending Changes</span>
          </div>
          <div className="flex items-center">
            {pendingChangesCount > 0 ? (
              <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                {pendingChangesCount} pending
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                All synced
              </span>
            )}
          </div>
        </div>
        
        {/* Sync Status */}
        <div className="p-3 bg-gray-50 rounded-md">
          <div className="flex items-center space-x-2 mb-2">
            {syncStatus === 'syncing' ? (
              <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
            ) : syncStatus === 'success' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : syncStatus === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            ) : isOnline ? (
              <Wifi className="w-4 h-4 text-green-500" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {syncStatus === 'syncing' ? 'Syncing...' :
               syncStatus === 'success' ? 'Last synced: ' + getTimeSinceSync() :
               syncStatus === 'error' ? 'Sync error' :
               isOnline ? 'Connected to Firestore' :
               'Offline - Using Local Cache'}
            </span>
          </div>
          
          {!isOnline && (
            <p className="text-xs text-gray-500 ml-6">
              Changes will be synced automatically when your connection is restored
            </p>
          )}
          
          {pendingChangesCount > 0 && isOnline && (
            <div className="mt-2">
              <Button
                size="sm"
                onClick={handleForceSync}
                icon={<RefreshCw className="w-3 h-3" />}
              >
                Sync Now ({pendingChangesCount})
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyncStatus;