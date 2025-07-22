import React, { useState } from 'react';
import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import { Input } from '../../../ui/FormElements';
import { CheckCircle, X } from 'lucide-react';

type TyreInspection = {
  fleetNumber: string;
  tyrePosition: string;
  treadDepth: number;
  pressure: number;
  visualCondition: string;
  comments?: string;
  inspectedAt: string;
}

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (inspection: TyreInspection) => void;
  tyrePosition: string;
  fleetNumber: string;
};

const TyreInspectionModal: React.FC<Props> = ({ 
  open, 
  onClose, 
  onSubmit, 
  tyrePosition, 
  fleetNumber 
}) => {
  const [treadDepth, setTreadDepth] = useState('');
  const [pressure, setPressure] = useState('');
  const [visualCondition, setVisualCondition] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    if (!treadDepth || !pressure || !visualCondition) return alert("All fields are required");

    const inspection: TyreInspection = {
      fleetNumber,
      tyrePosition,
      treadDepth: parseFloat(treadDepth),
      pressure: parseFloat(pressure),
      visualCondition,
      comments,
      inspectedAt: new Date().toISOString(),
    };

    onSubmit(inspection);
    handleClose();
  };

  const handleClose = () => {
    setTreadDepth('');
    setPressure('');
    setVisualCondition('');
    setComments('');
    onClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={handleClose}
      title={`Tyre Inspection - ${tyrePosition}`}
    >
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Fleet Number</label>
          <Input 
            value={fleetNumber} 
            disabled={true} 
            className="bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tyre Position</label>
          <Input 
            value={tyrePosition} 
            disabled={true} 
            className="bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tread Depth (mm)</label>
          <Input
            type="number"
            value={treadDepth}
            onChange={(e) => setTreadDepth(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Pressure (PSI)</label>
          <Input
            type="number"
            value={pressure}
            onChange={(e) => setPressure(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Visual Condition</label>
          <select
            value={visualCondition}
            onChange={(e) => setVisualCondition(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Condition</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Comments</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button onClick={handleClose} variant="outline" className="flex items-center">
            <X size={18} className="mr-1" /> Cancel
          </Button>
          <Button onClick={handleSubmit} variant="primary" className="flex items-center">
            <CheckCircle size={18} className="mr-1" /> Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TyreInspectionModal;
