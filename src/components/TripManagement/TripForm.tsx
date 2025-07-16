import React, { useState, useEffect } from "react";
import { Input, Select, Textarea } from '../ui/FormElements.tsx';
import Button from '../ui/Button.tsx';

import { Trip, CLIENTS, DRIVERS } from '../../types/index.ts';
import { useWialonUnits } from "../../hooks/useWialonUnits";

interface TripFormProps {
  trip?: Trip;
  onSubmit: (tripData: Omit<Trip, 'id' | 'costs' | 'status' | 'additionalCosts'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ trip, onSubmit, onCancel, isSubmitting = false }) => {
  const { units: wialonUnits, loading: unitsLoading, error: unitsError } = useWialonUnits(true);

  const [fleetNumber, setFleetNumber] = useState('');
  const [fleetUnitId, setFleetUnitId] = useState<number | "">("");
  const [clientName, setClientName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [route, setRoute] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [distanceKm, setDistanceKm] = useState(0);
  const [baseRevenue, setBaseRevenue] = useState(0);
  const [revenueCurrency, setRevenueCurrency] = useState<'USD' | 'ZAR'>('ZAR');
  const [clientType, setClientType] = useState<'internal' | 'external'>('external');
  const [plannedRoute, setPlannedRoute] = useState<{ origin: string; destination: string; waypoints: string[]; }>({
    origin: '',
    destination: '',
    waypoints: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set form state on edit
  useEffect(() => {
    if (trip) {
      setFleetNumber(trip.fleetNumber || '');
      setClientName(trip.clientName || '');
      setDriverName(trip.driverName || '');
      setRoute(trip.route || '');
      setStartDate(trip.startDate || new Date().toISOString().split('T')[0]);
      setEndDate(trip.endDate || new Date().toISOString().split('T')[0]);
      setDescription(trip.description || '');
      setDistanceKm(trip.distanceKm || 0);
      setBaseRevenue(trip.baseRevenue || 0);
      setRevenueCurrency(trip.revenueCurrency || 'ZAR');
      setClientType(trip.clientType || 'external');
      setPlannedRoute({
        origin: trip.plannedRoute?.origin || '',
        destination: trip.plannedRoute?.destination || '',
        waypoints: trip.plannedRoute?.waypoints || []
      });
      
      // Set the fleetUnitId if available in the trip data
      if (trip.fleetUnitId) {
        setFleetUnitId(Number(trip.fleetUnitId) || "");
      }
    }
  }, [trip]);

  // When Wialon units load, sync the fleet number for compatibility with your other logic if needed
  useEffect(() => {
    if (fleetUnitId && wialonUnits.length > 0) {
      const match = wialonUnits.find(u => u.id === fleetUnitId);
      if (match) setFleetNumber(match.name);
    }
  }, [fleetUnitId, wialonUnits]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fleetNumber.trim()) newErrors.fleetNumber = 'Fleet number is required';
    if (!clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!driverName.trim()) newErrors.driverName = 'Driver name is required';
    if (!route.trim()) newErrors.route = 'Route is required';
    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    if (distanceKm <= 0) newErrors.distanceKm = 'Distance must be greater than 0';
    if (baseRevenue <= 0) newErrors.baseRevenue = 'Revenue must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Use fleetNumber and optionally fleetUnitId for downstream analytics
      onSubmit({
        fleetNumber,
        clientName,
        driverName,
        clientType,
        route,
        startDate,
        endDate,
        description,
        distanceKm,
        baseRevenue,
        revenueCurrency,
        plannedRoute: {
          origin: plannedRoute.origin,
          destination: plannedRoute.destination,
          waypoints: plannedRoute.waypoints,
        },
        paymentStatus: 'unpaid',
        followUpHistory: [],
        // Include fleetUnitId for telematics
        fleetUnitId: fleetUnitId ? String(fleetUnitId) : undefined
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">

        {/* ─────────────── DYNAMIC WIALON UNIT SELECTION ─────────────── */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">
            Fleet Unit (Telematics)
            {unitsLoading && <span className="ml-2 text-xs text-blue-600">Loading units…</span>}
          </label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={fleetUnitId}
            onChange={e => {
              const id = Number(e.target.value) || "";
              setFleetUnitId(id);
              const selected = wialonUnits.find(u => u.id === id);
              setFleetNumber(selected ? selected.name : "");
            }}
            required
            disabled={unitsLoading}
          >
            <option value="">Select Unit</option>
            {wialonUnits.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} {u.pos ? `(${u.pos.y?.toFixed(4)}, ${u.pos.x?.toFixed(4)})` : ""}
              </option>
            ))}
          </select>
          {unitsError && <div className="text-xs text-red-600">{unitsError}</div>}
        </div>

        {/* Existing fields */}
        <Select
          label="Client Name"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          options={CLIENTS.map(c => ({ label: c, value: c }))}
          required
        />
        <Select
          label="Client Type"
          value={clientType}
          onChange={e => setClientType(e.target.value as 'internal' | 'external')}
          options={[
            { label: 'Internal', value: 'internal' },
            { label: 'External', value: 'external' },
          ]}
          required
        />
        <Select
          label="Driver Name"
          value={driverName}
          onChange={e => setDriverName(e.target.value)}
          options={DRIVERS.map(d => ({ label: d, value: d }))}
          required
        />
        <Input 
          label="Route" 
          value={route} 
          onChange={e => setRoute(e.target.value)} 
          placeholder="Route description (e.g. Johannesburg to Cape Town)" 
          required 
        />

        <Input 
          label="Origin" 
          value={plannedRoute.origin} 
          onChange={e => setPlannedRoute({...plannedRoute, origin: e.target.value})} 
          required 
        />
        <Input 
          label="Destination" 
          value={plannedRoute.destination} 
          onChange={e => setPlannedRoute({...plannedRoute, destination: e.target.value})} 
          required 
        />

        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          required
        />
        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          required
        />

        <Input
          label="Distance (KM)"
          type="number"
          value={distanceKm}
          onChange={e => setDistanceKm(Number(e.target.value))}
          required
        />
        <Input
          label="Base Revenue"
          type="number"
          value={baseRevenue}
          onChange={e => setBaseRevenue(Number(e.target.value))}
          required
        />
        <Select
          label="Revenue Currency"
          value={revenueCurrency}
          onChange={e => setRevenueCurrency(e.target.value as 'USD' | 'ZAR')}
          options={[
            { label: 'USD', value: 'USD' },
            { label: 'ZAR', value: 'ZAR' },
          ]}
          required
        />
      </div>

      <Textarea
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Additional notes about the trip, special requirements, etc."
        rows={4}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{trip ? 'Update Trip' : 'Create Trip'}</Button>
      </div>
    </form>
  );
};

export default TripForm;