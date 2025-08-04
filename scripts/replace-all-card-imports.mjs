import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, "..", "src");

// Covers any variant of card/cards, case, with or without quotes
const cardImportPattern = /(from\s+['"](?:.*?\/)?ui\/)(card|cards|Card|Cards)(['"])/g;

function updateCardImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let updatedContent = content.replace(
    cardImportPattern,
    (match, prefix, _cardWord, quote) => `${prefix}consolidated/Card${quote}`
  );

  // Fix unterminated imports
  updatedContent = updatedContent.replace(
    /(import\s+.*?from\s+['"][^'"]+)(\r?\n|$)/g,
    (match, p1, p2) => (/['"]$/.test(p1) ? match : `${p1}"${p2}`)
  );

  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, "utf8");
    console.log(`Updated imports in: ${filePath}`);
  }
}

function processDirectory(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(entryPath);
    } else if (
      entry.name.endsWith(".ts") ||
      entry.name.endsWith(".tsx") ||
      entry.name.endsWith(".js") ||
      entry.name.endsWith(".jsx")
    ) {
      updateCardImportsInFile(entryPath);
    }
  }
}

console.log(`Updating all Card imports in ${srcDir}...`);
processDirectory(srcDir);
console.log("Done. All card-related imports now use consolidated/Card.");
