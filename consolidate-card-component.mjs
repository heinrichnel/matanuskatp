/**
 * Card Component Consolidation Script (ESM version)
 *
 * Usage:
 * node consolidate-card-component.mjs
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

// Polyfill __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const rootDir = process.cwd();
const srcDir = path.join(rootDir, "src");
const componentsDir = path.join(srcDir, "components");
const uiDir = path.join(componentsDir, "ui");
const consolidatedDir = path.join(uiDir, "consolidated");
const typesDir = path.join(srcDir, "types");

// Ensure directories exist
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Copy file with logging
function copyFile(source, destination) {
  console.log(`Copying ${source} to ${destination}`);
  fs.copyFileSync(source, destination);
}

// Update imports in a file
function updateImportsInFile(filePath, oldImportPatterns, newImport) {
  if (!fs.existsSync(filePath)) {
    console.log(`File does not exist: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, "utf8");
  let modified = false;

  for (const pattern of oldImportPatterns) {
    if (content.includes(pattern)) {
      content = content.replace(pattern, newImport);
      modified = true;
    }
  }

  if (modified) {
    console.log(`Updating imports in: ${filePath}`);
    fs.writeFileSync(filePath, content, "utf8");
    return true;
  }

  return false;
}

// Find files with specific imports
function findFilesWithImports(directory, patterns) {
  const result = [];

  try {
    const grepCommand = `grep -r "${patterns.join("\\|")}" --include="*.tsx" --include="*.ts" ${directory}`;
    const output = execSync(grepCommand, { encoding: "utf8" });

    const lines = output.split("\n");
    for (const line of lines) {
      if (!line) continue;
      const [filePath] = line.split(":");
      if (filePath && !result.includes(filePath)) {
        result.push(filePath);
      }
    }
  } catch (error) {
    // grep returns non-zero exit code if no matches found
    if (error.status !== 1) {
      console.error("Error executing grep:", error);
    }
  }

  return result;
}

// Main execution
async function main() {
  console.log("Starting Card component consolidation...");

  // 1. Create necessary directories
  ensureDirectoryExists(consolidatedDir);
  ensureDirectoryExists(typesDir);

  // 2. Copy consolidated Card component
  const consolidatedCardSource = path.join(uiDir, "consolidated", "Card.tsx");
  const consolidatedCardDest = path.join(consolidatedDir, "Card.tsx");

  if (!fs.existsSync(consolidatedCardSource)) {
    console.error(`Consolidated Card component not found at: ${consolidatedCardSource}`);
    console.log("Creating a basic consolidated Card component...");

    // Create a basic consolidated Card component
    const basicCardComponent = `import React, { forwardRef } from 'react';

/**
 * Card component for displaying content in a contained, styled box
 *
 * This is a consolidated version that combines features from all previous Card implementations
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional custom className */
  className?: string;
  /** Card title */
  title?: string;
  /** Whether to add padding to the card */
  padded?: boolean;
  /** Whether to add a border to the card */
  bordered?: boolean;
  /** Whether to add a shadow to the card */
  shadowed?: boolean;
  /** Whether to make the card take full height */
  fullHeight?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    children,
    className = '',
    title,
    padded = true,
    bordered = true,
    shadowed = true,
    fullHeight = false,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={\`bg-white rounded-lg \${bordered ? 'border border-gray-200' : ''}
                    \${shadowed ? 'shadow-sm' : ''}
                    \${padded ? 'p-4' : ''}
                    \${fullHeight ? 'h-full' : ''}
                    \${className}\`}
        {...props}
      >
        {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
`;

    fs.writeFileSync(consolidatedCardDest, basicCardComponent, "utf8");
  } else {
    copyFile(consolidatedCardSource, consolidatedCardDest);
  }

  // 3. Create consolidated UI barrel file
  const consolidatedIndexPath = path.join(consolidatedDir, "index.ts");
  const consolidatedIndexContent = `/**
 * Consolidated UI Components
 *
 * This file exports all consolidated UI components
 */

export * from './Card';
`;

  console.log(`Creating consolidated UI barrel file: ${consolidatedIndexPath}`);
  fs.writeFileSync(consolidatedIndexPath, consolidatedIndexContent, "utf8");

  // 4. Move Wialon types to a dedicated file
  const wialonTypesSource = path.join(typesDir, "wialon-types.ts.updated");
  const wialonTypesDest = path.join(typesDir, "wialon-types.ts");

  if (fs.existsSync(wialonTypesSource)) {
    copyFile(wialonTypesSource, wialonTypesDest);
  } else {
    console.log("Wialon types file not found, creating a basic one...");
    const basicWialonTypes = `/**
 * Wialon Types
 *
 * This file contains type definitions for Wialon integration
 */

export interface WialonUnit {
  id: number;
  name: string;
  // Add other properties as needed
}

export interface WialonCredentials {
  token: string;
  // Add other properties as needed
}

export interface WialonSession {
  eid: string;
  userId: number;
  // Add other properties as needed
}

export interface WialonPosition {
  latitude: number;
  longitude: number;
  // Add other properties as needed
}
`;

    fs.writeFileSync(wialonTypesDest, basicWialonTypes, "utf8");
  }

  // 5. Update the main UI barrel file
  const uiIndexPath = path.join(uiDir, "index.ts");
  const uiIndexUpdatedPath = path.join(uiDir, "index.ts.updated");

  if (fs.existsSync(uiIndexUpdatedPath)) {
    copyFile(uiIndexUpdatedPath, uiIndexPath);
  } else {
    console.log("Updated UI barrel file not found, creating a basic one...");
    const basicUiIndex = `/**
 * UI Components
 *
 * This file exports all UI components
 */

// Export consolidated components
export * from './consolidated';

// Re-export other UI components
// TODO: Add other UI component exports here
`;

    fs.writeFileSync(uiIndexPath, basicUiIndex, "utf8");
  }

  // 6. Update imports across the codebase
  console.log("Updating Card imports across the codebase...");

  const importPatterns = [
    "from '../components/ui/Card'",
    "from '../components/ui/card'",
    "from '../../components/ui/Card'",
    "from '../../components/ui/card'",
    "from '../../../components/ui/Card'",
    "from '../../../components/ui/card'",
    "from '@/components/ui/Card'",
    "from '@/components/ui/card'",
    "from 'components/ui/Card'",
    "from 'components/ui/card'",
    "from './Card'",
    "from './card'",
    "from '../ui/Card'",
    "from '../ui/card'",
    "from './ui/Card'",
    "from './ui/card'",
    "from '../components/ui/card/index'",
    "from '../../components/ui/card/index'",
    "from '../../../components/ui/card/index'",
    "from '@/components/ui/card/index'",
    "from 'components/ui/card/index'",
    "from './card/index'",
    "from '../ui/card/index'",
    "from './ui/card/index'",
  ];

  const newImport = "from '@/components/ui/consolidated/Card'";

  // Find files with Card imports
  console.log("Finding files with Card imports...");
  const searchPatterns = importPatterns.map((pattern) =>
    pattern.replace(/from /g, "").replace(/['"]/g, "")
  );
  const filesToUpdate = findFilesWithImports(srcDir, searchPatterns);

  console.log(`Found ${filesToUpdate.length} files with Card imports`);

  let updatedFiles = 0;
  for (const filePath of filesToUpdate) {
    if (updateImportsInFile(filePath, importPatterns, newImport)) {
      updatedFiles++;
    }
  }

  console.log(`Updated imports in ${updatedFiles} files`);

  console.log("\nCard component consolidation completed successfully!");
  console.log("\nNext steps:");
  console.log("1. Verify that the consolidated Card component works correctly");
  console.log("2. Test the application to ensure no functionality is broken");
  console.log("3. Remove the duplicate Card components after verification");
}

main().catch((error) => {
  console.error("Error during Card component consolidation:", error);
  process.exit(1);
});
