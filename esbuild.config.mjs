import esbuild from 'esbuild'
import { replace } from 'esbuild-plugin-replace'

esbuild.build({
  logLevel: 'info',
  entryPoints: ['src/**/*.*'],
  sourceRoot: 'src',
  outdir: './dist',
  bundle: false,
  sourcemap: false,
  target: 'es2022',
  platform: 'node',
  format: 'esm',
  outExtension: {
    '.js': '.mjs'
  },
  resolveExtensions: ['.mts'],
  //external: ['discord.js', 'dotenv', '@google'],
  tsconfig: './tsconfig.json',
  plugins: [
    replace({
        '.mts': '.mjs'
    })
  ]
}).catch(() => process.exit(1))