# Implementation Plan: Code Quality Improvements

Based on my analysis of the codebase, I've identified several areas where code quality can be improved. Here's a detailed implementation plan to address these issues:

## 1. Improve Component Documentation

### Implementation Steps:

1. **Create a documentation template**:
   ```tsx
   /**
    * ComponentName
    *
    * Brief description of the component and its purpose.
    *
    * @example
    * ```tsx
    * <ComponentName prop1="value" prop2={true}>
    *   Content
    * </ComponentName>
    * ```
    *
    * @param props - Component props
    * @param props.prop1 - Description of prop1
    * @param props.prop2 - Description of prop2
    * @returns React component
    */
   ```

2. **Document all UI components**:
   - Add JSDoc comments to all UI components
   - Include descriptions, examples, and prop documentation
   - Example:
     ```tsx
     /**
      * Button
      *
      * A customizable button component with various variants and sizes.
      *
      * @example
      * ```tsx
      * <Button variant="primary" size="md" onClick={handleClick}>
      *   Click me
      * </Button>
      * ```
      *
      * @param props - Button props
      * @param props.variant - Button style variant: 'primary', 'secondary', 'outline', 'ghost'
      * @param props.size - Button size: 'sm', 'md', 'lg'
      * @param props.onClick - Click handler function
      * @returns React component
      */
     const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
       ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
         // Component implementation
       }
     );
     ```

3. **Create a documentation site**:
   - Use Storybook to create a component documentation site
   - Set up Storybook with TypeScript support
   - Create stories for all UI components
   - Example:
     ```tsx
     // src/components/ui/Button.stories.tsx
     import type { Meta, StoryObj } from '@storybook/react';
     import { Button } from './Button';

     const meta: Meta<typeof Button> = {
       title: 'UI/Button',
       component: Button,
       parameters: {
         layout: 'centered',
       },
       tags: ['autodocs'],
       argTypes: {
         variant: {
           control: 'select',
           options: ['primary', 'secondary', 'outline', 'ghost'],
         },
         size: {
           control: 'select',
           options: ['sm', 'md', 'lg'],
         },
       },
     };

     export default meta;
     type Story = StoryObj<typeof Button>;

     export const Primary: Story = {
       args: {
         variant: 'primary',
         children: 'Button',
       },
     };

     export const Secondary: Story = {
       args: {
         variant: 'secondary',
         children: 'Button',
       },
     };

     export const Large: Story = {
       args: {
         size: 'lg',
         children: 'Button',
       },
     };

     export const Small: Story = {
       args: {
         size: 'sm',
         children: 'Button',
       },
     };
     ```

## 2. Enhance Test Coverage

### Implementation Steps:

1. **Set up testing infrastructure**:
   - Configure Jest and React Testing Library
   - Set up test coverage reporting
   - Add test scripts to package.json
   - Example:
     ```json
     // package.json
     {
       "scripts": {
         "test": "jest",
         "test:watch": "jest --watch",
         "test:coverage": "jest --coverage"
       }
     }
     ```

2. **Create test templates for different component types**:
   ```tsx
   // UI Component Test Template
   import React from 'react';
   import { render, screen, fireEvent } from '@testing-library/react';
   import { ComponentName } from './ComponentName';

   describe('ComponentName', () => {
     it('renders correctly', () => {
       render(<ComponentName />);
       // Assertions
     });

     it('handles user interactions', () => {
       render(<ComponentName onClick={jest.fn()} />);
       fireEvent.click(screen.getByRole('button'));
       // Assertions
     });

     it('applies different variants correctly', () => {
       const { rerender } = render(<ComponentName variant="primary" />);
       // Assertions for primary variant

       rerender(<ComponentName variant="secondary" />);
       // Assertions for secondary variant
     });
   });
   ```

