import React, { useState, useEffect } from 'react';

const MapsView: React.FC = () => {
  // Use the specific token provided by the user
  const wialonLoginUrl = "https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en";
  const [iframeError, setIframeError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Iframe style
  const iframeStyle = {
    width: '100%',
    height: 'calc(100vh - 80px)', 
    border: 'none',
    backgroundColor: '#f9f9f9'
  };

  // Handle iframe load error
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Listen for error messages from the iframe
      if (event.data && typeof event.data === 'string' && event.data.includes('error')) {
        setIframeError(true);
      }
    };
    
    // Function to handle iframe load event
    const handleIframeLoad = () => {
      setLoading(false);
      console.log('Wialon iframe loaded successfully');
    };
    
    // Add the load event listener to the iframe
    const iframe = document.getElementById('wialon-iframe');
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad);
    }

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      if (iframe) {
        iframe.removeEventListener('load', handleIframeLoad);
      }
    };
  }, []);

  // Handler to open Wialon in a new tab
  const openWialonInNewTab = () => {
    window.open(wialonLoginUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-20">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-700 font-medium">Loading Wialon Maps...</p>
          </div>
        </div>
      )}
      
      {!iframeError ? (
        <div className="relative">
          <iframe 
            id="wialon-iframe"
            src={wialonLoginUrl}
            style={iframeStyle}
            title="Wialon Maps & Tracking"
            allowFullScreen
            onError={() => setIframeError(true)}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={openWialonInNewTab}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              title="Open in new tab"
            >
              Open in new tab
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)]">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-2xl mb-4">
            <strong className="font-bold">Cannot embed Wialon: </strong>
            <span className="block sm:inline">
              The Wialon tracking system could not be embedded. This might be due to security restrictions or network issues.
            </span>
          </div>
          <button
            onClick={openWialonInNewTab}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Open Wialon in new tab
          </button>
        </div>
      )}
    </div>
  );
};

export default MapsView;