// ─── React & Utilities ───────────────────────────────────────────
import React, { useState } from 'react';

// ─── Types & Constants ───────────────────────────────────────────
import { MissedLoad, MISSED_LOAD_REASONS } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

// ─── UI Components ───────────────────────────────────────────────
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Select } from '../../components/ui/FormElements';

// ─── Icons ───────────────────────────────────────────────────────
import {
  DollarSign, Plus, Edit, Trash2, AlertTriangle, TrendingDown, Calendar, MapPin,
  User, X, Save, CheckCircle, FileText
} from 'lucide-react';

// ─── Firestore Client Hook ───────────────────────────────────────
import { useClientDropdown } from '../../hooks/useClientDropdown'; // <== JOU HOOK

interface MissedLoadsTrackerProps {
  missedLoads: MissedLoad[];
  onAddMissedLoad: (missedLoad: Omit<MissedLoad, 'id'>) => void;
  onUpdateMissedLoad: (missedLoad: MissedLoad) => void;
  onDeleteMissedLoad?: (id: string) => void;
}

const MissedLoadsTracker: React.FC<MissedLoadsTrackerProps> = ({
  missedLoads,
  onAddMissedLoad,
  onUpdateMissedLoad,
  onDeleteMissedLoad
}) => {
  // ─── Client Dropdown Data ─────────────────────────────
  const { clients, loading: clientsLoading, error: clientsError } = useClientDropdown({
    activeOnly: true,
    sortBy: 'client',
    descending: false
  });

  // ─── UI State ────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [editingLoad, setEditingLoad] = useState<MissedLoad | null>(null);
  const [resolvingLoad, setResolvingLoad] = useState<MissedLoad | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    loadRequestDate: new Date().toISOString().split('T')[0],
    requestedPickupDate: '',
    requestedDeliveryDate: '',
    route: '',
    estimatedRevenue: '',
    currency: 'ZAR' as 'ZAR' | 'USD',
    reason: '',
    reasonDescription: '',
    resolutionStatus: 'pending' as 'pending' | 'resolved' | 'lost_opportunity' | 'rescheduled',
    followUpRequired: true,
    competitorWon: false,
    impact: 'medium' as 'low' | 'medium' | 'high'
  });
  const [resolutionData, setResolutionData] = useState({
    resolutionNotes: '',
    compensationOffered: '',
    compensationNotes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ─── Handlers ─────────────────────────────────────────
  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleResolutionChange = (field: string, value: string) => {
    setResolutionData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.loadRequestDate) newErrors.loadRequestDate = 'Load request date is required';
    if (!formData.requestedPickupDate) newErrors.requestedPickupDate = 'Requested pickup date is required';
    if (!formData.requestedDeliveryDate) newErrors.requestedDeliveryDate = 'Requested delivery date is required';
    if (!formData.route.trim()) newErrors.route = 'Route is required';
    if (!formData.estimatedRevenue || Number(formData.estimatedRevenue) <= 0) newErrors.estimatedRevenue = 'Valid estimated revenue is required';
    if (!formData.reason) newErrors.reason = 'Reason for missing load is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResolutionForm = () => {
    const newErrors: Record<string, string> = {};
    if (!resolutionData.resolutionNotes.trim()) newErrors.resolutionNotes = 'Resolution notes are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const missedLoadData: Omit<MissedLoad, 'id'> = {
      customerName: formData.customerName.trim(),
      loadRequestDate: formData.loadRequestDate,
      requestedPickupDate: formData.requestedPickupDate,
      requestedDeliveryDate: formData.requestedDeliveryDate,
      route: formData.route.trim(),
      estimatedRevenue: Number(formData.estimatedRevenue),
      currency: formData.currency,
      reason: formData.reason as any,
      reasonDescription: formData.reasonDescription.trim() || undefined,
      resolutionStatus: formData.resolutionStatus,
      followUpRequired: formData.followUpRequired,
      competitorWon: formData.competitorWon,
      recordedBy: 'Current User',
      recordedAt: new Date().toISOString(),
      impact: formData.impact
    };
    if (editingLoad) {
      onUpdateMissedLoad({ ...missedLoadData, id: editingLoad.id });
      alert('Missed load updated successfully!');
    } else {
      onAddMissedLoad(missedLoadData);
      alert('Missed load recorded successfully!');
    }
    handleClose();
  };

  const handleResolutionSubmit = () => {
    if (!validateResolutionForm() || !resolvingLoad) return;
    const updatedLoad: MissedLoad = {
      ...resolvingLoad,
      resolutionStatus: 'resolved',
      resolutionNotes: resolutionData.resolutionNotes.trim(),
      resolvedAt: new Date().toISOString(),
      resolvedBy: 'Current User',
      compensationOffered: resolutionData.compensationOffered ? Number(resolutionData.compensationOffered) : undefined,
      compensationNotes: resolutionData.compensationNotes.trim() || undefined
    };
    onUpdateMissedLoad(updatedLoad);
    alert(`Missed load resolved successfully!\n\nResolution: ${resolutionData.resolutionNotes}\n${resolutionData.compensationOffered ? `Compensation offered: ${formatCurrency(Number(resolutionData.compensationOffered), resolvingLoad.currency)}` : ''}`);
    setShowResolutionModal(false);
    setResolvingLoad(null);
    setResolutionData({ resolutionNotes: '', compensationOffered: '', compensationNotes: '' });
    setErrors({});
  };

  const handleEdit = (load: MissedLoad) => {
    setFormData({
      customerName: load.customerName,
      loadRequestDate: load.loadRequestDate,
      requestedPickupDate: load.requestedPickupDate,
      requestedDeliveryDate: load.requestedDeliveryDate,
      route: load.route,
      estimatedRevenue: load.estimatedRevenue.toString(),
      currency: load.currency,
      reason: load.reason,
      reasonDescription: load.reasonDescription || '',
      resolutionStatus: load.resolutionStatus,
      followUpRequired: load.followUpRequired,
      competitorWon: load.competitorWon || false,
      impact: load.impact
    });
    setEditingLoad(load);
    setShowModal(true);
  };

  const handleResolve = (load: MissedLoad) => {
    setResolvingLoad(load);
    setResolutionData({ resolutionNotes: '', compensationOffered: '', compensationNotes: '' });
    setShowResolutionModal(true);
  };

  const handleDelete = (id: string) => {
    const load = missedLoads.find(l => l.id === id);
    if (!load) return;
    const confirmMessage = `Are you sure you want to delete this missed load?\n\n`
      + `Customer: ${load.customerName}\n`
      + `Route: ${load.route}\n`
      + `Estimated Revenue: ${formatCurrency(load.estimatedRevenue, load.currency)}\n\n`
      + `This action cannot be undone.`;
    if (confirm(confirmMessage)) onDeleteMissedLoad?.(id);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingLoad(null);
    setFormData({
      customerName: '',
      loadRequestDate: new Date().toISOString().split('T')[0],
      requestedPickupDate: '',
      requestedDeliveryDate: '',
      route: '',
      estimatedRevenue: '',
      currency: 'ZAR',
      reason: '',
      reasonDescription: '',
      resolutionStatus: 'pending',
      followUpRequired: true,
      competitorWon: false,
      impact: 'medium'
    });
    setErrors({});
  };

  const handleNewMissedLoad = () => {
    setEditingLoad(null);
    setShowModal(true);
  };

  // ─── Summary Calculations (Unchanged) ──────────────────────────
  const totalMissedLoads = missedLoads.length;
  const revenueLostZAR = missedLoads.filter(load => load.currency === 'ZAR' && load.resolutionStatus !== 'resolved').reduce((sum, load) => sum + load.estimatedRevenue, 0);
  const revenueLostUSD = missedLoads.filter(load => load.currency === 'USD' && load.resolutionStatus !== 'resolved').reduce((sum, load) => sum + load.estimatedRevenue, 0);
  const resolvedLoads = missedLoads.filter(load => load.resolutionStatus === 'resolved').length;
  const competitorWins = missedLoads.filter(load => load.competitorWon).length;
  const compensationOfferedZAR = missedLoads.filter(load => load.currency === 'ZAR' && load.compensationOffered).reduce((sum, load) => sum + (load.compensationOffered || 0), 0);
  const compensationOfferedUSD = missedLoads.filter(load => load.currency === 'USD' && load.compensationOffered).reduce((sum, load) => sum + (load.compensationOffered || 0), 0);

  // ─── Styling Helpers (Unchanged) ──────────────────────────────
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rescheduled': return 'bg-blue-100 text-blue-800';
      case 'lost_opportunity': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Missed Loads Tracker</h2>
          <p className="text-gray-600">Track and analyze missed business opportunities</p>
        </div>
        <Button
          onClick={handleNewMissedLoad}
          icon={<Plus className="w-4 h-4" />}
        >
          Record Missed Load
        </Button>
      </div>

      {/* Summary Cards ... (unchanged) */}
      {/* ...cards code ... */}

      {/* Missed Loads List ... (unchanged) */}
      {/* ...missed loads list code ... */}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleClose}
        title={editingLoad ? 'Edit Missed Load' : 'Record Missed Load'}
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Missed Load Documentation</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Record all missed business opportunities to identify patterns and improve our response capabilities.
                  This data helps in capacity planning and competitive analysis.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* --- CLIENT SELECT DROPDOWN VIA HOOK --- */}
            <Select
              label="Customer Name *"
              value={formData.customerName}
              onChange={e => handleChange('customerName', e.target.value)}
              options={
                clientsLoading
                  ? [{ label: 'Loading clients...', value: '' }]
                  : [
                      { label: 'Select customer...', value: '' },
                      ...clients,
                      { label: 'Other (specify in description)', value: 'Other' }
                    ]
              }
              error={errors.customerName || (clientsError ? 'Could not load client data' : '')}
              disabled={clientsLoading}
            />

            {/* ... the rest of your fields below is unchanged ... */}
            {/* (date fields, route, revenue, reasons, etc) */}
          </div>
          {/* ...rest of form as voorheen... */}
        </div>
      </Modal>

      {/* Resolution Modal ... (unchanged) */}
      {/* ...modal code ... */}
    </div>
  );
};

export default MissedLoadsTracker;
