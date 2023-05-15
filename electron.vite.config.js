import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import tailwindcss from 'tailwindcss'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import commonjsExternals from 'vite-plugin-commonjs-externals'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [tailwindcss, vue()]
  }
})
