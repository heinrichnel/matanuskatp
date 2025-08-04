# Implementation Plan: File Organization and Duplicate Components

Based on my analysis of the codebase, I've identified several file organization issues, particularly with duplicate UI components. Here's a detailed implementation plan to address these issues:

## 1. Consolidate Duplicate Card Components

I found three different implementations of the Card component:
- `src/components/ui/card.tsx` (lowercase)
- `src/components/ui/Card.tsx` (PascalCase)
- `src/components/ui/card/index.tsx` (directory-based)

### Implementation Steps:

1. **Choose the canonical implementation**: The `Card.tsx` (PascalCase) version appears to be the most widely used based on import patterns.

2. **Merge unique features**:
   - Compare all three implementations and ensure the canonical version includes all unique props, styling options, and functionality.
   - The `card.tsx` and `Card.tsx` are nearly identical, with `Card.tsx` having an additional default export.
   - The `card/index.tsx` version has different styling that should be incorporated as options.

3. **Update the canonical file**:
   ```tsx
   // src/components/ui/Card.tsx
   import * as React from "react";
   import { cn } from "@/lib/utils";

   interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
     children: React.ReactNode;
     className?: string;
     variant?: "default" | "simple"; // Add variant support for different styling
   }

   // Add all other interfaces...

   const Card = React.forwardRef<HTMLDivElement, CardProps>(
     ({ className, children, variant = "default", ...props }, ref) => (
       <div
         ref={ref}
         className={cn(
           variant === "default"
             ? "bg-white rounded-xl border shadow overflow-hidden"
             : "bg-white rounded-lg border shadow-sm",
           className
         )}
         {...props}
       >
         {children}
       </div>
     )
   );
   Card.displayName = "Card";

   // Add all other component definitions...

   // Export both named exports and default export
   export {
     Card,
     CardHeader,
     CardTitle,
     CardDescription,
     CardContent,
     CardFooter,
   };

   export default Card;
   ```

4. **Remove duplicate files**:
   - After updating imports, remove `src/components/ui/card.tsx` and `src/components/ui/card/index.tsx`

## 2. Standardize Naming Conventions

### Implementation Steps:

1. **Adopt PascalCase for all component files**:
   - Rename files like `button.tsx` to `Button.tsx`, `input.tsx` to `Input.tsx`, etc.
   - Update imports in the barrel file (`index.ts`) to reflect these changes

2. **Create a naming convention document**:
   ```md
   # Component Naming Conventions

   - All React component files should use PascalCase (e.g., `Button.tsx`, `Card.tsx`)
   - Component directories should use kebab-case (e.g., `date-picker/`)
   - Utility files should use camelCase (e.g., `utils.ts`, `helpers.ts`)
   ```

3. **Update directory structure**:
   - For components with multiple files, use a directory with an `index.tsx` file
   - Example: `Button/index.tsx`, `Button/Button.styles.ts`, etc.

## 3. Remove Orphaned Components

I identified several orphaned components that aren't used anywhere in the application:

- `UIConnector.tsx`
- `UIComponentsDemo.tsx`
- `WorkshopIntegration.tsx`

### Implementation Steps:

1. **Verify components are truly orphaned**:
   - Use the search functionality to confirm these components aren't imported anywhere
   - Check for dynamic imports or string-based imports

2. **Document components before removal**:
   - Create a `REMOVED_COMPONENTS.md` file documenting what was removed and why
   - Include the full component code for future reference if needed

3. **Remove the orphaned files**:
   - Delete the files after documentation
   - Update any barrel files that may be exporting these components

## 4. Reorganize UI Component Directory

### Implementation Steps:

1. **Create a structured directory layout**:
   ```
   src/components/ui/
   ├── core/           # Basic UI building blocks
   │   ├── Button/
   │   ├── Card/
   │   ├── Input/
   │   └── ...
   ├── feedback/       # Notifications, alerts, etc.
   │   ├── Alert/
   │   ├── Modal/
   │   └── ...
   ├── layout/         # Layout components
   │   ├── Grid/
   │   ├── Stack/
   │   └── ...
   ├── navigation/     # Navigation components
   │   ├── Tabs/
   │   ├── Breadcrumb/
   │   └── ...
   └── data-display/   # Tables, lists, etc.
       ├── Table/
       ├── List/
       └── ...
   ```

2. **Move components to appropriate directories**:
   - Create the directory structure
   - Move each component to its appropriate category
   - Update the barrel file to re-export from new locations

3. **Update the main barrel file**:
   ```typescript
   // src/components/ui/index.ts

   // Core components
   export * from './core/Button';
   export * from './core/Card';
   export * from './core/Input';
   // ...

   // Feedback components
   export * from './feedback/Alert';
   export * from './feedback/Modal';
   // ...

   // And so on for other categories
   ```

4. **Create category-specific barrel files**:
   ```typescript
   // src/components/ui/core/index.ts
   export * from './Button';
   export * from './Card';
   export * from './Input';
   // ...
   ```

## 5. Update Import References

### Implementation Steps:

1. **Create a script to update imports**:
   ```javascript
   // update-imports.js
   const fs = require('fs');
   const path = require('path');
   const glob = require('glob');

   // Map of old imports to new imports
   const importMap = {
     '@/components/ui/card': '@/components/ui/core/Card',
     '@/components/ui/Card': '@/components/ui/core/Card',
     // Add all other mappings
   };

   // Find all TypeScript and TSX files
   const files = glob.sync('src/**/*.{ts,tsx}');

   files.forEach(file => {
     let content = fs.readFileSync(file, 'utf8');
     let modified = false;

     // Replace imports
     Object.entries(importMap).forEach(([oldImport, newImport]) => {
       const regex = new RegExp(`from ['"]${oldImport}['"]`, 'g');
       if (regex.test(content)) {
         content = content.replace(regex, `from '${newImport}'`);
         modified = true;
       }
     });

     // Save if modified
     if (modified) {
       fs.writeFileSync(file, content);
       console.log(`Updated imports in ${file}`);
     }
   });
   ```

2. **Run the script to update all imports**:
   ```bash
   node update-imports.js
   ```

3. **Manually verify and fix any issues**:
   - Check for any build errors after running the script
   - Fix any missed imports or edge cases

## 6. Documentation and Testing

### Implementation Steps:

1. **Document the changes**:
   - Update `CHANGELOG.md` with the file organization changes
   - Create or update component documentation

2. **Test the changes**:
   - Run the build process to ensure no errors
   - Run tests to ensure functionality is preserved
   - Manually test the application to verify components render correctly

3. **Create a migration guide**:
   - Document how to use the new component structure
   - Provide examples of the new import patterns
