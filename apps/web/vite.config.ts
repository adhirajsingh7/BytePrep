import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import path from 'node:path'
import { createRequire } from 'node:module'

const dbRequire = createRequire(
  path.resolve(import.meta.dirname, '../../packages/db/package.json'),
)
const prismaClientDir = path.dirname(dbRequire.resolve('@prisma/client'))
const prismaDefaultClient = path.join(
  prismaClientDir,
  '../../.prisma/client/default.js',
)

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '~': path.resolve(import.meta.dirname, './src'),
      '.prisma/client/default': prismaDefaultClient,
    },
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    react(),
    nitro({
      preset: process.env.VERCEL ? 'vercel' : undefined,
      externals: {
        inline: [],
        external: ['@prisma/client', '.prisma/client'],
      },
    }),
  ],
})
