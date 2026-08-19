import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Two build targets from one source:
//   `npm run build`  -> normal multi-asset build for Vercel / any static host
//   `npm run build:single` -> one self-contained index.html (no external assets
//   except the Google Fonts stylesheet) for publishing as a shareable artifact.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build: {
    target: 'es2020',
    cssCodeSplit: mode !== 'single',
    assetsInlineLimit: mode === 'single' ? 100_000_000 : 4096,
  },
}))
