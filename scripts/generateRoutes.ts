/**
 * Route Generator Script
 * 
 * This script generates route definitions for React Router based on the sidebar configuration.
 * It helps ensure that routes are always in sync with the sidebar navigation.
 */

import * as fs from 'fs';
import * as path from 'path';
import { sidebarConfig, SidebarItem } from '../src/config/sidebarConfig';

// Group sidebar items by section
const sections = sidebarConfig.reduce<Record<string, SidebarItem[]>>((acc, item) => {
  // Extract the section from the path (e.g., '/trips/active' -> 'trips')
  const section = item.path.split('/')[1];
  
  if (!acc[section]) {
    acc[section] = [];
  }
  
  acc[section].push(item);
  return acc;
}, {});

// Generate route import statements
const generateImports = (): string => {
  const imports: string[] = [];
  const importedComponents = new Set<string>();
  
  // Add core imports
  imports.push(`import React from 'react';`);
  imports.push(`import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';`);
  imports.push(`import Layout from './components/layout/Layout';`);
  
  // Add section page imports
  Object.keys(sections).forEach(section => {
    const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
    const componentName = `${sectionName}ManagementPage`;
    
    if (!importedComponents.has(componentName)) {
      imports.push(`import ${componentName} from './pages/${componentName}';`);
      importedComponents.add(componentName);
    }
  });
  
  // Add individual page imports from the sidebar config
  sidebarConfig.forEach(item => {
    const componentPath = item.component;
    if (componentPath) {
      const componentName = componentPath.split('/').pop() || '';
      
      if (componentName && !importedComponents.has(componentName)) {
        imports.push(`import ${componentName} from './${componentPath}';`);
        importedComponents.add(componentName);
      }
    }
    
    // Add subcomponent imports if they exist
    if (item.subComponents && item.subComponents.length > 0) {
      item.subComponents.forEach(subPath => {
        const subComponentName = subPath.split('/').pop() || '';
        
        if (subComponentName && !importedComponents.has(subComponentName)) {
          imports.push(`import ${subComponentName} from './${subPath}';`);
          importedComponents.add(subComponentName);
        }
      });
    }
  });
  
  return imports.join('\n');
};

// Generate route definitions
const generateRoutes = (): string => {
  let routes = '';
  
  Object.keys(sections).forEach(section => {
    const sectionItems = sections[section];
    const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
    const componentName = `${sectionName}ManagementPage`;
    
    routes += `
                {/* ${sectionName} Management Section */}
                <Route path="${section}" element={<${componentName} />}>
                  <Route index element={<Navigate to="/${section}/dashboard" replace />} />
    `;
    
    // Generate child routes for this section
    sectionItems.forEach(item => {
      const routePath = item.path.split('/').slice(2).join('/');
      const componentName = item.component.split('/').pop() || '';
      
      if (routePath) {
        routes += `                  <Route path="${routePath}" element={<${componentName} />} />\n`;
      }
    });
    
    routes += `                </Route>\n`;
  });
  
  return routes;
};

// Generate the entire routes file
const generateRoutesFile = (): string => {
  const imports = generateImports();
  const routes = generateRoutes();
  
  const fileContent = `${imports}

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route element={<Layout />}>
${routes}
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRoutes;
`;

  return fileContent;
};

// Write the generated routes to a file
const outputFile = path.resolve(__dirname, '../src/AppRoutes.tsx');
fs.writeFileSync(outputFile, generateRoutesFile());

console.log(`Routes generated successfully at ${outputFile}`);
