import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,              // or 5173 if you prefer
    host: true,              // allow connections from outside container
    allowedHosts: [
      'squid-app-l3ltb.ondigitalocean.app',  // DigitalOcean ingress host
    ],
  },
})
