# Heavy Vehicle Fleet Management System Specification

## Table of Contents

1. [Introduction](#introduction)
2. [Core Modules and Functional Requirements](#core-modules-and-functional-requirements)
   1. [Work Order (Job Card) Module](#work-order-job-card-module)
   2. [Inspection & Fault Management Module](#inspection--fault-management-module)
   3. [Root Cause Analysis (RCA) Module](#root-cause-analysis-rca-module)
   4. [Purchase Order (PO) Module](#purchase-order-po-module)
   5. [Incident Reporting Module](#incident-reporting-module)
   6. [Tyre Management Module](#tyre-management-module)
   7. [Users and Roles Module](#users-and-roles-module)
3. [System Mapping Matrix](#system-mapping-matrix)
4. [Key Workflows and Integrations](#key-workflows-and-integrations)
5. [UI/UX and Functional Rules](#uiux-and-functional-rules)
6. [Attachments and Audit](#attachments-and-audit)
7. [Data Export/Integration](#data-exportintegration)
8. [Legend of Key Mappings](#legend-of-key-mappings)

## Introduction

This document provides a detailed specification for the Heavy Vehicle Fleet Management System, outlining the functional requirements, data models, and critical integration points across its core modules. The goal is to ensure a unified, robust, and maintainable system that supports end-to-end fleet operations.

## Core Modules and Functional Requirements

### Work Order (Job Card) Module

The Work Order (WO) module manages all vehicle maintenance and repair tasks.

#### Work Order General Flow & States

Work Orders progress through the following states:

- **Initiated**: A new work order has been created.
- **In Progress**: Work has begun (timer starts).
- **Completed**: All tasks are marked as done (status automatically updates).

#### Required Actions

- **View**: Display comprehensive work order details, including tasks, parts used, costs, attachments, and historical logs.
- **Edit**: All data fields (tasks, parts, attachments, labor, remarks) must be editable, respecting user permissions.
- **Attachments**: Support for uploading and downloading various file types (quotes, invoices, photos). PDF download for attachments is required.
- **Details Display**: Each work order must display its current status, associated timestamps (creation, last update, completion), and linked Purchase Order (PO) numbers.

#### Fault/Inspection Integration

- **Fault Highlighting**: Linked faults from inspections must be visible as badges or icons on the work order. Major or recurring faults should trigger an escalation visual.
- **Drill-down**: Clicking a fault badge/icon must open its full history, including corrective actions and links to other relevant job cards or work orders.

#### Corrective Actions & RCA

- **Task Synchronization**: When a task linked to an inspection fault is completed, it must automatically update/complete the corresponding task on the associated work order.
- **Root Cause Analysis (RCA)**: A dedicated RCA modal is required if a critical or frequently serviced item on the vehicle is replaced or repaired within a 3-month period. Completion of the RCA is mandatory for closing such flagged work orders.

#### Data Model: WorkOrder

| Field | Type | Description |
|-------|------|-------------|
| workOrderId | string | Unique identifier |
| vehicleId | string | Link to the associated vehicle |
| status | enum | Initiated, In Progress, Completed |
| tasks | [ TaskEntry ] | List of tasks to be performed |
| partsUsed | [ PartEntry ] | List of parts consumed |
| laborEntries | [ LaborEntry ] | Records of labor hours and technicians |
| attachments | [ Attachment ] | Linked documents/images |
| remarks | [ Remark ] | General notes and comments |
| timeLog | [ TimeLogEntry ] | Automated time tracking entries |
| linkedInspectionId | string | ID of the inspection that initiated this WO |
| linkedPOIds | [ string ] | List of associated Purchase Order IDs |
| createdBy | UserRef | Reference to the user who created the WO |
| createdAt, updatedAt | timestamp | Timestamps for record management |

### Inspection & Fault Management Module

This module handles vehicle inspections and tracks detected faults.

#### Inspection List View

- **Display**: Show all completed inspections per vehicle, including date, inspector, and location.
- **Fault Highlighting**: Faults detected during an inspection must be visually highlighted (e.g., red badge).
- **Actionable Links**: Faults should link directly to their corrective action status and the associated work order number.
- **Mechanic Action**: The assigned mechanic must complete a corrective action form for each flagged item.

#### Data Model: Inspection & CorrectiveAction

**Inspection**

| Field | Type | Description |
|-------|------|-------------|
| inspectionId | string | Unique identifier |
| vehicleId | string | Linked vehicle |
| reportNumber | string | Unique inspection report number |
| date, time, location | timestamp/string | When and where inspection occurred |
| inspector | UserRef | User who performed the inspection |
| faults | [ FaultEntry ] | List of identified faults |
| notes | string | General inspection notes |
| correctiveActions | [ CorrectiveAction ] | List of actions taken for each fault |
| linkedWorkOrderId | string | ID of the work order generated from this inspection |

**CorrectiveAction**

| Field | Type | Description |
|-------|------|-------------|
| status | enum | Not Taken, Taken (Color-coded for quick visual assessment) |
| mechanicName | string | Name of the mechanic who performed the action |
| dateCompleted | timestamp | When the action was completed |
| note | string | Details about the action taken |
| RCARequired | boolean | Automatically set to true if the item is recurring or critical |
| RCADetails | RootCauseAnalysisEntry | Link to RCA details if required |

### Root Cause Analysis (RCA) Module

This module facilitates the investigation of recurring or critical failures.

#### RCA Trigger & Form

- **Auto-Trigger**: The RCA form is automatically triggered for flagged work orders (e.g., same major item replaced/repaired within 3 months).

**RCA Form Fields**:

- **Root Cause**: Dropdown selection (e.g., Driver Negligence, Poor Part, Bad Road, Workshop Fault).
- **RCA Conducted By**: User selection.
- **Responsible Person**: Assignee for follow-up actions.
- **Notes**: Free text for detailed analysis.
- **Attachments**: Optional file uploads.
- **Mandatory Completion**: RCA completion is mandatory to close any flagged work orders.

### Purchase Order (PO) Module

The PO module manages the procurement of parts and services.

#### PO Creation

- **Trigger**: POs can be created directly from a Job Card when required parts are not in stock.
- **Fields**: PO Number (auto-generated), Title, Description, Due Date, Vendor, Requester, Priority, Site/Project, Shipping Address.
- **Item Details Table**: Includes Item Number, Item Name, Quantity, Unit, Item Cost, and Total Cost.
- **Attachments**: Support for quotes and approval documents.
- **Terms & Conditions**: Dedicated field.
- **Part Sourcing Buttons**: "Pick from Demand List," "Scan Parts," "Pick from Parts List" for efficient item selection.

#### PO View

- **Read-only view** of all PO fields with PDF download support.
- **Status**: Displays PO lifecycle (Open, Approved, Received, Closed, etc.).

### Incident Reporting Module

This module allows logging and managing incidents related to vehicles and operations.

#### Incident Dashboard

**Columns**: Action (View/Edit), Incident Number, Incident Date/Time, Vehicle, Location, Reported By, Download Report.

#### Incident Entry Form

- **Core Fields**: Incident Number (auto), Date, Time, Vehicle Number, Vehicle Name, VIN, Operator, Type, Location, Weather, Severity Rating (e.g., Critical, Major, Minor).
- **Images**: Support for uploading up to 6 incident-related images.
- **Narrative**: Fields for incident description, cause, damage list, and additional comments.
- **Linkage**: Incidents must be linkable to a specific vehicle and its logbook history.

### Tyre Management Module

This module provides comprehensive management of vehicle tyres.

#### Tyre Inventory Dashboard

**List View Columns**: Action (Edit/View/Delete), Tire Number (unique serial), Manufacturer, Tyre Condition (OK, NEEDS ATTENTION), Vehicle Assigned (linked to position, e.g., "1H-ACO8468"), Status (NEW, OLD, RETREADED), Miles/KM Run (with progress bar), Tread Depth (mm), Mount Status (ON VEHICLE, IN STORE).

**Filters/Features**: Search by Tyre Number, Vehicle, Status. Export to CSV/PDF. Sort by any column.

#### Tyre Add/Edit Form

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Tire Number | Text | Yes | Unique Tyre Serial |
| Tire Size | Text | Yes | Structured: e.g., 315/80R22.5 |
| Tire Type | Dropdown | Yes | Steer, Drive, Trailer, etc. |
| Tire Pattern | Text | No | Tread Pattern |
| Manufacturer | Text | No | Manufacturer name |
| Year | Number | No | Manufacturing Year |
| Tire Cost | Currency | No | For Cost/KM calculation |
| Tire Condition | Dropdown | Yes | OK/Needs Attention |
| Tire Status | Dropdown | Yes | New/Used/Retreaded |
| Vehicle Assign | Dropdown | No | Fleet number/plate |
| Axle Position | Dropdown | No | 1–16 (auto for each vehicle configuration) |
| Mount Status | Dropdown | Yes | On Vehicle/In Store/Spare |
| Miles/KM Run | Number | No | Running km |
| Miles/KM Limit | Number | No | Expected lifespan |
| Tread Depth | Number (mm) | No | Current tread depth |
| Load Index | Number | No | (if available) |
| Speed Rating | Text | No | (if available) |
| Tyre Pressure | Number | No | Current PSI/kPa |
| Notes | Text | No | Free text |

- **CSV Import**: Support bulk import for all fields.
- **Auto-allocation**: Tyre position should auto-number (1–X) based on vehicle type (e.g., Interlink 1–20, Horse 1–10).

#### Vehicle Tyre Overview (Per Asset)

- **Display**: Shows all tyres by position and serial for a specific vehicle.
- **Details**: Includes Tyre Status, Tread Depth, Last Inspection Date, complete Tyre History (past and present tyres fitted).
- **Performance Metrics**: Displays when a tyre was last changed/replaced, total km run, and cost per km.
- **Integration**: Shows inspection history and faults related to specific tyre positions.

#### Reporting & Analytics

- **Cost Per KM Calculation**: Cost per km = Tire Cost / Estimated Life (KM).
- **Brand/Pattern Matrix**: Compare fitted brands by km, cost, and pattern.
- **Visual Recommendations**: Color-coded badges for best/worst ROI.
- **Export/Download**: All data exportable as CSV/PDF.

### Users and Roles Module

Manages system users and their access permissions.

#### User Roles

- **Operator**: Limited create/view access (Fuel, Inspection, Logbook). Cannot approve/close Work Orders.
- **Technician**: Can enter corrective actions and complete tasks on Inspections and Job Cards. Can create RCA.
- **Admin/Sub Admin**: Full CRUD (Create, Read, Update, Delete) access to all modules. PO Approval, RCA Approval.
- **Workshop/Employee**: Access to all Workshop-related Modules (Labour, Checklist, Inventory, Job Cards).

#### User/Team Assignment Logic

- Every job/task must support assignment to existing users.
- Ability to search/select from active users, showing their roles and access areas.
- User info: Name, Role, User ID, Email, Status, User Access Area.

## System Mapping Matrix

This matrix details the critical data flows and logical connections between modules.

### Vehicle ↔ Tyre Management

| Vehicle Asset Field | Tyre Field | Mapping/Logic |
|---------------------|------------|---------------|
| Fleet Number | Vehicle Assign | Tyres are assigned by fleet number and position |
| Axle/Position No. | Axle Position | Tyre positions auto-map (1-N) based on vehicle configuration |
| Tyre History | Tyre Number/Status | All tyres fitted (past/present) with status and change history |
| Tyre Inspection Date | Last Inspection | Each tyre logs last inspection, and overall inspection schedule |
| Tyre Cost/KM | Cost per KM | Calculated per tyre and aggregated to vehicle |

### Job Card ↔ Inspections ↔ RCA

| Inspection Item | Fault Flag/Status | Job Card Task | RCA Required (Flagged) |
|-----------------|-------------------|---------------|------------------------|
| Checklist Item (e.g. Tyre) | Fault Detected | Auto-created as task on WO | If re-replaced in < 3 months |
| Fault Description | Memo | Task Description on WO | RCA auto-triggered and required |
| Corrective Action Taken | Yes/No (by Mechanic) | Task Marked Complete/NA | Completion of RCA unlocks WO closure |
| Mechanic Name | Workshop Assigned | Labor Log | - |

### Job Card ↔ Parts Inventory ↔ Purchase Order

| Job Card Parts Request | Inventory Check | PO Generation | Parts Allocation |
|-----------------------|-----------------|---------------|------------------|
| Part Needed | In Stock? | If NO: create PO | PO links to WO and closes loop |
| WO Number | Linked WO | PO stores WO Reference | On receipt, part booked to WO |
| Task Completion | All Parts Available | Mark Task as Complete | Update Inventory |

### Tyre Management ↔ Reporting & Analytics

| Tyre Data Field | Analytics/Report Output | Mapping / Business Use |
|-----------------|-------------------------|------------------------|
| Tyre Number | Fleet Tyre History | Track total use, lifespan, cost |
| Cost, Lifespan (km) | Cost per KM | Used for cost/brand analysis |
| Brand/Pattern | Brand ROI Report | Data-driven purchase recommendations |
| Tread Depth | Safety/Replacement Schedule | Automatic notifications/flags for replacement |
| Last Inspection Date | Inspection Compliance Report | Compliance and maintenance scheduling |

### Incident Report ↔ Vehicle & Users

| Incident Form Field | Vehicle/User Field | Mapping / Logic |
|--------------------|-------------------|-----------------|
| Incident Number | Vehicle Number | Incident logs to vehicle logbook/history |
| Reported By | User ID / Operator | Mapped for accountability and notification |
| Incident Severity | Safety Dashboard | Rollup for HSE and operational management |
| Images/Docs | Attachments | Linked to Incident, downloadable from report |

## Key Workflows and Integrations

### Inspection → Work Order → RCA → Completion

1. Inspection detects a fault on a vehicle.
2. Fault is flagged, and a Job Card (Work Order) is automatically created with corresponding tasks.
3. If the same fault/item repeats within 3 months, an RCA is triggered and required before the Work Order can be closed.
4. All corrective actions (tasks on the WO) must be marked "Fixed" by the Workshop.
5. A Work Order can only be closed once all its tasks are complete and (if flagged) the RCA is finalized.

### Job Card → Parts Inventory → PO

1. A Job Card is created, listing required parts.
2. The system checks the Parts Inventory for availability.
3. If parts are in stock, they are booked out, and the task is marked as ready.
4. If parts are not in stock, a Purchase Order (PO) is automatically created and linked to the Work Order.
5. Upon receipt of the parts, they are booked to the job, updating inventory.
6. The Work Order can only be closed after all required parts and tasks are fulfilled.

### Tyre Lifecycle

1. A tyre is assigned to a vehicle at a specific axle position.
2. Each tyre tracks its install date, current kilometers run, inspection history, pressure, tread depth, and any associated faults.
3. When a tyre is replaced, the old tyre's out-of-service status is recorded, its final cost per kilometer is calculated, and it's flagged if replaced prematurely.
4. Tyre data is continuously available for analytics, cost control, and proactive replacement planning.

### Incident Entry → Notification → Reporting

1. An Incident is logged via a dedicated form (linking to vehicle, user, images, and severity).
2. Notifications are sent to safety/admin personnel if the incident severity is critical.
3. The incident report is downloadable and becomes part of the vehicle's historical logbook.

## UI/UX and Functional Rules

- **Tab-based Navigation**: Implement tabs for all multi-section views (e.g., Job Card details).
- **Drill-down & Back-navigation**: Dashboards link to detail views, always providing clear back-navigation.
- **Edit and Download (PDF)**: Available on all detailed screens for records (Work Orders, POs, Incidents).
- **Flagging**: Any repeated critical maintenance or failure within 3 months automatically prompts an RCA.
- **Attachments**: All major forms (Work Order, PO, Incident) must support file attachments (PDF, images, etc.) with view and download capabilities.
- **Dynamic Field Loading**: Dropdowns (users, vehicles, parts) must dynamically load and reflect current master data.
- **Team Assignments**: Always allow searching/selecting from the active user/team list for assignments.

## Attachments and Audit

- **Attachments Everywhere**: Every record (Work Order, PO, RCA, Inspection, Incident) must support the addition, viewing, and downloading of various attachment types.
- **Comprehensive Audit Logging**: Every significant action (status change, task completion, approval, edit, RCA entry) must be logged with the performing user's ID and a timestamp, ensuring full traceability and compliance.

## Data Export/Integration

- **Universal Export**: All major data tables (tyres, job cards, incidents, inspections, POs, etc.) must support export to CSV and PDF formats for external Business Intelligence (BI) tools like PowerBI.
- **Bulk Import**: Support CSV upload for initial data seeding or mass updates for modules like tyres, parts, users, and inspection templates.
- **Search/Filter/Sort**: All list/table views must include robust search, filter, and sort functionalities.
- **Visual Summaries**: Utilize visual cues like badges and progress bars on dashboards (e.g., for Tyre KM run, WO completion).

## Legend of Key Mappings

| Abbreviation/Field | Explanation |
|-------------------|-------------|
| WO | Work Order / Job Card |
| RCA | Root Cause Analysis |
| PO | Purchase Order |
| Tyre Number | Unique Serial for Each Tyre |
| Vehicle Assign | Fleet/Asset ID/Plate Number |
| Axle Position | Mapped Position Number (e.g., 1, 2...20) |
| Status | Lifecycle State (New, On Vehicle, In Store, etc.) |
| Fault Flag | Visual Alert for Fault/Inspection |
| Attachment | Files/Images/Documents linked to record |
