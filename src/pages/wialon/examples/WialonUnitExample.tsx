import React from 'react';
import {
  WialonUnit,
  WialonSensorDefinition,
  WialonSensorStatus,
  WialonHealthCheckFlags,
  WialonDrivingBehaviorSettings,
  WialonCounters
} from '../../../types/wialon';

/**
 * Example component demonstrating the use of the enhanced WialonUnit interface
 * with all the new properties from the GeoJSON structure.
 */
const WialonUnitExample: React.FC = () => {
  // Sample sensor definitions
  const sensorDefinitions: WialonSensorDefinition[] = [
    { name: "External Voltage", type: "voltage", parameter: "io_66" },
    { name: "LHS Tank", type: "fuel level", parameter: "io_273" },
    { name: "RHS Tank", type: "fuel level", parameter: "io_270" },
    { name: "Ignition", type: "engine operation", parameter: "io_1" }
  ];

  // Sample sensor status values
  const sensorStatus: WialonSensorStatus = {
    current_fuel_LHS_tank: 2500,
    current_fuel_RHS_tank: 2400,
    ignition_status: "On",
    signal_strength: 80
  };

  // Sample health check flags
  const healthCheck: WialonHealthCheckFlags = {
    health_low_battery: false
  };

  // Sample driving behavior settings
  const drivingBehaviorSettings: WialonDrivingBehaviorSettings = {
    acceleration_extreme_penalty: 2000,
    speeding_extreme_penalty: 5000
  };

  // Sample counters
  const counters: WialonCounters = {
    counter_cfl: 16
  };

  // Create a sample WialonUnit with all the new properties
  const sampleUnit: WialonUnit = {
    // Core identification
    id: 352592576757652,
    name: "21H - ADS 4865",
    uid: "352592576757652",

    // Contact and hardware details
    phone: "+263773717259",
    hardwareType: "Teltonika FMB920",
    iconUrl: "A_39.png",

    // Position data (hypothetical coordinates)
    lastPosition: {
      x: 28.12345, // Longitude
      y: -25.67890, // Latitude
      s: 65, // Speed in km/h
      t: Math.floor(Date.now() / 1000) // Current timestamp
    },

    // Vehicle profile information
    profile: {
      vehicle_class: "heavy_truck",
      brand: "Scania",
      model: "G460",
      year: "2010",
      color: "White",
      engine_model: "460HP",
      primary_fuel_type: "Diesel",
      cargo_type: "32 Ton"
    },

    // Extended properties from GeoJSON structure
    sensors_definitions: sensorDefinitions,
    sensor_status: sensorStatus,
    health_check: healthCheck,
    driving_behavior_settings: drivingBehaviorSettings,
    counters: counters
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Wialon Unit Example</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Unit Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700">Basic Information</h3>
            <p><strong>Name:</strong> {sampleUnit.name}</p>
            <p><strong>UID:</strong> {sampleUnit.uid}</p>
            <p><strong>Phone:</strong> {sampleUnit.phone}</p>
            <p><strong>Hardware:</strong> {sampleUnit.hardwareType}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700">Vehicle Information</h3>
            <p><strong>Brand:</strong> {sampleUnit.profile.brand}</p>
            <p><strong>Model:</strong> {sampleUnit.profile.model}</p>
            <p><strong>Year:</strong> {sampleUnit.profile.year}</p>
            <p><strong>Color:</strong> {sampleUnit.profile.color}</p>
            <p><strong>Engine:</strong> {sampleUnit.profile.engine_model}</p>
            <p><strong>Fuel Type:</strong> {sampleUnit.profile.primary_fuel_type}</p>
            <p><strong>Cargo Type:</strong> {sampleUnit.profile.cargo_type}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Position Data</h2>
        {sampleUnit.lastPosition && (
          <div>
            <p><strong>Longitude:</strong> {sampleUnit.lastPosition.x}</p>
            <p><strong>Latitude:</strong> {sampleUnit.lastPosition.y}</p>
            <p><strong>Speed:</strong> {sampleUnit.lastPosition.s} km/h</p>
            <p><strong>Last Update:</strong> {new Date(sampleUnit.lastPosition.t * 1000).toLocaleString()}</p>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Sensor Definitions</h2>
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Parameter</th>
            </tr>
          </thead>
          <tbody>
            {sampleUnit.sensors_definitions?.map((sensor, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="px-4 py-2">{sensor.name}</td>
                <td className="px-4 py-2">{sensor.type}</td>
                <td className="px-4 py-2">{sensor.parameter}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Current Sensor Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>LHS Fuel Tank:</strong> {sampleUnit.sensor_status?.current_fuel_LHS_tank}</p>
          <p><strong>RHS Fuel Tank:</strong> {sampleUnit.sensor_status?.current_fuel_RHS_tank}</p>
          <p><strong>Ignition Status:</strong> {sampleUnit.sensor_status?.ignition_status}</p>
          <p><strong>Signal Strength:</strong> {sampleUnit.sensor_status?.signal_strength}%</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Health Check</h2>
        <p>
          <strong>Low Battery:</strong>
          {sampleUnit.health_check?.health_low_battery ?
            <span className="text-red-600">Yes</span> :
            <span className="text-green-600">No</span>
          }
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Driving Behavior Settings</h2>
        <p><strong>Acceleration Extreme Penalty:</strong> {sampleUnit.driving_behavior_settings?.acceleration_extreme_penalty}</p>
        <p><strong>Speeding Extreme Penalty:</strong> {sampleUnit.driving_behavior_settings?.speeding_extreme_penalty}</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Counters</h2>
        <p><strong>CFL Counter:</strong> {sampleUnit.counters?.counter_cfl}</p>
      </div>
    </div>
  );
};

export default WialonUnitExample;
