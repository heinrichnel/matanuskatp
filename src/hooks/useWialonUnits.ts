// src/hooks/useWialonUnits.ts

import { useEffect, useState } from "react";

// These types can be expanded as needed for your application
export interface WialonUnitData {
  id: number;
  name: string;
  pos?: { x: number; y: number; s: number; t: number };
}

const WIALON_API_URL = "https://hst-api.wialon.com";
const TOKEN = "c1099bc37c906fd0832d8e783b60ae0d462BADEC45A6E5503B1BEADDE71E232800E9C406"; // Put in .env for production

/**
 * useWialonUnits
 * Loads the Wialon SDK, logs in, and retrieves all AVL units with last known positions.
 * 
 * @param sdkReady boolean - set true if you know the SDK is loaded, or auto-load
 */
export function useWialonUnits(sdkReady: boolean = true) {
  const [units, setUnits] = useState<WialonUnitData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Optional: Only log in if not already logged in
  function isLoggedIn(sess: any) {
    try {
      const user = sess.getCurrUser?.();
      return Boolean(user && user.getName && user.getName());
    } catch {
      return false;
    }
  }

  useEffect(() => {
    if (!sdkReady) return;

    setLoading(true);
    setError(null);

    // @ts-ignore
    const sess = window.wialon?.core?.Session.getInstance();
    if (!sess) {
      setError("Wialon SDK not loaded");
      setLoading(false);
      return;
    }

    function fetchUnits() {
      const flags =
        window.wialon.item.Item.dataFlag.base |
        window.wialon.item.Unit.dataFlag.lastMessage;

      sess.loadLibrary("itemIcon");
      sess.updateDataFlags(
        [{ type: "type", data: "avl_unit", flags, mode: 0 }],
        (code2: number) => {
          if (code2) {
            setError(window.wialon.core.Errors.getErrorText(code2));
            setLoading(false);
            return;
          }
          const arr = sess.getItems("avl_unit") as any[];
          setUnits(
            (arr || []).map((u) => ({
              id: u.getId(),
              name: u.getName(),
              pos: u.getPosition ? u.getPosition() : undefined,
            }))
          );
          setLoading(false);
        }
      );
    }

    // If not logged in, login and then fetch
    if (!isLoggedIn(sess)) {
      sess.initSession(WIALON_API_URL);
      sess.loginToken(TOKEN, "", (code: number) => {
        if (code) {
          setError(window.wialon.core.Errors.getErrorText(code));
          setLoading(false);
          return;
        }
        fetchUnits();
      });
    } else {
      fetchUnits();
    }
  }, [sdkReady]);

  // You may want to add a "refresh" function for reloading the units
  return { units, loading, error };
}

