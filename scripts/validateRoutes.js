import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Validating routes and components...');

// Read Sidebar.tsx to extract routes
const sidebarPath = path.join(__dirname, '..', 'src', 'components', 'layout', 'Sidebar.tsx');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

// Extract all paths from the Sidebar component
const pathRegex = /path:\s*['"]([^'"]+)['"]/g;
const routes = [];
let match;

while ((match = pathRegex.exec(sidebarContent)) !== null) {
  routes.push(match[1]);
}

console.log(`Found ${routes.length} routes in Sidebar.tsx`);

// Check if each route has a corresponding component in App.tsx
const appPath = path.join(__dirname, '..', 'src', 'App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');

const missingRoutes = [];

routes.forEach(route => {
  // Convert routes like "trips/active" to React Router format "<Route path="trips/active""
  const routePattern = new RegExp(`<Route[^>]*\\spath=["']${route.replace(/\//g, '\\/')}["']`);
  
  if (!routePattern.test(appContent)) {
    missingRoutes.push(route);
  }
});

if (missingRoutes.length === 0) {
  console.log('✅ All sidebar routes have corresponding components in App.tsx');
} else {
  console.log('❌ The following routes in the Sidebar do not have corresponding components in App.tsx:');
  missingRoutes.forEach(route => {
    console.log(`  - ${route}`);
  });
}

// Check if there are any placeholder <div> components that need to be replaced
const placeholderRegex = /<Route[^>]*element=\{<div>([^<]+)<\/div>\}/g;
const placeholders = [];

while ((match = placeholderRegex.exec(appContent)) !== null) {
  placeholders.push(match[1]);
}

if (placeholders.length === 0) {
  console.log('✅ All routes use proper components (no placeholder divs)');
} else {
  console.log('⚠️ The following routes are using placeholder <div> components:');
  placeholders.forEach(placeholder => {
    console.log(`  - ${placeholder}`);
  });
}

// Check for any import errors that might indicate missing components
console.log('\nChecking for component imports...');

// Scan all files in the components directory
const componentsDir = path.join(__dirname, '..', 'src', 'components');

function checkComponentDirectory(dir, baseDir = '') {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      checkComponentDirectory(itemPath, path.join(baseDir, item));
    } else if (item.endsWith('.tsx') && !item.includes('test') && !item.includes('stories')) {
      try {
        // Just check if file exists and is readable
        fs.readFileSync(itemPath);
        const relativePath = path.join(baseDir, item);
        console.log(`  ✅ ${relativePath}`);
      } catch (err) {
        console.log(`  ❌ Error reading ${path.join(baseDir, item)}: ${err.message}`);
      }
    }
  });
}

checkComponentDirectory(componentsDir);

console.log('\nValidation complete!');
