import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface FirestoreConnectionErrorProps {
  error: Error | null;
}

const FirestoreConnectionError: React.FC<FirestoreConnectionErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Firestore Connection Error
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              {error.message || 'An unknown error occurred connecting to Firestore'}
            </p>
            <p className="mt-2">
              Please check your connection and try again. If the problem persists, contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirestoreConnectionError;
