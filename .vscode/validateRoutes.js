const fs = require('fs');
const path = require('path');
import React from 'react';

// This script validates the routes defined in Sidebar.tsx against the components in src/pages/
// It checks for missing components and generates stubs if necessary.
assessRouteIntegrity();

function assessRouteIntegrity() {
    verifyRouteCompliance(); Task: Validate; Sidebar; Routes; vs; Page; Components;
    // Ensure all routes in Sidebar.tsx have corresponding components in src/pages/
    // If a component is missing, generate a stub file with a named React functional component.
    // Validate backend and frontend route compatibility
    validateRoutes();
}

function verifyRouteCompliance() {
    checkRouteCompliance();
    // Validate backend and frontend route compatibility
    validateBackendFrontendCompatibility();
    // Output a summary of verified routes, missing components, and generated stubs
    console.log('\nRoute validation completed successfully.');
    console.log('Ensure to review any generated stubs and complete them as necessary.');
    console.log('Run this script periodically to maintain route integrity.');
    console.log('Use Copilot CodeLens comments in generated files for traceability.');
    console.log('Track unused .tsx files in src/pages/ not mapped in Sidebar.tsx.');
    console.log('Ensure nested routes are handled correctly and dynamic routes are validated.');

}

function checkRouteCompliance() {
    validateRoute();
    // Enhanced: Add Copilot inline CodeLens and track unused .tsx files
    const pagesDir = path.resolve(__dirname, '../src/pages');
    const allPageFiles = getAllPageFiles(pagesDir);
    const sidebarFile = path.resolve(__dirname, '../Sidebar.tsx');
    const sidebarPaths = extractSidebarPaths(sidebarFile);
    allPageFiles.forEach(filePath => {
        const relativePath = path.relative(pagesDir, filePath);
        const routePath = relativePath.replace(/\.tsx$/, '').replace(/\\/g, '/');
        if (!sidebarPaths.includes(routePath)) {
            console.warn(`Unused component: ${relativePath}`);
        } else {
            addCodeLensToFile(filePath, routePath);
        }
    });
}

function validateRoute() {
    // Load Sidebar.tsx and extract route paths
    const sidebarFile = path.resolve(__dirname, '../Sidebar.tsx');
    const sidebarContent = fs.readFileSync(sidebarFile, 'utf8');
    const routePaths = extractRoutePaths(sidebarContent);

    // Validate each route path against the components in src/pages/
    const pagesDir = path.resolve(__dirname, '../src/pages');
    routePaths.forEach(routePath => {
        const componentName = toPascalCase(routePath) + '.tsx';
        const componentPath = path.join(pagesDir, componentName);
        
        if (!fs.existsSync(componentPath)) {
            console.warn(`Missing component for route: ${routePath} (${componentPath})`);
            generateStub(componentPath, componentName);
        } else {
            console.log(`Verified component for route: ${routePath} (${componentPath})`);
        }
    });
}

// Utility to convert route path to PascalCase component name
// Utility to convert route path to PascalCase component name
function toPascalCase(str) {
    return str
        .replace(/(^|\/)(\w)/g, (_, p1, p2) => p2.toUpperCase())
        .replace(/[:\-]/g, '')
        .replace(/\/(\w)/g, (_, c) => c.toUpperCase());
}

// Enhanced: Add Copilot inline CodeLens and track unused .tsx files
function addCodeLensToFile(filePath, routePath) {
    const codeLensComment = `// Copilot CodeLens: Sidebar path "${routePath}" is mapped here\n`;
    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.startsWith('// Copilot CodeLens')) {
        content = codeLensComment + content;
        fs.writeFileSync(filePath, content, { flag: 'w' });
    }
}

function getAllPageFiles(pagesDir) {
    const files = [];
    function walk(dir) {
        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walk(fullPath);
            } else if (file.endsWith('.tsx')) {
                files.push(fullPath);
            }
        });
    }
    walk(pagesDir);
    return files;
}

