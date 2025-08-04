import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "https://us-central1-mat1-9e6b3.cloudfunctions.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      // Handle case sensitivity for TyreManagement/Tyremanagement
      "@/components/TyreManagement": resolve(__dirname, "src/components/Tyremanagement"),
    },
  },
  optimizeDeps: {
    include: [
      "firebase/app",
      "firebase/firestore",
      "firebase/auth",
      "jspdf",
      "jspdf-autotable",
      "xlsx",
      "date-fns",
      "@capacitor-community/barcode-scanner",
    ],
    exclude: ["lucide-react"],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    chunkSizeWarningLimit: 1800,
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      external: ["/src/components/TyreManagement/TyreReports"],
      output: {
        manualChunks: {
          // Core vendor libraries
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // Firebase modules - grouped to prevent mixed import issues
          "firebase-core": ["firebase/app", "firebase/auth", "firebase/firestore"],
          // Scanning/barcode functionality
          scanner: ["@capacitor-community/barcode-scanner", "@capacitor/core"],
          // Document generation libraries
          "document-tools": ["jspdf", "jspdf-autotable", "xlsx"],
          // Date handling
          "date-utils": ["date-fns"],
          // UI components and icons
          "ui-components": [
            "lucide-react",
            "tailwindcss",
            "@radix-ui/react-tabs",
            "@radix-ui/react-label",
          ],
        },
      },
    },
  },
});
