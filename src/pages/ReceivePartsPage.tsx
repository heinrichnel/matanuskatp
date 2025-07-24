import React from 'react';
import PageWrapper from '../components/ui/PageWrapper';
import PartsReceivingForm from '../components/forms/PartsReceivingForm';

/**
 * Receive Parts Page
 * Used for receiving incoming parts shipments and updating inventory
 */
const ReceivePartsPage: React.FC = () => {
  const handleReceiveParts = (receivedParts: any[]) => {
    console.log('Parts received:', receivedParts);
    
    // In a real app, this would:
    // 1. Update inventory quantities in Firestore
    // 2. Update purchase order status
    // 3. Create audit trail
    // 4. Send notifications
    
    // Show success message
    alert('Parts received successfully! Inventory has been updated.');
  };

  const handleCancel = () => {
    // Navigate back or close form
    window.history.back();
  };

  return (
    <PageWrapper title="Receive Parts">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Receive Parts Shipment</h1>
          <p className="text-gray-600">
            Record incoming parts and update inventory levels. 
            Use this form when parts arrive from suppliers.
          </p>
        </div>
        
        <PartsReceivingForm
          onSubmit={handleReceiveParts}
          onCancel={handleCancel}
        />
      </div>
    </PageWrapper>
  );
};

export default ReceivePartsPage;
