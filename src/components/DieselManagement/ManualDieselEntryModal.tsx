// ─── // ─── UI Components ───────────────────────────────────────────────────
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input, Select, TextArea } from '../ui/FormElements';
import FleetSelector from '../common/FleetSelector';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

// ─── Types ───────────────────────────────────────────────────────
import { DRIVERS, FUEL_STATIONS, FLEET_NUMBERS, DieselConsumptionRecord, FLEETS_WITH_PROBES } from '../../types';

// ─── Icons ───────────────────────────────────────────────────────
import { 
  Save, 
  X, 
  Calculator,
  AlertTriangle,
  Fuel,
  Link,
  Building,
  Clock
} from 'lucide-react';

// ─── Utilities ───────────────────────────────────────────────────
import { formatDate } from '../../utils/helpers';


interface ManualDieselEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  dieselRecords?: DieselConsumptionRecord[];
}

const ManualDieselEntryModal: React.FC<ManualDieselEntryModalProps> = ({ 
  isOpen,
  onClose
}) => {
  const { addDieselRecord, trips, dieselRecords, connectionStatus } = useAppContext();
  
  const [formData, setFormData] = useState({
    fleetNumber: '',
    date: new Date().toISOString().split('T')[0],
    kmReading: '',
    previousKmReading: '',
    litresFilled: '',
    costPerLitre: '',
    totalCost: '',
    fuelStation: '',
    driverName: '',
    notes: '',
    tripId: '', // Link to trip
    currency: 'ZAR' as 'USD' | 'ZAR', // Add currency field with default value
    isReeferUnit: false, // Add flag for reefer units
    linkedHorseId: '', // For reefer units
    hoursOperated: '' // For reefer units - hours of operation
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [autoCalculate, setAutoCalculate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [possibleDuplicates, setPossibleDuplicates] = useState<DieselConsumptionRecord[]>([]);

  // Get available trips for the selected fleet
  const availableTrips = trips.filter(trip => 
    trip.fleetNumber === formData.fleetNumber && 
    trip.status === 'active'
  );

  // Get available horses for reefer units
  const availableHorses = formData.isReeferUnit ? 
    dieselRecords.filter(record => 
      !record.isReeferUnit && 
      ['4H', '6H', '21H', '22H', '23H', '24H', '26H', '28H', '29H', '30H', '31H', '32H', '33H', 'UD'].includes(record.fleetNumber)
    ) : [];

  // Check for possible duplicates when fields change
  useEffect(() => {
    if (formData.fleetNumber && formData.date) {
      // Find records with the same fleet and date
      const potentialDuplicates = dieselRecords.filter(record => 
        record.fleetNumber === formData.fleetNumber && 
        record.date === formData.date
      );
      
      setPossibleDuplicates(potentialDuplicates);
    } else {
      setPossibleDuplicates([]);
    }
  }, [formData.fleetNumber, formData.date, dieselRecords]);

  const handleChange = (field: string, event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string | boolean) => {
    const value = typeof event === 'object' ? (event as React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>).target.value : event;
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-calculate based on the field that was changed
    if (autoCalculate) {
      if (field === 'litresFilled' || field === 'costPerLitre') {
        const litres = field === 'litresFilled' ? parseFloat(value as string) || 0 : parseFloat(formData.litresFilled) || 0;
        const costPerL = field === 'costPerLitre' ? parseFloat(value as string) || 0 : parseFloat(formData.costPerLitre) || 0;
        
        if (litres > 0 && costPerL > 0) {
          const calculatedTotal = (litres * costPerL).toFixed(2);
          setFormData(prev => ({ ...prev, totalCost: calculatedTotal }));
        }
      } else if (field === 'totalCost') {
        const litres = parseFloat(formData.litresFilled) || 0;
        const total = parseFloat(value as string) || 0;
        
        if (litres > 0 && total > 0) {
          const calculatedCostPerL = (total / litres).toFixed(2);
          setFormData(prev => ({ ...prev, costPerLitre: calculatedCostPerL }));
        }
      }
    }

    // Special handling for reefer unit toggle
    if (field === 'isReeferUnit') {
      if (value === true) {
        // If it's a reefer unit, we need to track different metrics
        setFormData(prev => ({
          ...prev,
          isReeferUnit: true
        }));
      } else {
        // If turning off reefer unit, reset related fields
        setFormData(prev => ({
          ...prev,
          isReeferUnit: false,
          linkedHorseId: '',
          hoursOperated: ''
        }));
      }
    }

    // Lookup previous KM reading if fleetNumber changes
    if (field === 'fleetNumber') {
      const fleetRecords = dieselRecords
        .filter(record => record.fleetNumber === value)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      if (fleetRecords.length > 0) {
        // Get the most recent reading
        const lastReading = fleetRecords[0].kmReading;
        setFormData(prev => ({
          ...prev,
          previousKmReading: lastReading ? lastReading.toString() : '',
          fleetNumber: value as string
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          previousKmReading: '',
          fleetNumber: value as string
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Basic required field validation
    if (!formData.fleetNumber) newErrors.fleetNumber = 'Fleet number is required';
    if (!formData.date) newErrors.date = 'Date is required';
    
    // Number validation
    if (formData.kmReading && isNaN(parseFloat(formData.kmReading))) {
      newErrors.kmReading = 'Must be a valid number';
    }
    
    if (!formData.litresFilled) {
      newErrors.litresFilled = 'Litres filled is required';
    } else if (isNaN(parseFloat(formData.litresFilled)) || parseFloat(formData.litresFilled) <= 0) {
      newErrors.litresFilled = 'Must be a valid positive number';
    }
    
    if (!formData.totalCost) {
      newErrors.totalCost = 'Total cost is required';
    } else if (isNaN(parseFloat(formData.totalCost)) || parseFloat(formData.totalCost) <= 0) {
      newErrors.totalCost = 'Must be a valid positive number';
    }
    
    // If it's a reefer unit, validate reefer-specific fields
    if (formData.isReeferUnit) {
      if (!formData.hoursOperated) {
        newErrors.hoursOperated = 'Hours operated is required for reefer units';
      } else if (isNaN(parseFloat(formData.hoursOperated)) || parseFloat(formData.hoursOperated) < 0) {
        newErrors.hoursOperated = 'Must be a valid number';
      }
    } else {
      // Regular vehicle validation
      if (formData.kmReading && formData.previousKmReading) {
        const currentReading = parseFloat(formData.kmReading);
        const previousReading = parseFloat(formData.previousKmReading);
        
        // Check if the new reading is less than the previous (might indicate an error)
        if (currentReading < previousReading) {
          newErrors.kmReading = 'New reading is less than previous reading';
        }
        
        // Check if the difference is unreasonably large (e.g., more than 10,000 km)
        const difference = currentReading - previousReading;
        if (difference > 10000) {
          newErrors.kmReading = 'Reading differs by more than 10,000 km from previous record';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const newRecord: Partial<DieselConsumptionRecord> = {
        fleetNumber: formData.fleetNumber,
        date: formData.date,
        kmReading: formData.kmReading ? parseFloat(formData.kmReading) : undefined,
        previousKmReading: formData.previousKmReading ? parseFloat(formData.previousKmReading) : undefined,
        litresFilled: parseFloat(formData.litresFilled),
        costPerLitre: parseFloat(formData.costPerLitre),
        totalCost: parseFloat(formData.totalCost),
        fuelStation: formData.fuelStation,
        driverName: formData.driverName,
        notes: formData.notes,
        currency: formData.currency,
        isReeferUnit: formData.isReeferUnit,
        timestamp: new Date().toISOString(),
        verified: false,
        tripId: formData.tripId || undefined,
        linkedHorseId: formData.isReeferUnit ? formData.linkedHorseId : undefined,
        hoursOperated: formData.isReeferUnit ? parseFloat(formData.hoursOperated) : undefined
      };
      
      await addDieselRecord(newRecord as DieselConsumptionRecord);
      onClose();
    } catch (error) {
      console.error('Error adding diesel record:', error);
      setErrors({ submit: 'Failed to add record. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAutoCalculate = () => {
    setAutoCalculate(!autoCalculate);
  };

  // Determine if the selected vehicle has a probe system
  const hasProbeSystem = FLEETS_WITH_PROBES.includes(formData.fleetNumber);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Diesel Record" size="lg">
      <div className="space-y-6">
        {/* Warning for offline mode */}
        {connectionStatus === 'offline' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You are currently offline. This record will be saved locally and synced when you reconnect.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Fleet and date selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fleet Number *</label>
            <div className="relative">
              <FleetSelector
                onSelectionChange={(vehicles) => handleChange('fleetNumber', vehicles[0] || '')}
                selectedVehicles={formData.fleetNumber ? [formData.fleetNumber] : []}
                availableVehicles={FLEET_NUMBERS}
                maxSelection={1}
                label=""
              />
              {errors.fleetNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.fleetNumber}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date *</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e)}
              error={errors.date}
            />
          </div>
        </div>
        
        {/* Possible duplicates warning */}
        {possibleDuplicates.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-amber-800">
                  Potential duplicate entries detected
                </p>
                <div className="mt-2 text-sm text-amber-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {possibleDuplicates.map((record, index) => (
                      <li key={index}>
                        {record.fleetNumber} on {formatDate(record.date)} - {record.litresFilled} litres
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Vehicle Type */}
        <div className="flex items-center space-x-2">
          <input
            id="isReeferUnit"
            name="isReeferUnit"
            type="checkbox"
            checked={formData.isReeferUnit}
            onChange={(e) => handleChange('isReeferUnit', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="isReeferUnit" className="text-sm font-medium">
            This is a Reefer Unit
          </label>
        </div>
        
        {/* Regular vehicle fields */}
        {!formData.isReeferUnit ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                KM Reading
                {hasProbeSystem && (
                  <span className="ml-1 text-xs text-blue-600">(Probe Available)</span>
                )}
              </label>
              <Input
                type="number"
                value={formData.kmReading}
                onChange={(e) => handleChange('kmReading', e)}
                error={errors.kmReading}
              />
              {formData.previousKmReading && (
                <p className="mt-1 text-xs text-gray-500">
                  Previous reading: {formData.previousKmReading}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Link to Trip</label>
              <Select
                value={formData.tripId}
                onChange={(e) => handleChange('tripId', e)}
                error={errors.tripId}
              >
                <option value="">None</option>
                {availableTrips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.id} - {trip.route}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hours Operated *</label>
              <Input
                type="number"
                value={formData.hoursOperated}
                onChange={(e) => handleChange('hoursOperated', e)}
                error={errors.hoursOperated}
                placeholder="Hours of operation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Linked to Horse</label>
              <Select
                value={formData.linkedHorseId}
                onChange={(e) => handleChange('linkedHorseId', e)}
                error={errors.linkedHorseId}
              >
                <option value="">None</option>
                {availableHorses.map((record) => (
                  <option key={record.id} value={record.fleetNumber}>
                    {record.fleetNumber} - {formatDate(record.date)}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}
        
        {/* Fuel details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Fuel Details</h3>
            <div className="flex items-center space-x-2">
              <input
                id="autoCalculate"
                name="autoCalculate"
                type="checkbox"
                checked={autoCalculate}
                onChange={toggleAutoCalculate}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="autoCalculate" className="text-xs flex items-center text-gray-600">
                <Calculator className="h-3 w-3 mr-1" />
                Auto-calculate
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Litres Filled *
                <Fuel className="inline-block h-3 w-3 ml-1 text-gray-400" />
              </label>
              <Input
                type="number"
                value={formData.litresFilled}
                onChange={(e) => handleChange('litresFilled', e)}
                error={errors.litresFilled}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Cost per Litre 
                <span className="ml-1 text-xs">({formData.currency})</span>
              </label>
              <Input
                type="number"
                value={formData.costPerLitre}
                onChange={(e) => handleChange('costPerLitre', e)}
                error={errors.costPerLitre}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Total Cost *
                <span className="ml-1 text-xs">({formData.currency})</span>
              </label>
              <Input
                type="number"
                value={formData.totalCost}
                onChange={(e) => handleChange('totalCost', e)}
                error={errors.totalCost}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Currency</label>
              <Select
                value={formData.currency}
                onChange={(e) => handleChange('currency', e)}
              >
                <option value="ZAR">ZAR</option>
                <option value="USD">USD</option>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Additional info */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Additional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Fuel Station
                <Building className="inline-block h-3 w-3 ml-1 text-gray-400" />
              </label>
              <Select
                value={formData.fuelStation}
                onChange={(e) => handleChange('fuelStation', e)}
              >
                <option value="">Select a station</option>
                {FUEL_STATIONS.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Driver</label>
              <Select
                value={formData.driverName}
                onChange={(e) => handleChange('driverName', e)}
              >
                <option value="">Select a driver</option>
                {DRIVERS.map((driver) => (
                  <option key={driver} value={driver}>
                    {driver}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <TextArea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e)}
              rows={3}
              placeholder="Add any additional notes here..."
            />
          </div>
        </div>
        
        {/* Submit error message */}
        {errors.submit && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            <X className="mr-1 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-1">⏳</span> Saving...
              </>
            ) : (
              <>
                <Save className="mr-1 h-4 w-4" /> Save Record
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ManualDieselEntryModal;
