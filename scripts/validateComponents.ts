/**
 * Component Validator Script
 * 
 * This script validates which components from the sidebar configuration exist
 * and identifies which components need to be created.
 */

import * as fs from 'fs';
import * as path from 'path';
import { sidebarConfig, SidebarItem } from '../src/config/sidebarConfig';

// Base directory for the project
const baseDir = path.resolve(__dirname, '../src');

interface ComponentInfo {
  name: string;
  path: string;
}

interface ValidationReport {
  existing: string[];
  missing: ComponentInfo[];
  created: string[];
}

// Function to check if a component exists
const componentExists = (componentPath: string): boolean => {
  const fullPath = path.join(baseDir, componentPath + '.tsx');
  return fs.existsSync(fullPath);
};

// Function to generate a basic component scaffold
const generateComponentScaffold = (componentName: string, componentPath: string): string => {
  const fileName = componentPath.split('/').pop() || '';
  const isPage = componentPath.includes('pages/');

  return `import React from 'react';

${isPage ? 
`interface ${fileName}Props {}

const ${fileName}: React.FC<${fileName}Props> = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">${componentName}</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-500">This page is under development.</p>
      </div>
    </div>
  );
};

export default ${fileName};` 
: 
`interface ${fileName}Props {}

const ${fileName}: React.FC<${fileName}Props> = () => {
  return (
    <div className="rounded-lg border p-4 mb-4">
      <h2 className="text-lg font-medium mb-2">${componentName}</h2>
      <div className="text-gray-500">
        <p>This component is under development.</p>
      </div>
    </div>
  );
};

export default ${fileName};`}`;
};

// Validate all components and create a report
const validateComponents = (): ValidationReport => {
  const report: ValidationReport = {
    existing: [],
    missing: [],
    created: []
  };

  // Check main components
  sidebarConfig.forEach(item => {
    const componentPath = item.component;
    const componentName = item.label;

    if (componentExists(componentPath)) {
      report.existing.push(componentPath);
    } else {
      report.missing.push({ name: componentName, path: componentPath });
    }

    // Check subcomponents
    if (item.subComponents && item.subComponents.length > 0) {
      item.subComponents.forEach(subPath => {
        const subComponentName = subPath.split('/').pop()?.replace(/\.tsx$/, '') || '';

        if (componentExists(subPath)) {
          report.existing.push(subPath);
        } else {
          report.missing.push({ name: subComponentName, path: subPath });
        }
      });
    }
  });

  return report;
};

// Create missing components
const createMissingComponents = (report: ValidationReport): void => {
  if (!report.missing.length) {
    console.log('No missing components to create.');
    return;
  }

  report.missing.forEach(component => {
    const fullPath = path.join(baseDir, component.path + '.tsx');
    const dirPath = path.dirname(fullPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }

    // Write component file
    const componentContent = generateComponentScaffold(component.name, component.path);
    fs.writeFileSync(fullPath, componentContent);
    report.created.push(component.path);
    console.log(`Created component: ${component.path}`);
  });
};

// Generate markdown report
const generateMarkdownReport = (report: ValidationReport): string => {
  let markdown = `# Component Validation Report\n\n`;
  
  markdown += `## Summary\n\n`;
  markdown += `- Existing components: ${report.existing.length}\n`;
  markdown += `- Missing components: ${report.missing.length}\n`;
  markdown += `- Created components: ${report.created.length}\n\n`;

  if (report.created.length > 0) {
    markdown += `## Created Components\n\n`;
    report.created.forEach(component => {
      markdown += `- \`${component}.tsx\`\n`;
    });
    markdown += '\n';
  }

  if (report.missing.length > 0) {
    markdown += `## Still Missing Components\n\n`;
    report.missing.forEach(component => {
      markdown += `- \`${component.path}.tsx\`\n`;
    });
  }

  return markdown;
};

// Main execution
const report = validateComponents();
createMissingComponents(report);
const markdownReport = generateMarkdownReport(report);

// Write report to file
fs.writeFileSync(path.resolve(__dirname, '../COMPONENT_VALIDATION.md'), markdownReport);
console.log(`Component validation report generated at COMPONENT_VALIDATION.md`);

// Print summary to console
console.log('\nSummary:');
console.log(`- Existing components: ${report.existing.length}`);
console.log(`- Missing components: ${report.missing.length - report.created.length}`);
console.log(`- Created components: ${report.created.length}`);
