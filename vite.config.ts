import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

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
      // Remove or comment out 'external' if not building a library
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "firebase-core": ["firebase/app", "firebase/auth", "firebase/firestore"],
          scanner: ["@capacitor-community/barcode-scanner", "@capacitor/core"],
          "document-tools": ["jspdf", "jspdf-autotable", "xlsx"],
          "date-utils": ["date-fns"],
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
