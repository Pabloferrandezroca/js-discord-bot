import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/app.mts'],
  splitting: false,
  sourcemap: true,
  clean: false, // evitar limpieza para mantener /data intacto
  target: 'esnext',
  format: ['esm']
})