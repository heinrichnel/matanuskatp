import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
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
      '@': path.resolve(__dirname, 'src'), // 👈 Gebruik '@' vir skoner imports soos '@/components/TripForm'
    },
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore'],
    exclude: ['lucide-react'],
  },
});
