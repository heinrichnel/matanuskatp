import fs from "fs";
import path from "path";

const envFilePath = path.resolve(".env");
const srcDir = path.resolve("./src");

// Step 1: Extract VITE_ keys from .env file
function extractEnvKeys(envPath) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const keyRegex = /^([A-Z0-9_]+)=/gm;
  const keys = new Set();
  let match;
  while ((match = keyRegex.exec(envContent)) !== null) {
    const key = match[1];
    if (
      key.startsWith("VITE_") ||
      key.startsWith("SERVICE_ACCOUNT") ||
      ["DEV", "MODE", "PROD"].includes(key)
    ) {
      keys.add(key);
    }
  }
  return Array.from(keys);
}

// Step 2 & 3: Scan source code for env usage patterns
function scanDirForEnvUsage(dir, envKeys) {
  let improperUsageFound = false;

  function scan(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        scan(full);
        return;
      }
      if (!/\.(js|ts|tsx|jsx)$/.test(file)) return;
      const content = fs.readFileSync(full, "utf8");

      envKeys.forEach((key) => {
        if (content.includes(`process.env.${key}`)) {
          improperUsageFound = true;
          console.warn(`❌ [process.env] used for ${key} in ${full}`);
        }
        if (
          content.includes(`import.meta.env['${key}']`) ||
          content.includes(`import.meta.env["${key}"]`)
        ) {
          console.warn(`⚠️ [string literal access] used for ${key} in ${full}`);
        }
      });
    });
  }

  scan(dir);

  if (!improperUsageFound) {
    console.log("✅ No improper env usage found. All good!");
  }
}

// Main execution
const envKeys = extractEnvKeys(envFilePath);
console.log("🔎 Extracted env keys from .env:", envKeys.length);
scanDirForEnvUsage(srcDir, envKeys);
console.log("Env usage scan done.");
