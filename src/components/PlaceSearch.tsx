/**
 * Example component for searching places using the Google Places API
 */

import React, { FormEvent, useState } from "react";
import useGooglePlaces from "../hooks/useGooglePlaces";
import googleMapsService from "../services/googleMapsService";
import { Location } from "../types/mapTypes";

interface PlaceSearchProps {
  onPlaceSelect?: (location: Location) => void;
}

const PlaceSearch: React.FC<PlaceSearchProps> = ({ onPlaceSelect }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { loading, error, places, findPlaceFromText, placesToLocations } = useGooglePlaces();

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    await findPlaceFromText({
      input: searchQuery,
      fields: ["formatted_address", "name", "geometry", "place_id", "types"],
    });
  };

  const handleSelectPlace = (place: Location) => {
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
  };

  return (
    <div className="place-search">
      <form onSubmit={handleSearch} className="place-search__form">
        <div className="place-search__input-group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a place..."
            className="place-search__input"
            disabled={loading}
          />
          <button
            type="submit"
            className="place-search__button"
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="place-search__error">
          Error: {error.message}
          {error.status && ` (Status: ${error.status})`}
        </div>
      )}

      {places.length > 0 && (
        <div className="place-search__results">
          <h3>Search Results</h3>
          <ul className="place-search__list">
            {places.map((place, index) => (
              <li key={place.place_id || index} className="place-search__item">
                <div
                  className="place-search__item-content"
                  onClick={() => handleSelectPlace(googleMapsService.placeToLocation(place))}
                >
                  <h4>{place.name}</h4>
                  <p>{place.formatted_address}</p>
                  {place.geometry?.location && (
                    <p className="place-search__coordinates">
                      {place.geometry.location.lat.toFixed(6)},
                      {place.geometry.location.lng.toFixed(6)}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlaceSearch;
