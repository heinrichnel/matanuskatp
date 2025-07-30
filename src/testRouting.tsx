import React from "react";
import "./index.css";
import SidebarTester from "./SidebarTester";

// For testing our routing and sidebar system
const TestRouting: React.FC = () => {
  return <SidebarTester />;
};

export default TestRouting;

// This code only runs when file is executed directly as entry point
if (typeof document !== "undefined") {
  import("react-dom/client").then(({ createRoot }) => {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      createRoot(rootElement).render(
        <React.StrictMode>
          <TestRouting />
        </React.StrictMode>
      );
    }
  });
}
