import { readdirSync, statSync, readFileSync } from "fs";
import { join, extname } from "path";

// Update as needed
const SRC_DIR = "./src";
const COMPONENTS_DIR = join(SRC_DIR, "components");
// What you consider the "only valid" path for models
const VALID_MODEL_PATH = "/model"; // or "/models"

function isInvalidModelImport(importLine) {
  // Checks if the import line is importing from any model(s) folder,
  // but not from the VALID_MODEL_PATH
  const modelImport = importLine.match(/from ['"](.+?model[s]?[^'"]*)['"]/);
  if (!modelImport) return false;
  const importPath = modelImport[1];
  // Only allow from VALID_MODEL_PATH, flag anything else (relative, etc.)
  return !importPath.includes(VALID_MODEL_PATH);
}

function getAllFiles(dir, exts = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".mts", ".tsx"]) {
  let files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(extname(fullPath))) {
      files.push(fullPath);
    }
  }
  return files;
}

function checkImports() {
  let hasError = false;
  const files = getAllFiles(COMPONENTS_DIR);

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const importLines = content.match(/import\s+.*from\s+['"].*['"]/g) || [];
    for (const line of importLines) {
      if (isInvalidModelImport(line)) {
        console.error(`❌ Invalid model import in: ${file}`);
        console.error(`   → ${line}`);
        hasError = true;
      }
    }
  }

  if (hasError) {
    process.exit(1);
  } else {
    console.log("✅ All UI components use only allowed model imports.");
  }
}

checkImports();
