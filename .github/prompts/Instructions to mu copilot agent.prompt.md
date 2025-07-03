---
mode: agent
---
Copilot System-Wide Instruction for TransportMat Project
Before making any change, the Copilot agent must go through all relevant files and modules in the project — including frontend, backend, and integration scripts. The agent should identify every place where the change could connect to other logic, including data models, forms, APIs, webhooks, reporting, and all user workflows. Never assume a code change is isolated.

Principle: Think System, Not Just Code
Copilot must operate with full awareness that every UI component (form, dashboard, modal, report, flag, or export) is tightly integrated with backend logic (Firestore, functions, imports) and operational workflows (user input, bulk upload, status transitions, PDF, Excel, and CSV exports). Any update must simulate and validate the end-to-end impact before being merged.

## MY CODE BUILD INFORMATION:

React (frontend framework)

Firebase (backend services: Firestore, Auth, Functions, Storage)

TypeScript (type safety and code quality)

Tailwind CSS (UI and styling)

Google Apps Script (for Google Sheets integrations and webhooks)

CSV/Excel parsing libraries (for import/export functionality)

PDF generation libraries (for reports and debrief exports)

Netlify (for frontend deployment)

Node.js and npm (runtime and package manager)

Git (version control and workflow)

## PROJECT DETAILS:

Netlify

Project name - transportmat

Project ID - dfd71cc6-808a-4610-84f8-14503d9cd76d

Firebase

Project name - Mat1
Project ID - mat1-9e6b3
Project number - 250085264089

apiKey: "AIzaSyBtq7Z6qqaVmb22d3aNcwNiqkrbGtIhJ7g",
authDomain: "mat1-9e6b3.firebaseapp.com",
databaseURL: "https://mat1-9e6b3-default-rtdb.firebaseio.com",
projectId: "mat1-9e6b3",
storageBucket: "mat1-9e6b3.firebasestorage.app",
messagingSenderId: "250085264089",
appId: "1:250085264089:web:51c2b209e0265e7d04ccc8",
measurementId: "G-YHQHSJN5CQ"

## YOU ARE ALOWED TO:
Copilot Agent Authorisation Rules

The agent is authorised to use and switch between multiple AI models for code assistance and analysis, as required for the task.

The agent has permission to open and view multiple files at the same time, including source code, configuration files, documentation, and data files, regardless of file type or project folder.

The agent may read from and write to all files in the project directory (and any subdirectories), including editing code, text, configuration, and documentation files, as needed to complete the assigned task.

The agent can batch edit, rename, or create files and folders when necessary for system-wide changes or refactoring.

The agent is allowed to access the integrated command terminal to execute shell commands for:

Running code (e.g. Node, Python, npm scripts)

Installing dependencies

Committing and pushing changes via Git

Running tests and build processes

Other system administration or automation tasks as required by the workflow

All terminal and file operations must follow project security guidelines and best practices, including respecting .gitignore, not exposing sensitive credentials, and always prompting the user before destructive actions (like deleting files or resetting branches).

The agent must document all significant actions taken (such as terminal commands, file edits, or system changes) in a summary or log, so the user can review or audit what was done.

The agent is authorised to coordinate read/write actions across multiple files and directories for end-to-end workflow automation and to ensure system integrity.


## AFTER COMPLETING THE TASK

Follow the correct Git workflow:

git add .

git commit -m "..."

git pull origin main --rebase

git push origin main

Ensure every change is fully tested for system integration and user experience — nothing is “done” unless the full workflow is intact and error-free.

All new fields or logic must be reflected in every affected part of the system (backend, frontend, imports, exports, dashboards).

Data integrity and consistency across all components are non-negotiable — never break existing functionality or user flows.

Always restore and preserve all functional attributes and the current logic throughout the project.


## Architectural Governance Model

I approach each design decision and implementation through these interconnected lenses:

1. **Systems Thinking** - Every component exists about the whole ecosystem
2. **Workflow Continuity** - End-to-end operations must remain unbroken
3. **Interface Consistency** - All interaction patterns follow unified principles
4. **State Management** - Data changes propagate predictably throughout the system
5. **Implementation Excellence** - Every feature meets production-grade standards
- **Ripple Effects** - How changes cascade through dependent components
- **Data Flow Integrity** - Whether transformations maintain semantic meaning
- **State Synchronization** - How updates propagate across views and services
- **Error Boundaries** - Whether failure scenarios are properly contained
- **Complete transaction atomicity** with proper compensation mechanisms
- **Consistent validation rules** applied across all data entry points
- **Defensive programming** with graceful degradation paths
- **UI/UX coherence** conforming to established design patterns
- **Performance budgets** maintained throughout the component hierarchy