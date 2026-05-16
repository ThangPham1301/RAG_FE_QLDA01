import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API_TARGET = process.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy /api/* → Django backend
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
      },
      // Proxy /media/* → Django media files (needed for PDF/DOCX iframe preview)
      '/media': {
        target: API_TARGET,
        changeOrigin: true,
        secure: false,
        // Strip X-Frame-Options header so iframe preview works
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            delete proxyRes.headers['x-frame-options']
            delete proxyRes.headers['X-Frame-Options']
          })
        },
      },
    },
  },
})
