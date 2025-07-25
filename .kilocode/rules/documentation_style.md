# Heavy Vehicle Fleet System: Module Mapping & Functional Requirements

## 1. Work Order Module

### Work Order General Flow
States:  
Initiated → In Progress (start timer) → Completed (auto on all tasks done)

**Required Actions:**
- On view: Show full work order details, tasks, parts, costs, attachments, logs.
- Edit: All data editable (tasks, parts, add/edit attachments, labor, remarks).
- Attachments: Quotes, invoices, photos (PDF download support).
- Status, timestamps, and PO linkage must display on each work order.

**Fault/Inspection Integration:**
- Linked faults must show as badges/icons (with escalation when major/recurring).
- Clicking faults opens full history, corrective action, and job card/work order links.

**Corrective Actions:**
- Completion of a task on the inspection auto-populates/completes the work order’s corresponding task.
- Root Cause Analysis (RCA) modal required if critical/frequent item changed within 3 months.

#### Database/Model Mapping
##### WorkOrder
- workOrderId (string)
- vehicleId (string)
- status (enum: Initiated, In Progress, Completed)
- tasks: [ TaskEntry ]
- partsUsed: [ PartEntry ]
- laborEntries: [ LaborEntry ]
- attachments: [ Attachment ]
- remarks: [ Remark ]
- timeLog: [ TimeLogEntry ]
- linkedInspectionId (string)
- linkedPOIds: [ string ]
- createdBy (UserRef)
- createdAt, updatedAt (timestamp)

---

## 2. Inspection & Fault Management

### Inspection List
- Show all completed inspections per vehicle with date, inspector, location.
- Highlight faults (red badge) and link to corrective action status and work order number.
- Mechanic must complete the corrective action form for each flagged item.

#### Fault/Corrective Action Model
##### Inspection
- inspectionId (string)
- vehicleId (string)
- reportNumber (string)
- date, time, location
- inspector (UserRef)
- faults: [ FaultEntry ]
- notes (string)
- correctiveActions: [ CorrectiveAction ]
- linkedWorkOrderId (string)

##### CorrectiveAction
- status: Not Taken, Taken (color-coded)
- mechanicName
- dateCompleted
- note
- RCARequired (bool, auto if recurring/major)
- RCADetails (RootCauseAnalysisEntry)

---

## 3. System Mapping Matrix

### 1. Vehicle ↔ Tyre Management
| Vehicle Asset Field | Tyre Field      | Mapping/Logic                                                      |
|---------------------|-----------------|--------------------------------------------------------------------|
| Fleet Number        | Vehicle Assign  | Tyres are assigned by fleet number and position                    |
| Axle/Position No.   | Axle Position   | Tyre positions auto-map (1-N) based on vehicle config              |
| Tyre History        | Tyre Number/Status | All tyres fitted (past/present) with status and change history  |
| Tyre Inspection Date| Last Inspection | Each tyre logs last inspection, and overall inspection schedule    |
| Tyre Cost/KM        | Cost per KM     | Calculated per tyre and aggregated to vehicle                      |

### 2. Job Card ↔ Inspections ↔ RCA
| Inspection Item | Fault Flag/Status | Job Card Task | RCA Required (Flagged) |
|-----------------|-------------------|---------------|------------------------|
| Checklist Item (e.g. Tyre) | Fault Detected | Auto-created as task on WO | If re-replaced in < 3 months |
| Fault Description | Memo | Task Description on WO | RCA auto-triggered and required |
| Corrective Action Taken | Yes/No | Task Marked Complete/NA | Completion of RCA unlocks closure |
| Mechanic Name | Workshop Assigned | Labor Log | |

### 3. Job Card ↔ Parts Inventory ↔ Purchase Order
| Job Card Parts Request | Inventory Check | PO Generation | Parts Allocation |
|-----------------------|-----------------|---------------|------------------|
| Part Needed | In Stock? | If NO: create PO | PO links to WO and closes loop |
| WO Number | Linked WO | PO stores WO Reference | On receipt, part booked to WO |
| Task Completion | All Parts Avail | Mark Task as Complete | Update Inventory |

