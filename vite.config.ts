import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitroV2Plugin } from '@tanstack/nitro-v2-vite-plugin'

export default ({ mode }: ConfigEnv) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return defineConfig({
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      tanstackStart(),
      nitroV2Plugin({
        preset: 'vercel',
      }),
      viteReact(),
    ],
  })
}
