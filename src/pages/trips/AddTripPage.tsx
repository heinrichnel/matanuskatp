import React from 'react';
import TripForm from '../../components/TripManagement/TripForm';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const AddTripPage: React.FC = () => {
  const { addTrip } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (tripData: any) => {
    // Here you would typically call addTrip from context
    console.log('Submitting new trip:', tripData);
    addTrip && addTrip(tripData);
    navigate('/trips/active');
  };

  const handleCancel = () => {
    navigate('/trips');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Trip</h1>
          <p className="text-gray-600">Create a new trip record in the system</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <TripForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default AddTripPage;
