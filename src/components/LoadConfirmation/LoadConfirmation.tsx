import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Input, Select, TextArea } from '../../components/ui/FormElements';
import { 
  Download, 
  FileText, 
  Printer, 
  AlertTriangle, 
  CheckCircle,
  Clock 
} from 'lucide-react';
import { generateLoadConfirmationPDF } from '../../utils/pdfGenerators';

interface LoadConfirmationFormData {
  // Company Info (auto-filled based on currency)
  companyEntity: 'sa' | 'zim';
  currency: 'ZAR' | 'USD';

  // Customer/Transporter Info
  customerName: string;
  contactPerson: string;
  contactDetails: string;
  confirmationDate: string;

  // Load Details
  loadRefNumber: string;
  vehicleRegNo: string;
  trailerRegNo: string;
  driverName: string;

  // Origin/Destination
  pickupAddress: string;
  deliveryAddress: string;

  // Cargo Details
  commodity: string;
  totalWeight: string;
  palletsOrUnits: string;

  // Payment Info
  rateAmount: string;
  rateUnit: string;
  totalAmount: string;
  paymentTerms: string;

  // Additional Information
  specialInstructions: string;
  pickupContact: string;
  deliveryContact: string;

  // Signatures (will be captured in PDF)
  transporterName: string;
  matanuskaRepName: string;
}

const initialFormState: LoadConfirmationFormData = {
  companyEntity: 'sa',
  currency: 'ZAR',
  customerName: '',
  contactPerson: '',
  contactDetails: '',
  confirmationDate: new Date().toISOString().split('T')[0],
  loadRefNumber: '',
  vehicleRegNo: '',
  trailerRegNo: '',
  driverName: '',
  pickupAddress: '',
  deliveryAddress: '',
  commodity: '',
  totalWeight: '',
  palletsOrUnits: '',
  rateAmount: '',
  rateUnit: 'load',
  totalAmount: '',
  paymentTerms: '7 days from POD',
  specialInstructions: '',
  pickupContact: '',
  deliveryContact: '',
  transporterName: '',
  matanuskaRepName: '',
};

