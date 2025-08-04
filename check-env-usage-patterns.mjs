import fs from "fs";
import path from "path";

const srcDir = path.resolve("./src");

// Paste your extracted env keys array here:
const envKeys = [
  'VITE_GOOGLE_OAUTH_CLIENT_ID',
  'VITE_GOOGLE_OAUTH_REDIRECT_URI',
  'VITE_GOOGLE_OAUTH_AUTH_URI',
  'VITE_GOOGLE_OAUTH_TOKEN_URI',
  'VITE_GOOGLE_OAUTH_CERT_URL',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_MEASUREMENT_ID',
  'VITE_MOBILESERVICE_APP_ID',
  'VITE_MOBILESERVICE_PACKAGE_NAME',
  'VITE_MOBILESERVICE_API_KEY',
  'SERVICE_ACCOUNT_PRIVATE_KEY',
  'SERVICE_ACCOUNT_PRIVATE_KEY_ID',
  'SERVICE_ACCOUNT_CLIENT_EMAIL',
  'SERVICE_ACCOUNT_CLIENT_ID',
  'SERVICE_ACCOUNT_AUTH_URI',
  'SERVICE_ACCOUNT_TOKEN_URI',
  'SERVICE_ACCOUNT_CERT_URL',
  'SERVICE_ACCOUNT_CLIENT_X509_CERT_URL',
  'VITE_ENV_MODE',
  'VITE_WIALON_SESSION_TOKEN',
  'VITE_WIALON_API_URL',
  'VITE_WIALON_LOGIN_URL',
  'VITE_GOOGLE_MAP_ID',
  'VITE_MAPS_SERVICE_URL',
  'VITE_Maps_ANDROID_API_KEY',
  'VITE_Maps_IFRAME_URL',
  'VITE_Maps_API_KEY',
  'VITE_Maps_JS_API_URL',
  'DEV',
  'MODE',
  'VITE_CLOUD_RUN_URL',
  'VITE_CLOUD_RUN_URL_ALTERNATIVE',
  'VITE_SAGE_API_KEY',
  'VITE_SAGE_API_ENDPOINT',
  'VITE_SAGE_COMPANY_ID',
  'VITE_SAGE_ENVIRONMENT',
  'VITE_SAGE_OAUTH_CLIENT_ID',
  'VITE_SAGE_OAUTH_CLIENT_SECRET',
  'VITE_SAGE_OAUTH_REDIRECT_URI',
  'VITE_SAGE_OAUTH_AUTH_URL',
  'VITE_SAGE_OAUTH_TOKEN_URL',
  'VITE_API_URL',
  'VITE_WIALON_TOKEN',
  'PROD'
];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      scanDir(full);
      return;
    }
    if (!/\.(js|ts|tsx|jsx)$/.test(file)) return;

    const content = fs.readFileSync(full, "utf8");
    envKeys.forEach((key) => {
      // Warn if legacy process.env used instead of import.meta.env
      if (content.includes(`process.env.${key}`)) {
        console.warn(`❌ [process.env] used for ${key} in ${full}`);
      }
      // Warn if string literal access used (discouraged but valid)
      if (
        content.includes(`import.meta.env['${key}']`) ||
        content.includes(`import.meta.env["${key}"]`)
      ) {
        console.warn(`⚠️ [string literal access] for ${key} in ${full}`);
      }
    });
  });
}

console.log("Starting env usage scan in source files...");
scanDir(srcDir);
console.log("Env usage scan done.");
