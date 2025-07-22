import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

export interface VerticalStepItem {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'pending';
}

interface VerticalStepperProps {
  steps: VerticalStepItem[];
  onStepClick?: (stepId: string) => void;
  className?: string;
}

const VerticalStepper: React.FC<VerticalStepperProps> = ({
  steps,
  onStepClick,
  className = '',
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.id} className="flex">
            {/* Step connector line */}
            <div className="flex flex-col items-center">
              {/* Circle indicator */}
              <div 
                onClick={onClick}
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full z-10
                  ${step.status === 'completed' 
                    ? 'bg-blue-600 text-white' 
                    : step.status === 'current' 
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border-2 border-gray-300 text-gray-500'}
                  ${onStepClick ? 'cursor-pointer' : ''}
                `}
              >
                {step.status === 'completed' ? (
                  <CheckCircle className="h-6 w-6" />
                ) : step.status === 'current' ? (
                  <Circle className="h-4 w-4 fill-white" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </div>
              
              {/* Vertical line */}
              {!isLast && (
                <div 
                  className={`w-0.5 h-20
                    ${index < steps.findIndex(s => s.status === 'pending')
                      ? 'bg-blue-600' 
                      : 'bg-gray-300'}
                  `}
                />
              )}
            </div>
            
            {/* Step content */}
            <div className="ml-4 pb-8">
              <h3 
                className={`font-medium
                  ${step.status === 'completed' || step.status === 'current' 
                    ? 'text-gray-900' 
                    : 'text-gray-500'}
                `}
              >
                {step.title}
              </h3>
              {step.description && (
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VerticalStepper;
