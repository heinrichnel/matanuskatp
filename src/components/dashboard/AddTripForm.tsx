import React, { useState } from 'react';
import { Trip } from '../../types';
import Button from '../ui/Button';
import { Input, Select } from '../ui/FormElements';
import { CLIENTS, DRIVERS, FLEET_NUMBERS } from '../../types';

interface AddTripFormProps {
  onAddTrip: (trip: Trip) => void;
}

const AddTripForm: React.FC<AddTripFormProps> = ({ onAddTrip }) => {
  const [formData, setFormData] = useState({
    fleetNumber: '',
    driverName: '',
    clientName: '',
    route: '',
    baseRevenue: '',
    revenueCurrency: 'ZAR',
    startDate: '',
    endDate: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newTrip: Trip = {
        id: `trip-${Date.now()}`,
        fleetNumber: formData.fleetNumber,
        driverName: formData.driverName,
        clientName: formData.clientName,
        route: formData.route,
        baseRevenue: parseFloat(formData.baseRevenue) || 0,
        revenueCurrency: formData.revenueCurrency as 'ZAR' | 'USD',
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'active',
        costs: [],
        additionalCosts: [],
        delayReasons: [],
        followUpHistory: [],
        clientType: 'external', // Added for Trip type
        paymentStatus: 'unpaid' // Added for Trip type
      };

      onAddTrip(newTrip);
      // Reset form
      setFormData({
        fleetNumber: '',
        driverName: '',
        clientName: '',
        route: '',
        baseRevenue: '',
        revenueCurrency: 'ZAR',
        startDate: '',
        endDate: ''
      });
    } catch (error) {
      console.error('Error adding trip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Fleet Number"
          value={formData.fleetNumber}
          onChange={value => handleChange('fleetNumber', value)}
          options={[
            { label: 'Select Fleet', value: '' },
            ...FLEET_NUMBERS.map(fleet => ({ label: fleet, value: fleet }))
          ]}
          required
        />

        <Select
          label="Driver"
          value={formData.driverName}
          onChange={value => handleChange('driverName', value)}
          options={[
            { label: 'Select Driver', value: '' },
            ...DRIVERS.map(driver => ({ label: driver, value: driver }))
          ]}
          required
        />

        <Select
          label="Client"
          value={formData.clientName}
          onChange={value => handleChange('clientName', value)}
          options={[
            { label: 'Select Client', value: '' },
            ...CLIENTS.map(client => ({ label: client, value: client }))
          ]}
          required
        />

        <Input
          label="Route"
          value={formData.route}
          onChange={value => handleChange('route', value)}
          placeholder="e.g., JHB - CPT"
          required
        />

        <Input
          label="Base Revenue"
          type="number"
          value={formData.baseRevenue}
          onChange={value => handleChange('baseRevenue', value)}
          placeholder="0.00"
          step="0.01"
          required
        />

        <Select
          label="Currency"
          value={formData.revenueCurrency}
          onChange={value => handleChange('revenueCurrency', value)}
          options={[
            { label: 'ZAR (R)', value: 'ZAR' },
            { label: 'USD ($)', value: 'USD' }
          ]}
          required
        />

        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={value => handleChange('startDate', value)}
          required
        />

        <Input
          label="End Date"
          type="date"
          value={formData.endDate}
          onChange={value => handleChange('endDate', value)}
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          {isSubmitting ? 'Creating Trip...' : 'Create Trip'}
        </Button>
      </div>
    </form>
  );
};

export default AddTripForm;
