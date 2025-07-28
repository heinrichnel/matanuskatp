│   │   ├── InspectionForm.tsx
│   │   ├── InspectionReportForm.tsx
│   │   ├── InventorySelectionForm.tsx
│   │   ├── PartsReceivingForm.tsx
│   │   ├── RouteSelectionForm.tsx
│   │   ├── SouthAfricaExpensesForm.tsx
│   │   ├── TripForm.tsx
│   │   ├── TripForm2.tsx
│   │   ├── TripPlanningForm.tsx
│   │   ├── TyreSelectionForm.tsx
│   │   └── ZimbabweExpensesForm.tsx
│   ├── layout
│   │   ├── AppLayout.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── Navigation.tsx
│   │   └── Sidebar.tsx
│   ├── lists
│   │   ├── CARReportList.tsx
│   │   ├── CostList.tsx
│   │   ├── InspectionList.tsx
│   │   └── WebBookTripsList.tsx
│   ├── maps
│   │   ├── EnhancedMapComponent.tsx
│   │   └── LocationDetailPanel.tsx
│   ├── misc
│   ├── mobile
│   │   ├── MobileLayout.tsx
│   │   ├── MobileNavigation.tsx
│   │   └── tyre
│   │       ├── TyreCardMobile.tsx
│   │       ├── TyreInspectionMobile.tsx
│   │       ├── TyreListMobile.tsx
│   │       └── TyreScanner.tsx
│   ├── testing
│   │   ├── GoogleMapsTest.tsx
│   │   └── UIConnector.tsx
│   ├── tyres
│   │   ├── TyreInspectionModal.tsx
│   │   ├── TyreIntegration.tsx
│   │   ├── TyreInventoryDashboard.tsx
│   │   ├── TyreReferenceManager.tsx
│   │   ├── VehiclePositionDiagram.tsx
│   │   └── components
│   │       └── TyreManagementView.tsx
│   ├── ui
│   │   ├── AntDesignProvider.tsx
│   │   ├── AntDesignWrapper.tsx
│   │   ├── ApplicantInfoCard.tsx
│   │   ├── Button.tsx
│   │   ├── Calendar.tsx
│   │   ├── Card.tsx
│   │   ├── CardHeader.tsx
│   │   ├── ConnectionStatusIndicator.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── FirestoreConnectionError.tsx
│   │   ├── FormElements.tsx
│   │   ├── GenericPlaceholderPage.tsx
│   │   ├── Input.d.ts
│   │   ├── Input.tsx
│   │   ├── InspectionFormPDS.tsx
│   │   ├── JobCardTable.tsx
│   │   ├── LoadingIndicator.tsx
│   │   ├── Modal.tsx
│   │   ├── OfflineBanner.tsx
│   │   ├── PageWrapper.tsx
│   │   ├── ProgressStepper.tsx
│   │   ├── Select.d.ts
│   │   ├── Select.tsx
│   │   ├── StatsCardGroup.tsx
│   │   ├── SyncIndicator.tsx
│   │   ├── Tabs.tsx
│   │   ├── Templates.tsx
│   │   ├── Tooltip.tsx
│   │   ├── UIComponentsDemo.tsx
│   │   ├── UIConnector.tsx
│   │   ├── UnitsTable.tsx
│   │   ├── User.tsx
│   │   ├── VendorTable.tsx
│   │   ├── VerticalStepper.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── index.ts
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── modal.tsx
│   │   ├── new-job-card.tsx
│   │   ├── reports.tsx
│   │   └── table.tsx
│   └── workshop
│       └── WorkshopIntegration.tsx
├── config
│   ├── capacitor.config.ts
│   ├── cloudRunEndpoints.ts
│   ├── routeIntegration.ts
│   ├── routeUtils.ts
│   ├── sageAuth.ts
│   ├── sidebarConfig.ts
│   └── tripWorkflowConfig.ts
├── context
│   ├── AppContext.tsx
│   ├── DriverBehaviorContext.tsx
│   ├── InventoryContext.tsx
│   ├── SyncContext.tsx
│   ├── TripContext.tsx
│   ├── TyreContext.tsx
│   ├── TyreReferenceDataContext.tsx
│   ├── TyreStoresContext.tsx
│   ├── WialonContext.tsx
│   ├── WialonProvider.tsx
│   └── WorkshopContext.tsx
├── data
│   ├── PrivacyPolicy.tsx
│   ├── faultData.ts
│   ├── fleetVehicles.ts
│   ├── index.ts
│   ├── inspectionTemplates.ts
│   ├── jobCardTemplates.ts
│   ├── tyreData.ts
│   ├── tyreMappingData.ts
│   ├── tyreReferenceData.ts
│   ├── userDirectory.ts
│   └── vehicles.ts
├── firebase
│   ├── tyreStores.ts
│   └── tyres.ts
├── firebase.ts
├── firebaseConfig.ts
├── firebaseEmulators.ts
├── hooks
│   ├── WialonUnitList.tsx
│   ├── use-mobile.tsx
│   ├── useActionLogger.ts
│   ├── useCapacitor.ts
│   ├── useClients.ts
│   ├── useCurrencyConverter.ts
│   ├── useErrorHandling.ts
│   ├── useFirestoreDoc.ts
│   ├── useFleetData.ts
│   ├── useFleetList.ts
│   ├── useNetworkStatus.ts
│   ├── useOfflineForm.ts
│   ├── useOfflineQuery.ts
│   ├── useRealtimeTrips.ts
│   ├── useToast.ts
│   ├── useTyreInspections.ts
│   ├── useTyres.ts
│   ├── useVendors.ts
│   ├── useWebBookDriverBehavior.ts
│   ├── useWebBookTrips.ts
│   ├── useWialon.ts
│   ├── useWialonConnection.ts
│   ├── useWialonDrivers.ts
│   ├── useWialonGeofences.ts
│   ├── useWialonResources.ts
│   ├── useWialonSdk.ts
│   ├── useWialonSession.ts
│   └── useWialonUnits.ts
├── index.css
├── lib
│   └── currency.ts
├── main.tsx
├── pages
│   ├── ActiveCustomers.tsx
│   ├── ActiveTripsPageEnhanced.tsx
│   ├── AddFuelEntryPage.tsx
│   ├── AddTripPage.tsx
│   ├── CashManagerRequestPage.tsx
│   ├── ClientDetail.tsx
│   ├── CompletedTrips.tsx
│   ├── ComplianceDashboard.tsx
│   ├── CustomerDashboard.tsx
│   ├── CustomerReports.tsx
│   ├── Dashboard.tsx
│   ├── DashboardPage.tsx
│   ├── DieselAnalysis.tsx
│   ├── DieselDashboard.tsx
│   ├── FlagsInvestigationsPage.tsx
│   ├── FleetManagementPage.tsx
│   ├── FormsIntegrationPage.tsx
│   ├── IndirectCostBreakdown.tsx
│   ├── InspectionManagement.tsx
│   ├── InventoryDashboard.tsx
│   ├── InventoryPage.tsx
│   ├── InventoryReportsPage.tsx
│   ├── JobCardKanbanBoard.tsx
│   ├── JobCardManagement.tsx
│   ├── LoadPlanningComponentPage.tsx
│   ├── LoadPlanningPage.tsx
│   ├── MissedLoadsTracker.tsx
│   ├── POApprovalSummary.tsx
│   ├── PaidInvoices.tsx
│   ├── PartsInventoryPage.tsx
│   ├── PartsOrderingPage.tsx
│   ├── PendingInvoices.tsx
│   ├── PerformanceAnalytics.tsx
│   ├── PurchaseOrderDetailView.tsx
│   ├── PurchaseOrderTracker.tsx
│   ├── QAReviewPanel.tsx
│   ├── QAReviewPanelContainer.tsx
│   ├── ReceivePartsPage.tsx
│   ├── ReportNewIncidentPage.tsx
│   ├── RetentionMetrics.tsx
│   ├── RouteOptimizationPage.tsx
│   ├── RoutePlanningPage.tsx
│   ├── TripCalendarPage.tsx
│   ├── TripDashboard.tsx
│   ├── TripDashboardPage.tsx
│   ├── TripManagementPage.tsx
│   ├── TripReportPage.tsx
│   ├── TripTimelinePage.tsx
│   ├── TyreFleetMap.tsx
│   ├── TyreHistoryPage.tsx
│   ├── TyrePerformanceDashboard.tsx
│   ├── TyreStores.tsx
│   ├── VehicleTyreView.tsx
│   ├── VehicleTyreViewA.tsx
│   ├── VendorScorecard.tsx
│   ├── WialonConfigPage.tsx
│   ├── WialonDashboard.tsx
│   ├── WialonUnitsPage.tsx
│   ├── WorkOrderManagement.tsx
│   ├── WorkshopAnalytics.tsx
│   ├── WorkshopOperations.tsx
│   ├── YearToDateKPIs.tsx
│   ├── clients
│   │   ├── ActiveCustomers.tsx
│   │   ├── AddNewCustomer.tsx
│   │   ├── ClientManagementPage.tsx
│   │   ├── ClientNetworkMap.tsx
│   │   ├── CustomerReports.tsx
│   │   └── RetentionMetrics.tsx
│   ├── diesel
│   │   ├── AddFuelEntryPage.tsx
│   │   ├── BudgetPlanning.tsx
│   │   ├── CarbonFootprintCalc.tsx
│   │   ├── CostAnalysis.tsx
│   │   ├── DieselDashboardComponent.tsx
│   │   ├── DieselManagementPage.tsx
│   │   ├── DriverFuelBehavior.tsx
│   │   ├── FuelCardManager.tsx
│   │   ├── FuelEfficiencyReport.tsx
│   │   ├── FuelLogs.tsx
│   │   ├── FuelStations.tsx
│   │   └── FuelTheftDetection.tsx
│   ├── drivers
│   │   ├── AddNewDriver.tsx
│   │   ├── DriverBehaviorPage.tsx
│   │   ├── DriverDashboard.tsx
│   │   ├── DriverDetails.tsx
│   │   ├── DriverDetailsPage.tsx
│   │   ├── DriverFuelBehavior.tsx
│   │   ├── DriverManagementPage.tsx
│   │   ├── DriverProfiles.tsx
│   │   ├── DriverRewards.tsx
│   │   ├── DriverScheduling.tsx
│   │   ├── DriverViolations.tsx
│   │   ├── EditDriver.tsx
│   │   ├── HoursOfService.tsx
│   │   ├── LicenseManagement.tsx
│   │   ├── PerformanceAnalytics.tsx
│   │   ├── SafetyScores.tsx
│   │   └── TrainingRecords.tsx
│   ├── examples
│   │   └── ClientSelectionExample.jsx
│   ├── invoices
│   │   ├── CreateInvoicePage.tsx
│   │   ├── CreateQuotePage.tsx
│   │   ├── InvoiceApprovalFlow.tsx
│   │   ├── InvoiceBuilder.tsx
│   │   ├── InvoiceDashboard.tsx
│   │   ├── InvoiceManagementPage.tsx
│   │   ├── InvoiceTemplatesPage.tsx
│   │   ├── PaidInvoicesPage.tsx
│   │   ├── PendingInvoicesPage.tsx
│   │   └── TaxReportExport.tsx
│   ├── mobile
│   │   └── TyreMobilePage.tsx
│   ├── trips
│   │   ├── CostEntryForm.tsx
│   │   ├── CreateLoadConfirmationPage.tsx
│   │   ├── FlagInvestigationPanel.tsx
│   │   ├── MainTripWorkflow.tsx
│   │   ├── PaymentTrackingPanel.tsx
│   │   ├── ReportingPanel.tsx
│   │   ├── SystemCostGenerator.tsx
│   │   ├── TripCompletionPanel.tsx
│   │   ├── TripDetailsPage.tsx
│   │   ├── TripForm.tsx
│   │   ├── TripInvoicingPanel.tsx
│   │   └── TripTimelinePage.tsx
│   ├── tyres
│   │   ├── AddNewTyrePage.tsx
│   │   ├── TyreManagementPage.tsx
│   │   └── TyreReferenceManagerPage.tsx
│   └── workshop
│       ├── PurchaseOrderPage.tsx
│       ├── QRGenerator.tsx
│       ├── QRScannerPage.tsx
│       ├── StockInventoryPage.tsx
│       ├── VendorPage.tsx
│       └── WorkshopPage.tsx
├── testRouting.tsx
├── types
│   ├── User.ts
│   ├── audit.d.ts
│   ├── cashManagerTypes.ts
│   ├── client.ts
│   ├── diesel.d.ts
│   ├── global.d.ts
│   ├── googleMaps.d.ts
│   ├── index.ts
│   ├── inventory.ts
│   ├── invoice.ts
│   ├── loadPlanning.ts
│   ├── mapTypes.ts
│   ├── react-calendar-timeline.d.ts
│   ├── tyre-inspection.ts
│   ├── tyre.ts
│   ├── vehicle.ts
│   ├── vendor.ts
│   ├── wialon.ts
│   ├── workshop-job-card.ts
│   └── workshop-tyre-inventory.ts
├── utils
│   ├── auditLogUtils.ts
│   ├── cn.ts
│   ├── csvUtils.ts
│   ├── envChecker.ts
│   ├── envUtils.ts
│   ├── errorHandling.ts
│   ├── firebaseConnectionHandler.ts
│   ├── firestoreConnection.ts
│   ├── firestoreUtils.ts
│   ├── fleetGeoJson.ts
│   ├── formIntegration.ts
│   ├── formatters.ts
│   ├── googleMapsLoader.ts
│   ├── helpers.ts
│   ├── inspectionUtils.ts
│   ├── mapConfig.ts
│   ├── mapsService.ts
│   ├── networkDetection.ts
│   ├── offlineCache.ts
│   ├── offlineOperations.ts
│   ├── pdfGenerators.ts
│   ├── placesService.ts
│   ├── qrCodeUtils.ts
│   ├── sageDataMapping.ts
│   ├── setupEnv.md
│   ├── setupEnv.ts
│   ├── sidebar-validator.ts
│   ├── syncService.ts
│   ├── tripDebugger.ts
│   ├── tyreAnalytics.ts
│   ├── tyreConstants.ts
│   ├── useTyreStores.tsx
│   ├── webhookSenders.ts
│   ├── wialonAuth.ts
│   ├── wialonConfig.ts
│   ├── wialonLoader.ts
│   └── wialonSensorData.ts
└── vite-env.d.ts

