# Fleet Selection Component Implementation Guide

This document provides instructions for implementing the centralized FleetSelector component across all forms in the Matanuska Transport application. This will ensure that all fleet selection dropdowns are consistent, validated against a master fleet list, and provide proper filtering and pre-selection capabilities.

## Table of Contents
1. [Overview](#overview)
2. [FleetSelector Component](#fleetselector-component)
3. [Implementation Instructions](#implementation-instructions)
4. [Integration Examples](#integration-examples)
5. [Testing & Validation](#testing--validation)

## Overview

The application currently has multiple forms with fleet selection fields that are not properly populated with all available fleet numbers. To address this issue, we've created a centralized `FleetSelector` component that:

- Uses a consistent source of fleet data from the `useFleetList` hook
- Provides filtering by vehicle type (Truck, Trailer, Reefer)
- Includes validation against the master fleet list
- Supports pre-selection based on context
- Provides consistent styling and user experience

## FleetSelector Component

The component is located at: `/src/components/common/FleetSelector.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { useFleetList, FleetOption } from '@/hooks/useFleetList';

interface FleetSelectorProps {
  value: string;
  onChange: (fleetNo: string) => void;
  onBlur?: () => void;
  filterType?: 'Truck' | 'Trailer' | 'Reefer' | string[];
  className?: string;
  placeholder?: string;
  required?: boolean;
  label?: string;
  error?: string;
  includeDetails?: boolean;
  onlyActive?: boolean;
  name?: string;
  id?: string;
  disabled?: boolean;
  showRegistration?: boolean;
  autoFocus?: boolean;
}

const FleetSelector: React.FC<FleetSelectorProps> = ({
  value,
  onChange,
  onBlur,
  filterType,
  className = 'w-full px-4 py-2 border border-gray-300 rounded-md',
  placeholder = 'Select a vehicle',
  required = false,
  label,
  error,
  includeDetails = false,
  onlyActive = true,
  name = 'fleetNo',
  id,
  disabled = false,
  showRegistration = true,
  autoFocus = false,
}) => {
  const { fleetOptions, isValidFleetNumber } = useFleetList({ 
    filterType, 
    includeDetails,
    onlyActive
  });
  
  // ... rest of component implementation
};

export default FleetSelector;
```

## Implementation Instructions

To implement the FleetSelector component in a form:

1. **Import the component:**
   ```tsx
   import FleetSelector from '../common/FleetSelector';
   ```

2. **Replace existing fleet selection inputs or dropdowns:**

   **Before:**
   ```tsx
   <Select
     label="Fleet Number *"
     value={fleetNumber}
     onChange={e => setFleetNumber(e.target.value)}
     options={[
       { label: 'Select fleet...', value: '' },
       ...FLEET_NUMBERS.map(f => ({ label: f, value: f }))
     ]}
     error={errors.fleetNumber}
   />
   ```

   **After:**
   ```tsx
   <FleetSelector
     label="Fleet Number"
     value={fleetNumber}
     onChange={(value: string) => setFleetNumber(value)}
     required
     filterType="Truck" // Or 'Trailer', 'Reefer', or an array like ['Truck', 'Trailer']
     error={errors.fleetNumber}
     className="w-full px-3 py-2 border rounded-md"
   />
   ```

3. **Add type filtering based on context:**
   - For diesel entry forms: `filterType="Truck"`
   - For tyre inspection forms: `filterType={['Truck', 'Trailer']}`
   - For trip forms: `filterType={['Truck', 'Reefer', 'Trailer']}`

4. **Add validation checks:**
   ```tsx
   const { isValidFleetNumber } = useFleetList();
   
   // In your validation function
   if (!isValidFleetNumber(formData.fleetNumber)) {
     errors.fleetNumber = 'Please select a valid fleet number';
   }
   ```

## Integration Examples

### Trip Form Integration

```tsx
// In TripForm.tsx
<div className="col-span-1">
  <FleetSelector 
    label="Fleet Number"
    value={fleetNumber} 
    onChange={(value: string) => setFleetNumber(value)}
    required
    filterType={['Truck', 'Reefer', 'Trailer']} // Allow all vehicle types for trips
    className="w-full px-3 py-2 border rounded-md"
    error={errors.fleetNumber}
  />
</div>
```

### Diesel Entry Form Integration

```tsx
// In ManualDieselEntryModal.tsx
<FleetSelector
  label="Fleet Number"
  value={formData.fleetNumber}
  onChange={(value: string) => handleChange('fleetNumber', value)}
  required
  filterType={formData.isReeferUnit ? 'Reefer' : 'Truck'} // Filter by vehicle type
  error={errors.fleetNumber}
  className="w-full px-3 py-2 border rounded-md"
/>
```

### Tyre Inspection Form Integration

```tsx
// In TyreInspectionForm.tsx
<FleetSelector
  label="Vehicle"
  value={selectedVehicle}
  onChange={handleVehicleChange}
  required
  filterType={['Truck', 'Trailer']} // Only trucks and trailers have tyres
  className="w-full px-3 py-2 border rounded-md"
  error={vehicleError}
/>
```

## Testing & Validation

After implementing the FleetSelector component in a form, test the following:

1. **Dropdown Population:**
   - Verify that the dropdown shows all relevant fleet numbers based on the filter
   - Confirm that registration numbers are displayed correctly

2. **Validation:**
   - Try submitting the form without selecting a fleet number (should show error)
   - Try selecting a fleet number and then verify form submission works

3. **Filtering:**
   - If the form has context-specific filtering (like Reefer vs Truck), test that the appropriate options are shown

4. **Form Submission:**
   - Complete the form and submit it
   - Verify that the fleet number is correctly saved in the database

## List of Forms to Update

The following forms need to be updated to use the FleetSelector component:

1. Trip Management > Add New Trip (TripForm.tsx)
2. Trip Management > Edit Trip (TripForm.tsx)
3. Diesel Management > Add Fuel Entry (ManualDieselEntryModal.tsx)
4. Diesel Management > Fuel Analytics (DieselAnalysis.tsx - filters)
5. Workshop Management > Job Cards > Create Job Card (JobCard.tsx)
6. Workshop Management > Inspections > New Inspection (InspectionForm.tsx)
7. Workshop Management > Faults > Report Fault (FaultManagement.tsx)
8. Tyre Management > Tyre Inspection > New Inspection (TyreInspection.tsx)
9. Tyre Management > Tyre Inventory > Assign Tyre (MoveTyreModal.tsx)
10. Driver Management > Driver Violations (DriverBehaviorEvents.tsx)
11. Compliance & Safety > Incident Reports (IncidentReportForm.tsx)
