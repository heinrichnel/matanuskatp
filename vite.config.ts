import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "./dist/bundle-visualizer.html",
      open: true, // opens in browser after build – remove if you don’t want this
      gzipSize: true,
      brotliSize: true,
    }),
  ],
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
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "firebase-core": ["firebase/app", "firebase/auth", "firebase/firestore"],
          scanner: ["@capacitor-community/barcode-scanner", "@capacitor/core"],
          "document-tools": ["jspdf", "jspdf-autotable", "xlsx"],
          "date-utils": ["date-fns"],
          "ui-components": ["lucide-react", "@radix-ui/react-tabs", "@radix-ui/react-label"],
        },
      },
    },
  },
});
