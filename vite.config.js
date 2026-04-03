import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on all network interfaces
    port: 5174, // your dev server port
    allowedHosts: ['umteen-nonrecurently-genevie.ngrok-free.dev',"umteen-nonrecurently-genevie.ngrok-free.dev"], // add your ngrok host
  }
})