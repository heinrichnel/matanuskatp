# KiloCode Agent Rules

## File Edit Rules

When editing files, the following rules apply:

- If a file or import is not found, first search the entire 'src' directory for a file with the same or a logical name
- Never automatically create a new file/component, or delete or comment out any existing file, without explicit permission from the user
- If the file still cannot be found after searching, report exactly which import, page, or component is missing, and ask the user if you may create it
- Do not remove or comment out any working code—only integrate new code or resolve duplicate implementations by keeping the best or most complete version
- If you find a hardcoded duplicate of exactly the same functionality, consolidate it so functionality is preserved, but never remove critical UI or backend features
- Use the sidebar/navigation routes to list all existing pages/modules and verify which routes do not have a corresponding page or component
- Always report the total number of unique pages/components based on navigation/sidebar, and list any unlinked or missing routes
- Always ask for permission before creating, deleting, or overwriting any file, import, page, route, or component
- All existing functional code and features must remain untouched unless explicitly requested
- Never comment out or remove any file, import, or functional code without the user's explicit permission
- Explicitly validate and report on all mobile support, QR code components, modal dialogs, and Google Maps components for import, existence, and sidebar/routing connection
- If any QR code, modal, map, or mobile-specific feature is missing, report it and request approval before any auto-generation or integration
- On every edit, ensure all .tsx files under src/ correctly import and connect mobile, QR code, modal, and map components, with valid paths and consistent use

## Save Rules

When saving files:

- Run all file edit checks
- Validate imports, routes, navigation, and the existence of all referenced pages/components
- Clearly report if any are missing and ask for permission before making any changes
- Repeat the checks for QR code, modal, maps, and mobile features across all routes/components

## Project Build Rules

During project builds:

- Scan the entire project for missing or duplicate imports, exports, pages, or components
- Never automatically create, delete, or comment out any file/component/page
- Always report all findings for user confirmation and action
- Explicitly list any missing or duplicate QR code, modal, maps, or mobile UI components for action

## Layout Requirements

- Enforce main layout
- Required components: navbar, sidebar, notifications, footer
- Prevent component duplication

## Sidebar Configuration

- Validate all routes
- Require component imports
- Auto-flag missing routes
- Ensure submenu logic works
- Check mobile, QR, modal, and maps integration

## Import Rules

### Scope
- File types: .tsx
- Directories: src/
- Focus areas: pages, components, mobile, qr, modal, maps

### Rules
- Validate all paths
- Search entire tree for imports
- No auto-creation allowed
- No deletion allowed
- No commenting out allowed

### Reporting
Must report:
- Unresolved imports
- Path changes
- Require permission for:
  - File creation
  - Component creation
  - Multi-file changes

## CRUD Functionality

### Validate Screens
- Edit
- Delete
- View

### Modules
- Trips
- Drivers
- Workshop
- Tyres
- Diesel
- Clients
- Inventory

### Operations
- Create
- Read
- Update
- Delete

Modal access validation required

## Data View Requirements

### Soft View Pattern
- Progressive loading
- Optimistic updates
- Fallback states
- Realtime sync

### Connectivity
- Loading states
- Offline handling
- Firestore pagination
- Realtime updates
- Data validation

## Mobile, QR Code, Modal, and Map Features

- Require mobile support
- Require QR code functionality
- Require modal support
- Require Google Maps integration
- Validate imports and routing

## Document Synchronization

- Validate models
- Ensure collection access
- Validate UI handlers

## Integration Rules

### Permitted Actions
- Import edits
- Component scaffolding
- Sidebar sync
- CRUD flow fixes

### Forbidden Actions
- Feature removal
- Workflow changes

### Deduplication Rules
- Preserve all features
- Use robust base
- Integrate all features
- Never remove logic
- Require approval

## Permissions

### Allowed Actions
- Auto edit
- Component scaffolding
- Sidebar update
- Import auto-fix
- Report major changes

### Require Approval
- File creation
- Component addition
- Duplicate removal
- Hierarchy changes
- Routing changes

## File Type Rules

### TypeScript (.ts, .tsx)
- Ensure valid imports
- Ensure correct component references
- Never remove working code without permission

### JSON
- Validate structure
- No critical config changes without permission

## Build Configuration

### Vite Manual Chunks
- react-ui
- firebase-core
- firebase-firestore
- firebase-storage
- charts
- pdf
- spreadsheet
- utils
- icons
- mui
- mobileQRCodeModalMapFeatures

### Ignored Imports
- @ant-design
- @mui

## Exclusions

- No existing functionality, component, feature, or code may be deleted or commented out unless explicitly requested
- Never add, remove, or change files, components, imports, pages, or routes without permission
