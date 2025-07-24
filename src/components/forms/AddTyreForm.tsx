import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Truck, Save, X, Plus, Calendar, Ruler } from 'lucide-react';

interface TyreData {
  id?: string;
  tyreNumber: string;
  tyreSize: string;
  type: string;
  pattern: string;
  manufacturer: string;
  year: string;
  cost: number;
  condition: 'New' | 'Used' | 'Retreaded' | 'Scrap';
  status: 'In-Service' | 'In-Stock' | 'Repair' | 'Scrap';
  vehicleAssigned: string;
  axlePosition: string;
  mountStatus: 'Mounted' | 'Not Mounted' | 'Removed';
  kmRun: number;
  kmLimit: number;
  treadDepth: number;
  notes: string;
  datePurchased?: string;
  lastInspection?: string;
}

interface AddNewTireFormProps {
  onSubmit?: (data: TyreData) => void;
  onCancel?: () => void;
  initialData?: Partial<TyreData>;
}

const AddNewTireForm: React.FC<AddNewTireFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const [formData, setFormData] = useState<TyreData>({
    tyreNumber: initialData?.tyreNumber || '',
    tyreSize: initialData?.tyreSize || '',
    type: initialData?.type || '',
    pattern: initialData?.pattern || '',
    manufacturer: initialData?.manufacturer || '',
    year: initialData?.year || new Date().getFullYear().toString(),
    cost: initialData?.cost || 0,
    condition: initialData?.condition || 'New',
    status: initialData?.status || 'In-Stock',
    vehicleAssigned: initialData?.vehicleAssigned || '',
    axlePosition: initialData?.axlePosition || '',
    mountStatus: initialData?.mountStatus || 'Not Mounted',
    kmRun: initialData?.kmRun || 0,
    kmLimit: initialData?.kmLimit || 60000,
    treadDepth: initialData?.treadDepth || 14,
    notes: initialData?.notes || '',
    datePurchased: initialData?.datePurchased || new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TyreData, string>>>({});

  const tyreSizes = [
    '295/80R22.5',
    '315/80R22.5',
    '295/75R22.5',
    '11R22.5',
    '12R22.5',
    '385/65R22.5',
    '275/70R22.5'
  ];

  const tyreTypes = [
    'Drive',
    'Steer',
    'Trailer',
    'All-Position'
  ];

  const manufacturers = [
    'Michelin',
    'Goodyear',
    'Bridgestone',
    'Continental',
    'Pirelli',
    'Dunlop',
    'Kumho',
    'Yokohama',
    'Hankook',
    'Firestone'
  ];

  const axlePositions = [
    'Front Left',
    'Front Right',
    'Drive Axle Left Inner',
    'Drive Axle Left Outer',
    'Drive Axle Right Inner',
    'Drive Axle Right Outer',
    'Trailer Axle 1 Left',
    'Trailer Axle 1 Right',
    'Trailer Axle 2 Left',
    'Trailer Axle 2 Right',
    'Spare'
  ];

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;

    // Convert number inputs to numbers
    if (type === 'number') {
      parsedValue = value === '' ? '' : Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));

    // Clear validation error when field is edited
    if (errors[name as keyof TyreData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TyreData, string>> = {};

    if (!formData.tyreNumber) newErrors.tyreNumber = 'Tyre number is required';
    if (!formData.tyreSize) newErrors.tyreSize = 'Tyre size is required';
    if (!formData.manufacturer) newErrors.manufacturer = 'Manufacturer is required';

    // If mounted, vehicle and axle position are required
    if (formData.mountStatus === 'Mounted') {
      if (!formData.vehicleAssigned) newErrors.vehicleAssigned = 'Vehicle is required for mounted tyres';
      if (!formData.axlePosition) newErrors.axlePosition = 'Axle position is required for mounted tyres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (onSubmit) {
        onSubmit(formData);
      }
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            {initialData?.id ? 'Edit Tyre' : 'Add New Tyre'}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="lg:col-span-3">
              <h3 className="font-medium text-gray-700 mb-3">Tyre Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tyreNumber">
                    Tyre Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="tyreNumber"
                    name="tyreNumber"
                    className={`w-full px-3 py-2 border ${errors.tyreNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    value={formData.tyreNumber}
                    onChange={handleInputChange}
                  />
                  {errors.tyreNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.tyreNumber}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tyreSize">
                    Tyre Size <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="tyreSize"
                    name="tyreSize"
                    className={`w-full px-3 py-2 border ${errors.tyreSize ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    value={formData.tyreSize}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Size</option>
                    {tyreSizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  {errors.tyreSize && (
                    <p className="mt-1 text-sm text-red-600">{errors.tyreSize}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="type">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Type</option>
                    {tyreTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pattern">
                    Pattern
                  </label>
                  <input
                    type="text"
                    id="pattern"
                    name="pattern"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. X MultiWay 3D XZE"
                    value={formData.pattern}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            {/* Manufacturer Details */}
            <div className="lg:col-span-3">
              <h3 className="font-medium text-gray-700 mb-3">Manufacturer & Purchase Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="manufacturer">
                    Manufacturer <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="manufacturer"
                    name="manufacturer"
                    className={`w-full px-3 py-2 border ${errors.manufacturer ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Manufacturer</option>
                    {manufacturers.map(mfg => (
                      <option key={mfg} value={mfg}>{mfg}</option>
                    ))}
                  </select>
                  {errors.manufacturer && (
                    <p className="mt-1 text-sm text-red-600">{errors.manufacturer}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="year">
                    Year
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <select
                      id="year"
                      name="year"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={formData.year}
                      onChange={handleInputChange}
                    >
                      {[...Array(5)].map((_, i) => {
                        const year = new Date().getFullYear() - i;
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cost">
                    Cost
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">R</span>
                    <input
                      type="number"
                      id="cost"
                      name="cost"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                      value={formData.cost}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="datePurchased">
                    Date Purchased
                  </label>
                  <input
                    type="date"
                    id="datePurchased"
                    name="datePurchased"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData.datePurchased}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            {/* Status Information */}
            <div className="lg:col-span-3">
              <h3 className="font-medium text-gray-700 mb-3">Status & Condition</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="condition">
                    Condition
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData.condition}
                    onChange={handleInputChange}
                  >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Retreaded">Retreaded</option>
                    <option value="Scrap">Scrap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                    Tyre Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="In-Service">In-Service</option>
                    <option value="In-Stock">In-Stock</option>
                    <option value="Repair">Repair</option>
                    <option value="Scrap">Scrap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="mountStatus">
                    Mount Status
                  </label>
                  <select
                    id="mountStatus"
                    name="mountStatus"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData.mountStatus}
                    onChange={handleInputChange}
                  >
                    <option value="Not Mounted">Not Mounted</option>
                    <option value="Mounted">Mounted</option>
                    <option value="Removed">Removed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="treadDepth">
                    Tread Depth (mm)
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="number"
                      id="treadDepth"
                      name="treadDepth"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      step="0.1"
                      min="0"
                      max="20"
                      value={formData.treadDepth}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Vehicle Assignment */}
            <div className="lg:col-span-3">
              <h3 className="font-medium text-gray-700 mb-3">Vehicle Assignment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="vehicleAssigned">
                    Vehicle Assigned {formData.mountStatus === 'Mounted' && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <select
                      id="vehicleAssigned"
                      name="vehicleAssigned"
                      className={`w-full pl-10 pr-3 py-2 border ${errors.vehicleAssigned ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                      value={formData.vehicleAssigned}
                      onChange={handleInputChange}
                      disabled={formData.mountStatus !== 'Mounted'}
                    >
                      <option value="">Select Vehicle</option>
                      <option value="MAT001">MAT001 - Volvo FH16</option>
                      <option value="MAT002">MAT002 - Mercedes Actros</option>
                      <option value="MAT003">MAT003 - Scania R450</option>
                      <option value="MAT004">MAT004 - MAN TGX</option>
                      <option value="MAT005">MAT005 - DAF XF</option>
                    </select>
                  </div>
                  {errors.vehicleAssigned && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleAssigned}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="axlePosition">
                    Axle Position {formData.mountStatus === 'Mounted' && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    id="axlePosition"
                    name="axlePosition"
                    className={`w-full px-3 py-2 border ${errors.axlePosition ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    value={formData.axlePosition}
                    onChange={handleInputChange}
                    disabled={formData.mountStatus !== 'Mounted'}
                  >
                    <option value="">Select Position</option>
                    {axlePositions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                  {errors.axlePosition && (
                    <p className="mt-1 text-sm text-red-600">{errors.axlePosition}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="kmRun">
                    KM Run
                  </label>
                  <input
                    type="number"
                    id="kmRun"
                    name="kmRun"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                    value={formData.kmRun}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="kmLimit">
                    KM Limit
                  </label>
                  <input
                    type="number"
                    id="kmLimit"
                    name="kmLimit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                    value={formData.kmLimit}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            {/* Notes */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Additional notes or observations about this tyre..."
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
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
              {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Tyre' : 'Add Tyre'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddNewTireForm;
