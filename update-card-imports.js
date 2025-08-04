/**
 * This script updates imports of Card components across the codebase
 * to use the new consolidated components.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Map of old imports to new imports
const importMap = {
  // Direct imports
  '@/components/ui/Card': '@/components/ui/consolidated/Card',
  '@/components/ui/card': '@/components/ui/consolidated/Card',
  '@/components/ui/card/index': '@/components/ui/consolidated/Card',

  // Relative imports (common patterns)
  '../../components/ui/Card': '../../components/ui/consolidated/Card',
  '../../components/ui/card': '../../components/ui/consolidated/Card',
  '../../components/ui/card/index': '../../components/ui/consolidated/Card',
  '../components/ui/Card': '../components/ui/consolidated/Card',
  '../components/ui/card': '../components/ui/consolidated/Card',
  '../components/ui/card/index': '../components/ui/consolidated/Card',
  '../ui/Card': '../ui/consolidated/Card',
  '../ui/card': '../ui/consolidated/Card',
  '../ui/card/index': '../ui/consolidated/Card',
  './Card': './consolidated/Card',
  './card': './consolidated/Card',
  './card/index': './consolidated/Card',
};

// Find all TypeScript and TSX files
const files = glob.sync('src/**/*.{ts,tsx}');

// Count of updated files
let updatedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  // Replace imports
  Object.entries(importMap).forEach(([oldImport, newImport]) => {
    // Match different import patterns
    const patterns = [
      // import Card from '...'
      new RegExp(`import\\s+Card\\s+from\\s+['"]${oldImport}['"]`, 'g'),

      // import { Card } from '...'
      new RegExp(`import\\s+{\\s*Card\\s*}\\s+from\\s+['"]${oldImport}['"]`, 'g'),

      // import { Card, CardContent } from '...'
      new RegExp(`import\\s+{([^}]*)Card([^}]*)}\\s+from\\s+['"]${oldImport}['"]`, 'g'),

      // import Card, { CardContent } from '...'
      new RegExp(`import\\s+Card,\\s*{([^}]*)}\\s+from\\s+['"]${oldImport}['"]`, 'g'),
    ];

    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        if (pattern.toString().includes('import\\s+Card\\s+from')) {
          // Replace default import
          content = content.replace(pattern, `import Card from '${newImport}'`);
        } else if (pattern.toString().includes('import\\s+{\\s*Card\\s*}\\s+from')) {
          // Replace named import
          content = content.replace(pattern, `import { Card } from '${newImport}'`);
        } else if (pattern.toString().includes('import\\s+{([^}]*)Card([^}]*)}\\s+from')) {
          // Replace named import with multiple components
          content = content.replace(pattern, (match, p1, p2) => {
            return `import { ${p1}Card${p2} } from '${newImport}'`;
          });
        } else if (pattern.toString().includes('import\\s+Card,\\s*{([^}]*)}\\s+from')) {
          // Replace default import with named imports
          content = content.replace(pattern, (match, p1) => {
            return `import Card, { ${p1} } from '${newImport}'`;
          });
        }
        modified = true;
      }
    });
  });

  // Save if modified
  if (modified) {
    fs.writeFileSync(file, content);
    console.log(`Updated imports in ${file}`);
    updatedFiles++;
  }
});

console.log(`\nUpdated ${updatedFiles} files.`);
console.log('\nNext steps:');
console.log('1. Run the application to verify that the imports work correctly');
console.log('2. Update the main UI barrel file (src/components/ui/index.ts) to re-export from consolidated components');
console.log('3. After all imports are updated and verified, remove the old Card components');
