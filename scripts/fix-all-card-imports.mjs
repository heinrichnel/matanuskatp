import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, "..", "src");

// Regex covers single and double quotes, and `/Card` or `/card` at any level
const cardImportPattern = /(from\s+['"](?:.*?\/)?ui\/)card(['"])/gi;

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let originalContent = content;

  // Fix "Card" to "cards" in import paths, and fix unterminated quotes
  content = content.replace(cardImportPattern, (match, prefix, quote) => {
    return `${prefix}cards${quote}`;
  });

  // Also check for unterminated import lines and fix them
  content = content.replace(/(import\s+.*?from\s+['"][^'"]+)(\r?\n|$)/g, (match, p1, p2) => {
    // If the line doesn't end with a closing quote, add it
    if (!/['"]$/.test(p1)) return `${p1}"${p2}`;
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated imports in: ${filePath}`);
    return true;
  }
  return false;
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(entryPath);
    } else if (
      entry.name.endsWith(".ts") ||
      entry.name.endsWith(".tsx") ||
      entry.name.endsWith(".js") ||
      entry.name.endsWith(".jsx")
    ) {
      updateImportsInFile(entryPath);
    }
  }
}

console.log(`Fixing all ui/card imports to ui/cards in ${srcDir}...`);
processDirectory(srcDir);
console.log(
  'All done. Review your imports, and ensure your folder/file structure uses "cards" (plural).'
);
