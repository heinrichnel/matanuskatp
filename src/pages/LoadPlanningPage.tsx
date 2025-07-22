
import React, { useState } from 'react';

type Item = {
  item_id: string;
  weight: number;
  volume: number;
};

type Vehicle = {
  vehicle_id: string;
  max_weight: number;
  max_volume: number;
  items: Item[];
  current_weight: number;
  current_volume: number;
};

function canAddItem(vehicle: Vehicle, item: Item): boolean {
  return (
    vehicle.current_weight + item.weight <= vehicle.max_weight &&
    vehicle.current_volume + item.volume <= vehicle.max_volume
  );
}

function addItem(vehicle: Vehicle, item: Item): boolean {
  if (canAddItem(vehicle, item)) {
    vehicle.items.push(item);
    vehicle.current_weight += item.weight;
    vehicle.current_volume += item.volume;
    return true;
  }
  return false;
}

function loadPlanning(items: Item[], vehicles: Vehicle[]): { assignedVehicles: Vehicle[]; unassignedItems: Item[] } {
  const unassignedItems = [...items];
  const assignedVehicles = vehicles.map(vehicle => ({
    ...vehicle,
    items: [],
    current_weight: 0,
    current_volume: 0,
  }));

  for (const vehicle of assignedVehicles) {
    let i = 0;
    while (i < unassignedItems.length) {
      const item = unassignedItems[i];
      if (addItem(vehicle, item)) {
        unassignedItems.splice(i, 1);
      } else {
        i += 1;
      }
    }
  }

  return { assignedVehicles, unassignedItems };
}

const LoadPlanningPage: React.FC = () => {
  const items: Item[] = [
    { item_id: "item1", weight: 10, volume: 5 },
    { item_id: "item2", weight: 20, volume: 10 },
    { item_id: "item3", weight: 15, volume: 7 },
    { item_id: "item4", weight: 5, volume: 3 },
    { item_id: "item5", weight: 25, volume: 12 },
  ];

  const vehicles: Vehicle[] = [
    { vehicle_id: "vehicle1", max_weight: 50, max_volume: 20, items: [], current_weight: 0, current_volume: 0 },
    { vehicle_id: "vehicle2", max_weight: 40, max_volume: 15, items: [], current_weight: 0, current_volume: 0 },
  ];

  const { assignedVehicles, unassignedItems } = loadPlanning(items, vehicles);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Load Planning</h1>
      {assignedVehicles.map(vehicle => (
        <div key={vehicle.vehicle_id} className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Vehicle {vehicle.vehicle_id}</h2>
          <ul>
            {vehicle.items.map(item => (
              <li key={item.item_id}>
                {item.item_id} (Weight: {item.weight}, Volume: {item.volume})
              </li>
            ))}
          </ul>
          <div>Total Weight: {vehicle.current_weight}</div>
          <div>Total Volume: {vehicle.current_volume}</div>
        </div>
      ))}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Unassigned Items</h2>
        <ul>
          {unassignedItems.map(item => (
            <li key={item.item_id}>
              {item.item_id} (Weight: {item.weight}, Volume: {item.volume})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LoadPlanningPage;
