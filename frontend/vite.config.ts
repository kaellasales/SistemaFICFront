import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@/components': '/src/components',
      '@/features': '/src/features',
      '@/shared': '/src/shared',
      '@/pages': '/src/pages',
    },
  },
  server: {
    port: 3000,
    open: false,
  },
})

