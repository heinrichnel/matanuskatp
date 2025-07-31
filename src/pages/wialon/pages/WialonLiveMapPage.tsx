// src/pages/wialon/pages/WialonLiveMapPage.tsx
import React, { useState, useEffect } from 'react';
import WialonUnitMap from '../../../pages/maps/WialonUnitMap'; // Import the map component
import { WialonUnit } from '../../../types/wialon'; // Import your WialonUnit type
import LoadingIndicator from '../../../components/ui/LoadingIndicator';
import ErrorMessage from '../../../components/ui/ErrorMessage';
import Card, { CardContent } from '../../../components/ui/Card';
import { MapPinIcon, TruckIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../../utils/helpers';
import { getUnitById, initializeWialon } from '../../../api/wialon';
import { logError, ErrorCategory, ErrorSeverity } from '../../../utils/errorHandling';

// Default unit ID to display - this could be made configurable or selectable
const DEFAULT_UNIT_ID = 352625693727222;

// Google Maps API Key - should be stored in environment variables
const MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_Maps_API_KEY';

const WialonLiveMapPage: React.FC = () => {
  const [unitData, setUnitData] = useState<WialonUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUnit = async () => {
      try {
        setLoading(true);
        setError(null);

        // First ensure Wialon is initialized
        const initialized = await initializeWialon();

        if (!initialized) {
          throw new Error("Failed to initialize Wialon connection");
        }

        // Fetch the unit using the real API
        const unit = await getUnitById(DEFAULT_UNIT_ID);

        if (!unit) {
          throw new Error(`Unit with ID ${DEFAULT_UNIT_ID} not found`);
        }

        setUnitData(unit);
      } catch (err) {
        console.error("Error loading Wialon unit:", err);
        const errorMessage = "Failed to load Wialon unit data. Please check API key and unit status.";
        setError(errorMessage);
        logError(err as Error, {
          category: ErrorCategory.NETWORK,
          severity: ErrorSeverity.ERROR,
          message: errorMessage,
          context: { component: "WialonLiveMapPage" }
        });
      } finally {
        setLoading(false);
      }
    };

    loadUnit();

    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(loadUnit, 30000);
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Live Vehicle Tracking (Wialon)</h1>
      <p className="text-gray-600">Displaying live location and details for a selected Wialon unit.</p>

      <Card>
        <CardContent>
          {loading && (
            <div className="flex justify-center items-center h-[600px]">
              <LoadingIndicator />
              <span className="ml-3 text-gray-700">Loading map and unit data...</span>
            </div>
          )}

          {error && <ErrorMessage message={error} />}

          {!loading && !error && unitData && unitData.lastPosition ? (
            <WialonUnitMap
              googleMapsApiKey={MAPS_API_KEY}
              unit={unitData}
              mapContainerStyle={{ width: '100%', height: '600px', borderRadius: '8px' }}
              zoom={15} // Zoom in closer for a single unit
            />
          ) : (
            !loading && !unitData && (
              <div className="text-center py-12 text-gray-500">
                <TruckIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900">No unit data to display</h3>
                <p>Ensure a unit is selected and has valid position data.</p>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Display unit details below the map */}
      {!loading && !error && unitData && (
        <Card>
          <CardContent>
            <h3 className="text-xl font-semibold mb-3">Unit Details: {unitData.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <p><strong>UID:</strong> {unitData.uid}</p>
              <p><strong>Hardware:</strong> {unitData.hardwareType || 'N/A'}</p>
              <p><strong>Registration:</strong> {unitData.profile?.registration_plate || 'N/A'}</p>
              <p><strong>Brand:</strong> {unitData.profile?.brand || 'N/A'}</p>
              <p><strong>Model:</strong> {unitData.profile?.model || 'N/A'}</p>
              <p><strong>Vehicle Class:</strong> {unitData.profile?.vehicle_class || 'N/A'}</p>

              {unitData.lastPosition && (
                <>
                  <p><strong>Last Lat:</strong> {unitData.lastPosition.latitude?.toFixed(6) || unitData.lastPosition.y?.toFixed(6) || 'N/A'}</p>
                  <p><strong>Last Lng:</strong> {unitData.lastPosition.longitude?.toFixed(6) || unitData.lastPosition.x?.toFixed(6) || 'N/A'}</p>
                  <p><strong>Speed:</strong> {unitData.lastPosition.speed || unitData.lastPosition.s || 'N/A'} km/h</p>
                  <p><strong>Last Update:</strong> {
                    (unitData.lastPosition.timestamp || unitData.lastPosition.t) ?
                    formatDate(new Date((unitData.lastPosition.timestamp || unitData.lastPosition.t) * 1000).toISOString()) :
                    'N/A'
                  }</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WialonLiveMapPage;
