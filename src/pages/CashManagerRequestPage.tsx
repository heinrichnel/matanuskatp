import React from 'react';
import CashManagerRequestForm from '../components/forms/CashManagerRequestForm';

const CashManagerRequestPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Cash Manager Request Form</h1>
      <CashManagerRequestForm />
    </div>
  );
};

export default CashManagerRequestPage;
