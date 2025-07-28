# Unused Exports Analysis

## Overview

This document summarizes the results of `ts-unused-exports` analysis on the Matanuska codebase. Unused exports are functions, classes, types, or values that are exported from a module but not imported or used elsewhere in the project. They represent potential dead code, incomplete features, or code that's intended for future use but currently bloating the codebase.

**Total modules with unused exports: 236**

## Why This Matters

- **Bundle Size**: Unused code may still be included in production bundles, increasing load times
- **Maintenance Burden**: Maintaining unused code wastes developer time
- **Code Clarity**: Removing unused exports makes the codebase more navigable and understandable
- **Technical Debt**: Large amounts of unused code indicate potential design issues or abandoned features

## Categories of Unused Exports

### 1. Core Application Files

| File | Unused Exports | Potential Impact |
|------|----------------|------------------|
| `/src/AppRoutes.tsx` | `default` | **CRITICAL**: If the default export of AppRoutes isn't used, your app's routing may not be functioning properly |
| `/src/firebaseConfig.ts` | `firebaseConfig` | **HIGH**: Firebase initialization may be broken if this config isn't being used |
| `/src/firebaseEmulators.ts` | `connectToEmulators`, `checkEmulatorsStatus` | **MEDIUM**: Local development with emulators may be affected |

### 2. API and Data Access

| File | Unused Exports | Potential Impact |
|------|----------------|------------------|
| `/src/api/firebaseAdmin.ts` | `db`, `admin`, `importInventoryItems`, etc. | **HIGH**: Server-side Firebase Admin functionality not being used |
| `/src/api/sageIntegration.ts` | `fetchInventoryFromSage`, `syncInventoryItemToSage`, etc. | **HIGH**: Sage integration features not implemented |
| `/src/api/googlemapsindex.ts` | `initMap`, `loadGoogleMapsScript` | **MEDIUM**: Maps functionality may be broken or duplicated elsewhere |

### 3. Data Models and Services

| File | Unused Exports | Potential Impact |
|------|----------------|------------------|
| `/src/components/Models/Diesel/DieselModel.ts` | `addDieselRecord`, `getAllDieselRecords`, etc. | **HIGH**: Diesel tracking functionality not being used |
| `/src/components/Models/Tyre/TyreModel.ts` | `TyreSize`, `TyreType`, `TyreService`, etc. | **HIGH**: Tyre management features not properly integrated |
| `/src/components/Models/Trips/TripModel.ts` | `Trip`, `addTripToFirebase`, etc. | **HIGH**: Trip management functionality may be incomplete |

### 4. Components

**UI Components:**

| File | Unused Exports | Potential Impact |
|------|----------------|------------------|
| `/src/components/ui/` directory | Multiple components like `Badge`, `Button`, `Calendar`, etc. | **MEDIUM**: Custom UI components not being used consistently |
| `/src/components/layout/AppLayout.tsx` | `default` | **MEDIUM**: Layout component not used, potential routing issues |

**Feature Components:**

| File | Unused Exports | Potential Impact |
|------|----------------|------------------|
| `/src/components/DieselManagement/` directory | Multiple components | **MEDIUM**: Diesel management UI not integrated |
| `/src/components/DriverManagement/` directory | Multiple components | **MEDIUM**: Driver management features not fully implemented |
| `/src/components/Map/wialon/` directory | Multiple components | **MEDIUM**: Wialon integration incomplete |

### 5. Hooks and Context

| File | Unused Exports | Potential Impact |
|------|----------------|------------------|
| `/src/hooks/` directory | Many custom hooks like `useIsMobile`, `useActionLogger`, etc. | **MEDIUM**: Custom hooks not being utilized |
| `/src/context/WialonProvider.tsx` | `WialonContext`, `WialonProvider`, `useWialon` | **MEDIUM**: Wialon context not properly integrated |

### 6. Utilities and Helpers

| File | Unused Exports | Potential Impact |
|------|----------------|------------------|
| `/src/utils/errorHandling.ts` | `createAppError`, `safeExecute`, etc. | **HIGH**: Error handling utilities not used, may impact app resilience |
| `/src/utils/` directory | Many utility functions | **MEDIUM**: Helper functions not utilized |

