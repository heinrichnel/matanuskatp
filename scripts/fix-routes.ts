// Generate complete routes from sidebar configuration
import * as fs from 'fs';
import * as path from 'path';
import { sidebarConfig } from '../src/config/sidebarConfig';

// Function to generate route imports
const generateImports = () => {
  const imports = new Set();
  
  // Add default imports
  imports.add(`import React from 'react';`);
  imports.add(`import { Route } from 'react-router-dom';`);
  
  // Add component imports based on sidebar config
  sidebarConfig.forEach(item => {
    if (item.component) {
      const componentName = item.component.split('/').pop() || '';
      if (!componentName.includes('.')) {  // Skip if it's a file path with extension
        imports.add(`import ${componentName} from './${item.component}';`);
      }
    }
  });
  
  return Array.from(imports).join('\n');
};

// Function to generate route elements
const generateRoutes = () => {
  return sidebarConfig.map(item => {
    const componentName = item.component.split('/').pop() || '';
    return `<Route path="${item.path}" element={<${componentName} />} />`;
  }).join('\n      ');
};

// Create the routes file content
const routesContent = `
${generateImports()}

// Routes generated from sidebarConfig.ts
export const AppRoutes = () => {
  return (
    <>
      {/* Main routes based on sidebar configuration */}
      ${generateRoutes()}
    </>
  );
};
`;

// Write to a file
fs.writeFileSync(path.join(__dirname, '../src/AppRoutes.tsx'), routesContent);
console.log('Generated AppRoutes.tsx from sidebar configuration');