57 directories, 518 files
@heinrichnel ➜ /workspaces/matanuskatp (main) $ npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest

added 10 packages, removed 1 package, changed 1 package, and audited 2773 packages in 11s

397 packages are looking for funding
  run `npm fund` for details

17 vulnerabilities (8 moderate, 7 high, 2 critical)

To address all issues possible (including breaking changes), run:
  npm audit fix --force

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.
@heinrichnel ➜ /workspaces/matanuskatp (main) $ npm install --save-dev unimport

added 15 packages, and audited 2788 packages in 6s

401 packages are looking for funding
  run `npm fund` for details

17 vulnerabilities (8 moderate, 7 high, 2 critical)

To address all issues possible (including breaking changes), run:
  npm audit fix --force

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.
@heinrichnel ➜ /workspaces/matanuskatp (main) $ npx unimport ./src
npm ERR! could not determine executable to run

npm ERR! A complete log of this run can be found in: /home/codespace/.npm/_logs/2025-07-28T10_11_29_590Z-debug-0.log
@heinrichnel ➜ /workspaces/matanuskatp (main) $ npm install --save-dev ts-prune

added 9 packages, and audited 2797 packages in 5s

401 packages are looking for funding
  run `npm fund` for details

17 vulnerabilities (8 moderate, 7 high, 2 critical)

To address all issues possible (including breaking changes), run:
  npm audit fix --force

Some issues need review, and may require choosing
a different dependency.