### 7. Types and Constants

| File | Unused Exports | Potential Impact |
|------|----------------|------------------|
| `/src/types/` directory | Many types and interfaces | **LOW**: Type definitions exist but aren't being used |
| `/src/data/` directory | Constants, mock data, reference data | **LOW**: Reference data not being utilized |

## Recommendations

### Immediate Action Items

1. **Fix AppRoutes integration**: Ensure that `App.tsx` correctly imports and uses the default export from `AppRoutes.tsx`. This is critical for application routing.

2. **Verify Firebase initialization**: Check that `firebaseConfig` is properly imported and used to initialize Firebase in your application.

3. **Review data models**: Examine why crucial data models like DieselModel, TyreModel, and TripModel aren't being used. Either:
   - Integrate them properly if these features should be active
   - Remove them if they represent abandoned features

### Medium-Term Cleanup

1. **Component consolidation**: Many UI components have unused exports. Consider:
   - Standardizing on a single component library
   - Removing duplicate implementations
   - Creating a proper component documentation system

2. **Hooks and context cleanup**: Review the unused hooks and context providers:
   - Integrate useful hooks into components
   - Remove redundant or outdated hooks
   - Ensure context providers are properly used

3. **Utility function assessment**: For each utility function:
   - Determine if it's still relevant to current needs
   - Remove obsolete utilities
   - Document and promote use of valuable utilities

### Long-Term Strategy

1. **Implement regular code audits**: Run `ts-unused-exports` periodically as part of CI/CD
2. **Improve developer documentation**: Ensure developers know which utilities and components to use
3. **Feature flagging**: Consider using feature flags for in-progress features rather than committing unused code
4. **Modularization**: Consider breaking the codebase into more focused packages with clearer boundaries

## Special Considerations

1. **Public API Exports**: Some exports might be part of a public API consumed outside the analyzed scope. Mark these with JSDoc comments to clarify intent.

2. **Dynamic Imports**: The tool may not detect dynamic imports or very indirect usage. Verify before deletion.

3. **Test Coverage**: Ensure you have adequate test coverage before removing code to catch undetected dependencies.

## Detailed Listing

<details>
<summary>Click to expand full list of unused exports</summary>

