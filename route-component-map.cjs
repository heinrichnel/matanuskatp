const fs = require("fs");
const path = require("path");

const ROUTES_FILE = path.join(__dirname, "src", "AppRoutes.tsx"); // change to App.tsx if needed
const COMPONENTS_DIR = path.join(__dirname, "src", "components");

const fileContent = fs.readFileSync(ROUTES_FILE, "utf-8");

// Remove all line comments and block comments for safe matching
const noCommentsContent = fileContent.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//gm, "");

// 1. Find all Route definitions of form: <Route path="..." element={<Component ... />} />
const routeRegex = /<Route\s+[^>]*path=["']([^"']+)["'][^>]*element=\{<([A-Za-z0-9_]+)[^>]*>\}/gms;

let match;
let routeMap = [];
let componentsUsed = new Set();
let redirects = [];
let catchalls = [];

while ((match = routeRegex.exec(noCommentsContent)) !== null) {
  const routePath = match[1];
  const compName = match[2];
  if (/^Navigate$/i.test(compName)) {
    redirects.push({ path: routePath, comp: compName });
  } else if (/^\*$/.test(routePath)) {
    catchalls.push({ path: routePath, comp: compName });
  } else {
    routeMap.push({ path: routePath, comp: compName });
    componentsUsed.add(compName);
  }
}

// 2. Parse all import statements to try to resolve component file paths
const importRegex = /import\s+([A-Za-z0-9_,{}\s]+)\s+from\s+['"]([^'"]+)['"]/g;
let importMatch;
let importMap = {};
while ((importMatch = importRegex.exec(noCommentsContent)) !== null) {
  // Handles both: import X from '...'  and  import { X, Y } from '...'
  const names = importMatch[1].replace(/[{}\s]/g, "").split(",");
  const importPath = importMatch[2];
  names.forEach((n) => {
    if (n) importMap[n] = importPath;
  });
}

// 3. Scan /src/components for all .tsx files
function findAllComponentFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(findAllComponentFiles(fullPath));
    } else if (/\.(tsx?|js|jsx)$/.test(fullPath)) {
      results.push(fullPath);
    }
  });
  return results;
}
const allComponentFiles = findAllComponentFiles(COMPONENTS_DIR);
const allComponentNames = allComponentFiles.map((f) => path.basename(f, path.extname(f)));

// 4. Print summary
console.log("\n=== ROUTE to COMPONENT MAP ===");
routeMap.forEach(({ path, comp }) => {
  let found = allComponentNames.includes(comp);
  let imported = importMap[comp] ? `(imported from "${importMap[comp]}")` : "(not imported)";
  let fileLoc = found
    ? allComponentFiles[allComponentNames.indexOf(comp)].replace(__dirname + path.sep, "")
    : "(missing in /src/components)";
  console.log(`  /${path}  ➔  ${comp}   ${imported}   ${fileLoc}`);
});
if (redirects.length) {
  redirects.forEach(({ path }) => console.log(`  /${path}  ➔  Navigate (redirect)`));
}
if (catchalls.length) {
  catchalls.forEach(({ path, comp }) => console.log(`  /* (catchall) ➔  ${comp}`));
}
if (!routeMap.length && !redirects.length && !catchalls.length) {
  console.log("  (No <Route path=... element={<... />} /> entries found!)");
}

// 5. Components used but not found in /src/components
const missing = Array.from(componentsUsed).filter((comp) => !allComponentNames.includes(comp));
if (missing.length) {
  console.log("\n=== COMPONENTS USED BUT NOT FOUND IN /src/components ===");
  missing.forEach((comp) => console.log("  -", comp));
}

// 6. Summary
console.log("\n--- SUMMARY ---");
console.log("Total routes:", routeMap.length);
console.log("Total redirects:", redirects.length);
console.log("Total catchalls:", catchalls.length);
console.log("Unique components referenced:", componentsUsed.size);
console.log("Missing components:", missing.length);
console.log("Scanned component files:", allComponentFiles.length);
console.log("\nDone.\n");
