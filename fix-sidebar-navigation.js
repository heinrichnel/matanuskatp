// fix-sidebar-navigation.js
// Script to analyze and fix sidebar navigation issues in the Matanuska Transport Platform

const fs = require("fs");
const path = require("path");

// Find the main sidebar component file
const findSidebarFile = () => {
  const basePath = "./src/components/layout";
  const potentialFiles = ["Sidebar.tsx", "SidebarNav.tsx", "Navigation.tsx"];

  for (const file of potentialFiles) {
    const filePath = path.join(basePath, file);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
};

// Find the routes configuration file
const findRoutesConfig = () => {
  const basePath = "./src/config";
  const potentialFiles = ["sidebarConfig.ts", "routes.ts", "navigation.ts"];

  for (const file of potentialFiles) {
    const filePath = path.join(basePath, file);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  return null;
};

const main = async () => {
  console.log("Analyzing sidebar navigation issues...");

  // Find important files
  const sidebarFile = findSidebarFile();
  const routesConfigFile = findRoutesConfig();

  if (!sidebarFile) {
    console.error("ERROR: Could not find sidebar component file");
    return;
  }

  if (!routesConfigFile) {
    console.error("ERROR: Could not find routes configuration file");
    return;
  }

  console.log(`Found sidebar component at: ${sidebarFile}`);
  console.log(`Found routes config at: ${routesConfigFile}`);

  // Read sidebar component file
  const sidebarContent = fs.readFileSync(sidebarFile, "utf-8");

  // Check for common navigation issues
  const issues = [];

  // Check for missing navigation handler
  if (!sidebarContent.includes("useNavigate") && !sidebarContent.includes("history.push")) {
    issues.push("Missing React Router navigation hook (useNavigate or history)");
  }

  // Check for proper click handlers on buttons
  const hasProperOnClick =
    sidebarContent.includes("onClick={() =>") ||
    sidebarContent.includes("onClick={handleClick") ||
    sidebarContent.includes("onClick={onNavigate");

  if (!hasProperOnClick) {
    issues.push("Missing or improperly implemented onClick handlers on navigation buttons");
  }

  // Check for Link components
  const hasLinkComponents =
    sidebarContent.includes("<Link") ||
    sidebarContent.includes("Link to=") ||
    sidebarContent.includes("LinkComponent");

  // Output analysis
  console.log("\n=== Navigation Analysis ===");

  if (issues.length === 0 && hasLinkComponents) {
    console.log(
      "✅ No major navigation issues detected. Sidebar appears to be using Link components correctly."
    );
    return;
  }

  console.log("Issues found:");
  issues.forEach((issue) => console.log(`❌ ${issue}`));

  if (!hasLinkComponents) {
    console.log("⚠️ No React Router Link components found, which may indicate navigation issues");
  }

  // Generate potential fix
  console.log("\n=== Suggested Fix ===");
  console.log("The sidebar component should be updated to use proper navigation techniques:");
  console.log("1. Add import for useNavigate from react-router-dom");
  console.log("2. Initialize navigate function with useNavigate() hook");
  console.log("3. Update button click handlers to call navigate() with proper route paths");
  console.log("\nExample implementation:");

  console.log(`
import { useNavigate } from 'react-router-dom';
// Other imports...

const Sidebar = ({ /* props */ }) => {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    // Sidebar structure...
    <button onClick={() => handleNavigation('/dashboard')}>Dashboard</button>
    // Other navigation buttons...
  );
};
  `);

  console.log("\nAlternatively, consider replacing buttons with Link components:");
  console.log(`
import { Link } from 'react-router-dom';
// Other imports...

const Sidebar = ({ /* props */ }) => {
  return (
    // Sidebar structure...
    <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
    // Other navigation links...
  );
};
  `);
};

main().catch((err) => {
  console.error("Error analyzing sidebar navigation:", err);
});
