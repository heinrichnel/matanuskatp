/// <reference types="vite/client" />

// Add type definitions for Vite environment variables
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_DATABASE_URL: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_FIREBASE_DATABASE_ID: string;
  
  readonly VITE_WIALON_SESSION_TOKEN: string;
  readonly VITE_WIALON_API_URL: string;
  readonly VITE_WIALON_LOGIN_URL: string;
  
  readonly VITE_MAPS_API_KEY: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_MAPS_SERVICE_URL: string;
  
  readonly VITE_CLOUD_RUN_URL: string;
  readonly VITE_CLOUD_RUN_URL_ALTERNATIVE: string;
  readonly VITE_GCP_CONSOLE_URL: string;
  
  readonly VITE_ENV_MODE: string;
  readonly VITE_USE_EMULATOR: string;
  readonly VITE_EMULATOR_HOST: string;
  readonly VITE_FIRESTORE_EMULATOR_PORT: string;
  readonly VITE_STORAGE_EMULATOR_PORT: string;
  
  readonly VITE_NETLIFY_PROJECT_NAME: string;
  readonly VITE_NETLIFY_OWNER: string;
  readonly VITE_NETLIFY_SITE_ID: string;
  readonly VITE_BUILD_HOOK: string;
  readonly VITE_PREVIEW_SERVER_HOOK: string;
  readonly VITE_COLLABORATION_TOOLS_URL: string;
  readonly VITE_CONTAINER_IMAGE: string;
  readonly VITE_APP_BASE_URL: string;
  
  // Add any other env vars used in your application
  readonly [key: string]: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}