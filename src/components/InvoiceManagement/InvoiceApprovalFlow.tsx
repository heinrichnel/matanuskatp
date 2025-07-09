import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../ui/Button';
import SyncIndicator from '../ui/SyncIndicator';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Filter, 
  Search, 
  Download, 
  ChevronRight, 
  ChevronDown,
  Eye,
  MessageCircle,
  AlertCircle,
  UserCheck,
  FileText,
  Calendar
} from 'lucide-react';

interface ApprovalStep {
  id: number;
  name: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  dueDate?: string;
  completedDate?: string;
  comments?: string;
}

interface InvoiceApproval {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  submissionDate: string;
  dueDate: string;
  status: 'in_review' | 'approved' | 'rejected' | 'pending';
  approvalFlow: ApprovalStep[];
  currentStep: number;
  priority: 'high' | 'medium' | 'low';
  description: string;
}

const InvoiceApprovalFlow: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('pending');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceApproval | null>(null);
  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [approvalComment, setApprovalComment] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  
  // Sample invoice approval data
  const [invoices, setInvoices] = useState<InvoiceApproval[]>([
    {
      id: 'AP001',
      invoiceNumber: 'INV-12345',
      client: 'Global Shipping Inc.',
      amount: 12500.00,
      submissionDate: '2023-06-15',
      dueDate: '2023-07-15',
      status: 'in_review',
      currentStep: 1,
      priority: 'high',
      description: 'Monthly shipping services for June 2023',
      approvalFlow: [
        { id: 1, name: 'John Doe', role: 'Department Manager', status: 'pending' },
        { id: 2, name: 'Jane Smith', role: 'Finance Manager', status: 'pending' },
        { id: 3, name: 'Robert Johnson', role: 'CFO', status: 'pending' }
      ]
    },
    {
      id: 'AP002',
      invoiceNumber: 'INV-12346',
      client: 'FastTrack Logistics',
      amount: 8750.00,
      submissionDate: '2023-06-10',
      dueDate: '2023-07-10',
      status: 'in_review',
      currentStep: 2,
      priority: 'medium',
      description: 'Transport services for equipment delivery',
      approvalFlow: [
        { id: 1, name: 'John Doe', role: 'Department Manager', status: 'approved', completedDate: '2023-06-12', comments: 'Services verified, approved for payment.' },
        { id: 2, name: 'Jane Smith', role: 'Finance Manager', status: 'pending' },
        { id: 3, name: 'Robert Johnson', role: 'CFO', status: 'pending' }
      ]
    },
    {
      id: 'AP003',
      invoiceNumber: 'INV-12347',
      client: 'Premium Freight Services',
      amount: 15250.00,
      submissionDate: '2023-06-05',
      dueDate: '2023-07-05',
      status: 'approved',
      currentStep: 3,
      priority: 'low',
      description: 'Quarterly maintenance contract payment',
      approvalFlow: [
        { id: 1, name: 'John Doe', role: 'Department Manager', status: 'approved', completedDate: '2023-06-07', comments: 'Quarterly maintenance is as per contract.' },
        { id: 2, name: 'Jane Smith', role: 'Finance Manager', status: 'approved', completedDate: '2023-06-09', comments: 'Financials verified, within budget.' },
        { id: 3, name: 'Robert Johnson', role: 'CFO', status: 'approved', completedDate: '2023-06-12', comments: 'Approved for payment.' }
      ]
    },
    {
      id: 'AP004',
      invoiceNumber: 'INV-12348',
      client: 'TransWorld Freight',
      amount: 9800.00,
      submissionDate: '2023-06-08',
      dueDate: '2023-07-08',
      status: 'rejected',
      currentStep: 1,
      priority: 'medium',
      description: 'International shipping services',
      approvalFlow: [
        { id: 1, name: 'John Doe', role: 'Department Manager', status: 'rejected', completedDate: '2023-06-10', comments: 'Price discrepancy with contract rates. Please review and resubmit with corrected amounts.' },
        { id: 2, name: 'Jane Smith', role: 'Finance Manager', status: 'pending' },
        { id: 3, name: 'Robert Johnson', role: 'CFO', status: 'pending' }
      ]
    },
    {
      id: 'AP005',
      invoiceNumber: 'INV-12349',
      client: 'Local Movers LLC',
      amount: 5400.00,
      submissionDate: '2023-06-12',
      dueDate: '2023-07-12',
      status: 'in_review',
      currentStep: 1,
      priority: 'low',
      description: 'Local delivery services for June',
      approvalFlow: [
        { id: 1, name: 'John Doe', role: 'Department Manager', status: 'pending' },
        { id: 2, name: 'Jane Smith', role: 'Finance Manager', status: 'pending' },
        { id: 3, name: 'Robert Johnson', role: 'CFO', status: 'pending' }
      ]
    }
  ]);
  
  // Filter invoices based on active filter and search term
  const filteredInvoices = invoices.filter(invoice => {
    // Filter by status
    const statusMatch = activeFilter === 'all' || 
                       (activeFilter === 'pending' && invoice.status === 'in_review') ||
                       (activeFilter === 'approved' && invoice.status === 'approved') ||
                       (activeFilter === 'rejected' && invoice.status === 'rejected');
    
    // Filter by search term (invoice number, client, or amount)
    const searchMatch = !searchTerm || 
                        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        invoice.amount.toString().includes(searchTerm);
    
    return statusMatch && searchMatch;
  });
  
  // Toggle expand/collapse for an invoice
  const toggleExpand = (invoiceId: string) => {
    setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
  };
  
  // View detailed invoice
  const viewInvoice = (invoice: InvoiceApproval) => {
    setSelectedInvoice(invoice);
  };
  
  // Approve an invoice step
  const approveInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;
    
    setSelectedInvoice(invoice);
    setShowApproveModal(true);
  };
  
  // Reject an invoice step
  const rejectInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;
    
    setSelectedInvoice(invoice);
    setShowRejectModal(true);
  };
  
  // Submit approval
  const submitApproval = () => {
    if (!selectedInvoice) return;
    
    // Update the current approval step
    const updatedInvoices = invoices.map(invoice => {
      if (invoice.id === selectedInvoice.id) {
        const updatedApprovalFlow = invoice.approvalFlow.map((step, index) => {
          if (index === invoice.currentStep - 1) {
            return {
              ...step,
              status: 'approved',
              completedDate: new Date().toISOString().split('T')[0],
              comments: approvalComment || 'Approved.'
            };
          }
          return step;
        });
        
        // Check if this was the last step
        const isLastStep = invoice.currentStep === invoice.approvalFlow.length;
        
        return {
          ...invoice,
          approvalFlow: updatedApprovalFlow,
          currentStep: isLastStep ? invoice.currentStep : invoice.currentStep + 1,
          status: isLastStep ? 'approved' : 'in_review'
        };
      }
      return invoice;
    });
    
    setInvoices(updatedInvoices);
    setShowApproveModal(false);
    setApprovalComment('');
    setSelectedInvoice(null);
  };
  
  // Submit rejection
  const submitRejection = () => {
    if (!selectedInvoice) return;
    
    // Update the invoice to rejected status
    const updatedInvoices = invoices.map(invoice => {
      if (invoice.id === selectedInvoice.id) {
        const updatedApprovalFlow = invoice.approvalFlow.map((step, index) => {
          if (index === invoice.currentStep - 1) {
            return {
              ...step,
              status: 'rejected',
              completedDate: new Date().toISOString().split('T')[0],
              comments: rejectionReason
            };
          }
          return step;
        });
        
        return {
          ...invoice,
          approvalFlow: updatedApprovalFlow,
          status: 'rejected'
        };
      }
      return invoice;
    });
    
    setInvoices(updatedInvoices);
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedInvoice(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Invoice Approval Flow</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4" />}
          >
            Export Report
          </Button>
          <SyncIndicator />
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-md ${
              activeFilter === 'all' ? 'bg-blue-100 text-blue-800 font-medium' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-4 py-2 rounded-md ${
              activeFilter === 'pending' ? 'bg-yellow-100 text-yellow-800 font-medium' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-4 py-2 rounded-md ${
              activeFilter === 'approved' ? 'bg-green-100 text-green-800 font-medium' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-4 py-2 rounded-md ${
              activeFilter === 'rejected' ? 'bg-red-100 text-red-800 font-medium' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Rejected
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search invoices..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Approval List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submission Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Step
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <React.Fragment key={invoice.id}>
                      <tr className={expandedInvoice === invoice.id ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{invoice.client}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${invoice.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{invoice.submissionDate}</div>
                          <div className="text-xs text-gray-500">Due: {invoice.dueDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            invoice.status === 'approved' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {invoice.status === 'in_review' ? 'In Review' : 
                             invoice.status === 'approved' ? 'Approved' : 
                             invoice.status === 'rejected' ? 'Rejected' : 'Pending'}
                          </span>
                          {invoice.priority === 'high' && (
                            <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              High Priority
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            Step {invoice.currentStep} of {invoice.approvalFlow.length}
                          </div>
                          <div className="text-xs text-gray-500">
                            {invoice.approvalFlow[invoice.currentStep - 1]?.role}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="xs"
                              variant="outline"
                              icon={<Eye className="w-3 h-3" />}
                              onClick={() => viewInvoice(invoice)}
                            >
                              View
                            </Button>
                            
                            {invoice.status === 'in_review' && (
                              <>
                                <Button
                                  size="xs"
                                  variant="primary"
                                  icon={<CheckCircle className="w-3 h-3" />}
                                  onClick={() => approveInvoice(invoice.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="xs"
                                  variant="danger"
                                  icon={<XCircle className="w-3 h-3" />}
                                  onClick={() => rejectInvoice(invoice.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            
                            <button
                              onClick={() => toggleExpand(invoice.id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {expandedInvoice === invoice.id ? (
                                <ChevronDown className="w-5 h-5" />
                              ) : (
                                <ChevronRight className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {expandedInvoice === invoice.id && (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 bg-gray-50">
                            <div className="rounded-md border border-gray-200 overflow-hidden">
                              <div className="px-4 py-3 bg-gray-100 border-b">
                                <h3 className="text-sm font-medium text-gray-700">Approval Flow</h3>
                              </div>
                              <div className="p-4">
                                <div className="relative">
                                  {invoice.approvalFlow.map((step, index) => (
                                    <div key={step.id} className="flex items-start mb-6 relative">
                                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                        step.status === 'approved' ? 'bg-green-100 border-green-500 text-green-600' :
                                        step.status === 'rejected' ? 'bg-red-100 border-red-500 text-red-600' :
                                        index < invoice.currentStep - 1 ? 'bg-gray-100 border-gray-500 text-gray-600' :
                                        index === invoice.currentStep - 1 ? 'bg-blue-100 border-blue-500 text-blue-600' :
                                        'bg-white border-gray-300 text-gray-400'
                                      }`}>
                                        {step.status === 'approved' ? (
                                          <CheckCircle className="w-5 h-5" />
                                        ) : step.status === 'rejected' ? (
                                          <XCircle className="w-5 h-5" />
                                        ) : index === invoice.currentStep - 1 ? (
                                          <Clock className="w-5 h-5" />
                                        ) : (
                                          <span className="text-xs font-medium">{index + 1}</span>
                                        )}
                                      </div>
                                      
                                      {/* Connect steps with a line */}
                                      {index < invoice.approvalFlow.length - 1 && (
                                        <div className="absolute top-8 left-4 w-0.5 h-10 bg-gray-200"></div>
                                      )}
                                      
                                      <div className="ml-4">
                                        <div className="flex items-baseline">
                                          <h4 className="text-sm font-medium text-gray-900">{step.name}</h4>
                                          <span className="ml-2 text-xs text-gray-500">{step.role}</span>
                                        </div>
                                        
                                        <div className="mt-1 flex items-center space-x-2">
                                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                                            step.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                          }`}>
                                            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                                          </span>
                                          
                                          {step.completedDate && (
                                            <span className="text-xs text-gray-500">
                                              {step.completedDate}
                                            </span>
                                          )}
                                        </div>
                                        
                                        {step.comments && (
                                          <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                                            {step.comments}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="mt-4 text-sm text-gray-600">
                                  <strong>Description:</strong> {invoice.description}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      No invoices found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Approval Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-100 text-yellow-600">
                <Clock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Pending Approval</h3>
                <p className="text-2xl font-bold text-gray-700">{invoices.filter(i => i.status === 'in_review').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Approved This Month</h3>
                <p className="text-2xl font-bold text-gray-700">{invoices.filter(i => i.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Needs Your Approval</h3>
                <p className="text-2xl font-bold text-gray-700">
                  {invoices.filter(i => i.status === 'in_review' && i.currentStep === 2).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Approve Modal */}
      {showApproveModal && selectedInvoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Approve Invoice</h3>
              <button
                onClick={() => setShowApproveModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                <strong>Invoice #:</strong> {selectedInvoice.invoiceNumber}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Client:</strong> {selectedInvoice.client}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Amount:</strong> ${selectedInvoice.amount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <strong>Current Approval Step:</strong> {selectedInvoice.approvalFlow[selectedInvoice.currentStep - 1]?.name} ({selectedInvoice.approvalFlow[selectedInvoice.currentStep - 1]?.role})
              </div>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
                placeholder="Add any comments or notes about this approval..."
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowApproveModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={<CheckCircle className="w-4 h-4" />}
                onClick={submitApproval}
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Reject Modal */}
      {showRejectModal && selectedInvoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Reject Invoice</h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">
                <strong>Invoice #:</strong> {selectedInvoice.invoiceNumber}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Client:</strong> {selectedInvoice.client}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                <strong>Amount:</strong> ${selectedInvoice.amount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <strong>Current Approval Step:</strong> {selectedInvoice.approvalFlow[selectedInvoice.currentStep - 1]?.name} ({selectedInvoice.approvalFlow[selectedInvoice.currentStep - 1]?.role})
              </div>
              
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
                placeholder="Please explain why this invoice is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
              ></textarea>
              {!rejectionReason && (
                <p className="text-red-500 text-sm mt-1">Rejection reason is required.</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                icon={<XCircle className="w-4 h-4" />}
                onClick={submitRejection}
                disabled={!rejectionReason}
              >
                Reject Invoice
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceApprovalFlow;
