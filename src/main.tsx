import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SyncProvider } from './context/SyncContext';
import './index.css';

// Mount the app to the root div
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <SyncProvider>
        <App />
      </SyncProvider>
    </StrictMode>
  );
}