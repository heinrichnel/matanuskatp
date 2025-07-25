import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// LET WEL: Gebruik net hierdie file, en maak seker jy het @vitejs/plugin-react en @types/node as dev dependencies.

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Makliker imports, bv: import Foo from "@/components/Foo";
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',           // Output dir
    sourcemap: false,         // Disable sourcemaps vir prod
    chunkSizeWarningLimit: 2000, // Moenie worry as jou chunks groot raak nie
    minify: 'esbuild',        // Baie vinnig, default in Vite
    target: 'esnext',         // Moderne JS
    assetsInlineLimit: 4096,  // Images <4kb word base64 geinline
    cssCodeSplit: true,       // Beter CSS caching
    reportCompressedSize: false, // Bou vinniger
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // Slim code splitting vir vinniger laai
          if (id.includes('node_modules')) {
            // Bundle React and Ant Design together to prevent timing issues
            if (id.includes('react') || id.includes('antd') || id.includes('@ant-design')) {
              return 'react-ui';
            }
            if (id.includes('firebase')) {
              if (id.includes('firestore')) return 'firebase-firestore';
              if (id.includes('storage')) return 'firebase-storage';
              return 'firebase-core';
            }
            if (id.includes('chart') || id.includes('d3')) return 'charts';
            if (id.includes('pdf')) return 'pdf';
            if (id.includes('xlsx') || id.includes('papaparse')) return 'spreadsheet';
            if (id.includes('date-fns') || id.includes('uuid')) return 'utils';
            if (id.includes('lucide')) return 'icons';
            if (id.includes('@mui')) return 'mui';
            return 'vendor';
          }
          if (id.includes('src/pages')) return 'pages';
          if (id.includes('src/components')) return 'components';
        },
      },
    },
  },
  // OPTIONAL: Jy kan extra config bysit soos server/proxy hier as jy API calls local wil mock of proxie.
  // server: {
  //   port: 5173,
  //   open: true,
  //   proxy: {
  //     '/api': 'http://localhost:3001'
  //   }
  // }
});
