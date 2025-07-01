# 🚦 TransportMat System Rules & Compliance

A comprehensive set of operational, business, and technical rules for the TransportMat platform. Use this document to define, communicate, and enforce system-wide standards for workflows, data, and user actions.

---

## 1️⃣ General Principles
- All data changes must be auditable and traceable.
- Real-time sync with Firestore is mandatory for all modules.
- Role-based access control (RBAC) must be enforced at all critical actions.
- No destructive actions without confirmation and audit logging.

---

## 2️⃣ Workshop Rules
### Inspections
- Every vehicle must be inspected before assignment to a trip.
- Failed inspection items (❌) must be escalated to a Fault List.
- Critical faults require immediate job card creation and supervisor notification.

### Job Cards
- Job cards must be linked to inspections and faults.
- Only assigned technicians can update job card status.
- Job card closure requires supervisor approval.
- Parts used must be deducted from inventory on job card save.

---

## 3️⃣ Tyre Management Rules
- Tyre installation/removal must be logged with serial, DOT, and position.
- Tread depth and pressure must be recorded at every inspection.
- Tyre rotation and replacement must follow manufacturer and fleet policy.
- Out-of-spec tyres (worn, damaged) must be flagged and replaced before next trip.

---

## 4️⃣ Inventory Management Rules
- All inventory changes (add, deduct, adjust) must be logged with user and timestamp.
- Out-of-stock parts must trigger reorder alerts.
- Only authorized users can adjust or remove inventory records.
- Inventory CSV import/export must validate data integrity before applying changes.

---

## 5️⃣ User Roles & Permissions
- **Admin**: Full access, can approve/close all records, manage users.
- **Maintenance Manager**: Approve inspections, close job cards, manage inventory.
- **Technician**: Log inspections, update job cards, request parts.
- **Driver**: Complete pre-trip inspections, report faults.

---

## 6️⃣ Data Integrity & Validation
- Use `merge: true` for Firestore updates to prevent data loss.
- Prevent duplicate job card or inspection creation for the same vehicle/date.
- All forms must validate required fields and logical consistency before submission.

---

## 7️⃣ Compliance & Audit
- All actions must be timestamped and user-attributed.
- System must support regulatory reporting (DOT, safety, maintenance).
- Photo evidence required for critical repairs and compliance checks.

---

## 8️⃣ Example Rule Definitions

| Rule ID | Module      | Description                                      | Enforcement                |
|--------|-------------|--------------------------------------------------|----------------------------|
| R-001  | Workshop    | Critical faults must auto-create job cards        | Modal + Supervisor Alert   |
| R-002  | Tyre        | Tyre below 2mm tread cannot be assigned to fleet | Inspection Block           |
| R-003  | Inventory   | Out-of-stock triggers reorder prompt              | UI Alert + Email           |
| R-004  | Permissions | Only Admins can delete inventory records          | RBAC + Audit Log           |

---

## 9️⃣ Integration Notes
- All rules must be enforced both in UI and backend logic.
- Rule violations should trigger user feedback and be logged for review.
- Rules should be reviewed quarterly for compliance and updated as needed.

---
# 📏 RULES.md — Development Protocols for Workshop System

These rules govern how developers should work on the Workshop Operations module and its subcomponents within the Transport Management System.

---

## 🔒 1. Core Rule: **Do Not Break Existing Logic**

- ❌ No changes may disrupt or bypass the **existing application logic**.
- ❌ No removal, bypass, or override of current workflows or validation paths.
- ❌ No changes that affect core functionality (e.g. job card → inventory sync, inspection → job card link).

All changes must **extend** current logic — not overwrite or disable it.

---

## 🧠 2. Use Existing Architecture & Logic

- ✅ Reuse existing context providers, hooks, and state models (e.g., `useWorkshopStore`, `InspectionStatusEnum`)
- ✅ Reuse or extend existing components (e.g., `InspectionFormHeader`, `TaskManager`, `FaultManagement`)
- ✅ Maintain architectural patterns (modular components, tab routing, state lifting)

🧱 **Never introduce side-effect-heavy patterns** (e.g., global mutation outside of store contexts)

---

## ✋ 3. Respect Form and Data Structure

- 🧾 Where layout or data structure already exists (e.g., `InspectionForm.tsx`, `JobCard.tsx`), it must be **preserved and extended**, not redesigned.

- 🚫 No reordering, renaming, or relabeling of core form fields unless specifically requested.

---

## 📬 4. Request Input When Data Placement or Layout is Unclear

- If a new field or section must be added and:
  - 🔹 The location is not obvious
  - 🔹 The data binding is unclear
  - 🔹 There is no layout pattern to follow

🗣 Then you must:
> ❗ *Ask the owner (Hein) for specific guidance on:*
> - Field name
> - Field placement
> - Data type and validation
> - Collection path (if stored in Firestore)

---

## ♻️ 5. Component & UX Consistency

- ⚙ Use the same styling logic (Tailwind classes, icons, spacing)
- 🧩 Use modal patterns and button behaviors as already applied (e.g. `InspectionActionButtons`)
- ✅ Maintain consistency with mobile responsiveness and visual hierarchy

---

## 🚫 6. Do Not Introduce Breaking Features

Examples of what **not** to do:
- ❌ Swapping `useSearchParams` for React Context unless justified
- ❌ Using a new database or store (like Redux) outside existing Firestore + local state
- ❌ Overriding inventory logic with external data without integration

---

## 🛠 7. Additions Must Be Modular

- All new logic must be wrapped in separate, **isolated components**, e.g.:
  - `TyreRotationChecklist.tsx`
  - `PhotoUploadGallery.tsx`
  - `InspectionStepNotes.tsx`

- Components must be stateless or use scoped local state unless needing central access.

---

## ✅ 8. Acceptable Enhancements

The following are **allowed and encouraged**:
- 🟢 Adding new inspection categories
- 🟢 Expanding job card templates
- 🟢 Adding alerts, validation, or optional fields (with default states)
- 🟢 Extending tyre tracking with additional metadata (e.g., fuel impact)
- 🟢 Improving responsiveness or accessibility
- 🟢 Adding toast notifications, modals, and visual confirmations

---

## 📎 Final Note

This system is live, sensitive to sync logic, and is used operationally.

All PRs or updates:
- Must be **reviewable**
- Must include clear commit messages
- Must be **tested with the existing flow** (inspections → faults → job cards → cost reports)

---

_Last reviewed: `{{TODAY}}`_

> _This document is a living reference. Update as operational needs evolve._