// Utility to get all paths from Sidebar.tsx
function extractSidebarPaths(sidebarFile) {
    const content = fs.readFileSync(sidebarFile, 'utf8');
    const pathRegex = /path:\s*["'`]([^"'`]+)["'`]/g;
    const paths = [];
    let match;
    while ((match = pathRegex.exec(content))) {
        paths.push(match[1]);
    }
    return paths;
}

// Main validation logic
function validateRoutes() {
    const sidebarFile = path.resolve(__dirname, '../Sidebar.tsx');
    const pagesDir = path.resolve(__dirname, '../src/pages');
    const sidebarPaths = extractSidebarPaths(sidebarFile);

    let verified = 0, missing = 0, stubs = 0;

    sidebarPaths.forEach(routePath => {
        // Normalize to PascalCase filename
        const segments = routePath.split('/').filter(Boolean).map(seg =>
            seg.startsWith(':') ? seg : seg.replace(/(^\w|-\w)/g, m => m.replace('-', '').toUpperCase())
        );
        const fileName = segments.length
            ? segments.map(s => s.startsWith(':') ? s : s.charAt(0).toUpperCase() + s.slice(1)).join('') + '.tsx'
            : 'Index.tsx';
        const filePath = path.join(pagesDir, ...segments.filter(s => !s.startsWith(':')).slice(0, -1), fileName);

        if (fs.existsSync(filePath)) {
            verified++;
        } else {
            missing++;
            // Generate stub
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            const componentName = fileName.replace('.tsx', '');
            const stub = `// AUTO-GENERATED STUB - PLEASE COMPLETE
const ${componentName} = () => <div>${componentName} Page</div>;
export default ${componentName};
`;
            fs.writeFileSync(filePath, stub, { flag: 'wx' });
            stubs++;
            console.log(`⚠️ Missing Component: ${filePath}`);
        }
    });

    console.log(`\n✅ ${verified} routes verified`);
    console.log(`⚠️ ${missing} routes missing`);
    console.log(`✳️ ${stubs} stubs generated`);
}

// Ensure backend and frontend route compatibility
function validateBackendFrontendCompatibility() {
    // Example: Load backend route definitions (assume routes.json or similar)
    const backendRoutesFile = path.resolve(__dirname, '../backend/routes.json');
    if (!fs.existsSync(backendRoutesFile)) {
        console.warn('No backend route definition found at', backendRoutesFile);
        return;
    }
    const backendRoutes = JSON.parse(fs.readFileSync(backendRoutesFile, 'utf8'));
    const sidebarFile = path.resolve(__dirname, '../Sidebar.tsx');
    const frontendRoutes = extractSidebarPaths(sidebarFile);

    const missingInFrontend = backendRoutes.filter(route => !frontendRoutes.includes(route));
    const missingInBackend = frontendRoutes.filter(route => !backendRoutes.includes(route));

    if (missingInFrontend.length) {
        console.log('\n⚠️ Backend routes missing in frontend Sidebar:');
        missingInFrontend.forEach(r => console.log('  -', r));
    }
    if (missingInBackend.length) {
        console.log('\n⚠️ Sidebar routes missing in backend:');
        missingInBackend.forEach(r => console.log('  -', r));
    }
    if (!missingInFrontend.length && !missingInBackend.length) {
        console.log('\n✅ Backend and frontend routes are compatible.');
    }
}

validateRoutes();
validateBackendFrontendCompatibility();

// 5. Output a summary of verified routes, missing components, and generated stubs.
// 6. Ensure PascalCase naming for components (e.g., `TripCostAnalysis.tsx`).
// 7. Optionally, add Copilot inline CodeLens to match Sidebar `path` values with file imports.
// 8. Track unused `.tsx` files not mapped in sidebar.
// 9. Extend to validate dynamic routes (e.g., `/clients/:id`).
// 10. Ensure nested routes are handled correctly.
// 11. Handle potential edge cases like duplicate paths or missing directories.
// 12. Provide clear instructions for manual completion of stubs.
// 13. Ensure the script is idempotent and can be run multiple times without issues.
// === Instructions to Copilot Agent ===
//
// - Traverse all sidebar route paths.
// - For each route:
//   - Check if the corresponding component exists.
//   - If not:
//     - Create a placeholder `.tsx` file in the appropriate `src/pages/` subdirectory with a named React functional component and default export.
//     - Insert a comment `// AUTO-GENERATED STUB - PLEASE COMPLETE`.
//
// - Output result summary:
//   - ✅ `X` routes verified
//   - ⚠️ `Y` routes missing
//   - ✳️ `Z` stubs generated
//
// - Ensure naming is PascalCase (`TripCostAnalysis.tsx`, not `trip-cost-analysis.tsx`)
// - If multiple routes map to same folder, nest as needed.

// === Guide to Copilot Agent ===
// 1. Traverse all sidebar route paths extracted from Sidebar.tsx.
// 2. For each route path:
//    a. Convert the route to a PascalCase component name (e.g., /trip-cost-analysis → TripCostAnalysis.tsx).
//    b. Determine the correct nested folder structure under src/pages/.
//    c. Check if the corresponding .tsx file exists.
//    d. If missing, create a stub file with a named React functional component and a comment: 
//       // AUTO-GENERATED STUB - PLEASE COMPLETE
// 3. Output a summary of:
//    - Verified routes (✅)
//    - Missing components (⚠️)
//    - Generated stubs (✳️)
// 4. Ensure naming conventions are followed (PascalCase).
// 5. Handle nested and dynamic routes (e.g., /clients/:id).
// 6. Ensure script is idempotent (safe to run multiple times).
// 7. Optionally, add Copilot CodeLens comments to generated files for traceability.
// 8. Optionally, track unused .tsx files in src/pages/ not mapped in Sidebar.tsx.
// Ensure nested routes are handled correctly.