### 4. Tyre Management ↔ Reporting & Analytics
| Tyre Data Field | Analytics/Report Output | Mapping / Business Use |
|-----------------|------------------------|-----------------------|
| Tyre Number | Fleet Tyre History | Track total use, lifespan, cost |
| Cost, Lifespan (km) | Cost per KM | Used for cost/brand analysis |
| Brand/Pattern | Brand ROI Report | Data-driven purchase recommendations |
| Tread Depth | Safety/Replacement Schedule | Automatic notifications/flags |
| Last Inspection Date | Inspection Compliance Report | Compliance and maintenance scheduling |

### 5. Incident Report ↔ Vehicle & Users
| Incident Form Field | Vehicle/User Field | Mapping / Logic |
|---------------------|-------------------|-----------------|
| Incident Number | Vehicle Number | Incident logs to vehicle logbook/history |
| Reported By | User ID / Operator | Mapped for accountability and notification |
| Incident Severity | Safety Dashboard | Rollup for HSE and operational management |
| Images/Docs | Attachments | Linked to Incident, downloadable from report |

### 6. User & Access Control
| User Role | Module Access | Comments |
|-----------|---------------|----------|
| Operator | Fuel, Inspection, Logbook | Limited create/view, cannot approve/close WO |
| Technician | Inspections, Job Cards, RCA | Can enter corrective action and complete tasks |
| Admin/Sub Admin | All Modules | Full CRUD, PO Approval, RCA Approval |
| Workshop/Employee | All Workshop Modules | Labour, Checklist, Inventory, Job Cards |

---

## 4. Workflows and Integration

### A. Inspection → Work Order → RCA → Completion
- Inspection detects fault.
- Fault flagged: create Job Card (WO) with tasks.
- If fault repeats < 3 months, RCA is triggered before WO can close.
- All corrective actions (tasks) must be marked “Fixed” by Workshop.
- WO can only be closed when all tasks and (if flagged) RCA are complete.

### B. Job Card → Parts Inventory → PO
- Job Card created, lists required parts.
- System checks stock.
- If available: part booked out and task marked ready.
- If not: create PO linked to WO; parts received and booked to job.
- Only after all parts/tasks are fulfilled, WO can close.

### C. Tyre Lifecycle
- Tyre assigned on vehicle (position 1–N).
- Each tyre tracks: install date, km, inspections, pressure, tread, faults.
- Tyre replaced: record out-of-service, record cost per km, flag if early.
- Data available for analytics, cost control, and replacement planning.

### D. Incident Entry → Notification → Reporting
- Incident logged via form (linked to vehicle, user, images, severity).
- Notifications to safety/admin (if severe).
- Incident report downloadable, visible in vehicle history.

---

## 5. Attachments and Audit

- Every record (WO, PO, RCA, Inspection, Incident) can have attachments.
- Every action (status change, completion, approval, edit) is audit-logged by user and timestamp.

---

## 6. Data Export/Integration

- All tables (tyres, job cards, incidents, inspections, POs) can be exported as CSV/PDF for BI/PowerBI integration.
- Bulk Import: CSV upload for tyres, parts, users, inspection templates.

---

## 7. Legend of Key Mappings

| Abbreviation/Field | Explanation |
|--------------------|-------------|
| WO | Work Order/Job Card |
| RCA | Root Cause Analysis |
| PO | Purchase Order |
| Tyre Number | Unique Serial for Each Tyre |
| Vehicle Assign | Fleet/Asset ID/Plate |
| Axle Position | Mapped Position Number (e.g., 1,2...20) |
| Status | Lifecycle State (New, On Vehicle, In Store, etc) |
| Fault Flag | Visual Alert for Fault/Inspection |
| Attachment | Files/Images/Documents linked to record |

---

This mapping ensures full traceability, compliance, and tight workflow integration between all major modules—delivering actionable insights, eliminating data silos, and supporting process automation from inspection all the way to analytics.

---

# Fleet Management System – Module Specification

## 1. Tyre Management Module

### 1.1. Tyre Inventory Dashboard
**List View Columns:**
- Action (Edit/View/Delete)
- Tire Number
- Manufacturer
- Tyre Condition (OK, NEEDS ATTENTION, etc.)
- Vehicle Assigned (linked to position, e.g. 1H-ACO8468)
- Status (NEW, OLD, RETREADED)
- Miles/KM Run (with progress bar)
- Tread Depth (mm)
- Mount Status (ON VEHICLE, IN STORE)

