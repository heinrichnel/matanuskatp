import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import SyncIndicator from '../../components/ui/SyncIndicator';
import {
  Save,
  Plus,
  Trash2,
  Download,
  Send,
  Eye,
  DollarSign,
  Calendar,
  FileText,
  User,
  FileCheck,
  ClipboardList
} from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  total: number;
}

interface InvoiceData {
  invoiceNumber: string;
  customer: string;
  customerId: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  discountAmount: number;
  total: number;
  notes: string;
  terms: string;
  status: 'draft' | 'pending' | 'sent' | 'paid' | 'overdue';
}

const InvoiceBuilder: React.FC = () => {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: 'INV-' + Math.floor(10000 + Math.random() * 90000),
    customer: '',
    customerId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [
      {
        id: '1',
        description: '',
        quantity: 1,
        unitPrice: 0,
        tax: 0,
        total: 0
      }
    ],
    subtotal: 0,
    taxTotal: 0,
    discountAmount: 0,
    total: 0,
    notes: '',
    terms: 'Payment due within 30 days. Late payments subject to a 1.5% monthly fee.',
    status: 'draft'
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState([
    { id: 'C001', name: 'Global Shipping Inc.' },
    { id: 'C002', name: 'FastTrack Logistics' },
    { id: 'C003', name: 'Premium Freight Services' },
    { id: 'C004', name: 'TransWorld Freight' }
  ]);

  const [templates, setTemplates] = useState([
    { id: 'T001', name: 'Standard Invoice' },
    { id: 'T002', name: 'Detailed Shipping Invoice' },
    { id: 'T003', name: 'Transport Services Invoice' },
    { id: 'T004', name: 'Premium Template' }
  ]);

  // Calculate totals for invoice
  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxTotal = items.reduce((sum, item) => sum + item.tax, 0);
    return {
      subtotal,
      taxTotal,
      total: subtotal + taxTotal - invoice.discountAmount
    };
  };

  // Handle item changes
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = invoice.items.map(item => {
      if (item.id !== id) return item;

      const updatedItem = { ...item, [field]: value };

      // Recalculate total for this item
      if (field === 'quantity' || field === 'unitPrice' || field === 'tax') {
        updatedItem.total = updatedItem.quantity * updatedItem.unitPrice + updatedItem.tax;
      }

      return updatedItem;
    });

    const { subtotal, taxTotal, total } = calculateTotals(updatedItems);

    setInvoice({
      ...invoice,
      items: updatedItems,
      subtotal,
      taxTotal,
      total
    });
  };

  // Add a new item
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substring(7),
      description: '',
      quantity: 1,
      unitPrice: 0,
      tax: 0,
      total: 0
    };

    const updatedItems = [...invoice.items, newItem];
    setInvoice({
      ...invoice,
      items: updatedItems
    });
  };

  // Remove an item
  const removeItem = (id: string) => {
    const updatedItems = invoice.items.filter(item => item.id !== id);
    const { subtotal, taxTotal, total } = calculateTotals(updatedItems);

    setInvoice({
      ...invoice,
      items: updatedItems,
      subtotal,
      taxTotal,
      total
    });
  };

  // Handle discount changes
  const handleDiscountChange = (value: number) => {
    setInvoice({
      ...invoice,
      discountAmount: value,
      total: invoice.subtotal + invoice.taxTotal - value
    });
  };

  // Handle field changes
  const handleFieldChange = (field: keyof InvoiceData, value: any) => {
    setInvoice({
      ...invoice,
      [field]: value
    });
  };

  // Handle customer selection
  const handleCustomerSelect = (customerId: string) => {
    const selectedCustomer = customers.find(c => c.id === customerId);
    setInvoice({
      ...invoice,
      customer: selectedCustomer ? selectedCustomer.name : '',
      customerId
    });
  };

  // Load template
  const loadTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    // In a real app, this would load template data
    // For now, we'll just change some defaults
    if (templateId === 'T002') {
      setInvoice({
        ...invoice,
        terms: 'Payment due within 14 days. Shipping details must be included with each line item.',
        notes: 'Thank you for choosing our shipping services.'
      });
    } else if (templateId === 'T003') {
      setInvoice({
        ...invoice,
        terms: 'Net 30 terms for all transport services. Fuel surcharges may apply.',
        notes: 'All transport services are subject to our standard terms and conditions.'
      });
    }
  };

  // Save invoice
  const saveInvoice = (asDraft: boolean = true) => {
    setIsLoading(true);

    // In a real app, this would save to your backend
    setTimeout(() => {
      setIsLoading(false);
      setInvoice({
        ...invoice,
        status: asDraft ? 'draft' : 'pending'
      });
      alert(asDraft ? 'Invoice saved as draft' : 'Invoice created and ready to send');
    }, 800);
  };

  // Handle button click events
  const handleButtonClick = (action: string, data?: any) => {
    switch (action) {
      case 'toggleTab':
        setActiveTab(data as 'edit' | 'preview');
        break;
      case 'addItem':
        addItem();
        break;
      case 'removeItem':
        removeItem(data);
        break;
      case 'createInvoice':
        saveInvoice(false);
        break;
      case 'backToEdit':
        setActiveTab('edit');
        break;
      case 'loadTemplate':
        loadTemplate(data);
        break;
      default:
        console.log('Action not implemented:', action);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Invoice Builder</h2>
          <p className="text-gray-600">Create and customize invoices for your clients</p>
        </div>

        <div className="flex space-x-2">
          <div className="flex border rounded-md overflow-hidden">
            <button
              className={`px-4 py-2 ${activeTab === 'edit' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              onClick={() => handleButtonClick('toggleTab', 'edit')}
            >
              Edit
            </button>
            <button
              className={`px-4 py-2 ${activeTab === 'preview' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              onClick={() => handleButtonClick('toggleTab', 'preview')}
            >
              Preview
            </button>
          </div>

          <SyncIndicator />
        </div>
      </div>

      {activeTab === 'edit' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Invoice Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      value={invoice.invoiceNumber}
                      onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer
                    </label>
                    <select
                      value={invoice.customerId}
                      onChange={(e) => handleCustomerSelect(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select a customer</option>
                      {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={invoice.issueDate}
                      onChange={(e) => handleFieldChange('issueDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={invoice.dueDate}
                      onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Invoice Items</h3>
                  <Button
                    variant="outline"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => handleButtonClick('addItem')}
                  >
                    Add Item
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tax
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {invoice.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                              className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Item description"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-20 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="w-24 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.tax}
                              onChange={(e) => handleItemChange(item.id, 'tax', parseFloat(e.target.value) || 0)}
                              className="w-24 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-2 font-medium">
                            ${item.total.toFixed(2)}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleButtonClick('removeItem', item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-700">Tax</span>
                    <span className="font-medium">${invoice.taxTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-gray-700">Discount</span>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={invoice.discountAmount}
                        onChange={(e) => handleDiscountChange(parseFloat(e.target.value) || 0)}
                        className="w-24 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200">
                    <span className="text-gray-700 font-medium">Total</span>
                    <span className="text-xl font-bold">${invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      rows={3}
                      value={invoice.notes}
                      onChange={(e) => handleFieldChange('notes', e.target.value)}
                      placeholder="Add any additional notes here"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Terms and Conditions
                    </label>
                    <textarea
                      rows={3}
                      value={invoice.terms}
                      onChange={(e) => handleFieldChange('terms', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Invoice Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template
                    </label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => handleButtonClick('loadTemplate', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select a template</option>
                      {templates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      variant="default" 
                      className="w-full justify-start"
                      icon={<Save className="w-4 h-4" />}
                      onClick={() => saveInvoice(true)}
                      loading={isLoading}
                    >
                      Save Draft
                    </Button>
                    
                    <Button 
                      variant="default" 
                      className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                      icon={<FileCheck className="w-4 h-4" />}
                      onClick={() => handleButtonClick('createInvoice')}
                      loading={isLoading}
                    >
                      Create Invoice
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      icon={<Send className="w-4 h-4" />}
                      disabled={invoice.status === 'draft'}
                    >
                      Send Invoice
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      icon={<Download className="w-4 h-4" />}
                      disabled={invoice.status === 'draft'}
                    >
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Invoice Status</h3>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    invoice.status === 'draft' ? 'bg-gray-400' :
                    invoice.status === 'pending' ? 'bg-yellow-400' :
                    invoice.status === 'sent' ? 'bg-blue-400' :
                    invoice.status === 'paid' ? 'bg-green-400' : 
                    'bg-red-400'
                  }`}></div>
                  <span className="ml-2 capitalize">{invoice.status}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p className="text-gray-500">{invoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <Button 
                    variant="outline" 
                    icon={<Eye className="w-4 h-4" />}
                    onClick={() => handleButtonClick('backToEdit')}
                  >
                    Back to Edit
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">From:</h4>
                  <div className="text-gray-600">
                    <p className="font-semibold">Matanuska Transport Services</p>
                    <p>123 Main Street</p>
                    <p>Anchorage, AK 99501</p>
                    <p>United States</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Bill To:</h4>
                  <div className="text-gray-600">
                    {invoice.customer ? (
                      <>
                        <p className="font-semibold">{invoice.customer}</p>
                        <p>Customer Address Line 1</p>
                        <p>Customer Address Line 2</p>
                      </>
                    ) : (
                      <p className="italic text-gray-400">No customer selected</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="text-xs text-gray-500 uppercase mb-2">Issue Date</h4>
                  <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="text-xs text-gray-500 uppercase mb-2">Due Date</h4>
                  <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <h4 className="text-xs text-gray-500 uppercase mb-2">Total Amount</h4>
                  <p className="font-medium text-lg">${invoice.total.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Description
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Tax
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm text-gray-800">
                          {item.description || <span className="italic text-gray-400">No description</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-right">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-right">
                          ${item.tax.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 text-right font-medium">
                          ${item.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mt-6 border-t border-gray-200 pt-4 flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${invoice.taxTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium">${invoice.discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
                      <span>Total</span>
                      <span className="text-xl">${invoice.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Notes</h4>
                  <p className="text-gray-600">{invoice.notes || <span className="italic text-gray-400">No notes</span>}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Terms and Conditions</h4>
                  <p className="text-gray-600">{invoice.terms}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              icon={<Download className="w-4 h-4" />}
            >
              Download PDF
            </Button>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              icon={<Send className="w-4 h-4" />}
            >
              Send Invoice
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceBuilder;
