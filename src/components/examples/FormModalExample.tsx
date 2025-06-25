import React, { useState } from 'react';
import FormModal from '../ui/FormModal';
import Button from '../ui/Button';
import { Input, Select, TextArea } from '../ui/FormElements';
import { Plus, AlertTriangle } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../ui/Card';

interface FormData {
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  assignee: string;
  tags: string;
}

const FormModalExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    assignee: '',
    tags: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is changed
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (!formData.assignee) {
      newErrors.assignee = 'Assignee is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmittedData(formData);
      setIsModalOpen(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: '',
        dueDate: '',
        assignee: '',
        tags: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
        <Button 
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Create New Task
        </Button>
      </div>

      {submittedData && (
        <Card>
          <CardHeader title="Last Submitted Task" />
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{submittedData.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{submittedData.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Priority</p>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      submittedData.priority === 'high' ? 'bg-red-100 text-red-800' :
                      submittedData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {submittedData.priority.charAt(0).toUpperCase() + submittedData.priority.slice(1)}
                    </span>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Due Date</p>
                  <p className="mt-1">{new Date(submittedData.dueDate).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Assignee</p>
                  <p className="mt-1">{submittedData.assignee}</p>
                </div>
              </div>
              
              {submittedData.tags && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Tags</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {submittedData.tags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
        onSubmit={handleSubmit}
        submitButtonText="Create Task"
        isSubmitting={isSubmitting}
      >
        <div className="space-y-4">
          {/* Form Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-700">
              Create a new task by filling out the form below. Tasks will be assigned to the selected team member and tracked in the system.
            </p>
          </div>
          
          {/* Title */}
          <Input
            label="Task Title *"
            value={formData.title}
            onChange={(value) => handleChange('title', value)}
            placeholder="Enter task title"
            error={errors.title}
          />
          
          {/* Description */}
          <TextArea
            label="Description"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            placeholder="Describe the task in detail..."
            rows={3}
          />
          
          {/* Priority & Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Priority *"
              value={formData.priority}
              onChange={(value) => handleChange('priority', value)}
              options={[
                { label: 'Select priority', value: '' },
                { label: 'High', value: 'high' },
                { label: 'Medium', value: 'medium' },
                { label: 'Low', value: 'low' }
              ]}
              error={errors.priority}
            />
            
            <Input
              label="Due Date *"
              type="date"
              value={formData.dueDate}
              onChange={(value) => handleChange('dueDate', value)}
              min={new Date().toISOString().split('T')[0]}
              error={errors.dueDate}
            />
          </div>
          
          {/* Assignee & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Assignee *"
              value={formData.assignee}
              onChange={(value) => handleChange('assignee', value)}
              options={[
                { label: 'Select assignee', value: '' },
                { label: 'John Doe', value: 'John Doe' },
                { label: 'Jane Smith', value: 'Jane Smith' },
                { label: 'Robert Johnson', value: 'Robert Johnson' },
                { label: 'Emily Davis', value: 'Emily Davis' }
              ]}
              error={errors.assignee}
            />
            
            <Input
              label="Tags (comma separated)"
              value={formData.tags}
              onChange={(value) => handleChange('tags', value)}
              placeholder="e.g., frontend, bug, feature"
            />
          </div>
          
          {/* Form Validation Errors */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                  <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </FormModal>
    </div>
  );
};

export default FormModalExample;