Run `npm audit` for details.
@heinrichnel ➜ /workspaces/matanuskatp (main) $ npx ts-prune
src/AppRoutes.tsx:350 - default
src/firebaseConfig.ts:51 - firebaseConfig (used in module)
src/api/firebaseAdmin.ts:189 - db (used in module)
src/api/firebaseAdmin.ts:190 - admin (used in module)
src/api/firebaseAdmin.ts:191 - importInventoryItems (used in module)
src/api/firebaseAdmin.ts:192 - getAllInventoryItems (used in module)
src/api/firebaseAdmin.ts:193 - getInventoryItemById (used in module)
src/api/firebaseAdmin.ts:194 - updateInventoryItem (used in module)
src/api/firebaseAdmin.ts:195 - deleteInventoryItem (used in module)
src/api/googlemapsindex.ts:86 - initMap (used in module)
src/api/googlemapsindex.ts:86 - loadGoogleMapsScript (used in module)
src/api/sageIntegration.ts:37 - fetchInventoryFromSage
src/api/sageIntegration.ts:57 - syncInventoryItemToSage
src/api/sageIntegration.ts:88 - fetchInventoryItemFromSage
src/api/sageIntegration.ts:105 - updateInventoryQuantity
src/api/sageIntegration.ts:138 - deleteInventoryItem
src/api/sageIntegration.ts:164 - updateInventoryInSage
src/assets/matanuska-logo-base64.ts:3 - matanuskaLogoBase64
src/components/DataLoader.tsx:112 - default
src/components/ErrorBoundary.tsx:189 - withErrorBoundary
src/components/FleetList.tsx:4 - FleetList (used in module)
src/components/FleetList.tsx:29 - default
src/components/GeofenceModal.tsx:11 - GeofenceModal (used in module)
src/components/GeofenceModal.tsx:54 - default
src/components/LazyComponent.tsx:46 - createLazyComponent
src/components/LazyComponent.tsx:67 - default
src/components/LiveUpdater.tsx:4 - LiveUpdater (used in module)
src/components/LiveUpdater.tsx:18 - default
src/components/TyreInspectionPDFGenerator.tsx:27 - TyreInspectionPDFGenerator (used in module)
src/config/capacitor.config.ts:25 - default
src/config/cloudRunEndpoints.ts:9 - MAPS_SERVICE_URL
src/config/cloudRunEndpoints.ts:12 - CLOUD_RUN_ENDPOINTS (used in module)
src/config/cloudRunEndpoints.ts:18 - getBestCloudRunEndpoint
src/config/cloudRunEndpoints.ts:23 - getAllCloudRunEndpoints
src/config/routeIntegration.ts:31 - validateRouteToComponent (used in module)
src/config/routeIntegration.ts:65 - findDuplicateRoutes (used in module)
src/config/routeIntegration.ts:90 - analyzeFunctionalCoverage (used in module)
src/config/routeIntegration.ts:132 - generateIntegrationReport
src/config/routeUtils.ts:7 - getSidebarItemsBySection (used in module)
src/config/routeUtils.ts:20 - generateRoutesFromSidebar
src/config/routeUtils.ts:84 - findSidebarItemByPath (used in module)
src/config/routeUtils.ts:89 - getBreadcrumbsFromPath
src/config/tripWorkflowConfig.ts:6 - WorkflowStep (used in module)
src/config/tripWorkflowConfig.ts:17 - TripWorkflowConfig (used in module)
src/config/tripWorkflowConfig.ts:127 - getWorkflowStep (used in module)
src/config/tripWorkflowConfig.ts:131 - getNextStep
src/config/tripWorkflowConfig.ts:138 - getPreviousStep
src/context/DriverBehaviorContext.tsx:6 - DriverBehaviorEvent (used in module)
src/context/InventoryContext.tsx:52 - useInventory
src/context/InventoryContext.tsx:64 - InventoryProvider
src/context/SyncContext.tsx:35 - useTripSync
src/context/TripContext.tsx:6 - Trip (used in module)
src/context/TripContext.tsx:102 - useTrips
src/context/WialonContext.tsx:11 - WialonUnit (used in module)
src/context/WialonContext.tsx:18 - WialonContextType (used in module)
src/context/WialonProvider.tsx:18 - WialonContext (used in module)
src/context/WialonProvider.tsx:30 - WialonProvider
src/context/WialonProvider.tsx:172 - useWialon
src/context/WorkshopContext.tsx:49 - PurchaseOrderItem (used in module)
src/context/WorkshopContext.tsx:59 - PurchaseOrder (used in module)
src/data/faultData.ts:4 - FaultCategory (used in module)
src/data/faultData.ts:12 - FaultSubcategory (used in module)
src/data/faultData.ts:23 - FaultSeverity (used in module)
src/data/faultData.ts:26 - FaultStatus (used in module)
src/data/faultData.ts:29 - Fault
src/data/faultData.ts:64 - faultCategories (used in module)
src/data/faultData.ts:289 - findSubcategory
src/data/faultData.ts:298 - findCategory
src/data/faultData.ts:302 - default
src/data/index.ts:2 - Vehicle
src/data/index.ts:2 - FleetStats
src/data/index.ts:2 - VehicleFilters
src/data/index.ts:3 - FLEET_VEHICLES
src/data/index.ts:5 - getVehicleByFleetNo
src/data/index.ts:6 - getVehicleByRegistration
src/data/index.ts:7 - getActiveVehicles
src/data/index.ts:8 - getVehiclesByType
src/data/index.ts:9 - getVehiclesByCategory
src/data/index.ts:10 - getVehiclesBySeries
src/data/index.ts:11 - getVehiclesByManufacturer
src/data/index.ts:12 - getVehiclesByStatus
src/data/index.ts:13 - searchVehicles
src/data/index.ts:14 - filterVehicles
src/data/index.ts:16 - getFleetStats
src/data/index.ts:4 - InspectionItem
src/data/index.ts:19 - InspectionTemplate
src/data/index.ts:33 - preTrip
src/data/index.ts:231 - mechanicInspection
src/data/index.ts:279 - trailerInspection
src/data/index.ts:364 - inspectionTemplates
src/data/index.ts:1 - tyreTypes
src/data/index.ts:2 - TyreType
src/data/index.ts:4 - TyreStoreLocation
src/data/index.ts:12 - TyreConditionStatus
src/data/index.ts:19 - TyreSize
src/data/index.ts:26 - TyreCondition
src/data/index.ts:35 - TyrePurchaseDetails
src/data/index.ts:43 - TyreInstallation
src/data/index.ts:51 - TyreInspectionEntry
src/data/index.ts:68 - TyreMaintenanceHistory
src/data/index.ts:86 - TyreStatus
src/data/index.ts:94 - TyreMountStatus
src/data/index.ts:100 - Tyre
src/data/index.ts:131 - TYRE_SIZES
src/data/index.ts:137 - TYRE_BRANDS
src/data/index.ts:164 - TYRE_PATTERNS
src/data/index.ts:209 - SAMPLE_TYRES
src/data/index.ts:392 - formatTyreSize
src/data/index.ts:395 - parseTyreSize
src/data/jobCardTemplates.ts:4 - JobCardTaskItem (used in module)
src/data/jobCardTemplates.ts:23 - JobCardTemplate (used in module)
src/data/jobCardTemplates.ts:38 - ServiceInterval (used in module)
src/data/jobCardTemplates.ts:45 - service15k (used in module)
src/data/jobCardTemplates.ts:123 - service50k (used in module)
src/data/jobCardTemplates.ts:225 - brakeRepair (used in module)
src/data/jobCardTemplates.ts:277 - jobCardTemplates (used in module)
src/data/jobCardTemplates.ts:284 - serviceIntervals
src/data/jobCardTemplates.ts:290 - default
src/data/PrivacyPolicy.tsx:18 - default
src/data/userDirectory.ts:4 - USER_DIRECTORY (used in module)
src/data/userDirectory.ts:29 - getUserById
src/data/userDirectory.ts:30 - getUsersByRole (used in module)
src/data/userDirectory.ts:31 - getTechnicians
src/data/userDirectory.ts:32 - getOperators
src/firebase/tyres.ts:46 - default
src/firebase/tyreStores.ts:307 - default
src/hooks/use-mobile.tsx:5 - useIsMobile
src/hooks/useActionLogger.ts:6 - useActionLogger
src/hooks/useClients.ts:179 - useClient
src/hooks/useCurrencyConverter.ts:3 - useCurrencyConverter
src/hooks/useFirestoreDoc.ts:5 - useFirestoreDoc
src/hooks/useFleetData.ts:48 - default
src/hooks/useOfflineForm.ts:129 - default
src/hooks/useOfflineQuery.ts:25 - useOfflineQuery (used in module)
src/hooks/useOfflineQuery.ts:140 - default
src/hooks/useToast.ts:3 - Toast (used in module)
src/hooks/useToast.ts:11 - ToastContextType
src/hooks/useTyres.ts:6 - Tyre (used in module)
src/hooks/useWebBookDriverBehavior.ts:25 - useWebBookDriverBehavior
src/hooks/useWebBookDriverBehavior.ts:8 - WebBookDriverBehavior (used in module)
src/hooks/useWialon.ts:13 - useWialonUnits
src/hooks/useWialon.ts:7 - WialonUnit (used in module)
src/hooks/useWialonConnection.ts:16 - useWialonConnection (used in module)
src/hooks/useWialonDrivers.ts:5 - useWialonDrivers
src/hooks/useWialonGeofences.ts:4 - useWialonGeofences
src/hooks/useWialonResources.ts:5 - useWialonResources
src/hooks/useWialonSession.ts:8 - useWialonSession
src/hooks/WialonUnitList.tsx:6 - WialonUnitList
src/lib/currency.ts:4 - currencySymbols
src/pages/AddFuelEntryPage.tsx:159 - default
src/pages/PaidInvoices.tsx:257 - default
src/pages/PendingInvoices.tsx:168 - default
src/types/client.ts:80 - createNewClient
src/types/client.ts:105 - addClientRelationship
src/types/index.ts:208 - InvoiceAging
src/types/index.ts:226 - CustomerPerformance
src/types/index.ts:255 - TruckPerformance
src/types/index.ts:386 - ActionItemComment (used in module)
src/types/index.ts:453 - SyncEvent
src/types/index.ts:465 - AppVersion
src/types/index.ts:478 - Driver
src/types/index.ts:488 - SystemCostRates (used in module)
src/types/index.ts:509 - SystemCostReminder (used in module)
src/types/index.ts:520 - TripEditRecord (used in module)
src/types/index.ts:559 - UserPermission
src/types/index.ts:563 - NoUserPermissionAllowed
src/types/index.ts:626 - RoutePoint
src/types/index.ts:715 - TRUCKS_WITH_PROBES
src/types/index.ts:719 - CLIENT_TYPES
src/types/index.ts:736 - DELAY_REASON_TYPES
src/types/index.ts:775 - JobCard
src/types/index.ts:838 - Invoice
src/types/index.ts:858 - InvoiceItem (used in module)
src/types/index.ts:868 - FleetVehicle
src/types/index.ts:887 - CAR_INCIDENT_TYPES
src/types/index.ts:939 - DEFAULT_SYSTEM_COST_RATES
src/types/index.ts:982 - DEFAULT_SYSTEM_COST_REMINDER
src/types/index.ts:992 - TRIP_EDIT_REASONS
src/types/index.ts:1007 - TRIP_TEMPLATE_CATEGORIES
src/types/index.ts:1028 - TripFormData
src/types/index.ts:1039 - AGING_THRESHOLDS
src/types/index.ts:1055 - FOLLOW_UP_THRESHOLDS
src/types/index.ts:1071 - TyreInspection (used in module)
src/types/index.ts:1083 - TyreInventory
src/types/inventory.ts:112 - VendorScore
src/types/inventory.ts:127 - PurchaseOrderRequest
src/types/inventory.ts:146 - RequestItem (used in module)
src/types/inventory.ts:160 - POApproval
src/types/inventory.ts:173 - IntegrationSettings
src/types/inventory.ts:189 - SyncLog
src/types/invoice.ts:4 - InvoiceData
src/types/invoice.ts:18 - FollowUpRecord (used in module)
src/types/invoice.ts:33 - InvoiceAging
src/types/invoice.ts:48 - AGING_THRESHOLDS
src/types/invoice.ts:82 - FOLLOW_UP_THRESHOLDS
src/types/invoice.ts:91 - PaymentUpdateData
src/types/invoice.ts:100 - FollowUpData
src/types/loadPlanning.ts:1 - LoadPlan
src/types/loadPlanning.ts:19 - CargoItem (used in module)
src/types/loadPlanning.ts:31 - LOAD_CATEGORIES
src/types/mapTypes.ts:19 - MapIconType (used in module)
src/types/mapTypes.ts:40 - MapStyle
src/types/tyre-inspection.ts:58 - calculateCostPerKm
src/types/tyre-inspection.ts:71 - calculateRemainingTreadLifeKm
src/types/tyre-inspection.ts:6 - TyreInspectionData
src/types/tyre.ts:204 - milesToKm
src/types/tyre.ts:55 - TyreSize (used in module)
src/types/tyre.ts:63 - TyreRotation (used in module)
src/types/tyre.ts:73 - TyreRepair (used in module)
src/types/tyre.ts:162 - TyreType (used in module)
src/types/vehicle.ts:6 - VehicleStatus (used in module)
src/types/vehicle.ts:9 - VehicleType (used in module)
src/types/vehicle.ts:12 - VehicleCategory (used in module)
src/types/vehicle.ts:15 - VehicleSeries (used in module)
src/types/vehicle.ts:80 - Inspection
src/types/workshop-job-card.ts:1 - JobCardItem (used in module)
src/types/workshop-job-card.ts:53 - WorkOrderInfo (used in module)
src/types/workshop-job-card.ts:63 - VehicleAssetDetails (used in module)
src/types/workshop-job-card.ts:77 - LinkedRecords (used in module)
src/types/workshop-job-card.ts:85 - SchedulingInfo (used in module)
src/types/workshop-job-card.ts:97 - TaskDetail (used in module)
src/types/workshop-job-card.ts:109 - PartsAndMaterial (used in module)
src/types/workshop-job-card.ts:121 - LaborDetail (used in module)
src/types/workshop-job-card.ts:134 - AdditionalCost (used in module)
src/types/workshop-job-card.ts:143 - CostSummary (used in module)
src/types/workshop-job-card.ts:155 - CustomBusinessField (used in module)
src/types/workshop-tyre-inventory.ts:401 - parseTyreSizeFromString (used in module)
src/types/workshop-tyre-inventory.ts:433 - determineTyreType (used in module)
src/types/workshop-tyre-inventory.ts:448 - mapLegacyStatusToConditionStatus (used in module)
src/types/workshop-tyre-inventory.ts:466 - mapLegacyStatusToTyreStatus (used in module)
src/types/workshop-tyre-inventory.ts:473 - getSizeString (used in module)
src/types/workshop-tyre-inventory.ts:481 - getInstallDetails (used in module)
src/types/workshop-tyre-inventory.ts:492 - getLegacyStatus (used in module)
src/types/workshop-tyre-inventory.ts:504 - convertToEnhancedTyre
src/types/workshop-tyre-inventory.ts:575 - convertToLegacyTyre
src/types/workshop-tyre-inventory.ts:49 - TyreInspection
src/types/workshop-tyre-inventory.ts:63 - TyreSize (used in module)
src/types/workshop-tyre-inventory.ts:70 - TyreCondition (used in module)
src/types/workshop-tyre-inventory.ts:79 - TyreInspectionEntry (used in module)
src/types/workshop-tyre-inventory.ts:97 - EnhancedTyre (used in module)
src/types/workshop-tyre-inventory.ts:154 - RCAData
src/types/workshop-tyre-inventory.ts:164 - TimeLogEntry (used in module)
src/types/workshop-tyre-inventory.ts:172 - Attachment (used in module)
src/types/workshop-tyre-inventory.ts:182 - Remark (used in module)
src/types/workshop-tyre-inventory.ts:190 - PORequest
src/types/workshop-tyre-inventory.ts:204 - JobCardItem (used in module)
src/types/workshop-tyre-inventory.ts:223 - JobCard
src/types/workshop-tyre-inventory.ts:266 - WorkOrder
src/types/workshop-tyre-inventory.ts:290 - TaskEntry (used in module)
src/types/workshop-tyre-inventory.ts:301 - PartEntry (used in module)
src/types/workshop-tyre-inventory.ts:312 - LaborEntry (used in module)
src/types/workshop-tyre-inventory.ts:323 - TyreInventoryItem
src/types/workshop-tyre-inventory.ts:336 - VehicleTyreConfiguration
src/types/workshop-tyre-inventory.ts:346 - InventoryItem
src/types/workshop-tyre-inventory.ts:356 - JobCardStatus (used in module)
src/types/workshop-tyre-inventory.ts:367 - WorkOrderStatus (used in module)
src/types/workshop-tyre-inventory.ts:373 - Priority (used in module)
src/types/workshop-tyre-inventory.ts:374 - TaskStatus (used in module)
src/types/workshop-tyre-inventory.ts:380 - TyreStatus (used in module)
src/types/workshop-tyre-inventory.ts:391 - TyreMountStatus (used in module)
src/types/workshop-tyre-inventory.ts:392 - TyreType (used in module)
src/types/workshop-tyre-inventory.ts:393 - TyrePosition (used in module)
src/utils/auditLogUtils.ts:16 - addAuditLog
src/utils/csvUtils.ts:8 - exportToCSV
src/utils/csvUtils.ts:26 - parseCSV
src/utils/csvUtils.ts:45 - downloadCSVTemplate
src/utils/csvUtils.ts:61 - ImportResults
src/utils/envChecker.ts:13 - checkEnvVariable (used in module)
src/utils/envChecker.ts:164 - isProductionEnv
src/utils/envChecker.ts:175 - getEnvVar
src/utils/errorHandling.ts:56 - createAppError (used in module)
src/utils/errorHandling.ts:295 - safeExecute (used in module)
src/utils/errorHandling.ts:310 - getStackTrace (used in module)
src/utils/errorHandling.ts:318 - default
src/utils/firebaseConnectionHandler.ts:41 - connectToEmulator (used in module)
src/utils/firebaseConnectionHandler.ts:74 - setConnectionStatus (used in module)
src/utils/firebaseConnectionHandler.ts:258 - startConnectionHealthMonitor (used in module)
src/utils/firebaseConnectionHandler.ts:302 - default
src/utils/firestoreConnection.ts:45 - getConnectionStatus
src/utils/firestoreUtils.ts:100 - prepareForFirestore
src/utils/fleetGeoJson.ts:255 - convertFleetToGeoJson (used in module)
src/utils/fleetGeoJson.ts:312 - default
src/utils/formatters.ts:20 - formatDate
src/utils/formIntegration.ts:74 - FormIntegrationOptions (used in module)
src/utils/googleMapsLoader.ts:68 - checkMapsServiceAvailability (used in module)
src/utils/googleMapsLoader.ts:115 - isValidApiKeyFormat (used in module)
src/utils/helpers.ts:118 - shouldAutoCompleteTrip
src/utils/helpers.ts:125 - filterTripsByDateRange
src/utils/helpers.ts:140 - filterTripsByClient
src/utils/helpers.ts:143 - filterTripsByCurrency
src/utils/helpers.ts:146 - filterTripsByDriver
src/utils/helpers.ts:152 - isOnline
src/utils/helpers.ts:157 - retryOperation
src/utils/helpers.ts:183 - downloadTripPDF
src/utils/helpers.ts:213 - downloadTripExcel
src/utils/helpers.ts:246 - generateReport
src/utils/helpers.ts:288 - generatePlaceholderReportForMultipleTrips
src/utils/helpers.ts:590 - sortTripsByLoadingDate
src/utils/helpers.ts:617 - formatDateForHeader
src/utils/mapConfig.ts:183 - MapIconType (used in module)
src/utils/mapConfig.ts:259 - TRUCK_ICON
src/utils/mapConfig.ts:302 - getCenterOfLocations
src/utils/mapConfig.ts:319 - getZoomLevelForBounds
src/utils/mapConfig.ts:359 - isGoogleMapsAPILoaded (used in module)
src/utils/mapConfig.ts:360 - loadGoogleMapsScript (used in module)
src/utils/mapConfig.ts:361 - useLoadGoogleMaps (used in module)
src/utils/mapsService.ts:22 - getMapsServiceUrl
src/utils/mapsService.ts:143 - canUseGoogleMaps
src/utils/networkDetection.ts:189 - stopNetworkMonitoring (used in module)
src/utils/networkDetection.ts:223 - default
src/utils/offlineCache.ts:277 - clearExpiredCache (used in module)
src/utils/offlineCache.ts:338 - default
src/utils/offlineOperations.ts:61 - getDocument (used in module)
src/utils/offlineOperations.ts:169 - default
src/utils/pdfGenerators.ts:87 - generateLoadConfirmationPDF
src/utils/placesService.ts:84 - searchNearbyPlaces
src/utils/placesService.ts:125 - getPlaceDetails
src/utils/qrCodeUtils.ts:10 - generateQRValue (used in module)
src/utils/qrCodeUtils.ts:21 - createQRCodeUrl
src/utils/qrCodeUtils.ts:40 - registerQRCode (used in module)
src/utils/qrCodeUtils.ts:71 - processQRCode
src/utils/qrCodeUtils.ts:212 - generateStockItemQR
src/utils/qrCodeUtils.ts:248 - parseQRCodeData
src/utils/sageDataMapping.ts:82 - mapPurchaseOrderToSageFormat
src/utils/sageDataMapping.ts:105 - mapPOItemToSageFormat (used in module)
src/utils/sageDataMapping.ts:122 - mapSageVendorToLocalFormat
src/utils/sageDataMapping.ts:143 - mapSageInventoryToLocalFormat
src/utils/sageDataMapping.ts:10 - SagePurchaseOrder (used in module)
src/utils/sageDataMapping.ts:26 - SagePurchaseOrderItem (used in module)
src/utils/sageDataMapping.ts:39 - SageVendor (used in module)
src/utils/sageDataMapping.ts:53 - SageAddress (used in module)
src/utils/sageDataMapping.ts:62 - SageInventoryItem (used in module)
src/utils/setupEnv.ts:25 - validateEnvironment (used in module)
src/utils/setupEnv.ts:63 - displayEnvironmentStatus
src/utils/setupEnv.ts:120 - getEnvironmentStatusForUI
src/utils/setupEnv.ts:146 - requireEnvironmentVariables
src/utils/setupEnv.ts:10 - checkEnvVariables (used in module)
src/utils/sidebar-validator.ts:123 - findPagesNotInSidebar (used in module)
src/utils/sidebar-validator.ts:123 - generateSidebarSuggestions (used in module)
src/utils/syncService.ts:47 - SyncStatus (used in module)
src/utils/syncService.ts:48 - ConnectionStatus (used in module)
src/utils/syncService.ts:1947 - syncService (used in module)
src/utils/tripDebugger.ts:15 - analyzeTripData
src/utils/tripDebugger.ts:93 - fixTripStatusIssues (used in module)
src/utils/tripDebugger.ts:146 - getTripsByStatus
src/utils/tyreConstants.ts:4 - FleetPositionReference (used in module)
src/utils/tyreConstants.ts:10 - FLEET_POSITIONS (used in module)
src/utils/tyreConstants.ts:60 - getFleetsByVehicleType
src/utils/tyreConstants.ts:64 - getAllFleetNumbers
src/utils/tyreConstants.ts:127 - getUniqueTyreSizes (used in module)
src/utils/tyreConstants.ts:137 - getUniqueTyrePatterns
src/utils/tyreConstants.ts:142 - getTyresByPosition (used in module)
src/utils/tyreConstants.ts:155 - Vendor (used in module)
src/utils/tyreConstants.ts:213 - getVendorsByCity
src/utils/tyreConstants.ts:217 - getVendorById
src/utils/tyreConstants.ts:221 - getVendorsByName
src/utils/tyreConstants.ts:226 - getInventoryItemsByCriteria
src/utils/tyreConstants.ts:264 - generateMockInventory (used in module)
src/utils/tyreConstants.ts:301 - MOCK_INVENTORY (used in module)
src/utils/useTyreStores.tsx:28 - TyreStoresProvider
src/utils/useTyreStores.tsx:49 - useTyreStores
src/utils/webhookSenders.ts:180 - retryWebhookCall (used in module)
src/utils/wialonAuth.ts:13 - loadWialonSDK (used in module)
src/utils/wialonAuth.ts:56 - loginWialon
src/utils/wialonAuth.ts:79 - logoutWialon
src/utils/wialonAuth.ts:98 - getCurrentWialonUser
src/utils/wialonAuth.ts:140 - getUnitAddress
src/utils/wialonConfig.ts:16 - WIALON_LOGIN_URL (used in module)
src/utils/wialonConfig.ts:22 - WIALON_SESSION_TOKEN
src/utils/wialonConfig.ts:29 - getWialonLoginUrlWithToken (used in module)
src/utils/wialonConfig.ts:40 - openWialonLogin
src/utils/wialonLoader.ts:14 - WialonLoadOptions (used in module)
src/utils/wialonLoader.ts:19 - loadWialonSDK (used in module)
src/utils/wialonLoader.ts:89 - initWialonSession
src/utils/wialonLoader.ts:123 - getWialonUnits
src/utils/wialonLoader.ts:149 - isWialonSDKLoaded (used in module)
src/utils/wialonLoader.ts:156 - isWialonSDKLoading (used in module)
src/utils/wialonLoader.ts:163 - getWialonSDKStatus
src/utils/wialonSensorData.ts:9 - WialonSensor (used in module)
src/utils/wialonSensorData.ts:25 - WialonUnitProfile (used in module)
src/utils/wialonSensorData.ts:33 - WialonAVLUnit (used in module)
src/utils/wialonSensorData.ts:259 - getTotalFuelCapacity
src/components/Adminmangement/ActionLog.tsx:723 - default
src/components/common/FleetDropdown.tsx:18 - FleetDropdown (used in module)
src/components/common/FleetDropdown.tsx:68 - default
src/components/common/VehicleSelector.tsx:4 - VehicleSelectorProps (used in module)
src/components/Cost Management/IndirectCostBreakdown.tsx:400 - default
src/components/DieselManagement/DieselDashboardComponent.tsx:364 - default
src/components/DieselManagement/FuelLogs.tsx:248 - default
src/components/DieselManagement/FuelTheftDetection.tsx:296 - default
src/components/DriverManagement/DriverFuelBehavior.tsx:137 - default
src/components/DriverManagement/DriverRewards.tsx:516 - default
src/components/DriverManagement/DriverScheduling.tsx:420 - default
src/components/DriverManagement/DriverViolations.tsx:499 - default
src/components/DriverManagement/HoursOfService.tsx:440 - default
src/components/DriverManagement/LicenseManagement.tsx:342 - default
src/components/DriverManagement/SafetyScores.tsx:260 - default
src/components/DriverManagement/TrainingRecords.tsx:345 - default
src/components/forms/AddFuelEntry.tsx:279 - default
src/components/forms/AdditionalCostsForm.tsx:327 - default
src/components/forms/AddNewDriver.tsx:224 - default
src/components/forms/ClientForm.tsx:485 - default
src/components/forms/CostForm.tsx:431 - default
src/components/forms/CreateInvoice.tsx:217 - default
src/components/forms/DriverInspectionForm.tsx:293 - default
src/components/forms/EditDriver.tsx:478 - default
src/components/forms/FleetSelectionForm.tsx:24 - FleetSelectionData (used in module)
src/components/forms/InspectionForm.tsx:395 - default
src/components/forms/InspectionReportForm.tsx:8 - InspectionItem (used in module)
src/components/forms/InspectionReportForm.tsx:16 - InspectionReport (used in module)
src/components/forms/InventorySelectionForm.tsx:21 - InventorySelectionData (used in module)
src/components/forms/RouteSelectionForm.tsx:20 - RouteSelectionData (used in module)
src/components/forms/TripForm2.tsx:308 - default
src/components/forms/TripPlanningForm.tsx:326 - default
src/components/forms/TyreSelectionForm.tsx:27 - TyreSelectionData (used in module)
src/components/Inventory Management/receive-parts.tsx:228 - default
src/components/InvoiceManagement/InvoiceApprovalFlow.tsx:87 - default
src/components/InvoiceManagement/InvoiceTemplates.tsx:161 - default
src/components/InvoiceManagement/StockManager.tsx:704 - default
src/components/InvoiceManagement/TaxReportExport.tsx:86 - default
src/components/layout/AppLayout.tsx:31 - default
src/components/lists/WebBookTripsList.tsx:13 - default
src/components/Map/WialonMapComponent.tsx:871 - default
src/components/Models/GeofenceModal.tsx:11 - GeofenceModal (used in module)
src/components/Models/GeofenceModal.tsx:54 - default
src/components/testing/GoogleMapsTest.tsx:170 - default
src/components/testing/UIConnector.tsx:84 - UIConnector (used in module)
src/components/testing/UIConnector.tsx:381 - default
src/components/TripManagement/Calendar.tsx:277 - default
src/components/TripManagement/EditDriver.tsx:478 - default
src/components/TripManagement/LoadingIndicator.tsx:47 - default
src/components/TripManagement/LoadPlanningPage.tsx:173 - default
src/components/TripManagement/RouteOptimization.tsx:8 - default
src/components/TripManagement/RouteOptimizationPage.tsx:124 - default
src/components/TripManagement/RoutePlanningPage.tsx:601 - default
src/components/TripManagement/TripCalendarPage.tsx:144 - default
src/components/TripManagement/TripDetails.tsx:761 - default
src/components/TripManagement/TripFinancialsPanel.tsx:523 - default
src/components/TripManagement/TripRouter.tsx:213 - default
src/components/TripManagement/TripTimelineLive.tsx:194 - default
src/components/Tyremanagement/TyreInspection.tsx:102 - TyreConditionStatus (used in module)
src/components/Tyremanagement/TyreInspection.tsx:105 - TyreInspectionData (used in module)
src/components/Tyremanagement/TyreInspection.tsx:1025 - TyreInspectionForm
src/components/Tyremanagement/TyreInspection.tsx:1190 - default
src/components/Tyremanagement/TyreInspectionModal.tsx:15 - TyreInspectionData (used in module)
src/components/Tyremanagement/TyreInventory.tsx:25 - TyreInventory
src/components/Tyremanagement/TyreInventoryDashboard.tsx:559 - default
src/components/Tyremanagement/TyreInventoryManager.tsx:1060 - default
src/components/Tyremanagement/TyreInventoryStats.tsx:76 - default
src/components/Tyremanagement/TyreManagementSystem.tsx:108 - TyreManagementSystem
src/components/Tyremanagement/TyreManagementView.tsx:1236 - default
src/components/Tyremanagement/TyrePerformanceForm.tsx:141 - default
src/components/Tyremanagement/TyreReports.tsx:212 - default
src/components/ui/AntDesignWrapper.tsx:11 - AntD (used in module)
src/components/ui/AntDesignWrapper.tsx:14 - AntDesign (used in module)
src/components/ui/AntDesignWrapper.tsx:42 - default
src/components/ui/badge.tsx:18 - BadgeProps (used in module)
src/components/ui/badge.tsx:86 - default
src/components/ui/Button.tsx:6 - ButtonProps (used in module)
src/components/ui/button.tsx:4 - ButtonProps (used in module)
src/components/ui/button.tsx:62 - DefaultButton
src/components/ui/Calendar.tsx:277 - default
src/components/ui/CardHeader.tsx:40 - default
src/components/ui/form.tsx:33 - default
src/components/ui/form.tsx:2 - FormFieldProps (used in module)
src/components/ui/form.tsx:8 - FormField
src/components/ui/form.tsx:26 - FormItem
src/components/ui/form.tsx:27 - FormLabel
src/components/ui/form.tsx:28 - FormControl
src/components/ui/form.tsx:29 - FormMessage
src/components/ui/FormElements.tsx:189 - default
src/components/ui/index.ts:26 - GenericPlaceholderPage
src/components/ui/InspectionFormPDS.tsx:147 - InspectionFormPDS (used in module)
src/components/ui/JobCardTable.tsx:3 - JobCardTableRow (used in module)
src/components/ui/label.tsx:7 - Label
src/components/ui/Modal.tsx:7 - ModalProps (used in module)
src/components/ui/new-job-card.tsx:27 - default
src/components/ui/Select.tsx:58 - default
src/components/ui/Templates.tsx:8 - default
src/components/ui/UIComponentsDemo.tsx:141 - default
src/components/ui/UIConnector.tsx:358 - default
src/components/ui/UnitsTable.tsx:3 - default
src/components/ui/User.tsx:23 - default
src/components/WorkshopManagement/EnhancedTyreInspectionForm.tsx:484 - default
src/components/WorkshopManagement/FaultTracker.tsx:453 - default
src/components/WorkshopManagement/FleetTable.tsx:332 - default
src/components/WorkshopManagement/InspectionHistory.tsx:319 - default
src/components/WorkshopManagement/PurchaseOrderForm.tsx:7 - PurchaseOrderItem (used in module)
src/components/WorkshopManagement/PurchaseOrderSync.tsx:356 - default
src/components/WorkshopManagement/QRCodeBatchGenerator.tsx:11 - QRCodeBatchGenerator (used in module)
src/components/WorkshopManagement/QRCodeBatchGenerator.tsx:199 - default
src/components/WorkshopManagement/QRGenerator.tsx:372 - default
src/components/WorkshopManagement/receive-parts.tsx:228 - default
src/components/WorkshopManagement/request-parts.tsx:68 - default
src/pages/drivers/DriverDetails.tsx:431 - default
src/pages/drivers/DriverFuelBehavior.tsx:137 - default
src/pages/examples/ClientSelectionExample.jsx:151 - default
src/pages/trips/CreateLoadConfirmationPage.tsx:586 - default
src/components/Map/pages/Maps.tsx:188 - default
src/components/Map/wialon/WialonConfigDisplay.tsx:49 - default
src/components/Map/wialon/WialonConfigPage.tsx:97 - default
src/components/Map/wialon/WialonDashboard.tsx:98 - default
src/components/Map/wialon/WialonDriverManager.tsx:7 - WialonDriverManager
src/components/Map/wialon/WialonGeofenceManager.tsx:12 - WialonGeofenceManager (used in module)
src/components/Map/wialon/WialonGeofenceManager.tsx:117 - default
src/components/Map/wialon/WialonLoginPanel.tsx:8 - WialonLoginPanel (used in module)
src/components/Map/wialon/WialonLoginPanel.tsx:146 - default
src/components/Map/wialon/WialonMapComponent.tsx:227 - default
src/components/Map/wialon/WialonMapDashboard.tsx:47 - default
src/components/Map/wialon/WialonMapPage.tsx:12 - default
src/components/Map/wialon/WialonUnitList.tsx:5 - WialonUnitList (used in module)
src/components/Map/wialon/WialonUnitList.tsx:32 - default
src/components/Map/wialon/WialonUnitsPage.tsx:140 - default
src/components/Models/Diesel/AutomaticProbeVerificationModal.tsx:616 - default
src/components/Models/Diesel/DieselDebriefModal.tsx:401 - default
src/components/Models/Diesel/DieselModel.ts:26 - addDieselRecord
src/components/Models/Diesel/DieselModel.ts:52 - getAllDieselRecords (used in module)
src/components/Models/Diesel/DieselModel.ts:74 - getDieselRecordsForVehicle (used in module)
src/components/Models/Diesel/DieselModel.ts:102 - updateDieselRecord (used in module)
src/components/Models/Diesel/DieselModel.ts:126 - deleteDieselRecord
src/components/Models/Diesel/DieselModel.ts:141 - getDieselRecordById
src/components/Models/Diesel/DieselModel.ts:164 - getDieselRecordsForDateRange
src/components/Models/Diesel/DieselModel.ts:187 - linkDieselToTrip
src/components/Models/Diesel/DieselModel.ts:201 - getAllDieselNorms
src/components/Models/Diesel/DieselModel.ts:223 - upsertDieselNorm
src/components/Models/Diesel/DieselModel.ts:252 - deleteDieselNorm
src/components/Models/Diesel/DieselModel.ts:267 - calculateDieselStats
src/components/Models/Invoice/InvoiceFollowUpModal.tsx:265 - default
src/components/Models/Invoice/InvoiceGenerationModal.tsx:312 - default
src/components/Models/Invoice/InvoiceSubmissionModal.tsx:376 - default
src/components/Models/Invoice/PaymentUpdateModal.tsx:347 - default
src/components/Models/Trips/FleetFormModal.tsx:295 - default
src/components/Models/Trips/LoadImportModal.tsx:553 - default
src/components/Models/Trips/TripDeletionModal.tsx:230 - default
src/components/Models/Trips/TripModel.ts:5 - Trip (used in module)
src/components/Models/Trips/TripModel.ts:16 - addTripToFirebase (used in module)
src/components/Models/Trips/TripModel.ts:17 - updateTripInFirebase (used in module)
src/components/Models/Trips/TripModel.ts:18 - deleteTripFromFirebase (used in module)
src/components/Models/Trips/TripModel.ts:22 - TripService
src/components/Models/Trips/TripStatusUpdateModal.tsx:158 - default
src/components/Models/Trips/TripStatusUpdateModal.tsx:160 - Trip (used in module)
src/components/Models/Tyre/MoveTyreModal.tsx:15 - MoveTyreModal (used in module)
src/components/Models/Tyre/TyreFirestoreConverter.ts:4 - tyreConverter
src/components/Models/Tyre/TyreInspectionModal.tsx:101 - default
src/components/Models/Tyre/TyreModel.ts:16 - TyreSize (used in module)
src/components/Models/Tyre/TyreModel.ts:23 - TyreType (used in module)
src/components/Models/Tyre/TyreModel.ts:37 - TyrePosition
src/components/Models/Tyre/TyreModel.ts:42 - PurchaseDetails (used in module)
src/components/Models/Tyre/TyreModel.ts:50 - Installation (used in module)
src/components/Models/Tyre/TyreModel.ts:58 - TyreCondition (used in module)
src/components/Models/Tyre/TyreModel.ts:67 - TyreRotation (used in module)
src/components/Models/Tyre/TyreModel.ts:77 - TyreRepair (used in module)
src/components/Models/Tyre/TyreModel.ts:87 - TyreInspection (used in module)
src/components/Models/Tyre/TyreModel.ts:100 - MaintenanceHistory (used in module)
src/components/Models/Tyre/TyreModel.ts:107 - TyreStoreLocation (used in module)
src/components/Models/Tyre/TyreModel.ts:114 - TyreStore
src/components/Models/Tyre/TyreModel.ts:122 - StockEntry
src/components/Models/Tyre/TyreModel.ts:130 - TyreStatus (used in module)
src/components/Models/Tyre/TyreModel.ts:131 - TyreMountStatus (used in module)
src/components/Models/Tyre/TyreModel.ts:163 - tyreConverter
src/components/Models/Tyre/TyreModel.ts:202 - addTyreInspection (used in module)
src/components/Models/Tyre/TyreModel.ts:203 - addTyreStore (used in module)
src/components/Models/Tyre/TyreModel.ts:204 - deleteTyre (used in module)
src/components/Models/Tyre/TyreModel.ts:205 - getTyreById (used in module)
src/components/Models/Tyre/TyreModel.ts:206 - getTyreInspections (used in module)
src/components/Models/Tyre/TyreModel.ts:207 - getTyreStats (used in module)
src/components/Models/Tyre/TyreModel.ts:208 - getTyres (used in module)
src/components/Models/Tyre/TyreModel.ts:209 - getTyresByVehicle (used in module)
src/components/Models/Tyre/TyreModel.ts:210 - listenToTyreStores (used in module)
src/components/Models/Tyre/TyreModel.ts:211 - listenToTyres (used in module)
src/components/Models/Tyre/TyreModel.ts:212 - moveTyreStoreEntry (used in module)
src/components/Models/Tyre/TyreModel.ts:213 - saveTyre (used in module)
src/components/Models/Tyre/TyreModel.ts:214 - updateTyreStoreEntry (used in module)
src/components/Models/Tyre/TyreModel.ts:230 - RankedTyre (used in module)
src/components/Models/Tyre/TyreModel.ts:230 - TyreStat (used in module)
src/components/Models/Tyre/TyreModel.ts:232 - filterTyresByPerformance (used in module)
src/components/Models/Tyre/TyreModel.ts:232 - getBestTyres (used in module)
src/components/Models/Tyre/TyreModel.ts:232 - getTyreBrandPerformance (used in module)
src/components/Models/Tyre/TyreModel.ts:232 - getTyrePerformanceStats (used in module)
src/components/Models/Tyre/TyreModel.ts:243 - formatTyreSize (used in module)
src/components/Models/Tyre/TyreModel.ts:244 - parseTyreSize (used in module)
src/components/Models/Tyre/TyreModel.ts:250 - TyreService
src/components/Models/Workshop/JobCardDetailModal.tsx:9 - JobCardDetail (used in module)
src/components/Models/Workshop/JobCardDetailModal.tsx:122 - JobCardDetailModal (used in module)
src/components/Models/Workshop/JobCardDetailModal.tsx:944 - default
src/components/Models/Workshop/MaintenanceModule.tsx:134 - default
src/components/Models/Workshop/PurchaseOrderModal.tsx:3 - POItem (used in module)
src/components/Models/Workshop/PurchaseOrderModal.tsx:14 - PurchaseOrder (used in module)
src/components/Models/Workshop/PurchaseOrderModal.tsx:42 - PurchaseOrderModal
src/components/Models/Workshop/RCAModal.tsx:126 - default
src/components/Models/Workshop/TaskManager.tsx:831 - default
src/components/Map/wialon/models/WialonLoginModal.tsx:4 - default
es need review, and may require choosing
a different dependency.

