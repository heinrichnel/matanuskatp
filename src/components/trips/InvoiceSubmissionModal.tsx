import React from 'react';

export interface InvoiceSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: any;
  onSubmit: (data: any) => void;
  onAddAdditionalCost: (cost: any, files?: FileList) => void;
  onRemoveAdditionalCost: (costId: string) => void;
}

const InvoiceSubmissionModal: React.FC<InvoiceSubmissionModalProps> = ({ isOpen, onClose, trip, onSubmit }) => {
  if (!isOpen) return null;
  return <div />;
};

export default InvoiceSubmissionModal;