3. **Write tests for all UI components**:
   - Test rendering
   - Test user interactions
   - Test different props and variants
   - Example:
     ```tsx
     // src/components/ui/Button.test.tsx
     import React from 'react';
     import { render, screen, fireEvent } from '@testing-library/react';
     import { Button } from './Button';

     describe('Button', () => {
       it('renders correctly', () => {
         render(<Button>Click me</Button>);
         expect(screen.getByRole('button')).toHaveTextContent('Click me');
       });

       it('calls onClick handler when clicked', () => {
         const handleClick = jest.fn();
         render(<Button onClick={handleClick}>Click me</Button>);
         fireEvent.click(screen.getByRole('button'));
         expect(handleClick).toHaveBeenCalledTimes(1);
       });

       it('applies different variants correctly', () => {
         const { rerender } = render(<Button variant="primary">Button</Button>);
         expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

         rerender(<Button variant="secondary">Button</Button>);
         expect(screen.getByRole('button')).toHaveClass('bg-gray-600');
       });

       it('applies different sizes correctly', () => {
         const { rerender } = render(<Button size="sm">Button</Button>);
         expect(screen.getByRole('button')).toHaveClass('text-sm');

         rerender(<Button size="lg">Button</Button>);
         expect(screen.getByRole('button')).toHaveClass('text-lg');
       });
     });
     ```

4. **Write integration tests for key workflows**:
   - Test form submissions
   - Test navigation flows
   - Test data fetching and display
   - Example:
     ```tsx
     // src/components/forms/LoginForm.test.tsx
     import React from 'react';
     import { render, screen, fireEvent, waitFor } from '@testing-library/react';
     import { LoginForm } from './LoginForm';
     import { AuthProvider } from '../../context/AuthContext';

     // Mock the auth service
     jest.mock('../../services/auth', () => ({
       login: jest.fn().mockResolvedValue({ user: { id: '123', name: 'Test User' } }),
     }));

     describe('LoginForm', () => {
       it('submits the form with user credentials', async () => {
         const mockLogin = require('../../services/auth').login;
         const mockOnSuccess = jest.fn();

         render(
           <AuthProvider>
             <LoginForm onSuccess={mockOnSuccess} />
           </AuthProvider>
         );

         // Fill out the form
         fireEvent.change(screen.getByLabelText(/email/i), {
           target: { value: 'test@example.com' },
         });

         fireEvent.change(screen.getByLabelText(/password/i), {
           target: { value: 'password123' },
         });

         // Submit the form
         fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

         // Check that the login service was called with the right args
         expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');

         // Wait for the success callback
         await waitFor(() => {
           expect(mockOnSuccess).toHaveBeenCalled();
         });
       });

       it('displays validation errors', () => {
         render(
           <AuthProvider>
             <LoginForm onSuccess={jest.fn()} />
           </AuthProvider>
         );

         // Submit without filling out the form
         fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

         // Check for validation errors
         expect(screen.getByText(/email is required/i)).toBeInTheDocument();
         expect(screen.getByText(/password is required/i)).toBeInTheDocument();
       });
     });
     ```

5. **Set up CI/CD pipeline for testing**:
   - Configure GitHub Actions or other CI/CD tool
   - Run tests on every pull request
   - Enforce minimum test coverage
   - Example GitHub Actions workflow:
     ```yaml
     # .github/workflows/test.yml
     name: Test

     on:
       push:
         branches: [main]
       pull_request:
         branches: [main]

     jobs:
       test:
         runs-on: ubuntu-latest

         steps:
           - uses: actions/checkout@v2

           - name: Set up Node.js
             uses: actions/setup-node@v2
             with:
               node-version: '16'

           - name: Install dependencies
             run: npm ci

           - name: Run tests
             run: npm run test:coverage

           - name: Check coverage
             run: |
               COVERAGE=$(npm run test:coverage | grep -o 'All files[^%]*%' | grep -o '[0-9.]*')
               if (( $(echo "$COVERAGE < 80" | bc -l) )); then
                 echo "Test coverage is below 80%"
                 exit 1
               fi
     ```

## 3. Optimize Performance

### Implementation Steps:

