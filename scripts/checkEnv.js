// checkEnv.js
require('dotenv').config(); // Load variables from .env

console.log('✅ Loaded env variables:\n');

console.log('🔥 VITE_FIREBASE_API_KEY:', process.env.VITE_FIREBASE_API_KEY || '[MISSING]');
console.log('🌍 VITE_GOOGLE_MAPS_API_KEY:', process.env.VITE_GOOGLE_MAPS_API_KEY || '[MISSING]');
console.log('📡 VITE_WIALON_SESSION_TOKEN:', process.env.VITE_WIALON_SESSION_TOKEN || '[MISSING]');
console.log('📥 VITE_WEBBOOK_TRIPS_URL:', process.env.VITE_WEBBOOK_TRIPS_URL || '[MISSING]');
