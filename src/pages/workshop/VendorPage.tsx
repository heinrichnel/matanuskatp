import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkshop, Vendor } from '../../context/WorkshopContext';
import { Card, CardContent } from '../../components/ui';

const VendorPage: React.FC = () => {
  const { vendors, addVendor, updateVendor, deleteVendor, isLoading, errors } = useWorkshop();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [formData, setFormData] = useState<Omit<Vendor, 'id'>>({
    vendorId: '',
    vendorName: '',
    contactPerson: '',
    workEmail: '',
    mobile: '',
    address: '',
    city: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const resetForm = () => {
    setFormData({
      vendorId: '',
      vendorName: '',
      contactPerson: '',
      workEmail: '',
      mobile: '',
      address: '',
      city: '',
    });
    setEditingVendor(null);
  };
  
  useEffect(() => {
    if (editingVendor) {
      setFormData({
        vendorId: editingVendor.vendorId,
        vendorName: editingVendor.vendorName,
        contactPerson: editingVendor.contactPerson,
        workEmail: editingVendor.workEmail,
        mobile: editingVendor.mobile,
        address: editingVendor.address,
        city: editingVendor.city,
      });
    }
  }, [editingVendor]);
  
  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setMode('edit');
  };
  
  const handleDeleteVendor = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await deleteVendor(id);
        alert('Vendor deleted successfully');
      } catch (error) {
        alert(`Failed to delete vendor: ${error}`);
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'edit' && editingVendor) {
        await updateVendor(editingVendor.id, formData);
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          setMode('list');
          resetForm();
        }, 2000);
      } else {
        await addVendor(formData);
        setFormSubmitted(true);
        setTimeout(() => {
          setFormSubmitted(false);
          setMode('list');
          resetForm();
        }, 2000);
      }
    } catch (error) {
      alert(`Failed to ${mode === 'edit' ? 'update' : 'create'} vendor: ${error}`);
    }
  };
  
  const filteredVendors = vendors.filter(
    vendor => 
      vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.vendorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      {mode === 'list' ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Vendor Management</h1>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => { resetForm(); setMode('create'); }}
            >
              Add New Vendor
            </button>
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search vendors..."
              className="px-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {isLoading.vendors ? (
            <div className="text-center py-4">Loading vendors...</div>
          ) : errors.vendors ? (
            <div className="text-center text-red-500 py-4">
              Error loading vendors: {errors.vendors.message}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Vendor ID</th>
                    <th className="px-4 py-2 border-b">Vendor Name</th>
                    <th className="px-4 py-2 border-b">Contact Person</th>
                    <th className="px-4 py-2 border-b">Email</th>
                    <th className="px-4 py-2 border-b">Mobile</th>
                    <th className="px-4 py-2 border-b">City</th>
                    <th className="px-4 py-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-2 text-center text-gray-500">
                        No vendors found
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((vendor) => (
                      <tr key={vendor.id}>
                        <td className="px-4 py-2 border-b">{vendor.vendorId}</td>
                        <td className="px-4 py-2 border-b">{vendor.vendorName}</td>
                        <td className="px-4 py-2 border-b">{vendor.contactPerson}</td>
                        <td className="px-4 py-2 border-b">{vendor.workEmail}</td>
                        <td className="px-4 py-2 border-b">{vendor.mobile}</td>
                        <td className="px-4 py-2 border-b">{vendor.city}</td>
                        <td className="px-4 py-2 border-b">
                          <div className="flex space-x-2">
                            <button 
                              className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                              onClick={() => handleEditVendor(vendor)}
                            >
                              Edit
                            </button>
                            <button 
                              className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                              onClick={() => handleDeleteVendor(vendor.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <button 
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setMode('list')}
                >
                  Back to Vendors
                </button>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {mode === 'edit' ? 'Edit Vendor' : 'Create Vendor'}
                </h1>
              </div>
              
              {formSubmitted && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Vendor {mode === 'edit' ? 'updated' : 'created'} successfully!
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="vendorId" className="block text-sm font-medium text-gray-700">Vendor ID</label>
                  <input
                    type="text"
                    id="vendorId"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.vendorId}
                    onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">Vendor Name</label>
                  <input
                    type="text"
                    id="vendorName"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.vendorName}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">Contact Person</label>
                  <input
                    type="text"
                    id="contactPerson"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="workEmail" className="block text-sm font-medium text-gray-700">Work Email</label>
                  <input
                    type="email"
                    id="workEmail"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
                  <input
                    type="tel"
                    id="mobile"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    id="city"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  id="address"
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {mode === 'edit' ? 'Update Vendor' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendorPage;
