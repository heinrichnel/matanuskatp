import React, { useReducer, useEffect } from 'react';
import { JobCard as JobCardType, JobCardTask, JobCardPart, Inspection } from '../../types/workshop-tyre-inventory';
import { Input, Select, TextArea } from '../ui/FormElements';
import Button from '../ui/Button';
import { Save, X, Plus, Trash2, FileText } from 'lucide-react';
import ErrorMessage from '../ui/ErrorMessage';
import { getDocById } from '../../utils/firestoreWorkshopUtils';

// Mock data for dropdowns (would come from Firestore in production)
const TECHNICIANS = ['John Smith', 'Sarah Johnson', 'Robert Brown', 'Lisa Davis'];
const PARTS = [
    { id: 'P001', name: 'Brake Pads', cost: 250.00, inStock: true },
    { id: 'P002', name: 'Oil Filter', cost: 75.50, inStock: true },
    { id: 'P003', name: 'Air Filter', cost: 120.00, inStock: false },
    { id: 'P004', name: 'Spark Plugs', cost: 45.00, inStock: true },
    { id: 'P005', name: 'Timing Belt', cost: 350.00, inStock: true },
    { id: 'P006', name: 'Coolant', cost: 80.00, inStock: true },
    { id: 'P007', name: 'Brake Fluid', cost: 60.00, inStock: true },
    { id: 'P008', name: 'Tyre (215/55 R17)', cost: 800.00, inStock: false },
];

// Fleet specific constants
const FLEET_TYPES = {
    HORSE: ['21H', '22H', '23H', '24H', '26H', '28H', '31H', '32H'],
    INTERLINK: ['1T', '2T', '3T', '4T'],
    REEFER: ['4F', '5F', '6F', '7F', '8F'],
    LMV: ['14L', '15L'],
    SPECIALS: ['4H', '6H', 'UD', '30H', '29H']
};

// Tyre position mappings by fleet type
const TYRE_POSITIONS = {
    INTERLINK: Array.from({ length: 16 }, (_, i) => `T${i + 1}`).concat(['SP1', 'SP2']),
    REEFER: Array.from({ length: 6 }, (_, i) => `T${i + 1}`).concat(['SP']),
    HORSE: Array.from({ length: 10 }, (_, i) => `V${i + 1}`).concat(['SP']),
    LMV: Array.from({ length: 6 }, (_, i) => `V${i + 1}`).concat(['SP']),
    SPECIALS: Array.from({ length: 10 }, (_, i) => `POS${i + 1}`).concat(['SP'])
};

// Status and priority options
const JOB_STATUSES = [
    { label: 'Initiated', value: 'initiated' },
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Inspected', value: 'inspected' },
    { label: 'Approved', value: 'approved' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Parts Pending', value: 'parts_pending' },
    { label: 'Completed', value: 'completed' },
    { label: 'Invoiced', value: 'invoiced' },
    { label: 'Overdue', value: 'overdue' },
    { label: 'RCA Required', value: 'rca_required' },
    { label: 'RCA Completed', value: 'rca_completed' }
];

const PRIORITY_LEVELS = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Emergency', value: 'emergency' }
];

// Attachment types
const ATTACHMENT_TYPES = [
    { label: 'Quote', value: 'quote' },
    { label: 'Invoice', value: 'invoice' },
    { label: 'Report', value: 'report' },
    { label: 'Image', value: 'image' },
    { label: 'Other', value: 'other' }
];


interface JobCardProps {
    jobCard?: JobCardType;
    inspectionId?: string;
    fleetNumber?: string;
    onSubmit: (jobCardData: Omit<JobCardType, 'id'>) => Promise<void>;
    onCancel: () => void;
}

type FormState = {
    formData: Partial<JobCardType>;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    isSubmitting: boolean;
    submitError: string | null;
    linkedInspection: Inspection | null;
    isLoadingInspection: boolean;
    editMode: boolean;
    activeTab: string;
    fleetType: string | null;
    attachments: Array<{
        id: string;
        type: string;
        name: string;
        size: number;
        uploadDate: string;
        required: boolean;
        url: string;
    }>;
    rcaData: {
        rootCause: string;
        correctiveAction: string;
        technician: string;
        supervisorApproval: boolean;
        date: string;
    } | null;
    timeLog: Array<{
        id: string;
        action: string;
        user: string;
        timestamp: string;
        duration?: number;
        notes?: string;
    }>;
    poRequests: Array<{
        id: string;
        parts: Array<{
            itemId: string;
            name: string;
            quantity: number;
            cost: number;
        }>;
        status: 'draft' | 'submitted' | 'approved' | 'ordered' | 'received';
        supplier?: string;
        expectedDelivery?: string;
        createdAt: string;
        attachments?: string[];
    }>;
};

type FormAction =
    | { type: 'SET_FIELD'; field: keyof JobCardType; value: any }
    | { type: 'ADD_TASK' }
    | { type: 'UPDATE_TASK'; index: number; task: JobCardTask }
    | { type: 'REMOVE_TASK'; index: number }
    | { type: 'ADD_PART' }
    | { type: 'UPDATE_PART'; index: number; part: JobCardPart }
    | { type: 'REMOVE_PART'; index: number }
    | { type: 'ADD_LABOR' }
    | { type: 'UPDATE_LABOR'; index: number; labor: { technician: string; rate: number; time: number } }
    | { type: 'REMOVE_LABOR'; index: number }
    | { type: 'SET_TOUCHED'; field: keyof JobCardType }
    | { type: 'VALIDATE_FORM' }
    | { type: 'SUBMIT_START' }
    | { type: 'SUBMIT_SUCCESS' }
    | { type: 'SUBMIT_FAILURE'; error: string }
    | { type: 'SET_INSPECTION'; inspection: Inspection | null }
    | { type: 'SET_LOADING_INSPECTION'; isLoading: boolean }
    | { type: 'RESET_FORM'; payload: Partial<JobCardType> }
    | { type: 'TOGGLE_EDIT_MODE' }
    | { type: 'SET_ACTIVE_TAB'; tab: string }
    | { type: 'SET_FLEET_TYPE'; fleetType: string }
    | { type: 'ADD_ATTACHMENT'; attachment: any }
    | { type: 'UPDATE_ATTACHMENT'; index: number; attachment: any }
    | { type: 'REMOVE_ATTACHMENT'; index: number }
    | { type: 'SET_RCA_DATA'; data: any }
    | { type: 'UPDATE_RCA_FIELD'; field: string; value: any }
    | { type: 'ADD_TIME_LOG'; entry: any }
    | { type: 'ADD_PO_REQUEST'; request: any }
    | { type: 'UPDATE_PO_REQUEST'; index: number; request: any };

const getInitialState = (jobCard?: JobCardType, inspectionId?: string, fleetNumber?: string): FormState => {
    const now = new Date().toISOString().split('T')[0];

    // Determine fleet type from fleet number
    let fleetType = null;
    if (fleetNumber) {
        if (FLEET_TYPES.HORSE.includes(fleetNumber)) fleetType = 'HORSE';
        else if (FLEET_TYPES.INTERLINK.includes(fleetNumber)) fleetType = 'INTERLINK';
        else if (FLEET_TYPES.REEFER.includes(fleetNumber)) fleetType = 'REEFER';
        else if (FLEET_TYPES.LMV.includes(fleetNumber)) fleetType = 'LMV';
        else if (FLEET_TYPES.SPECIALS.includes(fleetNumber)) fleetType = 'SPECIALS';
    }

    const initialFormData: Partial<JobCardType> = {
        workOrderNumber: jobCard?.workOrderNumber || `WO${Math.floor(1000 + Math.random() * 9000)}`,
        inspectionId: jobCard?.inspectionId || inspectionId || '',
        fleetNumber: jobCard?.fleetNumber || fleetNumber || '',
        openDate: jobCard?.openDate || now,
        estimatedClose: jobCard?.estimatedClose || '',
        technician: jobCard?.technician || '',
        tasks: jobCard?.tasks || [],
        requiredParts: jobCard?.requiredParts || [],
        labor: jobCard?.labor || [],
        status: jobCard?.status || 'initiated',
        priority: jobCard?.priority || 'medium',
        beforeImages: jobCard?.beforeImages || [],
        afterImages: jobCard?.afterImages || [],
        odometer: jobCard?.odometer || 0,
        model: jobCard?.model || '',
        tyrePositions: jobCard?.tyrePositions || [],
        assignedTo: jobCard?.assignedTo || '',
        memo: jobCard?.memo || '',
        additionalCosts: jobCard?.additionalCosts || [],
        remarks: jobCard?.remarks || [],
    };

    return {
        formData: initialFormData,
        errors: {},
        touched: {},
        isSubmitting: false,
        submitError: null,
        linkedInspection: null,
        isLoadingInspection: false,
        editMode: jobCard ? false : true, // Edit mode on if creating new, view mode if editing existing
        activeTab: 'general',
        fleetType: fleetType,
        attachments: jobCard?.attachments || [],
        rcaData: jobCard?.rcaData || null,
        timeLog: jobCard?.timeLog || [{
            id: `tl${Date.now()}`,
            action: jobCard ? 'View' : 'Create',
            user: 'Current User',
            timestamp: new Date().toISOString(),
        }],
        poRequests: jobCard?.poRequests || [],
    };
};

const validate = (formData: Partial<JobCardType>): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!formData.fleetNumber) newErrors.fleetNumber = 'Fleet Number is required';
    if (!formData.openDate) newErrors.openDate = 'Open Date is required';
    if (!formData.technician) newErrors.technician = 'Technician is required';

    if (!formData.tasks || formData.tasks.length === 0) {
        newErrors.tasks = 'At least one task is required';
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
        case 'ADD_TASK': {
            const tasks = [...(state.formData.tasks || [])];
            tasks.push({
                description: '',
                status: 'created',
                notes: '',
            });
            return {
                ...state,
                formData: { ...state.formData, tasks },
                errors: { ...state.errors, tasks: '' },
            };
        }
        case 'UPDATE_TASK': {
            const tasks = [...(state.formData.tasks || [])];
            tasks[action.index] = action.task;
            return {
                ...state,
                formData: { ...state.formData, tasks },
                errors: { ...state.errors, tasks: '' },
            };
        }
        case 'REMOVE_TASK': {
            const tasks = [...(state.formData.tasks || [])];
            tasks.splice(action.index, 1);
            return {
                ...state,
                formData: { ...state.formData, tasks },
            };
        }
        case 'ADD_PART': {
            const requiredParts = [...(state.formData.requiredParts || [])];
            requiredParts.push({
                itemId: '',
                name: '',
                quantity: 1,
                cost: 0,
                inStock: false,
            });
            return {
                ...state,
                formData: { ...state.formData, requiredParts },
            };
        }
        case 'UPDATE_PART': {
            const requiredParts = [...(state.formData.requiredParts || [])];
            requiredParts[action.index] = action.part;
            return {
                ...state,
                formData: { ...state.formData, requiredParts },
            };
        }
        case 'REMOVE_PART': {
            const requiredParts = [...(state.formData.requiredParts || [])];
            requiredParts.splice(action.index, 1);
            return {
                ...state,
                formData: { ...state.formData, requiredParts },
            };
        }
        case 'ADD_LABOR': {
            const labor = [...(state.formData.labor || [])];
            labor.push({
                technician: '',
                rate: 0,
                time: 0,
            });
            return {
                ...state,
                formData: { ...state.formData, labor },
            };
        }
        case 'UPDATE_LABOR': {
            const labor = [...(state.formData.labor || [])];
            labor[action.index] = action.labor;
            return {
                ...state,
                formData: { ...state.formData, labor },
            };
        }
        case 'REMOVE_LABOR': {
            const labor = [...(state.formData.labor || [])];
            labor.splice(action.index, 1);
            return {
                ...state,
                formData: { ...state.formData, labor },
            };
        }
        case 'SET_TOUCHED':
            return { ...state, touched: { ...state.touched, [action.field]: true } };
        case 'SET_INSPECTION':
            return { ...state, linkedInspection: action.inspection };
        case 'SET_LOADING_INSPECTION':
            return { ...state, isLoadingInspection: action.isLoading };
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
            return { ...state, isSubmitting: false };
        case 'SUBMIT_FAILURE':
            return { ...state, isSubmitting: false, submitError: action.error };
        case 'RESET_FORM':
            return { ...getInitialState(), formData: action.payload };
        case 'TOGGLE_EDIT_MODE':
            // Add a time log entry when toggling edit mode
            const newTimeLog = [...state.timeLog];
            newTimeLog.push({
                id: `tl${Date.now()}`,
                action: state.editMode ? 'View' : 'Edit',
                user: 'Current User',
                timestamp: new Date().toISOString(),
            });

            return {
                ...state,
                editMode: !state.editMode,
                timeLog: newTimeLog
            };
        case 'SET_ACTIVE_TAB':
            return { ...state, activeTab: action.tab };
        case 'SET_FLEET_TYPE':
            // When fleet type changes, update tyre positions based on the selected type
            const tyrePositions = action.fleetType ?
                TYRE_POSITIONS[action.fleetType as keyof typeof TYRE_POSITIONS].map(pos => ({
                    position: pos,
                    tyreId: '',
                    status: 'good',
                    notes: ''
                })) : [];

            return {
                ...state,
                fleetType: action.fleetType,
                formData: {
                    ...state.formData,
                    tyrePositions
                }
            };
        case 'ADD_ATTACHMENT':
            return {
                ...state,
                attachments: [...state.attachments, action.attachment],
                // Add to time log
                timeLog: [...state.timeLog, {
                    id: `tl${Date.now()}`,
                    action: 'Add Attachment',
                    user: 'Current User',
                    timestamp: new Date().toISOString(),
                    notes: `Added ${action.attachment.name}`
                }]
            };
        case 'UPDATE_ATTACHMENT':
            const updatedAttachments = [...state.attachments];
            updatedAttachments[action.index] = action.attachment;
            return {
                ...state,
                attachments: updatedAttachments,
                // Add to time log
                timeLog: [...state.timeLog, {
                    id: `tl${Date.now()}`,
                    action: 'Update Attachment',
                    user: 'Current User',
                    timestamp: new Date().toISOString(),
                    notes: `Updated ${action.attachment.name}`
                }]
            };
        case 'REMOVE_ATTACHMENT':
            const removedAttachment = state.attachments[action.index];
            const attachmentsAfterRemoval = [...state.attachments];
            attachmentsAfterRemoval.splice(action.index, 1);
            return {
                ...state,
                attachments: attachmentsAfterRemoval,
                // Add to time log
                timeLog: [...state.timeLog, {
                    id: `tl${Date.now()}`,
                    action: 'Remove Attachment',
                    user: 'Current User',
                    timestamp: new Date().toISOString(),
                    notes: `Removed ${removedAttachment.name}`
                }]
            };
        case 'SET_RCA_DATA':
            return { ...state, rcaData: action.data };
        case 'UPDATE_RCA_FIELD':
            return {
                ...state,
                rcaData: {
                    rootCause: '',
                    correctiveAction: '',
                    technician: '',
                    supervisorApproval: false,
                    date: '',
                    ...state.rcaData,
                    [action.field]: action.value
                }
            };
        case 'ADD_TIME_LOG':
            return {
                ...state,
                timeLog: [...state.timeLog, action.entry]
            };
        case 'ADD_PO_REQUEST':
            return {
                ...state,
                poRequests: [...state.poRequests, action.request],
                // Add to time log
                timeLog: [...state.timeLog, {
                    id: `tl${Date.now()}`,
                    action: 'Create PO Request',
                    user: 'Current User',
                    timestamp: new Date().toISOString(),
                    notes: `PO created for out-of-stock parts`
                }]
            };
        case 'UPDATE_PO_REQUEST':
            const updatedPORequests = [...state.poRequests];
            updatedPORequests[action.index] = action.request;
            return {
                ...state,
                poRequests: updatedPORequests,
                // Add to time log
                timeLog: [...state.timeLog, {
                    id: `tl${Date.now()}`,
                    action: 'Update PO Request',
                    user: 'Current User',
                    timestamp: new Date().toISOString(),
                    notes: `Updated PO ${action.request.id}`
                }]
            };
        default:
            return state;
    }
};

// Helper to determine if we need to flag for RCA
const checkForRCAFlag = (_fleetNumber: string, _task: JobCardTask): boolean => {
    // In a real app, this would query Firestore for past work orders on this asset
    // For now, we'll randomly flag some tasks to demonstrate the feature
    return Math.random() < 0.2; // 20% chance of triggering RCA flag
};

// Helper to check if any parts are out of stock and need PO
const checkForOutOfStockParts = (requiredParts: JobCardPart[]): JobCardPart[] => {
    return requiredParts.filter(part => !part.inStock);
};

const JobCard: React.FC<JobCardProps> = ({
    jobCard,
    inspectionId,
    fleetNumber,
    onSubmit,
    onCancel
}) => {
    const [state, dispatch] = useReducer(formReducer, getInitialState(jobCard, inspectionId, fleetNumber));

    // Fetch linked inspection details if inspectionId is provided
    useEffect(() => {
        const fetchInspection = async () => {
            if (!state.formData.inspectionId) return;

            dispatch({ type: 'SET_LOADING_INSPECTION', isLoading: true });

            try {
                const inspection = await getDocById('inspections', state.formData.inspectionId);
                dispatch({ type: 'SET_INSPECTION', inspection: inspection as Inspection });
            } catch (error) {
                console.error('Error fetching inspection:', error);
            } finally {
                dispatch({ type: 'SET_LOADING_INSPECTION', isLoading: false });
            }
        };

        fetchInspection();
    }, [state.formData.inspectionId]);

    useEffect(() => {
        dispatch({ type: 'RESET_FORM', payload: getInitialState(jobCard, inspectionId, fleetNumber).formData });
    }, [jobCard, inspectionId, fleetNumber]);

    // Update fleet type when fleet number changes
    useEffect(() => {
        if (state.formData.fleetNumber) {
            let newFleetType = null;
            if (FLEET_TYPES.HORSE.includes(state.formData.fleetNumber)) newFleetType = 'HORSE';
            else if (FLEET_TYPES.INTERLINK.includes(state.formData.fleetNumber)) newFleetType = 'INTERLINK';
            else if (FLEET_TYPES.REEFER.includes(state.formData.fleetNumber)) newFleetType = 'REEFER';
            else if (FLEET_TYPES.LMV.includes(state.formData.fleetNumber)) newFleetType = 'LMV';
            else if (FLEET_TYPES.SPECIALS.includes(state.formData.fleetNumber)) newFleetType = 'SPECIALS';

            if (newFleetType !== state.fleetType) {
                dispatch({ type: 'SET_FLEET_TYPE', fleetType: newFleetType as string });
            }
        }
    }, [state.formData.fleetNumber]);

    // Check for RCA flag conditions
    useEffect(() => {
        if (state.formData.status === 'completed' && state.formData.tasks && state.formData.tasks.length > 0) {
            // Check each completed task for repeat maintenance within 3 months
            for (const task of state.formData.tasks) {
                if (task.status === 'completed' && checkForRCAFlag(state.formData.fleetNumber || '', task)) {
                    // Update status to require RCA
                    dispatch({ type: 'SET_FIELD', field: 'status', value: 'rca_required' });
                    break;
                }
            }
        }
    }, [state.formData.status, state.formData.tasks]);

    // Check for out-of-stock parts and create PO requests
    useEffect(() => {
        if (state.formData.requiredParts && state.formData.requiredParts.length > 0) {
            const outOfStockParts = checkForOutOfStockParts(state.formData.requiredParts);
            if (outOfStockParts.length > 0 && state.poRequests.length === 0) {
                // Create a new PO request for out-of-stock parts
                dispatch({
                    type: 'ADD_PO_REQUEST',
                    request: {
                        id: `PO${Math.floor(1000 + Math.random() * 9000)}`,
                        parts: outOfStockParts,
                        status: 'draft',
                        createdAt: new Date().toISOString()
                    }
                });
            }
        }
    }, [state.formData.requiredParts]);

    const handleChange = (field: keyof JobCardType, value: any) => {
        dispatch({ type: 'SET_FIELD', field, value });
    };

    const handleBlur = (field: keyof JobCardType) => {
        dispatch({ type: 'SET_TOUCHED', field });
        dispatch({ type: 'VALIDATE_FORM' });
    };

    const handleTaskChange = (index: number, field: keyof JobCardTask, value: any) => {
        const task = { ...state.formData.tasks![index], [field]: value };
        dispatch({ type: 'UPDATE_TASK', index, task });
    };

    const handlePartChange = (index: number, field: keyof JobCardPart, value: any) => {
        const part = { ...state.formData.requiredParts![index], [field]: value };

        // If a part is selected from the dropdown, populate its details
        if (field === 'itemId' && value) {
            const selectedPart = PARTS.find(p => p.id === value);
            if (selectedPart) {
                part.name = selectedPart.name;
                part.cost = selectedPart.cost;
                part.inStock = selectedPart.inStock;
            }
        }

        dispatch({ type: 'UPDATE_PART', index, part });
    };

    const handleLaborChange = (index: number, field: 'technician' | 'rate' | 'time', value: any) => {
        const labor = { ...state.formData.labor![index], [field]: value };
        dispatch({ type: 'UPDATE_LABOR', index, labor });
    };

    const handleToggleEditMode = () => {
        dispatch({ type: 'TOGGLE_EDIT_MODE' });
    };

    const handleTabChange = (tab: string) => {
        dispatch({ type: 'SET_ACTIVE_TAB', tab });
    };

    // File input reference for attachment uploads
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleAddAttachment = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const newAttachment = {
                id: `att${Date.now()}`,
                type: 'other', // Default, will be updated in modal
                name: file.name,
                size: file.size,
                uploadDate: new Date().toISOString(),
                required: false,
                url: URL.createObjectURL(file)
            };
            dispatch({ type: 'ADD_ATTACHMENT', attachment: newAttachment });
        }
    };

    const handleAttachmentTypeChange = (index: number, type: string) => {
        const attachment = { ...state.attachments[index], type };
        dispatch({ type: 'UPDATE_ATTACHMENT', index, attachment });
    };

    const handleAttachmentRequiredChange = (index: number, required: boolean) => {
        const attachment = { ...state.attachments[index], required };
        dispatch({ type: 'UPDATE_ATTACHMENT', index, attachment });
    };

    const handleRemoveAttachment = (index: number) => {
        dispatch({ type: 'REMOVE_ATTACHMENT', index });
    };

    const handleRCAFieldChange = (field: string, value: any) => {
        dispatch({ type: 'UPDATE_RCA_FIELD', field, value });
    };

    const generatePDF = () => {
        // In a real app, this would generate a PDF using a library like jsPDF
        console.log('Generating PDF for job card:', state.formData.workOrderNumber);
        // Add to time log
        dispatch({
            type: 'ADD_TIME_LOG',
            entry: {
                id: `tl${Date.now()}`,
                action: 'Generate PDF',
                user: 'Current User',
                timestamp: new Date().toISOString(),
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch({ type: 'SUBMIT_START' });

        const validationErrors = validate(state.formData);
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        // Check if we're in RCA Required status but RCA form is not completed
        if (state.formData.status === 'rca_required' &&
            (!state.rcaData || !state.rcaData.rootCause || !state.rcaData.correctiveAction)) {
            dispatch({
                type: 'SUBMIT_FAILURE',
                error: 'This job card requires RCA completion before it can be submitted.'
            });
            return;
        }

        // Check if all required attachments are present
        const requiredAttachmentsPresent = state.attachments.some(att => att.required);
        if (state.formData.status === 'completed' && !requiredAttachmentsPresent) {
            dispatch({
                type: 'SUBMIT_FAILURE',
                error: 'At least one required attachment must be added before completing this job card.'
            });
            return;
        }

        try {
            // Include attachments, RCA data, and time log in the submission
            const submissionData = {
                ...state.formData,
                attachments: state.attachments,
                rcaData: state.rcaData,
                timeLog: [
                    ...state.timeLog,
                    {
                        id: `tl${Date.now()}`,
                        action: jobCard ? 'Update' : 'Create',
                        user: 'Current User',
                        timestamp: new Date().toISOString(),
                    }
                ],
                poRequests: state.poRequests
            };

            await onSubmit(submissionData as Omit<JobCardType, 'id'>);
            dispatch({ type: 'SUBMIT_SUCCESS' });
        } catch (error) {
            console.error('Submission Failure:', error);
            const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred.';
            dispatch({
                type: 'SUBMIT_FAILURE',
                error: `Failed to save job card: ${errorMessage}. Please try again.`
            });
        }
    };

    // Calculate job card progress
    const taskProgress = {
        total: state.formData.tasks?.length || 0,
        completed: state.formData.tasks?.filter(task =>
            task.status === 'completed' || task.status === 'invoiced').length || 0,
    };

    const progressPercent = taskProgress.total > 0
        ? Math.round((taskProgress.completed / taskProgress.total) * 100)
        : 0;

    // Calculate totals
    const partsCost = state.formData.requiredParts?.reduce((sum: number, part) => sum + (part.cost * part.quantity), 0) || 0;
    const laborCost = state.formData.labor?.reduce((sum: number, item) => sum + (item.rate * item.time), 0) || 0;
    const additionalCost = state.formData.additionalCosts?.reduce((sum, item) => sum + item.cost, 0) || 0;
    const totalCost = partsCost + laborCost + additionalCost;

    // Render the RCA Form if needed
    const renderRCAForm = () => {
        if (state.formData.status !== 'rca_required') return null;

        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">Root Cause Analysis Required</h3>
                <p className="text-yellow-700 mb-4">
                    This job card requires a Root Cause Analysis before it can be completed.
                    Please complete the form below.
                </p>

                <div className="space-y-4">
                    <TextArea
                        label="Root Cause"
                        value={state.rcaData?.rootCause || ''}
                        onChange={(value) => handleRCAFieldChange('rootCause', value)}
                        placeholder="Identify the root cause of the issue"
                        rows={3}
                        disabled={!state.editMode}
                        required
                    />

                    <TextArea
                        label="Corrective Action"
                        value={state.rcaData?.correctiveAction || ''}
                        onChange={(value) => handleRCAFieldChange('correctiveAction', value)}
                        placeholder="Describe the corrective action taken"
                        rows={3}
                        disabled={!state.editMode}
                        required
                    />

                    <Select
                        label="Technician"
                        value={state.rcaData?.technician || ''}
                        onChange={(value) => handleRCAFieldChange('technician', value)}
                        options={[
                            { label: 'Select technician...', value: '' },
                            ...TECHNICIANS.map(t => ({ label: t, value: t }))
                        ]}
                        disabled={!state.editMode}
                        required
                    />

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="supervisorApproval"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            checked={state.rcaData?.supervisorApproval || false}
                            onChange={(e) => handleRCAFieldChange('supervisorApproval', e.target.checked)}
                            disabled={!state.editMode}
                        />
                        <label htmlFor="supervisorApproval" className="ml-2 text-sm text-gray-700">
                            Supervisor Approval
                        </label>
                    </div>

                    <Input
                        label="Date"
                        type="date"
                        value={state.rcaData?.date || ''}
                        onChange={(value) => handleRCAFieldChange('date', value)}
                        disabled={!state.editMode}
                        required
                    />
                </div>
            </div>
        );
    };

    // PO Requests section
    const renderPORequests = () => {
        if (state.poRequests.length === 0) return null;

        return (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Purchase Order Requests</h3>

                {state.poRequests.map((po, index) => (
                    <div key={po.id} className="border p-3 mb-3 rounded bg-white">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">PO #{po.id}</h4>
                            <span className="px-2 py-1 text-xs rounded capitalize bg-blue-100 text-blue-800">
                                {po.status}
                            </span>
                        </div>

                        <div className="text-sm mb-2">
                            <p><strong>Created:</strong> {new Date(po.createdAt).toLocaleDateString()}</p>
                            {po.supplier && <p><strong>Supplier:</strong> {po.supplier}</p>}
                            {po.expectedDelivery && <p><strong>Expected Delivery:</strong> {po.expectedDelivery}</p>}
                        </div>

                        <h5 className="font-medium text-sm mb-1">Parts:</h5>
                        <ul className="text-sm list-disc list-inside">
                            {po.parts.map((part, idx) => (
                                <li key={idx}>
                                    {part.name} - Qty: {part.quantity} - ${part.cost.toFixed(2)} each
                                </li>
                            ))}
                        </ul>

                        {state.editMode && (
                            <div className="mt-3 space-y-3">
                                <Select
                                    label="Status"
                                    value={po.status}
                                    onChange={(value) => {
                                        const updatedPO = { ...po, status: value };
                                        dispatch({ type: 'UPDATE_PO_REQUEST', index, request: updatedPO });
                                    }}
                                    options={[
                                        { label: 'Draft', value: 'draft' },
                                        { label: 'Submitted', value: 'submitted' },
                                        { label: 'Approved', value: 'approved' },
                                        { label: 'Ordered', value: 'ordered' },
                                        { label: 'Received', value: 'received' },
                                    ]}
                                />

                                <Input
                                    label="Supplier"
                                    value={po.supplier || ''}
                                    onChange={(value) => {
                                        const updatedPO = { ...po, supplier: value };
                                        dispatch({ type: 'UPDATE_PO_REQUEST', index, request: updatedPO });
                                    }}
                                    placeholder="Supplier name"
                                />

                                <Input
                                    label="Expected Delivery"
                                    type="date"
                                    value={po.expectedDelivery || ''}
                                    onChange={(value) => {
                                        const updatedPO = { ...po, expectedDelivery: value };
                                        dispatch({ type: 'UPDATE_PO_REQUEST', index, request: updatedPO });
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    // Tab content rendering
    const renderTabContent = () => {
        switch (state.activeTab) {
            case 'general':
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Select
                                label="Fleet Number"
                                value={state.formData.fleetNumber || ''}
                                onChange={(value) => handleChange('fleetNumber', value)}
                                onBlur={() => handleBlur('fleetNumber')}
                                options={[
                                    { label: 'Select fleet...', value: '' },
                                    ...Object.entries(FLEET_TYPES).flatMap(([type, numbers]) =>
                                        numbers.map(num => ({ label: `${num} (${type})`, value: num }))
                                    )
                                ]}
                                required
                                disabled={!state.editMode}
                                error={state.touched.fleetNumber ? state.errors.fleetNumber : undefined}
                            />
                            <Input
                                label="Vehicle Model"
                                value={state.formData.model || ''}
                                onChange={(value) => handleChange('model', value)}
                                placeholder="Vehicle model"
                                disabled={!state.editMode}
                            />
                            <Input
                                label="Odometer Reading"
                                type="number"
                                value={state.formData.odometer?.toString() || ''}
                                onChange={(value) => handleChange('odometer', parseInt(value) || 0)}
                                disabled={!state.editMode}
                            />
                            <Input
                                label="Open Date"
                                type="date"
                                value={state.formData.openDate || ''}
                                onChange={(value) => handleChange('openDate', value)}
                                onBlur={() => handleBlur('openDate')}
                                required
                                disabled={!state.editMode}
                                error={state.touched.openDate ? state.errors.openDate : undefined}
                            />
                            <Input
                                label="Estimated Completion Date"
                                type="date"
                                value={state.formData.estimatedClose || ''}
                                onChange={(value) => handleChange('estimatedClose', value)}
                                onBlur={() => handleBlur('estimatedClose')}
                                disabled={!state.editMode}
                                error={state.touched.estimatedClose ? state.errors.estimatedClose : undefined}
                            />
                            <Select
                                label="Assigned To"
                                value={state.formData.assignedTo || ''}
                                onChange={(value) => handleChange('assignedTo', value)}
                                options={[
                                    { label: 'Select worker...', value: '' },
                                    ...TECHNICIANS.map(t => ({ label: t, value: t }))
                                ]}
                                disabled={!state.editMode}
                            />
                            <Select
                                label="Technician"
                                value={state.formData.technician || ''}
                                onChange={(value) => handleChange('technician', value)}
                                onBlur={() => handleBlur('technician')}
                                options={[
                                    { label: 'Select technician...', value: '' },
                                    ...TECHNICIANS.map(t => ({ label: t, value: t }))
                                ]}
                                required
                                disabled={!state.editMode}
                                error={state.touched.technician ? state.errors.technician : undefined}
                            />
                            <Select
                                label="Status"
                                value={state.formData.status || 'initiated'}
                                onChange={(value) => handleChange('status', value)}
                                onBlur={() => handleBlur('status')}
                                options={JOB_STATUSES.map(s => ({ label: s.label, value: s.value }))}
                                required
                                disabled={!state.editMode || state.formData.status === 'rca_required'}
                            />
                            <Select
                                label="Priority"
                                value={state.formData.priority || 'medium'}
                                onChange={(value) => handleChange('priority', value)}
                                options={PRIORITY_LEVELS.map(p => ({ label: p.label, value: p.value }))}
                                disabled={!state.editMode}
                            />
                        </div>

                        <TextArea
                            label="Memo / Description"
                            value={state.formData.memo || ''}
                            onChange={(value) => handleChange('memo', value)}
                            placeholder="Work order description or memo"
                            rows={3}
                            disabled={!state.editMode}
                        />

                        {/* Display tyre positions if available */}
                        {state.formData.tyrePositions && state.formData.tyrePositions.length > 0 && (
                            <div className="mt-4">
                                <h3 className="text-lg font-medium mb-2">Tyre Positions</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                    {state.formData.tyrePositions.map((pos, idx) => (
                                        <div key={idx} className="border rounded p-2 text-sm">
                                            <div className="font-medium">{pos.position}</div>
                                            <div className="text-gray-600">
                                                {pos.tyreId ? pos.tyreId : 'No tyre assigned'}
                                            </div>
                                            <div className={`text-xs mt-1 rounded px-1 py-0.5 inline-block ${pos.status === 'good' ? 'bg-green-100 text-green-800' :
                                                pos.status === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                                                    pos.status === 'critical' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {pos.status.charAt(0).toUpperCase() + pos.status.slice(1)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                );

            case 'tasks':
                return (
                    <div className="space-y-4">
                        {state.editMode && (
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => dispatch({ type: 'ADD_TASK' })}
                                    icon={<Plus className="w-4 h-4" />}
                                    size="sm"
                                >
                                    Add Task
                                </Button>
                            </div>
                        )}

                        {state.errors.tasks && (
                            <ErrorMessage message={state.errors.tasks} />
                        )}

                        {(state.formData.tasks && state.formData.tasks.length > 0) ? (
                            state.formData.tasks.map((task, index) => (
                                <div key={index} className="border rounded p-3 bg-gray-50">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium">Task {index + 1}</h4>
                                        {state.editMode && (
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => dispatch({ type: 'REMOVE_TASK', index })}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-2 space-y-3">
                                        <Input
                                            label="Description"
                                            value={task.description}
                                            onChange={(value) => handleTaskChange(index, 'description', value)}
                                            placeholder="Task description"
                                            required
                                            disabled={!state.editMode}
                                        />
                                        <Select
                                            label="Status"
                                            value={task.status}
                                            onChange={(value) => handleTaskChange(index, 'status', value)}
                                            options={[
                                                { label: 'Created', value: 'created' },
                                                { label: 'Assigned', value: 'assigned' },
                                                { label: 'In Progress', value: 'in_progress' },
                                                { label: 'Parts Pending', value: 'parts_pending' },
                                                { label: 'Completed', value: 'completed' },
                                                { label: 'Invoiced', value: 'invoiced' },
                                            ]}
                                            disabled={!state.editMode}
                                        />
                                        <TextArea
                                            label="Notes"
                                            value={task.notes || ''}
                                            onChange={(value) => handleTaskChange(index, 'notes', value)}
                                            placeholder="Task notes or special instructions"
                                            rows={2}
                                            disabled={!state.editMode}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No tasks added yet. Add tasks using the button above.</p>
                        )}
                    </div>
                );

            case 'parts':
                return (
                    <div className="space-y-4">
                        {state.editMode && (
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => dispatch({ type: 'ADD_PART' })}
                                    icon={<Plus className="w-4 h-4" />}
                                    size="sm"
                                >
                                    Add Part
                                </Button>
                            </div>
                        )}

                        {(state.formData.requiredParts && state.formData.requiredParts.length > 0) ? (
                            state.formData.requiredParts.map((part, index) => (
                                <div key={index} className="border rounded p-3 bg-gray-50">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium">Part {index + 1}</h4>
                                        {state.editMode && (
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => dispatch({ type: 'REMOVE_PART', index })}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-2 space-y-3">
                                        <Select
                                            label="Part"
                                            value={part.itemId}
                                            onChange={(value) => handlePartChange(index, 'itemId', value)}
                                            options={[
                                                { label: 'Select part...', value: '' },
                                                ...PARTS.map(p => ({
                                                    label: `${p.name} (${p.inStock ? 'In Stock' : 'Out of Stock'}) - $${p.cost.toFixed(2)}`,
                                                    value: p.id
                                                }))
                                            ]}
                                            disabled={!state.editMode}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                label="Quantity"
                                                type="number"
                                                value={part.quantity.toString()}
                                                onChange={(value) => handlePartChange(index, 'quantity', parseInt(value) || 0)}
                                                min="1"
                                                required
                                                disabled={!state.editMode}
                                            />
                                            <Input
                                                label="Cost per Unit"
                                                type="number"
                                                value={part.cost.toString()}
                                                onChange={(value) => handlePartChange(index, 'cost', parseFloat(value) || 0)}
                                                min="0"
                                                step="0.01"
                                                required
                                                disabled={!state.editMode || !!part.itemId}
                                            />
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`inStock-${index}`}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                checked={part.inStock}
                                                onChange={(e) => handlePartChange(index, 'inStock', e.target.checked)}
                                                disabled={!state.editMode || !!part.itemId}
                                            />
                                            <label htmlFor={`inStock-${index}`} className="ml-2 text-sm text-gray-700">
                                                Part is in stock
                                            </label>
                                        </div>
                                        <div className="text-right text-sm font-medium">
                                            Subtotal: ${(part.quantity * part.cost).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No parts added yet. Add parts using the button above.</p>
                        )}

                        {state.formData.requiredParts && state.formData.requiredParts.length > 0 && (
                            <div className="mt-4 text-right">
                                <p className="font-medium">Total Parts Cost: ${state.formData.requiredParts?.reduce((sum: number, part) => sum + (part.cost * part.quantity), 0).toFixed(2) || '0.00'}</p>
                            </div>
                        )}
                    </div>
                );

            case 'labor':
                return (
                    <div className="space-y-4">
                        {state.editMode && (
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => dispatch({ type: 'ADD_LABOR' })}
                                    icon={<Plus className="w-4 h-4" />}
                                    size="sm"
                                >
                                    Add Labor
                                </Button>
                            </div>
                        )}

                        {(state.formData.labor && state.formData.labor.length > 0) ? (
                            state.formData.labor.map((labor, index) => (
                                <div key={index} className="border rounded p-3 bg-gray-50">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium">Labor Entry {index + 1}</h4>
                                        {state.editMode && (
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => dispatch({ type: 'REMOVE_LABOR', index })}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-2 space-y-3">
                                        <Select
                                            label="Technician"
                                            value={labor.technician}
                                            onChange={(value) => handleLaborChange(index, 'technician', value)}
                                            options={[
                                                { label: 'Select technician...', value: '' },
                                                ...TECHNICIANS.map(t => ({ label: t, value: t }))
                                            ]}
                                            disabled={!state.editMode}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                label="Rate per Hour"
                                                type="number"
                                                value={labor.rate.toString()}
                                                onChange={(value) => handleLaborChange(index, 'rate', parseFloat(value) || 0)}
                                                min="0"
                                                step="0.01"
                                                required
                                                disabled={!state.editMode}
                                            />
                                            <Input
                                                label="Hours"
                                                type="number"
                                                value={labor.time.toString()}
                                                onChange={(value) => handleLaborChange(index, 'time', parseFloat(value) || 0)}
                                                min="0"
                                                step="0.5"
                                                required
                                                disabled={!state.editMode}
                                            />
                                        </div>
                                        <div className="text-right text-sm font-medium">
                                            Subtotal: ${(labor.rate * labor.time).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No labor entries added yet. Add labor using the button above.</p>
                        )}

                        {state.formData.labor && state.formData.labor.length > 0 && (
                            <div className="mt-4 text-right">
                                <p className="font-medium">Total Labor Cost: ${state.formData.labor?.reduce((sum: number, item) => sum + (item.rate * item.time), 0).toFixed(2) || '0.00'}</p>
                            </div>
                        )}
                    </div>
                );

            case 'additional':
                return (
                    <div className="space-y-4">
                        {state.editMode && (
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const additionalCosts = [...(state.formData.additionalCosts || [])];
                                        additionalCosts.push({
                                            description: '',
                                            cost: 0,
                                            date: new Date().toISOString().split('T')[0]
                                        });
                                        handleChange('additionalCosts', additionalCosts);
                                    }}
                                    icon={<Plus className="w-4 h-4" />}
                                    size="sm"
                                >
                                    Add Cost
                                </Button>
                            </div>
                        )}

                        {(state.formData.additionalCosts && state.formData.additionalCosts.length > 0) ? (
                            state.formData.additionalCosts.map((cost, index) => (
                                <div key={index} className="border rounded p-3 bg-gray-50">
                                    <div className="flex justify-between">
                                        <h4 className="font-medium">Additional Cost {index + 1}</h4>
                                        {state.editMode && (
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => {
                                                    const additionalCosts = [...(state.formData.additionalCosts || [])];
                                                    additionalCosts.splice(index, 1);
                                                    handleChange('additionalCosts', additionalCosts);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-2 space-y-3">
                                        <Input
                                            label="Description"
                                            value={cost.description}
                                            onChange={(value) => {
                                                const additionalCosts = [...(state.formData.additionalCosts || [])];
                                                additionalCosts[index] = { ...cost, description: value };
                                                handleChange('additionalCosts', additionalCosts);
                                            }}
                                            placeholder="Cost description"
                                            required
                                            disabled={!state.editMode}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                label="Cost"
                                                type="number"
                                                value={cost.cost.toString()}
                                                onChange={(value) => {
                                                    const additionalCosts = [...(state.formData.additionalCosts || [])];
                                                    additionalCosts[index] = { ...cost, cost: parseFloat(value) || 0 };
                                                    handleChange('additionalCosts', additionalCosts);
                                                }}
                                                min="0"
                                                step="0.01"
                                                required
                                                disabled={!state.editMode}
                                            />
                                            <Input
                                                label="Date"
                                                type="date"
                                                value={cost.date}
                                                onChange={(value) => {
                                                    const additionalCosts = [...(state.formData.additionalCosts || [])];
                                                    additionalCosts[index] = { ...cost, date: value };
                                                    handleChange('additionalCosts', additionalCosts);
                                                }}
                                                required
                                                disabled={!state.editMode}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No additional costs added yet.</p>
                        )}

                        {state.formData.additionalCosts && state.formData.additionalCosts.length > 0 && (
                            <div className="mt-4 text-right">
                                <p className="font-medium">Total Additional Costs: ${additionalCost.toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                );

            case 'attachments':
                return (
                    <div className="space-y-4">
                        {state.editMode && (
                            <div className="flex justify-end">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddAttachment}
                                    icon={<Plus className="w-4 h-4" />}
                                    size="sm"
                                >
                                    Add Attachment
                                </Button>
                            </div>
                        )}

                        {state.attachments.length > 0 ? (
                            <div className="border rounded overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Size
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Required
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {state.attachments.map((attachment, index) => (
                                            <tr key={attachment.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {attachment.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {state.editMode ? (
                                                        <Select
                                                            label="Type"
                                                            value={attachment.type}
                                                            onChange={(value) => handleAttachmentTypeChange(index, value)}
                                                            options={ATTACHMENT_TYPES.map(t => ({ label: t.label, value: t.value }))}
                                                            className="text-sm"
                                                        />
                                                    ) : (
                                                        attachment.type.charAt(0).toUpperCase() + attachment.type.slice(1)
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {(attachment.size / 1024).toFixed(1)} KB
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(attachment.uploadDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {state.editMode ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={attachment.required}
                                                            onChange={(e) => handleAttachmentRequiredChange(index, e.target.checked)}
                                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                        />
                                                    ) : (
                                                        attachment.required ? 'Yes' : 'No'
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 mr-3">
                                                        Download
                                                    </a>
                                                    {state.editMode && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAttachment(index)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No attachments added yet.</p>
                        )}
                    </div>
                );

            case 'remarks':
                return (
                    <div className="space-y-4">
                        {state.editMode && (
                            <div className="flex justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const remarks = [...(state.formData.remarks || [])];
                                        remarks.push({
                                            remark: '',
                                            date: new Date().toISOString(),
                                            by: 'Current User'
                                        });
                                        handleChange('remarks', remarks);
                                    }}
                                    icon={<Plus className="w-4 h-4" />}
                                    size="sm"
                                >
                                    Add Remark
                                </Button>
                            </div>
                        )}

                        {(state.formData.remarks && state.formData.remarks.length > 0) ? (
                            state.formData.remarks.map((remark, index) => (
                                <div key={index} className="border rounded p-3 bg-gray-50">
                                    <div className="flex justify-between">
                                        <div>
                                            <span className="font-medium">{remark.by}</span>
                                            <span className="text-gray-500 text-sm ml-2">
                                                {new Date(remark.date).toLocaleDateString()} {new Date(remark.date).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        {state.editMode && (
                                            <button
                                                type="button"
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => {
                                                    const remarks = [...(state.formData.remarks || [])];
                                                    remarks.splice(index, 1);
                                                    handleChange('remarks', remarks);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        {state.editMode ? (
                                            <TextArea
                                                value={remark.remark}
                                                onChange={(value) => {
                                                    const remarks = [...(state.formData.remarks || [])];
                                                    remarks[index] = { ...remark, remark: value };
                                                    handleChange('remarks', remarks);
                                                }}
                                                placeholder="Enter remark"
                                                rows={2}
                                            />
                                        ) : (
                                            <p className="text-gray-700">{remark.remark}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No remarks added yet.</p>
                        )}
                    </div>
                );

            case 'timelog':
                return (
                    <div className="space-y-4">
                        <div className="border rounded overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Notes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {state.timeLog.map((log) => (
                                        <tr key={log.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {log.action}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {log.user}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {log.notes || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Form validation error */}
            {state.submitError && (
                <ErrorMessage message={state.submitError} />
            )}

            {/* Job Card Header */}
            <div className="bg-white border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-xl font-bold">{state.formData.workOrderNumber}</h2>
                    <div className="flex items-center space-x-4 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${state.formData.status === 'completed' || state.formData.status === 'invoiced' ? 'bg-green-100 text-green-800' :
                            state.formData.status === 'rca_required' ? 'bg-red-100 text-red-800' :
                                state.formData.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                    state.formData.status === 'in_progress' || state.formData.status === 'inspected' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                            }`}>
                            {state.formData.status?.replace('_', ' ') || 'initiated'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${state.formData.priority === 'low' ? 'bg-green-100 text-green-800' :
                            state.formData.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                state.formData.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                    state.formData.priority === 'emergency' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                            }`}>
                            {state.formData.priority}
                        </span>
                    </div>
                </div>
                <div className="flex space-x-2 mt-4 md:mt-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={generatePDF}
                        size="sm"
                    >
                        Download PDF
                    </Button>
                    <Button
                        type="button"
                        variant={state.editMode ? "outline" : "primary"}
                        onClick={handleToggleEditMode}
                        size="sm"
                    >
                        {state.editMode ? 'Cancel Edit' : 'Edit'}
                    </Button>
                </div>
            </div>

            {/* Progress and vehicle info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Vehicle Info</h3>
                    <div className="space-y-1">
                        <p><span className="font-medium">Fleet Number:</span> {state.formData.fleetNumber || 'Not specified'}</p>
                        <p><span className="font-medium">Model:</span> {state.formData.model || 'Not specified'}</p>
                        <p><span className="font-medium">Odometer:</span> {state.formData.odometer?.toLocaleString() || 'Not specified'}</p>
                    </div>
                </div>

                <div className="bg-white p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-lg font-medium">Job Progress</span>
                        <span className="text-sm font-medium">{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full ${progressPercent < 30 ? 'bg-red-500' :
                                progressPercent < 70 ? 'bg-yellow-500' :
                                    'bg-green-500'
                                }`}
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                        {taskProgress.completed} of {taskProgress.total} tasks completed
                    </div>

                    <div className="mt-2">
                        <p><span className="font-medium">Open Date:</span> {state.formData.openDate || 'Not specified'}</p>
                        <p><span className="font-medium">Due Date:</span> {state.formData.estimatedClose || 'Not specified'}</p>
                    </div>
                </div>
            </div>

            {/* Linked inspection details */}
            {state.formData.inspectionId && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                    <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <h3 className="text-blue-800 font-medium">Linked Inspection</h3>
                    </div>
                    {state.isLoadingInspection ? (
                        <p className="mt-2 text-blue-700">Loading inspection details...</p>
                    ) : state.linkedInspection ? (
                        <div className="mt-2 text-blue-700">
                            <p><strong>Inspection:</strong> {state.linkedInspection.name}</p>
                            <p><strong>Date:</strong> {state.linkedInspection.date}</p>
                            <p><strong>Inspector:</strong> {state.linkedInspection.inspector}</p>
                            {state.linkedInspection.criticalFaults && state.linkedInspection.criticalFaults.length > 0 && (
                                <div>
                                    <p className="font-medium mt-1">Critical Faults:</p>
                                    <ul className="list-disc list-inside">
                                        {state.linkedInspection.criticalFaults.slice(0, 3).map((fault, index) => (
                                            <li key={index}>{fault.name}</li>
                                        ))}
                                        {state.linkedInspection.criticalFaults.length > 3 && (
                                            <li>...and {state.linkedInspection.criticalFaults.length - 3} more</li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="mt-2 text-blue-700">Inspection ID: {state.formData.inspectionId} (details not found)</p>
                    )}
                </div>
            )}

            {/* RCA Form */}
            {renderRCAForm()}

            {/* PO Requests */}
            {renderPORequests()}

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6">
                    {[
                        { id: 'general', label: 'General' },
                        { id: 'tasks', label: 'Tasks' },
                        { id: 'parts', label: 'Parts' },
                        { id: 'labor', label: 'Labor' },
                        { id: 'additional', label: 'Additional Costs' },
                        { id: 'attachments', label: 'Attachments' },
                        { id: 'remarks', label: 'Remarks' },
                        { id: 'timelog', label: 'Time Log' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${state.activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            onClick={() => handleTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="py-4">
                {renderTabContent()}
            </div>

            {/* Cost Summary */}
            {((state.formData.requiredParts && state.formData.requiredParts.length > 0) ||
                (state.formData.labor && state.formData.labor.length > 0) ||
                additionalCost > 0) && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-2">Cost Summary</h3>
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <span>Parts & Materials:</span>
                                <span>${state.formData.requiredParts?.reduce((sum: number, part) => sum + (part.cost * part.quantity), 0).toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Labor:</span>
                                <span>${state.formData.labor?.reduce((sum: number, item) => sum + (item.rate * item.time), 0).toFixed(2) || '0.00'}</span>
                            </div>
                            {additionalCost > 0 && (
                                <div className="flex justify-between">
                                    <span>Additional Costs:</span>
                                    <span>${additionalCost.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="border-t pt-1 mt-1 flex justify-between font-medium">
                                <span>Total:</span>
                                <span>${totalCost.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

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
                {state.editMode && (
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={state.isSubmitting}
                        icon={<Save className="w-4 h-4" />}
                        isLoading={state.isSubmitting}
                    >
                        {jobCard ? 'Update Job Card' : 'Create Job Card'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default JobCard;