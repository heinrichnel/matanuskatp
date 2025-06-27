import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Input, Select, TextArea } from './FormElements';
import { X, Save, AlertTriangle } from 'lucide-react';

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  value: string | number | boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  rows?: number;
}

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  onSubmit: (formData: Record<string, any>) => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  description?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  submitButtonText = 'Save',
  cancelButtonText = 'Cancel',
  description,
  maxWidth = 'md'
}) => {
  // Initialize form state from fields
  const initialFormData = fields.reduce((acc, field) => {
    acc[field.id] = field.value;
    return acc;
  }, {} as Record<string, any>);

  const [formData, setFormData] = useState<Record<string, any>>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form field changes
  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Clear error when field is changed
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  // Mark field as touched on blur
  const handleBlur = (id: string) => {
    setTouched(prev => ({ ...prev, [id]: true }));
    validateField(id, formData[id]);
  };

  // Validate a single field
  const validateField = (id: string, value: any): boolean => {
    const field = fields.find(f => f.id === id);
    if (!field) return true;

    if (field.required && (value === '' || value === undefined || value === null)) {
      setErrors(prev => ({ ...prev, [id]: `${field.label} is required` }));
      return false;
    }

    if (field.type === 'number') {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        setErrors(prev => ({ ...prev, [id]: `${field.label} must be a valid number` }));
        return false;
      }
      
      if (field.min !== undefined && numValue < Number(field.min)) {
        setErrors(prev => ({ ...prev, [id]: `${field.label} must be at least ${field.min}` }));
        return false;
      }
      
      if (field.max !== undefined && numValue > Number(field.max)) {
        setErrors(prev => ({ ...prev, [id]: `${field.label} must be at most ${field.max}` }));
        return false;
      }
    }

    return true;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach(field => {
      if (field.required && (formData[field.id] === '' || formData[field.id] === undefined || formData[field.id] === null)) {
        newErrors[field.id] = `${field.label} is required`;
        isValid = false;
      }

      if (field.type === 'number' && formData[field.id] !== '') {
        const numValue = Number(formData[field.id]);
        if (isNaN(numValue)) {
          newErrors[field.id] = `${field.label} must be a valid number`;
          isValid = false;
        } else {
          if (field.min !== undefined && numValue < Number(field.min)) {
            newErrors[field.id] = `${field.label} must be at least ${field.min}`;
            isValid = false;
          }
          
          if (field.max !== undefined && numValue > Number(field.max)) {
            newErrors[field.id] = `${field.label} must be at most ${field.max}`;
            isValid = false;
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = fields.reduce((acc, field) => {
      acc[field.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setTouched(allTouched);
    
    // Validate form
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors(prev => ({ 
        ...prev, 
        form: error instanceof Error ? error.message : 'An error occurred during submission' 
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form fields based on type
  const renderField = (field: FormField) => {
    const { id, label, type, placeholder, required, options, min, max, step, rows } = field;
    const hasError = touched[id] && errors[id];

    switch (type) {
      case 'select':
        return (
          <Select
            key={id}
            label={`${label}${required ? ' *' : ''}`}
            value={formData[id]?.toString() || ''}
            onChange={(value) => handleChange(id, value)}
            onBlur={() => handleBlur(id)}
            options={options || []}
            error={hasError ? errors[id] : undefined}
          />
        );
      
      case 'textarea':
        return (
          <TextArea
            key={id}
            label={`${label}${required ? ' *' : ''}`}
            value={formData[id]?.toString() || ''}
            onChange={(value) => handleChange(id, value)}
            placeholder={placeholder}
            rows={rows || 3}
            error={hasError ? errors[id] : undefined}
          />
        );
      
      case 'checkbox':
        return (
          <div key={id} className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id={id}
              checked={Boolean(formData[id])}
              onChange={(e) => handleChange(id, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
              {label}
            </label>
          </div>
        );
      
      default:
        return (
          <Input
            key={id}
            label={`${label}${required ? ' *' : ''}`}
            type={type}
            value={formData[id]?.toString() || ''}
            onChange={(value) => handleChange(id, value)}
            onBlur={() => handleBlur(id)}
            placeholder={placeholder}
            error={hasError ? errors[id] : undefined}
          />
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Description */}
        {description && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-700">{description}</p>
          </div>
        )}
        
        {/* Form Fields */}
        <div className="space-y-4">
          {fields.map(field => renderField(field))}
        </div>
        
        {/* Form Error */}
        {errors.form && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm text-red-700">{errors.form}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Form Actions */}
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
      </form>
    </Modal>
  );
};

export default ModalForm;