**Filters/Features:**
- Search by Tyre Number, Vehicle, Status
- Export to CSV/PDF
- Sort by any column

### 1.2. Tyre Add/Edit Form
| Field           | Type           | Required | Description                       |
|-----------------|----------------|----------|-----------------------------------|
| Tire Number     | Text           | Yes      | Unique Tyre Serial                |
| Tire Size       | Text           | Yes      | Structured: 315/80R22.5           |
| Tire Type       | Dropdown       | Yes      | Steer, Drive, Trailer, etc.       |
| Tire Pattern    | Text           | No       | Tread Pattern                     |
| Manufacturer    | Text           | No       |                                   |
| Year            | Number         | No       | Manufacturing Year                |
| Tire Cost       | Currency       | No       | For Cost/KM calc                  |
| Tire Condition  | Dropdown       | Yes      | OK/Needs Attention                |
| Tire Status     | Dropdown       | Yes      | New/Used/Retreaded                |
| Vehicle Assign  | Dropdown       | No       | Fleet number/plate                |
| Axle Position   | Dropdown       | No       | 1–16 (auto for each vehicle config)|
| Mount Status    | Dropdown       | Yes      | On Vehicle/In Store/Spare         |
| Miles/KM Run    | Number         | No       | Running km                        |
| Miles/KM Limit  | Number         | No       | Expected lifespan                 |
| Tread Depth     | Number (mm)    | No       | Current tread depth               |
| Load Index      | Number         | No       | (if available)                    |
| Speed Rating    | Text           | No       | (if available)                    |
| Tyre Pressure   | Number         | No       | Current PSI/kPa                   |
| Notes           | Text           | No       | Free text                         |

- CSV Import: Must support bulk import with all above fields.
- Auto-allocation: Tyre position auto-numbered 1–X for each vehicle type (e.g., Interlink 1–20, Horse 1–10, Reefer 1–6).

### 1.3. Vehicle Tyre Overview (Per Asset)
- Shows all tyres by position and serial.
- Show Tyre Status, Tread Depth, Last Inspection Date, Complete Tyre History.
- Show when tyre was last changed/replaced, total km run, cost per km.
- Show inspections history and faults related to tyre positions.

### 1.4. Reporting & Analytics
- Cost Per KM Calculation: Cost per km = Tire Cost / Estimated Life (KM)
- Brand/Pattern Matrix: Compare all fitted brands by km, cost, and pattern.
- Visual Recommendations: Color badges for best/worst ROI.
- Export/Download: All data exportable as CSV/PDF.

---

## 2. Job Card/Work Order Module

### 2.1. Job Card List View
- Columns: Action, WO Number, Vehicle, Due Date, Status, Priority, Assigned, Memo/Description
- States: Initiated, Scheduled, Inspected, Approved, In Progress, Completed
- Action Buttons: View/Edit, Start Progress, Complete

### 2.2. Job Card Details Page
**Tabs:**
- General Details
- Task Details (lists tasks; editable)
- Parts Details (link to inventory/PO)
- Labor Details (hours, technician)
- Additional Cost
- Attachments (quotes, invoices)
- Remarks
- Time Log (automated per state)

- Mandatory: Attachments, Cost Tracking, PDF Download

### 2.3. Task Auto-population/Completion Logic
- If a work order is created from an inspection, all faults/tasks auto-populate as tasks on the job card.
- After workshop attends and marks tasks as done, this auto-updates the job card and marks the WO as completed when all tasks are done.

### 2.4. RCA Flagging Logic
- If the same major item (tyre, brakes, etc.) is reported/replaced within 3 months: system must flag the item and require a Root Cause Analysis (RCA) before closing the WO.

---

## 3. Root Cause Analysis (RCA) Module

- RCA form is auto-triggered on flagged jobs.
- RCA form includes:
  - Root Cause (Dropdown: Driver Negligence, Poor Part, Bad Road, Workshop Fault, etc.)
  - RCA Conducted By (name)
  - Responsible Person
  - Notes
  - Attachments (optional)
