#!/usr/bin/env node

/**
 * Route Validator Script
 * 
 * This script checks that all page components have corresponding routes
 * and identifies any missing connections.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all TSX files in pages directory recursively
const getAllPageFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllPageFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') && !file.includes('.test.') && !file.includes('.spec.') && file.includes('Page')) {
      fileList.push(filePath);
    }
  });

  return fileList;
};

// Extract routes from App.tsx
const extractRoutesFromApp = (appFilePath) => {
  const appContent = fs.readFileSync(appFilePath, 'utf8');
  const routeMatches = appContent.match(/<Route\s+path="([^"]+)"\s+element={<([^>]+)}/g);
  
  if (!routeMatches) return [];
  
  const routes = routeMatches.map(match => {
    const pathMatch = match.match(/path="([^"]+)"/);
    const elementMatch = match.match(/element={<([^>|\s]+)/);
    
    return {
      path: pathMatch ? pathMatch[1] : null,
      component: elementMatch ? elementMatch[1] : null
    };
  }).filter(route => route.path && route.component);
  
  return routes;
};

// Check which pages are missing routes
const findMissingRoutes = () => {
  const pagesDir = path.join(__dirname, '../src/pages');
  const appFilePath = path.join(__dirname, '../src/App.tsx');
  
  const pageFiles = getAllPageFiles(pagesDir);
  const routes = extractRoutesFromApp(appFilePath);
  
  // Extract page component names
  const pageComponents = pageFiles.map(file => {
    const filename = path.basename(file, '.tsx');
    return { 
      name: filename, 
      path: file,
      relativePath: file.replace(process.cwd(), '')
    };
  });
  
  // Check which page components are not in routes
  const missingRoutes = pageComponents.filter(page => {
    return !routes.some(route => route.component === page.name);
  });
  
  return { missingRoutes, totalPages: pageComponents.length, routesFound: routes.length };
};

// Generate route suggestions
const generateRouteSuggestions = (missingRoutes) => {
  return missingRoutes.map(page => {
    const pageName = page.name;
    const pathSuggestion = page.relativePath
      .replace(/.tsx$/, '')
      .replace(/Page$/, '')
      .toLowerCase()
      .replace(/^.*\/pages\//, '/')
      .replace(/\/index$/, '/');
    
    return `<Route path="${pathSuggestion}" element={<${pageName} />} />`;
  }).join('\n');
};

// Main function
const main = () => {
  const { missingRoutes, totalPages, routesFound } = findMissingRoutes();
  
  console.log(`=== Route Connection Audit ===`);
  console.log(`Total page components found: ${totalPages}`);
  console.log(`Total routes found: ${routesFound}`);
  console.log(`Missing routes: ${missingRoutes.length}`);
  
  if (missingRoutes.length > 0) {
    console.log('\n=== Pages Missing Routes ===');
    missingRoutes.forEach(page => {
      console.log(`- ${page.name}: ${page.relativePath}`);
    });
    
    console.log('\n=== Suggested Route Additions ===');
    console.log(generateRouteSuggestions(missingRoutes));
    
    // Write suggestions to a file
    const outputFile = path.join(process.cwd(), 'ROUTE_CONNECTION_SUGGESTIONS.md');
    const outputContent = `# Route Connection Suggestions
    
## Pages Missing Routes

Total: ${missingRoutes.length}/${totalPages}

${missingRoutes.map(page => `- ${page.name}: ${page.relativePath}`).join('\n')}

## Suggested Route Additions

Add these routes to your App.tsx file:

\`\`\`jsx
${generateRouteSuggestions(missingRoutes)}
\`\`\`

Generated: ${new Date().toLocaleDateString()}
`;
    
    fs.writeFileSync(outputFile, outputContent);
    console.log(`\nSuggestions written to ${outputFile}`);
  } else {
    console.log('\n✅ All page components have corresponding routes!');
  }
};

// Run the script
main();
