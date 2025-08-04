import fs from "fs";
import { globSync } from "glob";

const forceImportLine = `import Card, { CardContent, CardHeader } from '../../ui/consolidated/Card';`;

// Find all TS and TSX files
const files = globSync("src/**/*.{ts,tsx}");

let updatedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  const origContent = content;

  // Replace *any* import of Card, CardContent, CardHeader from any ui/card path with the standard line
  // This covers:
  // import Card from ...
  // import { Card, CardContent } from ...
  // import Card, { CardHeader } from ...
  // import { CardHeader } from ...
  // import CardContent from ...
  // etc, with any combination
  // ...from *any* relative or alias path with /card or /Card or /cards

  // Build a regex for "import ... from '...card...';"
  const importRegex =
    /import\s+((Card(\s*,)?(\s*\{[^}]*\})?|(\{[^}]*Card[^}]*\}))[^;]*)from\s*['"][^'"]*ui\/(card|Card|cards|Cards)[^'"]*['"];?/g;

  // Remove all such lines and put the standard import ONCE at the top (if any were found)
  if (importRegex.test(content)) {
    // Remove all matching imports
    content = content.replace(importRegex, "");
    // Add the forced import at the top, after the last "import ...;" line
    if (!content.startsWith(forceImportLine)) {
      // Find last import
      const importStatements = [...content.matchAll(/^import .*;$/gm)];
      if (importStatements.length > 0) {
        const lastImport = importStatements[importStatements.length - 1];
        const insertPos = lastImport.index + lastImport[0].length;
        content =
          content.slice(0, insertPos) +
          "\n" +
          forceImportLine +
          content.slice(insertPos);
      } else {
        // No imports? Just put it at the very top
        content = forceImportLine + "\n" + content;
      }
    }
    // Clean up double blank lines
    content = content.replace(/\n{3,}/g, "\n\n");
    if (content !== origContent) {
      fs.writeFileSync(file, content, "utf8");
      console.log("Rewrote imports in", file);
      updatedFiles++;
    }
  }
}

console.log(`\n✅ Standardized Card imports in ${updatedFiles} files.`);
console.log("Every file now has:");
console.log(forceImportLine);
