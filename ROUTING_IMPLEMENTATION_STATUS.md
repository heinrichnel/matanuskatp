# Matanuska Transport Platform - Unified Routing Implementation

This document provides a comprehensive guide to the routing implementation for the Matanuska Transport Platform. The implementation has been updated to align with the sidebar configuration defined in `sidebarConfig.ts`.

## Routing Structure

The application uses a hierarchical routing structure organized by functional sections:

1. **Trip/Route Management** (`/trips/*`)
2. **Invoice Management** (`/invoices/*`)
3. **Diesel Management** (`/diesel/*`)
4. **Customer Management** (`/clients/*`)
5. **Driver Management** (`/drivers/*`)
6. **Compliance & Safety** (`/compliance/*`)
7. **Workshop Management** (`/workshop/*`)
8. **Tyre Management** (`/tyres/*`)
9. **Inventory Management** (`/inventory/*`)

## Implementation Status

The following components have been implemented and connected to the routing system:

### A. Trip/Route Management

✅ Route Planning - `/trips/route-planning`  
✅ Route Optimization - `/trips/optimization`  
✅ Load Planning - `/trips/load-planning`  
✅ Add New Trip - `/trips/new`  
✅ Trip Calendar - `/trips/calendar`  
✅ Trip Timeline - `/trips/timeline`  
✅ Driver Performance - `/trips/driver-performance`  
✅ Trip Cost Analysis - `/trips/cost-analysis`  
✅ Fleet Utilization - `/trips/utilization`  
✅ Delivery Confirmations - `/trips/confirmations`  
✅ Trip Templates - `/trips/templates`  
✅ Trip Reports - `/trips/reports`  
✅ Maps & Tracking - `/trips/maps`  

### B. Invoice Management

✅ Invoice Dashboard - `/invoices`  
✅ Create Invoice - `/invoices/new`  
✅ Pending Invoices - `/invoices/pending`  
✅ Paid Invoices - `/invoices/paid`  
✅ Invoice Approval - `/invoices/approval`  
✅ Payment Reminders - `/invoices/reminders`  
✅ Invoice Templates - `/invoices/templates`  
✅ Tax Reports - `/invoices/tax-reports`  
✅ Invoice Analytics - `/invoices/analytics`  

### C. Diesel Management

✅ Diesel Dashboard - `/diesel`  
✅ Fuel Logs - `/diesel/logs`  
✅ Add Fuel Entry - `/diesel/new`  
✅ Fuel Card Management - `/diesel/fuel-cards`  
✅ Fuel Analytics - `/diesel/analytics`  
✅ Cost Analysis - `/diesel/costs`  
✅ Efficiency Reports - `/diesel/efficiency`  
✅ Fuel Theft Detection - `/diesel/theft-detection`  
✅ Carbon Footprint - `/diesel/carbon-tracking`  
✅ Driver Fuel Behavior - `/diesel/driver-behavior`  

### D. Customer Management

✅ Customer Dashboard - `/clients`  
✅ Add New Customer - `/clients/new`  
✅ Active Customers - `/clients/active`  
✅ Customer Reports - `/clients/reports`  
✅ Customer Retention - `/customers/retention`  
✅ Client Relationships - `/clients/relationships`  

### E. Driver Management

✅ Driver Dashboard - `/drivers`  
✅ Add New Driver - `/drivers/new`  
✅ Driver Profiles - `/drivers/profiles`  
✅ Performance Analytics - `/drivers/performance`  
✅ Driver Violations - `/drivers/violations`  
✅ Driver Behavior Analytics - `/drivers/behavior`  

### F. Compliance & Safety

✅ Compliance Dashboard - `/compliance`  
✅ Safety Inspections - `/compliance/inspections`  
✅ Incident Reports - `/compliance/incidents`  
✅ Audit Management - `/compliance/audits`  

### G. Workshop Management

✅ Fleet Setup - `/workshop/fleet-setup`  
✅ QR Generator - `/workshop/qr-generator`  
✅ Inspections - `/workshop/inspections`  
✅ Job Cards - `/workshop/job-cards`  
✅ Faults - `/workshop/faults`  
✅ Tyres - `/workshop/tyres`  
✅ Inventory - `/workshop/inventory`  
✅ Vendors - `/workshop/vendors`  
✅ Analytics - `/workshop/analytics`  
✅ Reports - `/workshop/reports`  

### H. Tyre Management

✅ Tyre Dashboard - `/tyres`  
✅ Tyre Inspection - `/tyres/inspection`  
✅ Tyre Inventory - `/tyres/inventory`  
✅ Tyre Reports - `/tyres/reports`  

### I. Inventory Management

✅ Inventory Dashboard - `/inventory`  
✅ Stock Management - `/inventory/stock`  
✅ Inventory Reports - `/inventory/reports`  

## Implementation Notes

1. **Component Naming**: All components follow the PascalCase naming convention.
2. **File Structure**: Files are organized by feature in appropriate directories.
3. **Route Parameters**: Routes that require parameters use the React Router v6 syntax.
4. **Nested Routes**: Parent routes render layout components with Outlet for child routes.

## Known Issues

1. **Duplicate Routes**: The following routes appear multiple times in the configuration:
   - `pages/trips/CostAnalysisPage` (used for both trip cost analysis and diesel cost analysis)
   - `components/Workshop Management/InspectionList` (used for both workshop inspections and compliance inspections)

2. **Missing Components**: Some components need to be created to match the configuration. These will be scaffolded with placeholder content.

## Next Steps

1. **Component Creation**: Generate missing components based on the sidebar configuration.
2. **Route Testing**: Test all routes to ensure they correctly render the intended components.
3. **Documentation**: Update API documentation with the new routing structure.
4. **Backend Integration**: Ensure all components correctly integrate with Firebase/Firestore data.
