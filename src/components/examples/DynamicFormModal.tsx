import React, { useState } from 'react';
import FormModal from '../ui/FormModal';
import Button from '../ui/Button';
import { Input, Select, TextArea } from '../ui/FormElements';
import { Plus, Minus, AlertTriangle } from 'lucide-react';
import Card, { CardContent, CardHeader } from '../ui/Card';

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderFormData {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  paymentMethod: string;
  products: Product[];
  notes: string;
}

const DynamicFormModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerEmail: '',
    shippingAddress: '',
    paymentMethod: '',
    products: [{ id: '1', name: '', quantity: 1, price: 0 }],
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<OrderFormData | null>(null);

  const handleChange = (field: keyof OrderFormData, value: string | Product[]) => {
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

  const handleProductChange = (index: number, field: keyof Product, value: string | number) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    handleChange('products', updatedProducts);
    
    // Clear product-specific error
    const errorKey = `products.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addProduct = () => {
    const updatedProducts = [...formData.products];
    updatedProducts.push({ id: Date.now().toString(), name: '', quantity: 1, price: 0 });
    handleChange('products', updatedProducts);
  };

  const removeProduct = (index: number) => {
    if (formData.products.length <= 1) return;
    
    const updatedProducts = [...formData.products];
    updatedProducts.splice(index, 1);
    handleChange('products', updatedProducts);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    
    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = 'Shipping address is required';
    }
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }
    
    // Validate products
    formData.products.forEach((product, index) => {
      if (!product.name.trim()) {
        newErrors[`products.${index}.name`] = `Product ${index + 1} name is required`;
      }
      
      if (product.quantity <= 0) {
        newErrors[`products.${index}.quantity`] = `Product ${index + 1} quantity must be greater than 0`;
      }
      
      if (product.price <= 0) {
        newErrors[`products.${index}.price`] = `Product ${index + 1} price must be greater than 0`;
      }
    });
    
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
      
      setSubmittedOrder(formData);
      setIsModalOpen(false);
      
      // Reset form
      setFormData({
        customerName: '',
        customerEmail: '',
        shippingAddress: '',
        paymentMethod: '',
        products: [{ id: '1', name: '', quantity: 1, price: 0 }],
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate order total
  const calculateTotal = (products: Product[]): number => {
    return products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
        <Button 
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Create New Order
        </Button>
      </div>

      {submittedOrder && (
        <Card>
          <CardHeader title="Last Submitted Order" />
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
                  <div className="mt-2 space-y-2">
                    <p><strong>Name:</strong> {submittedOrder.customerName}</p>
                    <p><strong>Email:</strong> {submittedOrder.customerEmail}</p>
                    <p><strong>Shipping Address:</strong> {submittedOrder.shippingAddress}</p>
                    <p><strong>Payment Method:</strong> {submittedOrder.paymentMethod}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                  <div className="mt-2">
                    <p><strong>Total Items:</strong> {submittedOrder.products.reduce((sum, p) => sum + p.quantity, 0)}</p>
                    <p><strong>Total Amount:</strong> ${calculateTotal(submittedOrder.products).toFixed(2)}</p>
                    {submittedOrder.notes && (
                      <div className="mt-2">
                        <p><strong>Notes:</strong></p>
                        <p className="text-sm text-gray-600">{submittedOrder.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Products</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {submittedOrder.products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            {product.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            ${product.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                            ${(product.price * product.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          Total:
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                          ${calculateTotal(submittedOrder.products).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Order"
        onSubmit={handleSubmit}
        submitButtonText="Create Order"
        isSubmitting={isSubmitting}
      >
        <div className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-4">
              <Input
                label="Customer Name *"
                value={formData.customerName}
                onChange={(value) => handleChange('customerName', value)}
                placeholder="Enter customer name"
                error={errors.customerName}
              />
              
              <Input
                label="Customer Email *"
                value={formData.customerEmail}
                onChange={(value) => handleChange('customerEmail', value)}
                placeholder="customer@example.com"
                error={errors.customerEmail}
              />
              
              <TextArea
                label="Shipping Address *"
                value={formData.shippingAddress}
                onChange={(value) => handleChange('shippingAddress', value)}
                placeholder="Enter complete shipping address"
                rows={3}
                error={errors.shippingAddress}
              />
              
              <Select
                label="Payment Method *"
                value={formData.paymentMethod}
                onChange={(value) => handleChange('paymentMethod', value)}
                options={[
                  { label: 'Select payment method', value: '' },
                  { label: 'Credit Card', value: 'credit_card' },
                  { label: 'PayPal', value: 'paypal' },
                  { label: 'Bank Transfer', value: 'bank_transfer' },
                  { label: 'Cash on Delivery', value: 'cod' }
                ]}
                error={errors.paymentMethod}
              />
            </div>
          </div>
          
          {/* Products */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Products</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={addProduct}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Product
              </Button>
            </div>
            
            {formData.products.map((product, index) => (
              <div key={product.id} className="mb-4 p-4 border border-gray-200 rounded-md">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Product {index + 1}</h4>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => removeProduct(index)}
                    icon={<Minus className="w-3 h-3" />}
                    disabled={formData.products.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <Input
                    label="Product Name *"
                    value={product.name}
                    onChange={(value) => handleProductChange(index, 'name', value)}
                    placeholder="Enter product name"
                    error={errors[`products.${index}.name`]}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Quantity *"
                      type="number"
                      value={product.quantity.toString()}
                      onChange={(value) => handleProductChange(index, 'quantity', parseInt(value) || 0)}
                      min="1"
                      step="1"
                      error={errors[`products.${index}.quantity`]}
                    />
                    
                    <Input
                      label="Price ($) *"
                      type="number"
                      value={product.price.toString()}
                      onChange={(value) => handleProductChange(index, 'price', parseFloat(value) || 0)}
                      min="0.01"
                      step="0.01"
                      error={errors[`products.${index}.price`]}
                    />
                  </div>
                  
                  <div className="text-right text-sm font-medium">
                    Subtotal: ${(product.price * product.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-gray-50 rounded-md flex justify-between items-center">
              <span className="font-medium">Order Total:</span>
              <span className="text-lg font-bold">${calculateTotal(formData.products).toFixed(2)}</span>
            </div>
          </div>
          
          {/* Additional Notes */}
          <div>
            <TextArea
              label="Order Notes (Optional)"
              value={formData.notes}
              onChange={(value) => handleChange('notes', value)}
              placeholder="Add any special instructions or notes about this order..."
              rows={3}
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
                    {Object.values(errors).map((error, index) => (
                      <li key={index}>{error}</li>
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

export default DynamicFormModal;