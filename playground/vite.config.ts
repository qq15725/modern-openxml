import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const resolvePath = (str: string) => resolve(__dirname, str)

export default defineConfig({
  publicDir: resolvePath('../test/fixtures'),
})
