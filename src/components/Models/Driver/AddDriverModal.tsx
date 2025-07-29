import React, { useState } from 'react';
import Modal from '../../ui/Modal';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (driverData: any) => void;
}

const AddDriverModal: React.FC<AddDriverModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    licenseClass: '',
    dateOfBirth: '',
    dateOfHire: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Driver" size="lg">
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">License Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">License Number*</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="licenseExpiry" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date*</label>
                <input
                  type="date"
                  id="licenseExpiry"
                  name="licenseExpiry"
                  value={formData.licenseExpiry}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="licenseClass" className="block text-sm font-medium text-gray-700 mb-1">License Class*</label>
                <select
                  id="licenseClass"
                  name="licenseClass"
                  value={formData.licenseClass}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select License Class</option>
                  <option value="A">Class A - Heavy Combination Vehicles</option>
                  <option value="B">Class B - Heavy Straight Vehicles</option>
                  <option value="C">Class C - Small Vehicles</option>
                  <option value="D">Class D - Ordinary Vehicles</option>
                  <option value="E">Class E - Commercial Driver's License</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Driver
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddDriverModal;