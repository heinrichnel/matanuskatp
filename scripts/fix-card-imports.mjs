/**
 * Bulk replaces Card import paths with cards (plural).
 * Run from project root: node scripts/fix-card-imports.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, "..", "src");

const importPatterns = [
  /from\s+["'](\.{1,2}\/)+ui\/Card["']/g,
  /from\s+["'](\.{1,2}\/)+ui\/Card\/index["']/g,
  /from\s+["'](\.{1,2}\/)+ui\/card["']/g,
  /from\s+["'](\.{1,2}\/)+ui\/card\/index["']/g,
  /from\s+["']@\/components\/ui\/Card["']/g,
  /from\s+["']@\/components\/ui\/Card\/index["']/g,
  /from\s+["']@\/components\/ui\/card["']/g,
  /from\s+["']@\/components\/ui\/card\/index["']/g,
  /from\s+["']components\/ui\/Card["']/g,
  /from\s+["']components\/ui\/Card\/index["']/g,
  /from\s+["']components\/ui\/card["']/g,
  /from\s+["']components\/ui\/card\/index["']/g,
  /from\s+["']\.\/Card["']/g,
  /from\s+["']\.\/Card\/index["']/g,
  /from\s+["']\.\/card["']/g,
  /from\s+["']\.\/card\/index["']/g,
  /from\s+["']\.{1,2}\/ui\/Card["']/g,
  /from\s+["']\.{1,2}\/ui\/card["']/g,
  /from\s+["']\.{1,2}\/ui\/Card\/index["']/g,
  /from\s+["']\.{1,2}\/ui\/card\/index["']/g,
];

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let originalContent = content;

  for (const pattern of importPatterns) {
    content = content.replace(pattern, (match) =>
      match
        .replace(/\/Card(\/index)?["']/, '/cards$1"')
        .replace(/\/card(\/index)?["']/, '/cards$1"')
    );
  }

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

console.log(`Bulk replacing 'Card' import paths with 'cards' in ${srcDir}...`);
processDirectory(srcDir);
console.log(
  "All done. Review your imports and ensure the physical files/folders match the new naming."
);
