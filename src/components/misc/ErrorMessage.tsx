import React from 'react';
import { AlertCircle, XCircle, AlertTriangle, Info, RefreshCw, X } from 'lucide-react';

// Import from our error handling utils if available
type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info';

interface ErrorMessageProps {
  title?: string;
  message: string;
  details?: string | null;
  severity?: ErrorSeverity;
  timestamp?: Date | null;
  onRetry?: () => void;
  onClose?: () => void;
  className?: string;
  showDetails?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  details = null,
  severity = 'error',
  timestamp = null,
  onRetry,
  onClose,
  className = '',
  showDetails = false
}) => {
  // Get styles based on severity
  const getSeverityStyles = () => {
    switch (severity) {
      case 'fatal':
        return {
          icon: <XCircle className="h-5 w-5 text-red-600" />,
          container: 'bg-red-100 text-red-800 border-red-300',
          defaultTitle: 'Critical Error'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          container: 'bg-red-50 text-red-700 border-red-200',
          defaultTitle: 'Error'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          container: 'bg-amber-50 text-amber-700 border-amber-200',
          defaultTitle: 'Warning'
        };
      case 'info':
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          container: 'bg-blue-50 text-blue-700 border-blue-200',
          defaultTitle: 'Information'
        };
      default:
        return {
          icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
          container: 'bg-red-50 text-red-700 border-red-200',
          defaultTitle: 'Error'
        };
    }
  };
  
  const { icon, container, defaultTitle } = getSeverityStyles();
  const displayTitle = title || defaultTitle;
  
  // Format the timestamp
  const formattedTime = timestamp 
    ? new Intl.DateTimeFormat(undefined, { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }).format(timestamp)
    : null;

  return (
    <div className={`rounded-md border p-4 ${container} ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{displayTitle}</h3>
            {timestamp && (
              <span className="text-xs text-gray-500">
                {formattedTime}
              </span>
            )}
          </div>
          <div className="mt-1 text-sm">
            <p>{message}</p>
            {details && showDetails && (
              <details className="mt-2 text-xs whitespace-pre-wrap opacity-70">
                <summary>Technical details</summary>
                <pre className="mt-1 p-2 bg-white bg-opacity-20 rounded overflow-auto max-h-32">
                  {details}
                </pre>
              </details>
            )}
          </div>
          <div className="mt-3 flex space-x-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </button>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-2 py-1.5 border border-transparent text-xs font-medium rounded hover:bg-gray-100 focus:outline-none"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Alert component for quick error displays
 */
export const ErrorAlert: React.FC<{ message: string; onClose?: () => void }> = ({ 
  message, 
  onClose 
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
      <div className="flex items-center">
        <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

/**
 * Warning alert component
 */
export const WarningAlert: React.FC<{ message: string; onClose?: () => void }> = ({ 
  message, 
  onClose 
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
      <div className="flex items-center">
        <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="text-sm">{message}</span>
      </div>
      {onClose && (
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;