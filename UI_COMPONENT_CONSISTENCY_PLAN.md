# Implementation Plan: UI Component Consistency

Based on my analysis of the codebase, I've identified several inconsistencies in the UI component implementations. Here's a detailed implementation plan to address these issues:

## 1. Standardize Component Implementation Patterns

I found inconsistent implementation patterns across UI components:
- Some components use `React.FC`
- Others use `React.forwardRef`
- Some use function declarations without type annotations

### Implementation Steps:

1. **Adopt React.forwardRef as the standard pattern**:
   - This pattern provides better TypeScript support and allows ref forwarding
   - It's already used in many components like Card.tsx

2. **Create a component template**:
   ```tsx
   // Template for UI components
   import * as React from "react";
   import { cn } from "@/lib/utils";

   interface ComponentNameProps extends React.HTMLAttributes<HTMLElementType> {
     // Additional props here
     children?: React.ReactNode;
     className?: string;
   }

   const ComponentName = React.forwardRef<HTMLElementType, ComponentNameProps>(
     ({ className, children, ...props }, ref) => (
       <element
         ref={ref}
         className={cn("base-styles", className)}
         {...props}
       >
         {children}
       </element>
     )
   );
   ComponentName.displayName = "ComponentName";

   export { ComponentName };
   ```

3. **Update existing components**:
   - Refactor components that use other patterns to use the React.forwardRef pattern
   - Ensure consistent prop interfaces and naming conventions
   - Add displayName to all components for better debugging

## 2. Standardize Export Patterns

I found inconsistent export patterns:
- Some components use default exports
- Others use named exports
- Some use both

### Implementation Steps:

1. **Adopt named exports as the standard**:
   - Named exports provide better tree-shaking and make imports more explicit
   - They also work better with barrel files

2. **Update component exports**:
   - Remove default exports from components that have both
   - Convert default-only exports to named exports
   - Update the barrel file to re-export all named exports

3. **Create an export pattern guide**:
   ```md
   # Component Export Patterns

   - Use named exports for all components
   - Export the main component and any related subcomponents
   - Do not use default exports
   - Example:
     ```tsx
     export { Button, ButtonGroup };
     ```
   ```

## 3. Standardize Props and Styling

I found inconsistent props and styling approaches:
- Different prop naming conventions
- Inconsistent use of className and style props
- Different styling approaches (Tailwind, inline styles, etc.)

### Implementation Steps:

1. **Create a props standard**:
   - All components should accept a `className` prop for style overrides
   - Use consistent naming for common props (e.g., `onClick` not `handleClick`)
   - Extend appropriate HTML element props (e.g., `React.ButtonHTMLAttributes<HTMLButtonElement>`)

2. **Standardize styling approach**:
   - Use Tailwind CSS consistently across all components
   - Use the `cn` utility for className merging
   - Create a set of base styles for each component type

3. **Implement a theming system**:
   - Create a theme configuration file with color variables, spacing, etc.
   - Use these variables consistently across components
   - Example:
     ```tsx
     // theme.ts
     export const theme = {
       colors: {
         primary: {
           light: '#60a5fa',
           DEFAULT: '#3b82f6',
           dark: '#2563eb',
         },
         // ...other colors
       },
       // ...other theme variables
     };
     ```

## 4. Remove Unrelated Type Definitions from UI Barrel File

I found Wialon-related type definitions in the UI components index.ts file:

### Implementation Steps:

1. **Move Wialon type definitions to a dedicated file**:
   - Create a new file `src/types/wialon-types.ts`
   - Move all Wialon-related interfaces from `src/components/ui/index.ts` to this file

2. **Update the UI barrel file**:
   ```typescript
   /**
    * This file re-exports components from their source files
    * to prevent import casing issues across the application
    */

   // Re-export Button component
   export { Button } from "./Button";

   // Re-export Card components
   export { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./Card";

   // Re-export Input component
   export { Input } from "./Input";

   // Re-export Modal component
   export { Modal } from "./Modal";

   // Re-export Table components
   export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table";

   // Re-export other UI components
   export { ApplicantInfoCard } from "./ApplicantInfoCard";
   export { GenericPlaceholderPage } from "./GenericPlaceholderPage";
   export { ProgressStepper } from "./ProgressStepper";
   export { VerticalStepper } from "./VerticalStepper";
   export { Select } from "./Select";
   export { StatsCardGroup } from "./StatsCardGroup";
   ```

3. **Update imports in files using Wialon types**:
   - Find all files importing Wialon types from the UI barrel file
   - Update them to import from the new dedicated types file
   - Example:
     ```tsx
     // Before
     import { WialonUnit } from '@/components/ui';

     // After
     import { WialonUnit } from '@/types/wialon-types';
     ```

## 5. Create Component Documentation

### Implementation Steps:

1. **Create a component documentation template**:
   ```md
   # ComponentName

   Brief description of the component and its purpose.

   ## Props

   | Name | Type | Default | Description |
   |------|------|---------|-------------|
   | prop1 | string | undefined | Description of prop1 |
   | prop2 | boolean | false | Description of prop2 |

   ## Examples

   ```tsx
   <ComponentName prop1="value" prop2={true}>
     Content
   </ComponentName>
   ```

   ## Variants

   ### Variant 1

   Description of variant 1.

   ### Variant 2

   Description of variant 2.
   ```

2. **Document all UI components**:
   - Create documentation files for each component
   - Include prop definitions, examples, and variants
   - Store documentation in a `docs` folder next to each component

3. **Generate a component library documentation site**:
   - Use a tool like Storybook to create a component library documentation site
   - Include all UI components with examples and documentation

## 6. Testing and Validation

### Implementation Steps:

1. **Create component tests**:
   - Write unit tests for each standardized component
   - Test different prop combinations and variants
   - Ensure accessibility compliance

2. **Create a component validation script**:
   ```javascript
   // validate-components.js
   const fs = require('fs');
   const path = require('path');
   const glob = require('glob');

   // Find all component files
   const componentFiles = glob.sync('src/components/ui/**/*.tsx');

   // Validation rules
   const rules = [
     {
       name: 'Uses React.forwardRef',
       test: (content) => content.includes('React.forwardRef'),
     },
     {
       name: 'Has displayName',
       test: (content) => content.includes('.displayName ='),
     },
     {
       name: 'Uses named exports',
       test: (content) => content.includes('export {') && !content.includes('export default'),
     },
     // Add more rules as needed
   ];

   // Validate each component
   componentFiles.forEach(file => {
     const content = fs.readFileSync(file, 'utf8');
     const fileName = path.basename(file);

     console.log(`Validating ${fileName}...`);

     rules.forEach(rule => {
       const passes = rule.test(content);
       console.log(`  ${passes ? '✅' : '❌'} ${rule.name}`);
     });

     console.log('');
   });
   ```

3. **Run validation as part of CI/CD**:
   - Add the validation script to the CI/CD pipeline
   - Fail the build if components don't meet the standards

This implementation plan provides a structured approach to addressing the UI component consistency issues in the codebase, focusing on standardizing implementation patterns, export patterns, props and styling, and removing unrelated type definitions from the UI barrel file.
