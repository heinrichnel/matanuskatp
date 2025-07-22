// ─── React ───────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────
import { CostEntry, COST_CATEGORIES, Trip } from '../../types/index';

// ─── Components ───────────────────────────────────────────────────────
import Button from '../ui/Button';
import { Input, Select, TextArea } from '../ui/FormElements';
import FileUpload from '../ui/FileUpload';
// ─── Icons ───────────────────────────────────────────────────────
import {
  AlertTriangle,
  Flag,
  Save,
  Upload,
  X
} from 'lucide-react';


interface CostFormProps {
  tripId: string;
  cost?: CostEntry;
  onSubmit: (costData: Omit<CostEntry, 'id' | 'attachments'>, files?: FileList) => void;
  onCancel: () => void;
}

const CostForm: React.FC<CostFormProps> = ({ tripId, cost, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<{
    category: string;
    subCategory: string;
    amount: string;
    currency: 'USD' | 'ZAR';
    referenceNumber: string;
    date: string;
    notes: string;
    isFlagged: boolean;
    flagReason: string;
    noDocumentReason: string;
  }>({
    category: '',
    subCategory: '',
    amount: '',
    currency: 'ZAR',
    referenceNumber: '',
    date: '',
    notes: '',
    isFlagged: false,
    flagReason: '',
    noDocumentReason: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);

  // Move these to top-level so they are available everywhere
  const hasFiles = selectedFiles && selectedFiles.length > 0;
  const hasExistingAttachments = cost && cost.attachments && cost.attachments.length > 0;
  const hasDocumentation = hasFiles || hasExistingAttachments;
  const isHighRiskCategory = ['Non-Value-Added Costs', 'Border Costs'].includes(formData.category);

  useEffect(() => {
    if (cost) {
      setFormData({
        category: cost.category,
        subCategory: cost.subCategory,
        amount: cost.amount.toString(),
        currency: cost.currency,
        referenceNumber: cost.referenceNumber,
        date: cost.date,
        notes: cost.notes || '',
        isFlagged: cost.isFlagged,
        flagReason: cost.flagReason || '',
        noDocumentReason: cost.noDocumentReason || ''
      });
      if (cost.category && (COST_CATEGORIES as Record<string, string[]>)[cost.category]) {
        setAvailableSubCategories((COST_CATEGORIES as Record<string, string[]>)[cost.category]);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0]
      }));
    }
  }, [cost]);

  const handleChange = (field: keyof typeof formData, value: string | boolean | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // Extract value from event objects
    let finalValue: string | boolean;
    if (typeof value === 'object' && value !== null && 'target' in value) {
      if ('checked' in value.target) {
        finalValue = (value.target as HTMLInputElement).checked;
      } else {
        finalValue = value.target.value;
      }
    } else {
      finalValue = value;
    }
    setFormData(prev => ({ ...prev, [field]: finalValue }));
    if (field === 'category' && typeof value === 'string') {
      const subCategories = (COST_CATEGORIES as Record<string, string[]>)[value] || [];
      setAvailableSubCategories(subCategories);
      setFormData(prev => ({ ...prev, subCategory: '' }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.category) newErrors.category = 'Cost category is required';
    if (!formData.subCategory) newErrors.subCategory = 'Sub-cost type is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (formData.amount && isNaN(Number(formData.amount))) {
      newErrors.amount = 'Amount must be a valid number';
    }
    if (formData.amount && Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.currency) newErrors.currency = 'Currency is required';
    if (!formData.referenceNumber) newErrors.referenceNumber = 'Reference number is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (formData.category === 'System Costs') {
      newErrors.category = 'System costs are automatically generated and cannot be manually added';
    }
    const hasFiles = selectedFiles && selectedFiles.length > 0;
    const hasExistingAttachments = cost && cost.attachments && cost.attachments.length > 0;
    const hasNoDocumentReason = String(formData.noDocumentReason ?? '').trim().length > 0;
    if (!cost && !hasFiles && !hasNoDocumentReason) {
      newErrors.documents = 'Either attach a receipt/document OR provide a reason for missing documentation';
    }
    if (formData.isFlagged && !String(formData.flagReason ?? '').trim()) {
      newErrors.flagReason = 'Flag reason is required when manually flagging a cost entry';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Use already declared variables
    const highRiskCategories = ['Non-Value-Added Costs', 'Border Costs'];
    const isHighRisk = highRiskCategories.includes(formData.category);
    const missingDocumentation = !hasDocumentation && formData.noDocumentReason.trim();
    const shouldFlag = formData.isFlagged || isHighRisk || missingDocumentation;
    let flagReason = '';
    if (formData.isFlagged && String(formData.flagReason ?? '').trim()) {
      flagReason = String(formData.flagReason ?? '').trim();
    } else if (isHighRisk) {
      flagReason = `High-risk category: ${formData.category} - ${formData.subCategory} requires review`;
    } else if (missingDocumentation) {
      flagReason = `Missing documentation: ${String(formData.noDocumentReason ?? '').trim()}`;
    }
    const costData: Omit<CostEntry, 'id' | 'attachments'> = {
      tripId,
      category: formData.category,
      subCategory: formData.subCategory,
      amount: Number(formData.amount),
      currency: formData.currency,
      referenceNumber: String(formData.referenceNumber ?? '').trim(),
      date: formData.date,
      notes: String(formData.notes ?? '').trim() || undefined,
      isFlagged: Boolean(shouldFlag),
      flagReason: flagReason || undefined,
      noDocumentReason: String(formData.noDocumentReason ?? '').trim() || undefined,
      investigationStatus: shouldFlag ? 'pending' : undefined,
      flaggedAt: shouldFlag ? new Date().toISOString() : undefined,
      flaggedBy: shouldFlag ? 'Current User' : undefined,
      isSystemGenerated: false,
      // createdAt and updatedAt are not part of Omit<CostEntry, 'id' | 'attachments'>
    };
    onSubmit(costData, selectedFiles || undefined);
  };

  const getCurrencySymbol = (currency: 'USD' | 'ZAR'): string => {
    return currency === 'USD' ? '$' : 'R';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* High-Risk Category Warning */}
      {isHighRiskCategory && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">High-Risk Category</h4>
              <p className="text-sm text-amber-700 mt-1">
                {formData.category} costs are automatically flagged for investigation due to their risk profile. 
                Ensure all documentation is complete and accurate.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Structured Cost Category Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cost Category *</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <option value="">Select cost category</option>
            {Object.keys(COST_CATEGORIES).filter(cat => cat !== 'System Costs').map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Cost Type *</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={formData.subCategory}
            onChange={(e) => handleChange('subCategory', e.target.value)}
            disabled={!formData.category}
          >
            <option value="">
              {formData.category ? 'Select sub-cost type' : 'Select category first'}
            </option>
            {availableSubCategories.map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            ))}
          </select>
          {errors.subCategory && <p className="text-sm text-red-600 mt-1">{errors.subCategory}</p>}
          {formData.category && availableSubCategories.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">No sub-categories available for this category</p>
          )}
        </div>

        <Select
          label="Currency *"
          value={formData.currency}
          onChange={(e) => handleChange('currency', e.target ? e.target.value : e)}
          options={[
            { label: 'ZAR (R)', value: 'ZAR' },
            { label: 'USD ($)', value: 'USD' }
          ]}
          error={errors.currency}
        />

        <Input
          label={`Amount (${getCurrencySymbol(formData.currency)}) *`}
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={(value) => handleChange('amount', value)}
          placeholder="0.00"
          error={errors.amount}
        />

        <Input
          label="Reference Number *"
          value={formData.referenceNumber}
          onChange={(value) => handleChange('referenceNumber', value)}
          placeholder="e.g., INV-123456, RECEIPT-001"
          error={errors.referenceNumber}
        />

        <Input
          label="Date *"
          type="date"
          value={formData.date}
          onChange={(value) => handleChange('date', value)}
          error={errors.date}
        />
      </div>

      <TextArea
        label="Notes (Optional)"
        value={formData.notes || ''}
        onChange={(value) => handleChange('notes', value)}
        placeholder="Additional notes about this cost entry..."
        rows={3}
      />

      {/* MANDATORY DOCUMENT ATTACHMENT SECTION */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex items-center space-x-2">
          <Upload className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Document Attachment (Required)</h3>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Documentation Requirement</h4>
              <p className="text-sm text-blue-700 mt-1">
                Every cost entry must include either a receipt/document upload OR a valid explanation for missing documentation. 
                Items without proper documentation will be automatically flagged for investigation.
              </p>
            </div>
          </div>
        </div>

        <FileUpload
          label="Attach Receipt/Document"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          multiple
          onFileSelect={setSelectedFiles}
        />

        {hasFiles && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm font-medium text-green-800 mb-2">
              Selected Files ({selectedFiles!.length}):
            </p>
            <ul className="text-sm text-green-700 space-y-1">
              {Array.from(selectedFiles!).map((file, index) => (
                <li key={index} className="flex items-center">
                  <Upload className="w-3 h-3 mr-2" />
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasExistingAttachments && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <p className="text-sm font-medium text-gray-800 mb-2">
              Existing Attachments ({cost!.attachments.length}):
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              {cost!.attachments.map((attachment) => (
                <li key={attachment.id} className="flex items-center">
                  <Upload className="w-3 h-3 mr-2" />
                  {attachment.filename}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* No Document Reason - Required if no files */}
        {!hasDocumentation && (
          <div className="space-y-2">
            <TextArea
              label="Reason for Missing Documentation *"
              value={formData.noDocumentReason}
              onChange={(value) => handleChange('noDocumentReason', value)}
              placeholder="Explain why no receipt/document is available (e.g., 'Receipt lost during trip', 'Digital payment - no physical receipt', 'Emergency expense - receipt not provided')..."
              rows={3}
            />
            <p className="text-xs text-amber-600">
              ⚠️ This entry will be automatically flagged for investigation due to missing documentation.
            </p>
          </div>
        )}

        {errors.documents && <p className="text-sm text-red-600">{errors.documents}</p>}
      </div>

      {/* Manual Flag Section */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="manualFlag"
            checked={formData.isFlagged}
            onChange={(e) => handleChange('isFlagged', e.target.checked)}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <label htmlFor="manualFlag" className="flex items-center text-sm font-medium text-gray-700">
            <Flag className="w-4 h-4 mr-2 text-red-500" />
            Manually flag this cost entry for investigation
          </label>
        </div>

        {formData.isFlagged && (
          <div className="ml-7">
            <TextArea
              label="Flag Reason *"
              value={formData.flagReason}
              onChange={(value) => handleChange('flagReason', value)}
              placeholder="Explain why this cost is being flagged (e.g., 'Amount seems excessive', 'Unusual expense for this route', 'Requires management approval')..."
              rows={2}
              error={errors.flagReason}
            />
          </div>
        )}

        <div className="text-xs text-gray-500 ml-7">
          Use manual flagging for suspicious amounts, unusual expenses, or items requiring special attention.
          {isHighRiskCategory && (
            <span className="block text-amber-600 font-medium mt-1">
              Note: This category will be automatically flagged regardless of manual selection.
            </span>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClick || (() => {})}
          icon={<X className="w-4 h-4" />}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          icon={<Save className="w-4 h-4" />}
        >
          {cost ? 'Update Cost Entry' : 'Add Cost Entry'}
        </Button>
      </div>
    </form>
  );
};

// Second component: SystemCostGenerator
interface SystemCostGeneratorProps {
  trip: Trip;
  onGenerateSystemCosts: (systemCosts: Omit<CostEntry, "id" | "attachments">[]) => void;
}

const SystemCostGenerator: React.FC<SystemCostGeneratorProps> = ({ trip, onGenerateSystemCosts }) => {
  const [generating, setGenerating] = useState(false);
  const [generatedCosts, setGeneratedCosts] = useState<Omit<CostEntry, "id" | "attachments">[]>([]);
  const [includeDistance, setIncludeDistance] = useState(true);
  const [includeWaiting, setIncludeWaiting] = useState(true);
  const [includeDriver, setIncludeDriver] = useState(true);
  // Use default rate per km since it's not in the Trip type
  const [ratePerKm, setRatePerKm] = useState('5.20');
  const [waitingRatePerHour, setWaitingRatePerHour] = useState('250');
  const [driverDailyRate, setDriverDailyRate] = useState('750');
  const [currency, setCurrency] = useState<'ZAR' | 'USD'>(trip.revenueCurrency || 'ZAR');
  
  // Calculate distance based costs
  const calculateDistanceCost = () => {
    // Use distanceKm if available, otherwise use the estimated distance from planned or optimized route
    const tripDistance = trip.distanceKm || 
                         trip.optimizedRoute?.estimatedDistance || 
                         trip.plannedRoute?.estimatedDistance;
    
    if (!tripDistance) return null;
    
    const distanceCost: Omit<CostEntry, "id" | "attachments"> = {
      tripId: trip.id,
      category: 'System Costs',
      subCategory: 'Distance Cost',
      amount: parseFloat((tripDistance * parseFloat(ratePerKm)).toFixed(2)),
      currency: currency,
      referenceNumber: `DC-${trip.id.substring(0, 6)}`,
      date: new Date().toISOString().split('T')[0],
      notes: `Auto-generated distance cost: ${tripDistance}km @ ${ratePerKm}/km`,
      isFlagged: false,
      isSystemGenerated: true
    };
    
    return distanceCost;
  };
  
  // Calculate waiting time costs
  const calculateWaitingCost = () => {
    // Calculate waiting time from arrival to departure if we have actual timestamps
    // Otherwise return null if we don't have enough data
    if (!trip.actualArrivalDateTime || !trip.actualDepartureDateTime) return null;
    
    const arrivalTime = new Date(trip.actualArrivalDateTime).getTime();
    const departureTime = new Date(trip.actualDepartureDateTime).getTime();
    
    // Calculate waiting time in minutes
    const waitingTimeMinutes = Math.max(0, (departureTime - arrivalTime) / (60 * 1000));
    
    // Convert minutes to hours
    const waitingHours = waitingTimeMinutes / 60;
    
    const waitingCost: Omit<CostEntry, "id" | "attachments"> = {
      tripId: trip.id,
      category: 'System Costs',
      subCategory: 'Waiting Time',
      amount: parseFloat((waitingHours * parseFloat(waitingRatePerHour)).toFixed(2)),
      currency: currency,
      referenceNumber: `WT-${trip.id.substring(0, 6)}`,
      date: new Date().toISOString().split('T')[0],
      notes: `Auto-generated waiting time cost: ${waitingTimeMinutes.toFixed(0)} minutes @ ${waitingRatePerHour}/hour`,
      isFlagged: false,
      isSystemGenerated: true
    };
    
    return waitingCost;
  };
  
  // Calculate driver costs
  const calculateDriverCost = () => {
    if (!trip.plannedDepartureDateTime || !trip.plannedArrivalDateTime) return null;
    
    // Calculate days based on planned trip duration
    const startDate = new Date(trip.plannedDepartureDateTime);
    const endDate = new Date(trip.plannedArrivalDateTime);
    const tripDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    const days = Math.max(1, tripDays); // Minimum 1 day
    
    const driverCost: Omit<CostEntry, "id" | "attachments"> = {
      tripId: trip.id,
      category: 'System Costs',
      subCategory: 'Driver Cost',
      amount: parseFloat((days * parseFloat(driverDailyRate)).toFixed(2)),
      currency: currency,
      referenceNumber: `DR-${trip.id.substring(0, 6)}`,
      date: new Date().toISOString().split('T')[0],
      notes: `Auto-generated driver cost: ${days} days @ ${driverDailyRate}/day`,
      isFlagged: false,
      isSystemGenerated: true
    };
    
    return driverCost;
  };
  
  // Generate all system costs
  const generateCosts = () => {
    setGenerating(true);
    const costs: Omit<CostEntry, "id" | "attachments">[] = [];
    
    if (includeDistance) {
      const distanceCost = calculateDistanceCost();
      if (distanceCost) costs.push(distanceCost);
    }
    
    if (includeWaiting) {
      const waitingCost = calculateWaitingCost();
      if (waitingCost) costs.push(waitingCost);
    }
    
    if (includeDriver) {
      const driverCost = calculateDriverCost();
      if (driverCost) costs.push(driverCost);
    }
    
    setGeneratedCosts(costs);
    setGenerating(false);
  };
  
  // Submit generated costs
  const handleSubmit = () => {
    onGenerateSystemCosts(generatedCosts);
  };
  
  useEffect(() => {
    // Generate costs when component mounts
    generateCosts();
  }, []);
  
  // Regenerate when parameters change
  useEffect(() => {
    generateCosts();
  }, [includeDistance, includeWaiting, includeDriver, ratePerKm, waitingRatePerHour, driverDailyRate, currency]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-5">
        <h3 className="text-sm font-medium text-blue-800">About System-Generated Costs</h3>
        <p className="text-sm text-blue-700 mt-1">
          System costs are automatically calculated based on trip parameters like distance, waiting time, and duration.
          You can customize the calculation rates below before generating the costs.
        </p>
      </div>
      
      {/* Settings */}
      <div className="space-y-5">
        <h3 className="font-medium text-gray-900">Cost Parameters</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Currency Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  checked={currency === 'ZAR'}
                  onChange={() => setCurrency('ZAR')}
                />
                <span className="ml-2 text-gray-700">ZAR (R)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-4 w-4 text-blue-600"
                  checked={currency === 'USD'}
                  onChange={() => setCurrency('USD')}
                />
                <span className="ml-2 text-gray-700">USD ($)</span>
              </label>
            </div>
          </div>
          
          {/* Distance Cost */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="includeDistance"
              checked={includeDistance}
              onChange={(e) => setIncludeDistance(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-grow">
              <label htmlFor="includeDistance" className="text-sm font-medium text-gray-700">
                Include Distance Cost
              </label>
              {includeDistance && (
                <div className="mt-2">
                  <label className="text-xs text-gray-600">Rate per km ({currency === 'ZAR' ? 'R' : '$'})</label>
                  <input
                    type="number"
                    value={ratePerKm}
                    onChange={(e) => setRatePerKm(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Rate per km"
                    step="0.01"
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Waiting Time */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="includeWaiting"
              checked={includeWaiting}
              onChange={(e) => setIncludeWaiting(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-grow">
              <label htmlFor="includeWaiting" className="text-sm font-medium text-gray-700">
                Include Waiting Time Cost
              </label>
              {includeWaiting && (
                <div className="mt-2">
                  <label className="text-xs text-gray-600">Rate per hour ({currency === 'ZAR' ? 'R' : '$'})</label>
                  <input
                    type="number"
                    value={waitingRatePerHour}
                    onChange={(e) => setWaitingRatePerHour(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Rate per hour"
                    step="0.01"
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Driver Cost */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="includeDriver"
              checked={includeDriver}
              onChange={(e) => setIncludeDriver(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-grow">
              <label htmlFor="includeDriver" className="text-sm font-medium text-gray-700">
                Include Driver Cost
              </label>
              {includeDriver && (
                <div className="mt-2">
                  <label className="text-xs text-gray-600">Daily rate ({currency === 'ZAR' ? 'R' : '$'})</label>
                  <input
                    type="number"
                    value={driverDailyRate}
                    onChange={(e) => setDriverDailyRate(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Daily rate"
                    step="0.01"
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Generated Costs Preview */}
      {generatedCosts.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="font-medium text-gray-900">Generated System Costs</h3>
          
          <div className="border rounded-md divide-y">
            {generatedCosts.map((cost, index) => (
              <div key={index} className="p-3 bg-white hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{cost.subCategory}</p>
                    <p className="text-sm text-gray-600">{cost.notes}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lg">
                      {currency === 'ZAR' ? 'R' : '$'}{cost.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Ref: {cost.referenceNumber}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between items-center">
              <p className="font-medium">Total System Costs:</p>
              <p className="font-bold text-lg">
                {currency === 'ZAR' ? 'R' : '$'}
                {generatedCosts.reduce((sum, cost) => sum + cost.amount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="pt-5 border-t flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClick || (() => {})}
        >
          Recalculate
        </Button>
        <Button
          type="button"
          onClick={onClick || (() => {})}
          disabled={generatedCosts.length === 0}
        >
          Add System Costs
        </Button>
      </div>
    </div>
  );
};

export default CostForm;
export { SystemCostGenerator };