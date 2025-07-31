/**
 * Google Maps Places API Service
 * Provides direct access to the Google Places API endpoints
 */

import axios from "axios";

// API configuration
const BASE_URL = "https://maps.googleapis.com/maps/api/place";

// Type definitions for the Places API
export interface PlaceSearchParams {
  input: string;
  inputtype?: "textquery" | "phonenumber";
  fields?: string[];
  locationbias?: string;
  language?: string;
}

export interface PlaceGeometry {
  location: {
    lat: number;
    lng: number;
  };
  viewport?: {
    northeast: {
      lat: number;
      lng: number;
    };
    southwest: {
      lat: number;
      lng: number;
    };
  };
}

export interface PlaceDetails {
  name?: string;
  formatted_address?: string;
  geometry?: PlaceGeometry;
  rating?: number;
  opening_hours?: {
    open_now?: boolean;
    periods?: Array<{
      open: {
        day: number;
        time: string;
      };
      close: {
        day: number;
        time: string;
      };
    }>;
    weekday_text?: string[];
  };
  place_id?: string;
  types?: string[];
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: string[];
  }>;
}

export interface FindPlaceResponse {
  candidates: PlaceDetails[];
  status:
    | "OK"
    | "ZERO_RESULTS"
    | "INVALID_REQUEST"
    | "OVER_QUERY_LIMIT"
    | "REQUEST_DENIED"
    | "UNKNOWN_ERROR";
}

export interface PlacesServiceError extends Error {
  status?: string;
  code?: string;
}

class GoogleMapsService {
  private apiKey: string;

  constructor() {
    // Get API key from environment variables
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

    if (!this.apiKey) {
      console.warn(
        "Google Maps API key is not set. Set VITE_GOOGLE_MAPS_API_KEY in your environment variables."
      );
    }
  }

  /**
   * Find a place based on text search
   * @param params Search parameters
   * @returns Promise with search results
   */
  async findPlaceFromText(params: PlaceSearchParams): Promise<FindPlaceResponse> {
    try {
      const { input, inputtype = "textquery", fields = [], locationbias, language } = params;

      const queryParams = new URLSearchParams({
        key: this.apiKey,
        input,
        inputtype,
      });

      if (fields.length > 0) {
        queryParams.append("fields", fields.join(","));
      }

      if (locationbias) {
        queryParams.append("locationbias", locationbias);
      }

      if (language) {
        queryParams.append("language", language);
      }

      const response = await axios.get<FindPlaceResponse>(
        `${BASE_URL}/findplacefromtext/json?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error("Error finding place from text:", error);
      const placesError = new Error("Failed to find place from text") as PlacesServiceError;

      if (axios.isAxiosError(error) && error.response) {
        placesError.status = String(error.response.status);
        placesError.code = error.code;
      }

      throw placesError;
    }
  }

  /**
   * Helper method to create a location bias string
   * @param options Location bias options
   * @returns Location bias string for the API
   */
  createLocationBias(options: {
    type: "point" | "circle" | "rectangle";
    params: number[];
  }): string {
    const { type, params } = options;

    switch (type) {
      case "point":
        // params should be [latitude, longitude]
        return `point:${params[0]},${params[1]}`;
      case "circle":
        // params should be [latitude, longitude, radius]
        return `circle:${params[2]}@${params[0]},${params[1]}`;
      case "rectangle":
        // params should be [south, west, north, east]
        return `rectangle:${params[0]},${params[1]}|${params[2]},${params[3]}`;
      default:
        throw new Error("Invalid location bias type");
    }
  }

  /**
   * Convert PlaceDetails to the application's Location format
   * @param place The place details from the API
   * @returns A Location object compatible with the app
   */
  placeToLocation(place: PlaceDetails): import("../types/mapTypes").Location {
    if (!place.geometry?.location) {
      throw new Error("Place has no location geometry");
    }

    return {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      title: place.name || "Unnamed place",
      address: place.formatted_address,
      info: place.types?.join(", "),
    };
  }
}

// Create singleton instance
const googleMapsService = new GoogleMapsService();
export default googleMapsService;
