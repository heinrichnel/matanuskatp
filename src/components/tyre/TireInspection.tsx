import React, { useState, useEffect } from 'react';
import { Tyre } from '../../types/workshop-tyre-inventory';
import { Input, Select, TextArea } from '../ui/FormElements';
import Button from '../ui/Button';
import ErrorMessage from '../ui/ErrorMessage';
import LoadingIndicator from '../ui/LoadingIndicator';
import { AlertTriangle, Camera, CheckCircle2, Save, Upload, ShoppingBag } from 'lucide-react';
import { createOrUpdateDoc } from '../../utils/firestoreWorkshopUtils';

// Import the VehicleTireView component for reuse
import VehicleTireView from './VehicleTireView';

// Import tire reference data
import {
    TYRE_REFERENCES,
    getUniqueTyreBrands,
    getUniqueTyrePatterns,
    getUniqueTyreSizes,
    getTyresByBrand,
    getTyresByPosition,
    getTyresBySize,
    VENDORS,
    MOCK_INVENTORY,
    TyreReference,
    Vendor
} from '../../utils/tyreConstants';

// Mock data for fleet vehicles (would come from Firestore in production)
const FLEET_VEHICLES = [
    { id: '21H', name: '21H - Volvo FH16', type: 'Truck' },
    { id: '22H', name: '22H - Afrit Side Tipper', type: 'Trailer' },
    { id: '23H', name: '23H - Mercedes Actros', type: 'Truck' },
];

// Thresholds for tire condition assessment
const TIRE_THRESHOLDS = {
    treadDepth: {
        good: 5.0, // 5mm or more is good
        worn: 3.0, // Between 3mm and 5mm is worn
        // Below 3mm is urgent
    },
    pressure: {
        // For standard passenger tires (would vary by tire type in production)
        min: 30, // PSI
        max: 40, // PSI
    }
};

// Sidewall condition options
const SIDEWALL_CONDITIONS = [
    { value: 'good', label: 'Good - No visible damage' },
    { value: 'minor_damage', label: 'Minor Damage - Small cuts or abrasions' },
    { value: 'bulge', label: 'Bulge Present - Requires immediate attention' },
    { value: 'severe_damage', label: 'Severe Damage - Replace immediately' },
];

// Interface for the inspection form data
interface TireInspectionFormData {
    date: string;
    inspector: string;
    fleetNumber: string;
    tirePosition: string;
    treadDepth: string;
    pressure: string;
    sidewallCondition: string;
    remarks: string;
    photos: string[]; // This would store URLs in production
    // New fields for tire references
    brand: string;
    pattern: string;
    size: string;
    serialNumber: string;
    dotCode: string;
    supplier: string;
    detected: {
        treadDepthIssue: boolean;
        pressureIssue: boolean;
        sidewallIssue: boolean;
    };
}

