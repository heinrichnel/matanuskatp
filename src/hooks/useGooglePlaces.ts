/**
 * React hook for interacting with the Google Maps Places API
 */

import { useCallback, useState } from "react";
import googleMapsService, {
  PlaceDetails,
  PlaceSearchParams,
  PlacesServiceError,
} from "../services/googleMapsService";
import { Location } from "../types/mapTypes";

interface UseGooglePlacesReturn {
  loading: boolean;
  error: PlacesServiceError | null;
  places: PlaceDetails[];
  findPlaceFromText: (params: PlaceSearchParams) => Promise<void>;
  placesToLocations: () => Location[];
  clearResults: () => void;
}

/**
 * Hook for interacting with the Google Maps Places API
 * @returns Object with places data and API methods
 */
export const useGooglePlaces = (): UseGooglePlacesReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<PlacesServiceError | null>(null);
  const [places, setPlaces] = useState<PlaceDetails[]>([]);

  /**
   * Search for places using text input
   * @param params Search parameters
   */
  const findPlaceFromText = useCallback(async (params: PlaceSearchParams): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await googleMapsService.findPlaceFromText(params);

      if (response.status === "OK") {
        setPlaces(response.candidates);
      } else {
        const serviceError = new Error(
          `Google Maps API error: ${response.status}`
        ) as PlacesServiceError;
        serviceError.status = response.status;
        setError(serviceError);
        setPlaces([]);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err as PlacesServiceError);
      } else {
        setError(new Error("Unknown error occurred") as PlacesServiceError);
      }
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Convert the current places results to Location objects
   * @returns Array of Location objects
   */
  const placesToLocations = useCallback((): Location[] => {
    return places.map((place) => googleMapsService.placeToLocation(place));
  }, [places]);

  /**
   * Clear current search results
   */
  const clearResults = useCallback(() => {
    setPlaces([]);
    setError(null);
  }, []);

  return {
    loading,
    error,
    places,
    findPlaceFromText,
    placesToLocations,
    clearResults,
  };
};

export default useGooglePlaces;
