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
    },
  },
  optimizeDeps: {
    include: ["firebase/app", "firebase/firestore", "jspdf", "jspdf-autotable", "xlsx", "date-fns"],
    exclude: ["lucide-react"],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    chunkSizeWarningLimit: 1600,
    // Ensure the output directory is emptied before building
    emptyOutDir: true,
    // Create output folder structure based on src
    assetsDir: "assets",
    rollupOptions: {
      output: {
        // Adjust chunk size warning limit
        manualChunks: (id) => {
          // Group React and React DOM into vendor chunk
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor";
          }
          // Group Firebase modules
          if (id.includes("node_modules/firebase")) {
            return "firebase";
          }
          // Create a dedicated src folder in the output to mirror source structure
          if (id.includes("/src/")) {
            return "src";
          }
        },
      },
    },
  },
});
