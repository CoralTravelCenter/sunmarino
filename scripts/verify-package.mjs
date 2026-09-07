import { readFile } from 'node:fs/promises';
import { Window } from 'happy-dom';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const bundleUrl = new URL(`../dist/sunmarino-${packageJson.version}.iife.js`, import.meta.url);
const bundle = await readFile(bundleUrl, 'utf8');

if (!bundle.trim()) {
  throw new Error('IIFE bundle is empty.');
}

if (!bundle.includes('--sunmarino-') || !bundle.includes('document.createElement(`style`)')) {
  throw new Error('IIFE bundle does not contain the runtime style injection.');
}

const window = new Window();
window.eval(bundle);

if (!window.customElements.get('sunmar-modal') || !window.customElements.get('sunmar-slider')) {
  throw new Error('IIFE bundle did not register the public components.');
}

console.log(`Verified ${bundleUrl.pathname}`);
