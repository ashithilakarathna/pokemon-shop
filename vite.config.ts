import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // IPv4 loopback avoids flaky connects when Node would otherwise bind ::1 only
  // and the browser resolves localhost to 127.0.0.1 (common on macOS).
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  plugins: [react()],
})