Run `npm audit` for details.
@heinrichnel ➜ /workspaces/matanuskatp (main) $ npx ts-unused-exports ./tsconfig.json
236 modules with unused exports
/workspaces/matanuskatp/src/AppRoutes.tsx: default
/workspaces/matanuskatp/src/firebaseConfig.ts: firebaseConfig
/workspaces/matanuskatp/src/firebaseEmulators.ts: connectToEmulators, checkEmulatorsStatus
/workspaces/matanuskatp/src/api/firebaseAdmin.ts: db, admin, importInventoryItems, getAllInventoryItems, getInventoryItemById, updateInventoryItem, deleteInventoryItem
/workspaces/matanuskatp/src/api/googlemapsindex.ts: initMap, loadGoogleMapsScript
/workspaces/matanuskatp/src/api/sageIntegration.ts: fetchInventoryFromSage, syncInventoryItemToSage, fetchInventoryItemFromSage, updateInventoryQuantity, deleteInventoryItem, updateInventoryInSage
/workspaces/matanuskatp/src/assets/matanuska-logo-base64.ts: matanuskaLogoBase64
/workspaces/matanuskatp/src/components/DataLoader.tsx: default
/workspaces/matanuskatp/src/components/ErrorBoundary.tsx: withErrorBoundary
/workspaces/matanuskatp/src/components/FleetList.tsx: FleetList, default
/workspaces/matanuskatp/src/components/GeofenceModal.tsx: GeofenceModal, default
/workspaces/matanuskatp/src/components/LazyComponent.tsx: createLazyComponent, default
/workspaces/matanuskatp/src/components/LiveUpdater.tsx: LiveUpdater, default
/workspaces/matanuskatp/src/components/TyreInspectionPDFGenerator.tsx: TyreInspectionPDFGenerator
/workspaces/matanuskatp/src/components/Adminmangement/ActionLog.tsx: default
/workspaces/matanuskatp/src/components/Cost Management/IndirectCostBreakdown.tsx: default
/workspaces/matanuskatp/src/components/DieselManagement/DieselDashboardComponent.tsx: default
/workspaces/matanuskatp/src/components/DieselManagement/FuelLogs.tsx: default
/workspaces/matanuskatp/src/components/DieselManagement/FuelTheftDetection.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/DriverFuelBehavior.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/DriverRewards.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/DriverScheduling.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/DriverViolations.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/HoursOfService.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/LicenseManagement.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/SafetyScores.tsx: default
/workspaces/matanuskatp/src/components/DriverManagement/TrainingRecords.tsx: default
/workspaces/matanuskatp/src/components/Inventory Management/receive-parts.tsx: default
/workspaces/matanuskatp/src/components/InvoiceManagement/InvoiceApprovalFlow.tsx: default
/workspaces/matanuskatp/src/components/InvoiceManagement/InvoiceTemplates.tsx: default
/workspaces/matanuskatp/src/components/InvoiceManagement/StockManager.tsx: default
/workspaces/matanuskatp/src/components/InvoiceManagement/TaxReportExport.tsx: default
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
/workspaces/matanuskatp/src/components/common/FleetDropdown.tsx: FleetDropdown, default
/workspaces/matanuskatp/src/components/common/VehicleSelector.tsx: VehicleSelectorProps
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
/workspaces/matanuskatp/src/components/layout/AppLayout.tsx: default
/workspaces/matanuskatp/src/components/lists/WebBookTripsList.tsx: default
/workspaces/matanuskatp/src/components/testing/GoogleMapsTest.tsx: default
/workspaces/matanuskatp/src/components/testing/UIConnector.tsx: UIConnector, default
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
/workspaces/matanuskatp/src/config/capacitor.config.ts: default
/workspaces/matanuskatp/src/config/cloudRunEndpoints.ts: MAPS_SERVICE_URL, CLOUD_RUN_ENDPOINTS, getBestCloudRunEndpoint, getAllCloudRunEndpoints
/workspaces/matanuskatp/src/config/routeIntegration.ts: validateRouteToComponent, findDuplicateRoutes, analyzeFunctionalCoverage, generateIntegrationReport
/workspaces/matanuskatp/src/config/routeUtils.ts: getSidebarItemsBySection, generateRoutesFromSidebar, findSidebarItemByPath, getBreadcrumbsFromPath
/workspaces/matanuskatp/src/config/tripWorkflowConfig.ts: WorkflowStep, TripWorkflowConfig, getWorkflowStep, getNextStep, getPreviousStep
/workspaces/matanuskatp/src/context/DriverBehaviorContext.tsx: DriverBehaviorEvent
/workspaces/matanuskatp/src/context/InventoryContext.tsx: useInventory, InventoryProvider
/workspaces/matanuskatp/src/context/SyncContext.tsx: useTripSync
/workspaces/matanuskatp/src/context/TripContext.tsx: Trip, useTrips
/workspaces/matanuskatp/src/context/WialonContext.tsx: WialonUnit, WialonContextType
/workspaces/matanuskatp/src/context/WialonProvider.tsx: WialonContext, WialonProvider, useWialon
/workspaces/matanuskatp/src/context/WorkshopContext.tsx: PurchaseOrderItem, PurchaseOrder
/workspaces/matanuskatp/src/data/PrivacyPolicy.tsx: default
/workspaces/matanuskatp/src/data/faultData.ts: FaultCategory, FaultSubcategory, FaultSeverity, FaultStatus, Fault, faultCategories, findSubcategory, findCategory, default
/workspaces/matanuskatp/src/data/index.ts: Vehicle, FleetStats, VehicleFilters, FLEET_VEHICLES, getVehicleByFleetNo, getVehicleByRegistration, getActiveVehicles, getVehiclesByType, getVehiclesByCategory, getVehiclesBySeries, getVehiclesByManufacturer, getVehiclesByStatus, searchVehicles, filterVehicles, getFleetStats, InspectionItem, InspectionTemplate, preTrip, mechanicInspection, trailerInspection, inspectionTemplates, tyreTypes, TyreType, TyreStoreLocation, TyreConditionStatus, TyreSize, TyreCondition, TyrePurchaseDetails, TyreInstallation, TyreInspectionEntry, TyreMaintenanceHistory, TyreStatus, TyreMountStatus, Tyre, TYRE_SIZES, TYRE_BRANDS, TYRE_PATTERNS, SAMPLE_TYRES, formatTyreSize, parseTyreSize
/workspaces/matanuskatp/src/data/jobCardTemplates.ts: JobCardTaskItem, JobCardTemplate, ServiceInterval, service15k, service50k, brakeRepair, jobCardTemplates, serviceIntervals, default
/workspaces/matanuskatp/src/data/userDirectory.ts: USER_DIRECTORY, getUserById, getUsersByRole, getTechnicians, getOperators
/workspaces/matanuskatp/src/firebase/tyreStores.ts: default
/workspaces/matanuskatp/src/firebase/tyres.ts: default
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
/workspaces/matanuskatp/src/lib/currency.ts: currencySymbols
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
/workspaces/matanuskatp/src/types/client.ts: createNewClient, addClientRelationship
/workspaces/matanuskatp/src/types/index.ts: InvoiceAging, CustomerPerformance, TruckPerformance, ActionItemComment, SyncEvent, AppVersion, Driver, SystemCostRates, SystemCostReminder, TripEditRecord, UserPermission, NoUserPermissionAllowed, RoutePoint, TRUCKS_WITH_PROBES, CLIENT_TYPES, DELAY_REASON_TYPES, JobCard, Invoice, InvoiceItem, FleetVehicle, CAR_INCIDENT_TYPES, DEFAULT_SYSTEM_COST_RATES, DEFAULT_SYSTEM_COST_REMINDER, TRIP_EDIT_REASONS, TRIP_TEMPLATE_CATEGORIES, TripFormData, AGING_THRESHOLDS, FOLLOW_UP_THRESHOLDS, TyreInspection, TyreInventory
/workspaces/matanuskatp/src/types/inventory.ts: VendorScore, PurchaseOrderRequest, RequestItem, POApproval, IntegrationSettings, SyncLog
/workspaces/matanuskatp/src/types/invoice.ts: InvoiceData, FollowUpRecord, InvoiceAging, AGING_THRESHOLDS, FOLLOW_UP_THRESHOLDS, PaymentUpdateData, FollowUpData
/workspaces/matanuskatp/src/types/loadPlanning.ts: LoadPlan, CargoItem, LOAD_CATEGORIES
/workspaces/matanuskatp/src/types/mapTypes.ts: MapIconType, MapStyle
/workspaces/matanuskatp/src/types/tyre-inspection.ts: TyreInspectionData, calculateCostPerKm, calculateRemainingTreadLifeKm
/workspaces/matanuskatp/src/types/tyre.ts: TyreSize, TyreRotation, TyreRepair, TyreType, milesToKm
/workspaces/matanuskatp/src/types/vehicle.ts: VehicleStatus, VehicleType, VehicleCategory, VehicleSeries, Inspection
/workspaces/matanuskatp/src/types/workshop-job-card.ts: JobCardItem, WorkOrderInfo, VehicleAssetDetails, LinkedRecords, SchedulingInfo, TaskDetail, PartsAndMaterial, LaborDetail, AdditionalCost, CostSummary, CustomBusinessField
/workspaces/matanuskatp/src/types/workshop-tyre-inventory.ts: TyreInspection, TyreSize, TyreCondition, TyreInspectionEntry, EnhancedTyre, RCAData, TimeLogEntry, Attachment, Remark, PORequest, JobCardItem, JobCard, WorkOrder, TaskEntry, PartEntry, LaborEntry, TyreInventoryItem, VehicleTyreConfiguration, InventoryItem, JobCardStatus, WorkOrderStatus, Priority, TaskStatus, TyreStatus, TyreMountStatus, TyreType, TyrePosition, parseTyreSizeFromString, determineTyreType, mapLegacyStatusToConditionStatus, mapLegacyStatusToTyreStatus, getSizeString, getInstallDetails, getLegacyStatus, convertToEnhancedTyre, convertToLegacyTyre
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
/workspaces/matanuskatp/src/utils/helpers.ts: shouldAutoCompleteTrip, filterTripsByDateRange, filterTripsByClient, filterTripsByCurrency, filterTripsByDriver, isOnline, retryOperation, downloadTripPDF, downloadTripExcel, generateReport, generatePlaceholderReportForMultipleTrips, sortTripsByLoadingDate, formatDateForHeader
/workspaces/matanuskatp/src/utils/mapConfig.ts: MapIconType, TRUCK_ICON, getCenterOfLocations, getZoomLevelForBounds, isGoogleMapsAPILoaded, loadGoogleMapsScript, useLoadGoogleMaps
/workspaces/matanuskatp/src/utils/mapsService.ts: getMapsServiceUrl, canUseGoogleMaps
/workspaces/matanuskatp/src/utils/networkDetection.ts: stopNetworkMonitoring, default
/workspaces/matanuskatp/src/utils/offlineCache.ts: clearExpiredCache, default
/workspaces/matanuskatp/src/utils/offlineOperations.ts: getDocument, default
/workspaces/matanuskatp/src/utils/pdfGenerators.ts: generateLoadConfirmationPDF
/workspaces/matanuskatp/src/utils/placesService.ts: searchNearbyPlaces, getPlaceDetails
/workspaces/matanuskatp/src/utils/qrCodeUtils.ts: generateQRValue, createQRCodeUrl, registerQRCode, processQRCode, generateStockItemQR, parseQRCodeData
/workspaces/matanuskatp/src/utils/sageDataMapping.ts: SagePurchaseOrder, SagePurchaseOrderItem, SageVendor, SageAddress, SageInventoryItem, mapPurchaseOrderToSageFormat, mapPOItemToSageFormat, mapSageVendorToLocalFormat, mapSageInventoryToLocalFormat
/workspaces/matanuskatp/src/utils/setupEnv.ts: checkEnvVariables, validateEnvironment, displayEnvironmentStatus, getEnvironmentStatusForUI, requireEnvironmentVariables
/workspaces/matanuskatp/src/utils/sidebar-validator.ts: findPagesNotInSidebar, generateSidebarSuggestions
/workspaces/matanuskatp/src/utils/syncService.ts: SyncStatus, ConnectionStatus, syncService
/workspaces/matanuskatp/src/utils/tripDebugger.ts: analyzeTripData, fixTripStatusIssues, getTripsByStatus
/workspaces/matanuskatp/src/utils/tyreConstants.ts: FleetPositionReference, FLEET_POSITIONS, getFleetsByVehicleType, getAllFleetNumbers, getUniqueTyreSizes, getUniqueTyrePatterns, getTyresByPosition, Vendor, getVendorsByCity, getVendorById, getVendorsByName, getInventoryItemsByCriteria, generateMockInventory, MOCK_INVENTORY
/workspaces/matanuskatp/src/utils/useTyreStores.tsx: TyreStoresProvider, useTyreStores
/workspaces/matanuskatp/src/utils/webhookSenders.ts: retryWebhookCall
/workspaces/matanuskatp/src/utils/wialonAuth.ts: loadWialonSDK, loginWialon, logoutWialon, getCurrentWialonUser, getUnitAddress
/workspaces/matanuskatp/src/utils/wialonConfig.ts: WIALON_LOGIN_URL, WIALON_SESSION_TOKEN, getWialonLoginUrlWithToken, openWialonLogin
/workspaces/matanuskatp/src/utils/wialonLoader.ts: WialonLoadOptions, loadWialonSDK, initWialonSession, getWialonUnits, isWialonSDKLoaded, isWialonSDKLoading, getWialonSDKStatus
/workspaces/matanuskatp/src/utils/wialonSensorData.ts: WialonSensor, WialonUnitProfile, WialonAVLUnit, getTotalFuelCapacity
@heinrichnel ➜ /workspaces/matanuskatp (main) $


