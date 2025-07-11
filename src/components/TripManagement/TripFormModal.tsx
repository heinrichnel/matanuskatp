import React from 'react';
import Modal from '../ui/Modal';
import TripForm from './TripForm';
import { Trip } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface TripFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTrip?: Trip;
}

const TripFormModal: React.FC<TripFormModalProps> = ({ isOpen, onClose, editingTrip }) => {
  const { addTrip, updateTrip } = useAppContext();

  const handleSubmit = async (tripData: Omit<Trip, 'id' | 'costs' | 'status' | 'additionalCosts'>) => {
    try {
      if (editingTrip) {
        // Update existing trip
        await updateTrip({
          ...editingTrip,
          ...tripData
        });
        console.log('Trip updated successfully');
      } else {
        // Add new trip
        await addTrip(tripData);
        console.log('Trip added successfully');
      }
      // Close the modal after successful submission
      onClose();
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip. Please try again.');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={editingTrip ? 'Edit Trip' : 'Add New Trip'}
      maxWidth="lg"
    >
      <TripForm
        trip={editingTrip}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default TripFormModal;
