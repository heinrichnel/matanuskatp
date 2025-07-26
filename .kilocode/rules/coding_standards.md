# Code Standards for transportmat-monorepo

## Table of Contents
- [Introduction](#introduction)
- [Core Principles](#core-principles)
- [Project Structure & Naming Conventions](#project-structure--naming-conventions)
- [TypeScript & React Best Practices](#typescript--react-best-practices)
- [Styling: Tailwind CSS](#styling-tailwind-css)
- [Data Handling & API Interaction](#data-handling--api-interaction)
- [Routing & Navigation](#routing--navigation)
- [Performance Optimization](#performance-optimization)
- [Error Handling & Resilience](#error-handling--resilience)
- [Testing](#testing)
- [Mobile (Capacitor) Considerations](#mobile-capacitor-considerations)
- [Cloud & Deployment (Firebase, Vercel, Azure)](#cloud--deployment-firebase-vercel-azure)
- [Code Quality & Automation](#code-quality--automation)
- [AI-Assisted Development](#ai-assisted-development)
- [Accessibility (A11y)](#accessibility-a11y)
- [Documentation & Comments](#documentation--comments)
- [Review & Enforcement](#review--enforcement)

## Introduction
This document outlines the coding standards and best practices for the transportmat-monorepo project. Adhering to these guidelines ensures code consistency, maintainability, scalability, and a unified development experience across our frontend (Vite React) and backend (Express API).

### Goal
To build a fully connected, high-performance, and production-ready fleet management application with a focus on user experience, reliability, and ease of collaboration.

### Tech Stack Highlights
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Material-UI
- **Backend**: Express.js, Firebase (Firestore, Realtime Database, Authentication, Cloud Functions)
- **Mobile**: Capacitor
- **Deployment**: Vercel (Frontend), Firebase (Backend/Functions/Hosting), Azure (various services)
- **Tooling**: ESLint, Prettier, Jest, Vitest, Playwright, Cypress, Storybook, GitHub Copilot, Google Gemini, Kilo Code

## Core Principles
- **Readability**: Code must be easy to understand by others (and your future self).
- **Consistency**: Follow established patterns and conventions across the entire codebase.
- **Maintainability**: Write code that is easy to extend, debug, and refactor.
- **Performance**: Optimize for fast loading times and smooth user interactions.
- **Reliability**: Implement robust error handling, testing, and data validation.
- **Security**: Be mindful of common vulnerabilities, especially with backend integrations.
- **Accessibility**: Ensure the application is usable by all individuals, including those with disabilities.
- **DRY (Don't Repeat Yourself)**: Abstract common logic and UI patterns into reusable components or utilities.

## Project Structure & Naming Conventions

### Monorepo Structure
The project is a monorepo containing a frontend (Vite React) and a backend (Express API), organized as follows:

```
transportmat-monorepo/
├── apps/
│   ├── frontend/        # Vite React application
│   └── backend/         # Express API, Firebase Functions, etc.
├── packages/            # Reusable packages
│   ├── ui-components/
│   ├── shared-utils/
│   └── types/
├── .devcontainer/       # Dev container configuration
├── .github/             # GitHub workflows, templates, Copilot instructions
├── .vscode/             # Workspace-specific VS Code settings
├── public/
├── scripts/             # Utility scripts
├── tools/               # Build/integration tools
├── .env.development
├── .env.production
├── package.json         # Root package.json
└── README.md
```

### File & Folder Naming
- **Folders**: kebab-case (e.g., `user-management`, `data-services`)
- **Component Files**: PascalCase.tsx (e.g., `UserProfile.tsx`)
- **Hook Files**: useCamelCase.ts (e.g., `useAuth.ts`)
- **Utility/Helper Files**: camelCase.ts or kebab-case.ts (e.g., `dateUtils.ts`, `api-helpers.ts`)
- **Type Definition Files**: PascalCase.d.ts or types.ts (e.g., `UserTypes.d.ts`, `api-types.ts`)
- **Index Files**: index.ts or index.tsx for barrel exports or root component

### Component Naming
- **React Components**: PascalCase (e.g., `DashboardLayout`, `ActionButton`)
- **Functional Components**: Use arrow function syntax or function declaration
  ```typescript
  const ComponentName: React.FC<Props> = ({ prop }) => { ... };
  // or
  function ComponentName({ prop }: Props) { ... }
  ```
- **Props**: Use camelCase with defined types/interfaces

### Variable & Function Naming
- **Variables**: camelCase (e.g., `userName`, `isLoggedIn`)
- **Functions**: camelCase (e.g., `fetchUserData`, `calculateTotal`)
- **Constants**: SCREAMING_SNAKE_CASE for global, immutable values (e.g., `API_BASE_URL`)
- **Booleans**: Prefix with is, has, should (e.g., `isLoading`, `hasError`, `shouldRender`)

## TypeScript & React Best Practices

### Typing
- **Strict Typing**: Always use explicit types; avoid `any`
- **Interfaces vs. Types**: Use interface for object shapes, type for aliases, unions, etc.
- **Type Aliases for Props**: Define dedicated types/interfaces for component props
- **Shared Types**: Place reusable types in packages/types or src/types
- **Generics**: Use for reusable components and functions

### Components
- **Functional Components**: Prefer functional components with hooks over class components
- **Component Composition**: Break down large components into smaller ones
- **Prop Drilling**: Minimize; use Context API or state management for deeply nested data
- **Conditional Rendering**: Use short-circuiting (&&), ternary operators, or helper components

### Hooks
- **Rules of Hooks**:
  - Only call hooks at the top level
  - Only call hooks from React function components or custom hooks
- **Custom Hooks**: Abstract reusable logic into custom hooks prefixed with `use`
- **useEffect**:
  - Understand dependency arrays
  - Use for side effects
  - Provide cleanup functions

### State Management
- **Local State**: Use `useState` for component-specific state
- **Global State**: Use Context API or dedicated libraries (Zustand, Jotai, Recoil)

### Context API Usage
- Use for passing data without prop drilling
- Avoid for frequently updating state causing many re-renders

### JSX Guidelines
- **Self-closing Tags**: Always self-close tags without children
- **Fragment Usage**: Use `<>...</>` for multiple elements
- **Readability**: Keep JSX concise; extract complex logic
- **Accessibility**: Use semantic HTML elements

## Styling: Tailwind CSS
- **Utility-First**: Prefer Tailwind's utility classes
- **Component-Driven Styling**: Encapsulate Tailwind classes within components
- **Configuration**: Manage via tailwind.config.js
- **Atomic CSS**: Avoid creating overly specific CSS classes

## Data Handling & API Interaction

### Firebase (Firestore/Realtime Database)
- **Firestore First**: Prefer Firestore for new features
- **Security Rules**: Protect all database access with robust rules
- **Indexes**: Create necessary Firestore indexes
- **Transactions/Batches**: Use for atomic/multiple updates
- **Data Models**: Define TypeScript interfaces for documents
- **Cloud Functions**: Use for backend logic and sensitive operations
- **Emulators**: Use extensively for local development

### Express API Integration
- **Centralized API Calls**: Create dedicated service files
- **Error Handling**: Implement consistent error handling
- **Request/Response Types**: Define interfaces for all API data
- **Environment Variables**: Use .env files for API URLs and keys

### Soft View Pattern
- **Progressive Data Loading**: Display data as it becomes available
- **Optimistic UI Updates**: Update UI immediately, confirm with server later
- **Fallback States**: Show skeletons/spinners during loading
- **Real-time Sync**: Use Firestore's onSnapshot where applicable

### Data Validation
- **Client-Side**: Use react-hook-form with resolvers (yup, zod)
- **Server-Side**: Implement comprehensive validation on API and Functions

## Routing & Navigation
- **React Router DOM**: Use for client-side routing
- **Centralized Routes**: Define all routes centrally
- **Layout Wrapper**: Wrap routes in main layout component
- **Sidebar Integration**: Map sidebar entries to valid routes
- **Route Guards**: Implement auth guards for protected routes
- **Deep Linking**: Support deep linking and proper URL handling

## Performance Optimization

### Code Splitting & Lazy Loading
- **React.lazy and Suspense**: Use for component-level code splitting
- **Route-Based Splitting**: Implement for all major routes
- **Dynamic Imports**: Use for non-critical components/modules

### Render Optimization
- **Memoization**:
  - `React.memo`: For expensive components
  - `useMemo`: For expensive calculations
  - `useCallback`: For memoizing event handlers
- **Component Hierarchy**: Structure to minimize unnecessary re-renders
- **Virtualization**: Use for long lists and large data tables

### Asset Optimization
- **Images**: Optimize and use modern formats
- **Fonts**: Use font-display: swap
- **Caching**: Implement proper caching strategies

## Error Handling & Resilience

### Error Boundaries
- **Strategic Placement**: Implement at key levels in component tree
- **Fallback UI**: Provide meaningful fallback interfaces
- **Logging**: Log errors to monitoring service

### Network Error Handling
- **Retry Mechanisms**: Implement for transient failures
- **User Feedback**: Provide clear status information
- **Offline Access**: Cache critical data for offline use
- **Optimistic Updates**: Include rollback capability

## Testing
All code must be adequately tested using the defined frameworks.

### Unit Testing
- **Frameworks**: Jest/Vitest with @testing-library/react
- **Scope**: Test individual functions, components, hooks
- **Coverage**: Focus on critical paths and complex logic

### Integration Testing
- **Scope**: Test interactions between components/services
- **Frameworks**: Jest/Vitest with @testing-library/react

### End-to-End (E2E) Testing
- **Frameworks**: Playwright and Cypress
- **Scope**: Test critical user flows end-to-end
- **CI/CD Integration**: Run as part of pipeline

### Storybook
- **Component Development**: Create stories for reusable components
- **Documentation**: Document props, usage, variations
- **Visual Regression**: Integrate with testing tools

## Mobile (Capacitor) Considerations

### Platform-Specific Code
- Minimize platform-specific code. Use Capacitor plugins for native functionality.

### Device APIs
- Abstract Capacitor plugin calls into reusable hooks or services.

### UI Adaptability
- Ensure responsive design and adaptable UI for various mobile screen sizes and orientations.

### Build Process
- Understand and integrate Capacitor sync/build commands into the CI/CD pipeline.

### Permissions
- Handle mobile device permissions gracefully with user prompts.

## Cloud & Deployment (Firebase, Vercel, Azure)

### Firebase Hosting
- Deploy frontend to Firebase Hosting for reliable serving.

### Firebase Functions
- Deploy backend functions to Firebase Cloud Functions.

### Vercel
- Utilize Vercel for continuous deployment of specific frontend previews/staging environments, as indicated by vercel:prepare, vercel:deploy, vercel:preview scripts.

### Azure Services
- If integrating with Azure (e.g., Azure Functions, Static Web Apps, other Azure services), ensure proper configuration, authentication, and adherence to Azure best practices. Use the Azure CLI where needed.

### Environment Variables
- All environment-specific configurations (API keys, URLs) must be managed through environment variables (.env files) and secured in deployment environments. Never hardcode sensitive information.

### Service Workers
- Ensure service workers are correctly registered, updated, and handle caching/offline capabilities effectively for your PWA.

## Code Quality & Automation

### Linting & Formatting
- **ESLint**: All code must conform to ESLint rules
- **Prettier**: All code must be formatted using Prettier
- **Pre-commit Hooks**: Use husky and lint-staged for auto-fixing

### Automated Import Management
- Enable auto-organize imports and fix issues on save
- Configure auto-updating of import paths when files move

### Code Metrics
- Monitor code complexity
- Use analyze:unused script to identify unused files

## AI-Assisted Development
- **General AI Usage**: Guidelines for using AI tools
- **Copilot/Gemini Directives**: Specific usage patterns
- **Kilo Code Usage**: Integration with workflow

## Accessibility (A11y)
- Guidelines for making the application accessible to all users

## Documentation & Comments
- Standards for code comments and documentation

## Review & Enforcement
- Process for code review and standards enforcement
