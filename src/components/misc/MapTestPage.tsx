import React from 'react';
import GoogleMapsTest from '../components/maps/GoogleMapsTest';

const MapTestPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Google Maps Integration Test</h1>
        <p className="text-gray-600">This page tests both the JavaScript API and Embed API implementations</p>
      </div>
      
      <GoogleMapsTest />
      
      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <h2 className="font-medium mb-2">Integration Instructions:</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Ensure VITE_GOOGLE_MAPS_API_KEY is set in your .env file</li>
          <li>Optional: Set VITE_GOOGLE_MAPS_IFRAME_URL for iframe embed usage</li>
          <li>Use the googleMapsLoader.ts utility to load maps dynamically</li>
          <li>For best performance, avoid loading the API in index.html</li>
        </ul>
      </div>
    </div>
  );
};

export default MapTestPage;
