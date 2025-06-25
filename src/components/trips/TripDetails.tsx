import React from 'react';
import { Trip } from '../../types';
import TripDashboard from './TripDashboard';

interface TripDetailsProps {
  trip: Trip;
  onBack: () => void;
}

const TripDetails: React.FC<TripDetailsProps> = ({ trip, onBack }) => {
  return <TripDashboard trip={trip} onBack={onBack} />;
};

export default TripDetails;