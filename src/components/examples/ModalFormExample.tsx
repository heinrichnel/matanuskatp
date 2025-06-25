import React, { useState } from 'react';
import ModalForm, { FormField } from '../ui/ModalForm';
import Button from '../ui/Button';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { Plus, User, Calendar, DollarSign, MapPin } from 'lucide-react';

const ModalFormExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formResult, setFormResult] = useState<Record<string, any> | null>(null);

  // Example form fields
  const formFields: FormField[] = [
    {
      id: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true,
      value: ''
    },
    {
      id: 'email',
      label: 'Email Address',
      type: 'text',
      placeholder: 'your.email@example.com',
      required: true,
      value: ''
    },
    {
      id: 'birthdate',
      label: 'Date of Birth',
      type: 'date',
      required: false,
      value: ''
    },
    {
      id: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      options: [
        { label: 'Select a department', value: '' },
        { label: 'Human Resources', value: 'hr' },
        { label: 'Engineering', value: 'engineering' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Finance', value: 'finance' },
        { label: 'Operations', value: 'operations' }
      ],
      value: ''
    },
    {
      id: 'salary',
      label: 'Annual Salary',
      type: 'number',
      placeholder: '0.00',
      required: true,
      min: 0,
      step: 1000,
      value: ''
    },
    {
      id: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Enter your full address',
      rows: 3,
      value: ''
    },
    {
      id: 'newsletter',
      label: 'Subscribe to newsletter',
      type: 'checkbox',
      value: false
    }
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted with data:', data);
    setFormResult(data);
    
    // In a real app, you would send this data to your backend
    return data;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Modal Form Example</h2>
        <Button 
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Open Form Modal
        </Button>
      </div>

      {formResult && (
        <Card>
          <CardHeader title="Form Submission Result" />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{formResult.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium">{formResult.birthdate || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{formResult.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{formResult.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">
                    {formResult.department === 'hr' ? 'Human Resources' :
                     formResult.department === 'engineering' ? 'Engineering' :
                     formResult.department === 'marketing' ? 'Marketing' :
                     formResult.department === 'finance' ? 'Finance' :
                     formResult.department === 'operations' ? 'Operations' : 'Unknown'}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Annual Salary</p>
                    <p className="font-medium">${Number(formResult.salary).toLocaleString()}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Newsletter</p>
                  <p className="font-medium">{formResult.newsletter ? 'Subscribed' : 'Not subscribed'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Employee Information Form"
        description="Please fill out all required fields to add a new employee to the system."
        fields={formFields}
        onSubmit={handleSubmit}
        submitButtonText="Save Employee"
      />
    </div>
  );
};

export default ModalFormExample;