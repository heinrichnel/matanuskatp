import React from 'react';

const GoogleMapPage: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const lat = -26.2041;
  const lng = 28.0473;

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        src={`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lng}&zoom=12`}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default GoogleMapPage;
