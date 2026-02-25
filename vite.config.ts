import { fileURLToPath } from 'node:url';
import { defineConfig, type LibraryFormats } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig(({ command }) => {
  const isDev = command === 'serve';
  const libraryEntryMode = process.env.SUNMAR_LIBRARY_ENTRY?.trim() === 'manual' ? 'manual' : 'auto';
  const isManualLibraryEntry = libraryEntryMode === 'manual';
  const externalDepsEnv = process.env.SUNMAR_EXTERNAL_VENDOR_DEPS?.trim();
  const defaultExternalDeps = ['dayjs', '@fluejs/noscroll'];
  const externalVendorDeps = externalDepsEnv
    ? externalDepsEnv === 'true'
      ? defaultExternalDeps
      : externalDepsEnv
          .split(',')
          .map((dep) => dep.trim())
          .filter(Boolean)
    : [];
  const libraryEntry = fileURLToPath(
    new URL(isManualLibraryEntry ? './src/manual.ts' : './src/index.ts', import.meta.url)
  );
  const libraryFormats: LibraryFormats[] = isManualLibraryEntry ? ['es'] : ['es', 'iife'];

  return {
    resolve: {
      alias: [
        // Для dayjs используем ESM-вход и даем treeshaking удалить лишнее.
        { find: /^dayjs$/, replacement: 'dayjs/esm' }
      ]
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
      emptyOutDir: !isManualLibraryEntry,
      sourcemap: false,
      target: 'es2018',
      minify: 'esbuild',
      cssCodeSplit: true,
      lib: {
        entry: libraryEntry,
        name: 'SunmarinoComponents',
        formats: [...libraryFormats],
        fileName: (format) =>
          isManualLibraryEntry
            ? 'sunmarino.manual.es.js'
            : format === 'iife'
              ? 'sunmarino.iife.js'
              : 'sunmarino.es.js'
      },
      rollupOptions: {
        external: externalVendorDeps,
        output: {
          globals: {
            dayjs: 'dayjs',
            '@fluejs/noscroll': 'NoScroll'
          },
          compact: true,
          inlineDynamicImports: true
        }
      }
    }
  };
});
