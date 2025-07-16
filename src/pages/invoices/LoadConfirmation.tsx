import React from 'react';
import LoadConfirmationForm from '../../components/LoadConfirmation/LoadConfirmation';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';

/**
 * LoadConfirmation Page Component
 * 
 * This page renders the load confirmation form allowing users to generate
 * load confirmation documents for both South Africa and Zimbabwe entities.
 */
const LoadConfirmationPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Load Confirmation Generator</h2>
          <p className="text-gray-600">Generate load confirmation documents for customers and transporters</p>
        </CardHeader>
        <CardContent>
          <LoadConfirmationForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadConfirmationPage;
