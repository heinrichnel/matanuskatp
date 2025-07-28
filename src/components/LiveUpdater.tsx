import { useEffect } from "react";
import { useWialon } from "../context/WialonContext";

export const LiveUpdater = ({ interval = 60000 }) => {
  const { refreshUnits } = useWialon();

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshUnits();
    }, interval); // Default: every 60 seconds
    
    return () => clearInterval(intervalId);
  }, [refreshUnits, interval]);

  return null; // This is a utility component with no UI
};

export default LiveUpdater;