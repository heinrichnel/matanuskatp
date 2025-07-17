import { FC, useState } from 'react';
import { getEnvironmentStatusForUI } from '../../utils/setupEnv';

/**
 * Component that displays environment setup status
 * Only shown in development mode by default
 */
const EnvironmentSetupStatus: FC<{ alwaysShow?: boolean }> = ({ alwaysShow = false }) => {
  const [expanded, setExpanded] = useState(false);
  const envStatus = getEnvironmentStatusForUI();
  
  // Only show in development or if explicitly requested
  if (!alwaysShow && import.meta.env.PROD) {
    return null;
  }
  
  // If everything is configured properly and not explicitly shown, hide the component
  if (!alwaysShow && envStatus.valid) {
    return null;
  }
  
  return (
    <div className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center">
          <span className="mr-2">
            {envStatus.valid ? '✅' : '⚠️'}
          </span>
          Environment Setup
        </h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {expanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      <div className="mt-2">
        <p className={envStatus.valid ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}>
          Status: {envStatus.summary}
        </p>
      </div>
      
      {expanded && (
        <div className="mt-4 space-y-4">
          {envStatus.missingVars.length > 0 && (
            <div>
              <h3 className="font-medium text-red-600 dark:text-red-400">Missing Variables:</h3>
              <ul className="list-disc list-inside pl-4 mt-1">
                {envStatus.missingVars.map((variable: string) => (
                  <li key={variable} className="text-sm">{variable}</li>
                ))}
              </ul>
            </div>
          )}
          
          {envStatus.criticalIssues.length > 0 && (
            <div>
              <h3 className="font-medium text-red-600 dark:text-red-400">Critical Issues:</h3>
              <ul className="list-disc list-inside pl-4 mt-1">
                {envStatus.criticalIssues.map((issue: string, index: number) => (
                  <li key={index} className="text-sm">{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {envStatus.suggestions.length > 0 && (
            <div>
              <h3 className="font-medium text-blue-600 dark:text-blue-400">Suggestions:</h3>
              <ul className="list-disc list-inside pl-4 mt-1">
                {envStatus.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="text-sm">{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded text-sm">
            <p className="font-medium">How to fix:</p>
            <ol className="list-decimal list-inside pl-4 mt-1">
              <li>Create a <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">.env</code> file in the project root</li>
              <li>Copy the variables from <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">.env.example</code></li>
              <li>Fill in the missing values for each variable</li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentSetupStatus;
