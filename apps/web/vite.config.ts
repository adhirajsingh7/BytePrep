import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import path from 'node:path'

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '~': path.resolve(import.meta.dirname, './src'),
      '.prisma/client/default': path.resolve(
        import.meta.dirname,
        '../../packages/db/node_modules/.prisma/client/default.js',
      ),
    },
  },
  plugins: [tailwindcss(), tanstackStart(), react(), nitro()],
})
