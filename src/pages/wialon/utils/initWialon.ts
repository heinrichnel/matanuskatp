/**
 * Wialon initialization utility
 * 
 * This file provides functions to initialize the Wialon SDK and
 * manage environment variables for Wialon integration.
 */
import { initWialonEnv, validateWialonEnv } from "./wialonEnvUtils";
import { WIALON_SDK_URL } from "./wialonConfig";

// Initialize Wialon environment variables
export const initializeWialonEnvironment = () => {
  const config = initWialonEnv();
  const { valid, issues } = validateWialonEnv();
  
  if (!valid) {
    console.warn("Wialon environment validation failed:", issues);
  }
  
  return { config, valid, issues };
};

// Load the Wialon SDK script
export const loadWialonSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Skip if already loaded
    if (window.wialon) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = WIALON_SDK_URL;
    script.async = true;
    
    script.onload = () => {
      console.log("Wialon SDK loaded successfully");
      resolve();
    };
    
    script.onerror = (err) => {
      console.error("Failed to load Wialon SDK:", err);
      reject(new Error('Failed to load Wialon SDK'));
    };
    
    document.body.appendChild(script);
  });
};

// Initialize Wialon with token
export const initializeWialonWithToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!window.wialon) {
      reject(new Error('Wialon SDK not loaded'));
      return;
    }
    
    const session = window.wialon.core.Session.getInstance();
    
    session.initSession("https://hst-api.wialon.com");
    
    session.loginToken(token, "", function(code) {
      if (code) {
        reject(new Error('Wialon login failed, code: ' + code));
      } else {
        resolve(session.getCurrUser());
      }
    });
  });
};

// Initialize Wialon complete flow
export const initializeWialonComplete = async () => {
  const { config, valid } = initializeWialonEnvironment();
  
  if (!valid) {
    return { success: false, error: "Invalid Wialon environment configuration" };
  }
  
  try {
    await loadWialonSDK();
    const user = await initializeWialonWithToken(config.sessionToken);
    return { success: true, user };
  } catch (error) {
    return { success: false, error };
  }
};
