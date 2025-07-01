import React, { useReducer, useEffect } from 'react';
import { Inspection, InspectionCategoryItem } from '../../types/workshop-tyre-inventory';
import { Input, Select, TextArea } from '../ui/FormElements';
import Button from '../ui/Button';
import { Save, X, Plus, AlertTriangle } from 'lucide-react';
import ErrorMessage from '../ui/ErrorMessage';
import { createOrUpdateDoc } from '../../utils/firestoreWorkshopUtils';

// Sample inspection categories and their items (would come from Firestore in production)
const DEFAULT_CATEGORIES: Record<string, InspectionCategoryItem[]> = {
    brakes: [
        { name: 'Brake linings', status: 'pending', criticality: 'high' },
        { name: 'Slack Adjuster', status: 'pending', criticality: 'medium' },
        { name: 'Brake Chambers', status: 'pending', criticality: 'high' },
        { name: 'Brake drums', status: 'pending', criticality: 'high' },
    ],
    engine: [
        { name: 'Oil level', status: 'pending', criticality: 'medium' },
        { name: 'Coolant', status: 'pending', criticality: 'high' },
        { name: 'Air filter', status: 'pending', criticality: 'low' },
        { name: 'Belts', status: 'pending', criticality: 'medium' },
    ],
    tires: [
        { name: 'Tread depth', status: 'pending', criticality: 'critical' },
        { name: 'Pressure', status: 'pending', criticality: 'high' },
        { name: 'Wheel nuts', status: 'pending', criticality: 'critical' },
        { name: 'Sidewall condition', status: 'pending', criticality: 'high' },
    ],
    lights: [
        { name: 'Headlights', status: 'pending', criticality: 'high' },
        { name: 'Brake lights', status: 'pending', criticality: 'high' },
        { name: 'Indicators', status: 'pending', criticality: 'medium' },
        { name: 'Reverse lights', status: 'pending', criticality: 'medium' },
    ],
    chassis: [
        { name: 'Frame', status: 'pending', criticality: 'high' },
        { name: 'Suspension', status: 'pending', criticality: 'high' },
        { name: 'Steering', status: 'pending', criticality: 'critical' },
        { name: 'Fifth wheel', status: 'pending', criticality: 'high' },
    ],
    safety: [
        { name: 'Seat belts', status: 'pending', criticality: 'high' },
        { name: 'Fire extinguisher', status: 'pending', criticality: 'high' },
        { name: 'First aid kit', status: 'pending', criticality: 'medium' },
        { name: 'Warning triangles', status: 'pending', criticality: 'medium' },
    ],
};

// Mock data for dropdowns (would come from Firestore in production)
const FLEET_NUMBERS = ['21H', '22H', '23H', '24H', '25H'];
const INSPECTORS = ['John Smith', 'Sarah Johnson', 'Robert Brown', 'Lisa Davis'];
const DRIVERS = ['Alex Johnson', 'Maria Garcia', 'David Wilson', 'Susan Moore'];

interface InspectionFormProps {
    inspection?: Inspection;
    onSubmit: (inspectionData: Omit<Inspection, 'id'>) => Promise<void>;
    onCancel: () => void;
    onCreateJobCard?: (inspection: Inspection) => void;
}

type FormState = {
    formData: Partial<Inspection>;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    isSubmitting: boolean;
    submitError: string | null;
    activeCategory: string;
    showJobCardModal: boolean;
};

type FormAction =
    | { type: 'SET_FIELD'; field: keyof Inspection; value: any }
    | { type: 'SET_CATEGORY_ITEM'; category: string; index: number; item: InspectionCategoryItem }
    | { type: 'SET_TOUCHED'; field: keyof Inspection }
    | { type: 'SET_ACTIVE_CATEGORY'; category: string }
    | { type: 'TOGGLE_JOB_CARD_MODAL' }
    | { type: 'VALIDATE_FORM' }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS' }
    | { type: 'SUBMIT_FAILURE'; error: string }
    | { type: 'RESET_FORM'; payload: Partial<Inspection> };

