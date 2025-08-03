/**
 * Path resolver configuration for TypeScript
 * This file helps TypeScript understand path aliases in the project
 */

declare module '@/*' {
  const value: any;
  export default value;
  export * from value;
}

// Add specific modules that might be causing issues
declare module 'recharts' {
  export const CartesianGrid: any;
  export const Legend: any;
  export const Line: any;
  export const LineChart: any;
  export const ResponsiveContainer: any;
  export const Tooltip: any;
  export const XAxis: any;
  export const YAxis: any;
  export type TooltipProps<TValue, TName> = {
    active?: boolean;
    payload?: Array<{
      value: TValue;
      name: TName;
      dataKey: string;
      color?: string;
      [key: string]: any;
    }>;
    label?: any;
    [key: string]: any;
  };
}

// Leaflet types
declare module 'leaflet-control-geocoder' {
  export { };
}
