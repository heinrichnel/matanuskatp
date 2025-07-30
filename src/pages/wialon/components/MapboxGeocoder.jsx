import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import React from "react";
import { createRoot } from "react-dom/client";

/**
 * Add Mapbox Geocoder Component
 *
 * This component wraps the Mapbox Geocoder functionality
 * and provides React integration for the Mapbox Geocoder control.
 */
class MapboxGeocoder extends React.Component {
  geocoder = null;

  constructor(props) {
    super(props);
    this.mapboxGeocoderContainerRef = React.createRef();
  }

  componentDidMount() {
    const { map, options, onResult, onError } = this.props;

    // Dynamically import MapboxGeocoder
    import("@mapbox/mapbox-gl-geocoder").then((MapboxGeocoder) => {
      this.geocoder = new MapboxGeocoder.default({
        accessToken: mapboxgl.accessToken,
        mapboxgl,
        ...options,
      });

      if (onResult) {
        this.geocoder.on("result", onResult);
      }

      if (onError) {
        this.geocoder.on("error", onError);
      }

      // Create container for Geocoder
      const container = this.mapboxGeocoderContainerRef.current;

      // Create a React root for the Mapbox Geocoder
      const root = createRoot(container);
      root.render(<div id="geocoder-container" className="mapboxgl-ctrl-geocoder" />);

      // Add the geocoder to the map
      if (map) {
        map.addControl(this.geocoder, this.props.position || "top-left");
      } else {
        console.warn("Map is not available for the geocoder");
      }
    });

    return () => {
      // Clean up
      if (this.geocoder) {
        if (onResult) this.geocoder.off("result", onResult);
        if (onError) this.geocoder.off("error", onError);
        if (map) map.removeControl(this.geocoder);
      }
    };
  }

  render() {
    return <div ref={this.mapboxGeocoderContainerRef} />;
  }
}

export default MapboxGeocoder;
