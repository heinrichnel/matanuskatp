// diagnose-sidebar-navigation.js
// Comprehensive diagnostic tool for sidebar navigation issues in Matanuska Transport Platform

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Configuration
const SOURCE_DIR = "./src";
const IMPORTANT_DIRS = ["components/layout", "components/navigation", "pages", "routes", "config"];

// Utility functions
const findFiles = (dir, pattern) => {
  if (!fs.existsSync(dir)) return [];

  const results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results.push(...findFiles(filePath, pattern));
    } else if (pattern.test(file)) {
      results.push(filePath);
    }
  }

  return results;
};

const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return "";
  }
};

const checkForRouterUsage = (content) => {
  const patterns = [
    {
      name: "React Router imports",
      pattern:
        /import.*?(?:BrowserRouter|Routes|Route|useNavigate|useLocation|Link).*?from\s+['"]react-router-dom['"]/g,
    },
    { name: "useNavigate hook", pattern: /const\s+\w+\s*=\s*useNavigate\(\)/g },
    { name: "history.push", pattern: /history\.push\(['"]([^'"]+)['"]\)/g },
    { name: "Link component", pattern: /<Link\s+to\s*=\s*['"]([^'"]+)['"]/g },
    { name: "Navigate component", pattern: /<Navigate\s+to\s*=\s*['"]([^'"]+)['"]/g },
    {
      name: "onClick handlers with navigation",
      pattern: /onClick\s*=\s*{\s*\(\)\s*=>\s*(?:navigate|history\.push|router\.push)\(/g,
    },
  ];

  return patterns.map(({ name, pattern }) => {
    const matches = content.match(pattern) || [];
    return { name, matches, found: matches.length > 0 };
  });
};

const analyzeRoutingSystem = () => {
  // Find key routing-related files
  console.log("Analyzing routing system...");

  const routingFiles = {
    routerConfig: findFiles(SOURCE_DIR, /(?:routes|router|navigation)\.tsx?$/i),
    appComponent: findFiles(SOURCE_DIR, /app\.tsx?$/i),
    layoutComponents: findFiles(path.join(SOURCE_DIR, "components/layout"), /\.tsx?$/i),
    navigationComponents: findFiles(SOURCE_DIR, /(?:sidebar|navigation|menu|nav)\.tsx?$/i),
  };

  console.log("Found key routing files:");
  Object.entries(routingFiles).forEach(([type, files]) => {
    console.log(`- ${type}: ${files.length} files found`);
    files.forEach((file) => console.log(`  - ${file}`));
  });

  // Analyze each file for routing patterns
  const routingAnalysis = {};

  for (const [type, files] of Object.entries(routingFiles)) {
    routingAnalysis[type] = [];

    for (const file of files) {
      const content = readFile(file);
      const routerUsage = checkForRouterUsage(content);

      routingAnalysis[type].push({
        file,
        routerUsage,
        hasNavigationLogic: routerUsage.some((item) => item.found),
      });
    }
  }

  return { routingFiles, routingAnalysis };
};

const generateFixSuggestions = (analysis) => {
  const issues = [];
  const fixes = [];

  // Check if we have a React Router setup
  const hasReactRouter = analysis.routingAnalysis.routerConfig.some((file) =>
    file.routerUsage.some((item) => item.name === "React Router imports" && item.found)
  );

  if (!hasReactRouter) {
    issues.push("No React Router setup detected in router configuration files");
    fixes.push(`
# Fix: Set up React Router
1. Install React Router: npm install react-router-dom
2. Update your App.tsx to include BrowserRouter:

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add more routes */}
      </Routes>
    </Router>
  );
}
`);
  }

  // Check navigation components
  const sidebarComponents = analysis.routingAnalysis.navigationComponents;
  const missingNavigationLogic = sidebarComponents.filter((comp) => !comp.hasNavigationLogic);

  if (missingNavigationLogic.length > 0) {
    issues.push(
      `Missing navigation logic in ${missingNavigationLogic.length} sidebar/navigation components`
    );

    missingNavigationLogic.forEach((comp) => {
      fixes.push(`
# Fix navigation in ${path.basename(comp.file)}
1. Import navigation hooks:
   import { useNavigate } from 'react-router-dom';

2. Add navigate hook in component:
   const navigate = useNavigate();

3. Update button click handlers:
   <button onClick={() => navigate('/your-route')}>Menu Item</button>

OR

3. Replace buttons with Link components:
   <Link to="/your-route">Menu Item</Link>
`);
    });
  }

  return { issues, fixes };
};

const main = async () => {
  console.log("==== Matanuska Transport Platform Navigation Diagnostics ====");

  // Analyze the routing system
  const analysis = analyzeRoutingSystem();

  // Generate fix suggestions
  const { issues, fixes } = generateFixSuggestions(analysis);

  // Output results
  console.log("\n==== Diagnostic Results ====");

  if (issues.length === 0) {
    console.log("✅ No major navigation issues detected.");
  } else {
    console.log(`❌ Found ${issues.length} navigation issues:`);
    issues.forEach((issue, i) => console.log(`${i + 1}. ${issue}`));

    console.log("\n==== Recommended Fixes ====");
    fixes.forEach((fix, i) => console.log(`\n--- Fix ${i + 1} ---\n${fix}`));
  }

  // Generate detailed report
  const reportContent = `# Navigation Diagnostic Report
Generated on: ${new Date().toISOString()}

## Issues Found
${issues.length === 0 ? "- No issues found" : issues.map((issue) => `- ${issue}`).join("\n")}

## Recommended Fixes
${fixes.join("\n\n")}

## System Analysis
${JSON.stringify(analysis, null, 2)}
`;

  fs.writeFileSync("navigation-diagnostic-report.md", reportContent, "utf-8");
  console.log("\nDetailed report saved to navigation-diagnostic-report.md");
};

main().catch((err) => {
  console.error("Error diagnosing navigation system:", err);
});
