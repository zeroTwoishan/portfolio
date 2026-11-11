import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Fixed at build time so the prerendered HTML and the hydrating client show the same date.
  define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)) },
})
