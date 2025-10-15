import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173, // optional, default dev port
    proxy: {
      '/api': {
        target: 'https://client-ylky.onrender.com', // your live Render backend
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: 'dist', // ensures production build goes into "dist" folder
  },
});
