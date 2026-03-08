import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy TMDB calls through the Express backend (avoids browser ERR_DNS_NO_MATCHING_SUPPORTED_ALPN)
      // Backend forces IPv4 and uses Bearer token auth
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
