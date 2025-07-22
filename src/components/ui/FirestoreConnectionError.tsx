import React from 'react';
import { AlertTriangle, RefreshCw, Database, Terminal } from 'lucide-react';
import Button from './Button';
import { attemptReconnect } from '../../utils/firebaseConnectionHandler';

interface FirestoreConnectionErrorProps {
  onRetry?: () => void;
  error?: Error | null;
  className?: string;
}

const FirestoreConnectionError: React.FC<FirestoreConnectionErrorProps> = ({
  onRetry,
  error,
  className = ''
}) => {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Try to reconnect using the connection handler
      await attemptReconnect();
      
      // If custom retry handler is provided, call it
      if (onRetry) {
        onRetry();
      }
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-800">Firestore Connection Issue</h3>
          <p className="text-sm text-amber-700 mt-1">
            Could not reach Cloud Firestore backend. The application is currently operating in offline mode.
          </p>
          
          {error && (
            <div className="mt-2 p-2 bg-amber-100 rounded text-xs font-mono text-amber-800 overflow-x-auto">
              {error.message}
            </div>
          )}
          
          <div className="mt-3 space-y-2">
            <h4 className="text-xs font-medium text-amber-800">Troubleshooting Steps:</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li className="flex items-start">
                <span className="inline-block w-4 h-4 mr-1 flex-shrink-0">1.</span>
                <span>Check your internet connection</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-4 h-4 mr-1 flex-shrink-0">2.</span>
                <span>If using emulators, ensure they are running with <code className="px-1 bg-amber-100 rounded">firebase emulators:start</code></span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-4 h-4 mr-1 flex-shrink-0">3.</span>
                <span>Verify your Firebase configuration is correct</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-4 h-4 mr-1 flex-shrink-0">4.</span>
                <span>Try refreshing the page</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={onClick}
              icon={isRetrying ? undefined : <RefreshCw className="w-4 h-4" />}
              isLoading={isRetrying}
            >
              {isRetrying ? 'Reconnecting...' : 'Try Reconnecting'}
            </Button>
            
            {import.meta.env.DEV && (
              <Button
                size="sm"
                variant="outline"
                onClick={onClick}
                icon={<Database className="w-4 h-4" />}
              >
                Open Emulator UI
              </Button>
            )}
            
            {import.meta.env.DEV && (
              <Button
                size="sm"
                variant="outline"
                onClick={onClick}
                icon={<Terminal className="w-4 h-4" />}
              >
                Open Firebase Hub
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirestoreConnectionError;