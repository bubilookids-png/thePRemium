import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In dev, we proxy /api -> server to avoid CORS complexity.
// In production, set VITE_API_BASE to your server origin (services/apiClient.ts uses it).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8787'
    }
  }
});
