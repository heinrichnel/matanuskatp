// @ts-nocheck
/**
 * This script adds JSDoc comments to React components.
 * It analyzes the component file and adds appropriate JSDoc comments
 * based on the component's props and structure.
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate JSDoc comment for a component
 * @param {string} componentName - Name of the component
 * @param {Object} props - Component props
 * @param {string} description - Component description
 * @returns {string} JSDoc comment
 */
function generateComponentJSDoc(componentName, props, description) {
  let jsDoc = `/**\n * ${componentName}\n *\n * ${description}\n *\n`;

  // Add example usage
  jsDoc += ` * @example\n * \`\`\`tsx\n * <${componentName}`;

  // Add example props
  Object.entries(props).forEach(([propName, propInfo]) => {
    if (propInfo.type === 'string') {
      jsDoc += ` ${propName}="example"`;
    } else if (propInfo.type === 'number') {
      jsDoc += ` ${propName}={42}`;
    } else if (propInfo.type === 'boolean') {
      jsDoc += ` ${propName}={true}`;
    } else if (propInfo.type === 'function') {
      jsDoc += ` ${propName}={() => {}}`;
    } else if (propInfo.type === 'ReactNode') {
      // Skip children prop in the attributes
      if (propName !== 'children') {
        jsDoc += ` ${propName}={<div />}`;
      }
    }
  });

  // Add children if present
  if (props.children) {
    jsDoc += `>\n *   Content\n * </${componentName}>\n * \`\`\`\n *\n`;
  } else {
    jsDoc += ` />\n * \`\`\`\n *\n`;
  }

  // Add params
  jsDoc += ` * @param props - Component props\n`;
  Object.entries(props).forEach(([propName, propInfo]) => {
    jsDoc += ` * @param props.${propName} - ${propInfo.description}\n`;
  });

  // Add return
  jsDoc += ` * @returns React component\n */\n`;

  return jsDoc;
}

/**
 * Extract props from interface or type definition
 * @param {string} content - File content
 * @param {string} interfaceName - Name of the interface
 * @returns {Object} Props object
 */
function extractProps(content, interfaceName) {
  const props = {};

  // Find the interface definition
  const interfaceRegex = new RegExp(`interface\\s+${interfaceName}\\s*{([^}]*)}`, 's');
  const interfaceMatch = content.match(interfaceRegex);

  if (!interfaceMatch) return props;

  const interfaceContent = interfaceMatch[1];

  // Extract props
  const propRegex = /(\w+)(\?)?:\s*([^;]+);(?:\s*\/\/\s*(.*))?/g;
  let match;

  while ((match = propRegex.exec(interfaceContent)) !== null) {
    const propName = match[1];
    const isOptional = !!match[2];
    const propType = match[3].trim();
    const propComment = match[4] ? match[4].trim() : `${propName} of the component`;

    let type = 'any';
    if (propType.includes('string')) {
      type = 'string';
    } else if (propType.includes('number')) {
      type = 'number';
    } else if (propType.includes('boolean')) {
      type = 'boolean';
    } else if (propType.includes('() =>') || propType.includes('Function')) {
      type = 'function';
    } else if (propType.includes('ReactNode')) {
      type = 'ReactNode';
    }

    props[propName] = {
      type,
      isOptional,
      description: propComment
    };
  }

  return props;
}

/**
 * Add JSDoc comments to a component file
 * @param {string} filePath - Path to the component file
 * @param {string} componentName - Name of the component
 * @param {string} description - Component description
 * @returns {boolean} Success status
 */
function addJSDocToComponent(filePath, componentName, description) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Check if JSDoc already exists
  if (content.includes(`/**\n * ${componentName}`)) {
    console.log(`JSDoc already exists for ${componentName}`);
    return false;
  }

  // Find the props interface name
  const propsInterfaceRegex = new RegExp(`interface\\s+(${componentName}Props)\\s*{`, 'g');
  const propsInterfaceMatch = propsInterfaceRegex.exec(content);

  if (!propsInterfaceMatch) {
    console.log(`No props interface found for ${componentName}`);
    return false;
  }

  const propsInterfaceName = propsInterfaceMatch[1];
  const props = extractProps(content, propsInterfaceName);

  // Generate JSDoc
  const jsDoc = generateComponentJSDoc(componentName, props, description);

  // Find the component definition
  const componentRegex = new RegExp(`(const\\s+${componentName}\\s*=\\s*React\\.forwardRef)`, 'g');
  const componentMatch = componentRegex.exec(content);

  if (!componentMatch) {
    console.log(`Component definition not found for ${componentName}`);
    return false;
  }

  // Insert JSDoc before component definition
  const updatedContent = content.replace(
    componentMatch[0],
    `${jsDoc}${componentMatch[0]}`
  );

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added JSDoc to ${componentName}`);
  return true;
}

/**
 * Add JSDoc comments to all components in a directory
 * @param {string} dirPath - Path to the directory
 * @param {Object} componentDescriptions - Map of component names to descriptions
 * @returns {number} Number of components updated
 */
function addJSDocToDirectory(dirPath, componentDescriptions) {
  if (!fs.existsSync(dirPath)) {
    console.error(`Directory not found: ${dirPath}`);
    return 0;
  }

  const files = fs.readdirSync(dirPath);
  let updatedCount = 0;

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      updatedCount += addJSDocToDirectory(filePath, componentDescriptions);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      // Extract component name from file name
      const componentName = file.replace(/\.(tsx|jsx)$/, '');

      // Skip if component name starts with lowercase (not a component)
      if (componentName[0] === componentName[0].toLowerCase()) return;

      // Get description from map or use default
      const description = componentDescriptions[componentName] ||
        `A ${componentName} component`;

      if (addJSDocToComponent(filePath, componentName, description)) {
        updatedCount++;
      }
    }
  });

  return updatedCount;
}

// Example usage
const componentDescriptions = {
  'Button': 'A customizable button component with various variants and sizes',
  'Card': 'A versatile card component with various styling options and subcomponents',
  'Modal': 'A modal dialog component for displaying content in a layer above the page',
  // Add more component descriptions as needed
};

// Process a specific component
// addJSDocToComponent(
//   path.join(__dirname, 'src', 'components', 'ui', 'Button.tsx'),
//   'Button',
//   'A customizable button component with various variants and sizes'
// );

// Process all components in a directory
const uiComponentsDir = path.join(__dirname, 'src', 'components', 'ui');
console.log(`Adding JSDoc comments to components in ${uiComponentsDir}...`);
const updatedCount = addJSDocToDirectory(uiComponentsDir, componentDescriptions);
console.log(`Added JSDoc comments to ${updatedCount} components`);

console.log('\nNext steps:');
console.log('1. Review the added JSDoc comments and make any necessary adjustments');
console.log('2. Add more detailed descriptions and examples as needed');
console.log('3. Run the application to verify that the JSDoc comments are correct');
