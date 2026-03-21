import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';
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

  return {
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        },
        sass: {
          api: 'modern-compiler'
        }
      }
    },
    plugins: [
      ...(isDev
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
      minify: 'esbuild',
      cssCodeSplit: true,
      lib: {
        entry: libraryEntry,
        name: 'SunmarinoComponents',
        formats: ['iife'],
        fileName: () => 'sunmarino.iife.js'
      },
      rollupOptions: {
        external: externalVendorDeps,
        output: {
          globals: {
            '@fluejs/noscroll': 'NoScroll'
          },
          compact: true,
          inlineDynamicImports: true
        }
      }
    }
  };
});
