import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input, Select, TextArea } from '../ui/FormElements';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { AlertTriangle, CheckCircle, Printer, FileText, Clock, TrendingDown, Save, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { DieselConsumptionRecord } from '../../types';

interface EnhancedDieselDebriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DieselConsumptionRecord;
}

const EnhancedDieselDebriefModal: React.FC<EnhancedDieselDebriefModalProps> = ({
  isOpen,
  onClose,
  record
}) => {
  const { updateDieselRecord, dieselNorms } = useAppContext();
  
  const [debriefNotes, setDebriefNotes] = useState<string>(record.debriefNotes || '');
  const [actionTaken, setActionTaken] = useState<string>(record.actionTaken || '');
  const [rootCause, setRootCause] = useState<string>(record.rootCause || '');
  const [driverSignature, setDriverSignature] = useState<boolean>(record.driverSignature || false);
  const [supervisorSignature, setSupervisorSignature] = useState<boolean>(record.supervisorSignature || false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Calculate consumption metrics
  const getNormForVehicle = () => {
    return dieselNorms?.find(norm => norm.fleetNumber === record.fleetNumber) || { expectedConsumption: 0 };
  };
  
  const norm = getNormForVehicle();
  const expectedConsumption = norm.expectedConsumption;
  
  // Calculate distance if available
  const calculateDistance = () => {
    if (record.kmReading && record.previousKmReading) {
      return record.kmReading - record.previousKmReading;
    }
    return null;
  };
  
  const distance = calculateDistance();
  
  // Calculate consumption per 100km if distance is available
  const calculateConsumption = () => {
    if (distance && distance > 0) {
      return (record.litresFilled * 100) / distance;
    }
    return null;
  };
  
  const consumption = calculateConsumption();
  
  // Calculate variance from expected norm
  const calculateVariance = () => {
    if (consumption && expectedConsumption) {
      return consumption - expectedConsumption;
    }
    return null;
  };
  
  const variance = calculateVariance();
  
  // Determine if the consumption is within acceptable limits
  const isConsumptionAcceptable = () => {
    if (variance === null || !expectedConsumption) return true; // No data to compare
    
    // 10% above norm is considered acceptable threshold
    return variance <= (expectedConsumption * 0.1);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!rootCause) {
      newErrors.rootCause = 'Please specify a root cause';
    }
    
    if (!actionTaken) {
      newErrors.actionTaken = 'Please specify actions taken';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateDieselRecord(record.id, {
        ...record,
        debriefNotes,
        actionTaken,
        rootCause,
        driverSignature,
        supervisorSignature,
        debriefDate: new Date().toISOString(),
        debriefCompleted: true
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating diesel debrief:', error);
      setErrors({ submit: 'Failed to save debrief. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Generate PDF report
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(18);
    doc.text('Diesel Consumption Debrief Report', 105, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Fleet: ${record.fleetNumber}`, 20, 30);
    doc.text(`Date: ${formatDate(record.date)}`, 20, 40);
    doc.text(`Driver: ${record.driverName || 'Not specified'}`, 20, 50);
    
    // Add consumption data
    doc.setFontSize(14);
    doc.text('Consumption Details', 105, 70, { align: 'center' });
    
    const tableData = [
      ['Metric', 'Value'],
      ['Litres filled', `${record.litresFilled} L`],
      ['Distance traveled', distance ? `${distance} km` : 'N/A'],
      ['Consumption per 100km', consumption ? `${consumption.toFixed(2)} L/100km` : 'N/A'],
      ['Expected consumption', expectedConsumption ? `${expectedConsumption.toFixed(2)} L/100km` : 'N/A'],
      ['Variance', variance ? `${variance.toFixed(2)} L/100km` : 'N/A'],
    ];
    
    // @ts-ignore
    doc.autoTable({
      startY: 75,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Add debrief info
    doc.setFontSize(14);
    // @ts-ignore
    doc.text('Debrief Information', 105, doc.lastAutoTable.finalY + 15, { align: 'center' });
    
    const debriefData = [
      ['Category', 'Details'],
      ['Root Cause', rootCause || 'Not specified'],
      ['Action Taken', actionTaken || 'Not specified'],
      ['Notes', debriefNotes || 'None']
    ];
    
    // @ts-ignore
    doc.autoTable({
      // @ts-ignore
      startY: doc.lastAutoTable.finalY + 20,
      head: [debriefData[0]],
      body: debriefData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    // Add signatures
    doc.setFontSize(12);
    // @ts-ignore
    doc.text('Signatures:', 20, doc.lastAutoTable.finalY + 20);
    
    // @ts-ignore
    doc.text(`Driver: ${driverSignature ? '✓ Signed' : '□ Not signed'}`, 20, doc.lastAutoTable.finalY + 30);
    // @ts-ignore
    doc.text(`Supervisor: ${supervisorSignature ? '✓ Signed' : '□ Not signed'}`, 120, doc.lastAutoTable.finalY + 30);
    
    // Add footer
    // @ts-ignore
    doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, 105, doc.lastAutoTable.finalY + 50, { align: 'center' });
    
    // Save PDF
    doc.save(`diesel-debrief-${record.fleetNumber}-${formatDate(record.date)}.pdf`);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Diesel Consumption Debrief" size="lg">
      <div className="space-y-6">
        {/* Header information */}
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Fleet</p>
              <p className="text-lg font-medium">{record.fleetNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-lg font-medium">{formatDate(record.date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Driver</p>
              <p className="text-lg font-medium">{record.driverName || 'Not specified'}</p>
            </div>
          </div>
        </div>
        
        {/* Consumption details */}
        <div>
          <h3 className="text-md font-medium mb-3">Consumption Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 border rounded-md">
              <p className="text-sm text-gray-500">Litres Filled</p>
              <p className="text-xl font-semibold">{record.litresFilled.toFixed(2)} L</p>
            </div>
            
            <div className="bg-white p-3 border rounded-md">
              <p className="text-sm text-gray-500">Total Cost</p>
              <p className="text-xl font-semibold">
                {formatCurrency(record.totalCost)}
                <span className="text-xs ml-1 text-gray-500">
                  ({record.currency})
                </span>
              </p>
            </div>
            
            <div className="bg-white p-3 border rounded-md">
              <p className="text-sm text-gray-500">Distance</p>
              <p className="text-xl font-semibold">
                {distance ? `${distance} km` : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div 
              className={`bg-white p-3 border rounded-md ${
                consumption && consumption > expectedConsumption * 1.1 ? 'border-red-300' : ''
              }`}
            >
              <p className="text-sm text-gray-500">Consumption per 100km</p>
              <p className="text-xl font-semibold flex items-center">
                {consumption ? `${consumption.toFixed(2)} L` : 'N/A'}
                
                {consumption && consumption > expectedConsumption * 1.1 && (
                  <span className="ml-2 text-red-500">
                    <AlertTriangle size={16} />
                  </span>
                )}
              </p>
            </div>
            
            <div className="bg-white p-3 border rounded-md">
              <p className="text-sm text-gray-500">Expected Consumption</p>
              <p className="text-xl font-semibold">
                {expectedConsumption ? `${expectedConsumption.toFixed(2)} L` : 'N/A'}
              </p>
            </div>
            
            <div 
              className={`bg-white p-3 border rounded-md ${
                variance && variance > 0 ? 'border-red-300' : variance && variance < 0 ? 'border-green-300' : ''
              }`}
            >
              <p className="text-sm text-gray-500">Variance</p>
              <p className={`text-xl font-semibold ${
                variance && variance > 0 ? 'text-red-600' : variance && variance < 0 ? 'text-green-600' : ''
              }`}>
                {variance ? `${variance > 0 ? '+' : ''}${variance.toFixed(2)} L` : 'N/A'}
                
                {variance && (
                  <span className="ml-1">
                    {variance > 0 ? '↑' : '↓'}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
        
        {/* Warning if consumption is too high */}
        {consumption && !isConsumptionAcceptable() && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  High Consumption Detected
                </p>
                <p className="text-sm text-red-700 mt-1">
                  The consumption is {((consumption / expectedConsumption - 1) * 100).toFixed(1)}% higher than the expected norm.
                  This requires investigation and explanation.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Debrief form */}
        <div>
          <h3 className="text-md font-medium mb-3">Debrief Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Root Cause *</label>
              <Select
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                error={errors.rootCause}
              >
                <option value="">Select a root cause</option>
                <option value="driver_behavior">Driver Behavior</option>
                <option value="vehicle_issue">Vehicle Issue</option>
                <option value="route_conditions">Route Conditions</option>
                <option value="weather">Weather Conditions</option>
                <option value="overloading">Overloading</option>
                <option value="idling">Excessive Idling</option>
                <option value="speed">Excessive Speed</option>
                <option value="theft">Suspected Theft</option>
                <option value="maintenance">Maintenance Issue</option>
                <option value="other">Other</option>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Action Taken *</label>
              <Select
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                error={errors.actionTaken}
              >
                <option value="">Select action taken</option>
                <option value="driver_training">Driver Training</option>
                <option value="maintenance">Vehicle Maintenance</option>
                <option value="route_change">Route Change</option>
                <option value="disciplinary">Disciplinary Action</option>
                <option value="monitoring">Increased Monitoring</option>
                <option value="none">No Action Required</option>
                <option value="other">Other</option>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <TextArea
                value={debriefNotes}
                onChange={(e) => setDebriefNotes(e.target.value)}
                rows={3}
                placeholder="Add detailed notes about the debrief..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  id="driverSignature"
                  name="driverSignature"
                  type="checkbox"
                  checked={driverSignature}
                  onChange={(e) => setDriverSignature(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="driverSignature" className="text-sm font-medium">
                  Driver has signed off on debrief
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="supervisorSignature"
                  name="supervisorSignature"
                  type="checkbox"
                  checked={supervisorSignature}
                  onChange={(e) => setSupervisorSignature(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="supervisorSignature" className="text-sm font-medium">
                  Supervisor has signed off on debrief
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit error message */}
        {errors.submit && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={generatePDF} 
            className="flex items-center"
          >
            <Printer className="mr-1 h-4 w-4" /> Generate PDF
          </Button>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-1">⏳</span> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-1 h-4 w-4" /> Save Debrief
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EnhancedDieselDebriefModal;