1. **Implement code splitting**:
   - Use React.lazy and Suspense for component lazy loading
   - Split code by route
   - Example:
     ```tsx
     // src/AppRoutes.tsx
     import React, { lazy, Suspense } from 'react';
     import { Routes, Route } from 'react-router-dom';
     import LoadingIndicator from './components/ui/LoadingIndicator';

     // Lazy load pages
     const Dashboard = lazy(() => import('./pages/Dashboard'));
     const UserProfile = lazy(() => import('./pages/UserProfile'));
     const Settings = lazy(() => import('./pages/Settings'));

     const AppRoutes: React.FC = () => {
       return (
         <Suspense fallback={<LoadingIndicator />}>
           <Routes>
             <Route path="/" element={<Dashboard />} />
             <Route path="/profile" element={<UserProfile />} />
             <Route path="/settings" element={<Settings />} />
           </Routes>
         </Suspense>
       );
     };

     export default AppRoutes;
     ```

2. **Memoize expensive components**:
   - Use React.memo for pure components
   - Use useMemo and useCallback hooks for expensive calculations and callbacks
   - Example:
     ```tsx
     // src/components/DataTable.tsx
     import React, { useMemo, useCallback } from 'react';

     interface DataTableProps {
       data: any[];
       onRowClick: (row: any) => void;
     }

     const DataTable: React.FC<DataTableProps> = React.memo(({ data, onRowClick }) => {
       // Memoize expensive data transformations
       const processedData = useMemo(() => {
         return data.map(item => ({
           ...item,
           formattedDate: new Date(item.date).toLocaleDateString(),
           status: item.active ? 'Active' : 'Inactive',
         }));
       }, [data]);

       // Memoize event handlers
       const handleRowClick = useCallback((row: any) => {
         onRowClick(row);
       }, [onRowClick]);

       return (
         <table>
           <thead>
             <tr>
               <th>ID</th>
               <th>Name</th>
               <th>Date</th>
               <th>Status</th>
             </tr>
           </thead>
           <tbody>
             {processedData.map(row => (
               <tr key={row.id} onClick={() => handleRowClick(row)}>
                 <td>{row.id}</td>
                 <td>{row.name}</td>
                 <td>{row.formattedDate}</td>
                 <td>{row.status}</td>
               </tr>
             ))}
           </tbody>
         </table>
       );
     });

     export default DataTable;
     ```

3. **Optimize context usage**:
   - Split large contexts into smaller, more focused contexts
   - Use context selectors to prevent unnecessary re-renders
   - Example:
     ```tsx
     // src/context/AppContext.tsx
     import React, { createContext, useContext, useReducer } from 'react';

     // Split the context into smaller contexts
     const UserContext = createContext<UserState | undefined>(undefined);
     const SettingsContext = createContext<SettingsState | undefined>(undefined);
     const NotificationsContext = createContext<NotificationsState | undefined>(undefined);

     // Create a provider component
     export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
       const [userState, userDispatch] = useReducer(userReducer, initialUserState);
       const [settingsState, settingsDispatch] = useReducer(settingsReducer, initialSettingsState);
       const [notificationsState, notificationsDispatch] = useReducer(notificationsReducer, initialNotificationsState);

       return (
         <UserContext.Provider value={{ state: userState, dispatch: userDispatch }}>
           <SettingsContext.Provider value={{ state: settingsState, dispatch: settingsDispatch }}>
             <NotificationsContext.Provider value={{ state: notificationsState, dispatch: notificationsDispatch }}>
               {children}
             </NotificationsContext.Provider>
           </SettingsContext.Provider>
         </UserContext.Provider>
       );
     };

     // Create hooks for accessing each context
     export const useUser = () => {
       const context = useContext(UserContext);
       if (context === undefined) {
         throw new Error('useUser must be used within a UserProvider');
       }
       return context;
     };

     export const useSettings = () => {
       const context = useContext(SettingsContext);
       if (context === undefined) {
         throw new Error('useSettings must be used within a SettingsProvider');
       }
       return context;
     };

     export const useNotifications = () => {
       const context = useContext(NotificationsContext);
       if (context === undefined) {
         throw new Error('useNotifications must be used within a NotificationsProvider');
       }
       return context;
     };
     ```

