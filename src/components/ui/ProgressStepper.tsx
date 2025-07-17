import React from 'react';
import { CheckCircle } from 'lucide-react';

export interface StepperItem {
  id: string;
  label: string;
  status: 'completed' | 'current' | 'pending';
}

interface ProgressStepperProps {
  steps: StepperItem[];
  currentStepIndex?: number;
  onStepClick?: (stepId: string) => void;
  className?: string;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  onStepClick,
  className = '',
}) => {
  return (
    <div className={`flex w-full items-center ${className}`}>
      {steps.map((step, index) => {
        const isFirst = index === 0;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.id}>
            {/* Step circle with number or checkmark */}
            <div className="flex flex-col items-center">
              <div 
                onClick={() => onStepClick && onStepClick(step.id)}
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full
                  ${step.status === 'completed' 
                    ? 'bg-blue-600 text-white' 
                    : step.status === 'current' 
                      ? 'border-2 border-blue-600 text-blue-600'
                      : 'border-2 border-gray-300 text-gray-500'}
                  ${onStepClick ? 'cursor-pointer' : ''}
                `}
              >
                {step.status === 'completed' ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span 
                className={`mt-2 text-sm font-medium
                  ${step.status === 'completed' || step.status === 'current' 
                    ? 'text-blue-600' 
                    : 'text-gray-500'}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line between steps */}
            {!isLast && (
              <div 
                className={`flex-1 h-0.5 mx-4
                  ${index < steps.findIndex(s => s.status === 'current')
                    ? 'bg-blue-600' 
                    : 'bg-gray-300'}
                `}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ProgressStepper;
