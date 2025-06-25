import React, { useState, ReactNode } from 'react';
import Modal from './Modal';
import Button from './Button';
import { X, Save } from 'lucide-react';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  isSubmitting?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  footer?: ReactNode;
}

/**
 * A modal component specifically designed for forms
 * This is a simpler alternative to ModalForm when you need more control over the form content
 */
const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  submitButtonText = 'Save',
  cancelButtonText = 'Cancel',
  isSubmitting = false,
  maxWidth = 'md',
  footer
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Content */}
        {children}
        
        {/* Form Actions */}
        {footer ? (
          footer
        ) : (
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              icon={<X className="w-4 h-4" />}
              disabled={isSubmitting}
            >
              {cancelButtonText}
            </Button>
            <Button
              type="submit"
              icon={<Save className="w-4 h-4" />}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {submitButtonText}
            </Button>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default FormModal;