4. **Implement virtualization for long lists**:
   - Use react-window or react-virtualized for rendering large lists
   - Example:
     ```tsx
     // src/components/VirtualizedList.tsx
     import React from 'react';
     import { FixedSizeList } from 'react-window';

     interface VirtualizedListProps {
       items: any[];
       height: number;
       width: number;
       itemSize: number;
       renderItem: (item: any, index: number) => React.ReactNode;
     }

     const VirtualizedList: React.FC<VirtualizedListProps> = ({
       items,
       height,
       width,
       itemSize,
       renderItem,
     }) => {
       const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
         const item = items[index];
         return <div style={style}>{renderItem(item, index)}</div>;
       };

       return (
         <FixedSizeList
           height={height}
           width={width}
           itemCount={items.length}
           itemSize={itemSize}
         >
           {Row}
         </FixedSizeList>
       );
     };

     export default VirtualizedList;
     ```

5. **Optimize bundle size**:
   - Analyze bundle size with tools like webpack-bundle-analyzer
   - Use tree-shaking to eliminate unused code
   - Replace large dependencies with smaller alternatives
   - Example:
     ```javascript
     // webpack.config.js
     const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

     module.exports = {
       // ... other webpack config
       plugins: [
         // ... other plugins
         new BundleAnalyzerPlugin({
           analyzerMode: 'static',
           reportFilename: 'bundle-report.html',
           openAnalyzer: false,
         }),
       ],
     };
     ```

## 4. Implement Error Handling and Logging

### Implementation Steps:

1. **Create an error boundary component**:
   ```tsx
   // src/components/ErrorBoundary.tsx
   import React, { Component, ErrorInfo, ReactNode } from 'react';

   interface Props {
     children: ReactNode;
     fallback?: ReactNode;
     onError?: (error: Error, errorInfo: ErrorInfo) => void;
   }

   interface State {
     hasError: boolean;
     error?: Error;
   }

   class ErrorBoundary extends Component<Props, State> {
     constructor(props: Props) {
       super(props);
       this.state = { hasError: false };
     }

     static getDerivedStateFromError(error: Error): State {
       return { hasError: true, error };
     }

     componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
       // Log the error
       console.error('Error caught by ErrorBoundary:', error, errorInfo);

       // Call the onError callback if provided
       if (this.props.onError) {
         this.props.onError(error, errorInfo);
       }
     }

     render(): ReactNode {
       if (this.state.hasError) {
         // Render the fallback UI if provided, otherwise render a default error message
         return this.props.fallback || (
           <div className="error-boundary">
             <h2>Something went wrong.</h2>
             <details>
               <summary>Error details</summary>
               <pre>{this.state.error?.toString()}</pre>
             </details>
             <button onClick={() => window.location.reload()}>
               Refresh the page
             </button>
           </div>
         );
       }

       return this.props.children;
     }
   }

   export default ErrorBoundary;
   ```

2. **Implement a logging service**:
   ```tsx
   // src/services/logger.ts
   type LogLevel = 'debug' | 'info' | 'warn' | 'error';

   interface LogEntry {
     level: LogLevel;
     message: string;
     timestamp: string;
     data?: any;
   }

   class Logger {
     private static instance: Logger;
     private logs: LogEntry[] = [];
     private maxLogs: number = 100;

     private constructor() {}

     static getInstance(): Logger {
       if (!Logger.instance) {
         Logger.instance = new Logger();
       }
       return Logger.instance;
     }

     private log(level: LogLevel, message: string, data?: any): void {
       const entry: LogEntry = {
         level,
         message,
         timestamp: new Date().toISOString(),
         data,
       };

       // Add to internal logs
       this.logs.push(entry);
       if (this.logs.length > this.maxLogs) {
         this.logs.shift();
       }

       // Log to console
       console[level](message, data);

       // In production, you might want to send logs to a server
       if (process.env.NODE_ENV === 'production') {
         this.sendToServer(entry);
       }
     }

     private sendToServer(entry: LogEntry): void {
       // Implementation for sending logs to a server
       // This could use fetch, axios, or any other HTTP client
       // Example:
       // fetch('/api/logs', {
       //   method: 'POST',
       //   headers: { 'Content-Type': 'application/json' },
       //   body: JSON.stringify(entry),
       // }).catch(err => console.error('Failed to send log to server:', err));
     }

     debug(message: string, data?: any): void {
       this.log('debug', message, data);
     }

     info(message: string, data?: any): void {
       this.log('info', message, data);
     }

     warn(message: string, data?: any): void {
       this.log('warn', message, data);
     }

     error(message: string, data?: any): void {
       this.log('error', message, data);
     }

     getLogs(): LogEntry[] {
       return [...this.logs];
     }

     clearLogs(): void {
       this.logs = [];
     }
   }

   export const logger = Logger.getInstance();
   ```

