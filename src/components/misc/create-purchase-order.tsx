import React, { useState } from 'react';
import PurchaseOrderForm from '../../components/Workshop Management/PurchaseOrderForm';

/**
 * Create Purchase Order Page
 * Used for creating purchase orders for workshop parts and supplies
 */
const CreatePurchaseOrderPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock data for initial form values
  const initialData = {
    id: '',
    poNumber: 'PO-' + new Date().getTime().toString().substring(6),
    title: 'Workshop Parts Order',
    description: 'Order for vehicle maintenance parts',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    vendor: '',
    requester: 'Workshop Manager',
    priority: 'Medium' as const,
    status: 'Draft' as const,
    terms: 'Net 30',
    poType: 'Parts',
    shippingAddress: 'Main Workshop, 123 Garage Lane',
    items: [],
    subTotal: 0,
    tax: 15,
    shipping: 0,
    grandTotal: 0,
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'Workshop Manager',
    attachments: []
  };

  const handleSubmit = (data: any) => {
    console.log('Purchase order submitted:', data);
    setIsSubmitted(true);
    
    // In a real app, this would save to Firestore
    setTimeout(() => {
      setIsSubmitted(false);
      window.location.href = '/workshop/purchase-orders'; // Redirect to purchase orders list
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Create Purchase Order</h1>
          {isSubmitted && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Purchase order created successfully!
            </div>
          )}
        </div>
        
        <p className="text-gray-600 mb-6">
          Create a new purchase order for parts or supplies needed in the workshop.
          Fill in supplier details, add items, and calculate totals.
        </p>
        
        <PurchaseOrderForm 
          initialData={initialData}
          onSave={handleSubmit}
          onCancel={() => window.history.back()}
          onGeneratePDF={(id) => console.log('Generating PDF for purchase order:', id)}
        />
      </div>
    </div>
  );
};

export default CreatePurchaseOrderPage;
