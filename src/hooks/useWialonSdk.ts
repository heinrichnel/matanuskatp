import { useEffect, useState } from "react";

const WIALON_SDK_URL = "https://hst-api.wialon.com/wsdk/script/wialon.js";
export function useWialonSdk() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ((window as any).wialon) { setReady(true); return; }
    const script = document.createElement("script");
    script.src = WIALON_SDK_URL;
    script.async = true;
    script.onload = () => setReady(true);
    document.body.appendChild(script);
  }, []);

  return ready;
}
