import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/app.ts'],
  splitting: false,
  sourcemap: true,
  clean: false, // evitar limpieza para mantener /data intacto
  target: 'esnext',
  format: ['esm']
})