export const myFunction = ... or export default MyComponent), it makes that item available for other files to import. If ts-unused-exports reports an unused export, it means:

The exported item is genuinely unused: It's old code, a feature that was removed, or a temporary export that was never cleaned up.

The exported item is used, but ts-unused-exports can't detect it: This is less common but can happen with very dynamic imports, external libraries that consume your code in specific ways (like a UI library consuming a component via a string name), or issues with the tool's configuration.

The exported item is part of a public API or library: If your monorepo has packages that are intended to be consumed by apps or other packages, ts-unused-exports might report exports from packages as "unused" if they are only consumed outside the scope of the tsconfig.json it's analyzing (e.g., by another project or a build process).

Examples from your output:

/workspaces/matanuskatp/src/AppRoutes.tsx: default

This is a strong indication that your AppRoutes.tsx is exporting a default component, but App.tsx (or whichever file should import it) is not importing or using it as a component. Given our previous refactoring to use AppRoutes, this is a critical finding and needs to be addressed immediately by ensuring App.tsx correctly imports and renders <AppRoutes />.

/workspaces/matanuskatp/src/firebaseConfig.ts: firebaseConfig

Likely your Firebase initialization object. If it's exported but never used, your Firebase connection might not be initializing.

/workspaces/matanuskatp/src/api/firebaseAdmin.ts: db, admin, importInventoryItems, ...

