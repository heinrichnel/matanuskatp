// Import with require to bypass TypeScript module resolution issues
// @ts-ignore
const MapboxGeocoder = require("@mapbox/mapbox-gl-geocoder");
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import React from "react";

// Define control position type explicitly since there might be type issues
type ControlPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface MapboxGeocoderProps {
  map: mapboxgl.Map;
  options?: {
    accessToken: string;
    mapboxgl: typeof mapboxgl;
    marker?: boolean;
    placeholder?: string;
    [key: string]: any;
  };
  onResult?: (event: { result: any }) => void;
  onError?: (event: any) => void;
  position?: ControlPosition;
}

/**
 * Add Mapbox Geocoder Component
 *
 * This component wraps the Mapbox Geocoder functionality
 * and provides React integration for the Mapbox Geocoder control.
 */
class MapboxGeocoderComponent extends React.Component<MapboxGeocoderProps> {
  private geocoder: any = null;
  private mapboxGeocoderContainerRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const { map, options, onResult, onError } = this.props;

    this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken || "",
      mapboxgl,
      ...options,
    });

    if (onResult && this.geocoder) {
      this.geocoder.on("result", onResult);
    }

    if (onError && this.geocoder) {
      this.geocoder.on("error", onError);
    }

    // Add the geocoder to the map
    if (map && this.geocoder) {
      // Use the position prop if provided, otherwise default to 'top-left'
      const controlPosition = this.props.position || "top-left";
      map.addControl(this.geocoder, controlPosition);
    } else {
      console.warn("Map is not available for the geocoder");
    }
  }

  componentWillUnmount() {
    const { map, onResult, onError } = this.props;

    // Clean up
    if (this.geocoder) {
      if (onResult) this.geocoder.off("result", onResult);
      if (onError) this.geocoder.off("error", onError);
      if (map) map.removeControl(this.geocoder);
    }
  }

  render() {
    return <div ref={this.mapboxGeocoderContainerRef} />;
  }
}

export default MapboxGeocoderComponent;
