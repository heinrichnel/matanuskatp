// Type definitions for Google Maps JavaScript API
// This file provides TypeScript support for the Google Maps API

declare namespace google {
  namespace maps {
    // Add importLibrary method for the modern Google Maps loading pattern
    function importLibrary(libraryName: string): Promise<any>;
    
    class Map {
      constructor(mapDiv: Element | null, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      setMapTypeId(mapTypeId: string): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      panBy(x: number, y: number): void;
      setOptions(options: MapOptions): void;
      getCenter(): LatLng;
      getZoom(): number;
      getBounds(): LatLngBounds | undefined;
      getMapTypeId(): string;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      disableDefaultUI?: boolean;
      clickableIcons?: boolean;
      disableDoubleClickZoom?: boolean;
      draggable?: boolean;
      fullscreenControl?: boolean;
      gestureHandling?: string;
      mapTypeControl?: boolean;
      maxZoom?: number;
      minZoom?: number;
      rotateControl?: boolean;
      scaleControl?: boolean;
      scrollwheel?: boolean;
      streetViewControl?: boolean;
      styles?: MapTypeStyle[];
      zoomControl?: boolean;
    }

    interface MapTypeStyle {
      elementType?: string;
      featureType?: string;
      stylers: any[];
    }

    class LatLng {
      constructor(lat: number, lng: number, noWrap?: boolean);
      lat(): number;
      lng(): number;
      toString(): string;
      toUrlValue(precision?: number): string;
      toJSON(): LatLngLiteral;
      equals(other: LatLng): boolean;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      contains(latLng: LatLng | LatLngLiteral): boolean;
      equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      extend(latLng: LatLng | LatLngLiteral): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      isEmpty(): boolean;
      toJSON(): LatLngBoundsLiteral;
      toSpan(): LatLng;
      toString(): string;
      toUrlValue(precision?: number): string;
      union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setTitle(title: string): void;
      setLabel(label: string | MarkerLabel): void;
      setIcon(icon: string | Icon | Symbol): void;
      setDraggable(draggable: boolean): void;
      setVisible(visible: boolean): void;
      getPosition(): LatLng | null;
      getTitle(): string;
      getLabel(): string | MarkerLabel;
      getIcon(): string | Icon | Symbol;
      getDraggable(): boolean;
      getVisible(): boolean;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      label?: string | MarkerLabel;
      icon?: string | Icon | Symbol;
      draggable?: boolean;
      visible?: boolean;
      clickable?: boolean;
      animation?: number;
      optimized?: boolean;
      zIndex?: number;
    }

    interface MarkerLabel {
      text: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
    }

    interface Icon {
      url: string;
      size?: Size;
      scaledSize?: Size;
      origin?: Point;
      anchor?: Point;
      labelOrigin?: Point;
    }

    class Size {
      constructor(width: number, height: number, widthUnit?: string, heightUnit?: string);
      equals(other: Size): boolean;
      width: number;
      height: number;
    }

    class Point {
      constructor(x: number, y: number);
      equals(other: Point): boolean;
      x: number;
      y: number;
    }

    class Symbol {
      constructor(opts: SymbolOptions);
    }

    interface SymbolOptions {
      path: string | number;
      fillColor?: string;
      fillOpacity?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
      rotation?: number;
    }

    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      close(): void;
      open(map: Map, anchor?: Marker): void;
      setContent(content: string | Element): void;
      setPosition(position: LatLng | LatLngLiteral): void;
      setZIndex(zIndex: number): void;
    }

    interface InfoWindowOptions {
      content?: string | Element;
      position?: LatLng | LatLngLiteral;
      maxWidth?: number;
      pixelOffset?: Size;
      zIndex?: number;
    }

    const MapTypeId: {
      HYBRID: string;
      ROADMAP: string;
      SATELLITE: string;
      TERRAIN: string;
    };
  }
}