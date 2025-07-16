import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { validateEnv } from './plugins/validateEnv.ts';

// Define required env vars
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_GOOGLE_MAPS_API_KEY',
  'VITE_WEBBOOK_TRIPS_URL',
  'VITE_WIALON_SESSION_TOKEN',
];

export default defineConfig({
  plugins: [
    react(),
    validateEnv(requiredEnvVars),
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://us-central1-mat1-9e6b3.cloudfunctions.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/firestore',
      'jspdf',
      'jspdf-autotable',
      'xlsx',
      'date-fns',
    ],
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/storage'],
          charts: ['recharts', 'd3'],
          pdf: ['jspdf', 'jspdf-autotable', '@react-pdf/renderer'],
          spreadsheet: ['xlsx', 'papaparse'],
          utils: ['date-fns', 'uuid'],
        },
      },
    },
  },
});
