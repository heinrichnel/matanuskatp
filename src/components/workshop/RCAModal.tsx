import React, { useState } from 'react';
import { TextArea, Select, Input } from '../ui/FormElements';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

// Root cause options based on spec
const ROOT_CAUSES = [
  { label: 'Driver/Employee Negligence', value: 'driver_negligence' },
  { label: 'Premature Failure/Defective Part', value: 'defective_part' },
  { label: 'Poor Installation', value: 'poor_installation' },
  { label: 'Inadequate Maintenance', value: 'inadequate_maintenance' },
  { label: 'Excessive Wear and Tear', value: 'excessive_wear' },
  { label: 'Other (specify in Note)', value: 'other' },
];

// Sample of users from spec for RCA conducted by / responsible person
const USERS = [
  { label: 'Hein Nel', value: 'HeinNel' },
  { label: 'Adrian Moyo', value: 'AdrianMoyo' },
  { label: 'Phillimon Kwarire', value: 'PhillimonKwarire' },
  { label: 'Luckson Tanyanyiwa', value: 'LucksonTanyanyiwa' },
  { label: 'Biggie Mugwa', value: 'BiggieMugwa' },
  { label: 'Wellington Musumbu', value: 'WellingtonMusumbu' },
  { label: 'Workshop', value: 'Workshop' },
  { label: 'Bradley Milner', value: 'Bradley' },
  { label: 'Witness Kajayi', value: 'Witness' },
  { label: 'Kenneth Rukweza', value: 'Kenneth' },
  // Add more users as needed
];

interface RCAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rcaData: {
    rootCause: string;
    conductedBy: string;
    responsiblePerson: string;
    notes: string;
    date: string;
  }) => void;
  defaultRCAData?: {
    rootCause?: string;
    conductedBy?: string;
    responsiblePerson?: string;
    notes?: string;
    date?: string;
  };
}

const RCAModal: React.FC<RCAModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultRCAData = {}
}) => {
  const [rcaData, setRcaData] = useState({
    rootCause: defaultRCAData.rootCause || '',
    conductedBy: defaultRCAData.conductedBy || '',
    responsiblePerson: defaultRCAData.responsiblePerson || '',
    notes: defaultRCAData.notes || '',
    date: defaultRCAData.date || new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setRcaData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is changed
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!rcaData.rootCause) {
      newErrors.rootCause = 'Root Cause is required';
    }
    
    if (!rcaData.conductedBy) {
      newErrors.conductedBy = 'RCA Conducted By is required';
    }
    
    if (rcaData.rootCause === 'driver_negligence' && !rcaData.responsiblePerson) {
      newErrors.responsiblePerson = 'Responsible Person is required for Driver/Employee Negligence';
    }
    
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(rcaData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Root Cause Analysis (RCA)">
      <div className="p-4">
        <div className="mb-4 text-red-600 font-medium">
          This job card has been flagged for Root Cause Analysis due to repeat main item replacement within 3 months.
          RCA must be completed before the job card can be closed.
        </div>
        
        <div className="space-y-4">
          <Select
            label="Root Cause"
            value={rcaData.rootCause}
            onChange={(value) => handleChange('rootCause', value)}
            options={[
              { label: 'Select root cause...', value: '' },
              ...ROOT_CAUSES
            ]}
            required
            error={errors.rootCause}
          />
          
          <Select
            label="RCA Conducted By"
            value={rcaData.conductedBy}
            onChange={(value) => handleChange('conductedBy', value)}
            options={[
              { label: 'Select person...', value: '' },
              ...USERS
            ]}
            required
            error={errors.conductedBy}
          />
          
          <Select
            label="Responsible Person"
            value={rcaData.responsiblePerson}
            onChange={(value) => handleChange('responsiblePerson', value)}
            options={[
              { label: 'Select person...', value: '' },
              ...USERS
            ]}
            required={rcaData.rootCause === 'driver_negligence'}
            error={errors.responsiblePerson}
          />
          
          <TextArea
            label="Notes"
            value={rcaData.notes}
            onChange={(value) => handleChange('notes', value)}
            placeholder="Additional notes about the root cause and corrective actions"
            rows={4}
          />
          
          <Input
            label="Date"
            type="date"
            value={rcaData.date}
            onChange={(value) => handleChange('date', value)}
            required
          />
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
          >
            Submit RCA
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RCAModal;