This is a big one. It suggests your Firebase Admin SDK instances and related functions are not being used in your frontend, which is expected (Firebase Admin should only be used on a secure backend/Cloud Functions). If this file is intended for your frontend, it's problematic. If it's for a backend (like your Express API), then ts-unused-exports is analyzing it in the frontend context, and you should exclude it from the frontend tsconfig.json analysis.

/workspaces/matanuskatp/src/components/Models/Diesel/DieselModel.ts: addDieselRecord, getAllDieselRecords, ...

This suggests your core data service functions for Diesel are not being called by your UI. This is a critical functional issue if those modules are supposed to be active.

/workspaces/matanuskatp/src/components/Models/Tyre/TyreModel.ts: TyreSize, TyreType, TyreService, ...

Similar to the Diesel model, your Tyre service functions or core Tyre types are not being used.

/workspaces/matanuskatp/src/components/TripManagement/TripRouter.tsx: default

This confirms our earlier suspicion that TripRouter.tsx is likely dead code, as it's no longer used since routing was centralized in AppRoutes.tsx.

What You Need To Do
This report is a goldmine for code quality and maintainability! You have a lot of dead code or unintegrated functionality.

1. Address npm audit findings
First, run npm audit as suggested. This is separate but related to dependency health.

Bash

npm audit
Follow its recommendations to update or remove vulnerable dependencies.

