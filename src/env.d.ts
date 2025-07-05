/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_DATABASE_URL: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string; // Optional as measurement is not always used
  readonly VITE_RECAPTCHA_KEY: string;
  readonly VITE_SDK_SERVICE_ACCOUNT_KEY: string;
  readonly VITE_FIREBASE_CLOUD_MESSAGING_API: string;
  readonly VITE_FIREBASE_SENDER_ID: string;
  readonly VITE_FIREBASE_SERVICE_ACCOUNT: string;
  readonly VITE_FIREBASE_SERVICE_ACCOUNT_ID: string;
  readonly VITE_FIREBASE_IMPORTER_SERVICE_ACCOUNT: string;
  readonly VITE_FIREBASE_IMPORTER_SERVICE_ACCOUNT_ID: string;
  readonly VITE_FIREBASE_IMPORTER_KEY: string;
  readonly VITE_FIREBASE_IMAGE_PROCESSING_SERVICE_ACCOUNT: string;
  readonly VITE_FIREBASE_IMAGE_PROCESSING_KEY: string;
  readonly VITE_FIREBASE_USER_DOCUMENT_SERVICE_ACCOUNT: string;
  readonly VITE_FIREBASE_USER_DOCUMENT_SERVICE_ACCOUNT_ID: string;
  readonly VITE_FIREBASE_USER_DOCUMENT_KEY: string;
  readonly VITE_FIREBASE_COMPUTE_SERVICE_ACCOUNT: string;
  readonly VITE_FIREBASE_COMPUTE_SERVICE_ACCOUNT_ID: string;
  readonly VITE_FIREBASE_COMPUTE_KEY: string;
  readonly VITE_FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT: string;
  readonly VITE_FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}