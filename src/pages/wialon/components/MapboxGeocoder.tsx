import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

const MAPBOX_TOKEN = 'jou-token-hier';

export default function MapboxGeocoderComponent() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [25, -29],
      zoom: 5,
    });

    // Die truuk is om *nie* "new MapboxGeocoder" te probeer as jy 'n namespace gebruik nie
    // Gebruik die .default as jy via import * werk:
    // @ts-ignore
    const geocoder = new (MapboxGeocoder as any).default({
      accessToken: MAPBOX_TOKEN,
      mapboxgl: mapboxgl,
    });

    map.addControl(geocoder);

    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }} />;
}
