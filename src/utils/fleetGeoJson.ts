/**
 * Fleet GeoJSON Converter
 * 
 * This utility converts Wialon fleet data to GeoJSON format for Google Maps integration.
 * It extracts key vehicle information and structures it as GeoJSON features that can be
 * rendered on a map.
 */

// Type definitions for Wialon fleet data structure
interface WialonUnit {
  type: string;
  version: string;
  mu: number;
  general: {
    n: string;
    uid: string;
    uid2: string;
    ph: string;
    ph2: string;
    psw: string;
    hw: string;
  };
  icon?: {
    lib: string;
    url: string;
    imgRot: string;
  };
  profile?: Array<{
    id: number;
    n: string;
    v: string;
    ct: number;
    mt: number;
  }>;
  sensors?: Array<{
    id: number;
    n: string;
    t: string;
    d: string;
    m: string;
    p: string;
    f: number;
    c: string;
    vt: number;
    vs: number;
    tbl: any[];
    ct: number;
    mt: number;
  }>;
  // Additional Wialon properties as needed
}

// GeoJSON types
interface GeoJsonFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    id: string;
    name: string;
    vehicleType: string;
    hardware: string;
    brand?: string;
    model?: string;
    year?: string;
    fuelType?: string;
    phone?: string;
    sensors?: string[];
    icon?: string;
    [key: string]: any; // Allow additional properties
  };
}

interface GeoJsonCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

/**
 * Extracts a profile property value from a Wialon unit
 * @param unit The Wialon unit
 * @param propertyName The name of the profile property to extract
 * @returns The property value or undefined if not found
 */
const getProfileProperty = (unit: WialonUnit, propertyName: string): string | undefined => {
  if (!unit.profile) return undefined;
  
  const property = unit.profile.find(item => item.n === propertyName);
  return property?.v;
};

/**
 * Get sensor names from a Wialon unit
 * @param unit The Wialon unit
 * @returns Array of sensor names
 */
const getSensorNames = (unit: WialonUnit): string[] => {
  if (!unit.sensors) return [];
  
  return unit.sensors.map(sensor => sensor.n);
};

/**
 * Converts Wialon units array to GeoJSON format
 * @param wialonUnits Array of Wialon unit objects
 * @param defaultLocation Default coordinates to use if not provided [longitude, latitude]
 * @returns GeoJSON collection object
 */
export const convertFleetToGeoJson = (
  wialonUnits: WialonUnit[], 
  defaultLocation: [number, number] = [28.2293, -25.7479] // Default to Pretoria
): GeoJsonCollection => {
  const features: GeoJsonFeature[] = wialonUnits.map(unit => {
    // Extract common properties from profile
    const brand = getProfileProperty(unit, 'brand');
    const model = getProfileProperty(unit, 'model');
    const year = getProfileProperty(unit, 'year');
    const vehicleClass = getProfileProperty(unit, 'vehicle_class') || 'vehicle';
    const fuelType = getProfileProperty(unit, 'primary_fuel_type');
    const engineModel = getProfileProperty(unit, 'engine_model');
    const cargoType = getProfileProperty(unit, 'cargo_type');

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: defaultLocation // This should be updated with real-time coordinates
      },
      properties: {
        id: unit.general.uid,
        name: unit.general.n,
        vehicleType: vehicleClass,
        hardware: unit.general.hw,
        phone: unit.general.ph,
        brand,
        model,
        year,
        fuelType,
        engineModel,
        cargoType,
        sensors: getSensorNames(unit),
        icon: unit.icon?.url,
        // Add more properties as needed
      }
    };
  });

  return {
    type: 'FeatureCollection',
    features
  };
};

/**
 * Wialon fleet data from the system
 * This can be replaced with dynamic data from an API
 */
