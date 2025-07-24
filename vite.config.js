import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// ✅ Gebruik net EEN config object
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    minify: 'esbuild',
    target: 'esnext',
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor splitting
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            if (id.includes('firebase')) {
              if (id.includes('firestore')) return 'firebase-firestore';
              if (id.includes('storage')) return 'firebase-storage';
              return 'firebase-core';
            }
            if (id.includes('antd')) return 'antd';
            if (id.includes('chart') || id.includes('d3')) return 'charts';
            if (id.includes('pdf')) return 'pdf';
            if (id.includes('xlsx') || id.includes('papaparse')) return 'spreadsheet';
            if (id.includes('date-fns') || id.includes('uuid')) return 'utils';
            if (id.includes('lucide')) return 'icons';
            if (id.includes('@mui')) return 'mui';
            if (id.includes('@ant-design')) return 'ant-design';
            return 'vendor';
          }
          // App-specific chunking
          if (id.includes('src/pages')) return 'pages';
          if (id.includes('src/components')) return 'components';
        }
      }
    }
  }
});
