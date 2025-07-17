import React from 'react';
import EndpointsDisplay from '../../components/ui/EndpointsDisplay';
import WialonConfigDisplay from '../../components/admin/WialonConfigDisplay';

/**
 * SystemInfoPanel Component
 * 
 * A dedicated page component to display system information including Cloud Run endpoints.
 * This can be accessed by admin or developer users for debugging purposes.
 */
const SystemInfoPanel: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">System Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <EndpointsDisplay />
          <WialonConfigDisplay />
          
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Environment</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-500">Mode:</span>
                <span className="ml-2">{import.meta.env.VITE_ENV_MODE || 'development'}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Firebase Project:</span>
                <span className="ml-2">{import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mat1-9e6b3'}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Using Emulators:</span>
                <span className="ml-2">{import.meta.env.VITE_USE_EMULATOR === 'true' ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Deployment Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-500">Container Image:</span>
              <span className="ml-2 break-all text-xs font-mono">
                {import.meta.env.VITE_CONTAINER_IMAGE || 'Not specified'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Deployment Platform:</span>
              <span className="ml-2">
                {import.meta.env.VERCEL ? 'Vercel' : import.meta.env.NETLIFY ? 'Netlify' : 'Other'}
              </span>
            </div>
            {import.meta.env.VERCEL && (
              <>
                <div>
                  <span className="text-sm font-medium text-gray-500">Vercel Project ID:</span>
                  <span className="ml-2 text-xs font-mono">
                    {import.meta.env.VERCEL_PROJECT_ID || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Vercel Environment:</span>
                  <span className="ml-2">
                    {import.meta.env.VERCEL_ENV || 'Not specified'}
                  </span>
                </div>
              </>
            )}
            {import.meta.env.NETLIFY && (
              <>
                <div>
                  <span className="text-sm font-medium text-gray-500">Netlify Project:</span>
                  <span className="ml-2">
                    {import.meta.env.VITE_NETLIFY_PROJECT_NAME || 'Not specified'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Netlify Site ID:</span>
                  <span className="ml-2 text-xs font-mono">
                    {import.meta.env.VITE_NETLIFY_SITE_ID || 'Not specified'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemInfoPanel;
