import React, { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { SyncProvider } from "../context/SyncContext";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders component
 *
 * This component centralizes all application-level context providers
 * to ensure they're consistently applied throughout the application.
 * Wrap the root App component with this to provide context to all components.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <SyncProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </SyncProvider>
  );
};

export default AppProviders;
