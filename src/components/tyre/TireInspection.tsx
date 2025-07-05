
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input, Select, TextArea } from "@/components/ui/FormElements";
import { VehicleSelector } from "@/components/common/VehicleSelector";
import { Camera, Save } from "lucide-react";
import { TyreConditionStatus } from '@/types/workshop-tyre-inventory';

interface TyreInspectionData {
  vehicleId: string;
  position: string;
  inspectorName: string;
  treadDepth: string;
  pressure: string;
  condition: TyreConditionStatus | '';
  damage: string;
  notes: string;
  photos: string[];
}

interface TyreInspectionFormProps {
  onSave: (data: TyreInspectionData) => void;
}

export const TyreInspectionForm: React.FC<TyreInspectionFormProps> = ({ onSave }) => {
  const [inspectionData, setInspectionData] = useState<TyreInspectionData>({
    vehicleId: '',
    position: '',
    inspectorName: '',
    treadDepth: '',
    pressure: '',
    condition: '',
    damage: '',
    notes: '',
    photos: []
  });

  const tyrePositions = [
    { label: 'Front Left (FL)', value: 'FL' },
    { label: 'Front Right (FR)', value: 'FR' },
    { label: 'Rear Left Outer (RL1)', value: 'RL1' },
    { label: 'Rear Left Inner (RL2)', value: 'RL2' },
    { label: 'Rear Right Outer (RR1)', value: 'RR1' },
    { label: 'Rear Right Inner (RR2)', value: 'RR2' }
  ];

  const conditionOptions = [
    { label: 'Select condition...', value: '' },
    { label: 'Good', value: 'good' },
    { label: 'Warning', value: 'warning' },
    { label: 'Critical', value: 'critical' },
    { label: 'Needs Replacement', value: 'needs_replacement' }
  ];

  const damageTypes = [
    { label: 'No damage', value: 'none' },
    { label: 'Uneven wear', value: 'uneven_wear' },
    { label: 'Cracking', value: 'cracking' },
    { label: 'Bulge', value: 'bulge' },
    { label: 'Puncture', value: 'puncture' },
    { label: 'Sidewall damage', value: 'sidewall_damage' },
    { label: 'Tread separation', value: 'tread_separation' }
  ];

  const handleSave = () => {
    onSave(inspectionData);
    
    // Reset form
    setInspectionData({
      vehicleId: '',
      position: '',
      inspectorName: '',
      treadDepth: '',
      pressure: '',
      condition: '',
      damage: '',
      notes: '',
      photos: []
    });
  };

  return (
    <div className="space-y-4">
      <VehicleSelector
        value={inspectionData.vehicleId}
        onChange={(value) => setInspectionData(prev => ({ ...prev, vehicleId: value }))}
        label="Vehicle"
        placeholder="Select vehicle for inspection..."
        activeOnly={false}
      />

      <Select
        label="Tyre Position"
        value={inspectionData.position}
        onChange={(value) => setInspectionData(prev => ({ ...prev, position: value }))}
        options={tyrePositions}
      />

      <Input
        label="Inspector Name"
        value={inspectionData.inspectorName}
        onChange={(value) => setInspectionData(prev => ({ ...prev, inspectorName: value }))}
        placeholder="Enter inspector name"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Tread Depth (mm)"
          type="number"
          step="0.1"
          value={inspectionData.treadDepth}
          onChange={(value) => setInspectionData(prev => ({ ...prev, treadDepth: value }))}
          placeholder="0.0"
        />

        <Input
          label="Tyre Pressure (PSI)"
          type="number"
          value={inspectionData.pressure}
          onChange={(value) => setInspectionData(prev => ({ ...prev, pressure: value }))}
          placeholder="0"
        />
      </div>

      <Select
        label="Overall Condition"
        value={inspectionData.condition}
        onChange={(value) => setInspectionData(prev => ({ ...prev, condition: value as TyreConditionStatus | '' }))}
        options={conditionOptions}
      />

      <Select
        label="Damage Type"
        value={inspectionData.damage}
        onChange={(value) => setInspectionData(prev => ({ ...prev, damage: value }))}
        options={damageTypes}
      />

      <TextArea
        label="Additional Notes"
        value={inspectionData.notes}
        onChange={(value) => setInspectionData(prev => ({ ...prev, notes: value }))}
        placeholder="Any additional observations or recommendations..."
        rows={4}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium">Photos</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Click to add photos</p>
          <Button variant="outline" size="sm" className="mt-2">
            Add Photos
          </Button>
        </div>
      </div>

      <Button 
        onClick={handleSave}
        className="w-full"
        disabled={!inspectionData.vehicleId || !inspectionData.position}
      >
        <Save className="w-4 h-4 mr-2" />
        Save Inspection
      </Button>
    </div>
  );
};
