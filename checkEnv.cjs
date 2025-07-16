// checkEnv.js
require('dotenv').config(); // Load variables from .env

console.log('✅ Loaded env variables:\n');

const requiredVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_GOOGLE_MAPS_API_KEY',
  'VITE_WEBBOOK_TRIPS_URL',
  'VITE_WIALON_SESSION_TOKEN',
];

let hasMissing = false;

for (const key of requiredVars) {
  const value = process.env[key];
  if (!value) {
    console.log(`❌ ${key} is MISSING`);
    hasMissing = true;
  } else {
    console.log(`✅ ${key} = ${value}`);
  }
}

if (hasMissing) {
  console.log('\n❗ One or more required environment variables are missing from .env\n');
  process.exit(1);
} else {
  console.log('\n🎉 All required environment variables are set correctly.\n');
}
