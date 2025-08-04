// test-env-import-usage.mjs
// Scan for all import.meta.env.VAR_NAME usage and compare with .env

import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const envPath = path.join(rootDir, ".env");
const srcDir = path.join(rootDir, "src");

// Read .env and get all declared keys
function getEnvKeys(envPath) {
  const envFile = fs.readFileSync(envPath, "utf8");
  return envFile
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => line.split("=")[0].trim());
}

// Recursively walk files under /src and collect all .ts, .tsx, .js, .jsx
function walkFiles(dir, exts = [".ts", ".tsx", ".js", ".jsx"]) {
  let results = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkFiles(fullPath, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  });
  return results;
}

// Find all import.meta.env usages
function extractEnvUsages(files) {
  const regex = /import\.meta\.env\.([A-Z0-9_]+)/g;
  const found = new Set();
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    let match;
    while ((match = regex.exec(content))) {
      found.add(match[1]);
    }
  }
  return Array.from(found);
}

// --- MAIN ---
const envKeys = getEnvKeys(envPath);
const files = walkFiles(srcDir);
const usedEnvKeys = extractEnvUsages(files);

console.log("[ENV IMPORT USAGE AUDIT]");
console.log("--------------------------");

// 1. Check for used env vars NOT in .env (possible typo)
const usedNotDeclared = usedEnvKeys.filter((k) => !envKeys.includes(k));
if (usedNotDeclared.length) {
  console.log("❌ Used in code, but NOT declared in .env:");
  usedNotDeclared.forEach((k) => console.log(`  - ${k}`));
} else {
  console.log("✅ All used env vars are declared in .env");
}

// 2. Declared but not used anywhere
const declaredNotUsed = envKeys.filter((k) => !usedEnvKeys.includes(k));
if (declaredNotUsed.length) {
  console.log("\n⚠️ Declared in .env, but NOT used in code:");
  declaredNotUsed.forEach((k) => console.log(`  - ${k}`));
} else {
  console.log("\n✅ All declared env vars are used in code");
}

// 3. Print summary
console.log("\n[SUMMARY]");
console.log("Env vars declared in .env:", envKeys.length);
console.log("Env vars used in code   :", usedEnvKeys.length);
console.log("Missing in .env         :", usedNotDeclared.length);
console.log("Unused in code          :", declaredNotUsed.length);

console.log("\nDone.");