3. **Create custom hooks for error handling**:
   ```tsx
   // src/hooks/useErrorHandler.ts
   import { useState, useCallback } from 'react';
   import { logger } from '../services/logger';

   interface ErrorState {
     hasError: boolean;
     message: string;
     details?: any;
   }

   export function useErrorHandler() {
     const [error, setError] = useState<ErrorState>({
       hasError: false,
       message: '',
     });

     const handleError = useCallback((err: any) => {
       const message = err.message || 'An unexpected error occurred';

       // Log the error
       logger.error(message, err);

       // Update error state
       setError({
         hasError: true,
         message,
         details: err,
       });
     }, []);

     const clearError = useCallback(() => {
       setError({
         hasError: false,
         message: '',
       });
     }, []);

     return {
       error,
       handleError,
       clearError,
     };
   }
   ```

4. **Implement API error handling**:
   ```tsx
   // src/services/api.ts
   import { logger } from './logger';

   interface ApiResponse<T> {
     data?: T;
     error?: {
       message: string;
       code?: string;
       details?: any;
     };
   }

   export async function fetchApi<T>(
     url: string,
     options?: RequestInit
   ): Promise<ApiResponse<T>> {
     try {
       const response = await fetch(url, options);

       if (!response.ok) {
         // Handle HTTP errors
         const errorText = await response.text();
         let errorJson;

         try {
           errorJson = JSON.parse(errorText);
         } catch (e) {
           // If the error response is not JSON, use the text as the message
           errorJson = { message: errorText };
         }

         const error = {
           message: errorJson.message || `HTTP error ${response.status}`,
           code: errorJson.code || response.status.toString(),
           details: errorJson,
         };

         logger.error(`API error: ${error.message}`, {
           url,
           status: response.status,
           error,
         });

         return { error };
       }

       const data = await response.json();
       return { data };
     } catch (err) {
       // Handle network errors or other exceptions
       const error = {
         message: err instanceof Error ? err.message : 'Unknown error',
         details: err,
       };

       logger.error(`API error: ${error.message}`, {
         url,
         error,
       });

       return { error };
     }
   }
   ```

## 5. Implement Accessibility Improvements

### Implementation Steps:

1. **Create accessibility utilities**:
   ```tsx
   // src/utils/a11y.ts
   import { useEffect } from 'react';

   // Hook to trap focus within a modal or dialog
   export function useTrapFocus(ref: React.RefObject<HTMLElement>, isOpen: boolean) {
     useEffect(() => {
       if (!isOpen || !ref.current) return;

       const focusableElements = ref.current.querySelectorAll(
         'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
       );

       const firstElement = focusableElements[0] as HTMLElement;
       const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

       function handleKeyDown(e: KeyboardEvent) {
         if (e.key !== 'Tab') return;

         // Shift + Tab
         if (e.shiftKey) {
           if (document.activeElement === firstElement) {
             lastElement.focus();
             e.preventDefault();
           }
         }
         // Tab
         else {
           if (document.activeElement === lastElement) {
             firstElement.focus();
             e.preventDefault();
           }
         }
       }

       // Focus the first element when the modal opens
       firstElement?.focus();

       // Add event listener
       document.addEventListener('keydown', handleKeyDown);

       // Clean up
       return () => {
         document.removeEventListener('keydown', handleKeyDown);
       };
     }, [isOpen, ref]);
   }

   // Hook to handle escape key press
   export function useEscapeKey(callback: () => void, isEnabled: boolean = true) {
     useEffect(() => {
       if (!isEnabled) return;

       function handleKeyDown(e: KeyboardEvent) {
         if (e.key === 'Escape') {
           callback();
         }
       }

       document.addEventListener('keydown', handleKeyDown);

       return () => {
         document.removeEventListener('keydown', handleKeyDown);
       };
     }, [callback, isEnabled]);
   }
   ```