const TireInspection: React.FC = () => {
    // Selected tire for inspection
    const [selectedTire, setSelectedTire] = useState<Tyre | null>(null);

    // Filtered tire options based on selections
    const [brandOptions, setBrandOptions] = useState<string[]>(getUniqueTyreBrands());
    const [patternOptions, setPatternOptions] = useState<string[]>([]);
    const [sizeOptions, setSizeOptions] = useState<string[]>(getUniqueTyreSizes());

    // Form data state
    const [formData, setFormData] = useState<TireInspectionFormData>({
        date: new Date().toISOString().split('T')[0],
        inspector: '',
        fleetNumber: '',
        tirePosition: '',
        treadDepth: '',
        pressure: '',
        sidewallCondition: 'good',
        remarks: '',
        photos: [],
        // New fields
        brand: '',
        pattern: '',
        size: '',
        serialNumber: '',
        dotCode: '',
        supplier: '',
        detected: {
            treadDepthIssue: false,
            pressureIssue: false,
            sidewallIssue: false,
        }
    });

    // Form submission state
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    // Add state for new tire option
    const [showNewTireFields, setShowNewTireFields] = useState<boolean>(false);

    // Handling tire selection from VehicleTireView
    const handleTireSelect = (tire: Tyre | null) => {
        setSelectedTire(tire);

        if (tire) {
            setFormData(prevData => ({
                ...prevData,
                tirePosition: tire.installDetails.position,
                // Pre-fill with current values for reference
                treadDepth: tire.treadDepth.toString(),
                pressure: tire.pressure.toString(),
                brand: tire.brand,
                pattern: tire.pattern || '',
                size: tire.size,
                serialNumber: tire.serialNumber,
                dotCode: tire.dotCode,
            }));

            // Update available patterns based on the brand
            if (tire.brand) {
                const brandTyres = getTyresByBrand(tire.brand);
                const patterns = Array.from(new Set(brandTyres.map(t => t.pattern).filter(p => p !== '')));
                setPatternOptions(patterns);
            }
        }
    };

    // Handle form input changes
    const handleChange = (field: keyof TireInspectionFormData, value: any) => {
        setFormData(prevData => {
            const newData = { ...prevData, [field]: value };

            // Auto-detect issues based on thresholds when these values change
            if (field === 'treadDepth' || field === 'pressure' || field === 'sidewallCondition') {
                const detected = {
                    treadDepthIssue: field === 'treadDepth'
                        ? parseFloat(value) < TIRE_THRESHOLDS.treadDepth.worn
                        : prevData.detected.treadDepthIssue,

                    pressureIssue: field === 'pressure'
                        ? parseFloat(value) < TIRE_THRESHOLDS.pressure.min ||
                        parseFloat(value) > TIRE_THRESHOLDS.pressure.max
                        : prevData.detected.pressureIssue,

                    sidewallIssue: field === 'sidewallCondition'
                        ? value === 'bulge' || value === 'severe_damage'
                        : prevData.detected.sidewallIssue,
                };

                return { ...newData, detected };
            }

            // Handle brand change to update pattern options
            if (field === 'brand') {
                const brandTyres = getTyresByBrand(value);
                const patterns = Array.from(new Set(brandTyres.map(t => t.pattern).filter(p => p !== '')));
                setPatternOptions(patterns);
            }

            // Handle size change to update brand options
            if (field === 'size') {
                const sizeTyres = getTyresBySize(value);
                const brands = Array.from(new Set(sizeTyres.map(t => t.brand)));
                setBrandOptions(brands);
            }

            return newData;
        });
    };

    // Fleet number change handler
    const handleFleetChange = (value: string) => {
        setFormData(prevData => ({
            ...prevData,
            fleetNumber: value,
            tirePosition: '', // Reset tire position when fleet changes
        }));
        setSelectedTire(null);
    };

    // Toggle new tire fields
    const handleToggleNewTireFields = () => {
        setShowNewTireFields(!showNewTireFields);
    };

    // Handle photo upload (placeholder for real implementation)
    const handlePhotoUpload = () => {
        // In a real implementation, this would handle the file upload process
        alert('Photo upload feature coming soon.');

        // Mock adding a photo URL to demonstrate the UI flow
        setFormData(prevData => ({
            ...prevData,
            photos: [...prevData.photos, `photo_${prevData.photos.length + 1}.jpg`]
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.inspector || !formData.fleetNumber || !formData.tirePosition ||
            !formData.treadDepth || !formData.pressure) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Determine overall status based on detected issues
            const status =
                formData.detected.treadDepthIssue && parseFloat(formData.treadDepth) < TIRE_THRESHOLDS.treadDepth.worn ? 'urgent' :
                    formData.detected.treadDepthIssue || formData.detected.pressureIssue || formData.detected.sidewallIssue ? 'worn' :
                        'good';

            // Prepare inspection record
            const inspectionRecord = {
                ...formData,
                treadDepth: parseFloat(formData.treadDepth),
                pressure: parseFloat(formData.pressure),
                timestamp: new Date().toISOString(),
                status,
                // If we have a selected tire, include its details for reference
                tireId: selectedTire?.id || null,
                tireDetails: selectedTire ? {
                    brand: selectedTire.brand,
                    model: selectedTire.model,
                    size: selectedTire.size,
                    serialNumber: selectedTire.serialNumber,
                    dotCode: selectedTire.dotCode,
                } : null,
            };

            // In a real app, this would save to Firestore
            // await createOrUpdateDoc('tireInspections', `inspection_${Date.now()}`, inspectionRecord);

            // Check if a fault or job card should be created
            if (status === 'urgent') {
                // In a real app, this would create a job card or add to fault list
                console.log('Creating urgent tire job card for', inspectionRecord);
                // await createOrUpdateDoc('faults', `fault_${Date.now()}`, {
                //   type: 'tire',
                //   severity: 'critical',
                //   description: `Urgent tire replacement needed: ${formData.fleetNumber} - ${formData.tirePosition}`,
                //   inspectionId: `inspection_${Date.now()}`,
                //   status: 'open',
                //   timestamp: new Date().toISOString(),
                // });
            }

            // Simulate successful save
            setTimeout(() => {
                setSuccess(true);
                setIsSubmitting(false);

                // Reset form after a delay
                setTimeout(() => {
                    setSuccess(false);
                    setFormData({
                        date: new Date().toISOString().split('T')[0],
                        inspector: formData.inspector, // Keep the inspector name
                        fleetNumber: '',
                        tirePosition: '',
                        treadDepth: '',
                        pressure: '',
                        sidewallCondition: 'good',
                        remarks: '',
                        photos: [],
                        brand: '',
                        pattern: '',
                        size: '',
                        serialNumber: '',
                        dotCode: '',
                        supplier: '',
                        detected: {
                            treadDepthIssue: false,
                            pressureIssue: false,
                            sidewallIssue: false,
                        }
                    });
                    setSelectedTire(null);
                    setShowNewTireFields(false);
                }, 2000);
            }, 1000);
        } catch (error) {
            console.error('Error saving inspection:', error);
            setError('Failed to save inspection. Please try again.');
            setIsSubmitting(false);
        }
    };

    // Determine if there are any detected issues
    const hasIssues = formData.detected.treadDepthIssue ||
        formData.detected.pressureIssue ||
        formData.detected.sidewallIssue;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Tyre Inspection</h1>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                    <div className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                        <h3 className="text-green-800 font-medium">Inspection saved successfully</h3>
                    </div>
                    {hasIssues && (
                        <p className="mt-2 text-green-700">
                            Issues were detected and logged to the system.
                        </p>
                    )}
                </div>
            )}

            {/* Error Message */}
            {error && <ErrorMessage message={error} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Vehicle Selection */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">Vehicle Selection</h2>

                        <div className="space-y-4">
                            <Select
                                label="Fleet Number"
                                value={formData.fleetNumber}
                                onChange={handleFleetChange}
                                options={[
                                    { label: 'Select vehicle...', value: '' },
                                    ...FLEET_VEHICLES.map(v => ({ label: v.name, value: v.id }))
                                ]}
                                required
                            />

                            <Input
                                label="Inspector"
                                value={formData.inspector}
                                onChange={(value) => handleChange('inspector', value)}
                                placeholder="Your name"
                                required
                            />

                            <Input
                                label="Date"
                                type="date"
                                value={formData.date}
                                onChange={(value) => handleChange('date', value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Inspection Form - Only shown when a tire is selected */}
                    {selectedTire && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold mb-4">Inspection Data</h2>

                            <div className="space-y-4">
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-500">Selected Tyre</p>
                                    <p className="font-medium">{selectedTire.brand} {selectedTire.model}</p>
                                    <p className="text-sm">
                                        Position: <span className="font-medium capitalize">{selectedTire.installDetails.position.replace('-', ' ')}</span>
                                    </p>
                                </div>

                                {/* Tire Details Section */}
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-md font-medium">Tyre Specifications</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleToggleNewTireFields}
                                            icon={<ShoppingBag className="w-4 h-4" />}
                                            size="sm"
                                        >
                                            {showNewTireFields ? 'Hide New Tyre Options' : 'Show New Tyre Options'}
                                        </Button>
                                    </div>

                                    {showNewTireFields && (
                                        <div className="space-y-3 mb-4">
                                            <Select
                                                label="Size"
                                                value={formData.size}
                                                onChange={(value) => handleChange('size', value)}
                                                options={[
                                                    { label: 'Select size...', value: '' },
                                                    ...getUniqueTyreSizes().map(size => ({ label: size, value: size }))
                                                ]}
                                            />

                                            <Select
                                                label="Brand"
                                                value={formData.brand}
                                                onChange={(value) => handleChange('brand', value)}
                                                options={[
                                                    { label: 'Select brand...', value: '' },
                                                    ...brandOptions.map(brand => ({ label: brand, value: brand }))
                                                ]}
                                            />

                                            {formData.brand && (
                                                <Select
                                                    label="Pattern"
                                                    value={formData.pattern}
                                                    onChange={(value) => handleChange('pattern', value)}
                                                    options={[
                                                        { label: 'Select pattern...', value: '' },
                                                        ...patternOptions.map(pattern => ({ label: pattern, value: pattern }))
                                                    ]}
                                                />
                                            )}

                                            <Input
                                                label="Serial Number"
                                                value={formData.serialNumber}
                                                onChange={(value) => handleChange('serialNumber', value)}
                                                placeholder="Tyre serial number"
                                            />

                                            <Input
                                                label="DOT Code"
                                                value={formData.dotCode}
                                                onChange={(value) => handleChange('dotCode', value)}
                                                placeholder="DOT code from sidewall"
                                            />

                                            <Select
                                                label="Supplier"
                                                value={formData.supplier}
                                                onChange={(value) => handleChange('supplier', value)}
                                                options={[
                                                    { label: 'Select supplier...', value: '' },
                                                    ...VENDORS.map(v => ({ label: v.name, value: v.id }))
                                                ]}
                                            />
                                        </div>
                                    )}
                                </div>

                                <Input
                                    label="Tread Depth (mm)"
                                    type="number"
                                    value={formData.treadDepth}
                                    onChange={(value) => handleChange('treadDepth', value)}
                                    placeholder="Enter measurement in mm"
                                    min="0"
                                    step="0.1"
                                    required
                                    error={formData.detected.treadDepthIssue ? 'Tread depth below threshold' : undefined}
                                />

                                <Input
                                    label="Pressure (PSI)"
                                    type="number"
                                    value={formData.pressure}
                                    onChange={(value) => handleChange('pressure', value)}
                                    placeholder="Enter measurement in PSI"
                                    min="0"
                                    step="1"
                                    required
                                    error={formData.detected.pressureIssue ? 'Pressure outside normal range' : undefined}
                                />

                                <Select
                                    label="Sidewall Condition"
                                    value={formData.sidewallCondition}
                                    onChange={(value) => handleChange('sidewallCondition', value)}
                                    options={SIDEWALL_CONDITIONS.map(cond => ({ label: cond.label, value: cond.value }))}
                                    error={formData.detected.sidewallIssue ? 'Sidewall condition requires attention' : undefined}
                                />

                                <TextArea
                                    label="Remarks"
                                    value={formData.remarks}
                                    onChange={(value) => handleChange('remarks', value)}
                                    placeholder="Additional observations or notes..."
                                    rows={3}
                                />

                                {/* Photo Upload (Placeholder) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Photos (Optional)
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handlePhotoUpload}
                                            icon={<Camera className="w-4 h-4" />}
                                            size="sm"
                                        >
                                            Take Photo
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handlePhotoUpload}
                                            icon={<Upload className="w-4 h-4" />}
                                            size="sm"
                                        >
                                            Upload
                                        </Button>
                                    </div>

                                    {/* Uploaded Photos Preview */}
                                    {formData.photos.length > 0 && (
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            {formData.photos.map((photo, index) => (
                                                <div key={index} className="h-20 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                                                    <p className="text-xs">Photo {index + 1}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Issues Warning */}
                                {hasIssues && (
                                    <div className="bg-amber-50 border-l-4 border-amber-500 p-3">
                                        <div className="flex items-center">
                                            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                                            <h3 className="text-amber-800 font-medium text-sm">Issues Detected</h3>
                                        </div>
                                        <ul className="mt-1 list-disc list-inside text-sm text-amber-700">
                                            {formData.detected.treadDepthIssue && (
                                                <li>Tread depth below recommended threshold</li>
                                            )}
                                            {formData.detected.pressureIssue && (
                                                <li>Tire pressure outside normal range</li>
                                            )}
                                            {formData.detected.sidewallIssue && (
                                                <li>Sidewall condition requires attention</li>
                                            )}
                                        </ul>
                                        {formData.detected.treadDepthIssue && parseFloat(formData.treadDepth) < TIRE_THRESHOLDS.treadDepth.worn && (
                                            <p className="mt-1 text-sm text-amber-700 font-bold">
                                                A job card will be created for urgent tire replacement.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="mt-4">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={handleSubmit}
                                        icon={<Save className="w-4 h-4" />}
                                        isLoading={isSubmitting}
                                        disabled={!formData.inspector || !formData.treadDepth || !formData.pressure || isSubmitting}
                                        className="w-full"
                                    >
                                        Save Inspection
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Vehicle Tire Diagram */}
                <div className="lg:col-span-2">
                    {formData.fleetNumber ? (
                        <VehicleTireView
                            vehicleId={formData.fleetNumber}
                            onTireSelect={handleTireSelect}
                        />
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-96 flex items-center justify-center">
                            <div className="text-center text-gray-500">
                                <p className="text-lg font-medium mb-2">Select a Fleet Vehicle</p>
                                <p className="text-sm">To begin the inspection, select a vehicle from the dropdown menu.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TireInspection;