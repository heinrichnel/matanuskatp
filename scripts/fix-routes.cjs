// Generate complete routes from sidebar configuration
const fs = require('fs');
const path = require('path');

// Import the sidebar config - we'll need to manually extract it
const sidebarConfigPath = path.join(__dirname, '../src/config/sidebarConfig.ts');
let sidebarConfigContent = fs.readFileSync(sidebarConfigPath, 'utf8');

// Extract the sidebar items
const routes = [];
const itemRegex = /{\s*id:\s*['"]([^'"]+)['"]\s*,\s*label:\s*['"]([^'"]+)['"]\s*,\s*path:\s*['"]([^'"]+)['"]\s*,\s*component:\s*['"]([^'"]+)['"]/g;
let match;
while ((match = itemRegex.exec(sidebarConfigContent)) !== null) {
  routes.push({
    id: match[1],
    label: match[2],
    path: match[3],
    component: match[4]
  });
}

// Function to generate route imports
const generateImports = () => {
  const imports = new Set();
  
  // Add default imports
  imports.add(`import React from 'react';`);
  imports.add(`import { Route } from 'react-router-dom';`);
  
  // Add component imports based on sidebar config
  routes.forEach(item => {
    if (item.component) {
      const componentParts = item.component.split('/');
      const componentName = componentParts[componentParts.length - 1];
      if (!componentName.includes('.')) {  // Skip if it's a file path with extension
        imports.add(`import ${componentName} from './${item.component}';`);
      }
    }
  });
  
  return Array.from(imports).join('\n');
};

// Function to generate route elements
const generateRoutes = () => {
  return routes.map(item => {
    const componentParts = item.component.split('/');
    const componentName = componentParts[componentParts.length - 1];
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
