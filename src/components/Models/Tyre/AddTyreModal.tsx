import React from 'react';
import TyreFormModal from './TyreFormModal';

interface AddTyreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tyreData: any) => Promise<void>;
  initialData?: any;
}

const AddTyreModal: React.FC<AddTyreModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  return (
    <TyreFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
      editMode={false}
    />
  );
};

export default AddTyreModal;