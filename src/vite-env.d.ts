/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_DATABASE_URL: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string;
  readonly VITE_FIREBASE_DATABASE_ID?: string;
  readonly VITE_FIREBASE_FUNCTIONS_URL?: string;
  readonly VITE_FIREBASE_FUNCTIONS_REGION?: string;
  readonly VITE_FIREBASE_FUNCTIONS_EMULATOR_HOST?: string;
  readonly VITE_FIREBASE_FUNCTIONS_EMULATOR_PORT?: string;
  readonly VITE_FIREBASE_FUNCTIONS_EMULATOR_REGION?: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_GOOGLE_MAPS_IFRAME_URL?: string;
  readonly VITE_MAPS_SERVICE_URL?: string;
  readonly VITE_WIALON_SESSION_TOKEN?: string;
  readonly VITE_WIALON_HOST_AUTOLOGIN_URL?: string;
  
  // Netlify specific variables
  readonly VITE_NETLIFY_PROJECT_NAME?: string;
  readonly VITE_NETLIFY_OWNER?: string;
  readonly VITE_NETLIFY_SITE_ID?: string;
  
  // Vercel specific variables
  readonly VERCEL?: string;
  readonly VERCEL_ENV?: string;
  readonly VERCEL_URL?: string;
  readonly VERCEL_REGION?: string;
  readonly VERCEL_PROJECT_ID?: string;

  readonly [key: string]: string | undefined; // Laat custom vars toe
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
