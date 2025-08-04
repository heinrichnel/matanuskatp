// check-env-values.mjs
import fs from "fs";

// Read your .env file (in the root directory)
const envFile = ".env";
if (!fs.existsSync(envFile)) {
  console.error(`❌ .env file not found in this directory!`);
  process.exit(1);
}
const content = fs.readFileSync(envFile, "utf8");

// Parse all .env key-value pairs, ignoring comments and empty lines
const envVars = Object.fromEntries(
  content
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .map((line) => line.split("="))
    .map(([k, ...v]) => [k.trim(), v.join("=").trim()])
);

// List of checks (add more as needed!)
const checks = [
  { key: "VITE_FIREBASE_API_KEY", min: 30, mustStart: "AIza" },
  { key: "VITE_GOOGLE_MAPS_API_KEY", min: 30, mustStart: "AIza" },
  { key: "VITE_GOOGLE_OAUTH_CLIENT_ID", mustInclude: ".apps.googleusercontent.com" },
  { key: "VITE_GOOGLE_OAUTH_REDIRECT_URI", mustInclude: "http" },
  { key: "VITE_FIREBASE_PROJECT_ID", min: 6 },
  { key: "VITE_GOOGLE_MAPS_IFRAME_URL", mustInclude: "https://www.google.com/maps" },
  { key: "SERVICE_ACCOUNT_PRIVATE_KEY", min: 20 }, // usually much longer
  { key: "SERVICE_ACCOUNT_CLIENT_EMAIL", mustInclude: "@" },
  { key: "VITE_FIREBASE_AUTH_DOMAIN", mustInclude: "firebaseapp.com" },
  { key: "VITE_FIREBASE_STORAGE_BUCKET", mustInclude: "appspot.com" },
  { key: "VITE_FIREBASE_DATABASE_URL", mustInclude: "firebaseio.com" },
  { key: "VITE_WIALON_API_URL", mustInclude: "http" },
  { key: "VITE_GOOGLE_MAPS_JS_API_URL", mustInclude: "maps.googleapis.com" },
  // Add more rules for your needs here
];

let failCount = 0;
console.log("\n[ENV VALUE CHECK]");
console.log("-------------------------");

for (const { key, min, mustStart, mustInclude } of checks) {
  const value = envVars[key];
  if (!value) {
    console.log(`❌ MISSING: ${key}`);
    failCount++;
    continue;
  }
  if (min && value.length < min) {
    console.log(`❌ TOO SHORT: ${key} (${value.length} chars)`);
    failCount++;
    continue;
  }
  if (mustStart && !value.startsWith(mustStart)) {
    console.log(`❌ BAD PREFIX: ${key} (does not start with "${mustStart}")`);
    failCount++;
    continue;
  }
  if (mustInclude && !value.includes(mustInclude)) {
    console.log(`❌ BAD CONTENT: ${key} (missing "${mustInclude}")`);
    failCount++;
    continue;
  }
  console.log(`✅ ${key}`);
}

if (failCount === 0) {
  console.log("\n[SUCCESS] All checked env vars look correct (format-wise)!");
} else {
  console.log(`\n[FAIL] ${failCount} env var(s) look invalid or missing!`);
}
