import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface DeploymentStatusProps {
  className?: string;
  showDetails?: boolean;
}

const DeploymentStatus: React.FC<DeploymentStatusProps> = ({ 
  className = '',
  showDetails = true
}) => {
  const [status, setStatus] = useState<'deploying' | 'success' | 'error' | 'idle'>('idle');
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [deployTime, setDeployTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const checkDeploymentStatus = async () => {
    try {
      setIsLoading(true);
      
      // Mock deployment status check
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate a successful deployment
      setStatus('success');
      setDeployUrl('https://your-deployed-app.netlify.app');
      setDeployTime(new Date().toISOString());
    } catch (error) {
      console.error('Error checking deployment status:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check status on component mount
  useEffect(() => {
    checkDeploymentStatus();
    
    // Optionally set up polling for status updates
    const interval = setInterval(() => {
      if (status === 'deploying') {
        checkDeploymentStatus();
      }
    }, 10000); // Check every 10 seconds while deploying
    
    return () => clearInterval(interval);
  }, [status]);
  
  const getStatusIcon = () => {
    switch (status) {
      case 'deploying':
        return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };
  
  const getStatusText = () => {
    switch (status) {
      case 'deploying':
        return 'Deployment in progress...';
      case 'success':
        return 'Deployment successful';
      case 'error':
        return 'Deployment failed';
      default:
        return 'No active deployments';
    }
  };
  
  const getStatusClass = () => {
    switch (status) {
      case 'deploying':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className={`text-sm font-medium ${getStatusClass()}`}>
          {getStatusText()}
        </span>
      </div>
      
      {showDetails && status === 'success' && deployUrl && (
        <div className="ml-4 text-sm">
          <a 
            href={deployUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Live Site
          </a>
          {deployTime && (
            <span className="text-gray-500 ml-2">
              (deployed {new Date(deployTime).toLocaleString()})
            </span>
          )}
        </div>
      )}
      
      <button
        onClick={checkDeploymentStatus}
        disabled={isLoading}
        className="ml-3 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 focus:outline-none"
        title="Refresh status"
      >
        <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
};

export default DeploymentStatus;