import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

const { version, builtAt } = JSON.parse(readFileSync(new URL('./build-version.json', import.meta.url), 'utf8'))
const buildVersion = `${version} | ${builtAt}`

export default defineConfig({
  plugins: [react()],
  base: '/FWAReportsNew/',
  define: {
    'import.meta.env.VITE_BUILD_VERSION': JSON.stringify(buildVersion)
  }
})