2. Prioritize and Investigate Unused Exports
This requires a systematic approach. Don't delete everything immediately!

A. Critical (Highest Priority): Core Functionality and Routing

src/AppRoutes.tsx: default:

Action: Go to your src/App.tsx. Ensure you have:

TypeScript

import AppRoutes from './AppRoutes'; // Correct import
// ...
<BrowserRouter>
    <Layout /* ... */ >
        <AppRoutes /> {/* Ensure this is being rendered */}
    </Layout>
</BrowserRouter>
If AppRoutes isn't rendered, your entire application routing from sidebarConfig isn't being used. This is your most pressing issue if your app isn't routing correctly.

src/firebaseConfig.ts: firebaseConfig:

Action: Ensure your firebase.ts or main.tsx correctly imports and initializes Firebase using this config.

Data Models & Services (e.g., DieselModel.ts, TyreModel.ts, firebaseAdmin.ts functions):

Action: These are crucial. If addDieselRecord or saveTyre are unused, it means your UI isn't interacting with your backend data.

Investigate: For each of these, trace where they should be used. If your frontend isn't using firebaseAdmin.ts (which is typically for Node.js backends), consider if that file should be:

Moved to your apps/backend project.

Excluded from the ts-unused-exports check for your frontend tsconfig.json.

src/api/googlemapsindex.ts: initMap, loadGoogleMapsScript:

