import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input, TextArea } from '../ui/FormElements';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CheckCircle, X, Save, AlertTriangle, Info } from 'lucide-react';
import { FLEETS_WITH_PROBES } from '../../types';
import { addAuditLogToFirebase } from '../../firebase';

interface EnhancedProbeVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  dieselRecordId: string;
}

const EnhancedProbeVerificationModal: React.FC<EnhancedProbeVerificationModalProps> = ({
  isOpen,
  onClose,
  dieselRecordId
}) => {
  const { dieselRecords, updateDieselRecord } = useAppContext();
  const [probeReading, setProbeReading] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [photoEvidence, setPhotoEvidence] = useState<File | null>(null);
  const [witnessName, setWitnessName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [discrepancy, setDiscrepancy] = useState<number | null>(null);
  const [discrepancyPercentage, setDiscrepancyPercentage] = useState<number | null>(null);

  // Find the diesel record
  const record = dieselRecords.find(r => r.id === dieselRecordId);

  // Reset form when modal opens with new record
  useEffect(() => {
    if (record) {
      setProbeReading(record.probeReading?.toString() || '');
      setVerificationNotes(record.probeVerificationNotes || '');
      setWitnessName('');
      setPhotoEvidence(null);
      setErrors({});
      
      // Calculate discrepancy if probe reading exists
      if (record.probeReading !== undefined) {
        const discrepancyValue = record.litresFilled - record.probeReading;
        setDiscrepancy(discrepancyValue);
        setDiscrepancyPercentage((discrepancyValue / record.litresFilled) * 100);
      } else {
        setDiscrepancy(null);
        setDiscrepancyPercentage(null);
      }
    }
  }, [record, isOpen]);

  if (!record) return null;

  // Check if this fleet has a probe
  const hasProbe = FLEETS_WITH_PROBES.includes(record.fleetNumber);
  if (!hasProbe) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Probe Verification"
        maxWidth="md"
      >
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">No Probe Available</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Fleet {record.fleetNumber} does not have a fuel probe installed. Probe verification is not available for this vehicle.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </Modal>
    );
  }

  // Update discrepancy on probe reading change
  const handleProbeReadingChange = (value: string) => {
    setProbeReading(value);
    
    const probeValue = parseFloat(value);
    if (!isNaN(probeValue)) {
      const discrepancyValue = record.litresFilled - probeValue;
      setDiscrepancy(discrepancyValue);
      setDiscrepancyPercentage((discrepancyValue / record.litresFilled) * 100);
    } else {
      setDiscrepancy(null);
      setDiscrepancyPercentage(null);
    }
    
    // Clear error for this field
    if (errors.probeReading) {
      setErrors(prev => ({ ...prev, probeReading: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!probeReading.trim()) {
      newErrors.probeReading = 'Probe reading is required';
    } else if (isNaN(Number(probeReading)) || Number(probeReading) < 0) {
      newErrors.probeReading = 'Probe reading must be a valid positive number';
    }
    
    // If discrepancy is large (more than 10%), require notes and witness
    if (discrepancyPercentage !== null && Math.abs(discrepancyPercentage) > 10) {
      if (!verificationNotes.trim()) {
        newErrors.verificationNotes = 'Notes are required for large discrepancies';
      }
      
      if (!witnessName.trim()) {
        newErrors.witnessName = 'Witness name is required for large discrepancies';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      const probeReadingValue = Number(probeReading);
      const probeDiscrepancyValue = record.litresFilled - probeReadingValue;
      const isSeriousDiscrepancy = Math.abs(probeDiscrepancyValue) > 50 || 
                                  Math.abs(probeDiscrepancyValue / record.litresFilled) > 0.1;
      
      // Update the diesel record
      const updatedRecord = {
        ...record,
        probeReading: probeReadingValue,
        probeDiscrepancy: probeDiscrepancyValue,
        probeVerified: true,
        probeVerificationNotes: verificationNotes.trim() || undefined,
        probeVerifiedAt: new Date().toISOString(),
        probeVerifiedBy: 'Current User', // In a real app, use the logged-in user
        probeWitness: witnessName.trim() || undefined,
        // In a real implementation, you would upload the photo evidence and store the URL
        probePhotoUrl: photoEvidence ? 'https://example.com/photo-evidence.jpg' : undefined,
        updatedAt: new Date().toISOString()
      };
      
      await updateDieselRecord(updatedRecord);

      // Add audit log for serious discrepancies
      if (isSeriousDiscrepancy) {
        await addAuditLogToFirebase({
          id: `audit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: 'Current User', // Use logged-in user in real app
          action: 'update',
          entity: 'diesel',
          entityId: record.id,
          details: `Probe verification with large discrepancy of ${probeDiscrepancyValue.toFixed(1)} liters (${(probeDiscrepancyValue / record.litresFilled * 100).toFixed(1)}%) for ${record.fleetNumber}`,
          changes: {
            before: { litresFilled: record.litresFilled },
            after: { probeReading: probeReadingValue, probeDiscrepancy: probeDiscrepancyValue }
          }
        });
      }

      // Close modal and notify user
      if (isSeriousDiscrepancy) {
        alert(`Probe verification completed with a significant discrepancy of ${probeDiscrepancyValue.toFixed(1)} liters. This has been flagged for investigation.`);
      } else {
        alert('Probe verification completed successfully');
      }
      
      onClose();
    } catch (error) {
      console.error('Error verifying probe:', error);
      setErrors(prev => ({
        ...prev,
        submit: `Failed to verify probe: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status class based on discrepancy
  const getDiscrepancyClass = (value: number) => {
    const absValue = Math.abs(value);
    
    // Percentage discrepancy
    if (absValue > 10) return 'text-red-600';
    if (absValue > 5) return 'text-amber-600';
    return 'text-green-600';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enhanced Probe Verification"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Diesel Record Details */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Diesel Record Details</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-700 font-semibold">Fleet:</p>
              <p className="text-blue-900">{record.fleetNumber}</p>
            </div>
            <div>
              <p className="text-blue-700 font-semibold">Date:</p>
              <p className="text-blue-900">{formatDate(record.date)}</p>
            </div>
            <div>
              <p className="text-blue-700 font-semibold">Filled:</p>
              <p className="text-blue-900">{record.litresFilled.toFixed(1)} L</p>
            </div>
            <div>
              <p className="text-blue-700 font-semibold">Cost:</p>
              <p className="text-blue-900">{formatCurrency(record.totalCost, record.currency || 'ZAR')}</p>
            </div>
            
            <div>
              <p className="text-blue-700 font-semibold">Driver:</p>
              <p className="text-blue-900">{record.driverName}</p>
            </div>
            <div>
              <p className="text-blue-700 font-semibold">Station:</p>
              <p className="text-blue-900">{record.fuelStation}</p>
            </div>
            <div>
              <p className="text-blue-700 font-semibold">KM Reading:</p>
              <p className="text-blue-900">{record.kmReading.toLocaleString()} km</p>
            </div>
            <div>
              <p className="text-blue-700 font-semibold">Efficiency:</p>
              <p className="text-blue-900">{record.kmPerLitre?.toFixed(2) || 'N/A'} km/L</p>
            </div>
          </div>
        </div>

        {/* Information Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-amber-600 mt-0.5 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Probe Verification Process</h4>
              <p className="text-sm text-amber-700 mt-1">
                All vehicles with fuel probes require verification after filling to ensure accurate fuel tracking.
                Please check the current fuel level in the tank via the digital probe and enter it below.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label="Probe Reading (Litres) *"
              type="number"
              step="0.1"
              min="0"
              value={probeReading}
              onChange={handleProbeReadingChange}
              error={errors.probeReading}
            />
            
            {discrepancy !== null && (
              <div className={`mt-2 p-3 rounded-md ${
                Math.abs(discrepancy) > 50 
                  ? 'bg-red-50 border border-red-200'
                  : Math.abs(discrepancy) > 20
                    ? 'bg-amber-50 border border-amber-200'
                    : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-start">
                  {Math.abs(discrepancy) > 50 
                    ? <AlertTriangle className={`w-5 h-5 text-red-600 mt-0.5 mr-2`} />
                    : Math.abs(discrepancy) > 20
                      ? <AlertTriangle className={`w-5 h-5 text-amber-600 mt-0.5 mr-2`} />
                      : <CheckCircle className={`w-5 h-5 text-green-600 mt-0.5 mr-2`} />
                  }
                  <div>
                    <p className={`text-sm font-medium ${getDiscrepancyClass(discrepancy)}`}>
                      Discrepancy: {discrepancy > 0 ? '+' : ''}{discrepancy.toFixed(1)} litres
                    </p>
                    {discrepancyPercentage !== null && (
                      <p className={`text-sm ${getDiscrepancyClass(discrepancyPercentage)}`}>
                        {Math.abs(discrepancyPercentage).toFixed(1)}% {discrepancy > 0 ? 'more' : 'less'} than filled amount
                      </p>
                    )}
                    {Math.abs(discrepancy) > 50 && (
                      <p className="text-sm text-red-700 mt-1">
                        ⚠️ This large discrepancy requires investigation!
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <Input
              label="Witness Name"
              value={witnessName}
              onChange={setWitnessName}
              placeholder="Person who verified the reading"
              error={errors.witnessName}
            />
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Photo Evidence (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoEvidence(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                  file:rounded-md file:border-0 file:text-sm file:font-medium 
                  file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {photoEvidence && (
                <p className="mt-2 text-sm text-blue-600">
                  Selected: {photoEvidence.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <TextArea
          label="Verification Notes"
          value={verificationNotes}
          onChange={setVerificationNotes}
          placeholder="Add any notes about the verification process, discrepancies, or observations..."
          rows={3}
          error={errors.verificationNotes}
        />

        {/* Verification Guidelines */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Verification Guidelines</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            <li>For accurate readings, ensure the vehicle is on level ground</li>
            <li>Wait at least 10 minutes after filling before taking probe reading</li>
            <li>Discrepancies under 5% are considered normal due to measurement tolerances</li>
            <li>Discrepancies over 10% require thorough investigation and documentation</li>
            <li>For significant discrepancies, photo evidence and witness verification are required</li>
          </ul>
        </div>

        {/* Form Errors */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errors.submit}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            icon={<X className="w-4 h-4" />}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            icon={<Save className="w-4 h-4" />}
            isLoading={isSubmitting}
            disabled={isSubmitting || !probeReading}
          >
            Verify Probe Reading
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EnhancedProbeVerificationModal;