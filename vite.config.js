import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080, // run Vite dev server on 8080
    host: true, // listen on all network interfaces (needed in containers)
  },
})
