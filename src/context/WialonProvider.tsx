import React, { createContext, useState, useContext, useEffect } from "react";
import { getEnvVar } from "../utils/envUtils";

export const WialonContext = createContext<any>(null);

export const WialonProvider = ({ children }: { children: React.ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [session, setSession] = useState<any>(null);
  const TOKEN = getEnvVar('VITE_WIALON_SESSION_TOKEN', '');

  useEffect(() => {
    if (!window.wialon) return;
    const sess = window.wialon.core.Session.getInstance();
    setSession(sess);
  }, []);

  const login = () => {
    if (!session) return;
    session.initSession("https://hst-api.wialon.com");
    session.loginToken(TOKEN, "", (code: number) => {
      setLoggedIn(code === 0);
    });
  };

  const logout = () => {
    if (session) session.logout(() => setLoggedIn(false));
  };

  return (
    <WialonContext.Provider value={{ session, loggedIn, login, logout }}>
      {children}
    </WialonContext.Provider>
  );
};

export const useWialon = () => useContext(WialonContext);
