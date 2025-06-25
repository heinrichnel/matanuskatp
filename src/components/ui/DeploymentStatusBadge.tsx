import React from 'react';
import { RefreshCw, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

type DeploymentStatus = 'deploying' | 'success' | 'error' | 'idle';

interface DeploymentStatusBadgeProps {
  status: DeploymentStatus;
  className?: string;
  showText?: boolean;
}

const DeploymentStatusBadge: React.FC<DeploymentStatusBadgeProps> = ({
  status,
  className = '',
  showText = true
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'deploying':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'deploying':
        return 'Deploying';
      case 'success':
        return 'Deployed';
      case 'error':
        return 'Failed';
      default:
        return 'Not deployed';
    }
  };
  
  const getStatusClass = () => {
    switch (status) {
      case 'deploying':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClass()} ${className}`}>
      {getStatusIcon()}
      {showText && <span className="ml-1">{getStatusText()}</span>}
    </span>
  );
};

export default DeploymentStatusBadge;