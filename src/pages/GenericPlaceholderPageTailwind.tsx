import React from 'react';

interface GenericPlaceholderPageProps {
  title: string;
}

/**
 * A generic placeholder component for routes that are not yet implemented
 * Using Tailwind CSS instead of Material UI
 */
const GenericPlaceholderPage: React.FC<GenericPlaceholderPageProps> = ({ title }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 mt-8 flex flex-col items-center text-center">
        {/* Construction Icon */}
        <div className="text-yellow-500 mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h1>
        
        <p className="text-gray-600 mb-4">
          This feature is currently under development.
        </p>
        
        <div className="mt-4">
          <p className="text-gray-700">
            Check back soon for updates or contact the development team for more information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenericPlaceholderPage;
