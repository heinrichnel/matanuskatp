import React, { useState, useEffect } from 'react';
import { getEnvVar } from '../../utils/envUtils';

const MapsView: React.FC = () => {
  // Use direct Wialon link with token
  const wialonLoginUrl = "https://hosting.wialon.com/=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en";
  
  const [iframeError, setIframeError] = useState<boolean>(false);

  // Iframe style
  const iframeStyle = {
    width: '100%',
    height: 'calc(100vh - 100px)',
    border: 'none'
  };

  // Handle iframe load error
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Listen for error messages from the iframe
      if (event.data && typeof event.data === 'string' && event.data.includes('error')) {
        setIframeError(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handler to open Wialon in a new window
  const openWialonInNewWindow = () => {
    window.open(wialonLoginUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {!iframeError ? (
        <div className="relative">
          <iframe 
            src={wialonLoginUrl}
            style={iframeStyle}
            title="Wialon Maps & Tracking"
            allowFullScreen
            onError={() => setIframeError(true)}
          />
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              title="Open in new window"
            >
              Open in new window
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-2xl mb-4">
            <strong className="font-bold">Cannot embed Wialon: </strong>
            <span className="block sm:inline">
              The Wialon tracking system cannot be embedded in this page due to security restrictions.
            </span>
          </div>
          <button
            onClick={onClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Open Wialon in new window
          </button>
        </div>
      )}
    </div>
  );
};

export default MapsView;