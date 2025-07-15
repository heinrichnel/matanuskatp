import React from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../../components/Workshop Management/JobCard';

const NewJobCardPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/workshop/job-cards');
  };

  const handleSave = (jobCard: any) => {
    console.log('Saving job card:', jobCard);
    // Here you would save the job card data to your backend
    
    // Navigate back to job cards list
    navigate('/workshop/job-cards');
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <button 
          onClick={handleBack}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md flex items-center"
        >
          <span>← Back to Job Cards</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Job Card</h1>
        <JobCard />
      </div>
    </div>
  );
};

export default NewJobCardPage;
