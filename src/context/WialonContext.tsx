import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";

// ---- Type Definitions ----
export interface WialonUnit {
  id: number;
  name: string;
  position: { x: number; y: number; z?: number; s?: number; t?: number };
  iconUrl?: string;
}

export interface WialonContextType {
  session: any;
  loggedIn: boolean;
  initializing: boolean;
  units: WialonUnit[];
  error: Error | null;
  login: () => void;
  logout: () => void;
  refreshUnits: () => void;
}

// ---- Context Creation ----
const WialonContext = createContext<WialonContextType | undefined>(undefined);

// ---- Custom Hook ----
export const useWialon = (): WialonContextType => {
  const context = useContext(WialonContext);
  if (!context) {
    throw new Error("useWialon must be used within a WialonProvider");
  }
  return context;
};

// ---- Provider Implementation ----
const WIALON_HOST = "https://hosting.wialon.com";
const TOKEN = import.meta.env.VITE_WIALON_SESSION_TOKEN || "";

export const WialonProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [units, setUnits] = useState<WialonUnit[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // ---- Login Handler ----
  const login = useCallback(() => {
    setInitializing(true);
    setError(null);

    if (!window.wialon || !window.wialon.core) {
      setError(new Error("Wialon SDK not loaded"));
      setInitializing(false);
      return;
    }
    const sess = window.wialon.core.Session.getInstance();
    setSession(sess);

    sess.initSession(WIALON_HOST, (code: number) => {
      if (code) {
        setError(new Error(`Wialon session init failed: ${code}`));
        setInitializing(false);
        setLoggedIn(false);
        return;
      }
      sess.loginToken(TOKEN, "", (code: number) => {
        if (code) {
          setError(new Error(`Wialon login failed: ${code}`));
          setInitializing(false);
          setLoggedIn(false);
          return;
        }
        setLoggedIn(true);
        setInitializing(false);
        refreshUnits();
      });
    });
  }, []);

  // ---- Logout Handler ----
  const logout = useCallback(() => {
    if (session) {
      session.logout(() => {
        setLoggedIn(false);
        setUnits([]);
      });
    }
  }, [session]);

  // ---- Refresh Units Handler ----
  const refreshUnits = useCallback(() => {
    if (!window.wialon || !window.wialon.core) return;
    const sess = window.wialon.core.Session.getInstance();

    sess.searchItems(
      {
        spec: {
          itemsType: "avl_unit",
          propName: "sys_name",
          propValueMask: "*",
          sortType: "sys_name",
        },
        force: 1,
        flags: 1,
        from: 0,
        to: 0,
      },
      (code: number, data: any) => {
        if (code) {
          setError(new Error(`Failed to fetch units: ${code}`));
          setUnits([]);
        } else {
          // Map to strict type
          const mapped = (data.items || []).map((item: any) => ({
            id: item.id,
            name: item.nm,
            position: item.pos,
            iconUrl: item.ic || "",
          }));
          setUnits(mapped);
        }
      }
    );
  }, []);

  // ---- Auto-login on SDK load ----
  useEffect(() => {
    if (!window.wialon || !window.wialon.core) {
      const timer = setTimeout(() => login(), 1000); // Wait/retry if SDK not loaded yet
      return () => clearTimeout(timer);
    } else {
      login();
    }
    // Only run once
    // eslint-disable-next-line
  }, []);

  // ---- Context Value ----
  const value: WialonContextType = {
    session,
    loggedIn,
    initializing,
    units,
    error,
    login,
    logout,
    refreshUnits,
  };

  return (
    <WialonContext.Provider value={value}>{children}</WialonContext.Provider>
  );
};