const getInitialState = (inspection?: Inspection): FormState => {
    const now = new Date().toISOString();
    const initialFormData: Partial<Inspection> = {
        name: inspection?.name || '',
        date: inspection?.date || new Date().toISOString().split('T')[0],
        inspector: inspection?.inspector || '',
        fleetNumber: inspection?.fleetNumber || '',
        driver: inspection?.driver || '',
        timeStart: inspection?.timeStart || now,
        timeEnd: inspection?.timeEnd || '',
        categories: inspection?.categories || { ...DEFAULT_CATEGORIES },
        remarks: inspection?.remarks || '',
        criticalFaults: inspection?.criticalFaults || [],
        status: inspection?.status || 'open',
    };

    return {
        formData: initialFormData,
        errors: {},
        touched: {},
        isSubmitting: false,
        submitError: null,
        activeCategory: 'brakes', // Default active category
        showJobCardModal: false,
    };
};

const validate = (formData: Partial<Inspection>): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Inspection Name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.inspector) newErrors.inspector = 'Inspector is required';
    if (!formData.fleetNumber) newErrors.fleetNumber = 'Fleet Number is required';
    if (!formData.driver) newErrors.driver = 'Driver is required';

    // Ensure all categories have status set (not pending)
    const pendingItems: string[] = [];
    Object.entries(formData.categories || {}).forEach(([category, items]) => {
        items.forEach((item) => {
            if (item.status === 'pending') {
                pendingItems.push(`${category}: ${item.name}`);
            }
        });
    });

    if (pendingItems.length > 0) {
        newErrors.categories = `The following items are still pending: ${pendingItems.slice(0, 3).join(', ')}${pendingItems.length > 3 ? ` and ${pendingItems.length - 3} more...` : ''}`;
    }

    return newErrors;
};

const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                formData: { ...state.formData, [action.field]: action.value },
                errors: { ...state.errors, [action.field]: '' }, // Clear error on change
                submitError: null,
            };
        case 'SET_CATEGORY_ITEM': {
            const categories = { ...(state.formData.categories || {}) };
            const categoryItems = [...(categories[action.category] || [])];
            categoryItems[action.index] = action.item;
            categories[action.category] = categoryItems;

            // Update critical faults list
            const allItems = Object.values(categories).flat();
            const criticalFaults = allItems.filter(item =>
                item.status === 'fail' &&
                (item.criticality === 'high' || item.criticality === 'critical')
            );

            return {
                ...state,
                formData: {
                    ...state.formData,
                    categories,
                    criticalFaults
                },
                errors: { ...state.errors, categories: '' },
            };
        }
        case 'SET_TOUCHED':
            return { ...state, touched: { ...state.touched, [action.field]: true } };
        case 'SET_ACTIVE_CATEGORY':
            return { ...state, activeCategory: action.category };
        case 'TOGGLE_JOB_CARD_MODAL':
            return { ...state, showJobCardModal: !state.showJobCardModal };
        case 'VALIDATE_FORM':
            const errors = validate(state.formData);
            return { ...state, errors };
        case 'SUBMIT_START':
            const validationErrors = validate(state.formData);
            const allTouched = Object.keys(state.formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
            return {
                ...state,
                errors: validationErrors,
                touched: allTouched,
                isSubmitting: Object.keys(validationErrors).length === 0,
                submitError: Object.keys(validationErrors).length > 0
                    ? 'Please fix the errors before submitting.'
                    : null,
            };
        case 'SUBMIT_SUCCESS':
            return { ...state, isSubmitting: false, showJobCardModal: (state.formData.criticalFaults?.length ?? 0) > 0 };
        case 'SUBMIT_FAILURE':
            return { ...state, isSubmitting: false, submitError: action.error };
        case 'RESET_FORM':
            return { ...getInitialState(), formData: action.payload };
        default:
            return state;
    }
};

