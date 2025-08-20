import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'squid-app-l3ltb.ondigitalocean.app', // 👈 add your host here
    ],
  },
})