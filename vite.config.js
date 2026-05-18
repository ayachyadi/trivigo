import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'TriviGo',
        short_name: 'TriviGo',
        description: 'TriviGo Quiz Game - Knowledge is Power',
        theme_color: '#8C5221',
        background_color: '#FAFAFA',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'favicon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'favicon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  // === PENGATURAN BARU UNTUK MENGHILANGKAN WARNING ===
  build: {
    chunkSizeWarningLimit: 1600, // Menaikkan batas peringatan menjadi 1600 KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Memisahkan Firebase dan library lain ke dalam file "vendor"
          // agar website TriviGo memuat lebih cepat di HP pemain
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})
