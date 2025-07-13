# Fleet Selection Implementation Checklist

This checklist tracks the progress of implementing the centralized FleetSelector component across all forms in the application.

## Forms to Update

### Trip Management Forms

- [x] **TripForm.tsx** (Add New Trip)
  - [x] Created FleetSelector component
  - [x] Replaced existing fleet input with FleetSelector (already implemented)
  - [x] Added validation (already implemented)
  - [x] Tested in the UI (already implemented)

- [x] **TripForm.tsx** (Edit Trip)
  - [x] Replaced existing fleet input with FleetSelector (already implemented)
  - [x] Added validation (already implemented)
  - [x] Tested in the UI (already implemented)

- [ ] **LoadImportModal.tsx** (Import Trips)
  - [ ] Added validation of imported fleet numbers against master list
  - [ ] Tested with sample import file

### Diesel Management Forms

- [x] **ManualDieselEntryModal.tsx** (Add Fuel Entry)
  - [x] Created FleetSelector component
  - [x] Replaced existing fleet dropdown with FleetSelector (already implemented)
  - [x] Added proper filtering (Truck vs Reefer) (already implemented)
  - [x] Added validation (already implemented)
  - [x] Tested in the UI (already implemented)

- [x] **DieselDashboard.tsx** (Fuel Analytics)
  - [x] Updated filter dropdown to use FleetSelector
  - [x] Added proper filtering
  - [x] Implemented in the UI

### Workshop Management Forms

- ❓ **JobCard.tsx** (Job Card Creation)
  - No fleet selection form found in component
  - Component uses hardcoded vehicle IDs
  - No action taken

- [x] **InspectionForm.tsx** (Inspection Form)
  - [x] Replaced existing fleet dropdown with FleetSelector
  - [x] Added proper filtering
  - [x] Added validation
  - [x] Tested in the UI

- [x] **FaultTracker.tsx** (Report New Fault)
  - [x] Replaced existing fleet input with FleetSelector
  - [x] Added validation 
  - [x] Tested in the UI

### Tyre Management Forms

- [x] **TyrePerformanceForm.tsx** (Tyre Performance)
  - [x] Replaced existing fleet input with VehicleSelector
  - [x] Added proper filtering
  - [x] Added validation
  - [x] Tested in the UI

- [ ] **FaultManagement.tsx** (Fault Management)
  - [ ] Replaced existing fleet dropdown with FleetSelector
  - [ ] Added proper filtering (Truck, Trailer, Reefer)
  - [ ] Added validation
  - [ ] Tested in the UI

### Tyre Management Forms

- [ ] **TyreInspection.tsx** (Tyre Inspection)
  - [ ] Replaced existing fleet dropdown with FleetSelector
  - [ ] Added proper filtering (only Truck, Trailer)
  - [ ] Added validation
  - [ ] Tested in the UI

- [ ] **MoveTyreModal.tsx** (Tyre Assignment)
  - [ ] Replaced existing fleet dropdown with FleetSelector
  - [ ] Added validation against vehicle type
  - [ ] Added proper filtering
  - [ ] Tested in the UI

### Other Forms

- [ ] **DriverBehaviorEvents.tsx** (Driver Violations)
  - [ ] Replaced existing fleet dropdown with FleetSelector
  - [ ] Added validation
  - [ ] Tested in the UI

- [ ] **IncidentReportForm.tsx** (Incident Reports)
  - [ ] Replaced existing fleet dropdown with FleetSelector
  - [ ] Added validation
  - [ ] Tested in the UI

## Testing Checklist

For each updated form, verify:

- [ ] All fleet numbers appear in dropdown
- [ ] Registration numbers appear correctly
- [ ] Filtering works as expected
- [ ] Validation prevents invalid fleet numbers
- [ ] Form submission works correctly with selected fleet
- [ ] Pre-selection works if applicable

## Final Validation

- [ ] All forms use the FleetSelector component
- [ ] No hardcoded fleet numbers remain in the codebase
- [ ] All validation is consistent across forms
- [ ] User experience is consistent across all forms
