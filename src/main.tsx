import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SyncProvider } from './context/SyncContext';
import './index.css';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

if (!recaptchaSiteKey) {
  throw new Error("VITE_RECAPTCHA_SITE_KEY is not set in the environment variables.");
}

// Mount the app to the root div
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
        <SyncProvider>
          <App />
        </SyncProvider>
      </GoogleReCaptchaProvider>
    </StrictMode>
  );
}