const LoadConfirmationForm: React.FC = () => {
  const [formData, setFormData] = useState<LoadConfirmationFormData>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof LoadConfirmationFormData, string>>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Update company entity when currency changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      companyEntity: prev.currency === 'ZAR' ? 'sa' : 'zim'
    }));
  }, [formData.currency]);
  
  // Clean up generated PDF URL on component unmount
  useEffect(() => {
    return () => {
      if (generatedPdfUrl) {
        URL.revokeObjectURL(generatedPdfUrl);
      }
    };
  }, [generatedPdfUrl]);
  
  const handleChange = (field: keyof LoadConfirmationFormData, 
    valueOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    
    // Extract value from event if it's an event
    const value = typeof valueOrEvent === 'string' 
      ? valueOrEvent 
      : valueOrEvent.target.value;
    
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field if any
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Special case for rate calculations
    if (field === 'rateAmount' || field === 'palletsOrUnits') {
      const rate = parseFloat(field === 'rateAmount' ? value : formData.rateAmount) || 0;
      const units = parseFloat(field === 'palletsOrUnits' ? value : formData.palletsOrUnits) || 0;
      const total = (rate * units).toFixed(2);
      
      setFormData(prev => ({
        ...prev,
        [field]: value,
        totalAmount: total
      }));
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoadConfirmationFormData, string>> = {};
    
    // Required fields validation
    const requiredFields: Array<keyof LoadConfirmationFormData> = [
      'customerName',
      'confirmationDate',
      'loadRefNumber',
      'vehicleRegNo',
      'driverName',
      'pickupAddress',
      'deliveryAddress',
      'commodity',
      'rateAmount',
      'totalAmount',
      'paymentTerms'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Number validation
    const numberFields: Array<keyof LoadConfirmationFormData> = [
      'rateAmount',
      'totalAmount'
    ];
    
    numberFields.forEach(field => {
      if (formData[field] && isNaN(parseFloat(formData[field] as string))) {
        newErrors[field] = 'Must be a valid number';
      }
    });
    
    // Date validation
    if (formData.confirmationDate) {
      const date = new Date(formData.confirmationDate);
      if (isNaN(date.getTime())) {
        newErrors.confirmationDate = 'Please enter a valid date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      setIsGenerating(true);
      setGeneratedPdfUrl(null);
      
      const pdfBlob = await generateLoadConfirmationPDF(formData);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      setGeneratedPdfUrl(pdfUrl);
      setSuccessMessage('Load confirmation generated successfully!');
      
      // Clear success message after 5 seconds
      const timeout = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setErrors({ 
        specialInstructions: 'Failed to generate PDF. Please try again.' 
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadPdf = () => {
    if (!generatedPdfUrl) return;
    
    const link = document.createElement('a');
    link.href = generatedPdfUrl;
    link.download = `Load-Confirmation-${formData.loadRefNumber || 'New'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const printPdf = () => {
    if (!generatedPdfUrl) return;
    
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = generatedPdfUrl;
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };
  
  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setGeneratedPdfUrl(null);
  };

  // Rate unit options
  const rateUnitOptions = [
    { value: 'load', label: 'per load' },
    { value: 'ton', label: 'per ton' },
    { value: 'pallet', label: 'per pallet' },
    { value: 'km', label: 'per km' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Load Confirmation</h2>
          <p className="text-gray-600">Generate load confirmations for customers and transporters</p>
        </div>
        
        <div className="flex space-x-2">
          {generatedPdfUrl && (
            <>
              <Button
                variant="outline"
                onClick={downloadPdf}
                icon={<Download className="w-4 h-4" />}
              >
                Download
              </Button>
              <Button
                variant="outline"
                onClick={printPdf}
                icon={<Printer className="w-4 h-4" />}
              >
                Print
              </Button>
            </>
          )}
          <Button
            variant={generatedPdfUrl ? "outline" : "primary"}
            onClick={generatedPdfUrl ? resetForm : handleSubmit}
            icon={generatedPdfUrl ? <FileText className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            isLoading={isGenerating}
          >
            {generatedPdfUrl ? "New Confirmation" : "Generate Confirmation"}
          </Button>
        </div>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Company & Customer Information" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Select
                  label="Currency *"
                  value={formData.currency}
                  onChange={(value) => handleChange('currency', value)}
                  options={[
                    { label: 'South African Rand (ZAR)', value: 'ZAR' },
                    { label: 'US Dollar (USD)', value: 'USD' }
                  ]}
                  error={errors.currency}
                />
                
                <div className="md:col-span-1 p-4 bg-gray-50 border rounded-md">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Company Entity</h3>
                  <p className="text-sm text-gray-800">
                    {formData.currency === 'ZAR' ? (
                      <>Matanuska (Pty) Ltd<br />South Africa</>
                    ) : (
                      <>Matanuska Distribution (Pvt) Ltd<br />Zimbabwe</>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Customer/Transporter Name *"
                  value={formData.customerName}
                  onChange={(value) => handleChange('customerName', value)}
                  placeholder="Enter customer or transporter name"
                  error={errors.customerName}
                />
                
                <Input
                  label="Contact Person"
                  value={formData.contactPerson}
                  onChange={(value) => handleChange('contactPerson', value)}
                  placeholder="Name & surname of contact person"
                  error={errors.contactPerson}
                />
                
                <Input
                  label="Contact Details"
                  value={formData.contactDetails}
                  onChange={(value) => handleChange('contactDetails', value)}
                  placeholder="Phone number and/or email"
                  error={errors.contactDetails}
                />
                
                <Input
                  label="Confirmation Date *"
                  type="date"
                  value={formData.confirmationDate}
                  onChange={(value) => handleChange('confirmationDate', value)}
                  error={errors.confirmationDate}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader title="Load & Vehicle Details" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Load Reference Number *"
                  value={formData.loadRefNumber}
                  onChange={(value) => handleChange('loadRefNumber', value)}
                  placeholder="Unique load reference"
                  error={errors.loadRefNumber}
                />
                
                <Input
                  label="Vehicle / Truck Reg No *"
                  value={formData.vehicleRegNo}
                  onChange={(value) => handleChange('vehicleRegNo', value)}
                  placeholder="Registration number"
                  error={errors.vehicleRegNo}
                />
                
                <Input
                  label="Trailer Reg No (if applicable)"
                  value={formData.trailerRegNo}
                  onChange={(value) => handleChange('trailerRegNo', value)}
                  placeholder="Trailer registration number"
                  error={errors.trailerRegNo}
                />
                
                <Input
                  label="Driver Name *"
                  value={formData.driverName}
                  onChange={(value) => handleChange('driverName', value)}
                  placeholder="Driver's name & surname"
                  error={errors.driverName}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader title="Origin & Destination" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextArea
                  label="Pickup Address *"
                  value={formData.pickupAddress}
                  onChange={(value) => handleChange('pickupAddress', value)}
                  placeholder="Full pickup address"
                  rows={3}
                  error={errors.pickupAddress}
                />
                
                <TextArea
                  label="Delivery Address *"
                  value={formData.deliveryAddress}
                  onChange={(value) => handleChange('deliveryAddress', value)}
                  placeholder="Full delivery address"
                  rows={3}
                  error={errors.deliveryAddress}
                />
                
                <Input
                  label="Contact at Pickup"
                  value={formData.pickupContact}
                  onChange={(value) => handleChange('pickupContact', value)}
                  placeholder="Name, phone, email"
                  error={errors.pickupContact}
                />
                
                <Input
                  label="Contact at Delivery"
                  value={formData.deliveryContact}
                  onChange={(value) => handleChange('deliveryContact', value)}
                  placeholder="Name, phone, email"
                  error={errors.deliveryContact}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader title="Cargo & Payment Details" />
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Commodity *"
                  value={formData.commodity}
                  onChange={(value) => handleChange('commodity', value)}
                  placeholder="Type of goods/commodity"
                  error={errors.commodity}
                />
                
                <Input
                  label="Total Load Weight (kg)"
                  value={formData.totalWeight}
                  onChange={(value) => handleChange('totalWeight', value)}
                  placeholder="Weight in kg"
                  error={errors.totalWeight}
                />
                
                <Input
                  label="Number of Pallets / Units *"
                  value={formData.palletsOrUnits}
                  onChange={(value) => handleChange('palletsOrUnits', value)}
                  placeholder="Quantity"
                  error={errors.palletsOrUnits}
                />
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Input
                      label={`Rate (${formData.currency}) *`}
                      value={formData.rateAmount}
                      onChange={(value) => handleChange('rateAmount', value)}
                      placeholder="Rate amount"
                      error={errors.rateAmount}
                    />
                  </div>
                  <div className="col-span-1">
                    <Select
                      label="Unit"
                      value={formData.rateUnit}
                      onChange={(value) => handleChange('rateUnit', value)}
                      options={rateUnitOptions}
                    />
                  </div>
                </div>
                
                <Input
                  label={`Total Agreed Amount (${formData.currency}) *`}
                  value={formData.totalAmount}
                  onChange={(value) => handleChange('totalAmount', value)}
                  placeholder="Total amount"
                  error={errors.totalAmount}
                />
                
                <Input
                  label="Payment Terms *"
                  value={formData.paymentTerms}
                  onChange={(value) => handleChange('paymentTerms', value)}
                  placeholder="e.g. 7 days from POD"
                  error={errors.paymentTerms}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader title="Special Instructions & Signatures" />
            <CardContent>
              <div className="space-y-4">
                <TextArea
                  label="Special Instructions / Notes"
                  value={formData.specialInstructions}
                  onChange={(value) => handleChange('specialInstructions', value)}
                  placeholder="Provide any handling, timing, or safety requirements"
                  rows={4}
                  error={errors.specialInstructions}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Transporter Representative Name"
                    value={formData.transporterName}
                    onChange={(value) => handleChange('transporterName', value)}
                    placeholder="Name of transporter representative"
                    error={errors.transporterName}
                  />
                  
                  <Input
                    label="Matanuska Representative"
                    value={formData.matanuskaRepName}
                    onChange={(value) => handleChange('matanuskaRepName', value)}
                    placeholder="Name of Matanuska representative"
                    error={errors.matanuskaRepName}
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-blue-500 mt-0.5 mr-2" />
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Note:</span> PDF generation will include placeholders for signatures. The document can be printed and signed physically, or signed digitally using a compatible PDF tool.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Preview Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            <Card>
              <CardHeader title="Load Confirmation Preview" />
              <CardContent>
                {generatedPdfUrl ? (
                  <div className="h-[800px] border rounded overflow-hidden">
                    <iframe 
                      src={generatedPdfUrl} 
                      className="w-full h-full"
                      title="Load Confirmation PDF"
                      onError={() => {
                        console.error("Error loading PDF");
                        setErrors({
                          specialInstructions: "Failed to display the PDF. You can still download it."
                        });
                      }}
                    />
                  </div>
                ) : (
                  <div className="h-[800px] flex flex-col items-center justify-center bg-gray-50 border rounded p-4 text-center">
                    <FileText className="h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Preview Available</h3>
                    <p className="text-gray-500 mb-6">
                      Fill out the form and click "Generate Confirmation" to create a PDF.
                    </p>
                    
                    {Object.keys(errors).length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md">
                        <div className="flex">
                          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                          <div>
                            <h4 className="text-sm font-medium text-red-800">
                              Please fix the following errors:
                            </h4>
                            <ul className="mt-1 list-disc list-inside text-sm text-red-700">
                              {Object.keys(errors).map((key) => (
                                <li key={key}>
                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}: {errors[key as keyof LoadConfirmationFormData]}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Button
                      className="mt-4"
                      onClick={handleSubmit}
                      icon={<FileText className="w-4 h-4" />}
                      isLoading={isGenerating}
                    >
                      Generate Confirmation
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader title="Company Details" />
              <CardContent>
                <div className="space-y-2 text-sm">
                  {formData.currency === 'ZAR' ? (
                    <>
                      <p className="font-medium">Matanuska (Pty) Ltd</p>
                      <p>6 MT ORVILLE STREET<br />MIDLANDS ESTATE MIDSTREAM<br />GAUTENG, 1692</p>
                      <p>Reg No: 2019/542290/07</p>
                      <p>VAT No: 4710136013</p>
                      <p>Tel: 011 613 1804</p>
                      <p>Reg Date: 01/02/1993</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium">Matanuska Distribution (Pvt) Ltd</p>
                      <p>5179 Tamside Close, Nyakamete Industrial Area<br />Harare, Zimbabwe</p>
                      <p>TIN: 2000321177</p>
                      <p>Authentication Code: 47046057</p>
                      <p>Taxpayer Name: Matanuska Distribution (Pvt) Ltd</p>
                      <p>Trade Name: Matanuska Distribution (Pvt) Ltd</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadConfirmationForm;