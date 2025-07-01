// Workshop Inspection Types
export interface InspectionCategoryItem {
    name: string;
    status: 'pass' | 'fail' | 'na' | 'pending';
    remarks?: string;
    criticality: 'low' | 'medium' | 'high' | 'critical';
}

export interface Inspection {
    id: string;
    name: string;
    date: string;
    inspector: string;
    fleetNumber: string;
    driver: string;
    timeStart: string;
    timeEnd: string;
    categories: Record<string, InspectionCategoryItem[]>;
    remarks?: string;
    criticalFaults: InspectionCategoryItem[];
    status: 'open' | 'closed';
}

// Job Card Types
export interface JobCardTask {
    description: string;
    status: 'created' | 'assigned' | 'in_progress' | 'parts_pending' | 'completed' | 'invoiced';
    notes?: string;
    technician?: string;
    hours?: number;
}

export interface JobCardPart {
    itemId: string;
    name: string;
    quantity: number;
    cost: number;
    inStock: boolean;
}

export interface JobCard {
    id: string;
    workOrderNumber: string;
    inspectionId: string;
    fleetNumber: string;
    openDate: string;
    estimatedClose: string;
    technician: string;
    tasks: JobCardTask[];
    requiredParts: JobCardPart[];
    labor: { technician: string; rate: number; time: number }[];
    status: 'initiated' | 'scheduled' | 'inspected' | 'approved' | 'created' | 'assigned' | 'in_progress' | 'parts_pending' | 'completed' | 'invoiced' | 'overdue' | 'rca_required' | 'rca_completed';
    priority: 'low' | 'medium' | 'high' | 'emergency';
    beforeImages?: string[];
    afterImages?: string[];
    odometer?: number;
    model?: string;
    tyrePositions?: Array<{
        position: string;
        tyreId: string;
        status: string;
        notes: string;
    }>;
    assignedTo?: string;
    memo?: string;
    additionalCosts?: Array<{
        description: string;
        cost: number;
        date: string;
    }>;
    remarks?: Array<{
        remark: string;
        date: string;
        by: string;
    }>;
    attachments?: Array<{
        id: string;
        type: string;
        name: string;
        size: number;
        uploadDate: string;
        required: boolean;
        url: string;
    }>;
    rcaData?: {
        rootCause: string;
        correctiveAction: string;
        technician: string;
        supervisorApproval: boolean;
        date: string;
    };
    timeLog?: Array<{
        id: string;
        action: string;
        user: string;
        timestamp: string;
        duration?: number;
        notes?: string;
    }>;
    poRequests?: Array<{
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
}

// Tyre Types
export interface TyreSize {
    width: number;       // e.g., 315
    aspectRatio: number; // e.g., 80
    rimDiameter: number; // e.g., 22.5
}

export interface TyreInspectionEntry {
    id: string;
    date: string;
    inspector: string;
    treadDepth: number;
    pressure: number;
    sidewallCondition: string;
    remarks?: string;
    photos?: string[];
    status: 'good' | 'worn' | 'urgent';
    timestamp: string;
}

export interface Tyre {
    id: string;
    serialNumber: string;
    dotCode: string;
    brand: string;
    model: string;
    pattern: string;
    size: string;  // Keep for backward compatibility
    tyreSize: TyreSize; // New structured size
    loadIndex: string;
    speedRating: string;
    type: 'steer' | 'drive' | 'trailer';
    purchaseDate: string;
    cost: number;
    supplier: string;
    warranty: string;
    installDetails: {
        vehicle: string;
        position: string;
        mileage: number;
        date: string;
    };
    treadDepth: number;
    pressure: number;
    status: 'good' | 'worn' | 'urgent';
    retread: boolean;
    // New fields
    manufacturerYear?: number;
    manufacturerWeek?: number;
    costPerKm?: number; // Calculated field: cost / estimated lifespan
    estimatedLifespan?: number; // In kilometers
    currentMileage?: number; // Current vehicle mileage
    remainingTread?: number; // Calculated field: initial tread - current tread
    inspectionHistory: TyreInspectionEntry[]; // History of all inspections
    lastInspectionDate?: string;
    axlePosition?: string; // Specific axle position
    mountStatus?: 'mounted' | 'dismounted' | 'in_stock' | 'scrapped';
}

// Inventory Types
export interface InventoryItem {
    id: string;
    description: string;
    category: string;
    quantity: number;
    unitCost: number;
    reorderLevel: number;
    supplier: string;
    lastOrderDate: string;
    vehicleCompatibility?: string[];
}
