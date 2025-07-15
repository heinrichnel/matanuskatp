import React from 'react';

const MapsView: React.FC = () => {
  // Wialon login URL with token
  const wialonLoginUrl = "https://hosting.wialon.com/?token=c1099bc37c906fd0832d8e783b60ae0dD9D1A721B294486AC08F8AA3ACAC2D2FD45FF053&lang=en";
  
  // Iframe style
  const iframeStyle = {
    width: '100%',
    height: 'calc(100vh - 100px)',
    border: 'none'
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <iframe 
        src={wialonLoginUrl}
        style={iframeStyle}
        title="Wialon Maps & Tracking"
        allowFullScreen
      />
    </div>
  );
};

export default MapsView;