export const wialonFleetData: WialonUnit[] = [
  {
    "type": "avl_unit",
    "version": "b4",
    "mu": 0,
    "general": {
      "n": "21H - ADS 4865",
      "uid": "352592576757652",
      "uid2": "",
      "ph": "+263773717259",
      "ph2": "",
      "psw": "",
      "hw": "Teltonika FMB920"
    },
    "icon": {
      "lib": "600000003",
      "url": "A_39.png",
      "imgRot": "0"
    },
    "profile": [
      { "id": 1, "n": "vehicle_class", "v": "heavy_truck", "ct": 1729232417, "mt": 1748913921 },
      { "id": 2, "n": "brand", "v": "Scania", "ct": 1748913921, "mt": 1748913921 },
      { "id": 3, "n": "model", "v": "G460", "ct": 1748913921, "mt": 1748913921 },
      { "id": 4, "n": "year", "v": "2010", "ct": 1748913921, "mt": 1748913921 },
      { "id": 5, "n": "color", "v": "White", "ct": 1748913921, "mt": 1748913921 },
      { "id": 6, "n": "engine_model", "v": "460HP", "ct": 1748913921, "mt": 1748913921 },
      { "id": 7, "n": "primary_fuel_type", "v": "Diesel", "ct": 1748913921, "mt": 1748913921 },
      { "id": 8, "n": "cargo_type", "v": "32 Ton", "ct": 1748913921, "mt": 1748913921 }
    ],
    "sensors": [
      { "id": 1, "n": "External Voltage", "t": "voltage", "d": "", "m": "V", "p": "io_66/const1000", "f": 0, "c": "{\"act\":1,\"appear_in_popup\":true,\"ci\":{},\"cm\":1,\"pos\":5,\"show_time\":false}", "vt": 0, "vs": 0, "tbl": [], "ct": 1729179185, "mt": 1729179185 },
      { "id": 2, "n": "LHS Tank", "t": "fuel level", "d": "|1:0:348.52:40:697.03:80:1045.54:120:1394.05:160:1742.56:200:2091.06:240:2439.57:280:2788.08:320:3136.59:360:3485.1:400:3515:440:3651:450", "m": "l", "p": "io_273", "f": 64, "c": "{\"act\":1,\"appear_in_popup\":true,\"calc_fuel\":2,\"ci\":{},\"cm\":1,\"fuel_params\":{\"fillingsJoinInterval\":300,\"filterQuality\":20,\"flags\":7874,\"ignoreStayTimeout\":10,\"minFillingVolume\":20,\"minTheftTimeout\":10,\"minTheftVolume\":20,\"theftsJoinInterval\":300},\"lower_bound\":1,\"mu\":0,\"pos\":4,\"show_time\":false,\"upper_bound\":3651,\"flags\":\"64\"}", "vt": 0, "vs": 0, "tbl": [{ "x": 1, "a": 0.115101289134, "b": -0.115101289134 }, { "x": 348.52, "a": 0.114774324984, "b": -0.00114774325 }, { "x": 697.03, "a": 0.114774324984, "b": -0.00114774325 }, { "x": 1045.54, "a": 0.114774324984, "b": -0.00114774325 }, { "x": 1394.05, "a": 0.114774324984, "b": -0.00114774325 }, { "x": 1742.56, "a": 0.114777618364, "b": -0.006886657102 }, { "x": 2091.06, "a": 0.114774324984, "b": 0 }, { "x": 2439.57, "a": 0.114774324984, "b": 0 }, { "x": 2788.08, "a": 0.114774324984, "b": 0 }, { "x": 3136.59, "a": 0.114774324984, "b": 0 }, { "x": 3485.1, "a": 1.33779264214, "b": -4262.34113712 }, { "x": 3515, "a": 0.073529411765, "b": 181.544117647 }], "ct": 1729179185, "mt": 1743070516 },
      { "id": 5, "n": "Ignition", "t": "engine operation", "d": "", "m": "On/Off", "p": "io_1", "f": 0, "c": "{\"act\":1,\"appear_in_popup\":true,\"ci\":{},\"cm\":1,\"consumption\":0,\"mu\":0,\"pos\":1,\"show_time\":false,\"timeout\":0}", "vt": 0, "vs": 0, "tbl": [], "ct": 1729179185, "mt": 1729179185 }
    ]
  },
  {
    "type": "avl_unit",
    "version": "b4",
    "mu": 0,
    "general": {
      "n": "22H - AGZ 3812 (ADS 4866)",
      "uid": "864454077916934",
      "uid2": "",
      "ph": "+263781163420",
      "ph2": "",
      "psw": "",
      "hw": "Teltonika FMC920"
    },
    "icon": {
      "lib": "600000003",
      "url": "A_39.png",
      "imgRot": "0"
    },
    "profile": [
      { "id": 1, "n": "primary_fuel_type", "v": "Diesel", "ct": 1738020345, "mt": 1738020345 },
      { "id": 2, "n": "vehicle_class", "v": "heavy_truck", "ct": 1742967281, "mt": 1748913990 },
      { "id": 3, "n": "engine_model", "v": "460HP", "ct": 1742967281, "mt": 1742967281 },
      { "id": 4, "n": "cargo_type", "v": "32 Ton", "ct": 1742967281, "mt": 1742967281 },
      { "id": 8, "n": "brand", "v": "Scania", "ct": 1748913990, "mt": 1748913990 }
    ],
    "sensors": [
      { "id": 1, "n": "Signal Strenght", "t": "custom", "d": "", "m": "", "p": "gsm", "f": 0, "c": "{\"act\":1,\"appear_in_popup\":true,\"ci\":{},\"cm\":1,\"mu\":0,\"pos\":3,\"show_time\":false,\"timeout\":0}", "vt": 0, "vs": 0, "tbl": [], "ct": 1732692466, "mt": 1732692466 },
      { "id": 3, "n": "Ignition", "t": "engine operation", "d": "", "m": "On/Off", "p": "io_1", "f": 0, "c": "{\"act\":1,\"appear_in_popup\":true,\"ci\":{},\"cm\":1,\"consumption\":1.75,\"mu\":0,\"pos\":1,\"show_time\":false,\"timeout\":0}", "vt": 0, "vs": 0, "tbl": [], "ct": 1732692466, "mt": 1738020345 }
    ]
  }
  // Add more vehicles as needed from the provided data
];

/**
 * Get GeoJSON representation of the fleet
 * @returns GeoJSON collection with fleet data
 */
export const getFleetGeoJson = (): GeoJsonCollection => {
  return convertFleetToGeoJson(wialonFleetData);
};

export default {
  convertFleetToGeoJson,
  getFleetGeoJson,
  wialonFleetData
};