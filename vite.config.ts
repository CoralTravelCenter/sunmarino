import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig(({ command }) => {
  const isMonkeyDev = command === 'serve' && process.env.SUNMAR_ENABLE_MONKEY === 'true';
  const packageJson = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.url), 'utf-8')
  ) as { version: string };
  const externalDepsEnv = process.env.SUNMAR_EXTERNAL_VENDOR_DEPS?.trim();
  const defaultExternalDeps = ['@fluejs/noscroll'];
  const externalVendorDeps = externalDepsEnv
    ? externalDepsEnv === 'true'
      ? defaultExternalDeps
      : externalDepsEnv
          .split(',')
          .map((dep) => dep.trim())
          .filter(Boolean)
    : [];
  const libraryEntry = fileURLToPath(new URL('./src/index.ts', import.meta.url));
  const bundleFileName = `sunmarino-${packageJson.version}.iife.js`;

  return {
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      open: isMonkeyDev ? '/__vite-plugin-monkey.install.user.js' : false
    },
    css: {
      preprocessorOptions: {
        scss: {},
        sass: {}
      }
    },
    plugins: [
      ...(isMonkeyDev
        ? [
            monkey({
              entry: 'src/dev/playground.ts',
              userscript: {
                name: 'Sunmarino Components (DEV)',
                namespace: 'sunmarino/components',
                match: ['https://www.sunmar.ru/monkey/*'],
                grant: []
              }
            })
          ]
        : [])
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
      target: 'es2018',
      minify: 'oxc',
      cssCodeSplit: true,
      lib: {
        entry: libraryEntry,
        name: 'SunmarinoComponents',
        formats: ['iife'],
        fileName: () => bundleFileName
      },
      rolldownOptions: {
        external: externalVendorDeps,
        output: {
          globals: {
            '@fluejs/noscroll': 'NoScroll'
          }
        }
      }
    }
  };
});
