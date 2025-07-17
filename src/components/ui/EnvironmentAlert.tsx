import React from 'react';
import { checkEnvVariables } from '@/utils/setupEnv'; // pas pad aan indien elders

/**
 * Renders a warning banner if any critical environment variables are missing.
 */
export const EnvironmentAlert: React.FC = () => {
  const { missingVariables } = checkEnvVariables();

  if (missingVariables.length === 0) return null;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-4 rounded-md shadow-sm">
      <strong className="font-semibold">Environment Warning:</strong>
      <p className="mt-1 text-sm">
        The following critical environment variables are missing or empty:
      </p>
      <ul className="mt-2 ml-4 list-disc text-sm">
        {missingVariables.map((varName: string) => (
          <li key={varName}>
            <code className="bg-yellow-200 text-yellow-900 px-1 rounded">{varName}</code>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs italic text-yellow-700">
        Please check your <code>.env</code> or deployment configuration.
      </p>
    </div>
  );
};