import TripReport from "../components/reports/TripReport";
import { useParams } from "react-router-dom";
import { useFirestoreDoc } from "../hooks/useFirestoreDoc";

const TripReportPage = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { data: trip, loading } = useFirestoreDoc("trips", tripId);

  // Add your delay addition logic here
  // Currently not used, so no parameters needed
  const handleAddDelay = () => {
    // Add delay to Firestore or your state here
    // Example: updateTripDelays(tripId, delay)
  };

  return loading || !trip ? (
    <div>Loading...</div>
  ) : (
    <TripReport trip={trip} onAddDelay={handleAddDelay} />
  );
};

export default TripReportPage;

