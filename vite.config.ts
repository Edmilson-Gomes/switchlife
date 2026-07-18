import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// Base path must match the GitHub Pages repo name (see docs/decisions/ADR-003).
const basePath = process.env.VITE_APP_BASE_PATH ?? '/switchlife/'

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/icon.svg'],
      manifest: {
        name: 'SwitchLife',
        short_name: 'SwitchLife',
        description:
          'Organize conhecimento, estudos, engenharia e rotina em um único espaço.',
        start_url: `${basePath}#/app/inicio`,
        scope: basePath,
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        lang: 'pt-BR',
        icons: [
          {
            src: 'icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        navigateFallback: `${basePath}index.html`,
      },
    }),
  ],
})
