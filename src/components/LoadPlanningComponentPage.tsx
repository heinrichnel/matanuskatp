import React from 'react';
import { useParams } from 'react-router-dom';
import LoadPlanningComponent from './TripManagement/LoadPlanningComponent';

const LoadPlanningComponentPage: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();

  // Jy kan verder tripId validate of handling bysit
  if (!tripId) return <div className="p-8 text-red-500">No tripId specified in URL.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadPlanningComponent tripId={tripId} />
    </div>
  );
};

export default LoadPlanningComponentPage;
