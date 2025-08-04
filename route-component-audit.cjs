const fs = require("fs");
const path = require("path");

// --------- CONFIGURATION ---------
// Adjust these as needed for your codebase
const SRC_ROOT = path.join(__dirname, "src");
const ROUTES_FILE = path.join(SRC_ROOT, "AppRoutes.tsx"); // Or App.tsx
const COMPONENTS_DIR = path.join(SRC_ROOT, "components");
// Add more folders if you use different component folders
const COMPONENT_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];

// --------- STEP 1: READ ROUTES FILE ---------
if (!fs.existsSync(ROUTES_FILE)) {
  console.error(`[ERROR] File not found: ${ROUTES_FILE}`);
  process.exit(1);
}
const content = fs.readFileSync(ROUTES_FILE, "utf-8");

// --------- STEP 2: PARSE ROUTES ---------
// Match <Route ... element={<Component ... />} />
const routeRegex = /<Route\s+[^>]*path=["']([^"']+)["'][^>]*element=\{<([A-Za-z0-9_]+)[^>]*>\}/gms;
let match;
let routes = [];
while ((match = routeRegex.exec(content)) !== null) {
  routes.push({
    path: match[1],
    component: match[2],
  });
}

// --------- STEP 3: FIND COMPONENT FILES ---------
function findComponentFile(componentName) {
  let files = [];
  function search(dir) {
    fs.readdirSync(dir).forEach((file) => {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) search(full);
      else if (COMPONENT_EXTENSIONS.some((ext) => file === componentName + ext)) files.push(full);
    });
  }
  search(COMPONENTS_DIR);
  return files[0] || null;
}

// --------- STEP 4: AUDIT ROUTE COMPONENTS ---------
console.log("\n=== ROUTE to COMPONENT AUDIT ===");
let missing = [];
routes.forEach((r) => {
  const found = findComponentFile(r.component);
  if (!found) {
    console.log(`  [MISSING] /${r.path}  ➔  ${r.component}   ✗ Component file NOT found!`);
    missing.push(r.component);
  } else {
    console.log(
      `  [OK]      /${r.path}  ➔  ${r.component}   (${found.replace(SRC_ROOT + "/", "")})`
    );
  }
});

console.log("\n--- SUMMARY ---");
console.log(`Total routes: ${routes.length}`);
console.log(`Missing components: ${missing.length}`);
if (missing.length) {
  console.log("Missing components:");
  missing.forEach((c) => console.log("  -", c));
} else {
  console.log("No missing components!");
}
console.log("\nDone.");
