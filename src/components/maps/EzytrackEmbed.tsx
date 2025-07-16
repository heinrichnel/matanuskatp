import React from 'react';

export const EzytrackEmbed: React.FC = () => {
  return (
    <div className="w-full h-full">
      <iframe
        title="EzyTrack Vehicle Map"
        src="https://www.fleet.ezytrack.co.zw/locator/index.html?t=c1099bc37c906fd0832d8e783b60ae0d23073D0F13B61B2FB42657C8AF1F4F1B3B61190A"
        width="100%"
        height="100%"
        style={{ minHeight: "600px" }}
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
}

export default EzytrackEmbed;