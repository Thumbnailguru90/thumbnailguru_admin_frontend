// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from "@tailwindcss/vite";

// export default defineConfig({
//   plugins: [react(),tailwindcss()],
//   server: {
//     port: 8080,              // or 5173 if you prefer
//     host: true,              // allow connections from outside container
//     allowedHosts: [
//       'squid-app-l3ltb.ondigitalocean.app',  // DigitalOcean ingress host
//     ],
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
