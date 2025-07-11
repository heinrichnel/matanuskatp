// ─── React ───────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';

// ─── Types & Constants ───────────────────────────────────────────
import { Trip, CLIENTS, DRIVERS } from '../../types/index.ts';

// ─── UI Components ───────────────────────────────────────────────
import { Input, Select, Textarea } from '../ui/FormElements.tsx';
import Button from '../ui/Button.tsx';


interface TripFormProps {
  trip?: Trip;
  onSubmit: (tripData: Omit<Trip, 'id' | 'costs' | 'status' | 'additionalCosts'>) => void;
  onCancel: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ trip, onSubmit, onCancel }) => {
  const [fleetNumber, setFleetNumber] = useState('');
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
  const [plannedRoute, setPlannedRoute] = useState<{
    origin: string;
    destination: string;
    waypoints: string[];
  }>({
    origin: '',
    destination: '',
    waypoints: []
  });

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
      
      // Set planned route if available
      if (trip.plannedRoute) {
        setPlannedRoute({
          origin: trip.plannedRoute.origin || '',
          destination: trip.plannedRoute.destination || '',
          waypoints: trip.plannedRoute.waypoints || []
        });
      }
    }
  }, [trip]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a valid Trip object with required properties
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
      // Add required fields with default values
      paymentStatus: 'unpaid',
      followUpHistory: []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="Fleet Number" 
          value={fleetNumber} 
          onChange={e => setFleetNumber(e.target.value)} 
          required 
        />
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
        
        {/* Planned Route Section */}
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
