/**
 * Adds JSDoc comments to React components in a directory.
 * Now supports interface, type, function, and arrow function components.
 *
 * Usage:
 *   node add-jsdoc-comments.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ESM __dirname polyfill
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateComponentJSDoc(componentName, props, description) {
  let jsDoc = `/**\n * ${componentName}\n *\n * ${description}\n *\n`;

  jsDoc += ` * @example\n * \`\`\`tsx\n * <${componentName}`;
  if (Object.keys(props).length > 0) {
    Object.entries(props).forEach(([propName, propInfo]) => {
      if (propInfo.type === "string") jsDoc += ` ${propName}="example"`;
      else if (propInfo.type === "number") jsDoc += ` ${propName}={42}`;
      else if (propInfo.type === "boolean") jsDoc += ` ${propName}={true}`;
      else if (propInfo.type === "function") jsDoc += ` ${propName}={() => {}}`;
      else if (propInfo.type === "ReactNode" && propName !== "children")
        jsDoc += ` ${propName}={<div />}`;
    });
    if (props.children) {
      jsDoc += `>\n *   Content\n * </${componentName}>\n * \`\`\`\n *\n`;
    } else {
      jsDoc += ` />\n * \`\`\`\n *\n`;
    }
    jsDoc += ` * @param props - Component props\n`;
    Object.entries(props).forEach(([propName, propInfo]) => {
      jsDoc += ` * @param props.${propName} - ${propInfo.description}\n`;
    });
  } else {
    jsDoc += ` />\n * \`\`\`\n *\n`;
    jsDoc += ` * @param props - Component props\n`;
  }
  jsDoc += ` * @returns React component\n */\n`;

  return jsDoc;
}

function extractProps(content, propsName) {
  const props = {};
  // Match interface OR type
  const interfaceRegex = new RegExp(`(?:interface|type)\\s+${propsName}\\s*(=|{)\\s*([^}]*)}`, "s");
  const interfaceMatch = content.match(interfaceRegex);

  if (!interfaceMatch) return props;
  const interfaceContent = interfaceMatch[2] || "";

  const propRegex = /(\w+)(\?)?:\s*([^;|,]+)[;,]?(?:\s*\/\/\s*(.*))?/g;
  let match;
  while ((match = propRegex.exec(interfaceContent)) !== null) {
    const propName = match[1];
    const isOptional = !!match[2];
    const propType = match[3].trim();
    const propComment = match[4] ? match[4].trim() : `${propName} of the component`;

    let type = "any";
    if (propType.includes("string")) type = "string";
    else if (propType.includes("number")) type = "number";
    else if (propType.includes("boolean")) type = "boolean";
    else if (propType.includes("() =>") || propType.includes("Function")) type = "function";
    else if (propType.includes("ReactNode")) type = "ReactNode";

    props[propName] = { type, isOptional, description: propComment };
  }
  return props;
}

function findComponentDefinition(content, componentName) {
  // Accepts: forwardRef, function, arrow, React.FC
  const patterns = [
    new RegExp(`(const\\s+${componentName}\\s*=\\s*React\\.forwardRef)`, "g"),
    new RegExp(`(const\\s+${componentName}\\s*:\\s*React\\.FC<[^>]+>\\s*=)`, "g"),
    new RegExp(`(function\\s+${componentName}\\s*\\()`, "g"),
    new RegExp(`(const\\s+${componentName}\\s*=\\s*\\()`, "g"),
    new RegExp(`(const\\s+${componentName}\\s*=\\s*async\\s*\\()`, "g"),
  ];
  for (const pat of patterns) {
    const match = pat.exec(content);
    if (match) return match[0];
  }
  return null;
}

function findPropsName(content, componentName) {
  // Try to infer the props type/interface name
  // Look for interface or type declarations that match `${componentName}Props` first
  let candidates = [
    `${componentName}Props`,
    "Props", // fallback for very generic naming
  ];
  for (let name of candidates) {
    if (content.match(new RegExp(`(?:interface|type)\\s+${name}\\s*[={]`))) {
      return name;
    }
  }
  // Try to infer from function signature
  // function Card(props: CardProps)
  const fnRegex = new RegExp(`${componentName}\\s*(?:\\:|\\()\\s*([^,)]+)`, "m");
  const fnMatch = fnRegex.exec(content);
  if (fnMatch) {
    // If match contains "props: SomeProps"
    const parts = fnMatch[1].split(":");
    if (parts.length === 2) return parts[1].trim();
  }
  return null;
}

function addJSDocToComponent(filePath, componentName, description) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, "utf8");
  if (content.includes(`/**\n * ${componentName}`)) {
    console.log(`JSDoc already exists for ${componentName}`);
    return false;
  }

  const propsName = findPropsName(content, componentName);
  let props = {};
  if (propsName) {
    props = extractProps(content, propsName);
  }

  const def = findComponentDefinition(content, componentName);
  if (!def) {
    // Fallback: Try to match default export function or arrow
    const fallbackFn = new RegExp(
      `(export\\s+default\\s+function\\s+${componentName}\\s*\\()`,
      "g"
    );
    if (fallbackFn.exec(content)) {
      content = content.replace(
        fallbackFn,
        (match) => `${generateComponentJSDoc(componentName, props, description)}${match}`
      );
      fs.writeFileSync(filePath, content);
      console.log(`Added minimal JSDoc to ${componentName}`);
      return true;
    }
    console.log(`Component definition not found for ${componentName}`);
    return false;
  }

  content = content.replace(
    def,
    `${generateComponentJSDoc(componentName, props, description)}${def}`
  );
  fs.writeFileSync(filePath, content);
  console.log(`Added JSDoc to ${componentName}`);
  return true;
}

function addJSDocToDirectory(dirPath, componentDescriptions) {
  if (!fs.existsSync(dirPath)) {
    console.error(`Directory not found: ${dirPath}`);
    return 0;
  }

  const files = fs.readdirSync(dirPath);
  let updatedCount = 0;
  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      updatedCount += addJSDocToDirectory(filePath, componentDescriptions);
    } else if (file.endsWith(".tsx") || file.endsWith(".jsx")) {
      const componentName = file.replace(/\.(tsx|jsx)$/, "");
      if (!/^[A-Z]/.test(componentName)) return; // Only PascalCase

      const description = componentDescriptions[componentName] || `A ${componentName} component`;

      if (addJSDocToComponent(filePath, componentName, description)) {
        updatedCount++;
      }
    }
  });
  return updatedCount;
}

// ---- Usage ----

const componentDescriptions = {
  Button: "A customizable button component with various variants and sizes",
  Card: "A versatile card component with various styling options and subcomponents",
  Modal: "A modal dialog component for displaying content in a layer above the page",
  // Add more as needed
};

const uiComponentsDir = path.join(__dirname, "src", "components", "ui");
console.log(`Adding JSDoc comments to components in ${uiComponentsDir}...`);
const updatedCount = addJSDocToDirectory(uiComponentsDir, componentDescriptions);
console.log(`Added JSDoc comments to ${updatedCount} components`);

console.log("\nNext steps:");
console.log("1. Review the added JSDoc comments and make any necessary adjustments");
console.log("2. Add more detailed descriptions and examples as needed");
console.log("3. Run the application to verify that the JSDoc comments are correct");
