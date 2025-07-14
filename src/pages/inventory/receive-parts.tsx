import React, { useState } from 'react';
import PartsReceivingForm from '../../components/Inventory Management/PartsReceivingForm';

/**
 * Receive Parts Page
 * Used for receiving shipments of parts into inventory
 */
const ReceivePartsPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (data: any) => {
    console.log('Parts receiving form submitted:', data);
    setIsSubmitted(true);
    
    // In a real app, this would save to Firestore
    setTimeout(() => {
      setIsSubmitted(false);
      window.location.href = '/inventory/stock'; // Redirect to stock management
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Receive Parts</h1>
          {isSubmitted && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Parts received successfully!
            </div>
          )}
        </div>
        
        <p className="text-gray-600 mb-6">
          Use this form to record receipt of parts and manage inventory. 
          You can scan items, enter serial numbers, and update stock levels.
        </p>
        
        <PartsReceivingForm 
          poNumber="PO-2023-07-14"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ReceivePartsPage;
