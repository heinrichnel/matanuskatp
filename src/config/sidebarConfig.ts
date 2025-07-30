import React from "react";
// Import icons from your chosen icon library (e.g., Heroicons, as per your package.json)
import {
  ArrowPathIcon,
  BellAlertIcon,
  BuildingOfficeIcon,
  CalculatorIcon,
  ChartBarIcon,
  CircleStackIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  DocumentMagnifyingGlassIcon,
  DocumentTextIcon,
  FunnelIcon, // For Drivers
  HandRaisedIcon,
  HomeIcon,
  InboxStackIcon, // For Hours of Service
  ListBulletIcon,
  MapPinIcon, // Changed from FactoryIcon // For Workshop
  ReceiptPercentIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TagIcon,
  TruckIcon, // For Invoices
  UserCircleIcon, // Changed from FuelIcon
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline"; // Adjust path if needed

// Import missing icons from Lucide React
import { AlertTriangle, CalendarIcon, CheckCircle, Edit, FileText, Plus } from "lucide-react";

// --- Lazy-loaded Page Component Imports ---
// Using React.lazy for code-splitting
// All page components are imported using React.lazy for code splitting.
// This ensures their code is only loaded when the user navigates to that route.

// Create a placeholder component for missing pages
const PlaceholderComponent = React.lazy(() =>
  Promise.resolve({
    default: () => React.createElement("div", {}, "Page component is being developed"),
  })
);

// Core Dashboard
// Using placeholder for missing components
const DashboardPage = PlaceholderComponent;

// Compliance Module Pages
const ComplianceDashboard = PlaceholderComponent; // Main page
const InspectionManagement = PlaceholderComponent;
const ReportNewIncidentPage = PlaceholderComponent;
const FlagsInvestigationsPage = PlaceholderComponent;
const QAReviewPanel = PlaceholderComponent; // Assuming this is a page
const ActionLog = React.lazy(() => import("../pages/Compliance/ActionLog")); // From pages/Compliance
const CARReportDetails = React.lazy(() => import("../pages/Compliance/CARReportDetails")); // From pages/Compliance
const ActionItemDetails = React.lazy(() => import("../pages/Compliance/ActionItemDetails")); // From pages/Compliance

// Clients Module Pages
const ClientManagementPage = React.lazy(() => import("../pages/clients/ClientManagementPage"));
const AddNewCustomer = PlaceholderComponent;
const ActiveCustomers = React.lazy(() => import("../pages/clients/ActiveCustomers"));
const CustomerReports = React.lazy(() => import("../pages/clients/CustomerReports"));
const RetentionMetrics = React.lazy(() => import("../pages/clients/RetentionMetrics"));
const ClientNetworkMap = React.lazy(() => import("../pages/clients/ClientNetworkMap"));
const ClientDetail = PlaceholderComponent; // From pages/ClientDetail.tsx

// Invoices Module Pages
const InvoiceManagementPage = React.lazy(() => import("../pages/invoices/InvoiceManagementPage")); // Main page
const CreateInvoicePage = React.lazy(() => import("../pages/invoices/CreateInvoicePage"));
const CreateQuotePage = React.lazy(() => import("../pages/invoices/CreateQuotePage"));
const InvoiceApprovalFlow = React.lazy(() => import("../pages/invoices/InvoiceApprovalFlow"));
const InvoiceBuilder = React.lazy(() => import("../pages/invoices/InvoiceBuilder"));
const InvoiceDashboard = React.lazy(() => import("../pages/invoices/InvoiceDashboard"));
const InvoiceTemplatesPage = React.lazy(() => import("../pages/invoices/InvoiceTemplatesPage"));
const PaidInvoicesPage = React.lazy(() => import("../pages/invoices/PaidInvoicesPage")); // From pages/invoices
const PendingInvoicesPage = React.lazy(() => import("../pages/invoices/PendingInvoicesPage")); // From pages/invoices
const TaxReportExport = React.lazy(() => import("../pages/invoices/TaxReportExport"));
const POApprovalSummary = PlaceholderComponent; // From pages/POApprovalSummary.tsx
const PurchaseOrderDetailView = PlaceholderComponent; // From pages/PurchaseOrderDetailView.tsx
const PurchaseOrderTracker = PlaceholderComponent; // From pages/PurchaseOrderTracker.tsx
const IndirectCostBreakdown = PlaceholderComponent; // From pages/IndirectCostBreakdown.tsx
const CashManagerRequestPage = PlaceholderComponent; // From pages/CashManagerRequestPage.tsx

// Diesel Module Pages
const DieselManagementPage = React.lazy(() => import("../pages/diesel/DieselManagementPage")); // Main page
const AddFuelEntryPage = PlaceholderComponent;
const BudgetPlanning = React.lazy(() => import("../pages/diesel/BudgetPlanning"));
const CarbonFootprintCalc = React.lazy(() => import("../pages/diesel/CarbonFootprintCalc"));
const DieselDashboardComponent = React.lazy(
  () => import("../pages/diesel/DieselDashboardComponent")
); // From pages/diesel
const DriverFuelBehaviorDiesel = React.lazy(() => import("../pages/diesel/DriverFuelBehavior")); // Renamed to avoid conflict
const FuelCardManager = React.lazy(() => import("../pages/diesel/FuelCardManager"));
const FuelEfficiencyReport = React.lazy(() => import("../pages/diesel/FuelEfficiencyReport"));
const FuelLogs = React.lazy(() => import("../pages/diesel/FuelLogs"));
const FuelStations = React.lazy(() => import("../pages/diesel/FuelStations"));
const FuelTheftDetection = React.lazy(() => import("../pages/diesel/FuelTheftDetection"));
const DieselAnalysis = React.lazy(() => import("../pages/diesel/DieselAnalysis")); // From pages/diesel
const DieselDashboard = PlaceholderComponent; // From pages/DieselDashboard.tsx

// Inventory Module Pages
const InventoryDashboard = PlaceholderComponent; // Main page
const InventoryPage = PlaceholderComponent;
const InventoryReportsPage = PlaceholderComponent;
const PartsInventoryPage = PlaceholderComponent;
const PartsOrderingPage = PlaceholderComponent;
const ReceivePartsPage = PlaceholderComponent;
const VendorScorecard = PlaceholderComponent; // From pages/VendorScorecard.tsx
const VendorPage = React.lazy(() => import("../pages/workshop/VendorPage")); // Re-used from workshop

// Mobile Module Pages
const TyreMobilePage = React.lazy(() => import("../pages/mobile/TyreMobilePage"));

// Drivers Module Pages
const DriverManagementPage = React.lazy(() => import("../pages/drivers/DriverManagementPage")); // Main page
const AddNewDriver = React.lazy(() => import("../pages/drivers/AddNewDriver"));
const DriverDashboard = React.lazy(() => import("../pages/drivers/DriverDashboard")); // From pages/drivers
const DriverBehaviorPage = React.lazy(() => import("../pages/drivers/DriverBehaviorPage"));
const DriverProfiles = React.lazy(() => import("../pages/drivers/DriverProfiles"));
const DriverRewards = React.lazy(() => import("../pages/drivers/DriverRewards"));
const DriverScheduling = React.lazy(() => import("../pages/drivers/DriverScheduling"));
const DriverViolations = React.lazy(() => import("../pages/drivers/DriverViolations"));
const EditDriver = React.lazy(() => import("../pages/drivers/EditDriver"));
const HoursOfService = React.lazy(() => import("../pages/drivers/HoursOfService"));
const LicenseManagement = React.lazy(() => import("../pages/drivers/LicenseManagement"));
const PerformanceAnalytics = React.lazy(() => import("../pages/drivers/PerformanceAnalytics"));
const SafetyScores = React.lazy(() => import("../pages/drivers/SafetyScores"));
const TrainingRecords = React.lazy(() => import("../pages/drivers/TrainingRecords"));
const DriverDetailsPage = React.lazy(() => import("../pages/drivers/DriverDetailsPage"));

// Wialon Module Pages
const WialonDashboard = PlaceholderComponent; // Main page
const WialonUnitsPage = PlaceholderComponent;
const WialonConfigPage = PlaceholderComponent;
const WialonMapComponent = React.lazy(() => import("../components/Map/WialonMapComponent")); // Component, but can be a route target

// Tyres Module Pages
const TyreManagementPage = React.lazy(() => import("../pages/tyres/TyreManagementPage")); // Main page
const TyreFleetMap = PlaceholderComponent;
const TyreHistoryPage = PlaceholderComponent;
const TyrePerformanceDashboard = PlaceholderComponent;
const TyreReferenceManagerPage = React.lazy(
  () => import("../pages/tyres/TyreReferenceManagerPage")
);
const TyreStores = PlaceholderComponent; // From pages/TyreStores.tsx
const VehicleTyreView = PlaceholderComponent; // From pages/VehicleTyreView.tsx
const AddNewTyrePage = React.lazy(() => import("../pages/tyres/AddNewTyrePage"));

// Analytics Module Pages
const YearToDateKPIs = PlaceholderComponent;
const WorkshopAnalytics = PlaceholderComponent;
const PredictiveModels = React.lazy(() => import("../components/Models/Driver/PredictiveModels")); // Component, not a page. If it needs a route, wrap it.
const AnalyticsPerformanceAnalytics = PlaceholderComponent; // Re-used from Drivers
const FleetAnalyticsPage = PlaceholderComponent; // Re-used from Fleet
const AnalyticsDashboardPage = PlaceholderComponent; // Re-used from Dashboard
const AnalyticsDashboard = React.lazy(() => import("../pages/DashboardPage")); // Re-used from Dashboard

// Trips Module Pages (already imported above)
// MissedLoadsTracker already imported above

// Workshop Module Pages
const WorkshopPage = React.lazy(() => import("../pages/workshop/WorkshopPage")); // Main page
const JobCardManagement = React.lazy(() => import("../pages/JobCardManagement")); // From pages/JobCardManagement.tsx
const WorkOrderManagement = React.lazy(() => import("../pages/WorkOrderManagement")); // From pages/WorkOrderManagement.tsx
const StockInventoryPage = React.lazy(() => import("../pages/workshop/StockInventoryPage"));
const QRGenerator = React.lazy(() => import("../pages/workshop/QRGenerator"));
const QRScannerPage = React.lazy(() => import("../pages/workshop/QRScannerPage"));

// Testing & Demo Pages (Development Only)
const SidebarTester = React.lazy(() => import("../SidebarTester"));
const UIComponentsDemo = React.lazy(() => import("../components/ui/UIComponentsDemo"));
const GoogleMapsTest = React.lazy(() => import("../components/testing/GoogleMapsTest"));
const TestRouting = React.lazy(() => import("../testRouting")); // Your testRouting.tsx

// Define the structure of a sidebar item
export interface SidebarItem {
  id: string;
  label: string;
  path?: string; // Optional path for parent items without direct route
  icon?: React.ElementType; // Icon component
  component?: React.ComponentType<any>; // React component for the route (lazy-loaded)
  roles?: string[]; // Optional roles for access control
  children?: SidebarItem[]; // Nested items for submenus
}

export const sidebarConfig: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/",
    icon: HomeIcon,
    component: DashboardPage,
    roles: ["Admin", "Sub Admin", "Operator", "Technician"],
  },
  {
    id: "compliance",
    label: "COMPLIANCE",
    icon: ScaleIcon,
    roles: ["Admin", "Sub Admin", "Technician", "Operator"],
    children: [
      {
        id: "compliance-dashboard",
        label: "Compliance Dashboard",
        path: "/compliance/dashboard",
        icon: HomeIcon,
        component: ComplianceDashboard,
      },
      {
        id: "inspection-management",
        label: "Inspection Management",
        path: "/compliance/inspections",
        icon: ClipboardDocumentCheckIcon,
        component: InspectionManagement,
      },
      {
        id: "report-incident",
        label: "Report New Incident",
        path: "/compliance/report-incident",
        icon: BellAlertIcon,
        component: ReportNewIncidentPage,
      },
      {
        id: "flags-investigations",
        label: "Flags & Investigations",
        path: "/compliance/flags-investigations",
        icon: HandRaisedIcon,
        component: FlagsInvestigationsPage,
      },
      {
        id: "qa-review",
        label: "QA Review",
        path: "/compliance/qa-review",
        icon: ClipboardDocumentCheckIcon,
        component: QAReviewPanel,
      },
      {
        id: "action-log",
        label: "Action Log",
        path: "/compliance/action-log",
        icon: ClipboardDocumentListIcon,
        component: ActionLog,
      },
      {
        id: "car-report-details",
        label: "CAR Report Details",
        path: "/compliance/car-report-details",
        icon: DocumentTextIcon,
        component: CARReportDetails,
      },
      {
        id: "action-item-details",
        label: "Action Item Details",
        path: "/compliance/action-item-details",
        icon: DocumentTextIcon,
        component: ActionItemDetails,
      },
      {
        id: "training-records",
        label: "Training Records",
        path: "/compliance/training",
        icon: ClipboardDocumentCheckIcon,
        component: TrainingRecords,
      }, // Re-used
      {
        id: "driver-violations",
        label: "Driver Violations",
        path: "/compliance/violations",
        icon: BellAlertIcon,
        component: DriverViolations,
      }, // Re-used
    ],
  },
  {
    id: "clients",
    label: "CLIENTS",
    icon: BuildingOfficeIcon,
    roles: ["Admin", "Sub Admin"],
    children: [
      {
        id: "client-dashboard",
        label: "Client Dashboard",
        path: "/clients/dashboard",
        icon: HomeIcon,
        component: ClientManagementPage,
      },
      {
        id: "client-management",
        label: "Client Management",
        path: "/clients/management",
        icon: ListBulletIcon,
        component: ClientManagementPage,
      }, // Re-used, or use a specific list page
      {
        id: "add-new-customer",
        label: "Add New Customer",
        path: "/clients/add",
        icon: Plus,
        component: AddNewCustomer,
      },
      {
        id: "active-customers",
        label: "Active Customers",
        path: "/clients/active",
        icon: UsersIcon,
        component: ActiveCustomers,
      },
      {
        id: "client-details",
        label: "Client Details",
        path: "/clients/:id",
        icon: DocumentTextIcon,
        component: ClientDetail,
      }, // Dynamic route
      {
        id: "client-reports",
        label: "Client Reports",
        path: "/clients/reports",
        icon: ChartBarIcon,
        component: CustomerReports,
      },
      {
        id: "retention-metrics",
        label: "Retention Metrics",
        path: "/clients/retention",
        icon: SparklesIcon,
        component: RetentionMetrics,
      },
      {
        id: "client-network-map",
        label: "Client Network Map",
        path: "/clients/network-map",
        icon: MapPinIcon,
        component: ClientNetworkMap,
      },
    ],
  },
  {
    id: "invoices",
    label: "INVOICES",
    icon: ReceiptPercentIcon,
    roles: ["Admin", "Sub Admin"],
    children: [
      {
        id: "invoice-dashboard",
        label: "Invoice Dashboard",
        path: "/invoices/dashboard",
        icon: HomeIcon,
        component: InvoiceDashboard,
      },
      {
        id: "invoice-management",
        label: "Invoice Management",
        path: "/invoices/management",
        icon: ListBulletIcon,
        component: InvoiceManagementPage,
      },
      {
        id: "create-invoice",
        label: "Create Invoice",
        path: "/invoices/create",
        icon: Plus,
        component: CreateInvoicePage,
      },
      {
        id: "create-quote",
        label: "Create Quote",
        path: "/invoices/create-quote",
        icon: Plus,
        component: CreateQuotePage,
      },
      {
        id: "pending-invoices",
        label: "Pending Invoices",
        path: "/invoices/pending",
        icon: DocumentTextIcon,
        component: PendingInvoicesPage,
      },
      {
        id: "paid-invoices",
        label: "Paid Invoices",
        path: "/invoices/paid",
        icon: CheckCircle,
        component: PaidInvoicesPage,
      },
      {
        id: "invoice-approval",
        label: "Invoice Approval Flow",
        path: "/invoices/approval",
        icon: ClipboardDocumentCheckIcon,
        component: InvoiceApprovalFlow,
      },
      {
        id: "invoice-builder",
        label: "Invoice Builder",
        path: "/invoices/builder",
        icon: DocumentTextIcon,
        component: InvoiceBuilder,
      },
      {
        id: "invoice-templates",
        label: "Invoice Templates",
        path: "/invoices/templates",
        icon: DocumentTextIcon,
        component: InvoiceTemplatesPage,
      },
      {
        id: "tax-report-export",
        label: "Tax Report Export",
        path: "/invoices/tax-report",
        icon: CalculatorIcon,
        component: TaxReportExport,
      },
      {
        id: "po-approval-summary",
        label: "PO Approval Summary",
        path: "/invoices/po-approval",
        icon: ClipboardDocumentCheckIcon,
        component: POApprovalSummary,
      },
      {
        id: "purchase-order-tracker",
        label: "Purchase Order Tracker",
        path: "/invoices/po-tracker",
        icon: DocumentTextIcon,
        component: PurchaseOrderTracker,
      },
      {
        id: "purchase-order-detail",
        label: "PO Detail View",
        path: "/invoices/po/:id",
        icon: DocumentTextIcon,
        component: PurchaseOrderDetailView,
      }, // Dynamic route
      {
        id: "indirect-cost-breakdown",
        label: "Indirect Cost Breakdown",
        path: "/invoices/indirect-costs",
        icon: CurrencyDollarIcon,
        component: IndirectCostBreakdown,
      },
      {
        id: "cash-manager-request",
        label: "Cash Manager Request",
        path: "/invoices/cash-manager-request",
        icon: CurrencyDollarIcon,
        component: CashManagerRequestPage,
      },
    ],
  },
  {
    id: "diesel",
    label: "DIESEL",
    icon: FunnelIcon, // Changed from FuelIcon
    roles: ["Admin", "Sub Admin", "Operator"],
    children: [
      {
        id: "diesel-dashboard",
        label: "Diesel Dashboard",
        path: "/diesel/dashboard",
        icon: HomeIcon,
        component: DieselDashboard,
      },
      {
        id: "diesel-management",
        label: "Diesel Management",
        path: "/diesel/management",
        icon: ListBulletIcon,
        component: DieselManagementPage,
      },
      {
        id: "add-fuel-entry",
        label: "Add Fuel Entry",
        path: "/diesel/add-entry",
        icon: Plus,
        component: AddFuelEntryPage,
      },
      {
        id: "fuel-logs",
        label: "Fuel Logs",
        path: "/diesel/logs",
        icon: DocumentTextIcon,
        component: FuelLogs,
      },
      {
        id: "driver-fuel-behavior",
        label: "Driver Fuel Behavior",
        path: "/diesel/driver-behavior",
        icon: UserGroupIcon,
        component: DriverFuelBehaviorDiesel,
      },
      {
        id: "fuel-theft-detection",
        label: "Fuel Theft Detection",
        path: "/diesel/theft-detection",
        icon: AlertTriangle,
        component: FuelTheftDetection,
      },
      {
        id: "fuel-efficiency-report",
        label: "Fuel Efficiency Report",
        path: "/diesel/efficiency-report",
        icon: ChartBarIcon,
        component: FuelEfficiencyReport,
      },
      {
        id: "carbon-footprint",
        label: "Carbon Footprint",
        path: "/diesel/carbon-footprint",
        icon: ScaleIcon,
        component: CarbonFootprintCalc,
      },
      {
        id: "budget-planning",
        label: "Budget Planning",
        path: "/diesel/budget",
        icon: CalculatorIcon,
        component: BudgetPlanning,
      },
      {
        id: "fuel-card-manager",
        label: "Fuel Card Manager",
        path: "/diesel/card-manager",
        icon: DocumentTextIcon,
        component: FuelCardManager,
      },
      {
        id: "fuel-stations",
        label: "Fuel Stations",
        path: "/diesel/stations",
        icon: MapPinIcon,
        component: FuelStations,
      },
      {
        id: "diesel-analysis",
        label: "Diesel Analysis",
        path: "/diesel/analysis",
        icon: ChartBarIcon,
        component: DieselAnalysis,
      },
    ],
  },
  {
    id: "inventory",
    label: "INVENTORY",
    icon: InboxStackIcon,
    roles: ["Admin", "Sub Admin", "Workshop/Employee"],
    children: [
      {
        id: "inventory-dashboard",
        label: "Inventory Dashboard",
        path: "/inventory/dashboard",
        icon: HomeIcon,
        component: InventoryDashboard,
      },
      {
        id: "inventory-management",
        label: "Inventory Management",
        path: "/inventory/management",
        icon: ListBulletIcon,
        component: InventoryPage,
      },
      {
        id: "parts-inventory",
        label: "Parts Inventory",
        path: "/inventory/parts",
        icon: CircleStackIcon,
        component: PartsInventoryPage,
      },
      {
        id: "parts-ordering",
        label: "Parts Ordering",
        path: "/inventory/ordering",
        icon: DocumentTextIcon,
        component: PartsOrderingPage,
      },
      {
        id: "receive-parts",
        label: "Receive Parts",
        path: "/inventory/receive",
        icon: Plus,
        component: ReceivePartsPage,
      },
      {
        id: "inventory-reports",
        label: "Inventory Reports",
        path: "/inventory/reports",
        icon: ChartBarIcon,
        component: InventoryReportsPage,
      },
      {
        id: "vendor-scorecard",
        label: "Vendor Scorecard",
        path: "/inventory/vendor-scorecard",
        icon: ChartBarIcon,
        component: VendorScorecard,
      },
      {
        id: "po-approval-summary",
        label: "PO Approval Summary",
        path: "/inventory/po-approval",
        icon: ClipboardDocumentCheckIcon,
        component: POApprovalSummary,
      }, // Re-used
      {
        id: "purchase-order-page",
        label: "Purchase Order Page",
        path: "/inventory/purchase-orders",
        icon: DocumentTextIcon,
        component: PurchaseOrderPage,
      }, // Re-used
      {
        id: "purchase-order-tracker",
        label: "Purchase Order Tracker",
        path: "/inventory/po-tracker",
        icon: DocumentTextIcon,
        component: PurchaseOrderTracker,
      }, // Re-used
      {
        id: "purchase-order-detail",
        label: "PO Detail View",
        path: "/inventory/po/:id",
        icon: DocumentTextIcon,
        component: PurchaseOrderDetailView,
      }, // Re-used dynamic
      {
        id: "vendor-page",
        label: "Vendor Management",
        path: "/inventory/vendors",
        icon: UsersIcon,
        component: VendorPage,
      }, // Re-used
    ],
  },
  {
    id: "mobile",
    label: "MOBILE",
    icon: SmartphoneIcon,
    roles: ["Admin", "Sub Admin", "Operator", "Technician", "Workshop/Employee"],
    children: [
      {
        id: "tyre-mobile-app",
        label: "Tyre Mobile App",
        path: "/mobile/tyres",
        icon: CircleStackIcon,
        component: TyreMobilePage,
      },
    ],
  },
  {
    id: "drivers",
    label: "DRIVERS",
    icon: UserCircleIcon,
    roles: ["Admin", "Sub Admin", "Technician"],
    children: [
      {
        id: "driver-dashboard",
        label: "Driver Dashboard",
        path: "/drivers/dashboard",
        icon: HomeIcon,
        component: DriverDashboard,
      },
      {
        id: "driver-management",
        label: "Driver Management",
        path: "/drivers/management",
        icon: ListBulletIcon,
        component: DriverManagementPage,
      },
      {
        id: "add-new-driver",
        label: "Add New Driver",
        path: "/drivers/add",
        icon: Plus,
        component: AddNewDriver,
      },
      {
        id: "driver-profiles",
        label: "Driver Profiles",
        path: "/drivers/profiles",
        icon: UsersIcon,
        component: DriverProfiles,
      },
      {
        id: "driver-details",
        label: "Driver Details",
        path: "/drivers/profiles/:id",
        icon: DocumentTextIcon,
        component: DriverDetailsPage,
      }, // Dynamic route
      {
        id: "edit-driver",
        label: "Edit Driver",
        path: "/drivers/profiles/:id/edit",
        icon: Edit,
        component: EditDriver,
      }, // Dynamic route
      {
        id: "license-management",
        label: "License Management",
        path: "/drivers/licenses",
        icon: DocumentTextIcon,
        component: LicenseManagement,
      },
      {
        id: "hours-of-service",
        label: "Hours of Service",
        path: "/drivers/hours",
        icon: ClockIcon,
        component: HoursOfService,
      },
      {
        id: "safety-scores",
        label: "Safety Scores",
        path: "/drivers/safety-scores",
        icon: ShieldCheckIcon,
        component: SafetyScores,
      },
      {
        id: "training-records",
        label: "Training Records",
        path: "/drivers/training",
        icon: ClipboardDocumentCheckIcon,
        component: TrainingRecords,
      },
      {
        id: "driver-rewards",
        label: "Driver Rewards",
        path: "/drivers/rewards",
        icon: CurrencyDollarIcon,
        component: DriverRewards,
      },
      {
        id: "driver-scheduling",
        label: "Driver Scheduling",
        path: "/drivers/scheduling",
        icon: CalendarIcon,
        component: DriverScheduling,
      },
      {
        id: "driver-violations",
        label: "Driver Violations",
        path: "/drivers/violations",
        icon: BellAlertIcon,
        component: DriverViolations,
      },
      {
        id: "driver-behavior-analytics",
        label: "Behavior Analytics",
        path: "/drivers/behavior",
        icon: SparklesIcon,
        component: DriverBehaviorPage,
      },
    ],
  },
  {
    id: "wialon",
    label: "WIALON",
    icon: MapPinIcon,
    roles: ["Admin", "Sub Admin"],
    children: [
      {
        id: "wialon-dashboard",
        label: "Wialon Dashboard",
        path: "/wialon/dashboard",
        icon: HomeIcon,
        component: WialonDashboard,
      },
      {
        id: "wialon-units",
        label: "Wialon Units",
        path: "/wialon/units",
        icon: TruckIcon,
        component: WialonUnitsPage,
      },
      {
        id: "wialon-config",
        label: "Wialon Configuration",
        path: "/wialon/config",
        icon: Cog6ToothIcon,
        component: WialonConfigPage,
      },
      {
        id: "wialon-live-map",
        label: "Live Wialon Map",
        path: "/wialon/map",
        icon: MapPinIcon,
        component: WialonMapComponent,
      },
    ],
  },
  {
    id: "tyres",
    label: "TYRES",
    icon: CircleStackIcon,
    roles: ["Admin", "Sub Admin", "Technician", "Workshop/Employee"],
    children: [
      {
        id: "tyre-management",
        label: "Tyre Management",
        path: "/tyres/management",
        icon: ListBulletIcon,
        component: TyreManagementPage,
      },
      {
        id: "add-new-tyre",
        label: "Add New Tyre",
        path: "/tyres/add",
        icon: Plus,
        component: AddNewTyrePage,
      },
      {
        id: "tyre-reference-data",
        label: "Tyre Reference Data",
        path: "/tyres/reference",
        icon: ClipboardDocumentListIcon,
        component: TyreReferenceManagerPage,
      },
      {
        id: "tyre-history",
        label: "Tyre History",
        path: "/tyres/history",
        icon: ArrowPathIcon,
        component: TyreHistoryPage,
      },
      {
        id: "tyre-performance",
        label: "Tyre Performance Dashboard",
        path: "/tyres/performance",
        icon: ChartBarIcon,
        component: TyrePerformanceDashboard,
      },
      {
        id: "tyre-performance-report",
        label: "Tyre Performance Report",
        path: "/tyres/performance-report",
        icon: DocumentTextIcon,
        component: React.lazy(() => import("../pages/tyres/TyrePerformanceReport")),
      },
      {
        id: "tyre-cost-analysis",
        label: "Tyre Cost Analysis",
        path: "/tyres/cost-analysis",
        icon: CurrencyDollarIcon,
        component: React.lazy(() => import("../pages/tyres/TyreCostAnalysis")),
      },
      {
        id: "tyre-dashboard",
        label: "Tyre Dashboard",
        path: "/tyres/dashboard",
        icon: HomeIcon,
        component: React.lazy(() => import("../pages/tyres/TyreDashboard")),
      },
      {
        id: "tyre-management-view",
        label: "Tyre Management View",
        path: "/tyres/view",
        icon: DocumentMagnifyingGlassIcon,
        component: React.lazy(() => import("../pages/tyres/TyreManagementView")),
      },
      {
        id: "tyre-reports",
        label: "Tyre Reports",
        path: "/tyres/reports",
        icon: ChartBarIcon,
        component: React.lazy(() => import("../pages/tyres/TyreReports")),
      },
      {
        id: "vehicle-tyre-view",
        label: "Vehicle Tyre View",
        path: "/tyres/vehicle-view",
        icon: DocumentMagnifyingGlassIcon,
        component: VehicleTyreView,
      },
      {
        id: "tyre-fleet-map",
        label: "Tyre Fleet Map",
        path: "/tyres/map",
        icon: MapPinIcon,
        component: TyreFleetMap,
      },
      {
        id: "tyre-stores",
        label: "Tyre Stores",
        path: "/tyres/stores",
        icon: BuildingOfficeIcon,
        component: TyreStores,
      },
    ],
  },
  {
    id: "analytics",
    label: "ANALYTICS",
    icon: ChartBarIcon,
    roles: ["Admin", "Sub Admin"],
    children: [
      {
        id: "analytics-dashboard",
        label: "Analytics Dashboard",
        path: "/analytics/dashboard",
        icon: HomeIcon,
        component: AnalyticsDashboard,
      },
      {
        id: "ytd-kpis",
        label: "YTD KPIs",
        path: "/analytics/kpis",
        icon: ChartBarIcon,
        component: YearToDateKPIs,
      },
      {
        id: "indirect-costs",
        label: "Indirect Costs",
        path: "/analytics/indirect-costs",
        icon: CurrencyDollarIcon,
        component: IndirectCostBreakdown,
      },
      {
        id: "workshop-analytics",
        label: "Workshop Analytics",
        path: "/analytics/workshop",
        icon: ChartBarIcon,
        component: WorkshopAnalytics,
      },
      {
        id: "predictive-models",
        label: "Predictive Models",
        path: "/analytics/predictive",
        icon: SparklesIcon,
        component: PredictiveModels,
      },
      {
        id: "performance-analytics",
        label: "Performance Analytics",
        path: "/analytics/performance",
        icon: ChartBarIcon,
        component: AnalyticsPerformanceAnalytics,
      },
      {
        id: "fleet-analytics",
        label: "Fleet Analytics",
        path: "/analytics/fleet",
        icon: TruckIcon,
        component: FleetAnalyticsPage,
      },
      {
        id: "trip-reports-analytics",
        label: "Trip Reports",
        path: "/analytics/trip-reports",
        icon: DocumentTextIcon,
        component: TripReportPage,
      },
      {
        id: "tyre-analytics",
        label: "Tyre Analytics",
        path: "/analytics/tyres",
        icon: CircleStackIcon,
        component: TyrePerformanceDashboard,
      },
      {
        id: "diesel-analytics",
        label: "Diesel Analytics",
        path: "/analytics/diesel",
        icon: FunnelIcon,
        component: DieselManagementPage,
      },
      {
        id: "client-analytics",
        label: "Client Analytics",
        path: "/analytics/clients",
        icon: BuildingOfficeIcon,
        component: ClientManagementPage,
      },
    ],
  },
  {
    id: "admin",
    label: "ADMIN & SYSTEM",
    icon: Cog6ToothIcon,
    roles: ["Admin"],
    children: [
      {
        id: "admin-dashboard",
        label: "Admin Dashboard",
        path: "/admin/dashboard",
        icon: HomeIcon,
        component: DashboardPage,
      }, // Re-using DashboardPage
      {
        id: "user-management",
        label: "User Management",
        path: "/admin/users",
        icon: UsersIcon,
        component: DriverManagementPage,
      }, // Re-using DriverManagementPage for user list
      {
        id: "system-settings",
        label: "System Settings",
        path: "/admin/settings",
        icon: Cog6ToothIcon,
        component: WialonConfigPage,
      },
      {
        id: "audit-logs",
        label: "Audit Logs",
        path: "/admin/audit-logs",
        icon: ClipboardDocumentListIcon,
        component: ActionLog,
      },
      {
        id: "car-reports",
        label: "CAR Reports",
        path: "/admin/car-reports",
        icon: FileText,
        component: CARReportDetails,
      },
      {
        id: "action-item-details",
        label: "Action Item Details",
        path: "/admin/action-item-details",
        icon: DocumentTextIcon,
        component: ActionItemDetails,
      },
      {
        id: "overall-inventory",
        label: "Overall Inventory",
        path: "/admin/inventory",
        icon: InboxStackIcon,
        component: InventoryDashboard,
      },
    ],
  },
  {
    id: "test-routes",
    label: "TEST ROUTES (DEV ONLY)",
    icon: TagIcon,
    roles: ["Admin"], // Restrict to admins or dev environment
    children: [
      {
        id: "sidebar-tester",
        label: "Sidebar Tester",
        path: "/test/sidebar",
        icon: TagIcon,
        component: SidebarTester,
      },
      {
        id: "ui-components-demo",
        label: "UI Components Demo",
        path: "/test/ui-components",
        icon: TagIcon,
        component: UIComponentsDemo,
      },
      {
        id: "google-maps-test",
        label: "Google Maps Test",
        path: "/test/google-maps",
        icon: TagIcon,
        component: GoogleMapsTest,
      },
      {
        id: "routing-test",
        label: "Routing Test",
        path: "/test/routing",
        icon: TagIcon,
        component: TestRouting,
      },
    ],
  },
];

// Helper to get all flat routes for AppRoutes.tsx
export function getFlatRoutes(items: SidebarItem[]): SidebarItem[] {
  let routes: SidebarItem[] = [];
  items.forEach((item) => {
    if (item.path && item.component) {
      routes.push(item);
    }
    if (item.children) {
      routes = routes.concat(getFlatRoutes(item.children));
    }
  });
  return routes;
}