Action: Verify if googleMapsLoader.ts or GoogleMapComponent.tsx correctly import and use these. If your maps aren't initializing, this is why.

B. UI Components & Pages (Middle Priority):

Components exported as default (e.g., DataLoader.tsx, GeofenceModal.tsx, FuelLogs.tsx):

Action: These are usually React components. Check where they are expected to be used. If they are route targets, ensure they are in your sidebarConfig.ts and AppRoutes.tsx is rendering them. If they are sub-components, ensure their parent components are importing and rendering them.

Common Issue: If a component is exported default, but another file imports it as { MyComponent } instead of import MyComponent from './MyComponent';, ts-unused-exports will flag the default export as unused (and potentially the named export MyComponent as unused too).

Duplicate Named Files: You have duplicates like FuelLogs.tsx in components/DieselManagement and pages/diesel.

Action: This is a strong indicator of actual dead code. Decide which is the canonical version, update all imports to point to it, and then delete the unused duplicate. Your sidebarConfig should only point to the canonical page file.

C. Utilities & Configurations (Lower Priority, but still important):

src/utils/errorHandling.ts: createAppError, safeExecute, getStackTrace, default:

Action: Ensure your handleError implementation and other parts of your app are correctly using these exported functions. The default export might be missed if you're importing named exports only.

Constants & Types (e.g., src/utils/tyreConstants.ts: FleetPositionReference):

Action: Verify if these types or constants are actually used where they're defined to be relevant.

src/types/index.ts exports: If index.ts is just re-exporting things, and those things aren't then imported from index.ts, they'll be flagged. This is common when refactoring imports.

3. How to Clean Up
For each unused export:

Find where it should be used: Use your IDE's "Find All References" feature on the exported name. If it finds nothing, it's truly unused.

If it's truly unused (and not a public API):

Delete it: Remove the export statement, or the entire function/component if it's not used internally either.

Remove the file: If the entire file is dead, delete it.

If it should be used:

Fix the import: Correct the import statement in the file that's supposed to use it.

Integrate the component/function: Ensure the component is rendered or the function is called where it's needed.

If it's a public API for another package in your monorepo:

Exclude it from the ts-unused-exports check for this tsconfig.json if the tool doesn't support monorepo consumption analysis out-of-the-box. This usually involves adjusting the include or exclude paths in your tsconfig.json or creating a separate tsconfig.json for each package.

This ts-unused-exports report is giving you a powerful list of tasks to improve your project's health. Tackling it systematically will greatly enhance its maintainability and performance.
