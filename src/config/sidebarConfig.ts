// Sidebar menu configuration for mapping menu options to routes and components
// Matanuska Transport Platform (2025) - Unified Routing & Sidebar Mapping
export interface SidebarItem {
  id: string;
  label: string;
  path: string;
  component: string; // import path
  icon?: string;
  children?: SidebarItem[]; // For hierarchical navigation
  subComponents?: string[]; // Additional components that might be needed by this menu item
}

export const sidebarConfig: SidebarItem[] = [
  // Dashboard
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    component: 'pages/DashboardPage',
    icon: 'chart-bar'
  },
  
  // Trip Management Section
  {
    id: 'trip-management',
    label: 'Trip Management',
    path: '/trips',
    component: 'pages/trips/TripManagementPage',
    icon: 'truck',
    children: [
      {
        id: 'active-trips',
        label: 'Active Trips',
        path: '/trips/active',
        component: 'pages/trips/ActiveTripsPage'
      },
      {
        id: 'completed-trips',
        label: 'Completed Trips',
        path: '/trips/completed',
        component: 'pages/trips/CompletedTrips'
      },
      { 
        id: 'route-planning', 
        label: 'Route Planning', 
        path: '/trips/route-planning', 
        component: 'pages/trips/RoutePlanningPage' 
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
        id: 'trip-calendar', 
        label: 'Trip Calendar', 
        path: '/trips/calendar', 
        component: 'pages/trips/TripCalendarPage' 
      },
      { 
        id: 'add-trip', 
        label: 'Add New Trip', 
        path: '/trips/new', 
        component: 'pages/trips/AddTripPage',
        subComponents: ['components/TripManagement/TripForm']
      },
      { 
        id: 'driver-performance', 
        label: 'Driver Performance', 
        path: '/trips/driver-performance', 
        component: 'pages/trips/DriverPerformancePage',
        subComponents: ['components/DriverManagement/DriverPerformanceOverview']
      },
      { 
        id: 'cost-analysis', 
        label: 'Cost Analysis', 
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
        subComponents: ['components/maps/EzytrackEmbed', 'components/maps/MapsView'],
        children: [
          {
            id: 'fleet-location',
            label: 'Fleet Location',
            path: '/trips/fleet-location',
            component: 'pages/trips/FleetLocationMapPage'
          },
          {
            id: 'wialon-tracking',
            label: 'Wialon Tracking',
            path: '/trips/wialon-tracking',
            component: 'pages/wialon/WialonMapPage'
          }
        ]
      }
    ]
  },

  // Invoice Management Section
  {
    id: 'invoices',
    label: 'Invoices',
    path: '/invoices',
    component: 'pages/invoices/InvoiceManagementPage',
    icon: 'file-invoice',
    children: [
      { 
        id: 'invoice-dashboard', 
        label: 'Dashboard', 
        path: '/invoices/dashboard', 
        component: 'pages/invoices/InvoiceDashboard' 
      },
      { 
        id: 'create-invoice', 
        label: 'Create New', 
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
      }
    ]
  },

  // Diesel Management Section
  {
    id: 'diesel',
    label: 'Diesel Management',
    path: '/diesel',
    component: 'pages/diesel/DieselManagementPage',
    icon: 'gas-pump',
    children: [
      { 
        id: 'diesel-dashboard', 
        label: 'Dashboard', 
        path: '/diesel/dashboard', 
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
        label: 'Add New Entry', 
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
        id: 'fuel-stations', 
        label: 'Fuel Stations', 
        path: '/diesel/stations', 
        component: 'pages/diesel/FuelStations' 
      },
      { 
        id: 'diesel-cost-analysis', 
        label: 'Cost Analysis', 
        path: '/diesel/costs', 
        component: 'pages/diesel/CostAnalysis',
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
        label: 'Theft Detection', 
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
        label: 'Driver Behavior', 
        path: '/diesel/driver-behavior', 
        component: 'components/DieselManagement/DriverFuelBehavior' 
      }
    ]
  },
  // Clients Section
  {
    id: 'clients',
    label: 'Clients',
    path: '/clients',
    component: 'pages/clients/ClientManagementPage',
    icon: 'users',
    children: [
      { 
        id: 'customer-dashboard', 
        label: 'Client Dashboard', 
        path: '/clients/dashboard', 
        component: 'components/CustomerManagement/CustomerDashboard' 
      },
      { 
        id: 'add-new-customer', 
        label: 'Add New Client', 
        path: '/clients/new', 
        component: 'pages/clients/AddNewCustomer' 
      },
      { 
        id: 'active-customers', 
        label: 'Active Clients', 
        path: '/clients/active', 
        component: 'pages/clients/ActiveCustomers' 
      },
      { 
        id: 'customer-reports', 
        label: 'Client Reports', 
        path: '/clients/reports', 
        component: 'pages/clients/CustomerReports',
        subComponents: ['components/CustomerManagement/CustomerReports']
      },
      { 
        id: 'customer-retention', 
        label: 'Retention Metrics', 
        path: '/customers/retention', 
        component: 'components/CustomerManagement/RetentionMetrics',
        subComponents: ['components/Performance/CustomerRetentionDashboard']
      },
      { 
        id: 'client-relationships', 
        label: 'Client Network', 
        path: '/clients/network', 
        component: 'pages/clients/ClientNetworkMap' 
      }
    ]
  },
  
  // Drivers Section
  {
    id: 'drivers',
    label: 'Drivers',
    path: '/drivers',
    component: 'pages/drivers/DriverManagementPage',
    icon: 'id-badge',
    children: [
      { 
        id: 'driver-dashboard', 
        label: 'Driver Dashboard', 
        path: '/drivers/dashboard', 
        component: 'pages/drivers/DriverDashboard' 
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
        id: 'license-management',
        label: 'License Management',
        path: '/drivers/licenses',
        component: 'pages/drivers/LicenseManagement'
      },
      {
        id: 'training-records',
        label: 'Training Records',
        path: '/drivers/training',
        component: 'pages/drivers/TrainingRecords'
      },
      { 
        id: 'driver-performance-analytics', 
        label: 'Performance Analytics', 
        path: '/drivers/performance', 
        component: 'pages/drivers/PerformanceAnalytics' 
      },
      {
        id: 'driver-scheduling',
        label: 'Scheduling',
        path: '/drivers/scheduling',
        component: 'pages/drivers/DriverScheduling'
      },
      {
        id: 'hours-of-service',
        label: 'Hours of Service',
        path: '/drivers/hours',
        component: 'pages/drivers/HoursOfService'
      },
      { 
        id: 'driver-violations', 
        label: 'Violations', 
        path: '/drivers/violations', 
        component: 'pages/drivers/DriverViolations' 
      },
      {
        id: 'driver-rewards',
        label: 'Rewards Program',
        path: '/drivers/rewards',
        component: 'pages/drivers/DriverRewards'
      },
      { 
        id: 'driver-behavior', 
        label: 'Behavior Monitoring', 
        path: '/drivers/behavior', 
        component: 'pages/drivers/DriverBehaviorPage' 
      },
      {
        id: 'safety-scores',
        label: 'Safety Scores',
        path: '/drivers/safety-scores',
        component: 'pages/drivers/SafetyScores'
      }
    ]
  },
  
  // Compliance Management Section
  {
    id: 'compliance',
    label: 'Compliance Management',
    path: '/compliance',
    component: 'pages/compliance/ComplianceManagementPage',
    icon: 'clipboard-check',
    children: [
      { 
        id: 'compliance-dashboard', 
        label: 'Dashboard', 
        path: '/compliance/dashboard', 
        component: 'pages/compliance/ComplianceDashboard' 
      },
      {
        id: 'dot-compliance',
        label: 'DOT Compliance',
        path: '/compliance/dot',
        component: 'pages/compliance/DOTCompliancePage'
      },
      { 
        id: 'safety-inspections', 
        label: 'Safety Inspections', 
        path: '/compliance/safety-inspections', 
        component: 'pages/compliance/SafetyInspectionsPage',
        subComponents: ['components/workshop/InspectionList', 'components/workshop/InspectionReportForm']
      },
      { 
        id: 'incident-reports', 
        label: 'Incident Management', 
        path: '/compliance/incidents', 
        component: 'pages/compliance/IncidentManagement' 
      },
      {
        id: 'training-compliance',
        label: 'Training Records',
        path: '/compliance/training',
        component: 'pages/compliance/TrainingCompliancePage'
      },
      { 
        id: 'audit-management', 
        label: 'Audit Management', 
        path: '/compliance/audits', 
        component: 'pages/compliance/AuditManagement'
      },
      {
        id: 'violation-tracking',
        label: 'Violations',
        path: '/compliance/violations',
        component: 'pages/compliance/ViolationTracking'
      },
      {
        id: 'insurance-management',
        label: 'Insurance',
        path: '/compliance/insurance',
        component: 'pages/compliance/InsuranceManagement'
      }
    ]
  },
  
  // Fleet Analytics Section
  {
    id: 'analytics',
    label: 'Fleet Analytics',
    path: '/analytics',
    component: 'pages/analytics/FleetAnalyticsPage',
    icon: 'chart-line',
    children: [
      { 
        id: 'analytics-dashboard', 
        label: 'Dashboard', 
        path: '/analytics/dashboard', 
        component: 'pages/analytics/AnalyticsDashboard' 
      },
      {
        id: 'kpi-monitoring',
        label: 'KPI Monitoring',
        path: '/analytics/kpi',
        component: 'pages/analytics/AnalyticsInsights'
      },
      {
        id: 'predictive-analysis',
        label: 'Predictive Analysis',
        path: '/analytics/predictive',
        component: 'pages/analytics/PredictiveAnalysisPage'
      },
      {
        id: 'costs-analytics',
        label: 'Cost Analytics',
        path: '/analytics/costs',
        component: 'pages/analytics/CostsAnalyticsPage'
      },
      {
        id: 'roi-calculator',
        label: 'ROI Calculator',
        path: '/analytics/roi',
        component: 'pages/analytics/ROICalculatorPage'
      },
      {
        id: 'benchmarks',
        label: 'Benchmarking',
        path: '/analytics/benchmarks',
        component: 'pages/analytics/VehiclePerformance'
      },
      {
        id: 'custom-reports',
        label: 'Custom Reports',
        path: '/analytics/custom-reports',
        component: 'pages/analytics/CreateCustomReport'
      }
    ]
  },
  
  // Workshop Section
  {
    id: 'workshop',
    label: 'Workshop Management',
    path: '/workshop',
    component: 'pages/workshop/WorkshopPage',
    icon: 'wrench',
    children: [
      { 
        id: 'fleet-setup', 
        label: 'Fleet Setup', 
        path: '/workshop/fleet-setup', 
        component: 'pages/workshop/FleetTable',
        subComponents: ['components/workshop/FleetSelector', 'components/workshop/FleetFormModal']
      },
      {
        id: 'maintenance-scheduler',
        label: 'Maintenance Scheduler',
        path: '/workshop/maintenance-scheduler',
        component: 'pages/workshop/MaintenanceSchedulerPage',
        children: [
          {
            id: 'upcoming-maintenance',
            label: 'Upcoming Maintenance',
            path: '/workshop/maintenance-scheduler/upcoming',
            component: 'pages/workshop/UpcomingMaintenancePage'
          },
          {
            id: 'maintenance-history',
            label: 'Maintenance History',
            path: '/workshop/maintenance-scheduler/history',
            component: 'pages/workshop/MaintenanceHistoryPage'
          },
          {
            id: 'maintenance-templates',
            label: 'Maintenance Templates',
            path: '/workshop/maintenance-scheduler/templates',
            component: 'pages/workshop/MaintenanceTemplatePage'
          }
        ]
      },
      {
        id: 'vehicle-inspection',
        label: 'Vehicle Inspection',
        path: '/workshop/vehicle-inspection',
        component: 'pages/vehicle-inspection/VehicleInspectionPage',
        children: [
          {
            id: 'inspection-checklist',
            label: 'Inspection Checklists',
            path: '/workshop/vehicle-inspection/checklists',
            component: 'pages/vehicle-inspection/ChecklistPage'
          },
          {
            id: 'inspection-reports',
            label: 'Inspection Reports',
            path: '/workshop/vehicle-inspection/reports',
            component: 'pages/vehicle-inspection/InspectionReportsPage'
          },
          {
            id: 'defect-management',
            label: 'Defect Management',
            path: '/workshop/vehicle-inspection/defects',
            component: 'pages/vehicle-inspection/DefectManagementPage'
          }
        ]
      },
      {
        id: 'parts-inventory',
        label: 'Parts Inventory',
        path: '/workshop/parts-inventory',
        component: 'pages/workshop/PartsInventoryPage',
        children: [
          {
            id: 'inventory-management',
            label: 'Inventory Management',
            path: '/workshop/parts-inventory/management',
            component: 'pages/workshop/InventoryManagementPage'
          },
          {
            id: 'orders-and-suppliers',
            label: 'Orders & Suppliers',
            path: '/workshop/parts-inventory/orders',
            component: 'pages/workshop/OrdersAndSuppliersPage'
          }
        ]
      },
      {
        id: 'service-requests',
        label: 'Service Requests',
        path: '/workshop/service-requests',
        component: 'pages/workshop/ServiceRequestsPage'
      },
      {
        id: 'workshop-planning',
        label: 'Workshop Planning',
        path: '/workshop/planning',
        component: 'pages/workshop/WorkshopPlanningPage'
      }
    ]
  },
  
  // Reports Section
  {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    component: 'pages/reports/ReportsPage',
    icon: 'file-alt',
    children: [
      { 
        id: 'financial-reports', 
        label: 'Financial Reports', 
        path: '/reports/financial', 
        component: 'pages/reports/FinancialReportsPage' 
      },
      { 
        id: 'operations-reports', 
        label: 'Operations Reports', 
        path: '/reports/operations', 
        component: 'pages/reports/OperationsReportsPage' 
      },
      { 
        id: 'compliance-reports', 
        label: 'Compliance Reports', 
        path: '/reports/compliance', 
        component: 'pages/reports/ComplianceReportsPage' 
      },
      { 
        id: 'environmental-reports', 
        label: 'Environmental Reports', 
        path: '/reports/environmental', 
        component: 'pages/reports/EnvironmentalReportsPage' 
      },
      { 
        id: 'custom-report-builder', 
        label: 'Custom Report Builder', 
        path: '/reports/custom-builder', 
        component: 'pages/reports/CustomReportBuilder' 
      },
      { 
        id: 'scheduled-reports', 
        label: 'Scheduled Reports', 
        path: '/reports/scheduled', 
        component: 'pages/reports/ScheduledReportsPage' 
      }
    ]
  },
  
  // Notifications Section
  {
    id: 'notifications',
    label: 'Notifications',
    path: '/notifications',
    component: 'pages/notifications/NotificationsPage',
    icon: 'bell',
    children: [
      { 
        id: 'notifications-center', 
        label: 'Notification Center', 
        path: '/notifications/center', 
        component: 'pages/notifications/NotificationCenterPage' 
      },
      { 
        id: 'notification-settings', 
        label: 'Notification Settings', 
        path: '/notifications/settings', 
        component: 'pages/notifications/NotificationSettingsPage' 
      },
      { 
        id: 'alerts-config', 
        label: 'Alerts Configuration', 
        path: '/notifications/alerts', 
        component: 'pages/notifications/AlertsConfigurationPage' 
      }
    ]
  },
  
  // Settings Section
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    component: 'pages/settings/SettingsPage',
    icon: 'cog',
    children: [
      { 
        id: 'user-management', 
        label: 'User Management', 
        path: '/settings/users', 
        component: 'pages/settings/UserManagementPage',
        children: [
          {
            id: 'user-list',
            label: 'User List',
            path: '/settings/users/list',
            component: 'pages/settings/UserListPage'
          },
          {
            id: 'roles-permissions',
            label: 'Roles & Permissions',
            path: '/settings/users/roles',
            component: 'pages/settings/RolesPermissionsPage'
          },
          {
            id: 'user-activity',
            label: 'User Activity',
            path: '/settings/users/activity',
            component: 'pages/settings/UserActivityPage'
          }
        ]
      },
      { 
        id: 'company-profile', 
        label: 'Company Profile', 
        path: '/settings/company', 
        component: 'pages/settings/CompanyProfilePage' 
      },
      { 
        id: 'integration-settings', 
        label: 'Integrations', 
        path: '/settings/integrations', 
        component: 'pages/settings/IntegrationsPage',
        children: [
          {
            id: 'api-settings',
            label: 'API Settings',
            path: '/settings/integrations/api',
            component: 'pages/settings/APISettingsPage'
          },
          {
            id: 'wialon-integration',
            label: 'Wialon Integration',
            path: '/settings/integrations/wialon',
            component: 'pages/settings/WialonIntegrationPage'
          },
          {
            id: 'sage-integration',
            label: 'Sage Integration',
            path: '/settings/integrations/sage',
            component: 'pages/settings/SageIntegrationPage'
          },
          {
            id: 'external-systems',
            label: 'External Systems',
            path: '/settings/integrations/external',
            component: 'pages/settings/ExternalSystemsPage'
          }
        ]
      },
      { 
        id: 'preferences', 
        label: 'Preferences', 
        path: '/settings/preferences', 
        component: 'pages/settings/PreferencesPage' 
      },
      { 
        id: 'backup-restore', 
        label: 'Backup & Restore', 
        path: '/settings/backup', 
        component: 'pages/settings/BackupRestorePage' 
      },
      { 
        id: 'system-logs', 
        label: 'System Logs', 
        path: '/settings/logs', 
        component: 'pages/settings/SystemLogsPage' 
      }
    ]
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
    component: 'pages/drivers/DriverBehaviorPage' 
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
    component: 'pages/workshop/QRGenerator' 
  },
  { 
    id: 'workshop-inspections', 
    label: 'Inspections', 
    path: '/workshop/inspections', 
    component: 'pages/workshop/InspectionHistoryPage',
    subComponents: ['components/workshop/InspectionList', 'components/workshop/InspectionForm']
  },
  { 
    id: 'job-cards', 
    label: 'Job Cards', 
    path: '/workshop/job-cards', 
    component: 'pages/workshop/JobCardManagement',
    subComponents: ['components/workshop/JobCardKanbanBoard']
  },
  { 
    id: 'faults', 
    label: 'Faults', 
    path: '/workshop/faults', 
    component: 'pages/workshop/FaultTracking',
    subComponents: ['components/workshop/FaultManagement', 'components/workshop/FaultTracker']
  },
  { 
    id: 'workshop-inventory', 
    label: 'Inventory', 
    path: '/workshop/inventory', 
    component: 'pages/workshop/WorkshopInventoryPage',
    subComponents: ['components/workshop/StockManager', 'components/inventory/InventoryPanel']
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
    component: 'pages/workshop/WorkshopAnalyticsComp',
    subComponents: ['components/analytics/AnalyticsDashboard']
  },
  { 
    id: 'workshop-reports', 
    label: 'Reports', 
    path: '/workshop/reports', 
    component: 'pages/workshop/WorkshopReportsPage',
    subComponents: ['components/workshop/InspectionReportForm', 'components/analytics/AdHocReportBuilder']
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

  // Tyre Management Section
  {
    id: 'tyres',
    label: 'Tyre Management',
    path: '/tyres',
    component: 'pages/tyres/TyreManagementPage',
    icon: 'circle-stack',
    children: [
      { 
        id: 'tyre-dashboard', 
        label: 'Dashboard', 
        path: '/tyres/dashboard', 
        component: 'pages/tyres/TyrePerformanceDashboard' 
      },
      { 
        id: 'tyre-inspection', 
        label: 'Tyre Inspection', 
        path: '/tyres/inspection', 
        component: 'pages/tyres/inspection' 
      },
      { 
        id: 'tyre-inventory', 
        label: 'Tyre Inventory', 
        path: '/tyres/inventory', 
        component: 'pages/tyres/inventory' 
      },
      {
        id: 'tyre-add',
        label: 'Add New Tyre',
        path: '/tyres/add',
        component: 'pages/tyres/AddNewTyre'
      },
      { 
        id: 'tyre-reports', 
        label: 'Tyre Reports', 
        path: '/tyres/reports', 
        component: 'pages/tyres/reports' 
      },
      {
        id: 'tyre-stores',
        label: 'Tyre Stores',
        path: '/tyres/stores',
        component: 'pages/tyres/TyreStoresPage'
      },
      {
        id: 'tyre-fleet-map',
        label: 'Tyre Fleet Map',
        path: '/tyres/fleet-map',
        component: 'pages/tyres/TyreFleetMap'
      },
      {
        id: 'tyre-history',
        label: 'Tyre History',
        path: '/tyres/history',
        component: 'pages/tyres/TyreHistoryPage'
      }
    ]
  },

  // Inventory Management Section
  {
    id: 'inventory',
    label: 'Inventory Management',
    path: '/inventory',
    component: 'pages/inventory/InventoryPage',
    icon: 'box',
    children: [
      { 
        id: 'inventory-dashboard', 
        label: 'Dashboard', 
        path: '/inventory/dashboard', 
        component: 'pages/inventory/InventoryDashboard' 
      },
      { 
        id: 'stock-management', 
        label: 'Stock Management', 
        path: '/inventory/stock', 
        component: 'pages/inventory/PartsInventoryPage' 
      },
      {
        id: 'parts-ordering',
        label: 'Parts Ordering',
        path: '/inventory/ordering',
        component: 'pages/inventory/PartsOrderingPage'
      },
      {
        id: 'receive-parts',
        label: 'Receive Parts',
        path: '/inventory/receive',
        component: 'pages/inventory/ReceivePartsPage'
      },
      {
        id: 'purchase-orders',
        label: 'Purchase Orders',
        path: '/inventory/purchase-orders',
        component: 'pages/inventory/PurchaseOrderTracker'
      },
      {
        id: 'vendor-management',
        label: 'Vendor Management',
        path: '/inventory/vendors',
        component: 'pages/inventory/VendorScorecard'
      },
      {
        id: 'stock-alerts',
        label: 'Stock Alerts',
        path: '/inventory/alerts',
        component: 'pages/inventory/StockAlertsPage'
      },
      { 
        id: 'inventory-reports', 
        label: 'Reports', 
        path: '/inventory/reports', 
        component: 'pages/inventory/InventoryReportsPage' 
      }
    ]
  }
];

// For CommonJS compatibility with scripts
module.exports = { sidebarConfig };
