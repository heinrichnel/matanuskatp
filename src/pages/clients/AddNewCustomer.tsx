import React from 'react';

/**
 * Component for adding a new customer
 */
const AddNewCustomer: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Add New Customer</h1>
        <div className="flex space-x-2">
          <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">
            Import from CSV
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Save Customer
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium mb-2">Company Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name*
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter company name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select className="w-full border border-gray-300 rounded-md p-2">
                  <option value="">Select Industry</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
                  <option value="Distribution">Distribution</option>
                  <option value="Construction">Construction</option>
                  <option value="Agriculture">Agriculture</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <select className="w-full border border-gray-300 rounded-md p-2">
                  <option value="">Select Company Size</option>
                  <option value="Small">Small (1-50 employees)</option>
                  <option value="Medium">Medium (51-250 employees)</option>
                  <option value="Large">Large (251-1000 employees)</option>
                  <option value="Enterprise">Enterprise (1000+ employees)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Registration Number
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Registration/VAT number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax ID
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Tax ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input 
                  type="url" 
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium mb-2">Contact Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name*
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="e.g. Procurement Manager"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="email@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number*
                </label>
                <input 
                  type="tel" 
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input 
                  type="tel" 
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="+1 (555) 987-6543"
                />
              </div>
              
              <div className="flex items-center mt-2">
                <input 
                  type="checkbox" 
                  id="primary-contact" 
                  className="mr-2"
                />
                <label htmlFor="primary-contact" className="text-sm text-gray-700">
                  Set as primary contact
                </label>
              </div>
              
              <div className="flex justify-end mt-2">
                <button type="button" className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200">
                  + Add Another Contact
                </button>
              </div>
            </div>
          </div>
          
          {/* Address Information */}
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">Address Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Billing Address</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address*
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Street address"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City*
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="State/Province"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code*
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="Postal code"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country*
                    </label>
                    <select className="w-full border border-gray-300 rounded-md p-2" required>
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      {/* More countries would be added here */}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Shipping Address</h3>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="same-as-billing" 
                      className="mr-2"
                    />
                    <label htmlFor="same-as-billing" className="text-sm text-gray-700">
                      Same as billing address
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Street address"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="State/Province"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md p-2"
                      placeholder="Postal code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <select className="w-full border border-gray-300 rounded-md p-2">
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      {/* More countries would be added here */}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Business Details */}
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">Business Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Type
                </label>
                <select className="w-full border border-gray-300 rounded-md p-2">
                  <option value="Regular">Regular</option>
                  <option value="VIP">VIP</option>
                  <option value="Contract">Contract</option>
                  <option value="One-time">One-time</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms
                </label>
                <select className="w-full border border-gray-300 rounded-md p-2">
                  <option value="Net30">Net 30</option>
                  <option value="Net15">Net 15</option>
                  <option value="Net60">Net 60</option>
                  <option value="Immediate">Due on Receipt</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Limit
                </label>
                <div className="flex items-center">
                  <span className="mr-1">$</span>
                  <input 
                    type="number" 
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Credit limit amount"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral Source
                </label>
                <select className="w-full border border-gray-300 rounded-md p-2">
                  <option value="">How did they find us?</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Trade Show">Trade Show</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes / Comments
              </label>
              <textarea 
                className="w-full border border-gray-300 rounded-md p-2"
                rows={4}
                placeholder="Add any additional information about this customer..."
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button 
              type="button" 
              className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCustomer;
