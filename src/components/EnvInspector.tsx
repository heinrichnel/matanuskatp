import React from "react";

// Shows all import.meta.env vars (only in dev, for security)
export default function EnvInspector() {
  // For safety, only show in development
  if (!import.meta.env.DEV) return null;

  return (
    <div
      style={{
        background: "#222",
        color: "#b5fa00",
        padding: "1rem",
        margin: "2rem 0",
        borderRadius: 8,
        fontSize: 14,
        overflow: "auto",
        maxHeight: 320,
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 8 }}>
        Vite Environment Variables <span style={{ color: "#888" }}>(import.meta.env)</span>
      </div>
      <pre>{JSON.stringify(import.meta.env, null, 2)}</pre>
    </div>
  );
}
