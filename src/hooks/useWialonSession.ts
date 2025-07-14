import { useEffect, useRef, useState } from "react";
import type { WialonSession, WialonUnit, WialonDriver, WialonGeofence } from "../types/wialon";
// Ensure to use environment variables for sensitive data in production
// import { WialonSession } from "../types/wialon";
const TOKEN = import.meta.env.VITE_WIALON_TOKEN || "your_token_here";
const WIALON_API_URL = "https://hst-api.wialon.com";

export function useWialonSession(sdkReady: boolean) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    if (!sdkReady) return;
    // @ts-ignore
    const sess = window.wialon.core.Session.getInstance();
    sess.initSession(WIALON_API_URL);
    sess.loginToken(TOKEN, "", (code: number) => {
      if (code) {
        setError(window.wialon.core.Errors.getErrorText(code));
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
        sessionRef.current = sess;
      }
    });
  }, [sdkReady]);

  return { loggedIn, error, session: sessionRef.current };
}
