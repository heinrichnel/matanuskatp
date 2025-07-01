# ⚙️ Development Instructions: Workshop, Tyre Management & Inventory Management

## 🔧 OVERVIEW
This module forms the operational heart of the transport system. It includes:
- Workshop Inspection and Job Card handling
- Tyre lifecycle management
- Inventory (parts and materials) system

It is NOT a UI-only feature. Everything must be connected to Firestore and reflect in dashboards and logic flows.

---

## 1️⃣ WORKSHOP: INSPECTION & JOB CARD SYSTEM

### 🔍 InspectionForm Component
**Purpose**: Create new inspections on any fleet vehicle.

**Required Fields**:
- Inspection Name (text)
- Date of Inspection (auto-today or selectable)
- Inspector (dropdown or typed name)
- Fleet Number (dropdown from vehicle list)
- Driver (linked to selected fleet)
- Time Start (auto on form open)
- Time End (auto on form submit and locked)
- Categories:
  - Brakes, Engine, Tires, Lights, Body, Safety, Other
  - Each item must have: ✅ Pass / ❌ Fail / ➖ N/A / ⏳ Pending
- Remarks: Free text
- Critical Faults: Flagged items to be escalated to job card

### 🔄 Logic
- When inspection is submitted:
  - Faults with ❌ must be compiled into a `FaultList`
  - A modal must appear to confirm **"Create Job Card?"**
  - If confirmed, generate a new job card pre-filled with fleet, faults, inspector, and time

---

## 2️⃣ JOB CARD SYSTEM

### 🧾 JobCard Component
**Purpose**: Convert inspection faults into executable work orders.

**Key Fields**:
- Linked Inspection ID (readonly)
- Fleet Number (readonly)
- Open Date/Time (auto)
- Estimated Close Time (selectable)
- Technician Assigned (dropdown)
- Tasks: Description, Status, Notes
- Required Parts: Item name, quantity, cost, in-stock indicator
- Labor Hours: Technician name, rate, time worked
- Job Card Status:
  - Created → Assigned → In Progress → Parts Pending → Completed → Invoiced

### 📦 Inventory Integration
- Parts must be deducted from `Inventory` when job card is saved
- Out-of-stock parts must trigger error or prompt
- CSV import/export of stock must be available in `InventoryManagement`

---

## 3️⃣ TYRE MANAGEMENT SYSTEM

### 📊 TireDashboard Component
- Visual card or table for each fleet showing:
  - Tyre Status (Good, Worn, Urgent)
  - Brand, Pattern, DOT Code, Serial No.
  - Date installed, current KM, estimated remaining life

### 🧷 VehicleTireView Component
- Shows vehicle diagram (10–22 tyre positions)
- Each position must:
  - Be selectable
  - Show tyre ID, tread depth, pressure
  - Allow update or rotation
  - Highlight problems (color: green/yellow/red)

### 📝 TireInspection Component
- Select Fleet No.
- Capture tread depth, pressure, sidewall condition
- Photo upload (optional)
- Auto-detect issues and log to `FaultList` or `TyreJobCard`

### 🛠 TireJobCard Component
- Replacement or rotation task creation
- Must capture:
  - Old tyre ID
  - New tyre ID (from inventory)
  - Technician
  - Position mapping
  - Cost and brand

---

## 4️⃣ INVENTORY MANAGEMENT SYSTEM

### 🗃 InventoryManagement Component
- Part categories: Tyres, Brake Pads, Filters, Oils, Electrical, Suspension, Lights
- Data must include:
  - Part ID
  - Description
  - Quantity In Stock
  - Unit Cost
  - Reorder Level
  - Supplier Name
  - Last Order Date
  - Vehicle Compatibility (optional)

### 🧮 Features:
- Add new item (manual or CSV import)
- Update item (edit form)
- Deduct stock on job card save
- Auto-alert on low stock
- Export inventory as CSV
- Mobile-compatible UI

---

## 5️⃣ GENERAL INTEGRATION & RULES

### 🔗 Relationships
- Each inspection → job card → inventory interaction must be tracked
- Faults from inspections must feed:
  - Fault Dashboard
  - JobCard trigger
- Tyre issues must follow same flow

### 🔐 Permissions
- Only Admins and Maintenance Managers can:
  - Approve inspections
  - Close job cards
  - Remove or adjust inventory
- Technicians can:
  - Log inspections
  - Add remarks
  - Start/complete their assigned tasks

### 🧪 Testing & Validation
- All data changes must sync with Firestore
- Use `merge: true` on updates to avoid overwrite
- Prevent duplicate job card creation
- Support offline form caching (optional)

---

## ✅ Summary
This system must be:
- Real-time synced with Firebase
- Usable on mobile and desktop
- Integrated across inspections → job cards → inventory
- Visual, structured, and audit-compliant

# Comprehensive Tyre Management System

## 1. Data Structure & Models

### Tyre Data Schema:
- Tyre ID, Serial Number, DOT Code, Manufacturing Date
- Brand (Michelin, Bridgestone, Continental, etc.), Model, Pattern Type
- Size specifications (width, aspect ratio, rim diameter)
- Load index, Speed rating, Tyre type (Steer, Drive, Trailer)
- Purchase details (date, cost, supplier, warranty)
- Installation details (vehicle, position, mileage at installation)

### Position Management:
- Vehicle-specific position mapping (Front Left, Front Right, Rear positions)
- Dual wheel configurations for trucks
- Trailer tyre positions
- Spare tyre tracking

---

## 2. Visual Components & Dashboard

### Tyre Status Dashboard:
- Real-time tyre health overview with color-coded status indicators
- Visual vehicle diagrams showing tyre positions and conditions
- Brand performance analytics with visual charts
- Tread depth visualization using progress bars and heat maps
- Tyre rotation schedules with visual timelines

### Interactive Vehicle Diagrams:
- Clickable vehicle schematics showing tyre positions
- Color-coded status (Good - Green, Warning - Yellow, Critical - Red)
- Hover details showing tyre specifications and metrics
- Position-wise tread depth and pressure indicators

---

## 3. Brand & Pattern Management

### Brand Analytics:
- Performance comparison across different tyre brands
- Cost per kilometre analysis by brand
- Failure rate tracking and brand reliability metrics
- Seasonal performance data (wet weather, highway, off-road)

### Pattern Management:
- Tread pattern database with visual representations
- Pattern suitability for different vehicle types and conditions
- Performance metrics by pattern type
- Rotation recommendations based on pattern design

---

## 4. Advanced Reporting System

### Position-wise Reports:
- Individual tyre performance by vehicle position
- Wear pattern analysis and recommendations
- Position-specific replacement scheduling
- Cost analysis per position across the fleet

### Visual Reports:
- Interactive charts showing tyre performance trends
- Brand comparison dashboards with visual metrics
- Tread depth progression graphs
- Cost analysis with visual breakdowns
- Maintenance scheduling with calendar views

---

## 5. Maintenance & Monitoring

### Proactive Management:
- Automated alerts for tyre rotation, replacement, and pressure checks
- Tread depth monitoring with visual indicators
- Pressure monitoring integration (if TPMS available)
- Mileage-based replacement recommendations

### Digital Inspection Forms:
- Mobile-friendly tyre inspection checklists
- Photo capture for visual documentation
- Tread depth measurement recording
- Damage assessment with severity indicators

---

## 6. Integration Features

### Workshop Integration:
- Tyre work orders through existing job card system
- Parts inventory integration for tyre stock management
- Service history tracking within existing maintenance records
- Cost tracking through existing financial systems

### Fleet Management Integration:
- Tyre costs included in vehicle operating costs
- Performance metrics integrated into fleet dashboards
- Maintenance scheduling within existing fleet operations
- Vehicle downtime tracking for tyre-related issues

---

## 7. Mobile & Field Features

### Driver Interface:
- Pre-trip tyre inspection checklists
- Photo reporting for tyre issues
- Emergency tyre service requests
- Tyre pressure monitoring alerts

### Technician Tools:
- Mobile tyre inspection forms
- Barcode scanning for tyre identification
- Work order management for tyre services
- Parts ordering and inventory management

---

## 8. Analytics & Intelligence

### Predictive Analytics:
- Tyre life prediction based on usage patterns
- Optimal replacement timing recommendations
- Route-based tyre performance analysis
- Seasonal tyre strategy recommendations

### Cost Optimization:
- Total cost of ownership analysis
- Brand ROI comparisons
- Bulk purchasing recommendations
- Tyre programme optimisation suggestions

---

This tyre management system would integrate seamlessly with your existing fleet management structure, adding a dedicated "Tyre Management" tab to your Workshop Operations. The system would provide:

- **High Visual Attributes**: Interactive vehicle diagrams, color-coded status indicators, progress bars for tread depth, and comprehensive visual dashboards  
- **Brand Management**: Complete brand performance analytics, cost comparisons, and reliability tracking  
- **Tyre Pattern Management**: Pattern database with visual representations and performance metrics  
- **Position-wise Reporting**: Detailed analysis by tyre position with visual charts and recommendations

# 🛠 Comprehensive Workshop System

## 1. Inspection Sheets & Templates

### Truck Inspection Template (25+ Checks):
- **Engine**: Oil level, coolant, air filter, belts, battery
- **Brakes**: Brake pads, fluid, air pressure, parking brake, brake lines
- **Tyres**: Condition, pressure, wheel nuts
- **Lights & Electrical**: Headlights, brake lights, indicators
- **Safety Equipment**: Seat belts, fire extinguisher, first aid kit
- **Body & Structure**: Mirrors, windshield, horn, wipers

### Trailer Inspection Template (20+ Checks):
- **Coupling & Connection**: Fifth wheel, air lines, electrical
- **Brakes**: Adjustment, air lines, brake chambers
- **Tyres & Wheels**: Pressure, wheel nuts (all axles)
- **Lights**: Tail lights, brake lights, indicators, reflectors
- **Structure**: Landing gear, suspension, load securing

Each inspection item includes:
- Criticality flag (Low, Medium, High, Critical)
- Pass/Fail/NA status
- Description and requirements

---

## 2. Fault Management System

- Severity levels: Low, Medium, High, Critical
- Status tracking: `open`, `in_progress`, `resolved`, `deferred`
- Fault assignment to technicians
- Category-based filtering
- Statistical overview dashboard (counts by status, severity, category)

---

## 3. Job Card Templates & System

### Templates Include:
- **Basic Vehicle Service**: Oil change, fluid checks
- **Brake System Service**: Brake pad replacement, inspection
- **Engine Diagnostics & Repair**: OBD scanning, testing

### Structure:
- Detailed task breakdowns with estimated hours
- Required tools and skills
- Safety notes and verification steps
- Parts & material templates with cost estimates
- Work progression tracking and status updates
- Quality control checklist integration

### Template Features:
- Filter by vehicle type or maintenance category
- Preview and clone existing templates
- Modify templates before job card generation
- Track cost (labour + parts) with real-time estimates

---

## 4. Workflow Admin System

### Capabilities:
- Define **workflow templates** for each inspection type
- Assign **roles** per step: Driver, Technician, Supervisor, Manager
- **Conditional logic**: Workflow steps that trigger based on inspection result (e.g., critical fault → job card required)
- Activate/Deactivate workflows for testing
- Duplicate templates for alternate fleet groups

### Workflow UI Features:
- Template selector (Truck or Trailer)
- Step designer with time estimates
- User role assignment
- Progress analytics tracking

---

## 5. Refactored Code Components

### Inspection System Components:
- `InspectionFormHeader`: Inspector, driver, fleet selector
- `InspectionStats`: Real-time progress counts (passed, failed)
- `InspectionActionButtons`: Start/Submit/Create Job Card
- `InspectionCategoryNav`: Category navigation with progress bars
- `InspectionItemCard`: Per-item checkboxes and notes

### Inspection Management:
- `InspectionStatistics`: High-level KPI cards
- `InspectionFilters`: Date/status/vehicle filters
- `InspectionListItem`: Individual record renderer
- `InspectionList`: Main listing with filter logic
- `InspectionManagement`: Orchestrator

---

## 6. Tyre System in Workshop Context

- Tyre status, tread depth, pressure, DOT code
- Installation history and position tracking
- Tyre inventory linking to job cards
- Retread tracking
- Fuel efficiency and rotation analytics

---

## 7. Best Practices Implemented

### Fleet Maintenance:
- DOT-compliant daily inspections
- Classification of critical/non-critical faults
- Preventive Maintenance Scheduling (PMS)
- Integrated job cards from inspections
- Cost tracking: Per job, vehicle, component
- Quality assurance and safety documentation

### Tyre Management:
- DOT code + serial number logging
- Tread depth alerts with visual status
- Pressure tracking (manual or TPMS)
- Lifecycle cost analysis by position
- Warranty + supplier records

---

## 8. System Enhancements Planned

- ❄️ **Seasonal Templates** (winter checks, long-haul prep)
- 🚨 Emergency roadside job cards
- 🔧 Major component overhaul templates (e.g., gearbox)
- 📝 Annual & periodic compliance inspections
- 📋 Regulatory dashboards (compliance reports)
- 🖼 Job card photo support:
  - Upload before/after repair images
  - Attach parts photos for verification
  - Full photo gallery per job card
- 🔄 Auto-link: Faults → Job Cards → Inventory pull
- 🛒 Auto-suggest stock order from job card shortage

---

This system enables a complete maintenance loop from inspection to action:

> **Inspection → Fault List → Job Card → Task/Parts Assignment → Completion → Reporting**

Ready for mobile and desktop with deep role integration and analytics support.