```
# Core Application Files
/workspaces/matanuskatp/src/AppRoutes.tsx: default
/workspaces/matanuskatp/src/firebaseConfig.ts: firebaseConfig
/workspaces/matanuskatp/src/firebaseEmulators.ts: connectToEmulators, checkEmulatorsStatus

# API and Data Access
/workspaces/matanuskatp/src/api/firebaseAdmin.ts: db, admin, importInventoryItems, getAllInventoryItems, getInventoryItemById, updateInventoryItem, deleteInventoryItem
/workspaces/matanuskatp/src/api/googlemapsindex.ts: initMap, loadGoogleMapsScript
/workspaces/matanuskatp/src/api/sageIntegration.ts: fetchInventoryFromSage, syncInventoryItemToSage, fetchInventoryItemFromSage, updateInventoryQuantity, deleteInventoryItem, updateInventoryInSage

# Assets
/workspaces/matanuskatp/src/assets/matanuska-logo-base64.ts: matanuskaLogoBase64

# Components - General
/workspaces/matanuskatp/src/components/DataLoader.tsx: default
/workspaces/matanuskatp/src/components/ErrorBoundary.tsx: withErrorBoundary
/workspaces/matanuskatp/src/components/FleetList.tsx: FleetList, default
/workspaces/matanuskatp/src/components/GeofenceModal.tsx: GeofenceModal, default
/workspaces/matanuskatp/src/components/LazyComponent.tsx: createLazyComponent, default
/workspaces/matanuskatp/src/components/LiveUpdater.tsx: LiveUpdater, default
/workspaces/matanuskatp/src/components/TyreInspectionPDFGenerator.tsx: TyreInspectionPDFGenerator

# Components - Admin Management
/workspaces/matanuskatp/src/components/Adminmangement/ActionLog.tsx: default

# Components - Cost Management
/workspaces/matanuskatp/src/components/Cost Management/IndirectCostBreakdown.tsx: default

# Components - Diesel Management
/workspaces/matanuskatp/src/components/DieselManagement/DieselDashboardComponent.tsx: default
/workspaces/matanuskatp/src/components/DieselManagement/FuelLogs.tsx: default
/workspaces/matanuskatp/src/components/DieselManagement/FuelTheftDetection.tsx: default

# Components - Driver Management
/workspaces/matanuskatp/src/components/DriverManagement/DriverFuelBehavior.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/DriverRewards.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/DriverScheduling.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/DriverViolations.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/HoursOfService.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/LicenseManagement.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/SafetyScores.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/TrainingRecords.tsx: default

# Components - Inventory Management
/workspaces/matanuskatp/src/components/Inventory Management/receive-parts.tsx: default

# Components - Invoice Management
/workspaces/matanuskatp/src/components/InvoiceManagement/InvoiceApprovalFlow.tsx: default
/workspaces/matanuskatp/src/components/InvoiceManagement/InvoiceTemplates.tsx: default
/workspaces/matanuskatp/src/components/InvoiceManagement/StockManager.tsx: default
/workspaces/matanuskatp/src/components/InvoiceManagement/TaxReportExport.tsx: default

# Components - Map and Wialon Integration
/workspaces/matanuskatp/src/components/Map/WialonMapComponent.tsx: default
/workspaces/matanuskatp/src/components/Map/pages/Maps.tsx: default
/workspaces/matanuskatp/src/components/Map/wialon/WialonConfigDisplay.tsx: default
/workspaces/matanuskatp/src/components/Map/wialon/WialonConfigPage.tsx: default
/workspaces/matanuskatp/src/components/Map/wialon/WialonDashboard.tsx: default
/workspaces/matanuskatp/src/components/Map/wialon/WialonDriverManager.tsx: WialonDriverManager
/workspaces/matanuskatp/src/components/Map/wialon/WialonGeofenceManager.tsx: WialonGeofenceManager, default
/workspaces/matanuskatp/src/components/Map/wialon/WialonLoginPanel.tsx: WialonLoginPanel, default
/workspaces/matanuskatp/src/components/Map/wialon/WialonMapComponent.tsx: default
/workspaces/matanuskatp/src/components/Map/wialon/WialonMapDashboard.tsx: default
/workspaces/matanuskatp/src/components/Map/wialon/WialonMapPage.tsx: default
/workspaces/matanuskatp/src/components/Map/wialon/WialonUnitList.tsx: WialonUnitList, default
/workspaces/matanuskatp/src/components/Map/wialon/WialonUnitsPage.tsx: default
/workspaces/matanuskatp/src/components/Map/wialon/models/WialonLoginModal.tsx: default

# Components - Models
/workspaces/matanuskatp/src/components/Models/GeofenceModal.tsx: GeofenceModal, default
/workspaces/matanuskatp/src/components/Models/Diesel/AutomaticProbeVerificationModal.tsx: default
/workspaces/matanuskatp/src/components/Models/Diesel/DieselDebriefModal.tsx: default
/workspaces/matanuskatp/src/components/Models/Diesel/DieselModel.ts: addDieselRecord, getAllDieselRecords, getDieselRecordsForVehicle, updateDieselRecord, deleteDieselRecord, getDieselRecordById, getDieselRecordsForDateRange, linkDieselToTrip, getAllDieselNorms, upsertDieselNorm, deleteDieselNorm, calculateDieselStats
/workspaces/matanuskatp/src/components/Models/Invoice/InvoiceFollowUpModal.tsx: default
/workspaces/matanuskatp/src/components/Models/Invoice/InvoiceGenerationModal.tsx: default
/workspaces/matanuskatp/src/components/Models/Invoice/InvoiceSubmissionModal.tsx: default
/workspaces/matanuskatp/src/components/Models/Invoice/PaymentUpdateModal.tsx: default
/workspaces/matanuskatp/src/components/Models/Trips/FleetFormModal.tsx: default
/workspaces/matanuskatp/src/components/Models/Trips/LoadImportModal.tsx: default
/workspaces/matanuskatp/src/components/Models/Trips/TripDeletionModal.tsx: default
/workspaces/matanuskatp/src/components/Models/Trips/TripModel.ts: Trip, addTripToFirebase, updateTripInFirebase, deleteTripFromFirebase, TripService
/workspaces/matanuskatp/src/components/Models/Trips/TripStatusUpdateModal.tsx: default, Trip
/workspaces/matanuskatp/src/components/Models/Tyre/MoveTyreModal.tsx: MoveTyreModal
/workspaces/matanuskatp/src/components/Models/Tyre/TyreFirestoreConverter.ts: tyreConverter
/workspaces/matanuskatp/src/components/Models/Tyre/TyreInspectionModal.tsx: default
/workspaces/matanuskatp/src/components/Models/Tyre/TyreModel.ts: TyreSize, TyreType, TyrePosition, PurchaseDetails, Installation, TyreCondition, TyreRotation, TyreRepair, TyreInspection, MaintenanceHistory, TyreStoreLocation, TyreStore, StockEntry, TyreStatus, TyreMountStatus, tyreConverter, addTyreInspection, addTyreStore, deleteTyre, getTyreById, getTyreInspections, getTyreStats, getTyres, getTyresByVehicle, listenToTyreStores, listenToTyres, moveTyreStoreEntry, saveTyre, updateTyreStoreEntry, RankedTyre, TyreStat, filterTyresByPerformance, getBestTyres, getTyreBrandPerformance, getTyrePerformanceStats, formatTyreSize, parseTyreSize, TyreService
/workspaces/matanuskatp/src/components/Models/Workshop/JobCardDetailModal.tsx: JobCardDetail, JobCardDetailModal, default
/workspaces/matanuskatp/src/components/Models/Workshop/MaintenanceModule.tsx: default
/workspaces/matanuskatp/src/components/Models/Workshop/PurchaseOrderModal.tsx: POItem, PurchaseOrder, PurchaseOrderModal
/workspaces/matanuskatp/src/components/Models/Workshop/RCAModal.tsx: default
/workspaces/matanuskatp/src/components/Models/Workshop/TaskManager.tsx: default

# Components - Trip Management
/workspaces/matanuskatp/src/components/TripManagement/Calendar.tsx: default
/workspaces/matanuskatp/src/components/TripManagement/EditDriver.tsx: default
/workspaces/matanuskatp/src/components/TripManagement/LoadPlanningPage.tsx: default
/workspaces/matanuskatp/src/components/TripManagement/LoadingIndicator.tsx: default
/workspaces/matanuskatp/src/components/TripManagement/RouteOptimization.tsx: default
/workspaces/matanuskatp/src/components/TripManagement/RouteOptimizationPage.tsx: default
/workspaces/matanuskatp/src/components/TripManagement/RoutePlanningPage.tsx: default
/workspaces/matanuskatp/src/components/TripManagement/TripCalendarPage.tsx: default
/workspaces/matanuskatp/src/components/TripManagement/TripDetails.tsx: default
/workspaces/matanuskatp/src/components/TripManagement/TripFinancialsPanel.tsx: default
/workspaces/matanuskatp/src/components/TripManagement/TripRouter.tsx: default
/workspaces/matanuskatp/src/components/TripManagement/TripTimelineLive.tsx: default

# Components - Tyre Management
/workspaces/matanuskatp/src/components/Tyremanagement/TyreInspection.tsx: TyreConditionStatus, TyreInspectionData, TyreInspectionForm, default
/workspaces/matanuskatp/src/components/Tyremanagement/TyreInspectionModal.tsx: TyreInspectionData
/workspaces/matanuskatp/src/components/Tyremanagement/TyreInventory.tsx: TyreInventory
/workspaces/matanuskatp/src/components/Tyremanagement/TyreInventoryDashboard.tsx: default
/workspaces/matanuskatp/src/components/Tyremanagement/TyreInventoryManager.tsx: default
/workspaces/matanuskatp/src/components/Tyremanagement/TyreInventoryStats.tsx: default
/workspaces/matanuskatp/src/components/Tyremanagement/TyreManagementSystem.tsx: TyreManagementSystem
/workspaces/matanuskatp/src/components/Tyremanagement/TyreManagementView.tsx: default
/workspaces/matanuskatp/src/components/Tyremanagement/TyrePerformanceForm.tsx: default
/workspaces/matanuskatp/src/components/Tyremanagement/TyreReports.tsx: default

# Components - Workshop Management
/workspaces/matanuskatp/src/components/WorkshopManagement/EnhancedTyreInspectionForm.tsx: default
/workspaces/matanuskatp/src/components/WorkshopManagement/FaultTracker.tsx: default
/workspaces/matanuskatp/src/components/WorkshopManagement/FleetTable.tsx: default
/workspaces/matanuskatp/src/components/WorkshopManagement/InspectionHistory.tsx: default
/workspaces/matanuskatp/src/components/WorkshopManagement/PurchaseOrderForm.tsx: PurchaseOrderItem
/workspaces/matanuskatp/src/components/WorkshopManagement/PurchaseOrderSync.tsx: default
/workspaces/matanuskatp/src/components/WorkshopManagement/QRCodeBatchGenerator.tsx: QRCodeBatchGenerator, default
/workspaces/matanuskatp/src/components/WorkshopManagement/QRGenerator.tsx: default
/workspaces/matanuskatp/src/components/WorkshopManagement/receive-parts.tsx: default
/workspaces/matanuskatp/src/components/WorkshopManagement/request-parts.tsx: default

# Components - Common
/workspaces/matanuskatp/src/components/common/FleetDropdown.tsx: FleetDropdown, default
/workspaces/matanuskatp/src/components/common/VehicleSelector.tsx: VehicleSelectorProps

# Components - Forms
/workspaces/matanuskatp/src/components/forms/AddFuelEntry.tsx: default
/workspaces/matanuskatp/src/components/forms/AddNewDriver.tsx: default
/workspaces/matanuskatp/src/components/forms/AdditionalCostsForm.tsx: default
/workspaces/matanuskatp/src/components/forms/ClientForm.tsx: default
/workspaces/matanuskatp/src/components/forms/CostForm.tsx: default
/workspaces/matanuskatp/src/components/forms/CreateInvoice.tsx: default
/workspaces/matanuskatp/src/components/forms/DriverInspectionForm.tsx: default
/workspaces/matanuskatp/src/components/forms/EditDriver.tsx: default
/workspaces/matanuskatp/src/components/forms/FleetSelectionForm.tsx: FleetSelectionData
/workspaces/matanuskatp/src/components/forms/InspectionForm.tsx: default
/workspaces/matanuskatp/src/components/forms/InspectionReportForm.tsx: InspectionItem, InspectionReport
/workspaces/matanuskatp/src/components/forms/InventorySelectionForm.tsx: InventorySelectionData
/workspaces/matanuskatp/src/components/forms/RouteSelectionForm.tsx: RouteSelectionData
/workspaces/matanuskatp/src/components/forms/TripForm2.tsx: default
/workspaces/matanuskatp/src/components/forms/TripPlanningForm.tsx: default
/workspaces/matanuskatp/src/components/forms/TyreSelectionForm.tsx: TyreSelectionData

# Components - Layout
/workspaces/matanuskatp/src/components/layout/AppLayout.tsx: default

# Components - Lists
/workspaces/matanuskatp/src/components/lists/WebBookTripsList.tsx: default

# Components - Testing
/workspaces/matanuskatp/src/components/testing/GoogleMapsTest.tsx: default
/workspaces/matanuskatp/src/components/testing/UIConnector.tsx: UIConnector, default

# Components - UI
/workspaces/matanuskatp/src/components/ui/AntDesignProvider.tsx: AntDesignProvider
/workspaces/matanuskatp/src/components/ui/AntDesignWrapper.tsx: AntD, AntDesign, default
/workspaces/matanuskatp/src/components/ui/Button.tsx: ButtonProps
/workspaces/matanuskatp/src/components/ui/Calendar.tsx: default
/workspaces/matanuskatp/src/components/ui/CardHeader.tsx: default
/workspaces/matanuskatp/src/components/ui/FormElements.tsx: default
/workspaces/matanuskatp/src/components/ui/InspectionFormPDS.tsx: InspectionFormPDS
/workspaces/matanuskatp/src/components/ui/JobCardTable.tsx: JobCardTableRow
/workspaces/matanuskatp/src/components/ui/Modal.tsx: ModalProps
/workspaces/matanuskatp/src/components/ui/Select.tsx: default
/workspaces/matanuskatp/src/components/ui/Templates.tsx: default
/workspaces/matanuskatp/src/components/ui/UIComponentsDemo.tsx: default
/workspaces/matanuskatp/src/components/ui/UIConnector.tsx: default
/workspaces/matanuskatp/src/components/ui/UnitsTable.tsx: default
/workspaces/matanuskatp/src/components/ui/User.tsx: default
/workspaces/matanuskatp/src/components/ui/badge.tsx: BadgeProps, default
/workspaces/matanuskatp/src/components/ui/button.tsx: ButtonProps, DefaultButton
/workspaces/matanuskatp/src/components/ui/form.tsx: FormFieldProps, FormField, FormItem, FormLabel, FormControl, FormMessage, default
/workspaces/matanuskatp/src/components/ui/index.ts: GenericPlaceholderPage
/workspaces/matanuskatp/src/components/ui/input.tsx: InputProps, Input
/workspaces/matanuskatp/src/components/ui/label.tsx: Label
/workspaces/matanuskatp/src/components/ui/modal.tsx: Modal
/workspaces/matanuskatp/src/components/ui/new-job-card.tsx: default

# Config
/workspaces/matanuskatp/src/config/capacitor.config.ts: default
/workspaces/matanuskatp/src/config/cloudRunEndpoints.ts: MAPS_SERVICE_URL, CLOUD_RUN_ENDPOINTS, getBestCloudRunEndpoint, getAllCloudRunEndpoints
/workspaces/matanuskatp/src/config/routeIntegration.ts: validateRouteToComponent, findDuplicateRoutes, analyzeFunctionalCoverage, generateIntegrationReport
/workspaces/matanuskatp/src/config/routeUtils.ts: getSidebarItemsBySection, generateRoutesFromSidebar, findSidebarItemByPath, getBreadcrumbsFromPath
/workspaces/matanuskatp/src/config/tripWorkflowConfig.ts: WorkflowStep, TripWorkflowConfig, getWorkflowStep, getNextStep, getPreviousStep

# Context
/workspaces/matanuskatp/src/context/DriverBehaviorContext.tsx: DriverBehaviorEvent
/workspaces/matanuskatp/src/context/InventoryContext.tsx: useInventory, InventoryProvider
/workspaces/matanuskatp/src/context/SyncContext.tsx: useTripSync
/workspaces/matanuskatp/src/context/TripContext.tsx: Trip, useTrips
/workspaces/matanuskatp/src/context/WialonContext.tsx: WialonUnit, WialonContextType
/workspaces/matanuskatp/src/context/WialonProvider.tsx: WialonContext, WialonProvider, useWialon
/workspaces/matanuskatp/src/context/WorkshopContext.tsx: PurchaseOrderItem, PurchaseOrder

# Data
/workspaces/matanuskatp/src/data/PrivacyPolicy.tsx: default
/workspaces/matanuskatp/src/data/faultData.ts: FaultCategory, FaultSubcategory, FaultSeverity, FaultStatus, Fault, faultCategories, findSubcategory, findCategory, default
/workspaces/matanuskatp/src/data/index.ts: (many exports)
/workspaces/matanuskatp/src/data/jobCardTemplates.ts: JobCardTaskItem, JobCardTemplate, ServiceInterval, service15k, service50k, brakeRepair, jobCardTemplates, serviceIntervals, default
/workspaces/matanuskatp/src/data/userDirectory.ts: USER_DIRECTORY, getUserById, getUsersByRole, getTechnicians, getOperators

# Firebase
/workspaces/matanuskatp/src/firebase/tyreStores.ts: default
/workspaces/matanuskatp/src/firebase/tyres.ts: default

# Hooks
/workspaces/matanuskatp/src/hooks/WialonUnitList.tsx: WialonUnitList
/workspaces/matanuskatp/src/hooks/use-mobile.tsx: useIsMobile
/workspaces/matanuskatp/src/hooks/useActionLogger.ts: useActionLogger
/workspaces/matanuskatp/src/hooks/useClients.ts: useClient
/workspaces/matanuskatp/src/hooks/useCurrencyConverter.ts: useCurrencyConverter
/workspaces/matanuskatp/src/hooks/useFirestoreDoc.ts: useFirestoreDoc
/workspaces/matanuskatp/src/hooks/useFleetData.ts: default
/workspaces/matanuskatp/src/hooks/useOfflineForm.ts: default
/workspaces/matanuskatp/src/hooks/useOfflineQuery.ts: useOfflineQuery, default
/workspaces/matanuskatp/src/hooks/useToast.ts: Toast, ToastContextType
/workspaces/matanuskatp/src/hooks/useTyres.ts: Tyre
/workspaces/matanuskatp/src/hooks/useWebBookDriverBehavior.ts: WebBookDriverBehavior, useWebBookDriverBehavior
/workspaces/matanuskatp/src/hooks/useWialon.ts: WialonUnit, useWialonUnits
/workspaces/matanuskatp/src/hooks/useWialonConnection.ts: useWialonConnection
/workspaces/matanuskatp/src/hooks/useWialonDrivers.ts: useWialonDrivers
/workspaces/matanuskatp/src/hooks/useWialonGeofences.ts: useWialonGeofences
/workspaces/matanuskatp/src/hooks/useWialonResources.ts: useWialonResources
/workspaces/matanuskatp/src/hooks/useWialonSession.ts: useWialonSession

# Library
/workspaces/matanuskatp/src/lib/currency.ts: currencySymbols

# Pages
/workspaces/matanuskatp/src/pages/AddFuelEntryPage.tsx: default
/workspaces/matanuskatp/src/pages/POApprovalSummary.tsx: POApprovalSummary
/workspaces/matanuskatp/src/pages/PaidInvoices.tsx: default
/workspaces/matanuskatp/src/pages/PendingInvoices.tsx: default
/workspaces/matanuskatp/src/pages/VehicleTyreViewA.tsx: VehicleTyreView
/workspaces/matanuskatp/src/pages/WorkOrderManagement.tsx: WorkOrderManagement
/workspaces/matanuskatp/src/pages/drivers/DriverDetails.tsx: default
/workspaces/matanuskatp/src/pages/drivers/DriverFuelBehavior.tsx: default
/workspaces/matanuskatp/src/pages/examples/ClientSelectionExample.jsx: default
/workspaces/matanuskatp/src/pages/trips/CreateLoadConfirmationPage.tsx: default

# Types
/workspaces/matanuskatp/src/types/client.ts: createNewClient, addClientRelationship
/workspaces/matanuskatp/src/types/index.ts: (many exports)
/workspaces/matanuskatp/src/types/inventory.ts: VendorScore, PurchaseOrderRequest, RequestItem, POApproval, IntegrationSettings, SyncLog
/workspaces/matanuskatp/src/types/invoice.ts: InvoiceData, FollowUpRecord, InvoiceAging, AGING_THRESHOLDS, FOLLOW_UP_THRESHOLDS, PaymentUpdateData, FollowUpData
/workspaces/matanuskatp/src/types/loadPlanning.ts: LoadPlan, CargoItem, LOAD_CATEGORIES
/workspaces/matanuskatp/src/types/mapTypes.ts: MapIconType, MapStyle
/workspaces/matanuskatp/src/types/tyre-inspection.ts: TyreInspectionData, calculateCostPerKm, calculateRemainingTreadLifeKm
/workspaces/matanuskatp/src/types/tyre.ts: TyreSize, TyreRotation, TyreRepair, TyreType, milesToKm
/workspaces/matanuskatp/src/types/vehicle.ts: VehicleStatus, VehicleType, VehicleCategory, VehicleSeries, Inspection
/workspaces/matanuskatp/src/types/workshop-job-card.ts: (many exports)
/workspaces/matanuskatp/src/types/workshop-tyre-inventory.ts: (many exports)

# Utils
/workspaces/matanuskatp/src/utils/auditLogUtils.ts: addAuditLog
/workspaces/matanuskatp/src/utils/csvUtils.ts: exportToCSV, parseCSV, downloadCSVTemplate, ImportResults
/workspaces/matanuskatp/src/utils/envChecker.ts: checkEnvVariable, isProductionEnv, getEnvVar
/workspaces/matanuskatp/src/utils/errorHandling.ts: createAppError, safeExecute, getStackTrace, default
/workspaces/matanuskatp/src/utils/firebaseConnectionHandler.ts: connectToEmulator, setConnectionStatus, startConnectionHealthMonitor, default
/workspaces/matanuskatp/src/utils/firestoreConnection.ts: getConnectionStatus
/workspaces/matanuskatp/src/utils/firestoreUtils.ts: prepareForFirestore
/workspaces/matanuskatp/src/utils/fleetGeoJson.ts: convertFleetToGeoJson, default
/workspaces/matanuskatp/src/utils/formIntegration.ts: FormIntegrationOptions
/workspaces/matanuskatp/src/utils/formatters.ts: formatDate
/workspaces/matanuskatp/src/utils/googleMapsLoader.ts: checkMapsServiceAvailability, isValidApiKeyFormat
/workspaces/matanuskatp/src/utils/helpers.ts: (many exports)
/workspaces/matanuskatp/src/utils/mapConfig.ts: MapIconType, TRUCK_ICON, getCenterOfLocations, getZoomLevelForBounds, isGoogleMapsAPILoaded, loadGoogleMapsScript, useLoadGoogleMaps
/workspaces/matanuskatp/src/utils/mapsService.ts: getMapsServiceUrl, canUseGoogleMaps
/workspaces/matanuskatp/src/utils/networkDetection.ts: stopNetworkMonitoring, default
/workspaces/matanuskatp/src/utils/offlineCache.ts: clearExpiredCache, default
/workspaces/matanuskatp/src/utils/offlineOperations.ts: getDocument, default
/workspaces/matanuskatp/src/utils/pdfGenerators.ts: generateLoadConfirmationPDF
/workspaces/matanuskatp/src/utils/placesService.ts: searchNearbyPlaces, getPlaceDetails
/workspaces/matanuskatp/src/utils/qrCodeUtils.ts: generateQRValue, createQRCodeUrl, registerQRCode, processQRCode, generateStockItemQR, parseQRCodeData
/workspaces/matanuskatp/src/utils/sageDataMapping.ts: (many exports)
/workspaces/matanuskatp/src/utils/setupEnv.ts: checkEnvVariables, validateEnvironment, displayEnvironmentStatus, getEnvironmentStatusForUI, requireEnvironmentVariables
/workspaces/matanuskatp/src/utils/sidebar-validator.ts: findPagesNotInSidebar, generateSidebarSuggestions
/workspaces/matanuskatp/src/utils/syncService.ts: SyncStatus, ConnectionStatus, syncService
/workspaces/matanuskatp/src/utils/tripDebugger.ts: analyzeTripData, fixTripStatusIssues, getTripsByStatus
/workspaces/matanuskatp/src/utils/tyreConstants.ts: (many exports)
/workspaces/matanuskatp/src/utils/useTyreStores.tsx: TyreStoresProvider, useTyreStores
/workspaces/matanuskatp/src/utils/webhookSenders.ts: retryWebhookCall
/workspaces/matanuskatp/src/utils/wialonAuth.ts: loadWialonSDK, loginWialon, logoutWialon, getCurrentWialonUser, getUnitAddress
/workspaces/matanuskatp/src/utils/wialonConfig.ts: WIALON_LOGIN_URL, WIALON_SESSION_TOKEN, getWialonLoginUrlWithToken, openWialonLogin
/workspaces/matanuskatp/src/utils/wialonLoader.ts: (many exports)
/workspaces/matanuskatp/src/utils/wialonSensorData.ts: WialonSensor, WialonUnitProfile, WialonAVLUnit, getTotalFuelCapacity
```
</details>