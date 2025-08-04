#!/usr/bin/env node

/**
 * Sidebar Navigation Test Tool (CJS Version)
 * Run: node test-sidebar-navigation.cjs
 */

const fs = require("fs");
const path = require("path");

// Path to the Sidebar file
const sidebarPath = path.join(__dirname, "src", "components", "layout", "Sidebar.tsx");

// 1. Check if the Sidebar component exists
if (!fs.existsSync(sidebarPath)) {
  console.error("\x1b[31mError: Sidebar component not found at:\n" + sidebarPath + "\x1b[0m");
  process.exit(1);
}

// 2. Read the Sidebar source code
const sidebarContent = fs.readFileSync(sidebarPath, "utf8");

// 3. Check for onNavigate prop definition in the component props interface
const propOk =
  /onNavigate\s*:\s*\(\s*route\s*:\s*string\s*\)\s*=>\s*void/.test(sidebarContent) ||
  /onNavigate\s*[,}]/.test(sidebarContent);
if (!propOk) {
  console.error("\x1b[31mError: onNavigate prop is NOT defined in Sidebar props!\x1b[0m");
  process.exit(1);
}

// 4. Check that onNavigate is actually used in the file
if (!sidebarContent.includes("onNavigate(") && !sidebarContent.includes("onNavigate(")) {
  console.error("\x1b[31mError: onNavigate prop is not used in the Sidebar component!\x1b[0m");
  process.exit(1);
}

// 5. Check for undefined onClick handlers
if (
  sidebarContent.includes("onClick={onClick}") ||
  sidebarContent.includes("onClick={onClick || (")
) {
  console.error(
    "\x1b[31mError: Found potentially undefined onClick handler in Sidebar component!\x1b[0m"
  );
  process.exit(1);
}

// 6. Find <button> tags and ensure all that are for navigation have an onClick handler
const buttonRegex = /<button([^>]+)>/g;
let match;
let buttonNum = 0;
let missing = [];

while ((match = buttonRegex.exec(sidebarContent)) !== null) {
  buttonNum++;
  const btnAttrs = match[1];
  // Allow buttons that have onClick, or aria-label for expand/collapse (ignore those)
  const isCollapseBtn = btnAttrs.includes("aria-label") || btnAttrs.includes("toggleExpand");
  if (!btnAttrs.includes("onClick=") && !isCollapseBtn) {
    missing.push(`Button ${buttonNum}: <button${btnAttrs}>...</button>`);
  }
}

if (missing.length > 0) {
  console.error(
    "\x1b[31mError: Found buttons without onClick handlers in Sidebar component!\x1b[0m"
  );
  missing.forEach((btn, i) => {
    console.error(`\x1b[33m${btn.substring(0, 80)}\x1b[0m`);
  });
  process.exit(1);
}

// 7. All checks passed
console.log("\x1b[32mSidebar Navigation Test: All checks passed!\x1b[0m");
console.log("\x1b[32m✓\x1b[0m onNavigate prop is defined and used");
console.log("\x1b[32m✓\x1b[0m All navigation buttons have onClick handlers");
console.log("\x1b[32m✓\x1b[0m No undefined onClick references");
console.log("\n\x1b[34mSidebar is ready for deployment!\x1b[0m");