const InspectionForm: React.FC<InspectionFormProps> = ({
    inspection,
    onSubmit,
    onCancel,
    onCreateJobCard
}) => {
    const [state, dispatch] = useReducer(formReducer, getInitialState(inspection));

    useEffect(() => {
        dispatch({ type: 'RESET_FORM', payload: getInitialState(inspection).formData });
    }, [inspection]);

    const handleChange = (field: keyof Inspection, value: any) => {
        dispatch({ type: 'SET_FIELD', field, value });
    };

    const handleBlur = (field: keyof Inspection) => {
        dispatch({ type: 'SET_TOUCHED', field });
        dispatch({ type: 'VALIDATE_FORM' });
    };

    const handleCategoryChange = (category: string) => {
        dispatch({ type: 'SET_ACTIVE_CATEGORY', category });
    };

    const handleItemStatusChange = (category: string, index: number, status: 'pass' | 'fail' | 'na' | 'pending') => {
        const item = { ...state.formData.categories![category][index], status };
        dispatch({ type: 'SET_CATEGORY_ITEM', category, index, item });
    };

    const handleItemRemarksChange = (category: string, index: number, remarks: string) => {
        const item = { ...state.formData.categories![category][index], remarks };
        dispatch({ type: 'SET_CATEGORY_ITEM', category, index, item });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'SUBMIT_START' });

        const validationErrors = validate(state.formData);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        // Set the end time to now
        const updatedFormData = {
            ...state.formData,
            timeEnd: new Date().toISOString(),
        };

        try {
            await onSubmit(updatedFormData as Omit<Inspection, 'id'>);
            dispatch({ type: 'SUBMIT_SUCCESS' });
        } catch (error) {
            console.error('Submission Failure:', error);
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred.';
            dispatch({
                type: 'SUBMIT_FAILURE',
                error: `Failed to save inspection: ${errorMessage}. Please try again.`
            });
        }
    };

    const handleCreateJobCard = () => {
        if (onCreateJobCard && state.formData.id) {
            onCreateJobCard(state.formData as Inspection);
        }
        dispatch({ type: 'TOGGLE_JOB_CARD_MODAL' });
    };

    const categoryProgress = Object.entries(state.formData.categories || {}).reduce(
        (acc, [category, items]) => {
            const total = items.length;
            const completed = items.filter(item => item.status !== 'pending').length;
            acc[category] = { total, completed, percent: Math.round((completed / total) * 100) };
            return acc;
        },
        {} as Record<string, { total: number; completed: number; percent: number }>
    );

    const totalItems = Object.values(state.formData.categories || {}).flat().length;
    const completedItems = Object.values(state.formData.categories || {})
        .flat()
        .filter(item => item.status !== 'pending')
        .length;
    const overallProgress = Math.round((completedItems / totalItems) * 100);

    return (
        <div className="space-y-6">
            {/* Form validation error */}
            {state.submitError && (
                <ErrorMessage message={state.submitError} />
            )}

            {/* Critical faults summary */}
            {state.formData.criticalFaults && state.formData.criticalFaults.length > 0 && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                    <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                        <h3 className="text-amber-800 font-medium">Critical Faults Detected</h3>
                    </div>
                    <ul className="mt-2 list-disc list-inside text-amber-700">
                        {state.formData.criticalFaults.slice(0, 5).map((fault, index) => (
                            <li key={index}>{fault.name} ({fault.criticality})</li>
                        ))}
                        {state.formData.criticalFaults.length > 5 && (
                            <li>...and {state.formData.criticalFaults.length - 5} more</li>
                        )}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Overall progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`h-2.5 rounded-full ${overallProgress < 30 ? 'bg-red-500' :
                                overallProgress < 70 ? 'bg-yellow-500' :
                                    'bg-green-500'
                            }`}
                        style={{ width: `${overallProgress}%` }}
                    ></div>
                </div>
                <div className="text-sm text-right text-gray-500">
                    {completedItems} of {totalItems} items completed ({overallProgress}%)
                </div>

                {/* Form header information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label="Inspection Name"
                        value={state.formData.name || ''}
                        onChange={(value) => handleChange('name', value)}
                        onBlur={() => handleBlur('name')}
                        placeholder="e.g., Monthly Check - 21H"
                        required
                        error={state.touched.name ? state.errors.name : undefined}
                    />
                    <Input
                        label="Date"
                        type="date"
                        value={state.formData.date || ''}
                        onChange={(value) => handleChange('date', value)}
                        onBlur={() => handleBlur('date')}
                        required
                        error={state.touched.date ? state.errors.date : undefined}
                    />
                    <Select
                        label="Inspector"
                        value={state.formData.inspector || ''}
                        onChange={(value) => handleChange('inspector', value)}
                        onBlur={() => handleBlur('inspector')}
                        options={[
                            { label: 'Select inspector...', value: '' },
                            ...INSPECTORS.map(i => ({ label: i, value: i }))
                        ]}
                        required
                        error={state.touched.inspector ? state.errors.inspector : undefined}
                    />
                    <Select
                        label="Fleet Number"
                        value={state.formData.fleetNumber || ''}
                        onChange={(value) => handleChange('fleetNumber', value)}
                        onBlur={() => handleBlur('fleetNumber')}
                        options={[
                            { label: 'Select fleet...', value: '' },
                            ...FLEET_NUMBERS.map(f => ({ label: f, value: f }))
                        ]}
                        required
                        error={state.touched.fleetNumber ? state.errors.fleetNumber : undefined}
                    />
                    <Select
                        label="Driver"
                        value={state.formData.driver || ''}
                        onChange={(value) => handleChange('driver', value)}
                        onBlur={() => handleBlur('driver')}
                        options={[
                            { label: 'Select driver...', value: '' },
                            ...DRIVERS.map(d => ({ label: d, value: d }))
                        ]}
                        required
                        error={state.touched.driver ? state.errors.driver : undefined}
                    />
                </div>

                {/* Category navigation */}
                <div className="border-b border-gray-200 mb-4">
                    <nav className="flex space-x-8">
                        {Object.entries(state.formData.categories || {}).map(([category, items]) => {
                            const progress = categoryProgress[category];
                            return (
                                <button
                                    key={category}
                                    type="button"
                                    className={`pb-4 px-1 border-b-2 font-medium text-sm ${state.activeCategory === category
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    onClick={() => handleCategoryChange(category)}
                                >
                                    <div className="flex items-center">
                                        <span className="capitalize">{category}</span>
                                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${progress.percent === 100
                                                ? 'bg-green-100 text-green-800'
                                                : progress.percent > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {progress.percent}%
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Category inspection items */}
                <div className="space-y-4">
                    {(state.formData.categories && state.formData.categories[state.activeCategory]) ? (
                        state.formData.categories[state.activeCategory].map((item, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className={`text-sm ${item.criticality === 'critical' ? 'text-red-600' :
                                                item.criticality === 'high' ? 'text-orange-600' :
                                                    item.criticality === 'medium' ? 'text-yellow-600' :
                                                        'text-green-600'
                                            }`}>
                                            {item.criticality.charAt(0).toUpperCase() + item.criticality.slice(1)} priority
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${item.status === 'pass'
                                                    ? 'bg-green-100 text-green-800 ring-1 ring-green-600'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-green-50'
                                                }`}
                                            onClick={() => handleItemStatusChange(state.activeCategory, index, 'pass')}
                                        >
                                            Pass
                                        </button>
                                        <button
                                            type="button"
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${item.status === 'fail'
                                                    ? 'bg-red-100 text-red-800 ring-1 ring-red-600'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-red-50'
                                                }`}
                                            onClick={() => handleItemStatusChange(state.activeCategory, index, 'fail')}
                                        >
                                            Fail
                                        </button>
                                        <button
                                            type="button"
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md ${item.status === 'na'
                                                    ? 'bg-gray-300 text-gray-800 ring-1 ring-gray-600'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                }`}
                                            onClick={() => handleItemStatusChange(state.activeCategory, index, 'na')}
                                        >
                                            N/A
                                        </button>
                                    </div>
                                </div>

                                {item.status === 'fail' && (
                                    <div className="mt-3">
                                        <TextArea
                                            label="Remarks"
                                            value={item.remarks || ''}
                                            onChange={(value) => handleItemRemarksChange(state.activeCategory, index, value)}
                                            placeholder="Describe the issue..."
                                            rows={2}
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No inspection items in this category.</p>
                    )}
                </div>

                {/* General remarks */}
                <TextArea
                    label="Overall Remarks"
                    value={state.formData.remarks || ''}
                    onChange={(value) => handleChange('remarks', value)}
                    placeholder="General comments about the inspection..."
                    rows={3}
                />

                {/* Action buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        icon={<X className="w-4 h-4" />}
                        disabled={state.isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={state.isSubmitting}
                        icon={<Save className="w-4 h-4" />}
                        isLoading={state.isSubmitting}
                    >
                        {inspection ? 'Update Inspection' : 'Complete Inspection'}
                    </Button>
                </div>
            </form>

            {/* Job Card Creation Modal */}
            {state.showJobCardModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Create Job Card</h2>
                        <p className="mb-4">
                            {state.formData.criticalFaults?.length} critical or high priority issues have been detected.
                            Would you like to create a job card to address these issues?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => dispatch({ type: 'TOGGLE_JOB_CARD_MODAL' })}
                            >
                                Skip
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCreateJobCard}
                                icon={<Plus className="w-4 h-4" />}
                            >
                                Create Job Card
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InspectionForm;