- RCA is mandatory to close flagged WOs.

---

## 4. Purchase Order (PO) Module

### 4.1. PO Creation
- POs can be created directly from Job Card for parts not in stock.
- Fields: PO Number, Title, Description, Due Date, Vendor, Requester, Priority, Site/Project, Shipping Address
- Item Details Table: Item Number, Item Name, Quantity, Unit, Item Cost, Total Cost
- Attachments: Quotes, Approvals
- Terms & Conditions
- Button to "Pick from Demand List", "Scan Parts", "Pick from Parts List"

### 4.2. PO View
- Same fields as above, read-only with download to PDF.
- Status: Open, Approved, Received, Closed, etc.

---

## 5. Incident Reporting Module

### 5.1. Incident Dashboard
- Columns: Action, Incident Number, Incident Date/Time, Vehicle, Location, Reported By, Download Report

### 5.2. Incident Entry Form
- Incident Number, Date, Time, Vehicle Number, Vehicle Name, VIN, Operator, Type, Location, Weather, Severity Rating
- Incident Images (upload up to 6)
- Narrative: How incident occurred, cause, damage list, additional comments, reported by
- Must be able to attach incident to a vehicle and logbook.

---

## 6. Inspections & Corrective Actions

### 6.1. Inspection List View
- Report Number, Date, Vehicle, Location, Inspector, Faults (with icons), Corrective Action Status, Linked WO

### 6.2. Inspection Form
- All checklist items (tyres, brakes, bushings, etc.)
- For each: Status (OK/Not OK/NA), Notes
- After job: Workshop must fill corrective action status for each item (Fixed/Not Fixed/NA, notes)
- Mechanic Name (required to complete)
- When action taken, updates job card automatically.

### 6.3. Fault Linking/Highlighting
- All faults are clickable to open related Job Card.
- If a WO is created from an inspection, the WO number must be linked and clickable from inspection view.

---

## 7. Users and Roles

- Operators, Technicians, Admins, Sub Admins (role matrix)
- Access Control: Each user has permissions for their modules only (see your provided table)

---

## 8. Attachments Everywhere

- All forms (WO, PO, RCA, Incident) must support attachments (images, PDFs, quotes, etc.).
- Attachments can be added, viewed, and downloaded at any stage.

---

## 9. Audit & History

- All changes (state, corrective actions, RCA) must be logged in history per record.
- Every inspection, tyre swap, PO, WO, incident must be viewable in history with date/user.

---

## 10. Reporting & Export

- Every module allows export to PDF/CSV.
- All tables have search/filter/sort.
- Visual summaries (badges, progress bars) on Tyres, WOs, Inspections.

---

## 11. Advanced Features

- Auto-flag logic: Tyres/parts replaced within threshold triggers RCA.
- Bulk Import/Export: Tyres and POs.
- Cost Analysis: Tyre cost per km, WO cost by type, parts cost, labor cost.
- Recommendation Engine: Best tyre brand/pattern by cost per km.

---

# Job Card / Workorder Management

## 1.1 General Requirements
- View and Edit: Users must be able to view all workorders, drill down into the details, and edit/update them where permissions allow.
- Progress Tracking: Dashboard must show status (Initiated, Scheduled, Inspected, etc.), % completion of tasks, and highlight overdue workorders.
- Worker Assignment: Show which users are assigned per task. Allow updates.
- PDF Export: Each job card/workorder must support export as PDF, reflecting all tabbed data (General, Tasks, Parts, Labor, Attachments, etc.).
- Attachments: Allow upload of related files (quotes, invoices, images, etc.) on both view and edit.

## 1.2 Data Model (Tab Structure)
- General Details
- Task Details
- Parts Details
- Labor Details
- Additional Cost
- Attachments
- Remarks
- Time Log
- Vehicle Details

## 1.3 Store Integration
- When editing a job card, users must be able to book parts out of stock (inventory decrement logic).
- If a part is not in stock, create a PO Request (see below).

## 1.4 RCA Auto-Flag (Root Cause Analysis)
- If a critical part/inspection item (as defined in the master inspection template) is reported and replaced within 3 months since last replacement, auto-flag the workorder.
- RCA Modal: Auto-prompt completion of RCA form (root cause, RCA conducted by, responsible, notes).
- RCA result must be logged and linked to the job card.

---

# 2. Purchase Order (PO) Workflow

## 2.1 Trigger
- PO requests must be automatically creatable from job cards for any part not in stock.

## 2.2 PO Entry & View
- Entry/Edit: Must allow entry of all core PO fields:
  - PO Number, Title, Description, Due Date, Vendor, Requester, Priority
  - Item List: SKU, Item Name, Qty, Cost
  - Attachments (scan/email/upload)
  - Shipping Details: Site, Address, Recipient
  - Terms & Conditions
- PO Approval: Support for “Self Approval” or multi-stage approval logic.
- PO-Workorder Link: Must reference originating job card.
- PO Status: Show PO status (Open, Approved, Received, etc.).
- PDF Export: Same export logic as workorder.

---

# 3. User/Team Assignment Logic

- Every job/task must support assignment to existing users.
- Must be able to search/select from active users (with roles, access areas).
- User info: Name, Role, User ID, Email, Status, User Access Area (from your listing).

---

# 4. Incident Report Module

## 4.1 Requirements
- Incident Dashboard: List all reported incidents with filters by date, vehicle, reporter, severity, status.
- PDF Export: Download incident reports.
- Entry/Edit Modal: Support all fields:
  - Incident Number, Date, Time, Vehicle, Location, Type, Area, Severity, Weather, Activity, Description, Additional Comments, Reported By
  - Image Uploads (multiple slots)
- View/Drilldown: Show full incident details on click.
- Team Linkage: Show the reporting and assigned user.

---

# 5. RCA Entry Modal

## 5.1 Fields
- Root Cause (dropdown: Driver Negligence, Part Quality, Refit Error, etc.)
- RCA Conducted By (user select)
- Responsible Person
- Notes
- Save/Cancel

---

# 6. UI/UX and Functional Rules

- Tab-based navigation for all multi-section views.
- Drilldown from dashboard to details, always with back-navigation.
- Edit and Download (PDF) on all detailed screens.
- Flagging: Any repeated critical maintenance or failure within 3 months auto-prompts RCA.
- Attachments: All major forms (workorder, PO, incident) must support file attachments (PDF, image, etc.), both for view and edit.
- Dynamic field loading: Drop-downs (users, vehicles, parts) must always reflect current master data.
- Team Assignments: Always allow searching/selecting from user/team list.

---

# 7. Sample Data Field Table

| Module    | Field           | Type     | Notes                                 |
|-----------|-----------------|----------|---------------------------------------|
| Workorder | WO Number       | String   | Unique, auto-generated                |
| Vehicle   | Lookup          | Select   | Select from fleet list                |
| Status    | Enum            |          | Initiated, Scheduled, Inspected, etc. |
| Task List | Sub-table       |          | Description, Status, Assigned, Note   |
| Parts Booked | Sub-table    |          | SKU, Name, Qty, Cost                  |
| Labor     | Sub-table       |          | Worker, Code, Time, Rate, Cost        |
| Attachments | Files         |          | Quotes, photos, etc.                  |
| RCA       | Link/Modal      |          | If flagged, required                  |
| PO        | PO Number       | String   | Unique                                |
| Items     | Sub-table       |          | SKU, Name, Qty, Cost                  |
| Attachments | Files         |          | Quotes, docs, etc.                    |
| Incident  | Incident Number | String   | Unique                                |
| Images    | Files           |          | Up to 6                               |
| Severity  | Enum            |          | Critical, Major, Minor                |
| User      | Name            | String   |                                       |
| Role      | Enum            |          | Operator, Technician, Admin           |
| Access Areas | String/Enum  |          | From user master                      |

---

# 8. Compliance and Audit

- All edit actions, RCA entries, and PO approvals must be logged with timestamp and user.
- RCA entries are required on flagged events before workorder can be closed.

---

# 9. Integration / API Notes

- All modules should be API-driven to enable external reporting, Power BI integration, or mobile app extensions in future.
- Standard endpoints: /workorders, /po, /incident, /users, /rca, /attachments

