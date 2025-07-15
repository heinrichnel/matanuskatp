import React from 'react';
import InspectionForm from '../../components/Workshop Management/InspectionForm';
import { useNavigate } from 'react-router-dom';

const NewInspectionPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/workshop/inspections');
  };

  const handleSave = (inspection: any) => {
    console.log('Saving inspection:', inspection);
    // Here you would save the inspection data to your backend
    
    // Navigate back to inspections list
    navigate('/workshop/inspections');
  };

  const handleComplete = (inspection: any) => {
    console.log('Completing inspection:', inspection);
    // Here you would save the completed inspection data to your backend
    
    // Navigate back to inspections list
    navigate('/workshop/inspections');
  };

  return (
    <div className="p-4">
      <InspectionForm 
        onBack={handleBack}
        onSave={handleSave}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default NewInspectionPage;
