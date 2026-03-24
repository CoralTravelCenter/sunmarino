import { readFile, writeFile } from 'node:fs/promises';

const packageJsonPath = new URL('../package.json', import.meta.url);
const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'));
const bundleFileName = `sunmarino-${packageJson.version}.iife.js`;
const bundlePath = `./dist/${bundleFileName}`;

packageJson.main = bundlePath;
packageJson.types = './dist/types/exports.d.ts';

if (!packageJson.exports || typeof packageJson.exports !== 'object') {
  packageJson.exports = {};
}

if (!packageJson.exports['.'] || typeof packageJson.exports['.'] !== 'object') {
  packageJson.exports['.'] = {};
}

packageJson.exports['.'].types = './dist/types/exports.d.ts';
packageJson.exports['.'].default = bundlePath;
packageJson.exports['./styles.css'] = './dist/index.css';
packageJson.exports['./package.json'] = './package.json';

packageJson.sideEffects = [
  bundlePath,
  './dist/index.css'
];

await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
