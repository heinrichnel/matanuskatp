// fix-sidebar-click-handlers.js
// Script to fix the onClick handlers in the sidebar to properly navigate to different routes

const fs = require("fs");
const path = require("path");

// Find the Sidebar component file
const findSidebarFile = () => {
  const baseDirs = [
    "./src/components/layout",
    "./src/components/navigation",
    "./src/layout",
    "./src/components",
  ];

  for (const dir of baseDirs) {
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir);
    const sidebarFile = files.find(
      (file) =>
        file.toLowerCase().includes("sidebar") && (file.endsWith(".tsx") || file.endsWith(".jsx"))
    );

    if (sidebarFile) {
      return path.join(dir, sidebarFile);
    }
  }

  return null;
};

// Function to fix the sidebar component
const fixSidebarComponent = (filePath) => {
  console.log(`Analyzing ${filePath}...`);

  // Read the file content
  const content = fs.readFileSync(filePath, "utf-8");

  // Check if the file already uses proper navigation
  if (content.includes("useNavigate") || content.includes("Link to=")) {
    console.log("File already appears to have proper navigation. No changes needed.");
    return false;
  }

  // Check if we need to add React Router imports
  let updatedContent = content;

  // Add necessary imports if they don't exist
  if (!content.includes("react-router-dom")) {
    const importStatements = content.match(/import.*?from.*?;/gs) || [];
    const lastImport = importStatements[importStatements.length - 1];

    if (lastImport) {
      const importIndex = content.indexOf(lastImport) + lastImport.length;
      updatedContent =
        content.slice(0, importIndex) +
        '\nimport { useNavigate } from "react-router-dom";' +
        content.slice(importIndex);
    }
  }

  // Check the component structure
  const componentMatch = updatedContent.match(/(?:const|function)\s+(\w+)\s*(?:=|:|\().*?{/);

  if (!componentMatch) {
    console.log("Could not identify the component structure. Manual fixes required.");
    return false;
  }

  // Add useNavigate hook to the component
  const componentName = componentMatch[1];
  const componentStart = updatedContent.indexOf("{", updatedContent.indexOf(componentName));

  // Insert navigate hook
  if (componentStart !== -1) {
    updatedContent =
      updatedContent.slice(0, componentStart + 1) +
      "\n  const navigate = useNavigate();" +
      updatedContent.slice(componentStart + 1);
  }

  // Fix onClick handlers
  // Look for button elements with onClick handlers
  const buttonPattern = /<button[^>]*onClick\s*=\s*{([^}]+)}/g;
  updatedContent = updatedContent.replace(buttonPattern, (match, clickHandler) => {
    // If the handler is already using navigate, don't change it
    if (clickHandler.includes("navigate")) {
      return match;
    }

    // Check if this button already has a route defined
    const routeMatch = match.match(/data-route\s*=\s*["']([^"']+)["']/);

    if (routeMatch) {
      const route = routeMatch[1];
      return match.replace(
        `onClick={${clickHandler}}`,
        `onClick={() => { ${clickHandler}; navigate('${route}'); }}`
      );
    }

    // If there's no obvious route, use the label if available
    const labelMatch = match.match(/>\s*([^<]+)\s*<\/button>/);
    if (labelMatch) {
      const label = labelMatch[1].trim().toLowerCase().replace(/\s+/g, "-");
      return match.replace(
        `onClick={${clickHandler}}`,
        `onClick={() => { ${clickHandler}; navigate('/${label}'); }}`
      );
    }

    // Otherwise, just keep the original handler
    return match;
  });

  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent, "utf-8");
  console.log(`Updated ${filePath} with proper navigation handlers.`);

  return true;
};

// Main function
const main = async () => {
  console.log("Looking for sidebar component...");

  const sidebarFile = findSidebarFile();

  if (!sidebarFile) {
    console.error("ERROR: Could not find sidebar component file");
    return;
  }

  console.log(`Found sidebar component at: ${sidebarFile}`);

  // Create backup of the file
  const backupPath = `${sidebarFile}.bak`;
  fs.copyFileSync(sidebarFile, backupPath);
  console.log(`Created backup at: ${backupPath}`);

  // Fix the sidebar component
  const updated = fixSidebarComponent(sidebarFile);

  if (updated) {
    console.log("Successfully updated sidebar component with proper navigation.");
    console.log("Please test the navigation to verify it works correctly.");
    console.log(`If there are issues, you can restore the backup from: ${backupPath}`);
  } else {
    console.log("No changes were made to the sidebar component.");
  }
};

main().catch((err) => {
  console.error("Error fixing sidebar navigation:", err);
});
