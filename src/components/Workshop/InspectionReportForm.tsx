import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Clipboard, ClipboardCheck, Save, X } from 'lucide-react';

interface InspectionItem {
  id: string;
  name: string;
  status: 'Fixed' | 'Not Fixed' | 'NA';
  notes?: string;
}

interface InspectionReportFormProps {
  vehicleId?: string;
  onSave?: (data: InspectionFormData) => void;
  onCancel?: () => void;
  existingData?: InspectionFormData;
}

interface InspectionFormData {
  reportNumber: string;
  vehicleId: string;
  inspectionDate: string;
  mechanicName: string;
  overallVehicleCondition: 'Yes' | 'No';
  items: InspectionItem[];
  additionalNotes: string;
}

const InspectionReportForm: React.FC<InspectionReportFormProps> = ({ 
  vehicleId = '', 
  onSave, 
  onCancel,
  existingData
}) => {
  // Initial items to inspect
  const defaultItems: InspectionItem[] = [
    { id: '1', name: 'Mudflaps', status: 'NA' },
    { id: '2', name: 'Bushes', status: 'NA' },
    { id: '3', name: 'U-Bolts', status: 'NA' },
    { id: '4', name: 'Brakes', status: 'NA' },
    { id: '5', name: 'Lights', status: 'NA' },
    { id: '6', name: 'Windshield', status: 'NA' },
    { id: '7', name: 'Tires', status: 'NA' },
    { id: '8', name: 'Fluid Levels', status: 'NA' },
    { id: '9', name: 'Battery', status: 'NA' },
    { id: '10', name: 'Safety Equipment', status: 'NA' }
  ];

  // State for form data
  const [formData, setFormData] = useState<InspectionFormData>(existingData || {
    reportNumber: `INSP${Math.floor(1000 + Math.random() * 9000)}`,
    vehicleId: vehicleId,
    inspectionDate: new Date().toISOString().split('T')[0],
    mechanicName: '',
    overallVehicleCondition: 'No',
    items: defaultItems,
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update item status
  const handleItemStatusChange = (id: string, status: 'Fixed' | 'Not Fixed' | 'NA') => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, status } : item
      )
    }));
  };

  // Update item notes
  const handleItemNotesChange = (id: string, notes: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, notes } : item
      )
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onSave) {
        onSave(formData);
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Clipboard className="mr-2 h-5 w-5" />
            Inspection Report Form
          </h2>
          <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Report #: {formData.reportNumber}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle ID
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.vehicleId}
                onChange={(e) => setFormData(prev => ({ ...prev, vehicleId: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inspection Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.inspectionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, inspectionDate: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mechanic Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={formData.mechanicName}
                onChange={(e) => setFormData(prev => ({ ...prev, mechanicName: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overall Vehicle Condition
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    name="condition"
                    value="Yes"
                    checked={formData.overallVehicleCondition === 'Yes'}
                    onChange={() => setFormData(prev => ({ ...prev, overallVehicleCondition: 'Yes' }))}
                  />
                  <span className="ml-2">Satisfactory</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    name="condition"
                    value="No"
                    checked={formData.overallVehicleCondition === 'No'}
                    onChange={() => setFormData(prev => ({ ...prev, overallVehicleCondition: 'No' }))}
                  />
                  <span className="ml-2">Unsatisfactory</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <ClipboardCheck className="mr-2 h-5 w-5" />
              Inspection Items
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio h-4 w-4 text-green-600"
                              name={`status-${item.id}`}
                              checked={item.status === 'Fixed'}
                              onChange={() => handleItemStatusChange(item.id, 'Fixed')}
                            />
                            <span className="ml-2 text-green-600">Fixed</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio h-4 w-4 text-red-600"
                              name={`status-${item.id}`}
                              checked={item.status === 'Not Fixed'}
                              onChange={() => handleItemStatusChange(item.id, 'Not Fixed')}
                            />
                            <span className="ml-2 text-red-600">Not Fixed</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="form-radio h-4 w-4 text-gray-400"
                              name={`status-${item.id}`}
                              checked={item.status === 'NA'}
                              onChange={() => handleItemStatusChange(item.id, 'NA')}
                            />
                            <span className="ml-2 text-gray-500">N/A</span>
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Add notes..."
                          value={item.notes || ''}
                          onChange={(e) => handleItemNotesChange(item.id, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter any additional observations or comments..."
              value={formData.additionalNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                icon={<X className="w-4 h-4 mr-2" />}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              icon={<Save className="w-4 h-4 mr-2" />}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Inspection Report'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default InspectionReportForm;
