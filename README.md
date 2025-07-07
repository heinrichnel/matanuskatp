# TransportMat Workshop Module

This repository contains the implementation for the Workshop Module of the TransportMat fleet management system. The module provides comprehensive tools for managing inspections, job cards, fault tracking, and fleet maintenance.

## Features

### Inspection Management
- Create and manage vehicle inspections
- Pre-populated inspection templates for trucks and trailers
- Pass/fail workflow with automatic job card generation for failed items
- Inspection history and reporting

### Job Card Management
- Create, assign, and track job cards
- Task management with role-based workflow
- Parts and inventory integration
- QA verification process
- Completion and invoicing

### Fleet Management
- Complete vehicle fleet database
- Maintenance history tracking
- Service scheduling
- Odometer tracking

### Kanban Board
- Visual job card management
- Drag-and-drop status updates
- Filter and search capabilities

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Fleet Data
To populate the fleet collection with initial data, create a service account key file and run the seeding script:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the file as "serviceAccountKey.json" in the project root directory
4. Run the seeding script:

```bash
node seedFleet.mjs
```

### 3. Configure Firebase
Make sure your Firebase configuration is correctly set up in your project.

### 4. Start Development Server
```bash
npm run dev
```

## Architecture

### Data Model
The module uses the following Firestore collections:
- `/inspections`
- `/jobCards`
- `/faults`
- `/fleet`
- `/invoices`

### Role-Based Access
The system implements role-based access with three primary roles:
- **Inspector**: Can create and edit inspections
- **Technician**: Can update job card tasks and mark them as completed
- **Supervisor**: Can verify completed tasks, close job cards, and generate invoices

### Workflow
1. Inspector performs inspection and marks items as pass/fail
2. Failed critical items automatically generate job cards
3. Technician performs tasks and marks them as completed
4. Supervisor verifies completed tasks
5. Job card is marked as completed
6. Invoice is generated

## Development

### Adding New Features
1. Update the appropriate components in the `/components/workshop` directory
2. Update data models in `/types` directory if needed
3. Add any new Firestore rules to `firestore.rules`

### Testing
1. Use the role-switching functionality in the JobCard component to test different user roles
2. Verify the entire workflow from inspection to invoice generation