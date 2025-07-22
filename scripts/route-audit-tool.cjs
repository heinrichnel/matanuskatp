/**
 * Route Audit Tool
 * 
 * This script analyzes the codebase to find disconnected components
 * and generates a report to help connect all components to routes.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const rootDir = path.join(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const componentsDir = path.join(srcDir, 'components');
const pagesDir = path.join(srcDir, 'pages');
const appRoutesFile = path.join(srcDir, 'AppRoutes.tsx');

// Collect all component files
console.log('Collecting component files...');
const componentFiles = [];

function collectFiles(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const relativePath = prefix ? `${prefix}/${file}` : file;
    
    if (fs.statSync(filePath).isDirectory()) {
      collectFiles(filePath, relativePath);
    } else if (file.endsWith('.tsx') && !file.includes('.test.') && !file.includes('.spec.')) {
      componentFiles.push({
        path: filePath,
        relativePath: relativePath,
        name: file.replace('.tsx', '')
      });
    }
  });
}

// Collect component files
collectFiles(componentsDir, 'components');
collectFiles(pagesDir, 'pages');

console.log(`Found ${componentFiles.length} component files`);

// Read the AppRoutes file to find which components are already routed
const appRoutesContent = fs.readFileSync(appRoutesFile, 'utf8');

// Find routed components
const routedComponents = new Set();
const importRegex = /import\s+(\w+)\s+from\s+['"]\.\/([^'"]+)['"]/g;
let match;

while ((match = importRegex.exec(appRoutesContent)) !== null) {
  const componentName = match[1];
  routedComponents.add(componentName);
}

// Find unrouted components that might be pages
const unroutedPages = componentFiles.filter(component => {
  // Only consider files that might be page components
  const isPossiblePage = 
    component.name.includes('Page') || 
    component.relativePath.startsWith('pages/') ||
    component.name.includes('Dashboard') ||
    component.name.includes('Management');
    
  return isPossiblePage && !routedComponents.has(component.name);
});

// Generate report
console.log('\nGenerating route audit report...');

const reportContent = `# Route Audit Report
Generated on: ${new Date().toLocaleString()}

## Summary
- Total Component Files: ${componentFiles.length}
- Routed Components: ${routedComponents.size}
- Potentially Unrouted Pages: ${unroutedPages.length}

## Unrouted Page Components
These components appear to be pages but are not included in the routing:

${unroutedPages.map(comp => `- \`${comp.relativePath}\``).join('\n')}

## Recommended Actions
1. Review the unrouted page components and add them to \`AppRoutes.tsx\`
2. Update the sidebar configuration to include these components
3. Re-run this audit after making changes

`;

// Write the report
const reportFile = path.join(rootDir, 'ROUTE_AUDIT_REPORT.md');
fs.writeFileSync(reportFile, reportContent);

console.log(`Route audit report written to ${reportFile}`);

// Generate sidebar entry suggestions for unrouted pages
console.log('\nGenerating sidebar entry suggestions...');

const sidebarSuggestions = unroutedPages.map(comp => {
  const pathParts = comp.relativePath.split('/');
  const componentName = pathParts[pathParts.length - 1].replace('.tsx', '');
  
  // Generate a route path based on component name
  let routePath = '';
  if (pathParts.length > 1) {
    // Use the directory structure for the path
    routePath = `/${pathParts.slice(0, pathParts.length - 1).join('/')}`;
  } else {
    // Just use the component name
    routePath = `/${componentName.toLowerCase()}`;
  }
  
  // Clean up the route path
  routePath = routePath.replace('/pages', '');
  if (!routePath) routePath = `/${componentName.toLowerCase()}`;
  
  // Generate a label from the component name
  const label = componentName
    .replace('Page', '')
    .replace(/([A-Z])/g, ' $1')
    .trim();
  
  return `{ 
  id: '${componentName.toLowerCase().replace(/\s/g, '-')}', 
  label: '${label}', 
  path: '${routePath}', 
  component: '${comp.relativePath.replace('.tsx', '')}' 
}`;
}).join(',\n\n');

// Write the sidebar suggestions
const suggestionsFile = path.join(rootDir, 'SIDEBAR_SUGGESTIONS.md');
fs.writeFileSync(suggestionsFile, `# Sidebar Entry Suggestions

The following entries can be added to your sidebarConfig.ts file:

\`\`\`typescript
// Add these to your sidebarConfig array
${sidebarSuggestions}
\`\`\`

`);

console.log(`Sidebar suggestions written to ${suggestionsFile}`);
console.log('\nRoute audit complete!');