2. **Update UI components with accessibility features**:
   ```tsx
   // src/components/ui/Modal.tsx
   import React, { useRef, useEffect } from 'react';
   import { useTrapFocus, useEscapeKey } from '../../utils/a11y';

   interface ModalProps {
     isOpen: boolean;
     onClose: () => void;
     title: string;
     children: React.ReactNode;
   }

   const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
     const modalRef = useRef<HTMLDivElement>(null);

     // Trap focus within the modal
     useTrapFocus(modalRef, isOpen);

     // Close modal on escape key press
     useEscapeKey(onClose, isOpen);

     // Prevent body scrolling when modal is open
     useEffect(() => {
       if (isOpen) {
         document.body.style.overflow = 'hidden';
       } else {
         document.body.style.overflow = '';
       }

       return () => {
         document.body.style.overflow = '';
       };
     }, [isOpen]);

     if (!isOpen) return null;

     return (
       <div
         className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
         onClick={onClose}
         role="dialog"
         aria-modal="true"
         aria-labelledby="modal-title"
       >
         <div
           ref={modalRef}
           className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-auto"
           onClick={(e) => e.stopPropagation()}
         >
           <div className="flex justify-between items-center p-4 border-b">
             <h2 id="modal-title" className="text-lg font-semibold">
               {title}
             </h2>
             <button
               onClick={onClose}
               className="text-gray-500 hover:text-gray-700"
               aria-label="Close modal"
             >
               &times;
             </button>
           </div>
           <div className="p-4">
             {children}
           </div>
         </div>
       </div>
     );
   };

   export default Modal;
   ```

3. **Add ARIA attributes to components**:
   ```tsx
   // src/components/ui/Tabs.tsx
   import React, { useState } from 'react';

   interface TabsProps {
     tabs: {
       id: string;
       label: string;
       content: React.ReactNode;
     }[];
     defaultTab?: string;
   }

   const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab }) => {
     const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

     return (
       <div>
         <div
           role="tablist"
           aria-orientation="horizontal"
           className="flex border-b"
         >
           {tabs.map((tab) => (
             <button
               key={tab.id}
               role="tab"
               id={`tab-${tab.id}`}
               aria-selected={activeTab === tab.id}
               aria-controls={`tabpanel-${tab.id}`}
               className={`px-4 py-2 ${
                 activeTab === tab.id
                   ? 'border-b-2 border-blue-500 text-blue-600'
                   : 'text-gray-600 hover:text-gray-800'
               }`}
               onClick={() => setActiveTab(tab.id)}
             >
               {tab.label}
             </button>
           ))}
         </div>
         {tabs.map((tab) => (
           <div
             key={tab.id}
             role="tabpanel"
             id={`tabpanel-${tab.id}`}
             aria-labelledby={`tab-${tab.id}`}
             hidden={activeTab !== tab.id}
             className="p-4"
           >
             {tab.content}
           </div>
         ))}
       </div>
     );
   };

   export default Tabs;
   ```

4. **Implement keyboard navigation**:
   ```tsx
   // src/components/ui/Dropdown.tsx
   import React, { useState, useRef, useEffect } from 'react';
   import { useEscapeKey } from '../../utils/a11y';

   interface DropdownProps {
     trigger: React.ReactNode;
     items: {
       id: string;
       label: string;
       onClick: () => void;
     }[];
   }

   const Dropdown: React.FC<DropdownProps> = ({ trigger, items }) => {
     const [isOpen, setIsOpen] = useState(false);
     const dropdownRef = useRef<HTMLDivElement>(null);
     const buttonRef = useRef<HTMLButtonElement>(null);

     // Close dropdown on escape key press
     useEscapeKey(() => setIsOpen(false), isOpen);
