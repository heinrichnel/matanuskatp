// test-all-env-vars.mjs
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const envPath = path.resolve(process.cwd(), ".env");

// ---- Paste all your required env keys here ----
const REQUIRED_VARS = [
  // Google OAuth
  "VITE_GOOGLE_OAUTH_CLIENT_ID",
  "VITE_GOOGLE_OAUTH_REDIRECT_URI",
  "VITE_GOOGLE_OAUTH_AUTH_URI",
  "VITE_GOOGLE_OAUTH_TOKEN_URI",
  "VITE_GOOGLE_OAUTH_CERT_URL",

  // Firebase (Public)
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_DATABASE_URL",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
  "VITE_FIREBASE_MEASUREMENT_ID",
  "VITE_MOBILESERVICE_APP_ID",
  "VITE_MOBILESERVICE_PACKAGE_NAME",
  "VITE_MOBILESERVICE_API_KEY",

  // Firebase Service Account (server only)
  "SERVICE_ACCOUNT_PRIVATE_KEY",
  "SERVICE_ACCOUNT_PRIVATE_KEY_ID",
  "SERVICE_ACCOUNT_CLIENT_EMAIL",
  "SERVICE_ACCOUNT_CLIENT_ID",
  "SERVICE_ACCOUNT_AUTH_URI",
  "SERVICE_ACCOUNT_TOKEN_URI",
  "SERVICE_ACCOUNT_CERT_URL",
  "SERVICE_ACCOUNT_CLIENT_X509_CERT_URL",

  // Environment mode
  "VITE_ENV_MODE",

  // WIALON GPS/Telematics
  "VITE_WIALON_SESSION_TOKEN",
  "VITE_WIALON_API_URL",
  "VITE_WIALON_LOGIN_URL",

  // Google Maps & Related
  "VITE_GOOGLE_MAP_ID",
  "VITE_MAPS_SERVICE_URL",
  "VITE_GOOGLE_MAPS_ANDROID_API_KEY",
  "VITE_GOOGLE_MAPS_IFRAME_URL",
  "VITE_GOOGLE_MAPS_API_KEY",
  "VITE_GOOGLE_MAPS_JS_API_URL",
];
// -----------------------------------------------

// --- Load .env file ---
if (!fs.existsSync(envPath)) {
  console.error(`[ERROR] .env file not found at ${envPath}`);
  process.exit(1);
}
const envVars = dotenv.parse(fs.readFileSync(envPath));

// --- Check variables ---
console.log("\n[ENV VARS CHECK]\n-------------------------");
let missing = [];
let empty = [];

for (const varName of REQUIRED_VARS) {
  if (!(varName in envVars)) {
    console.error(`❌ Missing: ${varName}`);
    missing.push(varName);
  } else if (!envVars[varName] || envVars[varName].trim() === "") {
    console.error(`⚠️  Empty:   ${varName}`);
    empty.push(varName);
  } else {
    console.log(`✅ Present:  ${varName}`);
  }
}

if (missing.length || empty.length) {
  console.error(`\n[FAIL] ${missing.length} missing, ${empty.length} empty variable(s).\n`);
  if (missing.length) console.error("Missing:", missing.join(", "));
  if (empty.length) console.error("Empty:  ", empty.join(", "));
  process.exit(2);
} else {
  console.log("\n[SUCCESS] All required env vars are present and non-empty!\n");
}
