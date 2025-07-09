import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
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
      '@': resolve(__dirname, 'src'), // Use '@' for cleaner imports like '@/components/TripForm'
    },
  },
  define: {
    // Set Firestore emulator host for development mode
    ...(command === 'serve' && {
      'process.env.FIREBASE_FIRESTORE_EMULATOR_HOST': JSON.stringify('127.0.0.1:8081'),
    }),
  },
  optimizeDeps: {
    include: [
      'firebase/app', 
      'firebase/firestore', 
      'jspdf', 
      'jspdf-autotable', 
      'xlsx',
      'date-fns'
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
          utils: ['date-fns', 'uuid']
        },
      },
    },
  },
}));