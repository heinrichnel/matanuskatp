# Frontend Architecture and Integration Standards

## Table of Contents
1. [Introduction](#introduction)
2. [Layout & App Structure](#layout--app-structure)
3. [Sidebar & Navigation](#sidebar--navigation)
4. [Import Management](#import-management)
5. [UI CRUD Operations](#ui-crud-operations)
6. [Data Handling Patterns](#data-handling-patterns)
7. [Performance Optimization](#performance-optimization)
8. [Error Handling & Resilience](#error-handling--resilience)
9. [Component Integration & Deduplication](#component-integration--deduplication)
10. [Permission & Authorization](#permission--authorization)
11. [Permitted & Prohibited Actions](#permitted--prohibited-actions)

## Introduction

This document defines the standards for frontend architecture, integration, and code quality. These standards ensure a consistent, maintainable, and high-performance application with proper error handling and user experience.

**Goal:** A fully connected, production-ready frontend that matches the intended layout, sidebar navigation, and UI CRUD expectations—with every route, component, provider, and data model linked and working end-to-end.

## Layout & App Structure

### Requirements
- The main layout component (typically `Layout.tsx`) must correctly wrap all pages/routes
- Layout must import all shared UI components:
  - Navigation bar
  - Sidebar
  - Notifications
  - Footer
- Shared UI components must not be duplicated across subcomponents
- All routes must be properly configured in the router (typically `App.tsx` or equivalent)

### Implementation Example
```tsx
// App.tsx
import Layout from './components/layout/Layout';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
// Other page imports...

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Other routes... */}
      </Routes>
    </Layout>
  );
}
```

## Sidebar & Navigation

### Requirements
- Parse the sidebar configuration file (typically `sidebarConfig.ts` or equivalent)
- Every sidebar entry must map to a valid and existing route
- All linked components must be properly imported in the router configuration
- Flag and optionally generate placeholder components for missing sidebar route targets
- Ensure submenus, icons, and collapse logic work as expected

### Validation Process
1. Extract all routes from sidebar configuration
2. Verify each route exists in the router configuration
3. Confirm that each route's component is properly imported
4. Report any missing routes or components
5. Test submenu functionality and icon rendering

## Import Management

### Scope & Focus
- Only enforced on `.tsx` files within `src/` directory
- Limited to pages and components
- Focus on import statement correctness and resolution
- No file operations without explicit approval

### Import Resolution Process
1. For each import statement in `.tsx` files:
   - Verify the import path resolves to an existing file
   - Search entire `src/` tree if import cannot be resolved
   - Only update import paths, never modify component logic

2. Import Path Rules:
   - Never auto-create missing files
   - Never delete existing imports
   - Never comment out unresolved imports
   - Only fix paths to existing files
   - Report unresolved imports for manual review

### Required Reporting
For every file modification:
- List any unresolved `.tsx` imports found
- Show before/after paths for any fixed imports
- Request explicit permission before:
  - Creating new files
  - Suggesting new components
  - Modifying multiple files

## UI CRUD Operations

### Requirements
- Every module (trips, drivers, workshop, tyres, diesel, clients, inventory, etc.) must have:
  - Create screens/forms
  - Read/View screens
  - Update/Edit screens
  - Delete functionality
- All CRUD operations must be properly connected to backend endpoints or Firestore collections
- All modals, dialogs, and drawers must be reachable from the UI
- No orphaned logic or components should exist in the codebase

### Validation Process
1. For each module, verify existence of all CRUD screens
2. Confirm each screen is accessible via sidebar or navigation
3. Test data flow from UI to backend/Firestore
4. Verify proper hooks and services are implemented
5. Check for orphaned components or unreachable UI elements

## Data Handling Patterns

### Soft View Pattern Implementation
All data views must implement the soft view pattern:
- **Progressive data loading**: Show data as it becomes available
- **Optimistic UI updates**: Update UI before server confirmation
- **Fallback placeholder states**: Show skeletons, spinners, or placeholders during loading
- **Real-time sync**: Connect to Firestore or other real-time data sources

### Enhanced Data Connectivity
All data views and forms must:
- Implement proper loading states with visual indicators
- Handle offline/error scenarios gracefully
- Use proper Firestore pagination for large datasets
- Support real-time updates via `onSnapshot` or equivalent
- Include proper data validation with user feedback

### Example Implementation
```tsx
function DataList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Initial loading state
    setLoading(true);
    
    // Real-time subscription
    const unsubscribe = db.collection('items')
      .limit(20) // Pagination
      .onSnapshot(
        (snapshot) => {
          // Progressive loading
          const items = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(items);
          setLoading(false);
          setError(null);
        },
        (err) => {
          // Error handling
          setError(err);
          setLoading(false);
        }
      );
      
    return () => unsubscribe();
  }, []);
  
  // Optimistic update example
  const updateItem = (id, newData) => {
    // Update local state immediately
    setData(prev => prev.map(item => 
      item.id === id ? {...item, ...newData} : item
    ));
    
    // Then update server
    db.collection('items').doc(id).update(newData)
      .catch(err => {
        // Revert on error
        setError(err);
        // Refresh data from server
        // ...
      });
  };
  
  if (loading && data.length === 0) {
    return <SkeletonLoader />; // Fallback state
  }
  
  if (error) {
    return <ErrorDisplay error={error} retry={() => /* retry logic */} />;
  }
  
  return (
    <>
      {data.map(item => (
        <ItemCard key={item.id} item={item} onUpdate={updateItem} />
      ))}
      {loading && <LoadingMoreIndicator />} {/* Progressive loading indicator */}
    </>
  );
}
```

## Performance Optimization

### Code Splitting and Lazy Loading
- Use React.lazy and Suspense for component-level code splitting
- Implement route-based code splitting for all major routes
- Defer loading of non-critical components

```tsx
// Route-based code splitting example
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

### Render Optimization
- Implement memoization for expensive components using React.memo
- Use useMemo for expensive calculations
- Use useCallback for event handlers passed to child components
- Avoid unnecessary re-renders by properly structuring component hierarchy
- Implement virtualization for long lists using react-window or similar libraries

### Asset Optimization
- Optimize images and use proper formats (WebP, SVG)
- Implement responsive images with srcset
- Use font-display: swap for web fonts
- Implement proper caching strategies

## Error Handling & Resilience

### Error Boundaries
- Implement error boundaries at strategic levels in the component tree
- Provide meaningful fallback UIs for different types of errors
- Log errors to monitoring service

```tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, info) {
    // Log to error monitoring service
    logErrorToService(error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Network Error Handling
- Implement retry mechanisms for failed network requests
- Provide clear feedback to users about network status
- Cache critical data for offline access
- Implement optimistic updates with rollback capability

### Data Validation
- Validate all user inputs on the client side
- Implement server-side validation as well
- Provide clear error messages for validation failures
- Use proper form state management (Formik, React Hook Form, etc.)

## Component Integration & Deduplication

### Component & Page Integration
- Must merge duplicate components/pages without losing functionality
- Use most robust version as base
- Integrate all unique features, props, UI elements from duplicates
- Preserve all business logic and data handling
- Update imports and sidebar references after merge
- Report all integrations with feature-by-feature summary

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

## Permission & Authorization

### Requirements
- All UI elements must respect user role permissions
- Implement proper access control at component level
- Show/hide elements based on user authorization
- Handle unauthorized access gracefully with proper feedback

### Implementation
- Use context or hooks to provide permission information
- Check permissions before rendering sensitive UI elements
- Redirect unauthorized users with clear messaging
- Implement role-based routing guards

```tsx
function ProtectedComponent({ requiredRole, children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <LoginPrompt />;
  }
  
  if (!hasRole(user, requiredRole)) {
    return <UnauthorizedMessage />;
  }
  
  return children;
}
```

## Document Connections

### Data Synchronization
- All key data documents (Trip, Driver, Job Card, Tyre, Fleet) must be synchronized
- Models/types must match between Firestore, backend, and frontend
- Every Firestore collection used in code must be accessible via UI
- All UI elements (download/export buttons, import forms) must connect to correct handlers

### UI Consistency
- Auto-flag (and optionally create) any missing Edit, Delete, or View screen/component
- Ensure all menu/CRUD screens work for the current user's permissions
- Prevent any component from being "floating" in the codebase (every component must be used)

## Permitted & Prohibited Actions

### Permitted Actions
- Auto-edit imports
- Generate missing components or placeholder screens (with approval)
- Synchronize sidebar/menu configurations
- Fix broken CRUD flows
- Report major refactors or auto-generated screens

### Prohibited Actions
- Remove or disable any existing functional feature without explicit user approval
- Break the architecture or change workflow logic not related to routing or UI/CRUD/data connectivity
- Create new files without permission
- Move existing files without permission
- Update imports in multiple files without permission
- Add new components or pages without permission
- Remove duplicate files after merge without permission
- Restructure component hierarchy without permission
- Modify routing configuration without permission

## Additional Requirements

- Implement soft view patterns for all data displays
- Ensure proper loading states and error boundaries
- Implement proper data caching and persistence strategies
- Follow accessibility best practices (WCAG 2.1 AA)
- Ensure responsive design for all screen sizes
- Implement proper testing (unit, integration, e2e)