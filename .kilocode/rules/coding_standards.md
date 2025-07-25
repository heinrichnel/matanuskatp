## Enforce Front-End Layout, Sidebar, Import, and Full UI Integration Consistency – Copilot Agent Rules

### ##Instructions to the Agent:

You must, for every commit and refactor, do the following checks and (if needed) automated edits:

## Layout & App Structure:

Ensure that the main layout component (usually Layout.tsx or equivalent) correctly wraps all pages/routes.

Validate that the layout imports all shared UI (navigation bar, sidebar, notifications, footer, etc.) and that these are not duplicated across subcomponents.

## Sidebar Menu Integration:

Parse the sidebar config file (often Sidebar.tsx, sidebarConfig.ts, or equivalent).

Check that every sidebar entry maps to a valid and existing route, and that the linked component is imported and present in the router (App.tsx or your router config).

## Auto-flag and auto-generate (if allowed) placeholder pages/components for any missing sidebar route targets.

Ensure submenus, icons, and collapse logic work as expected in the sidebar.

## Import Consistency:

Ensure that every component referenced in routes, layouts, or the sidebar is actually imported where it is needed, with the correct case and path.

Remove any dead imports, duplicate imports, or imports from test/dev files.

## UI CRUD Functionality:

Verify that every editable (edit), delete, or view screen for each module (trips, drivers, workshop, tyres, diesel, clients, inventory, etc.) is available via UI and correctly referenced in the sidebar/routing.

Ensure all Create, Read, Update, Delete (CRUD) operations in the UI can reach their respective backend endpoints or Firestore collections (check for missing or broken hooks/services).

For every modal, dialog, or drawer, check that it is reachable from the UI and does not leave orphaned logic in the codebase.

## Soft View Integration & Data Display:

Ensure that every data view implements the twalwant soft view pattern:

* Progressive data loading
* Optimistic UI updates
* Fallback placeholder states
* Real-time sync with Firestore

## Enhanced Data Connectivity:

Verify that all data views and forms:

* Implement proper loading states
* Handle offline/error scenarios
* Use proper Firestore pagination
* Support real-time updates via onSnapshot
* Include proper data validation

## Permission-Based UI:

Ensure all UI elements:

* Respect user role permissions
* Implement proper access control
* Show/hide based on user authorization
* Handle unauthorized access gracefully

Document Connections:

All key data documents (e.g. Trip, Driver, Job Card, Tyre, Fleet) must be synchronized:

Their models/types must match between Firestore, the backend, and frontend.

Every Firestore collection used in the code must be accessible via a component or page in the sidebar or dashboard.

Any UI element (like download/export buttons, import forms) must be connected to the correct handler.

UI Consistency and Availability:

Auto-flag (and optionally create) any missing Edit, Delete, or View screen/component.

Ensure that all menu/CRUD screens work for the current user’s permissions.

Prevent any component from being unlinked or “floating” in the codebase (i.e., every UI component must be used or reachable).

### Full Front-End to Back-End Flow:

Enforce that for every menu/sidebar/dashboard entry, the data flow (fetch, sync, save) reaches the correct Firestore or backend endpoint, with proper error handling and state management.

Report and auto-fix any missing provider, context, or integration that breaks this flow.

You are permitted to:

Auto-edit imports, generate missing components or placeholder screens, synchronize sidebar/menu configs, and fix broken CRUD flows.

Report to the user any major refactors or auto-generated screens so nothing is hidden.

## You must not:

Remove or disable any existing functional feature without explicit user approval.

Break the architecture or change workflow logic not related to routing or UI/CRUD/data connectivity.

## Strict Import Path Enforcement Rules

### Scope & Focus
- Only enforced on .tsx files within src/ directory
- Limited to pages and components
- Focus on import statement correctness and resolution
- No file operations without explicit approval

### Import Resolution Process
1. For each import statement in .tsx files:
   - Verify the import path resolves to an existing file
   - Search entire src/ tree if import cannot be resolved
   - Only update import paths, never modify component logic

2. Import Path Rules:
   - Never auto-create missing files
   - Never delete existing imports
   - Never comment out unresolved imports
   - Only fix paths to existing files
   - Report unresolved imports for manual review

### Required Agent Reporting
For every file modification:
- List any unresolved .tsx imports found
- Show before/after paths for any fixed imports
- Request explicit permission before:
  - Creating new files
  - Suggesting new components
  - Modifying multiple files

### Permission Requirements
- Must get explicit approval before:
  - Creating any new files
  - Moving any existing files
  - Updating imports in multiple files
  - Adding new components or pages

## Deduplication & Integration Rules

### Component & Page Integration
- Must merge duplicate components/pages without losing functionality
- Use most robust version as base
- Integrate all unique features, props, UI elements from duplicates
- Preserve all business logic and data handling
- Update imports and sidebar references after merge
- Report all integrations with feature-by-feature summary

### What Is Permitted
- Update sidebar/menu configs to maintain navigation
- Merge duplicate components using robust-first approach
- Integrate missing features from duplicates into base
- Update import paths to consolidated components
- Add props, types, or handlers to preserve functionality
- Expand component depth or features during merge

### What Is Not Permitted
- Delete or comment out any code without explicit approval
- Drop functionality during merge operations
- Auto-resolve conflicts through deletion
- Move/rename files without permission
- Leave unmerged duplicates
- Disable any UI or navigation elements

### Integration Process
1. Identify most feature-complete version
2. Merge all unique elements from duplicates:
   - Props and types
   - UI components and elements
   - Business logic and rules
   - State management and data handling
   - Comments and documentation
3. Update all references to use merged version
4. Report detailed integration summary
5. Await approval before removing duplicates

### Permission Requirements
- Must get explicit approval before:
  - Creating any new files
  - Moving any existing files
  - Updating imports in multiple files
  - Adding new components or pages
  - Removing duplicate files after merge
  - Restructuring component hierarchy
  - Modifying routing configuration

### Your goal:

A fully connected, always functional, and production-ready frontend that matches the intended layout, sidebar navigation, and UI CRUD expectations—with every route, component, provider, and data model linked and working end-to-end, including all views, edits, and deletes.

Additional Requirements:

* Implement soft view patterns for all data displays
* Ensure proper loading states and error boundaries
* Implement proper data caching and persistence strategies