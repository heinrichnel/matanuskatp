import React, { useState, useEffect } from 'react';
import { Trip, CLIENTS, DRIVERS, CLIENT_TYPES, FLEET_NUMBERS } from '../../types';
import { Input, Select, TextArea } from '../ui/FormElements';
import Button from '../ui/Button';
import { Save, X } from 'lucide-react';

interface TripFormProps {
  trip?: Trip;
  onSubmit: (tripData: Omit<Trip, 'id' | 'costs' | 'status'>) => void;
  onCancel: () => void;
}

const TripForm: React.FC<TripFormProps> = ({ trip, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fleetNumber: '',
    clientName: '',
    driverName: '',
    route: '',
    startDate: '',
    endDate: '',
    distanceKm: '',
    baseRevenue: '',
    revenueCurrency: 'ZAR' as 'USD' | 'ZAR',
    clientType: 'external' as 'internal' | 'external',
    description: '',
  });
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (trip) {
      setFormData({
        fleetNumber: trip.fleetNumber || '',
        clientName: trip.clientName || '',
        driverName: trip.driverName || '',
        route: trip.route || '',
        startDate: trip.startDate || '',
        endDate: trip.endDate || '',
        distanceKm: trip.distanceKm ? String(trip.distanceKm) : '',
        baseRevenue: trip.baseRevenue ? String(trip.baseRevenue) : '',
        revenueCurrency: trip.revenueCurrency || 'ZAR',
        clientType: trip.clientType || 'external',
        description: trip.description || '',
      });
    } else {
      // Set default start date to today for new trips
      setFormData(prev => ({
        ...prev,
        startDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [trip]);

  const validate = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.clientType) newErrors.clientType = 'Client Type is required';
    if (!formData.fleetNumber) newErrors.fleetNumber = 'Fleet Number is required';
    if (!formData.clientName) newErrors.clientName = 'Client is required';
    if (!formData.driverName) newErrors.driverName = 'Driver is required';
    if (!formData.route) newErrors.route = 'Route is required';
    if (!formData.startDate) newErrors.startDate = 'Start Date is required';
    if (!formData.endDate) {
      newErrors.endDate = 'End Date is required';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End Date cannot be earlier than Start Date';
    }
    if (!formData.distanceKm || parseFloat(formData.distanceKm) <= 0) {
      newErrors.distanceKm = 'Distance must be greater than 0';
    }
    if (!formData.baseRevenue || parseFloat(formData.baseRevenue) <= 0) {
      newErrors.baseRevenue = 'Base Revenue must be greater than 0';
    }
    if (!formData.revenueCurrency) newErrors.revenueCurrency = 'Currency is required';
    return newErrors;
  };

  useEffect(() => {
    setErrors(validate());
  }, [formData]);

  const isFormValid = Object.keys(errors).length === 0;

  const handleBlur = (field: string) => {
    setTouched(t => ({ ...t, [field]: true }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({
      clientType: true,
      fleetNumber: true,
      clientName: true,
      driverName: true,
      route: true,
      startDate: true,
      endDate: true,
      distanceKm: true,
      baseRevenue: true,
      revenueCurrency: true,
      description: true,
    });
    
    if (Object.keys(validationErrors).length > 0) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        clientType: formData.clientType,
        fleetNumber: formData.fleetNumber,
        clientName: formData.clientName,
        driverName: formData.driverName,
        route: formData.route,
        startDate: formData.startDate,
        endDate: formData.endDate,
        distanceKm: parseFloat(formData.distanceKm),
        baseRevenue: parseFloat(formData.baseRevenue),
        revenueCurrency: formData.revenueCurrency,
        description: formData.description,
        additionalCosts: [],
        paymentStatus: 'unpaid',
        followUpHistory: [],
      });
    } catch (error) {
      console.error('Error submitting trip:', error);
      alert('An error occurred while saving the trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Client Type"
          value={formData.clientType}
          onChange={(value) => handleChange('clientType', value)}
          onBlur={() => handleBlur('clientType')}
          options={CLIENT_TYPES.map(type => ({ label: type.label, value: type.value }))}
          required
          error={touched.clientType && errors.clientType}
        />
        <Select
          label="Fleet Number"
          value={formData.fleetNumber}
          onChange={(value) => handleChange('fleetNumber', value)}
          onBlur={() => handleBlur('fleetNumber')}
          options={[
            { label: 'Select fleet...', value: '' },
            ...FLEET_NUMBERS.map(f => ({ label: f, value: f }))
          ]}
          required
          error={touched.fleetNumber && errors.fleetNumber}
        />
        <Select
          label="Client"
          value={formData.clientName}
          onChange={(value) => handleChange('clientName', value)}
          onBlur={() => handleBlur('clientName')}
          options={[
            { label: 'Select client...', value: '' },
            ...CLIENTS.map(c => ({ label: c, value: c }))
          ]}
          required
          error={touched.clientName && errors.clientName}
        />
        <Select
          label="Driver"
          value={formData.driverName}
          onChange={(value) => handleChange('driverName', value)}
          onBlur={() => handleBlur('driverName')}
          options={[
            { label: 'Select driver...', value: '' },
            ...DRIVERS.map(d => ({ label: d, value: d }))
          ]}
          required
          error={touched.driverName && errors.driverName}
        />
        <Input
          label="Route"
          value={formData.route}
          onChange={(value) => handleChange('route', value)}
          onBlur={() => handleBlur('route')}
          placeholder="e.g., JHB - CPT"
          required
          error={touched.route && errors.route}
        />
        <Input
          label="Start Date"
          type="date"
          value={formData.startDate}
          onChange={(value) => handleChange('startDate', value)}
          onBlur={() => handleBlur('startDate')}
          required
          error={touched.startDate && errors.startDate}
        />
        <Input
          label="End Date"
          type="date"
          value={formData.endDate}
          onChange={(value) => handleChange('endDate', value)}
          onBlur={() => handleBlur('endDate')}
          required
          error={touched.endDate && errors.endDate}
        />
        <Input
          label="Distance (KM)"
          type="number"
          value={formData.distanceKm}
          onChange={(value) => handleChange('distanceKm', value)}
          onBlur={() => handleBlur('distanceKm')}
          placeholder="0"
          min="1"
          step="1"
          required
          error={touched.distanceKm && errors.distanceKm}
        />
        <Input
          label="Base Revenue"
          type="number"
          value={formData.baseRevenue}
          onChange={(value) => handleChange('baseRevenue', value)}
          onBlur={() => handleBlur('baseRevenue')}
          placeholder="0.00"
          min="0.01"
          step="0.01"
          required
          error={touched.baseRevenue && errors.baseRevenue}
        />
        <Select
          label="Revenue Currency"
          value={formData.revenueCurrency}
          onChange={(value) => handleChange('revenueCurrency', value)}
          onBlur={() => handleBlur('revenueCurrency')}
          options={[
            { label: 'ZAR (R)', value: 'ZAR' },
            { label: 'USD ($)', value: 'USD' }
          ]}
          required
          error={touched.revenueCurrency && errors.revenueCurrency}
        />
      </div>
      <TextArea
        label="Trip Description"
        value={formData.description}
        onChange={(value) => handleChange('description', value)}
        placeholder="Description of the trip..."
        rows={3}
      />
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          icon={<X className="w-4 h-4" />}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!isFormValid || isSubmitting}
          icon={<Save className="w-4 h-4" />}
          isLoading={isSubmitting}
        >
          {trip ? 'Update Trip' : 'Create Trip'}
        </Button>
      </div>
    </form>
  );
};

export default TripForm;