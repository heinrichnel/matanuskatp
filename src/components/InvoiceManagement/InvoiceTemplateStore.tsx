import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../ui/Button';
import SyncIndicator from '../ui/SyncIndicator';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Copy, 
  FileText, 
  Check,
  Eye,
  Star,
  Grid,
  List,
  Settings,
  ChevronDown
} from 'lucide-react';

interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  industry: string;
  isFavorite: boolean;
  isDefault: boolean;
  previewImage: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  fields: {
    includeCompanyLogo: boolean;
    includeSignature: boolean;
    showTaxDetails: boolean;
    currencyFormat: string;
    paymentTerms: string;
    footerText: string;
    colorTheme: string;
  }
}

const InvoiceTemplateStore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeIndustryFilter, setActiveIndustryFilter] = useState('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<InvoiceTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  // Sample template data
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([
    {
      id: 'TPL-001',
      name: 'Standard Invoice',
      description: 'A clean and professional invoice template for general use.',
      type: 'standard',
      industry: 'general',
      isFavorite: true,
      isDefault: true,
      previewImage: 'https://via.placeholder.com/300x400?text=Standard+Invoice+Template',
      createdAt: '2023-01-15',
      updatedAt: '2023-06-20',
      usageCount: 58,
      fields: {
        includeCompanyLogo: true,
        includeSignature: true,
        showTaxDetails: true,
        currencyFormat: 'USD',
        paymentTerms: 'Net 30',
        footerText: 'Thank you for your business!',
        colorTheme: 'blue'
      }
    },
    {
      id: 'TPL-002',
      name: 'Detailed Transport Invoice',
      description: 'Detailed template for transportation services with itemized shipping information.',
      type: 'detailed',
      industry: 'transport',
      isFavorite: false,
      isDefault: false,
      previewImage: 'https://via.placeholder.com/300x400?text=Transport+Invoice+Template',
      createdAt: '2023-02-10',
      updatedAt: '2023-05-15',
      usageCount: 42,
      fields: {
        includeCompanyLogo: true,
        includeSignature: true,
        showTaxDetails: true,
        currencyFormat: 'USD',
        paymentTerms: 'Net 15',
        footerText: 'All services provided according to our terms and conditions.',
        colorTheme: 'green'
      }
    },
    {
      id: 'TPL-003',
      name: 'Logistics Services',
      description: 'Template designed specifically for logistics and freight services.',
      type: 'specialized',
      industry: 'transport',
      isFavorite: true,
      isDefault: false,
      previewImage: 'https://via.placeholder.com/300x400?text=Logistics+Invoice+Template',
      createdAt: '2023-03-05',
      updatedAt: '2023-06-01',
      usageCount: 37,
      fields: {
        includeCompanyLogo: true,
        includeSignature: false,
        showTaxDetails: true,
        currencyFormat: 'USD',
        paymentTerms: 'Net 30',
        footerText: 'Thank you for choosing our logistics services!',
        colorTheme: 'blue'
      }
    },
    {
      id: 'TPL-004',
      name: 'Simple Receipt',
      description: 'A simple receipt for quick invoicing needs.',
      type: 'simple',
      industry: 'general',
      isFavorite: false,
      isDefault: false,
      previewImage: 'https://via.placeholder.com/300x400?text=Simple+Receipt+Template',
      createdAt: '2023-04-12',
      updatedAt: '2023-04-12',
      usageCount: 24,
      fields: {
        includeCompanyLogo: false,
        includeSignature: false,
        showTaxDetails: false,
        currencyFormat: 'USD',
        paymentTerms: 'Due on receipt',
        footerText: '',
        colorTheme: 'gray'
      }
    },
    {
      id: 'TPL-005',
      name: 'International Shipping',
      description: 'Template for international shipping with customs information.',
      type: 'specialized',
      industry: 'international',
      isFavorite: false,
      isDefault: false,
      previewImage: 'https://via.placeholder.com/300x400?text=International+Shipping+Template',
      createdAt: '2023-05-20',
      updatedAt: '2023-05-20',
      usageCount: 18,
      fields: {
        includeCompanyLogo: true,
        includeSignature: true,
        showTaxDetails: true,
        currencyFormat: 'Multi-currency',
        paymentTerms: 'Net 45',
        footerText: 'International shipping terms apply.',
        colorTheme: 'navy'
      }
    },
    {
      id: 'TPL-006',
      name: 'Premium Business',
      description: 'An elegant template for high-value business transactions.',
      type: 'premium',
      industry: 'corporate',
      isFavorite: true,
      isDefault: false,
      previewImage: 'https://via.placeholder.com/300x400?text=Premium+Business+Template',
      createdAt: '2023-06-05',
      updatedAt: '2023-06-05',
      usageCount: 12,
      fields: {
        includeCompanyLogo: true,
        includeSignature: true,
        showTaxDetails: true,
        currencyFormat: 'USD',
        paymentTerms: 'Net 30',
        footerText: 'Thank you for your valued partnership.',
        colorTheme: 'gold'
      }
    }
  ]);
  
  // Filter templates based on search term, industry, and type
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesIndustry = activeIndustryFilter === 'all' || template.industry === activeIndustryFilter;
    const matchesType = activeTypeFilter === 'all' || template.type === activeTypeFilter;
    
    return matchesSearch && matchesIndustry && matchesType;
  });
  
  // Toggle template favorite status
  const toggleFavorite = (templateId: string) => {
    setTemplates(templates.map(template => 
      template.id === templateId 
        ? { ...template, isFavorite: !template.isFavorite }
        : template
    ));
  };
  
  // Set a template as default
  const setDefaultTemplate = (templateId: string) => {
    setTemplates(templates.map(template => ({
      ...template,
      isDefault: template.id === templateId
    })));
  };
  
  // Delete a template
  const deleteTemplate = (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(template => template.id !== templateId));
    }
  };
  
  // Duplicate a template
  const duplicateTemplate = (templateId: string) => {
    const templateToDuplicate = templates.find(t => t.id === templateId);
    if (!templateToDuplicate) return;
    
    const newTemplate: InvoiceTemplate = {
      ...templateToDuplicate,
      id: `TPL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `Copy of ${templateToDuplicate.name}`,
      isDefault: false,
      isFavorite: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      usageCount: 0
    };
    
    setTemplates([...templates, newTemplate]);
  };
  
  // Preview a template
  const previewTemplate = (template: InvoiceTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };
  
  // Get unique industries for filtering
  const industries = ['all', ...new Set(templates.map(t => t.industry))];
  
  // Get unique template types for filtering
  const templateTypes = ['all', ...new Set(templates.map(t => t.type))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Invoice Templates</h2>
        <div className="flex space-x-2">
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={onClick || (() => {})}
          >
            Create Template
          </Button>
          <SyncIndicator />
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="relative w-full md:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search templates..."
            className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <select
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={activeIndustryFilter}
              onChange={(e) => setActiveIndustryFilter(e.target.value)}
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry.charAt(0).toUpperCase() + industry.slice(1)}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="relative w-full md:w-auto">
            <select
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={activeTypeFilter}
              onChange={(e) => setActiveTypeFilter(e.target.value)}
            >
              {templateTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)} Type
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="flex border rounded-md overflow-hidden">
            <button
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              onClick={onClick || (() => {})}
              title="Grid View"
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              onClick={onClick || (() => {})}
              title="List View"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Templates Display */}
      {viewMode === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map(template => (
              <Card key={template.id} className={`${template.isDefault ? 'border-green-500' : 'border-gray-200'}`}>
                <div className="relative">
                  <img 
                    src={template.previewImage} 
                    alt={template.name} 
                    className="w-full h-48 object-cover object-top"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button 
                      className={`p-1 rounded-full ${template.isFavorite ? 'bg-yellow-100' : 'bg-white'}`}
                      onClick={onClick || (() => {})}
                    >
                      <Star className={`h-5 w-5 ${template.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                    </button>
                    
                    {template.isDefault && (
                      <div className="p-1 rounded-full bg-green-100">
                        <Check className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.type.charAt(0).toUpperCase() + template.type.slice(1)}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      {template.industry.charAt(0).toUpperCase() + template.industry.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{template.description}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                    <span>Used {template.usageCount} times</span>
                    <span>Updated {template.updatedAt}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      icon={<Eye className="w-4 h-4" />}
                      onClick={onClick || (() => {})}
                    >
                      Preview
                    </Button>
                    
                    <div className="relative group">
                      <Button 
                        variant="outline" 
                        size="sm"
                        icon={<Settings className="w-4 h-4" />}
                      >
                        Actions
                      </Button>
                      
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                        <div className="py-1">
                          <button 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={onClick || (() => {})}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </button>
                          
                          <button 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            onClick={onClick || (() => {})}
                            disabled={template.isDefault}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Set as Default
                          </button>
                          
                          <button 
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Template
                          </button>
                          
                          <button 
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            onClick={onClick || (() => {})}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="ml-auto"
                      icon={<FileText className="w-4 h-4" />}
                    >
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-200">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No templates found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filters.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setActiveIndustryFilter('all');
                  setActiveTypeFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      ) : (
        // List View
        <Card>
          <CardContent className="p-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map(template => (
                    <tr key={template.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 object-cover rounded" 
                              src={template.previewImage} 
                              alt="" 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{template.name}</div>
                              {template.isDefault && (
                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                                  Default
                                </span>
                              )}
                              {template.isFavorite && (
                                <Star className="ml-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                              )}
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-1">{template.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                          {template.industry.charAt(0).toUpperCase() + template.industry.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{template.usageCount} times</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {template.updatedAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            size="xs" 
                            variant="outline"
                            icon={<Eye className="w-3 h-3" />}
                            onClick={onClick || (() => {})}
                          >
                            Preview
                          </Button>
                          
                          <Button 
                            size="xs" 
                            variant="primary"
                            icon={<FileText className="w-3 h-3" />}
                          >
                            Use
                          </Button>
                          
                          <div className="relative group">
                            <Button 
                              variant="outline" 
                              size="xs"
                              icon={<Settings className="w-3 h-3" />}
                            />
                            
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                              <div className="py-1">
                                <button 
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={onClick || (() => {})}
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Duplicate
                                </button>
                                
                                <button 
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={onClick || (() => {})}
                                  disabled={template.isDefault}
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Set as Default
                                </button>
                                
                                <button 
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Template
                                </button>
                                
                                <button 
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                  onClick={onClick || (() => {})}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900">No templates found</h3>
                      <p className="mt-2 text-gray-500">Try adjusting your search or filters.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm('');
                          setActiveIndustryFilter('all');
                          setActiveTypeFilter('all');
                        }}
                      >
                        Clear Filters
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
      
      {/* Template Preview Modal */}
      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Template Preview: {selectedTemplate.name}</h3>
              <button
                onClick={onClick || (() => {})}
                className="text-gray-400 hover:text-gray-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-100 p-8 rounded-md">
                {/* Invoice Template Preview - This would be more detailed in a real app */}
                <div className="bg-white p-6 rounded shadow-md">
                  <div className="flex justify-between mb-8">
                    <div>
                      <div className="h-12 w-48 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                        {selectedTemplate.fields.includeCompanyLogo ? 'Company Logo' : 'No Logo'}
                      </div>
                      <div className="mt-2">
                        <div className="font-bold">MATANUSKA TRANSPORT</div>
                        <div className="text-sm text-gray-600">123 Transport Avenue</div>
                        <div className="text-sm text-gray-600">Matanuska, AK 99645</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold mb-1">INVOICE</div>
                      <div className="text-sm text-gray-600">Invoice #: INV-12345</div>
                      <div className="text-sm text-gray-600">Date: June 25, 2023</div>
                      <div className="text-sm text-gray-600">Due Date: July 25, 2023</div>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="text-sm font-semibold text-gray-600 mb-2">Bill To:</div>
                        <div className="font-medium">Client Name</div>
                        <div className="text-sm text-gray-600">123 Client Street</div>
                        <div className="text-sm text-gray-600">Clientville, ST 12345</div>
                        <div className="text-sm text-gray-600">client@example.com</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-600 mb-2">Ship To:</div>
                        <div className="font-medium">Shipping Address</div>
                        <div className="text-sm text-gray-600">456 Shipping Avenue</div>
                        <div className="text-sm text-gray-600">Shipville, ST 67890</div>
                      </div>
                    </div>
                  </div>
                  
                  <table className="min-w-full mb-6">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {selectedTemplate.fields.showTaxDetails ? 'Tax' : ''}
                        </th>
                        <th className="py-2 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 text-sm">Transport services from A to B</td>
                        <td className="py-3 px-4 text-right text-sm">1</td>
                        <td className="py-3 px-4 text-right text-sm">$1,000.00</td>
                        <td className="py-3 px-4 text-right text-sm">{selectedTemplate.fields.showTaxDetails ? '$100.00' : ''}</td>
                        <td className="py-3 px-4 text-right text-sm font-medium">$1,100.00</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 text-sm">Logistics planning fee</td>
                        <td className="py-3 px-4 text-right text-sm">1</td>
                        <td className="py-3 px-4 text-right text-sm">$500.00</td>
                        <td className="py-3 px-4 text-right text-sm">{selectedTemplate.fields.showTaxDetails ? '$50.00' : ''}</td>
                        <td className="py-3 px-4 text-right text-sm font-medium">$550.00</td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between py-2">
                        <div className="text-gray-600">Subtotal:</div>
                        <div className="font-medium">$1,500.00</div>
                      </div>
                      {selectedTemplate.fields.showTaxDetails && (
                        <div className="flex justify-between py-2">
                          <div className="text-gray-600">Tax (10%):</div>
                          <div className="font-medium">$150.00</div>
                        </div>
                      )}
                      <div className="flex justify-between py-2 font-bold border-t mt-2">
                        <div>Total:</div>
                        <div>$1,650.00</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-sm">
                    <h4 className="font-semibold text-gray-700 mb-2">Payment Terms:</h4>
                    <p className="text-gray-600">{selectedTemplate.fields.paymentTerms}</p>
                  </div>
                  
                  {selectedTemplate.fields.footerText && (
                    <div className="mt-4 p-3 bg-gray-50 text-center text-sm text-gray-600 rounded">
                      {selectedTemplate.fields.footerText}
                    </div>
                  )}
                  
                  {selectedTemplate.fields.includeSignature && (
                    <div className="mt-8">
                      <div className="border-t border-gray-300 w-48 mb-2"></div>
                      <div className="text-sm text-gray-600">Authorized Signature</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Template Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm"><span className="font-medium">Type:</span> {selectedTemplate.type}</div>
                      <div className="text-sm"><span className="font-medium">Industry:</span> {selectedTemplate.industry}</div>
                      <div className="text-sm"><span className="font-medium">Created:</span> {selectedTemplate.createdAt}</div>
                    </div>
                    <div>
                      <div className="text-sm"><span className="font-medium">Default:</span> {selectedTemplate.isDefault ? 'Yes' : 'No'}</div>
                      <div className="text-sm"><span className="font-medium">Usage Count:</span> {selectedTemplate.usageCount}</div>
                      <div className="text-sm"><span className="font-medium">Last Updated:</span> {selectedTemplate.updatedAt}</div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={onClick || (() => {})}
                  >
                    Close
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      icon={<Edit className="w-4 h-4" />}
                    >
                      Edit Template
                    </Button>
                    <Button
                      variant="primary"
                      icon={<FileText className="w-4 h-4" />}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTemplateStore;
