import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore'], // ✅ help Vite pre-bundle dit
    exclude: ['lucide-react'],
  },
});
