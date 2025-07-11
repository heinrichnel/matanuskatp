// Sidebar menu configuration for mapping menu options to routes and components
// Matanuska Transport Platform (2025) - Unified Routing & Sidebar Mapping
export interface SidebarItem {
  id: string;
  label: string;
  path: string;
  component: string; // import path
  icon?: string;
  subComponents?: string[]; // Additional components that might be needed by this menu item
}

export const sidebarConfig: SidebarItem[] = [
  // A. Trip/Route Management
  { 
    id: 'route-planning', 
    label: 'Route Planning', 
    path: '/trips/route-planning', 
    component: 'pages/RoutePlanningPage' 
  },
  { 
    id: 'route-optimization', 
    label: 'Route Optimization', 
    path: '/trips/optimization', 
    component: 'pages/trips/RouteOptimizationPage',
    subComponents: ['components/TripManagement/OptimizedRouteSuggestion']
  },
  { 
    id: 'load-planning', 
    label: 'Load Planning', 
    path: '/trips/load-planning', 
    component: 'pages/trips/LoadPlanningPage',
    subComponents: ['components/TripManagement/LoadPlanningComponent']
  },
  { 
    id: 'add-new-trip', 
    label: 'Add New Trip', 
    path: '/trips/new', 
    component: 'pages/trips/AddTripPage',
    subComponents: ['components/TripManagement/TripForm']
  },
  { 
    id: 'trip-calendar', 
    label: 'Trip Calendar', 
    path: '/trips/calendar', 
    component: 'pages/trips/TripCalendarPage' 
  },
  { 
    id: 'driver-performance', 
    label: 'Driver Performance', 
    path: '/trips/driver-performance', 
    component: 'pages/trips/DriverPerformancePage',
    subComponents: ['components/DriverManagement/DriverPerformanceOverview']
  },
  { 
    id: 'trip-cost-analysis', 
    label: 'Trip Cost Analysis', 
    path: '/trips/cost-analysis', 
    component: 'pages/trips/CostAnalysisPage',
    subComponents: ['components/TripManagement/TripFinancialsPanel']
  },
  { 
    id: 'fleet-utilization', 
    label: 'Fleet Utilization', 
    path: '/trips/utilization', 
    component: 'pages/trips/FleetUtilization',
    subComponents: ['components/TripManagement/FleetUtilizationHeatmap']
  },
  { 
    id: 'delivery-confirmations', 
    label: 'Delivery Confirmations', 
    path: '/trips/confirmations', 
    component: 'pages/trips/DeliveryConfirmations',
    subComponents: ['components/TripManagement/DeliveryConfirmationPanel']
  },
  { 
    id: 'trip-templates', 
    label: 'Trip Templates', 
    path: '/trips/templates', 
    component: 'pages/trips/Templates',
    subComponents: ['components/TripManagement/TripTemplateManager']
  },
  { 
    id: 'trip-reports', 
    label: 'Trip Reports', 
    path: '/trips/reports', 
    component: 'pages/trips/TripReportPage',
    subComponents: ['components/TripManagement/TripReport']
  },
  { 
    id: 'maps-tracking', 
    label: 'Maps & Tracking', 
    path: '/trips/maps', 
    component: 'pages/trips/Maps',
    subComponents: ['components/maps/EzytrackEmbed', 'components/maps/MapsView']
  },
  { 
    id: 'wialon-tracking', 
    label: 'Wialon Tracking', 
    path: '/trips/wialon-tracking', 
    component: 'pages/WialonMapPage',
    subComponents: ['components/maps/WialonMapDashboard', 'components/WialonLoginPanel']
  },

  // B. Invoice Management
  { 
    id: 'invoice-dashboard', 
    label: 'Invoice Dashboard', 
    path: '/invoices', 
    component: 'components/InvoiceManagement/InvoiceDashboard' 
  },
  { 
    id: 'create-invoice', 
    label: 'Create Invoice', 
    path: '/invoices/new', 
    component: 'pages/invoices/CreateInvoice',
    subComponents: ['components/InvoiceManagement/InvoiceBuilder']
  },
  { 
    id: 'pending-invoices', 
    label: 'Pending Invoices', 
    path: '/invoices/pending', 
    component: 'pages/invoices/PendingInvoices' 
  },
  { 
    id: 'paid-invoices', 
    label: 'Paid Invoices', 
    path: '/invoices/paid', 
    component: 'pages/invoices/PaidInvoices' 
  },
  { 
    id: 'invoice-approval', 
    label: 'Invoice Approval', 
    path: '/invoices/approval', 
    component: 'components/InvoiceManagement/InvoiceApprovalFlow' 
  },
  { 
    id: 'payment-reminders', 
    label: 'Payment Reminders', 
    path: '/invoices/reminders', 
    component: 'components/InvoiceManagement/PaymentUpdateModal' 
  },
  { 
    id: 'invoice-templates', 
    label: 'Invoice Templates', 
    path: '/invoices/templates', 
    component: 'components/InvoiceManagement/InvoiceTemplateStore' 
  },
  { 
    id: 'tax-reports', 
    label: 'Tax Reports', 
    path: '/invoices/tax-reports', 
    component: 'components/InvoiceManagement/TaxReportExport' 
  },
  { 
    id: 'invoice-analytics', 
    label: 'Invoice Analytics', 
    path: '/invoices/analytics', 
    component: 'components/InvoiceManagement/InvoiceAgingDashboard' 
  },

  // C. Diesel Management
  { 
    id: 'diesel-dashboard', 
    label: 'Diesel Dashboard', 
    path: '/diesel', 
    component: 'components/diesel/DieselDashboard',
    subComponents: ['components/DieselManagement/DieselDashboardComponent']
  },
  { 
    id: 'fuel-logs', 
    label: 'Fuel Logs', 
    path: '/diesel/logs', 
    component: 'pages/diesel/FuelLogs',
    subComponents: ['components/DieselManagement/FuelLogs']
  },
  { 
    id: 'add-fuel-entry', 
    label: 'Add Fuel Entry', 
    path: '/diesel/new', 
    component: 'pages/diesel/AddFuelEntry',
    subComponents: ['components/diesel/ManualDieselEntryModal']
  },
  { 
    id: 'fuel-card-management', 
    label: 'Fuel Card Management', 
    path: '/diesel/fuel-cards', 
    component: 'components/DieselManagement/FuelCardManager' 
  },
  { 
    id: 'fuel-analytics', 
    label: 'Fuel Analytics', 
    path: '/diesel/analytics', 
    component: 'components/DieselManagement/FuelEfficiencyReport',
    subComponents: ['components/diesel/DieselAnalysis']
  },
  { 
    id: 'cost-analysis', 
    label: 'Cost Analysis', 
    path: '/diesel/costs', 
    component: 'pages/trips/CostAnalysisPage',
    subComponents: ['components/Cost Management/IndirectCost']
  },
  { 
    id: 'efficiency-reports', 
    label: 'Efficiency Reports', 
    path: '/diesel/efficiency', 
    component: 'components/DieselManagement/FuelEfficiencyReport' 
  },
  { 
    id: 'fuel-theft-detection', 
    label: 'Fuel Theft Detection', 
    path: '/diesel/theft-detection', 
    component: 'components/DieselManagement/FuelTheftDetection' 
  },
  { 
    id: 'carbon-footprint', 
    label: 'Carbon Footprint', 
    path: '/diesel/carbon-tracking', 
    component: 'components/DieselManagement/CarbonFootprintCalc' 
  },
  { 
    id: 'driver-fuel-behavior', 
    label: 'Driver Fuel Behavior', 
    path: '/diesel/driver-behavior', 
    component: 'components/DieselManagement/DriverFuelBehavior' 
  },

  // D. Customer Management
  { 
    id: 'customer-dashboard', 
    label: 'Customer Dashboard', 
    path: '/clients', 
    component: 'components/CustomerManagement/CustomerDashboard' 
  },
  { 
    id: 'add-new-customer', 
    label: 'Add New Customer', 
    path: '/clients/new', 
    component: 'pages/clients/AddNewCustomer' 
  },
  { 
    id: 'active-customers', 
    label: 'Active Customers', 
    path: '/clients/active', 
    component: 'pages/clients/ActiveCustomers' 
  },
  { 
    id: 'customer-reports', 
    label: 'Customer Reports', 
    path: '/clients/reports', 
    component: 'pages/clients/CustomerReports',
    subComponents: ['components/CustomerManagement/CustomerReports']
  },
  { 
    id: 'customer-retention', 
    label: 'Customer Retention', 
    path: '/customers/retention', 
    component: 'components/CustomerManagement/RetentionMetrics',
    subComponents: ['components/performance/CustomerRetentionDashboard']
  },
  { 
    id: 'client-relationships', 
    label: 'Client Relationships', 
    path: '/clients/relationships', 
    component: 'components/clients/ClientRelationships' 
  },

  // E. Driver Management
  { 
    id: 'driver-dashboard', 
    label: 'Driver Dashboard', 
    path: '/drivers', 
    component: 'components/DriverManagement/DriverDashboard' 
  },
  { 
    id: 'add-new-driver', 
    label: 'Add New Driver', 
    path: '/drivers/new', 
    component: 'pages/drivers/AddNewDriver' 
  },
  { 
    id: 'driver-profiles', 
    label: 'Driver Profiles', 
    path: '/drivers/profiles', 
    component: 'pages/drivers/DriverProfiles' 
  },
  { 
    id: 'driver-performance-analytics', 
    label: 'Performance Analytics', 
    path: '/drivers/performance', 
    component: 'components/DriverManagement/DriverPerformanceOverview' 
  },
  { 
    id: 'driver-violations', 
    label: 'Driver Violations', 
    path: '/drivers/violations', 
    component: 'components/DriverManagement/DriverBehaviorEvents' 
  },
  { 
    id: 'driver-behavior-analytics', 
    label: 'Driver Behavior Analytics', 
    path: '/drivers/behavior', 
    component: 'components/DriverManagement/DriverBehaviorEventDetails' 
  },

  // F. Compliance & Safety
  { 
    id: 'compliance-dashboard', 
    label: 'Compliance Dashboard', 
    path: '/compliance', 
    component: 'components/ComplianceSafety/ComplianceDashboard' 
  },
  { 
    id: 'safety-inspections', 
    label: 'Safety Inspections', 
    path: '/compliance/inspections', 
    component: 'components/Workshop Management/InspectionList',
    subComponents: ['components/Workshop Management/InspectionReportForm']
  },
  { 
    id: 'incident-reports', 
    label: 'Incident Reports', 
    path: '/compliance/incidents', 
    component: 'components/ComplianceSafety/IncidentReportForm' 
  },
  { 
    id: 'audit-management', 
    label: 'Audit Management', 
    path: '/compliance/audits', 
    component: 'components/audit/AuditLog',
    subComponents: ['pages/AuditLogPage']
  },

  // G. Workshop Management
  { 
    id: 'fleet-setup', 
    label: 'Fleet Setup', 
    path: '/workshop/fleet-setup', 
    component: 'components/Workshop Management/FleetFormModal',
    subComponents: ['components/Workshop Management/FleetSelector', 'components/Workshop Management/FleetTable']
  },
  { 
    id: 'qr-generator', 
    label: 'QR Generator', 
    path: '/workshop/qr-generator', 
    component: 'components/Workshop Management/QRGenerator' 
  },
  { 
    id: 'workshop-inspections', 
    label: 'Inspections', 
    path: '/workshop/inspections', 
    component: 'components/Workshop Management/InspectionList',
    subComponents: ['components/Workshop Management/InspectionForm']
  },
  { 
    id: 'job-cards', 
    label: 'Job Cards', 
    path: '/workshop/job-cards', 
    component: 'components/Workshop Management/JobCardManagement',
    subComponents: ['components/Workshop Management/JobCardKanbanBoard']
  },
  { 
    id: 'faults', 
    label: 'Faults', 
    path: '/workshop/faults', 
    component: 'components/Workshop Management/FaultManagement',
    subComponents: ['components/Workshop Management/FaultTracker']
  },
  { 
    id: 'workshop-tyres', 
    label: 'Tyres', 
    path: '/workshop/tyres', 
    component: 'components/Workshop Management/TyreDashboard',
    subComponents: ['components/Workshop Management/TyreInspectionModal']
  },
  { 
    id: 'workshop-inventory', 
    label: 'Inventory', 
    path: '/workshop/inventory', 
    component: 'components/Workshop Management/InventoryPanel',
    subComponents: ['components/Inventory Management/StockManager']
  },
  { 
    id: 'workshop-vendors', 
    label: 'Vendors', 
    path: '/workshop/vendors', 
    component: 'components/Inventory Management/VendorScorecard' 
  },
  { 
    id: 'workshop-analytics', 
    label: 'Analytics', 
    path: '/workshop/analytics', 
    component: 'components/Workshop Management/WorkshopAnalytics',
    subComponents: ['components/FleetAnalytics/AnalyticsDashboard']
  },
  { 
    id: 'workshop-reports', 
    label: 'Reports', 
    path: '/workshop/reports', 
    component: 'components/Workshop Management/InspectionReportForm',
    subComponents: ['components/FleetAnalytics/AdHocReportBuilder']
  },

  // H. Tyre Management
  { 
    id: 'tyre-dashboard', 
    label: 'Tyre Dashboard', 
    path: '/tyres', 
    component: 'components/TyreManagement/TyreDashboard' 
  },
  { 
    id: 'tyre-inspection', 
    label: 'Tyre Inspection', 
    path: '/tyres/inspection', 
    component: 'components/TyreManagement/TyreInspection' 
  },
  { 
    id: 'tyre-inventory', 
    label: 'Tyre Inventory', 
    path: '/tyres/inventory', 
    component: 'components/TyreManagement/TyreInventory',
    subComponents: ['components/TyreManagement/TyreInventoryDashboard']
  },
  { 
    id: 'tyre-reports', 
    label: 'Tyre Reports', 
    path: '/tyres/reports', 
    component: 'components/TyreManagement/TyreReports',
    subComponents: ['components/TyreManagement/TyreReportGenerator']
  },

  // I. Inventory Management
  { 
    id: 'inventory-dashboard', 
    label: 'Inventory Dashboard', 
    path: '/inventory', 
    component: 'components/Inventory Management/InventoryDashboard' 
  },
  { 
    id: 'stock-management', 
    label: 'Stock Management', 
    path: '/inventory/stock', 
    component: 'components/Inventory Management/StockManager' 
  },
  { 
    id: 'inventory-reports', 
    label: 'Inventory Reports', 
    path: '/inventory/reports', 
    component: 'components/Inventory Management/IndirectCostBreakdown' 
  }
];

// For CommonJS compatibility with scripts
module.exports = { sidebarConfig };
