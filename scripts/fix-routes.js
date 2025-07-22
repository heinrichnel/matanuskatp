// Generate complete routes from sidebar configuration
const fs = require('fs');
const path = require('path');

// Import the sidebar config - we'll need to manually extract it
const sidebarConfigPath = path.join(__dirname, '../src/config/sidebarConfig.ts');
let sidebarConfigContent = fs.readFileSync(sidebarConfigPath, 'utf8');

// Extract the sidebar config array
const startIndex = sidebarConfigContent.indexOf('export const sidebarConfig');
const endIndex = sidebarConfigContent.indexOf('];', startIndex) + 1;
const sidebarConfigArray = sidebarConfigContent.substring(startIndex, endIndex);

// Write a temporary JS file with the extracted config
const tempJsContent = `${sidebarConfigArray}
module.exports = { sidebarConfig };`;
fs.writeFileSync(path.join(__dirname, 'temp-sidebar-config.js'), tempJsContent);

// Now import the config
const { sidebarConfig } = require('./temp-sidebar-config.js');

// Function to generate route imports
const generateImports = () => {
  const imports = new Set();
  
  // Add default imports
  imports.add(`import React from 'react';`);
  imports.add(`import { Route } from 'react-router-dom';`);
  
  // Add component imports based on sidebar config
  sidebarConfig.forEach(item => {
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
  return sidebarConfig.map(item => {
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

// Clean up the temporary file
fs.unlinkSync(path.join(__dirname, 'temp-sidebar-config.js'));
