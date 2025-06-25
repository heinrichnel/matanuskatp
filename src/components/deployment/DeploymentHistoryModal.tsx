import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import DeploymentStatusBadge from '../ui/DeploymentStatusBadge';
import { formatDeploymentTime } from '../../utils/deploymentStatus';
import { Clock, GitBranch, Code, Timer, ExternalLink, RefreshCw } from 'lucide-react';

interface Deployment {
  id: string;
  status: 'deploying' | 'success' | 'error' | 'idle';
  url?: string;
  deployedAt: string;
  branch: string;
  commitSha: string;
  buildTime: string;
  message?: string;
}

interface DeploymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeploymentHistoryModal: React.FC<DeploymentHistoryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchDeployments = async () => {
    try {
      setIsLoading(true);
      
      // In a real implementation, this would be an API call
      // For now, we'll simulate a response with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDeployments: Deployment[] = [
        {
          id: 'deploy-123456',
          status: 'success',
          url: 'https://main--your-site.netlify.app',
          deployedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          branch: 'main',
          commitSha: 'abc123def456',
          buildTime: '45s',
          message: 'Add deployment status component'
        },
        {
          id: 'deploy-123455',
          status: 'success',
          url: 'https://feat-dashboard--your-site.netlify.app',
          deployedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          branch: 'feat/dashboard',
          commitSha: '789abc012def',
          buildTime: '52s',
          message: 'Implement dashboard features'
        },
        {
          id: 'deploy-123454',
          status: 'error',
          deployedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          branch: 'fix/auth',
          commitSha: '345ghi678jkl',
          buildTime: '37s',
          message: 'Fix authentication issues'
        }
      ];
      
      setDeployments(mockDeployments);
    } catch (error) {
      console.error('Error fetching deployments:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchDeployments();
    }
  }, [isOpen]);
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Deployment History"
      maxWidth="lg"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Recent Deployments</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchDeployments}
            icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : deployments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No deployment history found
          </div>
        ) : (
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <div 
                key={deployment.id} 
                className={`p-4 rounded-lg border ${
                  deployment.status === 'success' ? 'border-green-200 bg-green-50' :
                  deployment.status === 'error' ? 'border-red-200 bg-red-50' :
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <DeploymentStatusBadge status={deployment.status} />
                      <span className="font-medium text-gray-900">
                        {deployment.message || `Deployment ${deployment.id}`}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{formatDeploymentTime(deployment.deployedAt)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <GitBranch className="w-4 h-4 text-gray-400" />
                        <span>{deployment.branch}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Code className="w-4 h-4 text-gray-400" />
                        <span className="font-mono">{deployment.commitSha.substring(0, 7)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-gray-400" />
                        <span>Build time: {deployment.buildTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  {deployment.status === 'success' && deployment.url && (
                    <a
                      href={deployment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <span>View Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DeploymentHistoryModal;