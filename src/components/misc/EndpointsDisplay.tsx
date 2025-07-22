import React from 'react';
import { CLOUD_RUN_ENDPOINTS, MAPS_SERVICE_URL } from '../../config/cloudRunEndpoints';

/**
 * EndpointsDisplay Component
 * 
 * Displays all available Cloud Run endpoints for debugging purposes.
 * This can be included in developer or admin panels.
 */
const EndpointsDisplay: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Cloud Run Endpoints</h3>
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium text-gray-500">Maps Service URL:</span>
          <a 
            href={MAPS_SERVICE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-600 hover:underline break-all"
          >
            {MAPS_SERVICE_URL}
          </a>
        </div>
        
        <div>
          <span className="text-sm font-medium text-gray-500">Primary Cloud Run URL:</span>
          <a 
            href={CLOUD_RUN_ENDPOINTS.primary}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-600 hover:underline break-all"
          >
            {CLOUD_RUN_ENDPOINTS.primary}
          </a>
        </div>
        
        <div>
          <span className="text-sm font-medium text-gray-500">Alternative Cloud Run URL:</span>
          <a 
            href={CLOUD_RUN_ENDPOINTS.alternative}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-600 hover:underline break-all"
          >
            {CLOUD_RUN_ENDPOINTS.alternative}
          </a>
        </div>
        
        <div className="mt-4">
          <span className="text-xs text-gray-500">
            Environment: <span className="font-mono">{import.meta.env.VITE_ENV_MODE || 'development'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default EndpointsDisplay;
