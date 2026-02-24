import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Auto-copy TinyMCE from node_modules to dist/tinymce at build time
    // This enables self-hosted TinyMCE without needing cloud API key or domain registration
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/tinymce/**/*',
          dest: 'tinymce'
        }
      ]
    })
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})