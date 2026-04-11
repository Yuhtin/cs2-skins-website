import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    build: {
      outDir: path.resolve(__dirname, '../dist'),
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_DEV_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  }
})
