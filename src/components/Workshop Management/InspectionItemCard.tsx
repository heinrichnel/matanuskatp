import React, { useState } from 'react';
import Button from '../ui/Button';
import { CheckCircle, X, Clock, AlertTriangle } from 'lucide-react';

interface InspectionItemCardProps {
  item: {
    id: string;
    title: string;
    description?: string;
    category: string;
    requiredRole: string;
    isCritical: boolean;
    passFailOnly: boolean;
    valueType?: string;
    unitOfMeasure?: string;
  };
  onStatusChange: (itemId: string, status: 'pass' | 'fail' | 'pending', notes: string) => void;
  currentStatus?: 'pass' | 'fail' | 'pending';
  currentNotes?: string;
  disabled?: boolean;
}

const InspectionItemCard: React.FC<InspectionItemCardProps> = ({ 
  item, 
  onStatusChange, 
  currentStatus = 'pending',
  currentNotes = '',
  disabled = false
}) => {
  const [status, setStatus] = useState<'pass' | 'fail' | 'pending'>(currentStatus);
  const [notes, setNotes] = useState<string>(currentNotes);
  
  const handleStatusChange = (newStatus: 'pass' | 'fail' | 'pending') => {
    if (disabled) return;
    
    setStatus(newStatus);
    onStatusChange(item.id, newStatus, notes);
    
    // If status is fail, prompt for notes if none provided
    if (newStatus === 'fail' && !notes) {
      document.getElementById(`notes-${item.id}`)?.focus();
    }
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    
    setNotes(e.target.value);
    onStatusChange(item.id, status, e.target.value);
  };
  
  return (
    <div className={`p-4 rounded-lg border ${
      status === 'pass' ? 'bg-green-50 border-green-200' : 
      status === 'fail' ? 'bg-red-50 border-red-200' : 
      'bg-gray-50 border-gray-200'
    } ${disabled ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center">
            <h3 className="text-md font-medium text-gray-900">{item.title}</h3>
            {item.isCritical && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                CRITICAL
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="xs"
            variant={status === 'pass' ? 'success' : 'outline'}
            onClick={onClick || (() => {})}
            disabled={disabled}
            icon={<CheckCircle className="w-3 h-3" />}
          >
            Pass
          </Button>
          <Button
            size="xs"
            variant={status === 'fail' ? 'danger' : 'outline'}
            onClick={onClick || (() => {})}
            disabled={disabled}
            icon={<X className="w-3 h-3" />}
          >
            Fail
          </Button>
          <Button
            size="xs"
            variant={status === 'pending' ? 'outline' : 'outline'}
            onClick={onClick || (() => {})}
            disabled={disabled}
            icon={<Clock className="w-3 h-3" />}
          >
            Pending
          </Button>
        </div>
      </div>
      
      {/* Status indicator */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-sm font-medium">Status:</span>
        {status === 'pass' && (
          <span className="flex items-center text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" /> Pass
          </span>
        )}
        {status === 'fail' && (
          <span className="flex items-center text-red-600">
            <X className="w-4 h-4 mr-1" /> Fail
          </span>
        )}
        {status === 'pending' && (
          <span className="flex items-center text-yellow-600">
            <Clock className="w-4 h-4 mr-1" /> Pending
          </span>
        )}
      </div>
      
      {/* Conditional UI based on item type */}
      {item.valueType === 'numeric' && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Value:</label>
          <div className="flex items-center">
            <input 
              type="number" 
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={disabled || status === 'pending'}
            />
            {item.unitOfMeasure && (
              <span className="ml-2 text-sm text-gray-500">{item.unitOfMeasure}</span>
            )}
          </div>
        </div>
      )}
      
      {item.valueType === 'yes-no' && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Value:</label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name={`yesno-${item.id}`}
                value="yes"
                className="form-radio h-4 w-4 text-blue-600"
                disabled={disabled || status === 'pending'}
              />
              <span className="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name={`yesno-${item.id}`}
                value="no"
                className="form-radio h-4 w-4 text-blue-600"
                disabled={disabled || status === 'pending'}
              />
              <span className="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>
      )}
      
      {/* Notes field - always shown but focused when failing */}
      <div>
        <label 
          htmlFor={`notes-${item.id}`}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {status === 'fail' ? 'Notes (Required)' : 'Notes (Optional)'}
        </label>
        <textarea
          id={`notes-${item.id}`}
          value={notes}
          onChange={handleNotesChange}
          placeholder={status === 'fail' ? "Detail why this check failed..." : "Add any notes..."}
          className={`w-full border rounded-md px-3 py-2 text-sm ${
            status === 'fail' && !notes ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 
            'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }`}
          rows={2}
          disabled={disabled}
        />
        
        {status === 'fail' && !notes && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Notes are required when an item fails
          </p>
        )}
      </div>
      
      {/* Show auto job card creation notice for critical fails */}
      {item.isCritical && status === 'fail' && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-xs text-amber-800 flex items-center">
            <AlertTriangle className="w-3 h-3 mr-1" />
            This is a critical item. A job card will be automatically created.
          </p>
        </div>
      )}
    </div>
  );
};

export default InspectionItemCard;