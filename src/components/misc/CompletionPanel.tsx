import React, { useState } from 'react';
import Card, { CardContent, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Check, CheckCircle, FileText, AlertTriangle, DollarSign } from 'lucide-react';

interface CompletionPanelProps {
  jobCardId: string;
  status: string;
  tasks: {
    id: string;
    status: 'pending' | 'in_progress' | 'completed' | 'verified' | 'not_applicable';
  }[];
  faultId?: string;
  onComplete: (jobCardId: string) => Promise<void>;
  onGenerateInvoice: (jobCardId: string) => Promise<void>;
  isLoading?: boolean;
}

const CompletionPanel: React.FC<CompletionPanelProps> = ({
  jobCardId,
  status,
  tasks,
  faultId,
  onComplete,
  onGenerateInvoice,
  isLoading = false
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Check if all tasks are verified or N/A (for supervisors)
  const allTasksVerified = tasks.every(
    task => task.status === 'verified' || task.status === 'not_applicable'
  );
  
  // Check if the job card is already completed
  const isCompleted = status === 'completed';

  const handleCompleteClick = () => {
    if (!allTasksVerified) return;
    setShowConfirmation(true);
  };

  const handleConfirmComplete = async () => {
    try {
      setIsCompleting(true);
      await onComplete(jobCardId);
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error completing job card:', error);
      alert('Failed to complete job card. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleGenerateInvoice = async () => {
    if (!isCompleted) return;
    
    try {
      setIsGeneratingInvoice(true);
      await onGenerateInvoice(jobCardId);
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Job Completion" />
      <CardContent>
        {!isCompleted ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              allTasksVerified ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start space-x-3">
                {allTasksVerified ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    {allTasksVerified ? 'Ready for Completion' : 'Completion Requirements'}
                  </h4>
                  {allTasksVerified ? (
                    <p className="text-sm text-green-700 mt-1">
                      All tasks are completed and verified. This job card is ready to be marked as completed.
                    </p>
                  ) : (
                    <div className="text-sm text-yellow-700 mt-1">
                      <p>The following requirements must be met before completing the job:</p>
                      <ul className="list-disc pl-5 mt-1">
                        <li>All tasks must be marked as verified or not applicable by a supervisor</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={onClick}
                disabled={!allTasksVerified || isLoading || isCompleting}
                isLoading={isCompleting}
                icon={<CheckCircle className="w-4 h-4" />}
                size="lg"
              >
                Mark Job as Completed
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Job Completed & Verified</h4>
                  <p className="text-sm text-green-700 mt-1">
                    This job card has been completed. You can now generate an invoice.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={onClick}
                disabled={isLoading || isGeneratingInvoice}
                isLoading={isGeneratingInvoice}
                icon={<DollarSign className="w-4 h-4" />}
                size="lg"
              >
                Generate Invoice
              </Button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Job Completion</h3>
              
              <p className="text-gray-700 mb-4">
                Are you sure you want to mark this job as completed? This action will:
              </p>
              
              <ul className="list-disc pl-5 mb-4 text-sm text-gray-600 space-y-1">
                <li>Set the job status to "completed"</li>
                <li>Record the completion timestamp</li>
                {faultId && <li>Automatically mark the linked fault as resolved</li>}
                <li>Allow invoice generation</li>
                <li>Create a completion audit entry</li>
              </ul>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClick}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={onClick}
                  isLoading={isCompleting}
                >
                  Confirm Completion
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompletionPanel;