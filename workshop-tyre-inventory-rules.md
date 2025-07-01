# 🛡️ Workshop, Tyre Management & Inventory System Rules

## 1. General Principles
- All maintenance, inspection, and inventory actions must be logged in Firestore with user, timestamp, and action type.
- Data integrity is paramount: use `merge: true` for updates to prevent overwrites.
- All modules must support real-time sync and offline caching (where feasible).
- System must be audit-compliant: every change traceable to a user and time.

---

## 2. Workshop & Inspection Rules
- Only authorized users (Admins, Maintenance Managers) can approve inspections and close job cards.
- Inspections must use the provided templates; custom fields require admin approval.
- Faults marked as ❌ (Fail) or Critical must trigger a FaultList entry and prompt job card creation.
- Duplicate job cards for the same fault/vehicle/inspection are not allowed.
- All inspection and job card actions must be reflected in the dashboard and analytics.

---

## 3. Job Card Rules
- Job cards must be linked to an inspection and/or fault.
- Status progression: Created → Assigned → In Progress → Parts Pending → Completed → Invoiced.
- Only assigned technicians can update job card status or add remarks.
- Parts required must be checked against inventory before job card can be started.
- Out-of-stock parts must trigger an alert and block job card progress until resolved.
- Before/after repair images are mandatory for job completion.

---

## 4. Tyre Management Rules
- Every tyre must have a unique ID, DOT code, and serial number recorded.
- Tyre installation, rotation, and replacement must be logged with vehicle, position, and technician.
- Tread depth and pressure must be recorded at each inspection; critical values trigger alerts.
- Tyre issues must follow the same fault/job card workflow as other components.
- Tyre inventory must be updated in real time with each job card action.
- Retread and warranty status must be tracked for each tyre.

---

## 5. Inventory Management Rules
- All parts and tyres must have a unique Part ID and category.
- Stock deductions only occur on job card save/complete.
- Low stock triggers auto-alerts and suggests reorder.
- CSV import/export must be validated for duplicates and data integrity.
- Only Admins/Managers can remove or adjust inventory outside of job card flow.
- All inventory changes must be logged with user and reason.

---

## 6. Permissions & Roles
- **Admins/Maintenance Managers:** Full access, approve/close, inventory adjustments.
- **Technicians:** Log inspections, update job cards, request parts, add remarks.
- **Drivers:** Submit pre-trip inspections, report faults, upload photos.

---

## 7. Compliance & Best Practices
- DOT and local regulatory compliance for inspections and tyre management.
- Preventive Maintenance Scheduling (PMS) must be enforced for all vehicles.
- All photo uploads must be clear, timestamped, and linked to the relevant record.
- System must support audit trails for all actions.

---

## 8. Integration & Automation
- Faults auto-link to job cards and inventory pulls.
- Job card shortages auto-suggest stock orders.
- All modules must integrate with analytics and reporting dashboards.

---

## 9. Testing & Validation
- All data changes must be tested for Firestore sync and offline support.
- Prevent duplicate records and ensure referential integrity.
- Validate all permission checks and role-based access.

---

*Update this document as new rules or compliance requirements arise. All changes must be approved by system admin.*
