// check-env-usage-full.mjs
import fs from "fs";
import path from "path";

const srcDir = path.resolve("./src");
const envFilePath = path.resolve(".env");

// 1. Extract env keys from .env file
function extractEnvKeys(envPath) {
  const content = fs.readFileSync(envPath, "utf8");
  const keys = [];
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      keys.push(trimmed.slice(0, eqIdx));
    }
  }
  return keys;
}

// 2. Scan source directory for env var usage issues
function scanSourceForEnvUsage(dir, keys) {
  const warnings = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      warnings.push(...scanSourceForEnvUsage(fullPath, keys));
      continue;
    }
    if (!/\.(js|ts|tsx|jsx)$/.test(file)) continue;
    const content = fs.readFileSync(fullPath, "utf8");

    keys.forEach((key) => {
      if (content.includes(`process.env.${key}`)) {
        warnings.push(`❌ [process.env] used for ${key} in ${fullPath}`);
      }
      if (
        content.includes(`import.meta.env['${key}']`) ||
        content.includes(`import.meta.env["${key}"]`)
      ) {
        warnings.push(`⚠️ [string literal access] for ${key} in ${fullPath}`);
      }
    });
  }
  return warnings;
}

(async () => {
  if (!fs.existsSync(envFilePath)) {
    console.error(`❌ .env file not found at: ${envFilePath}`);
    process.exit(1);
  }

  console.log("🔍 Extracting env keys from .env file...");
  const envKeys = extractEnvKeys(envFilePath);
  console.log(`🔎 Found ${envKeys.length} env keys.`);

  console.log("\n🔍 Scanning source files for improper env usage...");
  const usageWarnings = scanSourceForEnvUsage(srcDir, envKeys);

  if (usageWarnings.length === 0) {
    console.log("✅ No improper env usage found. All good!");
  } else {
    usageWarnings.forEach((warn) => console.warn(warn));
  }
  console.log("\n✅ Env usage scan done.");
})();
